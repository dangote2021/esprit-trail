// ====== STAT RADAR — hexagone FIFA / eFootball-style ======
// Composant PUR (SVG) utilisable en server component ET client component.
// Le wrapper avec tabs live dans StatRadarTabs.tsx ("use client").

import type { PhysioStats, TrailerStats } from "@/lib/types";

export type RadarAxis = {
  key: string;
  label: string; // court (3 lettres)
  longLabel: string; // affichage full
  value: number; // 0-100
  accent: "lime" | "peach" | "cyan" | "violet" | "gold" | "mythic";
};

export type RadarMode = "terrain" | "physio";

// ====== Mapping Terrain (compétences) ======
export function statsToRadar(s: TrailerStats): RadarAxis[] {
  const descente = Math.round(s.technique * 0.6 + s.vitesse * 0.4);
  return [
    { key: "end", label: "END", longLabel: "Endurance", value: s.endurance, accent: "peach" },
    { key: "mon", label: "MON", longLabel: "Montée", value: s.grimpe, accent: "cyan" },
    { key: "tec", label: "TEC", longLabel: "Technicité", value: s.technique, accent: "violet" },
    { key: "des", label: "DES", longLabel: "Descente", value: descente, accent: "mythic" },
    { key: "rou", label: "ROU", longLabel: "Roulant", value: s.vitesse, accent: "lime" },
    { key: "men", label: "MEN", longLabel: "Mental", value: s.mental, accent: "gold" },
  ];
}

// ====== Mapping Physio (forme physiologique) ======
export function physioToRadar(p: PhysioStats): RadarAxis[] {
  return [
    { key: "hrv", label: "HRV", longLabel: "Variabilité cardiaque", value: p.hrv, accent: "lime" },
    { key: "sle", label: "SOM", longLabel: "Sommeil 7j", value: p.sleep, accent: "cyan" },
    { key: "acu", label: "ACU", longLabel: "Charge aiguë 7j", value: p.acuteLoad, accent: "peach" },
    { key: "chr", label: "CHR", longLabel: "Charge chronique 28j", value: p.chronicLoad, accent: "violet" },
    { key: "frs", label: "FRS", longLabel: "Fraîcheur (TSB)", value: p.freshness, accent: "gold" },
    { key: "reg", label: "RÉG", longLabel: "Régularité 12 sem", value: p.regularity, accent: "mythic" },
  ];
}

/** Note globale sur 99 (style FIFA) — pondérée sur les 6 axes. */
export function overallRating(stats: TrailerStats): number {
  const axes = statsToRadar(stats);
  const avg = axes.reduce((s, a) => s + a.value, 0) / axes.length;
  return Math.max(40, Math.min(99, Math.round(avg * 0.99)));
}

// Esprit Trail Alpine Light — palette cohérente avec tailwind.config.ts
export const ACCENT_HEX: Record<string, string> = {
  lime: "#2d6a4f",
  peach: "#f77f00",
  cyan: "#0077b6",
  violet: "#7b2cbf",
  gold: "#dda15e",
  mythic: "#bc4749",
};

// ====== RADAR PURE (SVG) — server-safe ======
export function StatRadar({
  axes,
  size = 200,
  accent = "cyan",
}: {
  axes: RadarAxis[];
  size?: number;
  accent?: "lime" | "peach" | "cyan" | "violet" | "gold" | "mythic";
}) {
  const n = axes.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const dataPoints = axes.map((a, i) => {
    const angle = angleFor(i);
    const dist = (a.value / 100) * r;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
    };
  });

  const polygonPath =
    dataPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ") + " Z";

  const accentColor = ACCENT_HEX[accent] || ACCENT_HEX.cyan;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <circle cx={cx} cy={cy} r={r + 6} fill="#fff9ea" opacity={0.9} />

      {[0.33, 0.66, 1].map((ring, idx) => {
        const path =
          Array.from({ length: n })
            .map((_, i) => {
              const angle = angleFor(i);
              const x = cx + Math.cos(angle) * r * ring;
              const y = cy + Math.sin(angle) * r * ring;
              return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
            })
            .join(" ") + " Z";
        return (
          <path
            key={idx}
            d={path}
            fill="none"
            stroke="#52796f"
            strokeOpacity={idx === 2 ? 0.3 : 0.12}
            strokeWidth={1}
          />
        );
      })}

      {Array.from({ length: n }).map((_, i) => {
        const angle = angleFor(i);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#52796f"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        );
      })}

      <path
        d={polygonPath}
        fill={accentColor}
        fillOpacity={0.18}
        stroke={accentColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {axes.map((a, i) => {
        const angle = angleFor(i);
        const labelR = r + 18;
        const lx = cx + Math.cos(angle) * labelR;
        const ly = cy + Math.sin(angle) * labelR;
        const anchor =
          Math.abs(Math.cos(angle)) < 0.2
            ? "middle"
            : Math.cos(angle) > 0
              ? "start"
              : "end";
        return (
          <text
            key={a.key}
            x={lx}
            y={ly + 4}
            textAnchor={anchor}
            fontSize="11"
            fontWeight="900"
            fill="#52796f"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.04em"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
