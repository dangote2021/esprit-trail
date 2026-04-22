import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/watches/strava";

// GET /api/oauth/strava/callback?code=...&state=...
// Strava redirige ici après autorisation. On échange le code contre des tokens,
// on vérifie le state CSRF, puis on persiste en base (Supabase).

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/profile/settings?strava_error=${error}`, req.url)
    );
  }

  const expectedState = req.cookies.get("strava_oauth_state")?.value;
  const from = req.cookies.get("strava_oauth_from")?.value || "/profile/settings";

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(
      new URL(`${from}?strava_error=invalid_state`, req.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    // TODO: persister dans Supabase (table user_integrations)
    //   - access_token, refresh_token, expires_at
    //   - athlete.id → lié au profile.user_id
    //   - lancer un import initial des 50 dernières activités en background
    // Pour l'instant on log et on redirige.
    console.log("[Strava OAuth] success, athlete", tokens.athlete?.id);

    const res = NextResponse.redirect(
      new URL(`${from}?strava_connected=1`, req.url)
    );
    res.cookies.delete("strava_oauth_state");
    res.cookies.delete("strava_oauth_from");
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "token exchange failed";
    return NextResponse.redirect(
      new URL(`${from}?strava_error=${encodeURIComponent(msg)}`, req.url)
    );
  }
}
