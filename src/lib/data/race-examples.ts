// ====== Mapping ville → exemple course pour capture hero ======
// Utilisé par PublicLanding pour adapter la capture #1 du hero à la ville
// du visiteur (header Vercel `x-vercel-ip-city`). Objectif : montrer un
// exemple de course que le visiteur connaît / qu'il pourrait réellement
// faire, plutôt qu'un CCC qui effraie un débutant lyonnais.

export interface RaceExample {
  raceId: string;
  raceName: string;
  raceLabel: string; // ex "CCC · UTMB"
  distanceKm: number;
  elevationM: number;
  startTime: string; // affichage "09:00" — heure littérale du départ
  prises: { time: string; label: string; note: string }[];
  closingNote: string;
  matchLabel?: string; // ex "Lyonnais" — affiché en eyebrow
}

// Catalogue des exemples disponibles
const EXAMPLES: Record<string, RaceExample> = {
  ccc: {
    raceId: "ccc-2026",
    raceName: "CCC",
    raceLabel: "CCC · UTMB",
    distanceKm: 101,
    elevationM: 6100,
    startTime: "09:00",
    prises: [
      { time: "09:00", label: "⚡ Gel Maurten 100 caf", note: "25g glucides" },
      { time: "09:30", label: "🍌 Barre énergétique", note: "30g" },
      { time: "10:00", label: "💧 Tailwind 500ml", note: "25g" },
      { time: "10:30", label: "⚡ Gel + ravito Trient", note: "30g" },
    ],
    closingNote:
      "Plan calculé à partir de ton ITRA, distance, D+ et météo prévue. Évite la fringale au km 70.",
  },
  saintelyon: {
    raceId: "saintelyon-2026",
    raceName: "SaintéLyon",
    raceLabel: "SaintéLyon · 78 km",
    distanceKm: 78,
    elevationM: 2000,
    startTime: "00:00",
    prises: [
      { time: "23:55", label: "☕ Café + barre", note: "−5min départ" },
      { time: "00:30", label: "⚡ Gel SiS isotonic", note: "25g km 5" },
      { time: "01:00", label: "💧 Tailwind 500ml", note: "25g hydrat" },
      { time: "01:30", label: "🍫 Barre Maurten", note: "30g km 13" },
    ],
    closingNote:
      "Plan calé sur ton ITRA, profil de la course (vallons), température nuit. T'ouvres pas l'estomac à minuit pour rien.",
    matchLabel: "Lyonnais",
  },
  maxirace: {
    raceId: "maxirace-annecy-2026",
    raceName: "MaxiRace",
    raceLabel: "MaXi-Race · 84 km",
    distanceKm: 84,
    elevationM: 5400,
    startTime: "05:00",
    prises: [
      { time: "04:55", label: "☕ Café + barre", note: "−5min départ" },
      { time: "05:30", label: "⚡ Gel Maurten 100", note: "25g km 6" },
      { time: "06:00", label: "🍫 Barre énergétique", note: "30g hydrat" },
      { time: "06:30", label: "💧 Tailwind 500ml", note: "25g km 14" },
    ],
    closingNote:
      "Plan optimisé pour les ravitos officiels MaxiRace + ton profil. Pas de surprise au Semnoz.",
    matchLabel: "Annéciens",
  },
  ecotrail: {
    raceId: "ecotrail-paris-2026",
    raceName: "EcoTrail Paris",
    raceLabel: "EcoTrail Paris · 80 km",
    distanceKm: 80,
    elevationM: 1500,
    startTime: "20:00",
    prises: [
      { time: "19:45", label: "☕ Café + banane", note: "−15min départ" },
      { time: "20:30", label: "⚡ Gel SiS Beta Fuel", note: "40g km 5" },
      { time: "21:00", label: "💧 Tailwind 500ml", note: "25g hydrat" },
      { time: "21:30", label: "🍫 Barre TORQ", note: "30g km 12" },
    ],
    closingNote:
      "Plan calé sur le départ de nuit dans les bois de Meudon, ravitos parisiens, gestion sommeil.",
    matchLabel: "Parisiens",
  },
  cote_opale: {
    raceId: "trail-cote-opale-2026",
    raceName: "Côte d'Opale",
    raceLabel: "Trail de la Côte d'Opale · 55 km",
    distanceKm: 55,
    elevationM: 1200,
    startTime: "08:00",
    prises: [
      { time: "07:50", label: "☕ Café + tartine", note: "−10min" },
      { time: "08:30", label: "⚡ Gel Maurten 100", note: "25g km 5" },
      { time: "09:00", label: "💧 Tailwind 500ml", note: "25g vent" },
      { time: "09:30", label: "🍫 Barre énergétique", note: "30g km 13" },
    ],
    closingNote:
      "Plan adapté au vent côtier (déshydratation) et aux montées falaises. Pas de pétage au Cap Gris-Nez.",
    matchLabel: "Nordistes",
  },
  pyrenees: {
    raceId: "grand-raid-2026",
    raceName: "Grand Raid des Pyrénées",
    raceLabel: "GRP · 160 km",
    distanceKm: 160,
    elevationM: 10000,
    startTime: "05:00",
    prises: [
      { time: "04:55", label: "☕ Café + barre", note: "−5min départ" },
      { time: "05:30", label: "⚡ Gel Maurten 100 caf", note: "25g km 5" },
      { time: "06:00", label: "💧 Tailwind 500ml", note: "25g montée" },
      { time: "06:30", label: "🍫 Barre + sel", note: "30g + Na" },
    ],
    closingNote:
      "Plan ultra-distance Pyrénées : altitude, big descentes, gestion estomac sur 30h+. Sources Jeukendrup.",
    matchLabel: "Sud-Ouest",
  },
  vercors: {
    raceId: "trail-vercors-2026",
    raceName: "Trail du Vercors",
    raceLabel: "Trail du Vercors · 42 km",
    distanceKm: 42,
    elevationM: 2400,
    startTime: "06:00",
    prises: [
      { time: "05:55", label: "☕ Café + tartine", note: "−5min" },
      { time: "06:30", label: "⚡ Gel SiS isotonic", note: "25g km 4" },
      { time: "07:00", label: "💧 Tailwind 500ml", note: "25g hydrat" },
      { time: "07:30", label: "🍫 Barre énergétique", note: "30g km 11" },
    ],
    closingNote:
      "Plan calibré pour la dénivelée Vercors et le rythme marathon montagne.",
    matchLabel: "Grenoblois",
  },
};

// Normalise une chaîne (déjà décodée) : minuscules + sans accent
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

/**
 * Choisit le meilleur exemple de course à mettre en hero pour une ville.
 * Fallback CCC si on ne reconnaît pas.
 */
export function pickRaceExample(city?: string | null): RaceExample {
  if (!city) return EXAMPLES.ccc;
  let decoded = city;
  try {
    decoded = decodeURIComponent(city);
  } catch {
    // ignore
  }
  const c = norm(decoded);

  // Lyon, Saint-Étienne, Villeurbanne, Caluire, Vienne…
  if (
    c.includes("lyon") ||
    c.includes("saint-etienne") ||
    c.includes("st-etienne") ||
    c.includes("villeurbanne") ||
    c.includes("caluire") ||
    c.includes("vienne")
  ) {
    return EXAMPLES.saintelyon;
  }
  // Annecy, Annemasse, Sallanches, Cluses
  if (
    c.includes("annecy") ||
    c.includes("annemasse") ||
    c.includes("cluses") ||
    c.includes("sallanches") ||
    c.includes("thonon")
  ) {
    return EXAMPLES.maxirace;
  }
  // Chamonix, Genève, Sallanches → CCC
  if (
    c.includes("chamonix") ||
    c.includes("argentiere") ||
    c.includes("geneva") ||
    c.includes("geneve") ||
    c.includes("courmayeur")
  ) {
    return { ...EXAMPLES.ccc, matchLabel: "Mont-Blanc" };
  }
  // Paris, Île-de-France
  if (
    c.includes("paris") ||
    c.includes("boulogne") ||
    c.includes("levallois") ||
    c.includes("vincennes") ||
    c.includes("meudon") ||
    c.includes("versailles") ||
    c.includes("saint-denis") ||
    c.includes("nanterre") ||
    c.includes("ivry") ||
    c.includes("montreuil")
  ) {
    return EXAMPLES.ecotrail;
  }
  // Nord — Lille, Calais, Boulogne-sur-Mer, Dunkerque
  if (
    c.includes("lille") ||
    c.includes("calais") ||
    c.includes("dunkerque") ||
    c.includes("roubaix") ||
    c.includes("tourcoing") ||
    c.includes("arras") ||
    c.includes("amiens")
  ) {
    return EXAMPLES.cote_opale;
  }
  // Sud-Ouest — Toulouse, Bordeaux, Pau, Tarbes
  if (
    c.includes("toulouse") ||
    c.includes("bordeaux") ||
    c.includes("pau") ||
    c.includes("tarbes") ||
    c.includes("biarritz") ||
    c.includes("bayonne") ||
    c.includes("perigueux") ||
    c.includes("agen")
  ) {
    return EXAMPLES.pyrenees;
  }
  // Grenoble, Vercors
  if (
    c.includes("grenoble") ||
    c.includes("voiron") ||
    c.includes("villard-de-lans") ||
    c.includes("echirolles")
  ) {
    return EXAMPLES.vercors;
  }
  // Default CCC
  return EXAMPLES.ccc;
}
