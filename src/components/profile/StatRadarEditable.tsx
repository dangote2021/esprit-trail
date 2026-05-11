"use client";

// ====== StatRadarEditable ======
// Affiche le radar hexagonal FIFA-style des forces/faiblesses + sliders
// d'auto-évaluation. Override stocké en localStorage (esprit_stats_override).
// L'utilisateur peut ajuster ses stats lui-même (sondage personnel).

import { useEffect, useState } from "react";
import { StatRadar, statsToRadar, type RadarAxis } from "@/components/ui/StatRadar";
import type { TrailerStats } from "@/lib/types";

const KEY = "esprit_stats_override";

const STAT_LABELS: { key: keyof TrailerStats; label: string; color: string }[] = [
  { key: "endurance", label: "Endurance", color: "#f77f00" },
  { key: "grimpe", label: "Montée", color: "#0077b6" },
  { key: "technique", label: "Technicité", color: "#7b2cbf" },
  { key: "vitesse", label: "Roulant", color: "#2d6a4f" },
  { key: "mental", label: "Mental", color: "#dda15e" },
];
// "Descente" est calculée à partir de technique + vitesse → pas éditable direct

function loadOverride(): Partial<TrailerStats> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveOverride(stats: Partial<TrailerStats>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export default function StatRadarEditable({
  baseStats,
}: {
  baseStats: TrailerStats;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [stats, setStats] = useState<TrailerStats>(baseStats);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const override = loadOverride();
    if (override) {
      setStats({ ...baseStats, ...override });
    }
  }, [baseStats]);

  function updateStat(key: keyof TrailerStats, value: number) {
    const next: TrailerStats = { ...stats, [key]: value };
    setStats(next);
    saveOverride(next);
  }

  const axes: RadarAxis[] = statsToRadar(stats);
  const overall = Math.round(
    axes.reduce((s, a) => s + a.value, 0) / axes.length,
  );

  return (
    <section className="rounded-2xl bg-bg-card p-4 card-chunky">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Forces & faiblesses
        </div>
        <button
          onClick={() => setEditMode((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider transition ${
            editMode
              ? "bg-lime text-bg"
              : "border border-lime/40 text-lime hover:bg-lime/10"
          }`}
        >
          {editMode ? "✓ Terminé" : "✎ Auto-évaluer"}
        </button>
      </div>

      <div className="flex items-center justify-center relative">
        {/* Radar SVG */}
        <StatRadar axes={axes} size={240} accent="cyan" />

        {/* Note globale FIFA-style au centre */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[9px] font-mono uppercase tracking-widest text-ink-muted">
            Note
          </div>
          <div className="font-display text-3xl font-black text-cyan leading-none mt-0.5">
            {overall}
          </div>
          <div className="text-[9px] font-mono text-ink-dim mt-0.5">/ 100</div>
        </div>
      </div>

      {/* Légende des 6 axes en grille */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono">
        {axes.map((a) => (
          <div
            key={a.key}
            className="flex items-center gap-1.5 rounded-md bg-bg-raised/50 px-2 py-1"
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: getColor(a.accent) }}
            />
            <span className="truncate text-ink">{a.longLabel}</span>
            <span className="ml-auto font-black text-ink-muted">{a.value}</span>
          </div>
        ))}
      </div>

      {/* Mode édition : sliders pour auto-évaluation */}
      {hydrated && editMode && (
        <div className="mt-4 space-y-3 rounded-xl border-2 border-lime/30 bg-lime/5 p-3">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Ajuste tes points forts / faibles
          </div>
          {STAT_LABELS.map((s) => (
            <div key={s.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink">{s.label}</span>
                <span
                  className="font-mono font-black"
                  style={{ color: s.color }}
                >
                  {stats[s.key]}
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={99}
                step={1}
                value={stats[s.key]}
                onChange={(e) => updateStat(s.key, parseInt(e.target.value, 10))}
                className="mt-1 w-full accent-lime"
                style={{
                  // @ts-ignore CSS var
                  "--track-color": s.color,
                }}
                aria-label={`Ajuster ${s.label}`}
              />
            </div>
          ))}
          <p className="text-[10px] text-ink-muted leading-relaxed pt-1">
            ℹ️ Tes ajustements sont sauvegardés sur ton appareil. La
            « Descente » est calculée auto à partir de Technicité + Roulant.
          </p>
        </div>
      )}
    </section>
  );
}

function getColor(accent: RadarAxis["accent"]): string {
  const map: Record<RadarAxis["accent"], string> = {
    lime: "#2d6a4f",
    peach: "#f77f00",
    cyan: "#0077b6",
    violet: "#7b2cbf",
    gold: "#dda15e",
    mythic: "#bc4749",
  };
  return map[accent] || "#0077b6";
}
