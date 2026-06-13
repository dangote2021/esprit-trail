"use client";

// ====== WeekPlanCard ======
// Card "Ta semaine d'entraînement" sur la home. Affiche les séances de
// la semaine en cours du plan généré + permet de cocher comme faite.
// Si pas de plan : CTA pour en générer un sur /coach.
//
// Rétention : c'est l'élément qui fait revenir l'user le lendemain
// matin. Il voit ses séances restantes, il a envie de cocher.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadPlan,
  currentWeekIndex,
  isSessionDone,
  markSessionDone,
  unmarkSessionDone,
  PLAN_EVENT,
  type StoredPlan,
  type StoredSession,
} from "@/lib/coach-plan";

const TYPE_META: Record<
  StoredSession["type"],
  { label: string; color: string; icon: string }
> = {
  easy: { label: "Endurance", color: "text-cyan", icon: "🚶" },
  long: { label: "Sortie longue", color: "text-peach", icon: "🏃" },
  interval: { label: "Fractionné", color: "text-lime", icon: "⚡" },
  hill: { label: "Côtes", color: "text-violet", icon: "⛰️" },
  tempo: { label: "Tempo", color: "text-gold", icon: "🎯" },
  strength: { label: "Renfo", color: "text-violet", icon: "💪" },
  rest: { label: "Repos", color: "text-ink-muted", icon: "😌" },
  race: { label: "Course !", color: "text-mythic", icon: "🏁" },
};

function fmtDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, "0")}`;
  }
  return `${min} min`;
}

export default function WeekPlanCard() {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<StoredPlan | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const refresh = () => {
      setPlan(loadPlan());
      setTick((t) => t + 1);
    };
    refresh();
    window.addEventListener(PLAN_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PLAN_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) return null;

  // === Pas de plan → CTA fort vers /coach ===
  if (!plan) {
    return (
      <Link
        href="/coach"
        className="relative block overflow-hidden rounded-3xl border-2 border-cyan/40 bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-5 card-chunky tap-bounce"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan/20 text-2xl">
            🧠
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
              Coach IA · 2 min
            </div>
            <div className="mt-0.5 font-display text-lg font-black text-ink leading-tight">
              Génère ton plan d&apos;entraînement
            </div>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              Une fois ton plan dans ton cockpit, tu verras ta séance du jour
              ici. Boucle de rétention enclenchée.
            </p>
          </div>
          <div className="text-cyan text-2xl">→</div>
        </div>
      </Link>
    );
  }

  const weekIdx = currentWeekIndex(plan);

  // === Plan terminé ===
  if (weekIdx === null) {
    return (
      <Link
        href="/coach"
        className="relative block overflow-hidden rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-gold/15 via-bg-card to-bg p-5 card-chunky tap-bounce"
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">🏆</div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-gold">
              Plan terminé · {plan.goalLabel}
            </div>
            <div className="mt-0.5 font-display text-lg font-black text-ink leading-tight">
              Tu as fini ton plan {plan.totalWeeks} semaines
            </div>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              Génère le prochain ou pose-toi 1 semaine — t&apos;as bossé.
            </p>
          </div>
          <div className="text-gold text-2xl">→</div>
        </div>
      </Link>
    );
  }

  const week = plan.plan[weekIdx];
  if (!week) return null;
  void tick;

  const doneCount = week.sessions.filter((_, i) => isSessionDone(weekIdx, i)).length;
  const totalSessions = week.sessions.length;
  const allDone = doneCount === totalSessions;

  function handleToggle(idx: number) {
    if (isSessionDone(weekIdx as number, idx)) {
      unmarkSessionDone(weekIdx as number, idx);
    } else {
      markSessionDone(weekIdx as number, idx);
    }
    setTick((t) => t + 1);
  }

  return (
    <section className="rounded-3xl border-2 border-cyan/35 bg-gradient-to-br from-cyan/8 via-bg-card to-bg p-5 card-chunky space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            Ta semaine · {week.block}
          </div>
          <div className="mt-0.5 font-display text-lg font-black text-ink leading-tight">
            Semaine {weekIdx + 1} / {plan.totalWeeks}
          </div>
          <div className="text-[11px] text-ink-muted">{week.focus}</div>
        </div>
        <div
          className={`shrink-0 rounded-lg border-2 px-2 py-1 text-center ${
            allDone
              ? "border-lime/50 bg-lime/15 text-lime"
              : "border-cyan/40 bg-cyan/10 text-cyan"
          }`}
        >
          <div className="font-display text-xl font-black leading-none">
            {doneCount}/{totalSessions}
          </div>
          <div className="text-[8px] font-mono uppercase mt-0.5">séances</div>
        </div>
      </div>

      {/* Sessions de la semaine */}
      <div className="space-y-1.5">
        {week.sessions.map((s, i) => {
          const meta = TYPE_META[s.type];
          const done = isSessionDone(weekIdx, i);
          return (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                done
                  ? "border-lime/40 bg-lime/8 opacity-75"
                  : "border-ink/10 bg-bg-card/80 hover:border-cyan/40"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${done ? "bg-lime text-bg" : "bg-bg-raised text-ink-muted"}`}
              >
                {done ? "✓" : meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[12px] font-bold ${done ? "line-through text-ink-muted" : "text-ink"} truncate`}
                >
                  {s.title}
                </div>
                <div className="text-[10px] font-mono text-ink-dim">
                  {meta.label} · {fmtDuration(s.duration)}
                  {s.distance ? ` · ${s.distance} km` : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip + lien plan complet */}
      <div className="rounded-lg bg-bg-card/60 border border-ink/8 p-2 text-[11px] text-ink-muted leading-relaxed">
        💡 {week.coachTip}
      </div>
      <Link
        href="/coach/plan"
        className="block text-center text-[11px] font-mono text-cyan hover:underline"
      >
        Voir tout le plan →
      </Link>
    </section>
  );
}
