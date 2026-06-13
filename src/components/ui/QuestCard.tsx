"use client";

// ====== QuestCard ======
// Card de quête utilisée sur la home (grilles daily/weekly). Progression
// recalculée en LIVE depuis les vraies sorties (esprit_manual_runs) via
// quest-progress.ts. Plus de XP fictif : la récompense est le badge si
// la quête en débloque un, sinon juste un "Done" propre.

import { useEffect, useState } from "react";
import type { Quest } from "@/lib/types";
import { computeQuestProgress } from "@/lib/quest-progress";

const periodStyles = {
  daily: { color: "border-cyan/40 bg-cyan/5", accent: "text-cyan", label: "DAILY" },
  weekly: { color: "border-violet/40 bg-violet/5", accent: "text-violet", label: "WEEKLY" },
  seasonal: { color: "border-peach/40 bg-peach/5", accent: "text-peach", label: "SAISON" },
  epic: { color: "border-gold/40 bg-gold/5", accent: "text-gold", label: "ÉPIQUE" },
} as const;

function timeLeft(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "expiré";
  const hours = Math.floor(diff / 3600_000);
  if (hours < 1) return `${Math.floor(diff / 60_000)}min`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}j`;
}

export default function QuestCard({ quest }: { quest: Quest }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setProgress(computeQuestProgress(quest));
    refresh();
    window.addEventListener("esprit:runs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit:runs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [quest]);

  const style = periodStyles[quest.period];
  const pct = mounted
    ? Math.min(100, Math.round((progress / Math.max(1, quest.target)) * 100))
    : 0;
  const done = mounted && progress >= quest.target;

  return (
    <div
      className={`clip-arcade rounded-xl border ${style.color} p-4 transition hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{quest.icon}</div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${style.accent}`}>
                {style.label} · {timeLeft(quest.expiresAt)}
              </div>
              <h3 className="font-display text-lg font-black leading-tight text-ink">
                {quest.title}
              </h3>
            </div>
            {done && (
              <span className="rounded-md bg-lime/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime">
                ✓ Done
              </span>
            )}
          </div>
          <p className="text-sm text-ink-muted">{quest.description}</p>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-ink-dim">
                {progress.toLocaleString("fr", { maximumFractionDigits: 1 })} /{" "}
                {quest.target.toLocaleString("fr")} {quest.unit}
              </span>
              <span className={style.accent}>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-bg-card">
              <div
                className={`h-full rounded-full transition-all ${
                  done
                    ? "bg-lime"
                    : quest.period === "daily"
                      ? "bg-cyan"
                      : quest.period === "weekly"
                        ? "bg-violet"
                        : quest.period === "seasonal"
                          ? "bg-peach"
                          : "bg-gold"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Récompense honnête : badge si débloquable, sinon rien (plus de XP fictif) */}
          {quest.badgeReward && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="rounded-md bg-gold/15 px-2 py-1 font-mono font-bold text-gold">
                🏅 Badge à débloquer
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
