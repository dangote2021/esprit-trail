"use client";

// ====== FormeRecupPanel ======
// Panneau "Forme & Récup" sur le profil. Affiche VO₂max estimé, fraîcheur
// (TSB), et charge d'entraînement aigu vs fond — les indicateurs type
// Garmin / TrainingPeaks demandés par le panel test.
//
// Source des données :
//   - ME.physio (mock data pour le MVP : HRV, sleep, acuteLoad, chronicLoad,
//     freshness). À terme, ces valeurs viendront de Strava + d'un calculateur
//     Esprit Trail qui agrège tes sorties pour produire les vrais scores.
//   - VO₂max : estimé via tes meilleurs efforts récents (formule Cooper /
//     vVO₂max). Hardcodé en mock pour l'instant.
//
// Wrapping : le composant est rendu uniquement pour les profils CONFIGURÉS
// (cf. ConfiguredProfileOnly) — sinon on afficherait des chiffres fictifs
// comme "ton VO₂max" à un nouveau testeur, ce qui est exactement le bug
// que l'audit P0 a flaggé.

import ConfiguredProfileOnly from "./ConfiguredProfileOnly";
import { ME } from "@/lib/data/me";

type Physio = NonNullable<typeof ME.physio>;

function freshnessLabel(tsb: number) {
  // TSB normalisé (50 = neutre). Au-dessus = frais, en-dessous = fatigué.
  if (tsb >= 65) return { label: "Très frais", coach: "T'es chargé à bloc. Pousse cette semaine, sors-toi une longue.", delta: tsb - 50, color: "#2d6a4f" };
  if (tsb >= 50) return { label: "Frais", coach: "Bon timing pour pousser. Tu absorbes bien la charge.", delta: tsb - 50, color: "#2d6a4f" };
  if (tsb >= 35) return { label: "Fatigué", coach: "Charge récente lourde. Récupère 1-2 jours avant la prochaine grosse.", delta: tsb - 50, color: "#c1654a" };
  return { label: "Surcharge", coach: "Stop. 3-5 jours de récup avant de retoucher au volume.", delta: tsb - 50, color: "#993c1d" };
}

/**
 * Estime un VO₂max à partir des stats utilisateur. Heuristique très simple pour
 * le MVP — sera remplacée par une vraie estimation depuis les efforts Strava.
 */
function estimateVo2max(physio: Physio): { value: number; delta30j: number } {
  // Base : 45 + bonus selon chronicLoad (fitness de fond)
  const base = 45 + (physio.chronicLoad - 50) * 0.15;
  // Bonus régularité
  const regBonus = (physio.regularity - 80) * 0.05;
  const value = Math.max(35, Math.min(75, base + regBonus));
  // Delta 30j fictif (à brancher sur l'historique des effs)
  const delta30j = physio.chronicLoad > physio.acuteLoad ? -0.3 : 0.8;
  return { value: Math.round(value * 10) / 10, delta30j: Math.round(delta30j * 10) / 10 };
}

function PanelInner() {
  const physio = ME.physio;
  if (!physio) return null;

  const fresh = freshnessLabel(physio.freshness);
  const vo2 = estimateVo2max(physio);

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-4 card-chunky"
      style={{
        // Dégradé "physio" : bleu ciel → blanc cassé, distinct des autres
        // sections (vert nature, violet social, pêche aventure).
        background:
          "linear-gradient(135deg, rgba(181,212,244,0.35) 0%, rgba(240,252,255,0.6) 50%, rgba(254,250,224,0.4) 100%)",
        border: "1.5px solid rgba(24,95,165,0.25)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div
            className="text-[10px] font-mono font-black uppercase tracking-widest"
            style={{ color: "#185fa5" }}
          >
            Forme &amp; Récup
          </div>
          <div
            className="font-display text-lg font-black leading-tight mt-0.5"
            style={{ color: "#0c447c" }}
          >
            {fresh.label === "Très frais" || fresh.label === "Frais"
              ? "Tu peux pousser cette semaine"
              : fresh.label === "Fatigué"
              ? "Lève le pied 2 jours"
              : "Récupération obligatoire"}
          </div>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-black text-white shadow-md"
          style={{
            background:
              fresh.label === "Très frais" || fresh.label === "Frais"
                ? "linear-gradient(135deg, #95d5b2 0%, #2d6a4f 100%)"
                : fresh.label === "Fatigué"
                ? "linear-gradient(135deg, #f0997b 0%, #d85a30 100%)"
                : "linear-gradient(135deg, #e24b4a 0%, #791f1f 100%)",
          }}
          aria-label={`Forme : ${fresh.label}`}
        >
          {fresh.label === "Très frais"
            ? "A+"
            : fresh.label === "Frais"
            ? "A"
            : fresh.label === "Fatigué"
            ? "B"
            : "C"}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* VO2max — honnêteté : c'est une estimation, on l'assume */}
        <div className="rounded-xl bg-white/80 border border-ink/10 p-3 group relative">
          <div
            className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider"
            style={{ color: "#185fa5" }}
          >
            VO₂max
            <span
              className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full text-[8px] font-bold"
              style={{ background: "rgba(24,95,165,0.15)", color: "#185fa5" }}
              title="Estimation à la louche basée sur ta charge de fond + ta régularité. Pas du gold lab — quand on aura les vraies données vVO₂max via Strava, on remplacera. En attendant ça donne une idée des tendances."
            >
              ?
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <div
              className="font-display text-2xl font-black leading-none"
              style={{ color: "#0c447c" }}
            >
              {vo2.value}
            </div>
            <div
              className="text-[10px] font-mono font-bold"
              style={{ color: vo2.delta30j >= 0 ? "#2d6a4f" : "#c1654a" }}
            >
              {vo2.delta30j >= 0 ? "▲" : "▼"} {Math.abs(vo2.delta30j)}
            </div>
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5 italic">
            estimé · à la louche
          </div>
        </div>

        {/* Fraîcheur TSB */}
        <div className="rounded-xl bg-white/80 border border-ink/10 p-3">
          <div
            className="text-[9px] font-mono font-bold uppercase tracking-wider"
            style={{ color: "#185fa5" }}
          >
            Fraîcheur (TSB)
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <div
              className="font-display text-2xl font-black leading-none"
              style={{ color: fresh.color }}
            >
              {fresh.delta >= 0 ? "+" : ""}
              {fresh.delta}
            </div>
            <div
              className="text-[10px] font-mono font-bold"
              style={{ color: fresh.color }}
            >
              {fresh.label.toLowerCase()}
            </div>
          </div>
          <div className="text-[10px] text-ink-muted mt-0.5">
            {fresh.delta >= 0 ? "prêt à pousser" : "récup conseillée"}
          </div>
        </div>
      </div>

      {/* Charge d'entraînement */}
      <div className="rounded-xl bg-white/80 border border-ink/10 p-3 mb-3">
        <div
          className="text-[9px] font-mono font-bold uppercase tracking-wider mb-2"
          style={{ color: "#185fa5" }}
        >
          Charge d&apos;entraînement (28j)
        </div>

        {/* Aigu (7j) */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-12 text-[11px] text-ink-muted">Aigu</div>
          <div className="flex-1 h-2 bg-bg-raised/70 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, physio.acuteLoad)}%`,
                background: "linear-gradient(90deg, #95d5b2 0%, #2d6a4f 100%)",
              }}
            />
          </div>
          <div
            className="w-9 text-right text-[11px] font-mono font-bold"
            style={{ color: "#1b4332" }}
          >
            {physio.acuteLoad}
          </div>
        </div>

        {/* Chronique (28j) */}
        <div className="flex items-center gap-2">
          <div className="w-12 text-[11px] text-ink-muted">Fond</div>
          <div className="flex-1 h-2 bg-bg-raised/70 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, physio.chronicLoad)}%`,
                background: "linear-gradient(90deg, #b5d4f4 0%, #185fa5 100%)",
              }}
            />
          </div>
          <div
            className="w-9 text-right text-[11px] font-mono font-bold"
            style={{ color: "#0c447c" }}
          >
            {physio.chronicLoad}
          </div>
        </div>
      </div>

      {/* Lecture coach */}
      <div
        className="rounded-lg p-2.5 text-[11px] leading-snug"
        style={{
          background:
            fresh.label === "Très frais" || fresh.label === "Frais"
              ? "rgba(149,213,178,0.25)"
              : fresh.label === "Fatigué"
              ? "rgba(240,153,123,0.25)"
              : "rgba(226,75,74,0.20)",
          borderLeft: `3px solid ${fresh.color}`,
          color: "#1b4332",
        }}
      >
        <strong>Lecture coach :</strong> {fresh.coach}
      </div>
    </section>
  );
}

/**
 * Wrapper exporté — masque le panel tant que l'identité n'est pas configurée.
 */
export default function FormeRecupPanel() {
  return (
    <ConfiguredProfileOnly>
      <PanelInner />
    </ConfiguredProfileOnly>
  );
}
