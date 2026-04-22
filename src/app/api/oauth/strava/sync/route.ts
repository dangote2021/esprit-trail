import { NextRequest, NextResponse } from "next/server";
import { listActivities, refreshTokens, stravaToRun } from "@/lib/watches/strava";

// POST /api/oauth/strava/sync
// Tire les 30 dernières activités Strava et les upsert dans public.runs.
// À appeler :
//   - après le premier connect
//   - toutes les X heures via un cron Vercel
//   - manuellement depuis /profile/settings bouton "Resynchroniser"

export async function POST(req: NextRequest) {
  try {
    // TODO : récupérer les tokens Strava de l'utilisateur courant depuis Supabase
    // Pour le scaffold, on lit le body.
    const { accessToken, refreshToken, expiresAt, userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "userId manquant" },
        { status: 400 }
      );
    }

    let token = accessToken;

    // Refresh si expiré
    if (expiresAt && Date.now() / 1000 > expiresAt - 60 && refreshToken) {
      const refreshed = await refreshTokens(refreshToken);
      token = refreshed.access_token;
      // TODO: persister les nouveaux tokens en base
    }

    const activities = await listActivities(token, { perPage: 30 });

    // Filtre : on ne garde que les activités Run / TrailRun / Hike
    const runActivities = activities.filter((a) =>
      ["Run", "TrailRun", "Hike", "Walk"].includes(a.sport_type || a.type)
    );

    const runs = runActivities.map((a) => stravaToRun(a, userId));

    // TODO: upsert dans Supabase avec onConflict: ['source', 'external_id']
    //   et recalculer le XP / badges déclenchés par ces nouveaux runs.

    return NextResponse.json({
      ok: true,
      imported: runs.length,
      skipped: activities.length - runs.length,
      runs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "sync failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
