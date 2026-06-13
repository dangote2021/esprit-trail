import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// POST /api/oauth/strava/disconnect
// Supprime l'intégration Strava de l'utilisateur (RGPD article 17).
// Supprime les tokens + flag les runs importées comme orphelines.

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

    // Supprime les tokens Strava
    const { error: delIntErr } = await (supabase.from("user_integrations") as any)
      .delete()
      .eq("user_id", user.id)
      .eq("provider", "strava");

    if (delIntErr) {
      console.error("[Strava disconnect] integration delete error:", delIntErr);
      return NextResponse.json(
        { ok: false, error: "integration_delete_failed" },
        { status: 500 },
      );
    }

    // Supprime les runs importées depuis Strava (RGPD : on supprime les données)
    const { error: delRunsErr } = await (supabase.from("runs") as any)
      .delete()
      .eq("user_id", user.id)
      .eq("source", "strava");

    if (delRunsErr) {
      // Non-bloquant : les tokens sont déjà supprimés
      console.error("[Strava disconnect] runs delete error:", delRunsErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "disconnect failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
