// ====== STAT RADAR TABS — wrapper client avec switch Terrain / Physio ======
// "use client" pour le useState. Le radar lui-même (StatRadar) reste server-safe.

"use client";

import { useState } from "react";
import {
  StatRadar,
  statsToRadar,
  physioToRadar,
  type RadarMode,
} from "./StatRadar";
import type { PhysioStats, TrailerStats } from "@/lib/types";

export function StatRadarTabs({
  terrain,
  physio,
  size = 200,
  defaultMode = "terrain",
}: {
  terrain: TrailerStats;
  physio?: PhysioStats;
  size?: number;
  defaultMode?: RadarMode;
}) {
  const [mode, setMode] = useState<RadarMode>(defaultMode);
  const hasPhysio = !!physio;

  const axes = mode === "terrain" ? statsToRadar(terrain) : physioToRadar(physio!);
  const accent: "lime" | "peach" | "cyan" | "violet" | "gold" | "mythic" =
    mode === "terrain" ? "cyan" : "lime";

  return (
    <div className="space-y-3">
      {/* Tabs header */}
      <div className="mx-auto inline-flex rounded-xl border-2 border-ink/15 bg-bg-card/70 p-1">
        <TabButton
          active={mode === "terrain"}
          onClick={() => setMode("terrain")}
          label="Terrain"
          subLabel="Compétences"
        />
        <TabButton
          active={mode === "physio"}
          onClick={() => hasPhysio && setMode("physio")}
          disabled={!hasPhysio}
          label="Physio"
          subLabel={hasPhysio ? "Forme" : "Sync requise"}
        />
      </div>

      <div className="flex justify-center">
        <StatRadar axes={axes} size={size} accent={accent} />
      </div>

      {/* Legend — sous-texte contextuel selon le mode */}
      <div className="rounded-lg border border-ink/10 bg-bg-card/40 px-3 py-2 text-[11px] text-ink-muted leading-relaxed">
        {mode === "terrain" ? (
          <>
            <strong className="text-ink">Compétences terrain.</strong> Tes forces sur le terrain (dérivées de tes sorties).
          </>
        ) : (
          <>
            <strong className="text-ink">Forme physiologique.</strong> HRV, sommeil, charge aiguë/chronique, TSB (fraîcheur) et régularité. Données remontées via Strava.
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  subLabel,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  subLabel: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center rounded-lg px-4 py-1.5 transition ${
        active
          ? "bg-lime text-bg shadow-glow-lime"
          : disabled
            ? "text-ink-dim cursor-not-allowed"
            : "text-ink-muted hover:text-ink"
      }`}
    >
      <span className="font-display text-sm font-black uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[9px] font-mono uppercase tracking-widest opacity-80">
        {subLabel}
      </span>
    </button>
  );
}
