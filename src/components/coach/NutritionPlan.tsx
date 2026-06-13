"use client";

// ====== NutritionPlan ======
// Affiche les conseils nutrition + plan gut training selon la tranche d'effort.
// Mode interactif : l'user sélectionne sa tranche (ou la duration estimée) et
// voit les recommandations adaptées + plan gut training + produits référence.

import { useState } from "react";
import {
  NUTRITION_TARGETS,
  GUT_TRAINING_PLAN,
  NUTRITION_PRODUCTS,
  BRACKET_LABELS,
  productsForBracket,
  type EffortBracket,
} from "@/lib/data/nutrition";

const COLOR_MAP: Record<string, string> = {
  lime: "border-lime/40 bg-lime/10 text-lime",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  peach: "border-peach/40 bg-peach/10 text-peach",
  violet: "border-violet/40 bg-violet/10 text-violet",
  mythic: "border-mythic/40 bg-mythic/10 text-mythic",
};

const PRODUCT_CAT_META: Record<string, { emoji: string; label: string }> = {
  gel: { emoji: "💧", label: "Gels" },
  bar: { emoji: "🍫", label: "Barres" },
  drink: { emoji: "🥤", label: "Boissons" },
  "real-food": { emoji: "🥖", label: "Vraie food" },
  salt: { emoji: "🧂", label: "Sel" },
};

export default function NutritionPlan() {
  const [bracket, setBracket] = useState<EffortBracket>("long");
  const target = NUTRITION_TARGETS.find((t) => t.bracket === bracket)!;
  const products = productsForBracket(bracket);
  const meta = BRACKET_LABELS[bracket];

  // Group products by category
  const productsByCat = products.reduce<Record<string, typeof products>>(
    (acc, p) => {
      (acc[p.category] ||= []).push(p);
      return acc;
    },
    {},
  );

  return (
    <section className="space-y-5">
      {/* Header */}
      <div>
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Nutrition & Gut Training
        </div>
        <h2 className="font-display text-xl font-black text-ink leading-tight">
          Apprends à ton estomac à encaisser
        </h2>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Sur trail long, le mur ne vient pas des jambes mais de la digestion.
          Choisis ta durée d&apos;effort cible — on te dit quoi manger, combien,
          et comment t&apos;entraîner à le supporter.
        </p>
      </div>

      {/* Bracket selector */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {(Object.entries(BRACKET_LABELS) as [EffortBracket, typeof BRACKET_LABELS[EffortBracket]][]).map(
          ([id, m]) => (
            <button
              key={id}
              onClick={() => setBracket(id)}
              className={`shrink-0 rounded-xl border-2 px-3 py-2 transition ${
                bracket === id
                  ? COLOR_MAP[m.color] + " shadow-md"
                  : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
              }`}
            >
              <div className="font-display text-xs font-black leading-none">
                {m.emoji} {m.label}
              </div>
            </button>
          ),
        )}
      </div>

      {/* Apports recommandés */}
      <div className={`rounded-2xl border-2 ${COLOR_MAP[meta.color]} p-4 space-y-3`}>
        <div className="text-[10px] font-mono font-black uppercase tracking-widest">
          Apports recommandés · {target.durationLabel}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Glucides" value={`${target.carbsPerHour.min}-${target.carbsPerHour.max}`} unit="g/h" />
          <Stat label="Eau"      value={`${target.fluidPerHour.min}-${target.fluidPerHour.max}`} unit="ml/h" />
          <Stat label="Sodium"   value={`${target.sodiumPerHour.min}-${target.sodiumPerHour.max}`} unit="mg/h" />
        </div>
        <ul className="space-y-1.5 text-xs text-ink leading-relaxed">
          {target.notes.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-peach font-black">→</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Plan gut training */}
      <div id="gut-training" className="space-y-3 scroll-mt-20">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Plan gut training · 8 semaines
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          On entraîne ton estomac comme tes jambes : progressif, en sortie longue,
          jamais en compet. Cible : pouvoir absorber 80 g de glucides par heure.
        </p>
        <div className="space-y-2">
          {GUT_TRAINING_PLAN.map((phase) => (
            <div
              key={phase.weeks}
              className="rounded-xl border-2 border-ink/10 bg-bg-card/60 p-3 flex gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-peach/15 text-peach">
                <div className="font-display text-base font-black leading-none">{phase.carbsTarget}g</div>
                <div className="text-[8px] font-mono leading-none mt-0.5">/h</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-black uppercase tracking-wider text-peach">
                  {phase.weeks}
                </div>
                <div className="font-display text-sm font-black text-ink mt-0.5">
                  {phase.description}
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed mt-1">
                  {phase.practice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Produits référence */}
      <div className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Produits qui passent · {meta.label.toLowerCase()}
        </div>
        {Object.entries(productsByCat).map(([cat, list]) => {
          const m = PRODUCT_CAT_META[cat];
          return (
            <div key={cat} className="rounded-xl border-2 border-ink/10 bg-bg-card/40 p-3 space-y-2">
              <div className="text-xs font-display font-black text-ink">
                {m.emoji} {m.label}
              </div>
              {list.map((p) => (
                <div key={p.name} className="flex gap-3 items-baseline border-l-2 border-peach/30 pl-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-ink">{p.name}</div>
                    <div className="text-[10px] text-ink-muted leading-relaxed mt-0.5">
                      {p.notes}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-black text-peach">{p.carbsPerUnit}g</div>
                    <div className="text-[9px] font-mono text-ink-dim">{p.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-ink-dim leading-relaxed">
        Repères généraux issus de la littérature sport-nutrition (ISSN, INSEP).
        Pour un suivi personnalisé, consulte un diététicien spécialisé sport.
      </p>
    </section>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-lg bg-bg-card/70 p-2">
      <div className="text-[9px] font-mono uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className="font-display text-sm font-black text-ink mt-0.5">
        {value}
      </div>
      <div className="text-[9px] font-mono text-ink-dim">{unit}</div>
    </div>
  );
}
