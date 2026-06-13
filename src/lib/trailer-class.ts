// ====== TRAILER CLASSES — classes RPG du traileur ======
// Chaque classe = archétype de pratique, avec biais sur les stats initiales.

import type { TrailerClass, TrailerStats } from "@/lib/types";

export interface TrailerClassDef {
  id: TrailerClass;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string; // tailwind class accent
  // Biais stats initiales (0 = neutre, +/- = bonus/malus)
  bias: TrailerStats;
}

export const TRAILER_CLASSES: TrailerClassDef[] = [
  {
    id: "sprinter",
    name: "Sprinter",
    emoji: "⚡",
    tagline: "Rapide, nerveux, explosif",
    description:
      "Tu aimes la vitesse. Courses courtes, relances, sprints. Tu claques des chronos sur du 10-25 km.",
    color: "lime",
    bias: { endurance: 45, vitesse: 85, technique: 60, mental: 55, grimpe: 50 },
  },
  {
    id: "ultra",
    name: "Ultra",
    emoji: "🔥",
    tagline: "Endurance infinie",
    description:
      "Tu n'arrêtes jamais. Les longues distances, les nuits dehors, les 100 km — c'est ton terrain.",
    color: "peach",
    bias: { endurance: 90, vitesse: 45, technique: 60, mental: 85, grimpe: 65 },
  },
  {
    id: "alpiniste",
    name: "Alpiniste",
    emoji: "🏔️",
    tagline: "Les cimes t'appellent",
    description:
      "D+ en masse, altitude, air pur. Tu montes plus que tu ne cours. Le ciel est ton plafond.",
    color: "cyan",
    bias: { endurance: 70, vitesse: 50, technique: 75, mental: 70, grimpe: 95 },
  },
  {
    id: "technicien",
    name: "Technicien",
    emoji: "🧗",
    tagline: "Terrain accidenté = ton kif",
    description:
      "Rocaille, racines, single tracks. Tu descends comme un fou, tu n'as peur de rien sous les pieds.",
    color: "violet",
    bias: { endurance: 65, vitesse: 70, technique: 95, mental: 70, grimpe: 75 },
  },
  {
    id: "flâneur",
    name: "Flâneur",
    emoji: "🌲",
    tagline: "Courir pour le plaisir",
    description:
      "Pas là pour la perf. Tu cours pour le paysage, l'air, la vibe. La chrono, on s'en fout.",
    color: "gold",
    bias: { endurance: 60, vitesse: 45, technique: 55, mental: 80, grimpe: 55 },
  },
];

// Experience multiplier — plus t'as d'années, plus les stats initiales sont hautes
function experienceBoost(years: number): number {
  if (years <= 0) return 0.6;
  if (years < 1) return 0.7;
  if (years < 3) return 0.85;
  if (years < 5) return 1.0;
  if (years < 10) return 1.1;
  return 1.15;
}

export function statsForProfile(
  trailerClass: TrailerClass,
  years: number,
): TrailerStats {
  const def = TRAILER_CLASSES.find((c) => c.id === trailerClass)!;
  const mult = experienceBoost(years);
  const clamp = (n: number) => Math.max(10, Math.min(100, Math.round(n * mult)));
  return {
    endurance: clamp(def.bias.endurance),
    vitesse: clamp(def.bias.vitesse),
    technique: clamp(def.bias.technique),
    mental: clamp(def.bias.mental),
    grimpe: clamp(def.bias.grimpe),
  };
}

export function statsTotalPower(s: TrailerStats): number {
  return s.endurance + s.vitesse + s.technique + s.mental + s.grimpe;
}
