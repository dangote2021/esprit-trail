"use client";

// ====== StatRadarEditable ======
// Affiche un radar hexagonal FIFA-style avec 2 onglets :
//   • Terrain — endurance, montée, technicité, roulant, mental, descente.
//     Auto-évaluable par sliders (sondage perso, override localStorage).
//   • Physio — HRV, sommeil, charge aiguë, charge fond, fraîcheur, régularité.
//     Lecture seule (alimenté par Strava — sera live quand brancher backend).
//
// Retour Marco (32, panel test) : "6 axes c'est peut-être un peu fouillis.
// Vous pourriez splitter Forme physio vs Tech terrain en 2 radars distincts ?"

import { useEffect, useState } from "react";
import { StatRadar, statsToRadar, type RadarAxis } from "@/components/ui/StatRadar";
import type { TrailerStats } from "@/lib/types";
import { ME } from "@/lib/data/me";

const KEY = "esprit_stats_override";

type RadarTab = "terrain" | "physio";

const PHYSIO_AXES: { key: keyof NonNullable<typeof ME.physio>; label: string; longLabel: string; accent: RadarAxis["accent"] }[] = [
  { key: "hrv", label: "HRV", longLabel: "Variabilité card.", accent: "cyan" },
  { key: "sleep", label: "Sommeil", longLabel: "Sommeil", accent: "violet" },
  { key: "acuteLoad", label: "Aigu", longLabel: "Charge aiguë (7j)", accent: "peach" },
  { key: "chronicLoad", label: "Fond", longLabel: "Charge fond (28j)", accent: "lime" },
  { key: "freshness", label: "Frais", longLabel: "Fraîcheur (TSB)", accent: "gold" },
  { key: "regularity", label: "Régul.", longLabel: "Régularité", accent: "mythic" },
];

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
  const [tab, setTab] = useState<RadarTab>("terrain");

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
    // Petit feedback haptique sur mobile à chaque cran de slider
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(5);
      } catch {
        /* ignore */
      }
    }
  }

  const terrainAxes: RadarAxis[] = statsToRadar(stats);
  // Physio axes — depuis ME.physio (read-only). Tous les champs sont dans la
  // même échelle 0-100 donc on les map direct sur le radar.
  const physio = ME.physio;
  const physioAxes: RadarAxis[] = physio
    ? PHYSIO_AXES.map((p) => ({
        key: p.key,
        label: p.label,
        longLabel: p.longLabel,
        value: physio[p.key],
        accent: p.accent,
      }))
    : [];

  const axes = tab === "terrain" ? terrainAxes : physioAxes;
  const overall = axes.length
    ? Math.round(axes.reduce((s, a) => s + a.value, 0) / axes.length)
    : 0;

  return (
    <section className="rounded-2xl bg-bg-card p-4 card-chunky">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          {tab === "terrain" ? "Forces & faiblesses" : "Forme & physio"}
        </div>
        {tab === "terrain" && (
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
        )}
      </div>

      {/* Onglets Terrain / Physio — retour Marco panel test */}
      <div className="mb-3 flex gap-1 rounded-xl bg-bg-raised/50 p-1">
        <button
          type="button"
          onClick={() => {
            setTab("terrain");
            setEditMode(false);
          }}
          className={`flex-1 rounded-lg px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition ${
            tab === "terrain"
              ? "bg-cyan/15 text-cyan border border-cyan/40"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          🏔️ Terrain
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("physio");
            setEditMode(false);
          }}
          className={`flex-1 rounded-lg px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition ${
            tab === "physio"
              ? "bg-violet/15 text-violet border border-violet/40"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          🫀 Physio
        </button>
      </div>

      <div className="flex items-center justify-center relative">
        {/* Radar SVG — accent change selon l'onglet */}
        <StatRadar
          axes={axes}
          size={240}
          accent={tab === "terrain" ? "cyan" : "violet"}
        />

        {/* Note globale FIFA-style au centre */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          title="Moyenne pondérée de tes 6 attributs trail"
        >
          <div className="text-[9px] font-mono uppercase tracking-widest text-ink-muted">
            Note
          </div>
          <div className="font-display text-3xl font-black text-cyan leading-none mt-0.5">
            {overall}
          </div>
          <div className="text-[9px] font-mono text-ink-dim mt-0.5">/ 100</div>
        </div>
      </div>

      {/* Sous-titre explicatif sous le radar */}
      <p className="mt-2 text-center text-[10px] font-mono text-ink-dim leading-relaxed">
        {tab === "terrain"
          ? "Note moyenne pondérée sur tes 6 attributs trail."
          : "Stats physio remontées depuis Strava (HRV, sommeil, charge, fraîcheur)."}
        {hydrated && tab === "terrain" && (
          <span className="block">
            Catégorie :{" "}
            <strong className="text-ink-muted">
              {overall >= 85
                ? "🥇 Élite"
                : overall >= 70
                  ? "🏔️ Confirmé"
                  : overall >= 55
                    ? "🥾 Intermédiaire"
                    : "🌱 Débutant"}
            </strong>
          </span>
        )}
        {hydrated && tab === "physio" && (
          <span className="block">
            Forme générale :{" "}
            <strong className="text-ink-muted">
              {overall >= 75
                ? "💪 Excellente"
                : overall >= 60
                  ? "✓ Bonne"
                  : overall >= 45
                    ? "⚠️ À surveiller"
                    : "🩹 Récup obligatoire"}
            </strong>
          </span>
        )}
      </p>

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

      {/* Mode édition : sliders pour auto-évaluation (Terrain uniquement) */}
      {hydrated && editMode && tab === "terrain" && (
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
                max={100}
                step={5}
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
