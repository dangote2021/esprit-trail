"use client";

import { useState } from "react";
import Link from "next/link";

// Plan IA — démo : on affiche un plan "pré-généré" (mock) pendant que le back
// IA n'est pas encore branché. Le formulaire appellera /api/coach/plan.

type Session = {
  day: string;
  type: "easy" | "long" | "interval" | "hill" | "rest" | "race";
  title: string;
  detail: string;
  duration: string;
  distance?: number;
  elevation?: number;
};

type Week = {
  n: number;
  phase: "Foundation" | "Build" | "Peak" | "Taper" | "Race";
  weeklyKm: number;
  weeklyElev: number;
  sessions: Session[];
};

// Plan mock — "Premier ultra 50K dans 4 mois" (16 semaines)
const MOCK_PLAN: Week[] = [
  {
    n: 1,
    phase: "Foundation",
    weeklyKm: 35,
    weeklyElev: 800,
    sessions: [
      { day: "Mar", type: "easy", title: "Footing endurance", detail: "Zone 2, nasale", duration: "45 min", distance: 8 },
      { day: "Jeu", type: "interval", title: "Fractionné piste", detail: "8 × 400m @ VMA r=1'30", duration: "50 min", distance: 10 },
      { day: "Sam", type: "hill", title: "Côtes en montée", detail: "6 × 2min côte r=descente", duration: "45 min", distance: 8, elevation: 350 },
      { day: "Dim", type: "long", title: "Sortie longue vallonnée", detail: "Z2, trail si possible", duration: "1h15", distance: 9, elevation: 450 },
    ],
  },
  {
    n: 2,
    phase: "Foundation",
    weeklyKm: 40,
    weeklyElev: 1100,
    sessions: [
      { day: "Mar", type: "easy", title: "Footing endurance", detail: "Zone 2", duration: "50 min", distance: 9 },
      { day: "Jeu", type: "interval", title: "Seuil", detail: "3 × 10min @ allure 10K r=3'", duration: "1h", distance: 12 },
      { day: "Sam", type: "hill", title: "Côtes en montée", detail: "8 × 2min côte", duration: "55 min", distance: 9, elevation: 450 },
      { day: "Dim", type: "long", title: "Sortie longue trail", detail: "Z2, terrain varié", duration: "1h30", distance: 10, elevation: 550 },
    ],
  },
  {
    n: 3,
    phase: "Build",
    weeklyKm: 48,
    weeklyElev: 1500,
    sessions: [
      { day: "Mar", type: "easy", title: "Footing récup + éducatifs", detail: "+ 6 lignes droites", duration: "45 min", distance: 8 },
      { day: "Jeu", type: "interval", title: "Fractionné long", detail: "5 × 1000m @ allure 5K r=2'", duration: "1h10", distance: 13 },
      { day: "Sam", type: "hill", title: "Côte longue", detail: "3 × 8min en montée soutenue", duration: "1h05", distance: 10, elevation: 650 },
      { day: "Dim", type: "long", title: "Sortie longue progressive", detail: "2h30 Z2 fin Z3", duration: "2h30", distance: 17, elevation: 750 },
    ],
  },
  {
    n: 4,
    phase: "Build",
    weeklyKm: 35,
    weeklyElev: 900,
    sessions: [
      { day: "Mar", type: "easy", title: "Footing décharge", detail: "Semaine récup", duration: "40 min", distance: 7 },
      { day: "Jeu", type: "interval", title: "Rappel VMA court", detail: "6 × 300m r=1'", duration: "45 min", distance: 8 },
      { day: "Sam", type: "rest", title: "Repos actif", detail: "Marche ou vélo cool", duration: "30 min" },
      { day: "Dim", type: "long", title: "Sortie moyenne", detail: "1h45 trail Z2", duration: "1h45", distance: 12, elevation: 550 },
    ],
  },
];

const TYPE_META: Record<
  Session["type"],
  { label: string; color: string; icon: string }
> = {
  easy: { label: "Endurance", color: "text-cyan border-cyan/30 bg-cyan/5", icon: "🚶" },
  long: { label: "Sortie longue", color: "text-peach border-peach/30 bg-peach/5", icon: "🏃" },
  interval: { label: "Fractionné", color: "text-lime border-lime/30 bg-lime/5", icon: "⚡" },
  hill: { label: "Côtes / D+", color: "text-violet border-violet/30 bg-violet/5", icon: "⛰️" },
  rest: { label: "Repos", color: "text-ink-muted border-ink/20 bg-bg-card/40", icon: "😌" },
  race: { label: "Course !", color: "text-mythic border-mythic/40 bg-mythic/5", icon: "🏁" },
};

const PHASE_META: Record<Week["phase"], { color: string; desc: string }> = {
  Foundation: { color: "text-cyan", desc: "Construction de la base aérobie" },
  Build: { color: "text-peach", desc: "Montée en charge, intensité spécifique" },
  Peak: { color: "text-mythic", desc: "Pic de forme, volume max" },
  Taper: { color: "text-lime", desc: "Affûtage, on retire de la charge" },
  Race: { color: "text-gold", desc: "Jour J" },
};

export default function CoachPlanPage() {
  const [week, setWeek] = useState(0);
  const current = MOCK_PLAN[week];
  const phase = PHASE_META[current.phase];

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/coach"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-cyan transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
            Plan généré
          </div>
          <h1 className="font-display text-lg font-black leading-none">Mon premier ultra 50K</h1>
        </div>
        <button className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-cyan transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
      </header>

      {/* Plan summary */}
      <section className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-bg-card to-bg p-5 card-shine">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
              Objectif · 19 août 2026
            </div>
            <div className="mt-1 font-display text-2xl font-black leading-tight">
              Grand Raid 73 · 52 km · 2800m D+
            </div>
            <div className="mt-2 text-xs text-ink-muted">
              Plan personnalisé sur 16 semaines, basé sur tes 47 sorties
              récentes (742 km / 28540 D+) et ton UTMB Index 625.
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="rounded-lg bg-bg-raised/60 p-2 text-center">
            <div className="text-[9px] font-mono text-ink-muted">Durée</div>
            <div className="font-display text-base font-black text-cyan">16 sem.</div>
          </div>
          <div className="rounded-lg bg-bg-raised/60 p-2 text-center">
            <div className="text-[9px] font-mono text-ink-muted">Volume pic</div>
            <div className="font-display text-base font-black text-peach">68 km</div>
          </div>
          <div className="rounded-lg bg-bg-raised/60 p-2 text-center">
            <div className="text-[9px] font-mono text-ink-muted">D+ pic</div>
            <div className="font-display text-base font-black text-violet">3200m</div>
          </div>
          <div className="rounded-lg bg-bg-raised/60 p-2 text-center">
            <div className="text-[9px] font-mono text-ink-muted">Séances/sem</div>
            <div className="font-display text-base font-black text-lime">4</div>
          </div>
        </div>
      </section>

      {/* Week switcher */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${phase.color}`}>
              Phase {current.phase}
            </div>
            <div className="font-display text-xl font-black">Semaine {current.n}</div>
            <div className="text-xs text-ink-muted">{phase.desc}</div>
          </div>
          <div className="text-right text-[10px] font-mono text-ink-dim">
            {current.weeklyKm} km · {current.weeklyElev}m D+
          </div>
        </div>
        {/* Week pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {MOCK_PLAN.map((w, i) => (
            <button
              key={w.n}
              onClick={() => setWeek(i)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-mono font-bold transition ${
                i === week
                  ? "border-cyan bg-cyan text-bg shadow-glow-cyan"
                  : "border-ink/15 bg-bg-card/40 text-ink-muted hover:border-cyan/40"
              }`}
            >
              S{w.n}
            </button>
          ))}
          <div className="shrink-0 rounded-lg border border-dashed border-ink/15 px-3 py-1.5 text-[11px] font-mono text-ink-dim">
            + 12 sem.
          </div>
        </div>
      </section>

      {/* Sessions of the week */}
      <section className="space-y-2">
        {current.sessions.map((s, i) => {
          const meta = TYPE_META[s.type];
          return (
            <div
              key={i}
              className={`rounded-xl border p-3 ${meta.color.split(" ").slice(1).join(" ")} border-ink/10`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-raised text-xl ${meta.color.split(" ")[0]}`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${meta.color.split(" ")[0]}`}>
                      {s.day} · {meta.label}
                    </span>
                  </div>
                  <div className="font-display text-sm font-black truncate">{s.title}</div>
                  <div className="text-[11px] text-ink-muted">{s.detail}</div>
                </div>
                <div className="text-right text-[10px] font-mono shrink-0">
                  <div className="font-black text-ink">{s.duration}</div>
                  {s.distance && <div className="text-ink-dim">{s.distance} km</div>}
                  {s.elevation && <div className="text-ink-dim">{s.elevation} D+</div>}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Coach IA tips */}
      <section className="rounded-2xl border border-cyan/20 bg-bg-card/40 p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
            Conseil du coach · semaine {current.n}
          </div>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {current.phase === "Foundation"
            ? "Phase de construction aérobie : reste en Zone 2 sur les footings, même si ça te semble lent. La base aérobie se construit en endurance, pas en intensité."
            : current.phase === "Build"
            ? "Phase de montée en charge : tu vas augmenter le volume. Dors 8h minimum, hydrate-toi, mange des glucides à IG bas. La récup compte autant que l'entraînement."
            : "Continue comme ça, tu es dans le bon."}
        </p>
        <button className="mt-3 text-[11px] font-mono font-bold text-cyan hover:text-cyan-glow">
          Poser une question au coach →
        </button>
      </section>

      {/* Adjust */}
      <section className="rounded-xl border border-peach/20 bg-peach/5 p-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
          Besoin d'ajuster ?
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          Blessure, semaine chargée, déplacement pro : le plan se recalibre
          automatiquement.
        </p>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-lg bg-peach/20 py-2 text-[11px] font-mono font-bold text-peach">
            🩹 J'ai une blessure
          </button>
          <button className="flex-1 rounded-lg bg-bg-raised py-2 text-[11px] font-mono font-bold text-ink-muted">
            ✈️ Je pars en voyage
          </button>
        </div>
      </section>
    </main>
  );
}
