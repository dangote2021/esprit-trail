import { NextRequest, NextResponse } from "next/server";
import { listActivities, refreshTokens, stravaToRun } from "@/lib/watches/strava";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// POST /api/oauth/strava/sync
// Tire les 30 dernières activités Strava et les upsert dans public.runs.

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(_req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    }

    // Récupérer les tokens Strava de l'utilisateur
    const { data: integration, error: intErr } = await (supabase.from("user_integrations") as any)
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "strava")
      .maybeSingle();

    if (intErr || !integration) {
      return NextResponse.json({ ok: false, error: "strava_not_connected" }, { status: 404 });
    }

    let accessToken: string = integration.access_token;
    const refreshToken: string | null = integration.refresh_token;
    const expiresAt = integration.expires_at
      ? Math.floor(new Date(integration.expires_at).getTime() / 1000)
      : null;

    // Refresh si expiré (à <60s)
    if (expiresAt && Date.now() / 1000 > expiresAt - 60 && refreshToken) {
      const refreshed = await refreshTokens(refreshToken);
      accessToken = refreshed.access_token;
      await (supabase.from("user_integrations") as any)
        .update({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token ?? refreshToken,
          expires_at: refreshed.expires_at
            ? new Date(refreshed.expires_at * 1000).toISOString()
            : null,
        })
        .eq("user_id", user.id)
        .eq("provider", "strava");
    }

    const activities = await listActivities(accessToken, { perPage: 30 });

    // Filtre : on ne garde que les activités Run / TrailRun / Hike / Walk
    const runActivities = activities.filter((a) =>
      ["Run", "TrailRun", "Hike", "Walk"].includes(a.sport_type || a.type),
    );

    const runs = runActivities.map((a) => stravaToRun(a, user.id));

    if (runs.length > 0) {
      const { error: upsertErr } = await (supabase.from("runs") as any).upsert(runs, {
        onConflict: "source,external_id",
      });
      if (upsertErr) {
        console.error("[Strava sync] upsert error:", upsertErr);
      }
    }

    // Marquer la dernière sync
    await (supabase.from("user_integrations") as any)
      .update({ last_sync_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("provider", "strava");

    return NextResponse.json({
      ok: true,
      imported: runs.length,
      skipped: activities.length - runs.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "sync failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
