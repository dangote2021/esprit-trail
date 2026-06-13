"use client";

// ====== DailyQuestHero ======
// Card "Quête du jour" en haut de la home. **Progression câblée aux VRAIES
// sorties** (esprit_manual_runs) via quest-progress.ts. Plus jamais 0/5 km
// après un vrai run — le moteur de rétention principal est vivant.
//
// Stratégie de sélection : on prend la quête daily la plus AVANCÉE (% le
// plus haut). Si l'user a fait 4 km, "Récup active 4/5" s'affiche — il
// finira son km pour cocher → boucle dopamine.

import { useEffect, useState } from "react";
import Link from "next/link";
import { questsForPeriod } from "@/lib/data/quests";
import { computeQuestProgress } from "@/lib/quest-progress";

export default function DailyQuestHero() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener("esprit:runs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit:runs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) {
    return (
      <div
        className="block min-h-[160px] rounded-3xl border-2 border-lime/25 p-5 card-chunky animate-pulse"
        style={{
          background:
            "linear-gradient(135deg, rgba(149,213,178,0.15) 0%, rgba(254,250,224,0.3) 100%)",
        }}
      />
    );
  }

  const daily = questsForPeriod("daily");
  if (daily.length === 0) return null;

  // Recalcule la progression de chaque quête depuis les vraies sorties,
  // puis prend la plus avancée pour maximiser le sentiment de progrès.
  const ranked = daily
    .map((q) => ({ q, progress: computeQuestProgress(q) }))
    .sort((a, b) => {
      const pa = a.progress / Math.max(1, a.q.target);
      const pb = b.progress / Math.max(1, b.q.target);
      if (pa >= 1 && pb < 1) return 1;
      if (pb >= 1 && pa < 1) return -1;
      return pb - pa;
    });
  const { q, progress } = ranked[0];
  void tick;
  const pct = Math.min(100, Math.round((progress / Math.max(1, q.target)) * 100));
  const done = progress >= q.target;

  return (
    <Link
      href="/quests"
      className="relative block overflow-hidden rounded-3xl border-2 border-lime/45 p-5 card-chunky tap-bounce"
      style={{
        background:
          "linear-gradient(135deg, rgba(149,213,178,0.25) 0%, rgba(181,212,244,0.20) 55%, rgba(254,250,224,0.4) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(149,213,178,0.55) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime text-bg card-chunky wobble shadow-glow-lime">
          <span className="text-3xl">{q.icon || "🎯"}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-lime/25 text-lime px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
            🎯 Quête du jour
            {done && (
              <span className="text-bg bg-lime px-1.5 rounded-sm">✓ DONE</span>
            )}
          </div>
          <div className="mt-1 font-display text-xl font-black leading-tight text-ink">
            {q.title}
          </div>
          <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
            {q.description}
          </p>
        </div>
      </div>

      {/* Progress réel calculé depuis les vraies sorties */}
      <div className="relative mt-3 space-y-1.5">
        <div className="flex items-end justify-between text-[10px] font-mono">
          <span className="font-bold uppercase tracking-wider text-ink-muted">
            Progression
          </span>
          <span className="font-bold text-lime">
            {progress.toLocaleString("fr", { maximumFractionDigits: 1 })} /{" "}
            {q.target}{" "}
            <span className="text-ink-dim">{q.unit || ""}</span>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-raised/60">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: done
                ? "linear-gradient(90deg, #95d5b2 0%, #2d6a4f 60%, #1b4332 100%)"
                : "linear-gradient(90deg, #95d5b2 0%, #2d6a4f 100%)",
            }}
          />
        </div>
        {q.badgeReward && (
          <div className="flex items-center justify-end pt-1">
            <span className="text-[10px] font-mono text-gold/80">
              🏅 Badge à débloquer
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
