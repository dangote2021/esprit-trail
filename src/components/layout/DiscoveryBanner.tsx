// ====== DiscoveryBanner ======
// Bandeau affiché aux visiteurs non-loggés sur les pages publiques en mode
// "Découverte" (/spots, /race/[id], etc.). Les invite à créer un compte
// pour débloquer toutes les features.
//
// Server component : on lit la session côté serveur. Si pas connecté,
// on affiche le bandeau. Sinon, on affiche rien.

import Link from "next/link";
import { getSupabaseUser } from "@/lib/supabase/server";

export default async function DiscoveryBanner() {
  const user = await getSupabaseUser();
  if (user) return null;

  return (
    <div className="rounded-2xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">👀</div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Mode découverte · sans compte
          </div>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Tu visites Esprit Trail sans compte — tu vois un aperçu. Pour débloquer
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
