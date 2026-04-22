"use client";

// ====== PLAN COACH IA — version LIVE ======
// Appelle /api/coach/plan (Claude Sonnet 4.6) avec le profil ME et l'objectif
// sélectionné sur /coach. Affiche loading + plan généré + semaines switcher.

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ME, MY_RUNS } from "@/lib/data/me";

type Goal =
  | "first-10k"
  | "first-trail"
  | "improve-marathon"
  | "first-ultra"
  | "utmb-qualif"
  | "lose-weight"
  | "rebuild"
  | "custom";

type ApiSession = {
  type: "easy" | "long" | "interval" | "hill" | "rest" | "race";
  title: string;
  duration: number;
  distance?: number;
  elevation?: number;
  intensity: "low" | "moderate" | "high";
  notes?: string;
};

type ApiWeek = {
  week: number;
  phase: "foundation" | "build" | "peak" | "taper" | "race";
  label: string;
  focus: string;
  weeklyKm: number;
  weeklyElevation: number;
  sessions: ApiSession[];
  coachTip: string;
};

type ApiPlan = {
  ok: boolean;
  goal: Goal;
  totalWeeks: number;
  generatedAt: string;
  source: string;
  summary?: string;
  plan: ApiWeek[];
};

const GOAL_META: Record<Goal, { label: string; emoji: string; distance: string }> = {
  "first-10k": { label: "Mon premier 10K", emoji: "🏁", distance: "10 km" },
  "first-trail": { label: "Mon premier trail", emoji: "🌲", distance: "20-30 km" },
  "improve-marathon": { label: "Battre mon marathon", emoji: "⚡", distance: "42 km" },
  "first-ultra": { label: "Mon premier ultra", emoji: "🔥", distance: "50-80 km" },
  "utmb-qualif": { label: "Qualif UTMB", emoji: "👑", distance: "100 km+" },
  "lose-weight": { label: "Forme et santé", emoji: "💚", distance: "" },
  rebuild: { label: "Retour après blessure", emoji: "🩹", distance: "" },
  custom: { label: "Objectif perso", emoji: "🎯", distance: "" },
};

const TYPE_META: Record<
  ApiSession["type"],
  { label: string; color: string; icon: string }
> = {
  easy: { label: "Endurance", color: "text-cyan border-cyan/30 bg-cyan/5", icon: "🚶" },
  long: { label: "Sortie longue", color: "text-peach border-peach/30 bg-peach/5", icon: "🏃" },
  interval: { label: "Fractionné", color: "text-lime border-lime/30 bg-lime/5", icon: "⚡" },
  hill: { label: "Côtes / D+", color: "text-violet border-violet/30 bg-violet/5", icon: "⛰️" },
  rest: { label: "Repos", color: "text-ink-muted border-ink/20 bg-bg-card/40", icon: "😌" },
  race: { label: "Course !", color: "text-mythic border-mythic/40 bg-mythic/5", icon: "🏁" },
};

const PHASE_META: Record<
  ApiWeek["phase"],
  { color: string; label: string; desc: string }
> = {
  foundation: {
    color: "text-cyan",
    label: "Foundation",
    desc: "Construction de la base aérobie",
  },
  build: {
    color: "text-peach",
    label: "Build",
    desc: "Montée en charge, intensité spécifique",
  },
  peak: {
    color: "text-mythic",
    label: "Peak",
    desc: "Pic de forme, volume max",
  },
  taper: {
    color: "text-lime",
    label: "Taper",
    desc: "Affûtage, on retire de la charge",
  },
  race: { color: "text-gold", label: "Race", desc: "Jour J" },
};

function formatDuration(mins: number) {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
  }
  return `${mins} min`;
}

/** Stats terrain calculées depuis l'historique runs ME. */
function computeLevelFromMe() {
  const runs = MY_RUNS;
  const now = Date.now();
  const d28 = 28 * 86_400_000;
  const recent = runs.filter((r) => now - new Date(r.date).getTime() <= d28);
  const weeklyKm = Math.round(recent.reduce((s, r) => s + r.distance, 0) / 4) || 30;
  const weeklyElevation =
    Math.round(recent.reduce((s, r) => s + r.elevation, 0) / 4) || 800;
  const longestRun = runs.reduce((m, r) => Math.max(m, r.distance), 0) || 15;
  return { weeklyKm, weeklyElevation, longestRun };
}

function CoachPlanInner() {
  const sp = useSearchParams();
  const goal = (sp.get("goal") as Goal) || "first-ultra";
  const [plan, setPlan] = useState<ApiPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekIdx, setWeekIdx] = useState(0);

  const level = useMemo(() => computeLevelFromMe(), []);
  const meta = GOAL_META[goal];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/coach/plan", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            goal,
            currentLevel: level,
            constraints: {
              weeklyAvailability: 4,
              terrain: "mountain",
            },
            freeText: `Traileur ${ME.profile?.trailerClass || "alpiniste"} · niveau ${ME.level} · UTMB index ${ME.connections.utmb?.runnerIndex || 0} · ITRA ${ME.connections.itra.performanceIndex}`,
          }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: ApiPlan = await res.json();
        if (cancelled) return;
        if (!data.ok || !data.plan) throw new Error("Réponse plan invalide");
        setPlan(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message || "Erreur de génération");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [goal, level]);

  const current = plan?.plan?.[weekIdx];
  const phase = current ? PHASE_META[current.phase] : null;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/coach"
          className="rounded-xl card-chunky bg-bg-card p-2 text-ink-muted hover:text-cyan transition tap-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            Plan généré par Claude
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            {meta.emoji} {meta.label}
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Loading state */}
      {loading && (
        <section className="rounded-3xl bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-6 card-chunky card-shine">
          <div className="flex items-start gap-4">
            <div className="text-5xl animate-float">🧠</div>
            <div className="flex-1">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                Claude Sonnet 4.6 · en réflexion
              </div>
              <h2 className="mt-1 font-display text-xl font-black leading-tight">
                Je conçois ton plan sur mesure…
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Analyse de tes {MY_RUNS.length} sorties récentes, volume{" "}
                {level.weeklyKm} km/sem, UTMB Index{" "}
                {ME.connections.utmb?.runnerIndex || "—"}, plus longue sortie{" "}
                {level.longestRun} km.
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg-raised">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-cyan" />
              </div>
              <div className="mt-2 text-[10px] font-mono text-ink-dim">
                Génération ~15 à 30 secondes
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {!loading && error && (
        <section className="rounded-3xl bg-mythic/10 border-2 border-mythic p-5 card-chunky">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-mythic">
            Erreur génération
          </div>
          <p className="mt-1 text-sm text-ink-muted">{error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-3 rounded-xl bg-mythic text-white px-4 py-2 font-display text-sm font-black card-chunky tap-bounce"
          >
            Réessayer
          </button>
        </section>
      )}

      {/* Plan content */}
      {!loading && plan && current && phase && (
        <>
          {/* Summary */}
          <section className="rounded-3xl bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-5 card-chunky card-shine">
            <div className="flex items-start gap-3">
              <div className="text-4xl">{meta.emoji}</div>
              <div className="flex-1">
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                  Objectif · {meta.distance}
                </div>
                <div className="mt-1 font-display text-xl font-black leading-tight">
                  {meta.label}
                </div>
                {plan.summary && (
                  <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                    {plan.summary}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">Durée</div>
                <div className="font-display text-base font-black text-cyan">
                  {plan.totalWeeks} sem.
                </div>
              </div>
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">Vol. pic</div>
                <div className="font-display text-base font-black text-peach">
                  {Math.max(...plan.plan.map((w) => w.weeklyKm))} km
                </div>
              </div>
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">D+ pic</div>
                <div className="font-display text-base font-black text-violet">
                  {Math.max(...plan.plan.map((w) => w.weeklyElevation))}m
                </div>
              </div>
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">Séances</div>
                <div className="font-display text-base font-black text-lime">
                  {Math.round(
                    plan.plan.reduce((s, w) => s + w.sessions.length, 0) /
                      plan.plan.length
                  )}
                  /s
                </div>
              </div>
            </div>

            <div className="mt-3 text-[9px] font-mono text-ink-dim">
              Source : {plan.source}
            </div>
          </section>

          {/* Week switcher */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-[10px] font-mono font-black uppercase tracking-widest ${phase.color}`}
                >
                  Phase {phase.label}
                </div>
                <div className="font-display text-xl font-black">
                  {current.label}
                </div>
                <div className="text-xs text-ink-muted">{current.focus}</div>
              </div>
              <div className="text-right text-[10px] font-mono text-ink-dim">
                {current.weeklyKm} km · {current.weeklyElevation}m D+
              </div>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {plan.plan.map((w, i) => (
                <button
                  key={w.week}
                  onClick={() => setWeekIdx(i)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-mono font-black transition card-chunky tap-bounce ${
                    i === weekIdx
                      ? "bg-cyan text-bg"
                      : "bg-bg-card text-ink-muted hover:bg-bg-raised"
                  }`}
                >
                  S{w.week}
                </button>
              ))}
            </div>
          </section>

          {/* Sessions */}
          <section className="space-y-2">
            {current.sessions.map((s, i) => {
              const tm = TYPE_META[s.type];
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-3 ${tm.color.split(" ").slice(1).join(" ")} card-chunky`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-raised text-xl ${tm.color.split(" ")[0]}`}
                    >
                      {tm.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-black uppercase tracking-wider ${tm.color.split(" ")[0]}`}
                        >
                          {tm.label} ·{" "}
                          {s.intensity === "low"
                            ? "low"
                            : s.intensity === "moderate"
                              ? "mod"
                              : "high"}
                        </span>
                      </div>
                      <div className="font-display text-sm font-black truncate">
                        {s.title}
                      </div>
                      {s.notes && (
                        <div className="text-[11px] text-ink-muted leading-tight">
                          {s.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-[10px] font-mono shrink-0">
                      <div className="font-black text-ink">
                        {formatDuration(s.duration)}
                      </div>
                      {!!s.distance && (
                        <div className="text-ink-dim">{s.distance} km</div>
                      )}
                      {!!s.elevation && (
                        <div className="text-ink-dim">{s.elevation}m D+</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Coach tip */}
          <section className="rounded-2xl bg-cyan/10 p-4 card-chunky">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                Conseil du coach · {current.label.toLowerCase()}
              </div>
            </div>
            <p className="mt-2 text-sm text-ink">{current.coachTip}</p>
          </section>

          {/* Adjust */}
          <section className="rounded-2xl bg-peach/10 p-4 card-chunky">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
              Besoin d'ajuster ?
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Blessure, semaine chargée, déplacement pro : recharge la page
              en ajoutant des précisions dans freeText et le coach recalibre.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => location.reload()}
                className="flex-1 rounded-xl bg-peach py-2 text-[11px] font-mono font-black text-bg card-chunky tap-bounce"
              >
                🔄 Regénérer
              </button>
              <Link
                href="/coach"
                className="flex-1 rounded-xl bg-bg-raised py-2 text-center text-[11px] font-mono font-black text-ink-muted card-chunky tap-bounce"
              >
                ← Changer objectif
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default function CoachPlanPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 safe-top pb-6">
          <div className="mt-10 text-center text-ink-muted">Chargement…</div>
        </main>
      }
    >
      <CoachPlanInner />
    </Suspense>
  );
}
