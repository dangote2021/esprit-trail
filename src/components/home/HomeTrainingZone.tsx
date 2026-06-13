"use client";

// ====== HomeTrainingZone ======
// Enveloppe la zone "entraînement actif" de la home (quête du jour + CTA
// lancer une sortie). Si l'utilisateur a déclaré être EN PAUSE
// (training-state, cf. panel test Bruno), on ne lui balance pas
// "Quête du jour !" et "Lance une sortie" en gros — ce serait culpabilisant
// quand on est blessé. On affiche à la place un encart calme et bienveillant.
//
// État "block" et "active" : on garde la zone normale (en bloc, on VEUT
// ses quêtes ; c'est juste les alertes fatigue qu'on tempère ailleurs).

import { useEffect, useState } from "react";
import Link from "next/link";
import DailyQuestHero from "./DailyQuestHero";
import RunStartCTA from "@/components/run/RunStartCTA";
import {
  loadTrainingState,
  daysSince,
  type TrainingStateInfo,
} from "@/lib/training-state";

function PausedEncart({ info }: { info: TrainingStateInfo }) {
  const days = daysSince(info.since);
  return (
    <section
      className="relative overflow-hidden rounded-3xl border-2 border-cyan/30 p-5 card-chunky"
      style={{
        background:
          "linear-gradient(135deg, rgba(181,212,244,0.30) 0%, rgba(240,252,255,0.55) 55%, rgba(254,250,224,0.30) 100%)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-4xl">🩹</div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] font-mono font-black uppercase tracking-widest"
            style={{ color: "#185fa5" }}
          >
            Tu es en pause
          </div>
          <h2
            className="font-display text-xl font-black leading-tight mt-0.5"
            style={{ color: "#0c447c" }}
          >
            {days > 0
              ? `Repos depuis ${days} jour${days > 1 ? "s" : ""} — on lève le pied`
              : "Repos — on lève le pied"}
          </h2>
          <p className="text-[12px] text-ink-muted leading-snug mt-1">
            {info.reason
              ? `Pause notée : ${info.reason}. `
              : ""}
            Pas de quête, pas de pression. Reviens quand ton corps te le dit.
            En attendant, prépare le terrain pour ton retour.
          </p>
        </div>
      </div>

      {/* Ce qu'on peut faire SANS courir — actions douces */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Link
          href="/coach"
          className="rounded-xl bg-white/70 border border-ink/10 p-2.5 text-center hover:border-cyan/40 transition tap-bounce"
        >
          <div className="text-xl">🧠</div>
          <div className="text-[11px] font-display font-black leading-tight mt-1">
            Prépare ta reprise
          </div>
          <div className="text-[9px] font-mono text-ink-muted">Coach IA</div>
        </Link>
        <Link
          href="/races"
          className="rounded-xl bg-white/70 border border-ink/10 p-2.5 text-center hover:border-cyan/40 transition tap-bounce"
        >
          <div className="text-xl">🗓️</div>
          <div className="text-[11px] font-display font-black leading-tight mt-1">
            Vise une course
          </div>
          <div className="text-[9px] font-mono text-ink-muted">Calendrier</div>
        </Link>
        <Link
          href="/profile/settings"
          className="rounded-xl bg-white/70 border border-ink/10 p-2.5 text-center hover:border-cyan/40 transition tap-bounce"
        >
          <div className="text-xl">✅</div>
          <div className="text-[11px] font-display font-black leading-tight mt-1">
            Reprendre
          </div>
          <div className="text-[9px] font-mono text-ink-muted">Quand prêt</div>
        </Link>
      </div>

      <p className="mt-3 text-[10px] font-mono text-ink-dim text-center">
        Tu peux repasser en mode actif depuis tes paramètres dès que ça va
        mieux.
      </p>
    </section>
  );
}

export default function HomeTrainingZone() {
  // SSR + premier render client : on affiche la zone normale (évite tout
  // mismatch d'hydratation). On bascule après lecture du localStorage.
  const [info, setInfo] = useState<TrainingStateInfo | null>(null);

  useEffect(() => {
    setInfo(loadTrainingState());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as TrainingStateInfo | undefined;
      setInfo(detail ?? loadTrainingState());
    };
    window.addEventListener("esprit:trainingstate", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("esprit:trainingstate", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (info?.state === "pause") {
    return <PausedEncart info={info} />;
  }

  return (
    <>
      <DailyQuestHero />
      <RunStartCTA />
    </>
  );
}
