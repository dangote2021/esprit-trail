import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ====== STRAVA WEBHOOK SUBSCRIPTION — Admin endpoint ======
//
// Protege par WEBHOOK_ADMIN_SECRET (Bearer token).
//
// GET  /api/webhooks/strava/subscription
//   Liste la subscription cote Strava (via API Strava) + celle stockee
//   chez nous. Pour debug.
//
// POST /api/webhooks/strava/subscription
//   Cree une nouvelle subscription Strava. Strava va appeler notre
//   callback (/api/webhooks/strava/event) en GET pour valider, puis
//   nous retourne l'id de subscription. On le stocke en base.
//
// DELETE /api/webhooks/strava/subscription
//   Supprime la subscription Strava + clean local.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRAVA_SUB_URL = "https://www.strava.com/api/v3/push_subscriptions";

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "https://esprit-trail.vercel.app"
  );
}

function authOK(req: NextRequest): boolean {
  const admin = process.env.WEBHOOK_ADMIN_SECRET || "";
  if (!admin) return false;
  const got = req.headers.get("authorization") || "";
  return got === `Bearer ${admin}`;
}

function getSupabaseAdmin() {
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supaService = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supaUrl || !supaService) return null;
  return createClient(supaUrl, supaService);
}

export async function GET(req: NextRequest) {
  if (!authOK(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const clientId = process.env.STRAVA_CLIENT_ID || "";
  const clientSecret = process.env.STRAVA_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { ok: false, error: "STRAVA_CLIENT_ID/SECRET missing" },
      { status: 500 },
    );
  }
  const url = `${STRAVA_SUB_URL}?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
  const res = await fetch(url);
  const remote = await res.json().catch(() => null);

  const supabase = getSupabaseAdmin();
  let local = null;
  if (supabase) {
    const { data } = await supabase
      .from("strava_webhook_subscription")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    local = data;
  }

  return NextResponse.json({ ok: true, remote, local });
}

export async function POST(req: NextRequest) {
  if (!authOK(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const clientId = process.env.STRAVA_CLIENT_ID || "";
  const clientSecret = process.env.STRAVA_CLIENT_SECRET || "";
  const verifyToken = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN_2 || "";
  if (!clientId || !clientSecret || !verifyToken) {
    return NextResponse.json(
      { ok: false, error: "STRAVA_CLIENT_ID/SECRET or STRAVA_WEBHOOK_VERIFY_TOKEN_2 missing" },
      { status: 500 },
    );
  }

  const callbackUrl = `${getSiteUrl()}/api/webhooks/strava/event`;

  // Strava attend du form data (x-www-form-urlencoded)
  const formBody = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    callback_url: callbackUrl,
    verify_token: verifyToken,
  });

  const res = await fetch(STRAVA_SUB_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "Strava POST failed", status: res.status, data },
      { status: 502 },
    );
  }
  // data = { id: number }
  const stravaSubId: number | undefined = data?.id;
  if (!stravaSubId) {
    return NextResponse.json(
      { ok: false, error: "no subscription id returned", data },
      { status: 502 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("strava_webhook_subscription") as any).upsert({
      id: 1,
      strava_subscription_id: stravaSubId,
      verify_token: verifyToken,
      callback_url: callbackUrl,
    });
  }

  return NextResponse.json({ ok: true, subscriptionId: stravaSubId, callbackUrl });
}

export async function DELETE(req: NextRequest) {
  if (!authOK(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const clientId = process.env.STRAVA_CLIENT_ID || "";
  const clientSecret = process.env.STRAVA_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { ok: false, error: "STRAVA_CLIENT_ID/SECRET missing" },
      { status: 500 },
    );
  }

  const supabase = getSupabaseAdmin();
  let stravaSubId: number | null = null;
  if (supabase) {
    const { data } = await supabase
      .from("strava_webhook_subscription")
      .select("strava_subscription_id")
      .eq("id", 1)
      .maybeSingle();
    stravaSubId = (data?.strava_subscription_id as number) ?? null;
  }

  if (!stravaSubId) {
    return NextResponse.json(
      { ok: false, error: "no subscription stored locally" },
      { status: 404 },
    );
  }

  const url = `${STRAVA_SUB_URL}/${stravaSubId}?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    return NextResponse.json(
      { ok: false, error: "Strava DELETE failed", status: res.status },
      { status: 502 },
    );
  }

  if (supabase) {
    await supabase.from("strava_webhook_subscription").delete().eq("id", 1);
  }

  return NextResponse.json({ ok: true });
}
