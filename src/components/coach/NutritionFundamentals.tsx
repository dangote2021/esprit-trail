"use client";

// ====== NutritionFundamentals ======
// Mini-fiches "Comment choisir ton gel / iso / vraie food / apports".
// Feedback user qui voulait des critères concrets pour ne pas se planter
// en magasin (Décathlon notamment, gamme 1.08 mentionnée).
//
// Format mini-cards dépliables (accordion) pour ne pas gaver visuellement.
// Tout est en data statique, prêt à enrichir avec des marques spécifiques
// quand on aura le temps de curer (cf. backlog Decathlon partnership).

import { useState } from "react";

type Card = {
  id: string;
  emoji: string;
  label: string;
  pitch: string;
  sections: { title: string; body: string }[];
};

const CARDS: Card[] = [
  {
    id: "gels",
    emoji: "🧴",
    label: "Comment choisir un gel",
    pitch: "Le bon gel = celui que tu digères, pas celui que ton pote vante.",
    sections: [
      {
        title: "Critères à regarder",
        body: "Glucides : 20-30 g par dose, mélange glucose + fructose (ratio 2:1) pour optimiser l'absorption — un gel mono-glucose plafonne à 60 g/h, un gel mixte peut monter à 90 g/h. Sodium : 100-300 mg minimum. Texture : trop épais = ballonnement, trop liquide = peu de glucides. Caféine : utile sur ultra après 4h, mais pas en routine.",
      },
      {
        title: "Erreurs classiques",
        body: "Tester un nouveau gel le jour J (gut training = 6-8 semaines avant la course). Enchaîner 5 gels caféinés (tachycardie + stress digestif). Oublier de boire 100-150 ml d'eau avec chaque gel. Prendre toujours le même goût (fatigue palatale après 4h).",
      },
      {
        title: "Budget vs premium",
        body: "Premium (Maurten, Précision Hydration) : technologie hydrogel, plus chers mais souvent mieux tolérés sur très longue distance. Milieu de gamme (SIS, Powerbar, Overstim's) : très bon rapport efficacité/prix, large palette de goûts. Économique (Decathlon Aptonia, marques distributeur) : qualité tout à fait correcte pour l'entraînement et la majorité des courses.",
      },
    ],
  },
  {
    id: "iso",
    emoji: "💧",
    label: "Comment lire une boisson iso",
    pitch: "Isotonique vs hypotonique : la différence change tout sur la chaleur.",
    sections: [
      {
        title: "Isotonique (la base)",
        body: "Concentration en sucres et sels proche du plasma sanguin (≈ 6-8 g de glucides / 100 ml). Avantage : absorbée vite et apporte énergie. Inconvénient : si fait chaud (> 25°C), peut peser sur l'estomac. Idéal en conditions tempérées et sur 1h-4h d'effort.",
      },
      {
        title: "Hypotonique (chaleur, ultra)",
        body: "Moins concentrée en sucres (3-5 g / 100 ml), absorbée encore plus vite. Indispensable en chaleur > 25°C, en altitude, et sur courses de plus de 6h pour éviter le bloc digestif. Le complément calorique se fait alors via les gels et la vraie food.",
      },
      {
        title: "Sodium : la donnée qui compte",
        body: "Vise 300-600 mg de sodium / litre minimum en effort, 600-800 mg / litre en chaleur. Beaucoup d'iso du commerce sous-dosent en sel (100-200 mg/L) — ce sont des boissons sucrées, pas des iso. Lis l'étiquette : si moins de 300 mg sodium/L, ajoute une pastille de sel.",
      },
    ],
  },
  {
    id: "vraie-food",
    emoji: "🥪",
    label: "Pourquoi varier avec de la vraie food",
    pitch: "Au-delà de 4h, ton estomac demande du salé, du croquant, du chaud.",
    sections: [
      {
        title: "Le moment de bascule",
        body: "Après 3-4h d'effort, le palais sature des saveurs sucrées. Tu peux avoir la nausée rien qu'à voir un gel. La vraie food (salée, solide, variée) relance la prise alimentaire et le moral. C'est pour ça que les ravitos d'ultra ont du fromage, du saucisson, de la soupe.",
      },
      {
        title: "Ce qui marche bien",
        body: "Salé : crackers, fromage type Vache qui rit, jambon, salade de pommes de terre, soupe miso. Sucré-solide : pâte de fruits, banane, riz au lait, pancake. À éviter en course : fritures (digestion lourde), épices (acidité), produits laitiers crémeux (sauf testés avant), tout ce qui demande beaucoup de mastication.",
      },
      {
        title: "Le truc des finishers UTMB",
        body: "Avoir 3 textures différentes en permanence : un gel/liquide, un solide salé, un solide sucré. Tu alternes selon l'envie. Tu manges quelque chose toutes les 25-30 min même sans faim — la faim arrive 15 min trop tard.",
      },
    ],
  },
  {
    id: "essentiels",
    emoji: "⚡",
    label: "Apports à ne pas oublier",
    pitch: "Glucides c'est la base. Sel, magnésium et BCAA font la différence sur le bout.",
    sections: [
      {
        title: "Sodium / sel",
        body: "Perte moyenne en sueur : 500-1500 mg/L. Si tu transpires beaucoup et que tu ne compenses pas, tu chopes une hyponatrémie (nausées, crampes, confusion, voire pire). Sur > 3h : 500 mg sodium/h minimum, plus en chaleur. Pastilles, capsules, ou iso bien dosée.",
      },
      {
        title: "Magnésium",
        body: "Crucial pour les crampes et la récupération musculaire. Un cachet en cours d'effort sur > 6h, et 300-400 mg/jour les semaines avant une grosse course. Magnésium bisglycinate = mieux assimilé que l'oxyde.",
      },
      {
        title: "BCAA (acides aminés)",
        body: "Sur ultra de plus de 8h, ralentit le catabolisme musculaire. Pas miraculeux mais aide à finir moins cassé. 5-10 g sur 8h en plusieurs prises. Pas indispensable sur trail court/moyen.",
      },
      {
        title: "Hydratation pré-course",
        body: "Le piège : croire qu'on rattrape l'hydratation pendant l'effort. Non. Tu pars hydraté ou tu galères. 24h avant : 2.5-3L d'eau étalée + repas avec sodium normal. Pas de surdose 2h avant (urine claire = niveau ok). Évite l'alcool dans les 48h.",
      },
    ],
  },
];

export default function NutritionFundamentals() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="space-y-3">
      <div>
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
          Nutrition trail · Les fondamentaux
        </div>
        <h2 className="font-display text-xl font-black leading-tight">
          Comment choisir ton carburant
        </h2>
        <p className="text-[11px] text-ink-muted mt-1">
          Pour pas te planter en magasin et tester n&apos;importe quoi le
          jour J. Tape sur une fiche pour la déplier.
        </p>
      </div>

      <div className="space-y-2">
        {CARDS.map((c) => {
          const isOpen = openId === c.id;
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-cyan/25 bg-bg-card/70 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : c.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-cyan/5 transition"
                aria-expanded={isOpen}
              >
                <div className="text-2xl shrink-0">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-black leading-tight">
                    {c.label}
                  </div>
                  <div className="text-[11px] text-ink-muted leading-snug">
                    {c.pitch}
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`h-4 w-4 shrink-0 text-cyan transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-cyan/15">
                  {c.sections.map((s) => (
                    <div key={s.title}>
                      <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan mb-0.5">
                        {s.title}
                      </div>
                      <p className="text-[12px] text-ink leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
