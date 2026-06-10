import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ====== STRAVA WEBHOOKS — Endpoint d'events ======
//
// GET  /api/webhooks/strava/event
//   Challenge de validation Strava au moment de creer la subscription.
//   Strava nous appelle avec ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
//   On doit echo le hub.challenge en JSON sous 2s.
//
// POST /api/webhooks/strava/event
//   Reception des events activity/athlete (create/update/delete).
//   On doit repondre 200 OK sous 2s. Si plus de processing, async.
//   Pour la beta, on log juste l'event en base (audit + replay).
//   Le traitement reel (re-fetch de l'activite, mise a jour de la
//   table activites user) sera branche dans une etape suivante :
//   pour valider la subscription cote Strava, l'essentiel est qu'on
//   reponde 200 OK rapidement.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET = challenge Strava
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const verifyToken = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const expected = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN_2 || "";

  if (mode !== "subscribe" || !challenge) {
    return NextResponse.json(
      { error: "invalid challenge request" },
      { status: 400 },
    );
  }
  if (!expected || verifyToken !== expected) {
    return NextResponse.json(
      { error: "verify_token mismatch" },
      { status: 401 },
    );
  }
  // Echo exact attendu par Strava : { "hub.challenge": "..." }
  return NextResponse.json({ "hub.challenge": challenge });
}

interface StravaEvent {
  object_type?: string;
  object_id?: number;
  aspect_type?: string;
  owner_id?: number;
  subscription_id?: number;
  event_time?: number;
  updates?: Record<string, unknown>;
}

// POST = event recu de Strava
export async function POST(req: NextRequest) {
  let body: StravaEvent;
  try {
    body = (await req.json()) as StravaEvent;
  } catch {
    // On repond 200 quand meme pour ne pas faire retry Strava sur du
    // bruit, mais on log
    console.warn("[strava/webhook] body non-JSON");
    return NextResponse.json({ ok: true });
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supaService = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  // Log async : on ne fait pas attendre Strava (budget 2s).
  // On lance la promesse, on ne l'attend pas.
  if (supaUrl && supaService) {
    const supabase = createClient(supaUrl, supaService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("strava_webhook_events") as any)
      .insert({
        object_type: body.object_type || "unknown",
        object_id: body.object_id || 0,
        aspect_type: body.aspect_type || "unknown",
        owner_id: body.owner_id || 0,
        subscription_id: body.subscription_id || 0,
        event_time: body.event_time || 0,
        updates: body.updates ?? null,
      })
      .then(({ error }: { error: unknown }) => {
        if (error) console.error("[strava/webhook] insert error", error);
      });
  }

  // ACK Strava sous 2s
  return NextResponse.json({ ok: true });
}
