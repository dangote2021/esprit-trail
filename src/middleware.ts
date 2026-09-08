import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - .well-known/* (Digital Asset Links pour la TWA Android, ACME, etc.)
     * - manifest.webmanifest (PWA/TWA manifest — fetché par Bubblewrap et Chrome)
     * - fichiers media (.svg, .png, .jpg, .gif, .webp)
     *
     * IMPORTANT (08/09/26) — Bug TWA "fenêtre navigateur avec croix" :
     * .well-known/assetlinks.json passait AVANT par ce middleware, qui
     * exécute inconditionnellement `supabase.auth.getUser()` (jusqu'à 4s de
     * timeout, cf lib/supabase/middleware.ts) avant même de vérifier que la
     * route est publique. Résultat mesuré : ~3.4s de latence sur cache MISS,
     * et le vérificateur Digital Asset Links de Google (déclenché à
     * l'installation de l'app Android) timeout dessus
     * ("deadline_exceeded" sur digitalassetlinks.googleapis.com) → la
     * vérification échoue → Chrome bascule la TWA en Custom Tab classique
     * (barre d'URL + croix de fermeture) au lieu du plein écran attendu.
     * assetlinks.json et manifest.webmanifest n'ont besoin d'aucune session
     * utilisateur : on les fait sortir du matcher pour qu'ils soient servis
     * instantanément, sans passer par l'auth Supabase.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|\\.well-known|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
