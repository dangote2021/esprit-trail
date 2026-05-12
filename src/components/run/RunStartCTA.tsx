"use client";

// ====== RunStartCTA ======
// CTA principal de la home "Lance une sortie". Au 1er clic, si l'user n'a
// jamais connecté Strava, on lui propose la sync d'abord (gain UX énorme :
// les sorties s'importeront automatiquement). Une fois la décision prise
// (connecté ou "passer"), les clics suivants vont direct sur /run/new.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STRAVA_PROMPT_SEEN = "esprit_strava_prompt_seen";
const STRAVA_CONNECTED = "esprit_strava_connected"; // setter ailleurs après OAuth

export default function RunStartCTA() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Hydratation : on lit le localStorage côté client uniquement
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleClick(e: React.MouseEvent) {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(STRAVA_PROMPT_SEEN);
    const connected = window.localStorage.getItem(STRAVA_CONNECTED);
    if (!seen && !connected) {
      // 1er clic : on intercepte, on montre la modale
      e.preventDefault();
      setShowModal(true);
    }
    // Sinon : on laisse le Link faire sa navigation native
  }

  function dismissAndContinue() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STRAVA_PROMPT_SEEN, "1");
    }
    setShowModal(false);
    router.push("/run/new");
  }

  function goConnectStrava() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STRAVA_PROMPT_SEEN, "1");
    }
    setShowModal(false);
    router.push("/settings/connections/strava?next=/run/new");
  }

  return (
    <>
      <Link
        href="/run/new"
        onClick={handleClick}
        className="group relative block overflow-hidden rounded-3xl bg-lime p-5 text-bg btn-chunky tap-bounce card-shine"
      >
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg text-lime card-chunky wobble">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-8 w-8">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-wider">
              Prêt pour une session trail plein phare&nbsp;?
            </div>
            <div className="font-display text-xl font-black leading-tight">
              Lance une sortie
            </div>
            <div className="text-xs opacity-80">
              Synchronise Strava, enchaîne les kilomètres et analyse tes datas.
            </div>
          </div>
          <div className="font-display text-2xl transition group-hover:translate-x-1">
            →
          </div>
        </div>
      </Link>

      {/* Modale Strava — affichée au 1er clic uniquement */}
      {mounted && showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={dismissAndContinue}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-bg p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white font-display text-2xl font-black"
                style={{ background: "#fc4c02" }}
              >
                S
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[#fc4c02]">
                  Étape conseillée · 30 sec
                </div>
                <h3 className="font-display text-xl font-black text-ink leading-tight">
                  Tu connectes Strava&nbsp;?
                </h3>
              </div>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed">
              Avec Strava connecté, tes sorties s&apos;importent automatiquement
              à chaque fois que tu poses ta montre. Le Coach IA, le radar Forme
              et le ranking se calibrent sur tes <b>vraies</b> data. Pas de
              double saisie, pas d&apos;oubli.
            </p>

            <ul className="space-y-1.5 text-xs text-ink">
              <li>✓ Sync auto à chaque run posté sur Strava</li>
              <li>✓ Historique des 90 derniers jours importé direct</li>
              <li>✓ Volume hebdo, D+, allure : tout est là</li>
            </ul>

            <div className="space-y-2 pt-1">
              <button
                onClick={goConnectStrava}
                className="block w-full rounded-xl py-3 text-center font-mono text-sm font-black uppercase tracking-wider text-white shadow-md hover:scale-[1.02] transition"
                style={{ background: "#fc4c02" }}
              >
                Connecter Strava maintenant →
              </button>
              <button
                onClick={dismissAndContinue}
                className="block w-full rounded-xl border border-ink/15 bg-bg-card/60 py-2.5 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
              >
                Plus tard, je démarre ma sortie maintenant
              </button>
            </div>

            <p className="text-center text-[10px] text-ink-dim">
              Tu peux toujours connecter Strava ensuite depuis ton profil.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
