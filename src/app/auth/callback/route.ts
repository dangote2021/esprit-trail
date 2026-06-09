// ====== AUTH CALLBACK ======
// Route unique qui gère :
//  - Les magic links Supabase (token_hash + type) → verifyOtp (pas besoin de
//    code_verifier, fonctionne même si l'user clique depuis un autre browser)
//  - Les OAuth providers (Google, Strava, etc.) qui reviennent avec ?code=... →
//    exchangeCodeForSession
// Les deux chemins terminent sur un redirect vers ?next (par défaut /).
//
// Hardening 24/04/26 (post-audit B0) :
//  - Mapping des erreurs Supabase vers des codes courts stables côté /login
//  - Logs enrichis (type, next, search keys)
//  - Pas de leak du token_hash dans les logs ni l'URL d'erreur

import { NextResponse, type NextRequest } from "next/server";
import type { AuthError, EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Mapping des messages Supabase → codes courts
// Côté /login, on affiche un message FR dédié par code (cf. login/page.tsx).
function mapAuthError(error: AuthError | null | undefined): string {
  if (!error) return "auth_error";
  const msg = error.message.toLowerCase();
  if (msg.includes("expired")) return "link_expired";
  if (msg.includes("invalid") && msg.includes("token")) return "link_invalid";
  if (msg.includes("already") || msg.includes("consumed") || msg.includes("used")) return "link_used";
  if (msg.includes("otp")) return "link_invalid";
  if (msg.includes("user not found")) return "user_unknown";
  if (msg.includes("pkce") || msg.includes("code_verifier")) return "pkce_mismatch";
  return "auth_error";
}

function redirectToLogin(origin: string, code: string, next?: string | null) {
  const url = new URL(`${origin}/login`);
  url.searchParams.set("error", code);
  if (next && next !== "/") url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const providerError = searchParams.get("error") || searchParams.get("error_description");

  // Cas 0 : le provider a déjà renvoyé une erreur dans l'URL (user a cancel côté OAuth)
  if (providerError) {
    console.error("[auth/callback] provider error:", providerError);
    return redirectToLogin(origin, "provider_error", next);
  }

  try {
    const supabase = await getSupabaseServerClient();

    // Cas 1 : magic link / email confirm / recovery — PAS besoin du code_verifier
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (error) {
        console.error("[auth/callback] verifyOtp failed", {
          type,
          code: error.code,
          message: error.message,
          status: error.status,
        });
        return redirectToLogin(origin, mapAuthError(error), next);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Cas 2 : OAuth provider (Google, etc.) — retour avec ?code=
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("[auth/callback] exchangeCodeForSession failed", {
          code: error.code,
          message: error.message,
          status: error.status,
        });
        return redirectToLogin(origin, mapAuthError(error), next);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Rien d'utilisable dans l'URL — probablement un vieux lien ou un user qui a rafraichi
    console.warn("[auth/callback] missing token_hash and code", {
      paramKeys: Array.from(searchParams.keys()),
    });
    return redirectToLogin(origin, "invalid_link", next);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "callback exception";
    console.error("[auth/callback] unhandled exception:", msg);
    return redirectToLogin(origin, "server_error", next);
  }
}
