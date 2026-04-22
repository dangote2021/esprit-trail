// ====== FIFA STAT LIST — liste détaillée style eFootball ======
// Chaque stat avec boîte colorée selon le niveau (vert 80+, jaune 65+, orange 50+, rouge <50).

import { statsToRadar, type RadarAxis } from "./StatRadar";
import type { TrailerStats } from "@/lib/types";

function colorFor(value: number) {
  if (value >= 80) return { bg: "bg-lime", text: "text-bg" };
  if (value >= 65) return { bg: "bg-cyan", text: "text-bg" };
  if (value >= 50) return { bg: "bg-gold", text: "text-bg" };
  if (value >= 40) return { bg: "bg-peach", text: "text-bg" };
  return { bg: "bg-mythic", text: "text-white" };
}

export function FifaStatList({ stats }: { stats: TrailerStats }) {
  const axes = statsToRadar(stats);
  return (
    <div className="rounded-2xl bg-bg-card p-4 card-chunky">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Attributs du traileur
        </div>
        <div className="text-[10px] font-mono text-ink-dim">/ 100</div>
      </div>
      <div className="space-y-1.5">
        {axes.map((a) => (
          <StatRow key={a.key} axis={a} />
        ))}
      </div>
    </div>
  );
}

function StatRow({ axis }: { axis: RadarAxis }) {
  const { bg, text } = colorFor(axis.value);
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 text-sm font-bold text-ink">
        {axis.longLabel}
      </span>
      {/* Barre de progression pleine */}
      <div className="relative h-2 w-20 overflow-hidden rounded-full bg-bg-raised">
        <div
          className={bg}
          style={{
            height: "100%",
            width: `${axis.value}%`,
          }}
        />
      </div>
      {/* Boîte chiffre */}
      <div className={`flex h-7 w-10 items-center justify-center rounded-md ${bg} font-display text-sm font-black ${text}`}>
        {axis.value}
      </div>
    </div>
  );
}
