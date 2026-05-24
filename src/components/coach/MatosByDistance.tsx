"use client";

// ====== MatosByDistance ======
// Checklist matos par tranche de distance — feedback user qui voulait savoir
// quoi prendre sur 20 km vs 60 km, parce qu'un rouleau de PQ oublié peut
// transformer une sortie longue en descente aux enfers.
//
// Data 100 % statique (pour l'instant). À terme : possibilité de cocher
// les items pour cocher sa propre liste, persister en localStorage.

import { useState } from "react";

type Item = {
  label: string;
  /** 1 = essentiel non-négociable, 2 = très recommandé, 3 = utile */
  importance: 1 | 2 | 3;
  /** Note pratique courte */
  note?: string;
};

type Tranche = {
  id: string;
  label: string;
  range: string;
  emoji: string;
  duration: string;
  intro: string;
  groups: { title: string; items: Item[] }[];
};

const TRANCHES: Tranche[] = [
  {
    id: "court",
    label: "Trail court",
    range: "< 20 km",
    emoji: "🥾",
    duration: "1h-2h",
    intro: "Léger, rapide, peu de matos. L'essentiel : eau et un coupe-vent si la météo tourne.",
    groups: [
      {
        title: "Tu pars avec",
        items: [
          { label: "Chaussures trail adaptées au terrain", importance: 1 },
          { label: "Tenue technique (haut + short ou collant)", importance: 1 },
          { label: "Chaussettes anti-ampoules", importance: 1 },
          { label: "Montre GPS ou téléphone avec trace", importance: 2 },
          { label: "Poche à eau 0.5-1L ou flasque", importance: 1, note: "À ajuster selon météo" },
        ],
      },
      {
        title: "Au cas où",
        items: [
          { label: "Coupe-vent léger (poche dorsale)", importance: 2, note: "Si météo incertaine" },
          { label: "1 gel ou barre", importance: 3, note: "Si sortie > 1h30 ou intensité" },
          { label: "Téléphone (urgence + photos)", importance: 2 },
          { label: "Sifflet (montagne isolée)", importance: 3 },
        ],
      },
    ],
  },
  {
    id: "moyen",
    label: "Trail moyen",
    range: "20-40 km",
    emoji: "🏃",
    duration: "2h-5h",
    intro: "On rentre dans le vrai trail. Sac obligatoire, gels mesurés, et premier kit de secours basique.",
    groups: [
      {
        title: "Sac à dos / gilet trail (5-10L)",
        items: [
          { label: "Sac/gilet 5-10L bien ajusté", importance: 1 },
          { label: "Réserve eau 1-1.5L (flasques avant ou poche)", importance: 1 },
          { label: "Coupe-vent imperméable", importance: 1, note: "Même par beau temps en montagne" },
          { label: "Buff/bandana", importance: 2, note: "Soleil, sueur, gestion thermique" },
          { label: "Casquette ou visière", importance: 2 },
        ],
      },
      {
        title: "Nutrition",
        items: [
          { label: "3-5 gels (1 toutes les 30-40 min)", importance: 1 },
          { label: "1-2 barres ou pâte de fruits", importance: 2, note: "Pour varier les textures" },
          { label: "Pastilles de sel ou électrolytes", importance: 2 },
          { label: "Boisson iso dans une flasque", importance: 2 },
        ],
      },
      {
        title: "Secours minimum",
        items: [
          { label: "Téléphone chargé + sifflet", importance: 1 },
          { label: "Couverture de survie", importance: 1, note: "Obligatoire en course officielle" },
          { label: "Pansements (ampoules)", importance: 2 },
          { label: "Frontale légère si départ tôt ou tard", importance: 2 },
        ],
      },
    ],
  },
  {
    id: "long",
    label: "Trail long",
    range: "40-60 km",
    emoji: "🏔️",
    duration: "5h-9h",
    intro: "On s'approche de l'ultra. Vraie food obligatoire, gestion thermique sérieuse, kit de secours complet.",
    groups: [
      {
        title: "Sac à dos (10-15L)",
        items: [
          { label: "Sac/gilet 10-15L compartimenté", importance: 1 },
          { label: "Réserve eau 1.5-2L + pastilles purification", importance: 1, note: "En cas de point d'eau sale" },
          { label: "Veste imperméable respirante", importance: 1, note: "Pas un coupe-vent — une vraie veste pluie" },
          { label: "Manchons compression (jambes ou bras)", importance: 3 },
          { label: "Sous-vêtements de rechange (haut)", importance: 3, note: "Si météo froide" },
        ],
      },
      {
        title: "Nutrition embarquée",
        items: [
          { label: "6-8 gels", importance: 1, note: "60-75 g glucides/h, alternez les marques" },
          { label: "2-3 barres céréales + 1-2 portions vraie food", importance: 1, note: "Sandwich, baby pot, pâte d'amande" },
          { label: "Pastilles sel toutes les heures", importance: 1, note: "500-600 mg sodium/h en chaleur" },
          { label: "Cash + carte bleue (ravito sauvage)", importance: 2 },
        ],
      },
      {
        title: "Secours complet",
        items: [
          { label: "Trousse premiers soins (pansements, double peau, anti-douleur)", importance: 1 },
          { label: "Frontale + piles de rechange", importance: 1 },
          { label: "Couverture survie + sifflet", importance: 1 },
          { label: "Bonnet et gants légers", importance: 2, note: "Altitude ou nuit" },
          { label: "Bâtons trail pliables", importance: 3, note: "Si gros D+ ou descente technique" },
        ],
      },
    ],
  },
  {
    id: "ultra",
    label: "Ultra",
    range: "60+ km",
    emoji: "🌋",
    duration: "9h+",
    intro: "Tu pars potentiellement pour la nuit. Autonomie totale : nutrition variée, kit secours complet, vêtement chaud, et oui — le rouleau de PQ.",
    groups: [
      {
        title: "Sac à dos (15-20L)",
        items: [
          { label: "Sac 15-20L avec poche à eau", importance: 1 },
          { label: "Veste pluie résistante + pantalon imperméable", importance: 1 },
          { label: "T-shirt manche longue technique de rechange", importance: 1, note: "Pour passer la nuit ou changement météo" },
          { label: "Bonnet chaud + gants chauds", importance: 1, note: "Altitude / nuit" },
          { label: "Buff cou + buff tête (double)", importance: 2 },
          { label: "Lunettes de soleil + protection solaire", importance: 1 },
        ],
      },
      {
        title: "Nutrition longue durée",
        items: [
          { label: "10-15 gels (sur 12h)", importance: 1 },
          { label: "Vraie food obligatoire : sandwich, riz, baby pot, fromage, jambon", importance: 1, note: "Indispensable au-delà de 4-5h" },
          { label: "Soupe salée en flasque thermos (nuit)", importance: 2 },
          { label: "Pastilles sel + cachets magnésium", importance: 1 },
          { label: "Boisson iso + flasque eau pure (alterner)", importance: 1 },
          { label: "Caféine en poudre ou boisson énergisante (relance nuit)", importance: 2 },
        ],
      },
      {
        title: "Confort & secours (les détails qui sauvent)",
        items: [
          { label: "Rouleau de PQ en mini-format", importance: 1, note: "Sérieusement. Mieux vaut 2 fois trop." },
          { label: "Frontale puissante + lampe de secours + piles", importance: 1 },
          { label: "Pile externe (charge phone/montre)", importance: 1 },
          { label: "Pansements ampoules + tape + double peau", importance: 1 },
          { label: "Anti-frottement (cuisse, aisselles, tétons)", importance: 1 },
          { label: "Anti-douleur (ibuprofène à doser)", importance: 2, note: "Pas en automatique — pour les vraies douleurs" },
          { label: "Chaussettes de rechange (point ravito)", importance: 2 },
          { label: "Bâtons trail légers carbone", importance: 2 },
          { label: "Couverture survie + sifflet + lampe SOS", importance: 1 },
          { label: "Carte papier ou GPX de secours sur 2e appareil", importance: 2 },
        ],
      },
    ],
  },
];

const IMPORTANCE_META: Record<1 | 2 | 3, { label: string; color: string; bg: string }> = {
  1: { label: "Essentiel", color: "#a04a23", bg: "rgba(255,180,122,0.15)" },
  2: { label: "Reco", color: "#1f5e87", bg: "rgba(140,200,235,0.15)" },
  3: { label: "Utile", color: "rgba(27,67,50,0.55)", bg: "rgba(186,230,124,0.12)" },
};

export default function MatosByDistance() {
  const [activeId, setActiveId] = useState<string>("court");
  const active = TRANCHES.find((t) => t.id === activeId) ?? TRANCHES[0];

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Matos selon la distance
          </div>
          <h2 className="font-display text-xl font-black leading-tight">
            Quoi prendre dans ton sac
          </h2>
        </div>
      </div>

      {/* Tabs tranches */}
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {TRANCHES.map((t) => {
          const isActive = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={`shrink-0 rounded-xl px-3 py-2 text-left transition tap-bounce ${
                isActive
                  ? "bg-peach text-bg shadow-glow-peach"
                  : "border border-ink/15 bg-bg-card/60 text-ink hover:border-peach/40"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{t.emoji}</span>
                <span className="font-display text-sm font-black leading-tight">
                  {t.range}
                </span>
              </div>
              <div className={`text-[10px] font-mono ${isActive ? "text-bg/80" : "text-ink-muted"}`}>
                {t.duration}
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenu de la tranche active */}
      <div className="rounded-2xl border border-peach/30 bg-gradient-to-br from-peach/8 via-bg-card to-bg p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-3xl">{active.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-black leading-tight">
              {active.label} · {active.range}
            </div>
            <p className="text-[12px] text-ink-muted leading-snug mt-0.5">
              {active.intro}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {active.groups.map((g) => (
            <div key={g.title}>
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted mb-1.5">
                {g.title}
              </div>
              <ul className="space-y-1.5">
                {g.items.map((it, idx) => {
                  const m = IMPORTANCE_META[it.importance];
                  return (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg bg-white/60 border border-ink/8 px-2.5 py-2"
                    >
                      <span
                        className="shrink-0 rounded-md text-[9px] font-mono font-black uppercase px-1.5 py-0.5 mt-0.5"
                        style={{ background: m.bg, color: m.color }}
                      >
                        {m.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-ink leading-snug">
                          {it.label}
                        </div>
                        {it.note && (
                          <div className="text-[11px] text-ink-muted leading-snug italic mt-0.5">
                            {it.note}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border-l-2 border-peach bg-peach/10 px-3 py-2 text-[11px] leading-snug text-ink">
          <strong>Règle d&apos;or :</strong> en doute, prends-le. Le poids
          d&apos;une trousse de secours pèse moins lourd que de finir une course
          en mode héros à 4h du mat.
        </div>
      </div>
    </section>
  );
}
