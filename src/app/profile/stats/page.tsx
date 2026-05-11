// ====== /profile/stats — Sondage d'auto-évaluation radar ======
//
// Avant que la sync Strava ait suffisamment de runs pour calibrer automatiquement
// le radar terrain, on laisse l'utilisateur déclarer ses points forts/faibles
// (endurance, vitesse, technique, mental, grimpe) via 5 sliders.
//
// Le radar se met à jour en live pendant qu'on bouge les curseurs.
//
// Persistance MVP : localStorage côté client (clé "esprit_stats_override").
// Quand le backend Strava sera branché (#74), les stats déclarées serviront de
// "seed" et seront progressivement écrasées par les valeurs calculées.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ME } from "@/lib/data/me";
import { StatRadar, statsToRadar } from "@/components/ui/StatRadar";
import type { TrailerStats } from "@/lib/types";

const STORAGE_KEY = "esprit_stats_override";

type AxisDef = {
  key: keyof TrailerStats;
  label: string;
  emoji: string;
  hint: string; // texte d'aide qualitatif
};

// Ordre fixe — calé sur celui du radar pour cohérence visuelle
const AXES: AxisDef[] = [
  {
    key: "endurance",
    label: "Endurance",
    emoji: "🔋",
    hint: "Tenir la distance, encaisser les longues sorties.",
  },
  {
    key: "grimpe",
    label: "Montée",
    emoji: "⛰️",
    hint: "Efficacité dans le D+, cardio en côte, cadence soutenue.",
  },
  {
    key: "technique",
    label: "Technicité",
    emoji: "🪨",
    hint: "Aisance sur terrain accidenté, racines, pierriers.",
  },
  {
    key: "vitesse",
    label: "Roulant",
    emoji: "💨",
    hint: "Allure sur le plat / faux-plats, capacité à pousser.",
  },
  {
    key: "mental",
    label: "Mental",
    emoji: "🧠",
    hint: "Encaisser la souffrance, garder le cap quand ça pique.",
  },
];

export default function StatsEditPage() {
  // On hydrate depuis l'override localStorage si présent, sinon depuis ME
  const initial: TrailerStats = ME.profile?.stats ?? {
    endurance: 60,
    vitesse: 60,
    technique: 60,
    mental: 60,
    grimpe: 60,
  };
  const [stats, setStats] = useState<TrailerStats>(initial);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TrailerStats>;
        setStats((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore — pas grave si le storage est cassé
    }
    setHydrated(true);
  }, []);

  function update(key: keyof TrailerStats, value: number) {
    setStats((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // pas critique — l'utilisateur peut juste fermer/rouvrir
    }
  }

  function reset() {
    setStats(initial);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSaved(false);
  }

  const axes = statsToRadar(stats);

  return (
    <main className="mx-auto max-w-lg pb-32">
      {/* Header */}
      <div className="safe-top sticky top-0 z-20 border-b border-ink/10 bg-bg/80 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-lime transition"
          >
            ← Profil
          </Link>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Auto-évaluation
          </div>
          <button
            onClick={reset}
            className="text-xs font-mono font-bold uppercase tracking-wider text-ink-dim hover:text-peach transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Intro */}
      <section className="px-4 pt-5">
        <h1 className="font-display text-2xl font-black leading-tight text-ink">
          Tes points forts, tes points faibles.
        </h1>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">
          Avant que tes sorties Strava aient calibré ton radar tout seul,
          dis-nous comment tu te vois. Honnête, pas modeste — c'est juste pour
          toi. Ça ajustera tes plans coach IA et tes recommandations de
          parcours.
        </p>
      </section>

      {/* Radar live */}
      <section className="mt-5 mx-4 rounded-2xl border border-ink/10 bg-bg-card p-4">
        <div className="mb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Aperçu temps réel
        </div>
        <div className="flex justify-center">
          <StatRadar axes={axes} size={240} accent="lime" />
        </div>
      </section>

      {/* Sliders */}
      <section className="mt-4 mx-4 space-y-3">
        {AXES.map((a) => (
          <SliderRow
            key={a.key}
            def={a}
            value={stats[a.key]}
            onChange={(v) => update(a.key, v)}
          />
        ))}
      </section>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-bg/90 px-4 py-3 backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="text-[11px] text-ink-muted">
            {hydrated && saved
              ? "✓ Enregistré localement"
              : "Sauvegardé sur ce navigateur"}
          </div>
          <button
            onClick={save}
            className="rounded-xl bg-lime px-5 py-2.5 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </main>
  );
}

function SliderRow({
  def,
  value,
  onChange,
}: {
  def: AxisDef;
  value: number;
  onChange: (v: number) => void;
}) {
  const tone =
    value >= 80
      ? "text-lime"
      : value >= 65
        ? "text-cyan"
        : value >= 50
          ? "text-gold"
          : value >= 40
            ? "text-peach"
            : "text-mythic";

  // Étiquette qualitative à droite de la valeur — pas que des chiffres
  const tag =
    value >= 85
      ? "Élite"
      : value >= 70
        ? "Solide"
        : value >= 55
          ? "Honnête"
          : value >= 40
            ? "À bosser"
            : "Talon d'Achille";

  return (
    <div className="rounded-2xl border border-ink/10 bg-bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{def.emoji}</span>
          <span className="font-display text-base font-black text-ink">
            {def.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`font-display text-xl font-black ${tone}`}>
            {value}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink-dim">
            {tag}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={def.label}
        className="mt-3 w-full accent-lime"
      />
      <p className="mt-2 text-[11px] text-ink-muted leading-snug">{def.hint}</p>
    </div>
  );
}
