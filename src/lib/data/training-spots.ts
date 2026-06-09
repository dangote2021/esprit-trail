// ====== Spots d'entraînement Esprit Trail — mock data ======
// Spots populaires de trail avec coordonnées GPS + GPX téléchargeables.
// Phase 2 = vraie API spots (Wikiloc / Komoot tiles + GPX dynamiques).

export type SpotDifficulty = "facile" | "modere" | "difficile" | "engage";
export type SpotTerrain = "foret" | "montagne" | "littoral" | "campagne" | "alpine";

export type TrainingSpot = {
  id: string;
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  distance: number; // km
  elevation: number; // m D+
  duration: number; // minutes estimés
  difficulty: SpotDifficulty;
  terrain: SpotTerrain;
  description: string;
  highlights: string[];
  /** URL d'un GPX statique (ou null si pas dispo, on génère un mock à la volée) */
  gpxUrl?: string;
};

export const TRAINING_SPOTS: TrainingSpot[] = [
  {
    id: "saleve-petites-varappes",
    slug: "saleve-petites-varappes",
    name: "Salève — Boucle des Petites Varappes",
    region: "Haute-Savoie · 74",
    lat: 46.1295,
    lng: 6.2089,
    distance: 12.4,
    elevation: 850,
    duration: 110,
    difficulty: "modere",
    terrain: "alpine",
    description:
      "Boucle classique au-dessus de Genève. Single technique en montée, vue sur la chaîne du Mont-Blanc, descente roulante.",
    highlights: ["Vue Mont-Blanc", "Single technique", "Refuge des Pitons"],
    gpxUrl: "/gpx/saleve-petites-varappes.gpx",
  },
  {
    id: "mont-d-or-grimpettes",
    slug: "mont-d-or-grimpettes",
    name: "Mont d'Or — Grimpettes lyonnaises",
    region: "Rhône · 69",
    lat: 45.8333,
    lng: 4.7833,
    distance: 18.2,
    elevation: 620,
    duration: 130,
    difficulty: "modere",
    terrain: "campagne",
    description:
      "Le terrain de jeu favori des Lyonnais. Enchaînement de raidillons techniques, sentiers blancs en pierre calcaire.",
    highlights: ["Accessible Lyon", "Pierre calcaire", "Vignes + bois"],
    gpxUrl: "/gpx/mont-d-or-grimpettes.gpx",
  },
  {
    id: "chartreuse-dent-de-crolles",
    slug: "chartreuse-dent-de-crolles",
    name: "Chartreuse — Dent de Crolles",
    region: "Isère · 38",
    lat: 45.3,
    lng: 5.85,
    distance: 16.8,
    elevation: 1300,
    duration: 180,
    difficulty: "difficile",
    terrain: "alpine",
    description:
      "Massif iconique à 30 min de Grenoble. Montée engagée jusqu'au sommet à 2062m, traversée sur les crêtes calcaires.",
    highlights: ["Sommet 2062m", "Crêtes vertigineuses", "Refuge en option"],
    gpxUrl: "/gpx/chartreuse-dent-de-crolles.gpx",
  },
  {
    id: "fontainebleau-3-pignons",
    slug: "fontainebleau-3-pignons",
    name: "Fontainebleau — 3 Pignons",
    region: "Seine-et-Marne · 77",
    lat: 48.4,
    lng: 2.6833,
    distance: 14.5,
    elevation: 280,
    duration: 90,
    difficulty: "facile",
    terrain: "foret",
    description:
      "Sable, rochers, forêt dense. Le spot Île-de-France pour les traileurs : pas trop loin de Paris, varié, ambiance forêt magique.",
    highlights: ["Sable + rochers", "Accessible RER", "Ombre l'été"],
    gpxUrl: "/gpx/fontainebleau-3-pignons.gpx",
  },
  {
    id: "calanques-en-vau",
    slug: "calanques-en-vau",
    name: "Calanques — En-Vau / Port-Pin",
    region: "Bouches-du-Rhône · 13",
    lat: 43.2086,
    lng: 5.4339,
    distance: 11.0,
    elevation: 530,
    duration: 105,
    difficulty: "modere",
    terrain: "littoral",
    description:
      "Trail technique en bord de mer méditerranéenne. Roche blanche, vue azur, descentes engagées. Attention chaleur l'été.",
    highlights: ["Vue mer", "Pierre calcaire blanche", "Baignade arrivée"],
    gpxUrl: "/gpx/calanques-en-vau.gpx",
  },
  {
    id: "cevennes-mont-aigoual",
    slug: "cevennes-mont-aigoual",
    name: "Cévennes — Mont Aigoual",
    region: "Lozère · 48",
    lat: 44.1167,
    lng: 3.5833,
    distance: 22.0,
    elevation: 950,
    duration: 200,
    difficulty: "difficile",
    terrain: "montagne",
    description:
      "Plateau cévenol à 1567m. Vues à 360° sur les Causses, le Causse Méjean et les Pyrénées par temps clair. Attention vent.",
    highlights: ["Sommet 1567m", "Vue Pyrénées", "Climat changeant"],
    gpxUrl: "/gpx/cevennes-mont-aigoual.gpx",
  },

  // ============================================================
  // ÎLE-DE-FRANCE — 5 spots additionnels
  // ============================================================
  {
    id: "rambouillet-foret",
    slug: "rambouillet-foret",
    name: "Forêt de Rambouillet — Étangs de Hollande",
    region: "Yvelines · 78",
    lat: 48.6592,
    lng: 1.8128,
    distance: 18.5,
    elevation: 220,
    duration: 110,
    difficulty: "facile",
    terrain: "foret",
    description:
      "Boucle rapide sur singles roulants entre étangs et chênes. Spot apprécié des Parisiens en mode sortie longue tranquille.",
    highlights: ["Plat roulant", "Étangs", "1h de Paris en train"],
  },
  {
    id: "vallee-chevreuse-port-royal",
    slug: "vallee-chevreuse-port-royal",
    name: "Vallée de Chevreuse — Port-Royal",
    region: "Yvelines · 78",
    lat: 48.7333,
    lng: 2.0167,
    distance: 22.0,
    elevation: 480,
    duration: 145,
    difficulty: "modere",
    terrain: "campagne",
    description:
      "PNR avec relief surprenant pour l'IDF. Single technique sous-bois, raidillons courts, puis retour par ruisseaux.",
    highlights: ["Vrai D+ IDF", "PNR Haute Vallée", "RER B accessible"],
  },
  {
    id: "marly-foret",
    slug: "marly-foret",
    name: "Forêt de Marly — Boucle des Princes",
    region: "Yvelines · 78",
    lat: 48.8833,
    lng: 1.9667,
    distance: 13.5,
    elevation: 180,
    duration: 80,
    difficulty: "facile",
    terrain: "foret",
    description:
      "Le terrain de jeu des coureurs de l'Ouest parisien. Allées royales et singles cachés, idéal sortie après le boulot.",
    highlights: ["Accessible Saint-Germain", "Allées + singles", "Très bien balisé"],
  },
  {
    id: "vexin-3-forets",
    slug: "vexin-3-forets",
    name: "Vexin — Boucle des 3 Forêts",
    region: "Val-d'Oise · 95",
    lat: 49.0833,
    lng: 1.8,
    distance: 28.0,
    elevation: 540,
    duration: 200,
    difficulty: "modere",
    terrain: "campagne",
    description:
      "Boucle longue dans le PNR du Vexin. Plateaux agricoles, chemins blancs, traversée de 3 massifs forestiers.",
    highlights: ["Ultra-trail-friendly", "Chemins blancs", "Peu fréquenté"],
  },
  {
    id: "paris-buttes-chaumont",
    slug: "paris-buttes-chaumont",
    name: "Paris — Buttes-Chaumont + canal",
    region: "Paris · 75",
    lat: 48.8769,
    lng: 2.3819,
    distance: 8.0,
    elevation: 120,
    duration: 50,
    difficulty: "facile",
    terrain: "campagne",
    description:
      "La sortie urbaine pour Parisiens. Côte des Buttes-Chaumont en répétitions + retour sur le canal de l'Ourcq.",
    highlights: ["Intra-muros", "Répétitions de côte", "Tôt le matin"],
  },

  // ============================================================
  // GRAND LYON / RHÔNE-ALPES — 4 spots additionnels
  // ============================================================
  {
    id: "lyon-fourviere-saone",
    slug: "lyon-fourviere-saone",
    name: "Lyon — Fourvière / Quais de Saône",
    region: "Rhône · 69",
    lat: 45.7625,
    lng: 4.8228,
    distance: 8.5,
    elevation: 220,
    duration: 55,
    difficulty: "facile",
    terrain: "campagne",
    description:
      "La sortie urbaine emblématique des Lyonnais. Montée Fourvière en répét', Théâtres Antiques, puis quais de Saône retour.",
    highlights: ["Intra-muros", "Vue sur la ville", "Aux montées Fourvière"],
  },
  {
    id: "monts-d-or-mont-thou",
    slug: "monts-d-or-mont-thou",
    name: "Monts d'Or — Mont Thou + Cirque de Curis",
    region: "Rhône · 69",
    lat: 45.85,
    lng: 4.825,
    distance: 21.0,
    elevation: 780,
    duration: 145,
    difficulty: "modere",
    terrain: "campagne",
    description:
      "Boucle complète des Monts d'Or à partir de Saint-Cyr. Mont Thou (608m) puis traversée du Cirque de Curis. Pour préparer la SaintéLyon.",
    highlights: ["SaintéLyon training", "Mont Thou 608m", "Sentiers techniques"],
  },
  {
    id: "pilat-crets-de-l-oeillon",
    slug: "pilat-crets-de-l-oeillon",
    name: "Pilat — Crêt de l'Œillon",
    region: "Loire · 42",
    lat: 45.4,
    lng: 4.6167,
    distance: 22.5,
    elevation: 1100,
    duration: 200,
    difficulty: "difficile",
    terrain: "montagne",
    description:
      "Massif du Pilat à 50 km de Lyon et Saint-Étienne. Sommet 1364m, vue Mont-Blanc par temps clair. Le terrain de prépa des locaux.",
    highlights: ["Sommet 1364m", "Vue Mont-Blanc", "PNR Pilat"],
  },
  {
    id: "vercors-grands-goulets",
    slug: "vercors-grands-goulets",
    name: "Vercors — Grands Goulets / Combe Laval",
    region: "Drôme · 26",
    lat: 44.95,
    lng: 5.4,
    distance: 25.0,
    elevation: 1400,
    duration: 240,
    difficulty: "difficile",
    terrain: "alpine",
    description:
      "Falaises mythiques du Vercors entre Saint-Jean-en-Royans et la Chapelle. Sentiers vertigineux taillés dans la roche.",
    highlights: ["Falaises 600m", "Sentiers en balcon", "Très technique"],
  },

  // ============================================================
  // SUD / MÉDITERRANÉE — 4 spots additionnels
  // ============================================================
  {
    id: "sainte-baume-saint-pilon",
    slug: "sainte-baume-saint-pilon",
    name: "Sainte-Baume — Saint-Pilon",
    region: "Var · 83",
    lat: 43.3208,
    lng: 5.7475,
    distance: 15.0,
    elevation: 720,
    duration: 130,
    difficulty: "modere",
    terrain: "montagne",
    description:
      "Massif emblématique entre Marseille et Toulon. Forêt magique, ascension du Saint-Pilon (994m), grottes troglodytes.",
    highlights: ["Forêt classée", "Sommet 994m", "Grotte Marie-Madeleine"],
  },
  {
    id: "esterel-pic-ours",
    slug: "esterel-pic-ours",
    name: "Estérel — Pic de l'Ours",
    region: "Var · 83",
    lat: 43.4775,
    lng: 6.86,
    distance: 18.5,
    elevation: 850,
    duration: 165,
    difficulty: "difficile",
    terrain: "littoral",
    description:
      "Roche rouge volcanique face à la Méditerranée. Sentiers techniques, dénivelé violent, vue sur les calanques.",
    highlights: ["Roche rouge", "Vue mer", "Très technique"],
  },
  {
    id: "luberon-mourre-negre",
    slug: "luberon-mourre-negre",
    name: "Luberon — Mourre Nègre",
    region: "Vaucluse · 84",
    lat: 43.8167,
    lng: 5.4333,
    distance: 19.0,
    elevation: 800,
    duration: 145,
    difficulty: "modere",
    terrain: "montagne",
    description:
      "Sommet du Grand Luberon (1125m). Boucle classique sur sentiers blancs, lavande et chênes verts en bas, plateau aride en haut.",
    highlights: ["Sommet 1125m", "Sentiers blancs", "Lavande l'été"],
  },
  {
    id: "ventoux-mont-serein",
    slug: "ventoux-mont-serein",
    name: "Mont Ventoux — Mont Serein",
    region: "Vaucluse · 84",
    lat: 44.18,
    lng: 5.275,
    distance: 24.0,
    elevation: 1500,
    duration: 240,
    difficulty: "engage",
    terrain: "alpine",
    description:
      "Géant de Provence. Boucle complète depuis Bédoin avec passage du sommet à 1909m. Cailloux blancs, vent féroce, terrain lunaire.",
    highlights: ["Sommet 1909m", "Vent extrême", "Désert minéral"],
  },

  // ============================================================
  // NORD / NORMANDIE / BRETAGNE — 4 spots additionnels
  // ============================================================
  {
    id: "cote-opale-cap-blanc-nez",
    slug: "cote-opale-cap-blanc-nez",
    name: "Côte d'Opale — Cap Blanc-Nez",
    region: "Pas-de-Calais · 62",
    lat: 50.9286,
    lng: 1.7203,
    distance: 16.0,
    elevation: 350,
    duration: 110,
    difficulty: "modere",
    terrain: "littoral",
    description:
      "Falaises de craie blanche face à l'Angleterre. Sentier GR-120 entre Wissant et Sangatte, montagnes russes côtières.",
    highlights: ["Falaises 134m", "GR-120", "Vue Angleterre"],
  },
  {
    id: "etretat-falaises",
    slug: "etretat-falaises",
    name: "Étretat — Falaises de la Manneporte",
    region: "Seine-Maritime · 76",
    lat: 49.7058,
    lng: 0.2058,
    distance: 14.0,
    elevation: 420,
    duration: 100,
    difficulty: "modere",
    terrain: "littoral",
    description:
      "Falaises iconiques de Normandie. Boucle entre Étretat et Yport sur les hauteurs, puis retour par la valleuse.",
    highlights: ["Aiguille creuse", "Falaises 90m", "GR-21"],
  },
  {
    id: "bretagne-mont-arree",
    slug: "bretagne-mont-arree",
    name: "Monts d'Arrée — Roc'h Trevezel",
    region: "Finistère · 29",
    lat: 48.4167,
    lng: -3.95,
    distance: 18.0,
    elevation: 480,
    duration: 130,
    difficulty: "modere",
    terrain: "montagne",
    description:
      "Toit de la Bretagne (385m). Lande, tourbière de Yeun Elez, ambiance celte mystique. Vent d'ouest dominant.",
    highlights: ["Toit Bretagne", "Lande sauvage", "Tourbière classée"],
  },
  {
    id: "morbihan-belle-ile-cote-sauvage",
    slug: "morbihan-belle-ile-cote-sauvage",
    name: "Belle-Île — Côte Sauvage",
    region: "Morbihan · 56",
    lat: 47.3,
    lng: -3.2,
    distance: 27.0,
    elevation: 650,
    duration: 200,
    difficulty: "difficile",
    terrain: "littoral",
    description:
      "Sentier des douaniers GR-340 sur la façade atlantique de Belle-Île. Falaises, criques, vent permanent.",
    highlights: ["GR-340", "Aiguilles de Port-Coton", "Bivouac possible"],
  },

  // ============================================================
  // SUD-OUEST / PYRÉNÉES — 4 spots additionnels
  // ============================================================
  {
    id: "pyrenees-pic-du-midi-bigorre",
    slug: "pyrenees-pic-du-midi-bigorre",
    name: "Pyrénées — Pic du Midi de Bigorre",
    region: "Hautes-Pyrénées · 65",
    lat: 42.9367,
    lng: 0.1417,
    distance: 14.0,
    elevation: 1500,
    duration: 200,
    difficulty: "engage",
    terrain: "alpine",
    description:
      "Ascension classique depuis le col du Tourmalet jusqu'à l'observatoire 2877m. Sentier raide, altitude, crampons en hiver.",
    highlights: ["Sommet 2877m", "Observatoire", "Vue Pyrénées 360°"],
  },
  {
    id: "ariege-massif-trois-seigneurs",
    slug: "ariege-massif-trois-seigneurs",
    name: "Ariège — Massif des Trois Seigneurs",
    region: "Ariège · 09",
    lat: 42.85,
    lng: 1.45,
    distance: 24.0,
    elevation: 1700,
    duration: 270,
    difficulty: "engage",
    terrain: "alpine",
    description:
      "Sommet 2199m face à la chaîne pyrénéenne. Boucle ultra-engagée en haute montagne, sources et estives. Préparation Grand Raid.",
    highlights: ["Sommet 2199m", "Estives", "Solitude"],
  },
  {
    id: "bordeaux-arcachon-dune-pyla",
    slug: "bordeaux-arcachon-dune-pyla",
    name: "Bassin d'Arcachon — Dune du Pilat",
    region: "Gironde · 33",
    lat: 44.5878,
    lng: -1.215,
    distance: 16.5,
    elevation: 380,
    duration: 130,
    difficulty: "modere",
    terrain: "littoral",
    description:
      "Forêt de pins, plages atlantiques et l'ascension de la plus haute dune d'Europe (110m). Sortie technique sable.",
    highlights: ["Dune 110m", "Forêt landaise", "Plage Atlantique"],
  },
  {
    id: "dordogne-vezere-sentier-saints",
    slug: "dordogne-vezere-sentier-saints",
    name: "Vézère — Sentier des Saints",
    region: "Dordogne · 24",
    lat: 45.05,
    lng: 1.05,
    distance: 19.5,
    elevation: 520,
    duration: 145,
    difficulty: "modere",
    terrain: "campagne",
    description:
      "Boucle entre falaises ocre, châteaux médiévaux et grottes préhistoriques. Sortie loisir+ pour les Bordelais en weekend.",
    highlights: ["Châteaux", "Grottes Lascaux", "Falaises ocre"],
  },

  // ============================================================
  // ALPES / EST — 4 spots additionnels
  // ============================================================
  {
    id: "chamonix-aiguille-rouges",
    slug: "chamonix-aiguille-rouges",
    name: "Chamonix — Lac Blanc / Aiguilles Rouges",
    region: "Haute-Savoie · 74",
    lat: 45.97,
    lng: 6.93,
    distance: 17.0,
    elevation: 1300,
    duration: 220,
    difficulty: "engage",
    terrain: "alpine",
    description:
      "Boucle iconique du balcon du Mont-Blanc. Lac Blanc à 2352m, vue sur les Drus, l'Aiguille Verte. Préparation CCC / TDS.",
    highlights: ["Lac Blanc 2352m", "Face Mont-Blanc", "CCC/TDS prep"],
  },
  {
    id: "annecy-semnoz",
    slug: "annecy-semnoz",
    name: "Annecy — Semnoz / Crêt de Châtillon",
    region: "Haute-Savoie · 74",
    lat: 45.85,
    lng: 6.1,
    distance: 16.0,
    elevation: 1100,
    duration: 165,
    difficulty: "difficile",
    terrain: "alpine",
    description:
      "Le Semnoz, terrain de jeu d'Annecy. Boucle complète depuis le Sappey. Sommet à 1699m, vue sur le lac. Préparation MaxiRace.",
    highlights: ["Sommet 1699m", "Vue lac Annecy", "MaxiRace training"],
  },
  {
    id: "vosges-grand-ballon",
    slug: "vosges-grand-ballon",
    name: "Vosges — Grand Ballon / Crêtes",
    region: "Haut-Rhin · 68",
    lat: 47.8983,
    lng: 7.0997,
    distance: 21.0,
    elevation: 950,
    duration: 175,
    difficulty: "difficile",
    terrain: "montagne",
    description:
      "Plus haut sommet des Vosges (1424m). Boucle sur la Route des Crêtes, hautes chaumes, fermes-auberges. Vue Forêt-Noire.",
    highlights: ["Sommet 1424m", "Route des Crêtes", "Fermes-auberges"],
  },
  {
    id: "jura-cret-de-la-neige",
    slug: "jura-cret-de-la-neige",
    name: "Jura — Crêt de la Neige",
    region: "Ain · 01",
    lat: 46.2667,
    lng: 5.9667,
    distance: 23.0,
    elevation: 1300,
    duration: 205,
    difficulty: "difficile",
    terrain: "montagne",
    description:
      "Toit du Jura à 1720m, face à la chaîne du Mont-Blanc. Sentier d'arête vertigineux, prairies d'altitude, falaises.",
    highlights: ["Toit Jura 1720m", "Vue Mont-Blanc", "Arête vertigineuse"],
  },
];

// Distance haversine entre 2 coords GPS (km)
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const DIFFICULTY_META: Record<SpotDifficulty, { label: string; color: string }> = {
  facile:    { label: "Facile",    color: "bg-lime/15 text-lime border-lime/30" },
  modere:    { label: "Modéré",    color: "bg-cyan/15 text-cyan border-cyan/30" },
  difficile: { label: "Difficile", color: "bg-peach/15 text-peach border-peach/30" },
  engage:    { label: "Engagé",    color: "bg-mythic/15 text-mythic border-mythic/30" },
};

export const TERRAIN_META: Record<SpotTerrain, { label: string; emoji: string }> = {
  foret:     { label: "Forêt",     emoji: "🌲" },
  montagne:  { label: "Montagne",  emoji: "⛰️" },
  alpine:    { label: "Alpin",     emoji: "🏔️" },
  littoral:  { label: "Littoral",  emoji: "🌊" },
  campagne:  { label: "Campagne",  emoji: "🌾" },
};
