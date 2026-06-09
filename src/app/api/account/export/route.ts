// ====== GET /api/account/export ======
// Export RGPD — JSON de toutes les données user.

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    // On lit tables user par RLS — chaque requête ne renvoie que ses propres données
    const [profile, runs, userBadges, userQuests, guildMembers, integrations] =
      await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("profiles") as any).select("*").eq("id", user.id).maybeSingle(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("runs") as any).select("*").eq("user_id", user.id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("user_badges") as any).select("*").eq("user_id", user.id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("user_quests") as any).select("*").eq("user_id", user.id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("guilde_members") as any).select("*").eq("user_id", user.id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("user_integrations") as any)
          .select("user_id, provider, external_user_id, connected_at, last_sync_at, scope")
          .eq("user_id", user.id),
      ]);

    const payload = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile: profile.data ?? null,
      runs: runs.data ?? [],
      badges: userBadges.data ?? [],
      quests: userQuests.data ?? [],
      teams: guildMembers.data ?? [],
      integrations: integrations.data ?? [],
      note:
        "Les tokens OAuth (Strava) sont volontairement exclus de l'export pour des raisons de sécurité.",
    };

    const filename = `esprit-trail-export-${user.id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "export_failed";
    console.error("[account/export] exception:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
