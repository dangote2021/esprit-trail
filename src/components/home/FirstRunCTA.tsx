"use client";

// ====== FirstRunCTA ======
// Encart proeminent affiche sur la home quand l'user n'a encore enregistre
// AUCUNE sortie (esprit_manual_runs vide).
//
// Cible le drop-off J+1 : un user qui s'inscrit, fait un tour, et ne sait
// pas par ou commencer. On lui propose explicitement Tracker GPS ou Saisie
// manuelle, sans pousser Strava (en review).
//
// Une fois qu'il a au moins 1 sortie, le composant disparait — la home
// affiche RecentRuns / WeekPlanCard a la place.

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "esprit_manual_runs";

export default function FirstRunCTA() {
  const [hasRuns, setHasRuns] = useState<boolean | null>(null);

  useEffect(() => {
    function check() {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(KEY);
        const arr = raw ? (JSON.parse(raw) as unknown[]) : [];
        setHasRuns(Array.isArray(arr) && arr.length > 0);
      } catch {
        setHasRuns(false);
      }
    }
    check();
    window.addEventListener("esprit:runs", check);
    return () => window.removeEventListener("esprit:runs", check);
  }, []);

  // En cours de check : on rend rien (evite flash)
  if (hasRuns === null) return null;
  // Deja au moins une sortie : le composant disparait
  if (hasRuns) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-lime/40 bg-gradient-to-br from-lime/10 via-cyan/5 to-bg p-5 card-chunky">
      <div className="flex items-start gap-3">
        <div className="text-4xl animate-float">🏃</div>
        <div className="flex-1">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Premiere etape
          </div>
          <h2 className="mt-1 font-display text-xl font-black text-ink leading-tight">
            Enregistre ta derniere sortie
          </h2>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Une sortie suffit pour activer ta streak, faire avancer tes quetes
            et calibrer ton coach IA. Tracker GPS ou saisie manuelle, ton
            choix.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href="/run/track"
          className="rounded-xl bg-lime px-3 py-3 text-center text-bg btn-chunky"
        >
          <div className="text-base">🛰️</div>
          <div className="font-display text-xs font-black uppercase tracking-wider mt-0.5">
            Tracker GPS
          </div>
          <div className="text-[10px] opacity-75 mt-0.5">en direct</div>
        </Link>
        <Link
          href="/run/manual"
          className="rounded-xl border-2 border-ink/15 bg-bg-card/60 px-3 py-3 text-center hover:border-ink/30 transition"
        >
          <div className="text-base">✎</div>
          <div className="font-display text-xs font-black uppercase tracking-wider mt-0.5 text-ink">
            Saisie manuelle
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5">30 sec</div>
        </Link>
      </div>

      <p className="mt-3 text-[10px] text-ink-muted leading-relaxed text-center">
        Sync Strava en review — toute l&apos;app marche sans pour le moment.
      </p>
    </section>
  );
}
