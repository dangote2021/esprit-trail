import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const isVercelCron = request.headers.get("x-vercel-cron") !== null;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "supabase not configured" }, { status: 500 });
  }

try {
  const supabase = createClient(url, key);
  const { error, count } = await supabase
  .from("badges")
  .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[cron/keepalive] query failed", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    pingedAt: new Date().toISOString(),
    isVercelCron,
    badgesCount: count ?? null,
  });
} catch (err) {
  console.error("[cron/keepalive] unhandled", err);
  return NextResponse.json({ ok: false, error: "unhandled exception" }, { status: 500 });
}
}
