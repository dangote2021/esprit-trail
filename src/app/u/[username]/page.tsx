import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MESSAGE_USERS } from "@/lib/data/messages";
import UserPublicProfile, { type RealProfileData } from "./UserPublicProfile";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username} · Profil`,
    description: `Profil public de @${params.username} sur Esprit Trail`,
  };
}

// ====== Chargement du profil réel depuis Supabase ======
// Hardening 03/09/26 : avant, cette page ne faisait AUCUNE requête Supabase
// (100% mock). N'importe quel username, même inexistant, affichait une fausse
// page "profil pas encore rempli". Maintenant :
//  1) on cherche un vrai profil Supabase par username (lecture publique, RLS
//     "profiles_read_all" déjà en place) + ses stats (runs, courses soumises)
//  2) si rien, on retombe sur les personas de démo (MESSAGE_USERS) pour ne
//     pas casser le parcours démo/messagerie
//  3) si vraiment rien nulle part → 404 (au lieu d'une fausse page)
async function loadRealProfile(username: string): Promise<RealProfileData | null> {
  try {
    const supabase = await getSupabaseServerClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, username, display_name, avatar, xp, streak, itra_performance_index, utmb_index",
      )
      .eq("username", username)
      .maybeSingle();

    if (!profile) return null;

    const since = new Date();
    since.setDate(since.getDate() - 365);

    const [{ data: runs }, { data: races }, { data: offRaces }, { data: completedUq }] =
      await Promise.all([
        supabase
          .from("runs")
          .select("distance, elevation")
          .eq("user_id", profile.id)
          .gte("date", since.toISOString()),
        supabase
          .from("user_races")
          .select("id, name, distance, elevation, location")
          .eq("submitter_id", profile.id)
          .eq("status", "published"),
        supabase
          .from("user_off_races")
          .select("id, name, distance, elevation, location")
          .eq("submitter_id", profile.id)
          .eq("status", "published"),
        // Hardening 04/09/26 : rapport de test communauté — quest_definitions
        // et user_quests étaient seedés en base (catalogue + vraie progression
        // calculée depuis les runs) mais jamais lus nulle part dans l'app. On
        // affiche ici les quêtes réellement complétées (pas expirées) sur le
        // profil public — lecture publique (RLS déjà en place sur ces deux
        // tables). Requête à plat + jointure en mémoire ci-dessous, comme le
        // reste de cette page (pas d'embed FK PostgREST utilisé ailleurs dans
        // le repo — on reste sur le pattern éprouvé).
        supabase
          .from("user_quests")
          .select("quest_id, completed_at")
          .eq("user_id", profile.id)
          .not("completed_at", "is", null)
          .gte("expires_at", new Date().toISOString())
          .order("completed_at", { ascending: false })
          .limit(6),
      ]);

    const volumeYear = (runs ?? []).reduce((s, r) => s + Number(r.distance || 0), 0);
    const elevYear = (runs ?? []).reduce((s, r) => s + Number(r.elevation || 0), 0);

    let completedQuests: RealProfileData["completedQuests"] = [];
    if (completedUq && completedUq.length > 0) {
      const { data: defs } = await supabase
        .from("quest_definitions")
        .select("id, title, icon, xp_reward, period")
        .in(
          "id",
          completedUq.map((q) => q.quest_id),
        );
      const defById = new Map((defs ?? []).map((d) => [d.id, d]));
      completedQuests = completedUq
        .map((q) => {
          const def = defById.get(q.quest_id);
          if (!def) return null;
          return {
            id: q.quest_id,
            title: def.title,
            icon: def.icon,
            xpReward: def.xp_reward,
            period: def.period,
          };
        })
        .filter((q): q is NonNullable<typeof q> => q !== null);
    }

    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name ?? profile.username,
      avatar: profile.avatar ?? "🏃",
      xp: profile.xp ?? 0,
      streak: profile.streak ?? 0,
      itraIndex: profile.itra_performance_index ?? null,
      utmbIndex: profile.utmb_index ?? null,
      volumeYear: Math.round(volumeYear),
      elevYear: Math.round(elevYear),
      finishesYear: (runs ?? []).length,
      submittedRaces: races ?? [],
      submittedOffRaces: offRaces ?? [],
      completedQuests,
    };
  } catch (err) {
    // Supabase injoignable : on ne fait pas planter la page, on retombe
    // sur les fallbacks (persona démo / 404) plutôt qu'un 500.
    console.error("[u/username] loadRealProfile failed", err);
    return null;
  }
}

export default async function UserPublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const realProfile = await loadRealProfile(username);

  // Persona de démo connue (parcours messagerie/démo) — on ne casse pas ça.
  const isDemoPersona = Object.values(MESSAGE_USERS).some(
    (u) => u.username === username,
  );

  // Ni un vrai profil Supabase, ni une persona de démo connue → 404 propre
  // au lieu d'une fausse page "profil pas encore rempli".
  // (Le cas "course soumise en localStorage par ce username" reste géré
  // côté client dans UserPublicProfile pour ne pas perdre cette fonctionnalité.)
  if (!realProfile && !isDemoPersona) {
    notFound();
  }

  return <UserPublicProfile username={username} realProfile={realProfile} />;
}
