"use client";

// ====== DiscoveryBannerClient ======
// Variante client pour les pages "use client" (ex: /spots).
// Détecte la session via le cookie Supabase côté browser.

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DiscoveryBannerClient() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    // Détection grossière : si un cookie 'sb-*-auth-token' existe, on considère loggué.
    // Ça reste indicatif côté UI (le middleware Supabase fait la vraie vérif sur les routes protégées).
    if (typeof document === "undefined") return;
    const hasAuthCookie = document.cookie
      .split(";")
      .some((c) => c.trim().match(/^sb-[a-z0-9]+-auth-token/));
    setIsLogged(hasAuthCookie);
  }, []);

  if (isLogged === null) return null; // hydratation pas finie
  if (isLogged) return null;

  return (
    <div className="rounded-2xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">👀</div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Mode découverte · sans compte
          </div>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Tu visites Esprit Trail sans compte — aperçu uniquement. Pour débloquer
            toutes les fonctionnalités (Coach IA, dossards en jeu, ranking
            ITRA/UTMB, sync Strava, GPX persos), crée ton compte en 30 sec.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href="/signup"
              className="rounded-md bg-peach px-3 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-bg shadow-md hover:scale-[1.02] transition"
            >
              Créer mon compte gratuit
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-ink/15 bg-bg-card/60 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
