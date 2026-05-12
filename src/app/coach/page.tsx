"use client";

import { useState } from "react";
import Link from "next/link";
import NutritionPlan from "@/components/coach/NutritionPlan";

type Goal =
  | "first-10k"
  | "first-trail"
  | "improve-marathon"
  | "first-ultra"
  | "utmb-qualif"
  | "lose-weight"
  | "rebuild"
  | "custom";

const GOALS: {
  id: Goal;
  emoji: string;
  title: string;
  desc: string;
  weeks: number;
  accent: "lime" | "peach" | "cyan" | "violet" | "gold";
}[] = [
  {
    id: "first-10k",
    emoji: "🏁",
    title: "Mon premier 10K",
    desc: "Je cours depuis peu, je vise 10 km d'une traite",
    weeks: 8,
    accent: "lime",
  },
  {
    id: "first-trail",
    emoji: "🌲",
    title: "Mon premier trail",
    desc: "Premier dossard 20-30 km trail",
    weeks: 10,
    accent: "lime",
  },
  {
    id: "improve-marathon",
    emoji: "⚡",
    title: "Battre mon marathon",
    desc: "Gagner du temps sur ma meilleure perf",
    weeks: 12,
    accent: "peach",
  },
  {
    id: "first-ultra",
    emoji: "🔥",
    title: "Mon premier ultra",
    desc: "Passer le cap des 50-80 km",
    weeks: 16,
    accent: "peach",
  },
  {
    id: "utmb-qualif",
    emoji: "👑",
    title: "Qualif UTMB",
    desc: "Chasser les pierres pour la loterie UTMB",
    weeks: 24,
    accent: "cyan",
  },
  {
    id: "lose-weight",
    emoji: "💚",
    title: "Forme et santé",
    desc: "Perdre du poids, retrouver un cardio solide",
    weeks: 12,
    accent: "violet",
  },
  {
    id: "rebuild",
    emoji: "🩹",
    title: "Retour après blessure",
    desc: "Remonter en charge progressivement",
    weeks: 8,
    accent: "gold",
  },
  {
    id: "custom",
    emoji: "🎯",
    title: "Objectif perso",
    desc: "Décris ton objectif au coach IA",
    weeks: 12,
    accent: "lime",
  },
];

export default function CoachHubPage() {
  const [selected, setSelected] = useState<Goal | null>(null);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-cyan transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
            Coach IA
          </div>
          <h1 className="font-display text-lg font-black leading-none">Ton plan sur mesure</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-violet/5 to-bg p-6 card-shine">
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-float">🧠</div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
              Coach IA · 24/7
            </div>
            <h2 className="mt-1 font-display text-2xl font-black leading-tight">
              Dis-moi ton objectif.
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Je te génère un plan d'entraînement complet : séances
              hebdomadaires progressives, zones de FC, conseils nutrition,
              matériel, tapering avant course.
            </p>
          </div>
        </div>
      </section>

      {/* Masterclass — Pas péter au 15ème */}
      <Link
        href="/coach/masterclass"
        className="relative block overflow-hidden rounded-3xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-gold/10 to-bg p-5 card-chunky hover:scale-[1.01] transition"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-float">💥</div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
              Masterclass · Bouzin guide
            </div>
            <h2 className="mt-1 font-display text-xl font-black leading-tight">
              Pas péter au 15ème kil
            </h2>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              7 règles pour rester solide jusqu'au bout. Pacing, nutri, hydra,
              mental, gut training — tout ce qui sépare un finisher d'un abandon.
            </p>
            <div className="mt-2 flex gap-2 text-[10px] font-mono">
              <span className="rounded-md bg-peach/20 px-2 py-0.5 font-bold text-peach">
                7 règles
              </span>
              <span className="rounded-md bg-cyan/20 px-2 py-0.5 font-bold text-cyan">
                12 min
              </span>
            </div>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-6 w-6 shrink-0 text-peach"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </Link>

      {/* Goal picker */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Qu'est-ce que tu vises ?
        </div>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => {
            const active = selected === g.id;
            const accentBg = {
              lime: "border-lime bg-lime/10 shadow-glow-lime",
              peach: "border-peach bg-peach/10 shadow-glow-peach",
              cyan: "border-cyan bg-cyan/10 shadow-glow-cyan",
              violet: "border-violet bg-violet/10 shadow-glow-violet",
              gold: "border-gold bg-gold/10 shadow-glow-gold",
            }[g.accent];
            return (
              <button
                key={g.id}
                onClick={() => setSelected(g.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  active ? accentBg : "border-ink/15 bg-bg-card/60 hover:border-cyan/40"
                }`}
              >
                <div className="text-2xl">{g.emoji}</div>
                <div className="mt-1 text-xs font-black leading-tight">{g.title}</div>
                <div className="text-[10px] text-ink-muted line-clamp-2">{g.desc}</div>
                <div className="mt-1 text-[9px] font-mono text-ink-dim">
                  Plan {g.weeks} semaines
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selected && (
        <Link
          href={`/coach/plan?goal=${selected}`}
          className="block w-full rounded-xl bg-cyan py-4 text-center font-black uppercase tracking-wider text-bg shadow-glow-cyan transition hover:scale-[1.01]"
        >
          Générer mon plan →
        </Link>
      )}

      {/* Why it works */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Comment ça marche
        </div>
        <div className="space-y-2">
          {[
            {
              n: 1,
              title: "Tu décris ton objectif",
              desc: "Distance, date, niveau actuel, contraintes (boulot, blessures, équipement).",
            },
            {
              n: 2,
              title: "Le coach IA analyse ton historique",
              desc: "Tes sorties Strava, ton UTMB Index, ta charge actuelle.",
            },
            {
              n: 3,
              title: "Tu reçois un plan progressif",
              desc: "Séances semaine par semaine. Fractionné, sorties longues, récup, tapering.",
            },
            {
              n: 4,
              title: "Le plan s'ajuste en temps réel",
              desc: "Tu rates une séance ? Blessure ? Le plan se recalibre automatiquement.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="flex gap-3 rounded-xl border border-ink/10 bg-bg-card/40 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/15 font-display text-sm font-black text-cyan">
                {s.n}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{s.title}</div>
                <div className="text-[11px] text-ink-muted">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coaches humains */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet">
              Tu préfères l'humain ?
            </div>
            <div className="font-display text-lg font-black">Coachs certifiés trail</div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet/50">
            Bientôt
          </span>
        </div>
        <div className="space-y-2">
          {[
            {
              name: "Marion D.",
              avatar: "👩‍🦰",
              title: "Coach trail · ex-podium CCC",
              location: "Chamonix",
              price: "80€/mois",
              specialty: "Ultra endurance",
            },
            {
              name: "Thomas V.",
              avatar: "👨",
              title: "Préparateur physique",
              location: "Annecy",
              price: "120€/mois",
              specialty: "Force + montée",
            },
          ].map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-xl border border-violet/20 bg-bg-card/40 p-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-2xl">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{c.name}</div>
                <div className="text-[11px] text-ink-muted truncate">{c.title}</div>
                <div className="text-[10px] font-mono text-violet">
                  📍 {c.location} · {c.specialty}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-sm font-black">{c.price}</div>
                <div className="text-[10px] text-ink-dim">par mois</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition & gut training */}
      <NutritionPlan />
    </main>
  );
}
