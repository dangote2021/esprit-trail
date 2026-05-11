// ====== PÉRIODISATION TRAIL — Blocs d'entraînement ======
// Remplace / complète les "quêtes quotidiennes" critiquées au user testing.
// Un ultra se prépare sur 16-20 semaines en 4 phases :
//   - base (aérobie) : 6-8 sem
//   - spécifique : 4-6 sem
//   - affûtage : 2-3 sem
//   - récup : 2 sem
//
// Pendant un bloc donné, les quêtes proposées respectent la physiologie.
// Ex: en bloc aérobie, on propose des quêtes "sortie longue", "2x seuil court"
// mais PAS "7 runs cette semaine" qui tueraient la progression.

import type { Quest, TrainingBlock, TrainingBlockPhase } from "@/lib/types";

const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};
const addWeeks = (n: number) => addDays(n * 7);

// ====== QUÊTES PAR BLOC ======
// Des quêtes ciblées physiologie qui rentrent dans un cycle de prépa cohérent.
// Unit étendue mais on reste compat avec le type Quest existant.

export const BLOCK_QUESTS: Quest[] = [
  // === BLOC AÉROBIE (base) ===
  {
    id: "block-base-long-run",
    title: "Sortie longue hebdo",
    description: "Cumule 1 sortie de 2h30+ en zone 2 cette semaine",
    icon: "⏱️",
    period: "weekly",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 400,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-base-volume",
    title: "Volume aérobie",
    description: "50 km à intensité facile (< 75% FCmax) cette semaine",
    icon: "🫁",
    period: "weekly",
    target: 50,
    unit: "km",
    progress: 22,
    xpReward: 500,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-base-climb-hours",
    title: "Heures en montée",
    description: "3h de D+ cumulé (marche rapide ou courir en montée)",
    icon: "⛰️",
    period: "weekly",
    target: 3,
    unit: "hours",
    progress: 1.2,
    xpReward: 350,
    expiresAt: addWeeks(1),
  },

  // === BLOC SPÉCIFIQUE ===
  {
    id: "block-spec-vo2",
    title: "Séance VO2 max",
    description: "2 séances VO2 (30-30, 1'/1', 2'/2') cette semaine",
    icon: "💨",
    period: "weekly",
    target: 2,
    unit: "runs",
    progress: 0,
    xpReward: 450,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-spec-threshold",
    title: "Seuil long",
    description: "1 séance seuil 3x10' ou 4x8' cette semaine",
    icon: "🎯",
    period: "weekly",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 400,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-spec-race-specific",
    title: "Sortie course-spécifique",
    description: "3h+ avec D+ ≥ 800m sur profil proche de ta course cible",
    icon: "🏁",
    period: "weekly",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 600,
    expiresAt: addWeeks(1),
  },

  // === BLOC AFFÛTAGE (taper) ===
  {
    id: "block-taper-volume-down",
    title: "Volume ↘ 40%",
    description: "Réduis ton volume hebdo de 40% vs bloc spécifique",
    icon: "📉",
    period: "weekly",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 300,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-taper-intensity-keep",
    title: "Garder l'intensité",
    description: "1 activation ce week-end : 6x1' allure course",
    icon: "⚡",
    period: "weekly",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 250,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-taper-sleep",
    title: "Sommeil ≥ 7h30",
    description: "6 nuits à 7h30+ cette semaine (sync montre)",
    icon: "😴",
    period: "weekly",
    target: 6,
    unit: "days",
    progress: 3,
    xpReward: 200,
    expiresAt: addWeeks(1),
  },

  // === BLOC RÉCUP (post-course) ===
  {
    id: "block-recov-easy-only",
    title: "Footing récup uniquement",
    description: "Aucune intensité cette semaine, footings ≤ 1h zone 1-2",
    icon: "🌿",
    period: "weekly",
    target: 3,
    unit: "runs",
    progress: 0,
    xpReward: 150,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-recov-mobility",
    title: "Mobilité & étirements",
    description: "4 sessions de 15 min mobilité / yoga cette semaine",
    icon: "🧘",
    period: "weekly",
    target: 4,
    unit: "days",
    progress: 1,
    xpReward: 200,
    expiresAt: addWeeks(1),
  },
  {
    id: "block-recov-hrv-watch",
    title: "Remonter la HRV",
    description: "HRV moyenne > baseline sur 7 jours consécutifs",
    icon: "💚",
    period: "weekly",
    target: 7,
    unit: "days",
    progress: 4,
    xpReward: 300,
    expiresAt: addWeeks(1),
  },
];

// ====== BLOCS MOCK (état utilisateur) ======
// En prod : générés par le coach IA à partir de l'objectif + date course.
// Ici on simule un utilisateur en bloc spécifique de prépa MaXi-Race 58k.

export const MY_BLOCKS: TrainingBlock[] = [
  {
    id: "block-mxr-base",
    phase: "base",
    label: "Bloc aérobie",
    icon: "🫁",
    description:
      "Construction de la base aérobie : volume à basse intensité, force spécifique en côtes marchées. Prépare les systèmes mitochondriaux et musculaires aux 4h+ d'effort.",
    startDate: addWeeks(-10),
    endDate: addWeeks(-4),
    weeksTotal: 6,
    weeksDone: 6,
    targetRace: "MaXi-Race Annecy 58k",
    questIds: [
      "block-base-long-run",
      "block-base-volume",
      "block-base-climb-hours",
    ],
  },
  {
    id: "block-mxr-spec",
    phase: "specific",
    label: "Bloc spécifique",
    icon: "🎯",
    description:
      "Travail VO2 + seuil + sortie course-spécifique. Le corps apprend à gérer les demandes physiologiques exactes du jour J : dénivelé, allures, récupération descentes.",
    startDate: addWeeks(-4),
    endDate: addWeeks(1),
    weeksTotal: 5,
    weeksDone: 4,
    targetRace: "MaXi-Race Annecy 58k",
    questIds: [
      "block-spec-vo2",
      "block-spec-threshold",
      "block-spec-race-specific",
    ],
  },
  {
    id: "block-mxr-taper",
    phase: "taper",
    label: "Affûtage",
    icon: "✨",
    description:
      "Volume ↘ 40% sur 10-14 jours, intensité maintenue avec activations courtes. Objectif : arriver frais le jour J, TSB positif, systèmes nerveux régénérés.",
    startDate: addWeeks(1),
    endDate: addWeeks(3),
    weeksTotal: 2,
    weeksDone: 0,
    targetRace: "MaXi-Race Annecy 58k",
    questIds: [
      "block-taper-volume-down",
      "block-taper-intensity-keep",
      "block-taper-sleep",
    ],
  },
  {
    id: "block-mxr-recov",
    phase: "recovery",
    label: "Récup post-course",
    icon: "🌿",
    description:
      "14 jours de régénération après la course : footings doux uniquement, mobilité, remontée HRV. Le travail invisible qui évite les blessures chroniques.",
    startDate: addWeeks(3),
    endDate: addWeeks(5),
    weeksTotal: 2,
    weeksDone: 0,
    questIds: [
      "block-recov-easy-only",
      "block-recov-mobility",
      "block-recov-hrv-watch",
    ],
  },
];

// ====== HELPERS ======

/** Bloc actif (celui qui contient today()). */
export function currentBlock(): TrainingBlock | undefined {
  const now = Date.now();
  return MY_BLOCKS.find(
    (b) =>
      new Date(b.startDate).getTime() <= now &&
      now <= new Date(b.endDate).getTime(),
  );
}

export function getBlockQuests(block: TrainingBlock): Quest[] {
  return BLOCK_QUESTS.filter((q) => block.questIds.includes(q.id));
}

/** Couleur d'accent par phase — cohérent Alpine Light. */
export function phaseAccent(phase: TrainingBlockPhase): {
  accent: "lime" | "peach" | "cyan" | "violet" | "gold";
  label: string;
} {
  const map = {
    base: { accent: "lime" as const, label: "AÉROBIE" },
    specific: { accent: "peach" as const, label: "SPÉCIFIQUE" },
    taper: { accent: "cyan" as const, label: "AFFÛTAGE" },
    recovery: { accent: "gold" as const, label: "RÉCUP" },
  };
  return map[phase];
}
