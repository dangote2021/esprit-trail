// ====== FORM ARROW — indicateur de forme style FIFA ======
// ↑ vert : en forme / ↗ lime : progression / → gold : stable
// ↘ peach : baisse / ↓ mythic : fatigue

import type { Run } from "@/lib/types";

export type FormTrend = "peak" | "rising" | "stable" | "dropping" | "fatigued";

const TREND_META: Record<FormTrend, {
  arrow: string;
  label: string;
  bg: string;
  text: string;
  rotate: string;
}> = {
  peak:      { arrow: "↑", label: "EN FEU",    bg: "bg-lime",    text: "text-bg", rotate: "rotate-0" },
  rising:    { arrow: "↗", label: "MONTÉE",    bg: "bg-cyan",    text: "text-bg", rotate: "rotate-0" },
  stable:    { arrow: "→", label: "STABLE",    bg: "bg-gold",    text: "text-bg", rotate: "rotate-0" },
  dropping:  { arrow: "↘", label: "BAISSE",    bg: "bg-peach",   text: "text-bg", rotate: "rotate-0" },
  fatigued:  { arrow: "↓", label: "FATIGUE",   bg: "bg-mythic",  text: "text-white", rotate: "rotate-0" },
};

export function FormArrow({ trend, compact = false }: { trend: FormTrend; compact?: boolean }) {
  const meta = TREND_META[trend];
  if (compact) {
    return (
      <div
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${meta.bg} ${meta.text} card-chunky font-display text-base font-black`}
        title={meta.label}
      >
        {meta.arrow}
      </div>
    );
  }
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full ${meta.bg} ${meta.text} card-chunky px-2.5 py-1`}>
      <span className="font-display text-base font-black leading-none">{meta.arrow}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">
        {meta.label}
      </span>
    </div>
  );
}

/**
 * Calcule la tendance de forme à partir des runs récents.
 * Compare volume (km) des 14 derniers jours vs les 14 précédents.
 */
export function computeFormTrend(runs: Run[]): FormTrend {
  const now = Date.now();
  const d14 = 14 * 86_400_000;

  const recent = runs.filter((r) => {
    const t = new Date(r.date).getTime();
    return now - t <= d14;
  });
  const prev = runs.filter((r) => {
    const t = new Date(r.date).getTime();
    return now - t > d14 && now - t <= 2 * d14;
  });

  const recentKm = recent.reduce((s, r) => s + r.distance, 0);
  const prevKm = prev.reduce((s, r) => s + r.distance, 0);

  if (recent.length === 0) return "fatigued";
  if (prevKm === 0 && recentKm > 0) return "rising";

  const ratio = recentKm / Math.max(1, prevKm);

  if (ratio >= 1.3 && recent.length >= 4) return "peak";
  if (ratio >= 1.1) return "rising";
  if (ratio >= 0.85) return "stable";
  if (ratio >= 0.6) return "dropping";
  return "fatigued";
}
