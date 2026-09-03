// ====== SUPABASE AUTH MIDDLEWARE ======
// Rafraîchit la session à chaque requête et propage les cookies SSR.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si les env vars ne sont pas configurées, on laisse passer (mode dev sans Supabase)
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: ne RIEN mettre entre createServerClient et getUser().
  // Hardening 03/09/26 (post-incident outage) : si Supabase est injoignable
  // (pause du projet, incident réseau...), getUser() peut rejeter ou traîner
  // jusqu'au timeout de la fonction. On ne veut JAMAIS que ça fasse tomber
  // tout le site (y compris les pages publiques qui n'ont pas besoin d'auth).
  // En cas d'échec : on traite la requête comme "non connecté" et on laisse
  // la logique isPublicRoute ci-dessous décider (redirect /login pour les
  // routes protégées, passthrough pour le reste).
  let user: { id: string } | null = null;
  try {
    // Course contre un timeout court : si Supabase ne répond pas en 4s
    // (DNS mort, projet en pause...), on abandonne plutôt que de laisser
    // la requête traîner jusqu'au kill de la fonction (25s → 504 garanti).
    const timeout = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 4000);
    });
    const result = await Promise.race([
      supabase.auth.getUser().then((r) => r.data.user),
      timeout,
    ]);
    user = result;
  } catch (err) {
    console.error("[middleware] supabase.auth.getUser() failed — degraded mode (no session)", err);
  }

  const pathname = request.nextUrl.pathname;

  // Legacy race slugs → 301 vers les nouveaux IDs
  const LEGACY_RACE_SLUGS: Record<string, string> = {
    "/race/maxi-race-2026": "/race/maxirace-annecy-2026",
    "/race/maxi-race-vercors-2026": "/race/trail-vercors-2026",
  };
  if (LEGACY_RACE_SLUGS[pathname]) {
    const target = request.nextUrl.clone();
    target.pathname = LEGACY_RACE_SLUGS[pathname];
    return NextResponse.redirect(target, 301);
  }

  // Routes publiques : auth, API OAuth, landing, concept, legal, support, static
  // Important pour App/Play Stores : /privacy + /contact doivent être accessibles
  // sans login (exigence des stores pour la review).
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/mentions") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/install") ||
    pathname.startsWith("/organisateurs") ||
    pathname.startsWith("/challenges/loto") ||
    pathname.startsWith("/demo") ||
    // Mode "Découverte" — accès en lecture sans login pour tester l'app
    pathname.startsWith("/spots") ||
    pathname.startsWith("/race/") ||
    pathname === "/races" ||
    pathname.startsWith("/races") ||
    pathname.startsWith("/u/") || // Profil public communautaire
    pathname.startsWith("/api/oauth") ||
    pathname.startsWith("/api/gpx") ||
    pathname.startsWith("/api/webhooks/") ||
    pathname.startsWith("/api/cron/") || // Vercel Cron (keepalive Supabase, etc.)
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/logo") ||
    pathname === "/onboarding";

  // Si pas de user et route protégée → redirect /login
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si user connecté et sur /login ou /signup → redirect /
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}
