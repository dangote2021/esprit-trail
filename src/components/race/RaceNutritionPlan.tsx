"use client";

// ====== RaceNutritionPlan ======
// Plan nutrition timing-précis pour une course donnée.
// Affiche : résumé (durée, glucides totaux), timeline des prises (gel/barre/eau/
// sel à H+0:30, H+1:00…), liste de courses (combien de gels à acheter).
//
// Prop `preview=true` → affiche uniquement les prises de la 1re heure et bloque
// le reste derrière une paywall (CTA inscription). Utilisé pour les visiteurs
// non-loggés sur /race/[id].

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buildRaceFuelPlan,
  offsetToTime,
  formatOffset,
  BRACKET_LABELS,
  type FuelItem,
} from "@/lib/data/nutrition";

const TYPE_META: Record<FuelItem["type"], { emoji: string; color: string }> = {
  gel:        { emoji: "💧", color: "border-cyan/40 bg-cyan/10 text-cyan" },
  bar:        { emoji: "🍫", color: "border-peach/40 bg-peach/10 text-peach" },
  drink:      { emoji: "🥤", color: "border-violet/40 bg-violet/10 text-violet" },
  salt:       { emoji: "🧂", color: "border-amber/40 bg-amber/10 text-amber" },
  "real-food":{ emoji: "🥖", color: "border-lime/40 bg-lime/10 text-lime" },
};

interface Props {
  raceName: string;
  distanceKm: number;
  elevationM: number;
  raceStartIso: string;
  itraIndex?: number;
  /** Si true → mode aperçu pour visiteur non-loggé : 1re heure visible, reste lock. */
  preview?: boolean;
}

export default function RaceNutritionPlan({
  raceName,
  distanceKm,
  elevationM,
  raceStartIso,
  itraIndex = 600,
  preview = false,
}: Props) {
  // En mode preview, on auto-expand pour montrer la 1re heure direct.
  const [expanded, setExpanded] = useState(preview);

  const plan = useMemo(
    () =>
      buildRaceFuelPlan({
        distanceKm,
        elevationM,
        raceStartIso,
        itraIndex,
      }),
    [distanceKm, elevationM, raceStartIso, itraIndex],
  );

  const bracketMeta = BRACKET_LABELS[plan.bracket];
  const durHours = Math.floor(plan.durationMin / 60);
  const durMins = plan.durationMin % 60;

  // En mode preview, on tronque la timeline à H+180 (3 premières heures).
  // 1h c'était 6% d'un ultra → trop court pour juger la qualité du plan.
  // 3h ≈ 18% d'un ultra de 16h, ou 1/3 d'un trail moyen — assez pour montrer
  // la stratégie (ouverture, gestion ravito, alternance gel/barre/eau/sel).
  const PREVIEW_MAX_OFFSET_MIN = 180;
  const visibleTimeline = preview
    ? plan.timeline.filter((it) => it.offsetMin <= PREVIEW_MAX_OFFSET_MIN)
    : plan.timeline;
  const hiddenCount = preview ? plan.timeline.length - visibleTimeline.length : 0;

  return (
    <section className="rounded-3xl border-2 border-peach/40 bg-gradient-to-br from-peach/10 via-bg-card to-bg p-5 space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            {preview ? "Aperçu plan nutrition" : `Plan nutrition · ${raceName}`}
          </div>
          <h3 className="font-display text-lg font-black text-ink leading-tight">
            🍫 Ta stratégie ravito jour J
          </h3>
        </div>
        {!preview && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 rounded-md bg-peach px-3 py-1.5 text-[11px] font-mono font-black text-bg shadow-md hover:scale-[1.02]"
          >
            {expanded ? "Replier" : "Voir le plan"}
          </button>
        )}
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat
          label="Durée estimée"
          value={`${durHours}h${durMins ? durMins.toString().padStart(2, "0") : ""}`}
          icon="⏱️"
        />
        <Stat
          label="Effort"
          value={`${bracketMeta.emoji} ${bracketMeta.label.split(" ")[0]}`}
          icon=""
        />
        <Stat label="Glucides" value={`~${plan.totalCarbs}g`} icon="💪" />
      </div>

      {!expanded && (
        <p className="text-xs text-ink-muted leading-relaxed text-center">
          Plan calculé pour ton niveau ITRA ({itraIndex} pts) — clique « Voir le
          plan » pour la timeline détaillée.
        </p>
      )}

      {expanded && (
        <>
          {/* Timeline des prises */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
              {preview
                ? `Timeline · 3 premières heures (${visibleTimeline.length}/${plan.timeline.length} prises)`
                : `Timeline · ${plan.timeline.length} prises`}
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Hydratation continue : 1 gorgée toutes les 10-15 min, ~
              {plan.totalFluid} ml total. Adapte selon chaleur et sueur.
            </p>
            <div className="space-y-2">
              {visibleTimeline.map((item, i) => {
                const meta = TYPE_META[item.type];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border-2 border-ink/10 bg-bg-card/60 p-3"
                  >
                    {/* Heure */}
                    <div className="shrink-0 w-16 text-center">
                      <div className="font-display text-base font-black text-ink leading-none">
                        {offsetToTime(plan.raceStartIso, item.offsetMin)}
                      </div>
                      <div className="text-[9px] font-mono text-ink-dim mt-0.5 uppercase">
                        {formatOffset(item.offsetMin)}
                      </div>
                      {item.km > 0 && (
                        <div className="text-[10px] font-mono text-peach mt-0.5">
                          ~ km {item.km}
                        </div>
                      )}
                    </div>
                    {/* Pastille type */}
                    <div className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-black border ${meta.color}`}>
                      {meta.emoji} {item.label}
                    </div>
                    {/* Détail */}
                    <div className="flex-1 text-xs text-ink leading-snug">
                      {item.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAYWALL preview — affichée uniquement si preview=true */}
          {preview && hiddenCount > 0 && (
            <div className="relative rounded-2xl border-2 border-dashed border-peach/50 bg-gradient-to-b from-peach/10 to-bg p-5 text-center space-y-3">
              <div className="text-3xl">🔒</div>
              <div className="font-display text-base font-black text-ink leading-tight">
                {hiddenCount} prises restantes verrouillées
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Crée ton compte pour débloquer la timeline complète,
                la liste de courses pour le jour J et la stratégie hydratation
                heure par heure. Gratuit, sans pub.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/signup"
                  className="block w-full rounded-xl bg-peach py-3 text-center font-mono text-xs font-black uppercase tracking-wider text-bg shadow-md hover:scale-[1.02] transition"
                >
                  Crée ton compte gratuit →
                </Link>
                <Link
                  href="/login"
                  className="block w-full rounded-xl border border-ink/15 bg-bg-card/60 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
                >
                  J&apos;ai déjà un compte
                </Link>
              </div>
            </div>
          )}

          {/* Shopping list — uniquement en mode complet */}
          {!preview && (
            <div className="rounded-2xl border-2 border-lime/40 bg-lime/5 p-4 space-y-2">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
                🛒 Liste de courses pour le jour J
              </div>
              <ul className="space-y-1.5 text-xs text-ink leading-relaxed">
                {plan.shoppingList.map((item, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span>{item.name}</span>
                    <span className="font-mono font-bold text-lime shrink-0">
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-ink-dim italic mt-2">
                Quantités avec marge de sécurité (+2 gels, +1 barre, +2 sel) au cas où.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          {!preview && (
            <p className="text-[10px] text-ink-dim leading-relaxed text-center">
              Plan basé sur recommandations ISSN + retour terrain ultra. Adapte
              selon ce que tu as testé en gut training. Jamais de nouveau produit
              le jour J.
            </p>
          )}
        </>
      )}
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl bg-bg-card/70 p-2">
      {icon && <div className="text-base">{icon}</div>}
      <div className="font-display text-sm font-black text-ink mt-0.5">
        {value}
      </div>
      <div className="text-[9px] font-mono uppercase tracking-wider text-ink-muted">
        {label}
      </div>
    </div>
  );
}
