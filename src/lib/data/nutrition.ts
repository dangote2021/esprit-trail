// ====== Nutrition trail & gut training — guide V1 ======
// Recommandations basées sur ISSN (International Society of Sports Nutrition)
// + retours terrain ultra-trail (Hoka NAZ Elite, INSEP, équipes UTMB).
// Ce sont des repères, pas des prescriptions médicales.
//
// 3 axes :
//   1. Apports recommandés en course selon durée
//   2. Plan gut training progressif sur 6-8 semaines
//   3. Liste de produits référence (gels, barres, boissons, vraie food)

// ============================================================================
// 1. APPORTS PAR TRANCHE D'EFFORT
// ============================================================================

export type EffortBracket =
  | "short"     // < 60 min
  | "medium"    // 1-2 h
  | "long"      // 2-3 h
  | "very-long" // 3-4 h
  | "ultra";    // 4 h +

export interface NutritionTarget {
  bracket: EffortBracket;
  durationLabel: string;
  /** Glucides en g/h */
  carbsPerHour: { min: number; max: number };
  /** Hydratation en ml/h (zone tempérée) */
  fluidPerHour: { min: number; max: number };
  /** Sodium en mg/h */
  sodiumPerHour: { min: number; max: number };
  /** Conseils texte */
  notes: string[];
}

export const NUTRITION_TARGETS: NutritionTarget[] = [
  {
    bracket: "short",
    durationLabel: "< 1 h",
    carbsPerHour: { min: 0, max: 30 },
    fluidPerHour: { min: 200, max: 400 },
    sodiumPerHour: { min: 0, max: 200 },
    notes: [
      "Sur 1h ou moins, pas besoin de glucides — tes réserves de glycogène suffisent.",
      "Bois si soif, c'est tout.",
    ],
  },
  {
    bracket: "medium",
    durationLabel: "1 – 2 h",
    carbsPerHour: { min: 30, max: 60 },
    fluidPerHour: { min: 400, max: 600 },
    sodiumPerHour: { min: 200, max: 500 },
    notes: [
      "Premier gel à 30 min, puis 1 toutes les 30-40 min.",
      "Privilégie le glucose-fructose 2:1 (Maurten, SiS Beta Fuel) — meilleure absorption.",
      "Hydrate toutes les 15 min en petites gorgées.",
    ],
  },
  {
    bracket: "long",
    durationLabel: "2 – 3 h",
    carbsPerHour: { min: 60, max: 75 },
    fluidPerHour: { min: 500, max: 700 },
    sodiumPerHour: { min: 300, max: 600 },
    notes: [
      "Routine : 1 gel toutes les 25-30 min ou 1 barre + 1 gel par heure.",
      "Sel obligatoire : pastilles, comprimés salés ou boisson sodée.",
      "Si tu sens un coup de moins bien : sucre rapide d'urgence (gel) + 200ml eau.",
    ],
  },
  {
    bracket: "very-long",
    durationLabel: "3 – 4 h",
    carbsPerHour: { min: 70, max: 85 },
    fluidPerHour: { min: 500, max: 700 },
    sodiumPerHour: { min: 400, max: 700 },
    notes: [
      "Alternance gels + solides : ton estomac fatigue sur du gel pur.",
      "Inclus 1 vraie nourriture par heure (pâte de fruit, banane, sandwich miel).",
      "Surveille ta couleur d'urine au prochain ravito : claire = OK, foncé = bois.",
    ],
  },
  {
    bracket: "ultra",
    durationLabel: "4 h +",
    carbsPerHour: { min: 70, max: 90 },
    fluidPerHour: { min: 600, max: 800 },
    sodiumPerHour: { min: 500, max: 800 },
    notes: [
      "Vraie nourriture obligatoire : sandwichs, pâtes froides, riz au sel, baby pots.",
      "Évite les goûts trop sucrés sur la durée — sale + salé sauve la mise.",
      "Mange avant d'avoir faim (toutes les 30 min) et bois avant d'avoir soif.",
      "Sur 100 km+ prévois 2-3 repas chauds aux ravitos longs.",
      "Caféine en 2e mi-course : 100-200 mg dans gel ou comprimé.",
    ],
  },
];

// ============================================================================
// 2. PLAN GUT TRAINING — entraîner l'estomac à absorber + de glucides
// ============================================================================

export interface GutTrainingPhase {
  weeks: string;
  carbsTarget: number; // g/h objectif sur la sortie longue
  description: string;
  practice: string;
}

export const GUT_TRAINING_PLAN: GutTrainingPhase[] = [
  {
    weeks: "Semaines 1-2",
    carbsTarget: 30,
    description: "Sortie longue à 30 g de glucides/h.",
    practice:
      "1 gel ou 1 barre toutes les heures sur ta sortie longue. Goût neutre, peu sucré. Vérifie que tu digères bien à l'allure visée.",
  },
  {
    weeks: "Semaines 3-4",
    carbsTarget: 45,
    description: "Monte à 45 g/h.",
    practice:
      "Ajoute 1 gel à mi-séance. Note tout : ballonnement, écœurement, énergie. Tu identifies le produit qui passe.",
  },
  {
    weeks: "Semaines 5-6",
    carbsTarget: 60,
    description: "Cible jour de course pour < 50K = 60 g/h.",
    practice:
      "Routine fixe : 1 gel toutes les 25-30 min + sel toutes les 60 min. Test ton plan exact de course sur 1 sortie longue.",
  },
  {
    weeks: "Semaines 7-8",
    carbsTarget: 80,
    description: "Cible ultra : 80-90 g/h.",
    practice:
      "Mix gels + solides + boisson sucrée. Tu dois pouvoir prendre 80 g/h sans ballonner. Si oui = jour de course safe.",
  },
];

// ============================================================================
// 3. PRODUITS RÉFÉRENCE
// ============================================================================

export interface NutritionProduct {
  name: string;
  category: "gel" | "bar" | "drink" | "real-food" | "salt";
  carbsPerUnit: number; // g
  unit: string;
  notes: string;
  goodFor: EffortBracket[];
}

export const NUTRITION_PRODUCTS: NutritionProduct[] = [
  // Gels
  { name: "Maurten Gel 100",      category: "gel",       carbsPerUnit: 25, unit: "1 gel",   notes: "Hydrogel, neutre, digestion exceptionnelle.",         goodFor: ["medium", "long", "very-long", "ultra"] },
  { name: "SiS Beta Fuel",        category: "gel",       carbsPerUnit: 40, unit: "1 gel",   notes: "Ratio 1:0.8 glucose/fructose, 40g par gel — gain de temps.", goodFor: ["long", "very-long", "ultra"] },
  { name: "Precision Hydration",  category: "gel",       carbsPerUnit: 30, unit: "1 gel",   notes: "Goût neutre, dosage précis selon ton sweat test.",     goodFor: ["medium", "long"] },
  { name: "Spring Energy",        category: "gel",       carbsPerUnit: 22, unit: "1 sachet", notes: "Vraie nourriture en gel (riz, banane, miel).",         goodFor: ["very-long", "ultra"] },
  // Barres
  { name: "Bouge bar trail",      category: "bar",       carbsPerUnit: 25, unit: "1 barre", notes: "Marque française, goût avoine + miel + sel.",          goodFor: ["medium", "long"] },
  { name: "Naak Endurance",       category: "bar",       carbsPerUnit: 30, unit: "1 barre", notes: "Protéines + glucides, idéale en sortie longue.",       goodFor: ["very-long", "ultra"] },
  // Boissons
  { name: "Tailwind Endurance",   category: "drink",     carbsPerUnit: 25, unit: "/scoop",  notes: "Boisson + glucides + sodium — solution complète sur 4h.", goodFor: ["long", "very-long", "ultra"] },
  { name: "Maurten 320",          category: "drink",     carbsPerUnit: 80, unit: "/sachet", notes: "Concentration max — 80g de glucides en 500ml.",        goodFor: ["very-long", "ultra"] },
  // Vraie food
  { name: "Banane bien mûre",     category: "real-food", carbsPerUnit: 25, unit: "1 fruit",  notes: "Glucides + potassium, anti-crampes.",                  goodFor: ["long", "very-long", "ultra"] },
  { name: "Pâte de fruit",        category: "real-food", carbsPerUnit: 20, unit: "1 carré",  notes: "Sucre rapide, goût sucré-acidulé, change du gel.",     goodFor: ["medium", "long", "very-long", "ultra"] },
  { name: "Sandwich pain de mie + miel", category: "real-food", carbsPerUnit: 35, unit: "1 sandwich", notes: "Le classique du ravito long. Sel naturel du pain.", goodFor: ["very-long", "ultra"] },
  { name: "Petit pot bébé compote", category: "real-food", carbsPerUnit: 15, unit: "1 pot",  notes: "Doux, s'avale facilement quand tu n'as plus faim.",    goodFor: ["ultra"] },
  // Sel
  { name: "Salt Stick caps",      category: "salt",      carbsPerUnit: 0,  unit: "1 cap",   notes: "215 mg sodium/cap. Une toutes les 60-90 min sur effort long.", goodFor: ["long", "very-long", "ultra"] },
  { name: "Pastilles salées Holyfat", category: "salt",  carbsPerUnit: 5,  unit: "1 pastille", notes: "300 mg sodium + énergie rapide.",                  goodFor: ["long", "very-long", "ultra"] },
];

// ============================================================================
// Helper : recommande un bracket selon la durée prévue (en minutes)
// ============================================================================

export function bracketForDuration(durationMinutes: number): EffortBracket {
  if (durationMinutes < 60) return "short";
  if (durationMinutes < 120) return "medium";
  if (durationMinutes < 180) return "long";
  if (durationMinutes < 240) return "very-long";
  return "ultra";
}

export function getNutritionTarget(bracket: EffortBracket): NutritionTarget {
  return NUTRITION_TARGETS.find((t) => t.bracket === bracket) || NUTRITION_TARGETS[2];
}

export function productsForBracket(bracket: EffortBracket): NutritionProduct[] {
  return NUTRITION_PRODUCTS.filter((p) => p.goodFor.includes(bracket));
}

export const BRACKET_LABELS: Record<EffortBracket, { emoji: string; label: string; color: string }> = {
  short:       { emoji: "🚶", label: "Court (< 1h)",     color: "lime"   },
  medium:      { emoji: "🏃", label: "Moyen (1-2h)",     color: "cyan"   },
  long:        { emoji: "⛰️", label: "Long (2-3h)",      color: "peach"  },
  "very-long": { emoji: "🌄", label: "Très long (3-4h)", color: "violet" },
  ultra:       { emoji: "🌌", label: "Ultra (4h+)",      color: "mythic" },
};

// ============================================================================
// 4. PLAN NUTRITION PAR COURSE
// ============================================================================
// Génère une timeline horaire personnalisée pour une course :
// "À H+0:30 (km 5) → 1 gel Maurten + 200 ml Tailwind"
// "À H+1:00 (km 10) → 1 pastille de sel + 250 ml eau"
// etc.

/**
 * Estime la durée de course en minutes à partir de distance, D+ et niveau.
 * Allure base trail = 7-12 min/km selon niveau et terrain.
 * Pénalité 10 min par 100m D+ (règle empirique).
 */
export function estimateRaceDurationMin(
  distanceKm: number,
  elevationM: number,
  itraIndex = 600,
): number {
  // Allure base ajustée selon ITRA (élite ≈ 700+, intermédiaire ≈ 600, débutant ≈ 500)
  const basePace = itraIndex >= 700 ? 6.5 : itraIndex >= 600 ? 8 : itraIndex >= 500 ? 10 : 12;
  const flatTime = distanceKm * basePace;
  const climbTime = (elevationM / 100) * 10;
  return Math.round(flatTime + climbTime);
}

export type FuelItem = {
  /** Décalage depuis le départ en minutes */
  offsetMin: number;
  /** km approximatif */
  km: number;
  /** Type de prise */
  type: "gel" | "bar" | "drink" | "salt" | "real-food";
  /** Description */
  label: string;
  /** Détail (g de glucides, ml eau, etc.) */
  detail: string;
};

export type RaceFuelPlan = {
  durationMin: number;
  bracket: EffortBracket;
  raceStartIso: string;
  totalCarbs: number;
  totalFluid: number;
  shoppingList: { name: string; quantity: number; unit: string }[];
  timeline: FuelItem[];
};

/**
 * Génère un plan nutrition timing-précis pour une course.
 */
export function buildRaceFuelPlan(opts: {
  distanceKm: number;
  elevationM: number;
  raceStartIso: string;
  itraIndex?: number;
}): RaceFuelPlan {
  const durationMin = estimateRaceDurationMin(
    opts.distanceKm,
    opts.elevationM,
    opts.itraIndex,
  );
  const bracket = bracketForDuration(durationMin);
  const target = getNutritionTarget(bracket);

  // Cible glucides moyenne (par heure) — on prend la médiane du bracket
  const carbsTargetPerH = (target.carbsPerHour.min + target.carbsPerHour.max) / 2;
  const sodiumPerH = (target.sodiumPerHour.min + target.sodiumPerHour.max) / 2;

  const timeline: FuelItem[] = [];
  const distancePerMin = opts.distanceKm / durationMin;

  // Helper : convertir offsetMin en km approximatif
  const kmAt = (m: number) => Math.round(m * distancePerMin * 10) / 10;

  // Pré-course : 30 min avant le départ
  if (durationMin >= 60) {
    timeline.push({
      offsetMin: -30,
      km: 0,
      type: "drink",
      label: "Pré-course",
      detail: "300 ml d'eau + 1 boisson glucidique légère",
    });
  }

  // Pendant la course — routine de prises
  // Stratégie de remplissage glucidique :
  //   - 1 gel (25g) toutes les 30 min sur la 1re heure
  //   - Sur effort >2h : alterner gel + boisson sucrée
  //   - Sur ultra : ajouter solides (barre / pâte de fruit / sandwich)

  const gelInterval = bracket === "medium" ? 35 : 30; // min entre 2 gels
  const lastGelOffset = Math.max(0, durationMin - 30); // dernier gel à H-30
  let nextGelAt = 30;
  while (nextGelAt <= lastGelOffset) {
    const isOdd = Math.floor(nextGelAt / gelInterval) % 2 === 1;
    if (bracket === "very-long" || bracket === "ultra") {
      // Alterne gel et solide pour éviter écœurement
      timeline.push({
        offsetMin: nextGelAt,
        km: kmAt(nextGelAt),
        type: isOdd ? "bar" : "gel",
        label: isOdd ? "Barre énergétique" : "Gel glucidique",
        detail: isOdd
          ? "1 barre Bouge / Naak (~25-30g glucides) + 200 ml eau"
          : "1 gel Maurten 100 ou SiS Beta Fuel (~25-40g glucides)",
      });
    } else {
      timeline.push({
        offsetMin: nextGelAt,
        km: kmAt(nextGelAt),
        type: "gel",
        label: "Gel glucidique",
        detail: "1 gel Maurten 100 ou SiS Beta Fuel (~25-40g glucides)",
      });
    }
    nextGelAt += gelInterval;
  }

  // Sel : toutes les 60-90 min sur effort long
  if (bracket === "long" || bracket === "very-long" || bracket === "ultra") {
    const saltInterval = 75;
    let nextSaltAt = saltInterval;
    while (nextSaltAt <= durationMin - 30) {
      timeline.push({
        offsetMin: nextSaltAt,
        km: kmAt(nextSaltAt),
        type: "salt",
        label: "Pastille de sel",
        detail: `1 Salt Stick cap (${Math.round(sodiumPerH * 0.6)} mg sodium) + 250 ml eau`,
      });
      nextSaltAt += saltInterval;
    }
  }

  // Hydratation : rappel toutes les 15 min, mais on n'inonde pas la timeline.
  // On ajoute une consigne globale dans la liste plutôt que chaque 15 min.

  // Real food sur ultra : 1 vraie food par heure après H+2h
  if (bracket === "ultra") {
    let realAt = 120;
    while (realAt < durationMin - 30) {
      timeline.push({
        offsetMin: realAt,
        km: kmAt(realAt),
        type: "real-food",
        label: "Vraie nourriture",
        detail: "Sandwich miel, baby pot compote, banane mûre — change du sucré",
      });
      realAt += 60;
    }
  }

  // Sur ultra : caféine en 2e mi-course
  if (bracket === "ultra") {
    timeline.push({
      offsetMin: Math.round(durationMin * 0.6),
      km: kmAt(Math.round(durationMin * 0.6)),
      type: "gel",
      label: "Gel caféiné",
      detail: "1 gel avec 100 mg caféine — coup de boost en 2e mi-course",
    });
  }

  // Tri par offset
  timeline.sort((a, b) => a.offsetMin - b.offsetMin);

  // Calcul totaux
  const totalGels = timeline.filter((t) => t.type === "gel").length;
  const totalBars = timeline.filter((t) => t.type === "bar").length;
  const totalSalts = timeline.filter((t) => t.type === "salt").length;
  const totalRealFood = timeline.filter((t) => t.type === "real-food").length;
  const totalCarbs = totalGels * 30 + totalBars * 28 + totalRealFood * 25;
  const totalFluid = Math.round(
    ((target.fluidPerHour.min + target.fluidPerHour.max) / 2) * (durationMin / 60),
  );

  // Liste de courses
  const shoppingList: { name: string; quantity: number; unit: string }[] = [];
  if (totalGels > 0) {
    shoppingList.push({
      name: "Gels (Maurten 100, SiS Beta Fuel ou Spring Energy)",
      quantity: totalGels + 2,
      unit: "gels",
    });
  }
  if (totalBars > 0) {
    shoppingList.push({
      name: "Barres énergétiques (Bouge ou Naak)",
      quantity: totalBars + 1,
      unit: "barres",
    });
  }
  if (totalSalts > 0) {
    shoppingList.push({
      name: "Pastilles de sel (Salt Stick caps ou Holyfat)",
      quantity: totalSalts + 2,
      unit: "pastilles",
    });
  }
  if (bracket === "long" || bracket === "very-long" || bracket === "ultra") {
    shoppingList.push({
      name: "Boisson énergétique (Tailwind ou Maurten 320)",
      quantity: Math.ceil(durationMin / 60),
      unit: "doses (1 dose / h)",
    });
  }
  if (totalRealFood > 0) {
    shoppingList.push({
      name: "Vraie nourriture (banane, pâte de fruit, sandwich miel, baby pots)",
      quantity: totalRealFood + 1,
      unit: "portions",
    });
  }

  return {
    durationMin,
    bracket,
    raceStartIso: opts.raceStartIso,
    totalCarbs,
    totalFluid,
    shoppingList,
    timeline,
  };
}

/**
 * Convertit un offset (minutes depuis départ) en heure absolue (heure locale
 * de la course). Les ISO de races.ts encodent l'heure locale du départ avec
 * un `Z` final — on force timeZone:"UTC" pour afficher littéralement l'hh:mm
 * encodée, indépendamment du fuseau du visiteur. C'est ce qui correspond au
 * vécu terrain : "départ 5h du matin" doit s'afficher "05:00" pour tout le
 * monde, pas "07:00" pour un Allemand ou "23:00" pour un Brésilien.
 */
export function offsetToTime(raceStartIso: string, offsetMin: number): string {
  const t = new Date(raceStartIso).getTime() + offsetMin * 60 * 1000;
  return new Date(t).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/**
 * Format "H+1:30" depuis offset minutes.
 */
export function formatOffset(offsetMin: number): string {
  if (offsetMin < 0) return `H${offsetMin}min`;
  const h = Math.floor(offsetMin / 60);
  const m = offsetMin % 60;
  return h === 0 ? `H+${m}min` : `H+${h}h${m.toString().padStart(2, "0")}`;
}
