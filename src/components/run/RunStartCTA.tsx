"use client";

// ====== RunStartCTA ======
// CTA principal de la home "Lance une sortie". Au 1er clic, on propose
// brievement les 3 facons d'enregistrer une sortie (tracker GPS, saisie
// manuelle, ou Strava — quand il sera dispo). Aucun choix push : les 3
// options sont au meme niveau. Une fois la modale vue, les clics suivants
// vont direct sur /run/new.
//
// Strava est en attente de review Developer Program — pour l'instant
// limite a 1 athlete. Donc on ne pousse pas la sync Strava en priorite :
// on met en avant le tracker GPS et la saisie manuelle qui marchent
// pour tout le monde.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RUN_START_PROMPT_SEEN = "esprit_run_start_prompt_seen";

export default function RunStartCTA() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Hydratation : on lit le localStorage côté client uniquement
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleClick(e: React.MouseEvent) {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(RUN_START_PROMPT_SEEN);
    if (!seen) {
      e.preventDefault();
      setShowModal(true);
    }
  }

  function dismissAndGo(target: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RUN_START_PROMPT_SEEN, "1");
    }
    setShowModal(false);
    router.push(target);
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
              Prêt pour une session trail de zinzins&nbsp;?
            </div>
            <div className="font-display text-xl font-black leading-tight">
              Lance une sortie
            </div>
            <div className="text-xs opacity-80">
              Tracker GPS, saisie manuelle ou Strava — au choix.
            </div>
          </div>
          <div className="font-display text-2xl transition group-hover:translate-x-1">
            →
          </div>
        </div>
      </Link>

      {/* Modale "comment tu enregistres" — affichée au 1er clic uniquement */}
      {mounted && showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={() => dismissAndGo("/run/new")}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-bg p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                3 façons d&apos;enregistrer
              </div>
              <h3 className="font-display text-xl font-black text-ink leading-tight mt-1">
                Comment tu veux y aller&nbsp;?
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed mt-1.5">
                Pas besoin d&apos;avoir Strava. Le tracker GPS et la saisie manuelle
                marchent direct, tout reste dans ton app.
              </p>
            </div>

            <div className="space-y-2">
              {/* Tracker GPS */}
              <button
                onClick={() => dismissAndGo("/run/track")}
                className="block w-full text-left rounded-xl border-2 border-lime/40 bg-lime/10 p-3 hover:bg-lime/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🛰️</div>
                  <div className="flex-1">
                    <div className="font-display text-sm font-black text-ink">
                      Tracker GPS en direct
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Tu lances, tu cours, l&apos;app trace le tracé et calcule tout.
                    </div>
                  </div>
                  <div className="text-ink-muted">→</div>
                </div>
              </button>

              {/* Saisie manuelle */}
              <button
                onClick={() => dismissAndGo("/run/manual")}
                className="block w-full text-left rounded-xl border border-ink/15 bg-bg-card/60 p-3 hover:bg-bg-card transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✎</div>
                  <div className="flex-1">
                    <div className="font-display text-sm font-black text-ink">
                      Saisie manuelle
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Tu rentres distance, D+, durée. 30 sec.
                    </div>
                  </div>
                  <div className="text-ink-muted">→</div>
                </div>
              </button>

              {/* Strava — note honnête sur le statut */}
              <button
                onClick={() => dismissAndGo("/settings/connections/strava")}
                className="block w-full text-left rounded-xl border border-ink/10 bg-bg-card/30 p-3 hover:bg-bg-card/60 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-display text-sm font-black"
                    style={{ background: "#fc4c02" }}
                  >
                    S
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-sm font-black text-ink">
                      Sync Strava
                      <span className="ml-1.5 inline-block rounded-md bg-ink/10 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-ink-muted align-middle">
                        en review
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Capacité limitée pendant la review Strava. Bientôt dispo.
                    </div>
                  </div>
                  <div className="text-ink-muted">→</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => dismissAndGo("/run/new")}
              className="block w-full rounded-xl border border-ink/15 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
