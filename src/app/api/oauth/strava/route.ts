import { NextRequest, NextResponse } from "next/server";
import { buildAuthorizeUrl } from "@/lib/watches/strava";

// GET /api/oauth/strava
// Redirige l'utilisateur vers Strava pour authorize.
// Génère un state CSRF stocké en cookie signé.

export async function GET(req: NextRequest) {
  try {
    const state = crypto.randomUUID();
    const url = buildAuthorizeUrl(state);

    const res = NextResponse.redirect(url);
    res.cookies.set("strava_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 min
      path: "/",
    });
    // Redirect back path
    const from = req.nextUrl.searchParams.get("from") || "/profile/settings";
    res.cookies.set("strava_oauth_from", from, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OAuth init failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
