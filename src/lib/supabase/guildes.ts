"use client";

// ====== SUPABASE GUILDES SERVICE ======
// Hardening 04/09/26 : suite au rapport de test communauté (section 3), la
// page /guildes n'affichait que 5 teams fictives codées en dur, alors que la
// table `guildes` existe déjà en base avec 2 vraies teams (6 membres au
// total) et des policies RLS de lecture publique + écriture (join/quitter)
// déjà en place. Ce module branche les vraies guildes Supabase, en gardant
// le même contrat de type `Guilde` que les données mock pour ne rien casser
// côté UI.
//
// Simplification assumée : pas d'historique "cette semaine précise" côté
// stats (aucune fenêtre temporelle stockée pour les guildes réelles), donc
// `weekStats` est calculé en cumulé depuis `runs` — affiché comme tel dans
// la vue dédiée aux vraies teams (RealGuildeDetail), qui ne réutilise pas le
// libellé "de la semaine" des guildes mock pour rester honnête.
// `currentChallenge` reste `null` (aucun défi persisté en base).

import type { Guilde, GuildeCategory, GuildeMember } from "@/lib/data/guildes";
import { levelFromXp } from "@/lib/types";
import { getSupabaseBrowserClient } from "./client";

async function getUserId(): Promise<string | null> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data } = await sb.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

type GuildeRow = {
  id: string;
  name: string;
  emoji: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  location: string | null;
  max_members: number;
  join_rule: "open" | "request" | "invite-only";
  captain_id: string;
  vibe: string[] | null;
};

type MemberRow = {
  guilde_id: string;
  user_id: string;
  role: "captain" | "member";
  profile: {
    id: string;
    username: string;
    display_name: string | null;
    avatar: string | null;
    xp: number | null;
  } | null;
};

type RunTotals = { km: number; elevation: number; runs: number };

async function fetchRunTotalsByUser(): Promise<Map<string, RunTotals>> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("runs").select("user_id, distance, elevation");
  const totals = new Map<string, RunTotals>();
  if (error || !data) {
    console.error("[guildes] fetchRunTotalsByUser", error);
    return totals;
  }
  for (const r of data as { user_id: string | null; distance: number | null; elevation: number | null }[]) {
    if (!r.user_id) continue;
    const cur = totals.get(r.user_id) ?? { km: 0, elevation: 0, runs: 0 };
    cur.km += r.distance ?? 0;
    cur.elevation += r.elevation ?? 0;
    cur.runs += 1;
    totals.set(r.user_id, cur);
  }
  return totals;
}

function rowsToGuilde(
  row: GuildeRow,
  members: MemberRow[],
  runTotals: Map<string, RunTotals>,
  viewerId: string | null,
  rank: number,
): Guilde {
  const guildeMembers: GuildeMember[] = members.map((m) => {
    const t = runTotals.get(m.user_id) ?? { km: 0, elevation: 0, runs: 0 };
    return {
      id: m.user_id,
      username: m.profile?.username ?? "inconnu",
      displayName: m.profile?.display_name || m.profile?.username || "Inconnu",
      avatar: m.profile?.avatar || "🏃",
      level: levelFromXp(m.profile?.xp ?? 0),
      weeklyKm: Math.round(t.km),
      role: m.role,
    };
  });

  const totals = members.reduce(
    (acc, m) => {
      const t = runTotals.get(m.user_id) ?? { km: 0, elevation: 0, runs: 0 };
      acc.km += t.km;
      acc.elevation += t.elevation;
      acc.runs += t.runs;
      return acc;
    },
    { km: 0, elevation: 0, runs: 0 },
  );

  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    tagline: row.tagline || "",
    description: row.description || "",
    category: (row.category as GuildeCategory) || "local",
    location: row.location || "France entière",
    memberCount: guildeMembers.length,
    maxMembers: row.max_members,
    captain: row.captain_id,
    members: guildeMembers,
    weekStats: {
      totalKm: Math.round(totals.km),
      totalElevation: Math.round(totals.elevation),
      totalRuns: totals.runs,
      rank,
      rankChange: 0,
    },
    currentChallenge: null,
    joinRule: row.join_rule,
    vibe: row.vibe ?? [],
    iAmMember: viewerId != null && guildeMembers.some((m) => m.id === viewerId),
    iAmCaptain: viewerId != null && row.captain_id === viewerId,
  };
}

async function fetchAllRealGuildes(): Promise<Guilde[]> {
  const sb = getSupabaseBrowserClient();
  const [{ data, error }, runTotals, viewerId] = await Promise.all([
    sb.from("guildes").select(
      `
      id, name, emoji, tagline, description, category, location, max_members, join_rule, captain_id, vibe,
      members:guilde_members(
        guilde_id, user_id, role,
        profile:profiles(id, username, display_name, avatar, xp)
      )
      `,
    ),
    fetchRunTotalsByUser(),
    getUserId(),
  ]);

  if (error || !data) {
    console.error("[guildes] fetchAllRealGuildes", error);
    return [];
  }

  const withTotals = (data as any[]).map((row) => {
    const members: MemberRow[] = row.members || [];
    const elevation = members.reduce(
      (sum, m) => sum + (runTotals.get(m.user_id)?.elevation ?? 0),
      0,
    );
    return { row, members, elevation };
  });

  withTotals.sort((a, b) => b.elevation - a.elevation);

  return withTotals.map(({ row, members }, i) =>
    rowsToGuilde(row as GuildeRow, members, runTotals, viewerId, i + 1),
  );
}

/** Liste des vraies teams Supabase, pour la page /guildes. */
export async function getRealGuildes(): Promise<Guilde[]> {
  return fetchAllRealGuildes();
}

/** Une vraie team par id, pour /guildes/[id]. Retourne null si absente ou
 *  si l'id ne correspond à aucune guilde réelle. */
export async function getRealGuilde(id: string): Promise<Guilde | null> {
  const all = await fetchAllRealGuildes();
  return all.find((g) => g.id === id) ?? null;
}

/** Rejoindre une vraie team (insert direct si "open" ; en pratique la
 *  policy RLS autorise l'insert pour tout membre authentifié quel que soit
 *  join_rule — le "sur demande" reste donc pour l'instant un join immédiat
 *  côté vraies teams, comme pour les teams mock qui n'ont pas de vraie
 *  file de demandes non plus). */
export async function joinRealGuilde(
  guildeId: string,
): Promise<{ ok: boolean; error?: string }> {
  const uid = await getUserId();
  if (!uid) return { ok: false, error: "not-authenticated" };
  const sb = getSupabaseBrowserClient();
  const { error } = await (sb.from("guilde_members") as any).insert({
    guilde_id: guildeId,
    user_id: uid,
    role: "member",
  });
  if (error) {
    console.error("[guildes] joinRealGuilde", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Quitter une vraie team. */
export async function leaveRealGuilde(
  guildeId: string,
): Promise<{ ok: boolean; error?: string }> {
  const uid = await getUserId();
  if (!uid) return { ok: false, error: "not-authenticated" };
  const sb = getSupabaseBrowserClient();
  const { error } = await sb
    .from("guilde_members")
    .delete()
    .eq("guilde_id", guildeId)
    .eq("user_id", uid);
  if (error) {
    console.error("[guildes] leaveRealGuilde", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export { getUserId as getRealGuildeViewerId };
