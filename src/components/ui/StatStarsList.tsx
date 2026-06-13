// ====== StatStarsList — forces/faiblesses en étoiles ======
// Affiche les 6 attributs du traileur en lignes avec 5 étoiles chacune.
// Étoile pleine = stat élevée. Style classique RPG "fiche personnage".

import { statsToRadar, type RadarAxis } from "./StatRadar";
import type { TrailerStats } from "@/lib/types";

const COLOR_BY_BUCKET = [
  // 0-1 star : trail-zero, rouge mythic
  { fill: "#A02828", text: "text-mythic" },
  // 2 stars : peach
  { fill: "#F77F00", text: "text-peach" },
  // 3 stars : gold
  { fill: "#E8B547", text: "text-gold" },
  // 4 stars : cyan
  { fill: "#5AC8D8", text: "text-cyan" },
  // 5 stars : lime
  { fill: "#9CCC65", text: "text-lime" },
];

function valueToStars(value: number): number {
  // 0-19 = 1 étoile, 20-39 = 2, 40-59 = 3, 60-79 = 4, 80+ = 5
  if (value >= 80) return 5;
  if (value >= 60) return 4;
  if (value >= 40) return 3;
  if (value >= 20) return 2;
  return 1;
}

export function StatStarsList({ stats }: { stats: TrailerStats }) {
  const axes = statsToRadar(stats);
  return (
    <div className="rounded-2xl bg-bg-card p-4 card-chunky">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Forces & faiblesses
        </div>
        <div className="text-[10px] font-mono text-ink-dim">/ 5</div>
      </div>
      <div className="space-y-2">
        {axes.map((a) => (
          <StarRow key={a.key} axis={a} />
        ))}
      </div>
    </div>
  );
}

function StarRow({ axis }: { axis: RadarAxis }) {
  const stars = valueToStars(axis.value);
  const colorIdx = Math.min(stars - 1, COLOR_BY_BUCKET.length - 1);
  const color = COLOR_BY_BUCKET[colorIdx];

  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 text-sm font-bold text-ink">
        {axis.longLabel}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= stars} fillColor={color.fill} />
        ))}
      </div>
      <span
        className={`w-7 text-right font-mono text-xs font-black ${color.text}`}
      >
        {stars}
      </span>
    </div>
  );
}

function Star({
  filled,
  fillColor,
}: {
  filled: boolean;
  fillColor: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? fillColor : "transparent"}
      stroke={filled ? fillColor : "#52796F"}
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 2 L14.7 8.9 L22 9.6 L16.3 14.5 L18.2 22 L12 18 L5.8 22 L7.7 14.5 L2 9.6 L9.3 8.9 Z" />
    </svg>
  );
}
