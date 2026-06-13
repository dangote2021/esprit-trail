import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/watches/strava";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/oauth/strava/callback?code=...&state=...
// Strava redirige ici après autorisation. On échange le code contre des tokens,
// on vérifie le state CSRF, puis on persiste dans user_integrations.

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings/connections?strava_error=${error}`, req.url),
    );
  }

  const expectedState = req.cookies.get("strava_oauth_state")?.value;
  const from = req.cookies.get("strava_oauth_from")?.value || "/settings/connections";

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(
      new URL(`${from}?strava_error=invalid_state`, req.url),
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    // Persister dans Supabase (si user connecté)
    try {
      const supabase = await getSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const expiresAt = tokens.expires_at
          ? new Date(tokens.expires_at * 1000).toISOString()
          : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("user_integrations") as any).upsert({
          user_id: user.id,
          provider: "strava",
          external_user_id: tokens.athlete?.id ? String(tokens.athlete.id) : null,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token ?? null,
          expires_at: expiresAt,
          scope: "activity:read_all,profile:read_all",
          connected_at: new Date().toISOString(),
          last_sync_at: null,
          raw: tokens.athlete ? { athlete: tokens.athlete } : null,
        });
      }
    } catch (dbErr) {
      console.error("[Strava OAuth] DB persist failed:", dbErr);
      // On continue — les tokens sont corrects, l'user pourra réessayer la sync
    }

    const res = NextResponse.redirect(
      new URL(`${from}?strava_connected=1`, req.url),
    );
    res.cookies.delete("strava_oauth_state");
    res.cookies.delete("strava_oauth_from");
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "token exchange failed";
    return NextResponse.redirect(
      new URL(`${from}?strava_error=${encodeURIComponent(msg)}`, req.url),
    );
  }
}
