// ====== Demo spots par ville pour /demo (scène 1) ======
// Mapping ville → 3 spots à afficher dans la démo. Détection via header
// Vercel x-vercel-ip-city (sans popup géoloc). Fallback Lyon.

export interface DemoSpot {
  name: string;
  region: string;
  dist: number;
  km: number;
  dPlus: number;
  difficulty: "Facile" | "Modéré" | "Engagé" | "Expert";
  color: "lime" | "cyan" | "peach";
}

export interface DemoCityPack {
  cityLabel: string; // ex. "autour de Lyon"
  spots: DemoSpot[];
}

const PACKS: Record<string, DemoCityPack> = {
  lyon: {
    cityLabel: "autour de Lyon",
    spots: [
      { name: "Mont d'Or", region: "Rhône", dist: 12, km: 14, dPlus: 580, difficulty: "Facile", color: "lime" },
      { name: "Lyon Fourvière → Saône", region: "Lyon centre", dist: 0.5, km: 8, dPlus: 220, difficulty: "Facile", color: "cyan" },
      { name: "Crêt de l'Œillon", region: "Massif du Pilat", dist: 48, km: 22, dPlus: 1100, difficulty: "Engagé", color: "peach" },
    ],
  },
  paris: {
    cityLabel: "autour de Paris",
    spots: [
      { name: "Buttes-Chaumont + canal", region: "Paris 19e", dist: 1, km: 8, dPlus: 120, difficulty: "Facile", color: "lime" },
      { name: "Forêt de Rambouillet", region: "Yvelines", dist: 45, km: 18, dPlus: 220, difficulty: "Facile", color: "cyan" },
      { name: "Fontainebleau — 3 Pignons", region: "Seine-et-Marne", dist: 55, km: 14, dPlus: 280, difficulty: "Modéré", color: "peach" },
    ],
  },
  annecy: {
    cityLabel: "autour d'Annecy",
    spots: [
      { name: "Semnoz · Crêt de Châtillon", region: "Haute-Savoie", dist: 8, km: 16, dPlus: 1100, difficulty: "Engagé", color: "peach" },
      { name: "Mont Veyrier", region: "Annecy nord-est", dist: 6, km: 12, dPlus: 800, difficulty: "Modéré", color: "cyan" },
      { name: "La Tournette", region: "Massif Bauges", dist: 22, km: 18, dPlus: 1400, difficulty: "Engagé", color: "peach" },
    ],
  },
  bordeaux: {
    cityLabel: "autour de Bordeaux",
    spots: [
      { name: "Bassin d'Arcachon — Dune du Pilat", region: "Gironde", dist: 70, km: 16, dPlus: 380, difficulty: "Modéré", color: "cyan" },
      { name: "Forêt du Médoc", region: "Bordeaux ouest", dist: 30, km: 18, dPlus: 180, difficulty: "Facile", color: "lime" },
      { name: "Vézère — Sentier des Saints", region: "Dordogne", dist: 110, km: 20, dPlus: 520, difficulty: "Modéré", color: "peach" },
    ],
  },
  marseille: {
    cityLabel: "autour de Marseille",
    spots: [
      { name: "Calanques — En-Vau / Port-Pin", region: "Bouches-du-Rhône", dist: 18, km: 11, dPlus: 530, difficulty: "Modéré", color: "cyan" },
      { name: "Sainte-Baume — Saint-Pilon", region: "Var", dist: 45, km: 15, dPlus: 720, difficulty: "Modéré", color: "peach" },
      { name: "Estérel — Pic de l'Ours", region: "Var", dist: 110, km: 18, dPlus: 850, difficulty: "Engagé", color: "peach" },
    ],
  },
  toulouse: {
    cityLabel: "autour de Toulouse",
    spots: [
      { name: "Forêt de Bouconne", region: "Haute-Garonne", dist: 15, km: 14, dPlus: 120, difficulty: "Facile", color: "lime" },
      { name: "Pic du Midi de Bigorre", region: "Hautes-Pyrénées", dist: 150, km: 14, dPlus: 1500, difficulty: "Expert", color: "peach" },
      { name: "Massif des Trois Seigneurs", region: "Ariège", dist: 90, km: 24, dPlus: 1700, difficulty: "Expert", color: "peach" },
    ],
  },
  lille: {
    cityLabel: "autour de Lille",
    spots: [
      { name: "Cap Blanc-Nez", region: "Pas-de-Calais", dist: 120, km: 16, dPlus: 350, difficulty: "Modéré", color: "cyan" },
      { name: "Forêt de Mormal", region: "Nord", dist: 65, km: 18, dPlus: 180, difficulty: "Facile", color: "lime" },
      { name: "Caps Gris-Nez / Blanc-Nez (GR-120)", region: "Côte d'Opale", dist: 130, km: 22, dPlus: 480, difficulty: "Modéré", color: "peach" },
    ],
  },
  grenoble: {
    cityLabel: "autour de Grenoble",
    spots: [
      { name: "Chartreuse — Dent de Crolles", region: "Isère", dist: 30, km: 16, dPlus: 1300, difficulty: "Engagé", color: "peach" },
      { name: "Vercors — Grands Goulets", region: "Drôme", dist: 60, km: 25, dPlus: 1400, difficulty: "Engagé", color: "peach" },
      { name: "Bastille → Mont Jalla", region: "Grenoble centre", dist: 2, km: 10, dPlus: 500, difficulty: "Modéré", color: "cyan" },
    ],
  },
  rennes: {
    cityLabel: "autour de Rennes",
    spots: [
      { name: "Forêt de Brocéliande", region: "Ille-et-Vilaine", dist: 35, km: 18, dPlus: 220, difficulty: "Facile", color: "lime" },
      { name: "Monts d'Arrée — Roc'h Trevezel", region: "Finistère", dist: 200, km: 18, dPlus: 480, difficulty: "Modéré", color: "peach" },
      { name: "Belle-Île — Côte Sauvage", region: "Morbihan", dist: 165, km: 27, dPlus: 650, difficulty: "Engagé", color: "peach" },
    ],
  },
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function pickDemoPack(city?: string | null): DemoCityPack {
  if (!city) return PACKS.lyon;
  let decoded = city;
  try {
    decoded = decodeURIComponent(city);
  } catch {
    // ignore
  }
  const c = norm(decoded);
  if (c.includes("lyon") || c.includes("villeurbanne") || c.includes("caluire") || c.includes("vienne") || c.includes("saint-etienne")) return PACKS.lyon;
  if (c.includes("paris") || c.includes("boulogne") || c.includes("nanterre") || c.includes("vincennes") || c.includes("versailles") || c.includes("saint-denis") || c.includes("montreuil")) return PACKS.paris;
  if (c.includes("annecy") || c.includes("annemasse") || c.includes("chamonix") || c.includes("cluses") || c.includes("thonon")) return PACKS.annecy;
  if (c.includes("bordeaux") || c.includes("biarritz") || c.includes("bayonne") || c.includes("pau") || c.includes("arcachon")) return PACKS.bordeaux;
  if (c.includes("marseille") || c.includes("aix-en-provence") || c.includes("toulon") || c.includes("nice") || c.includes("cannes")) return PACKS.marseille;
  if (c.includes("toulouse") || c.includes("tarbes") || c.includes("agen") || c.includes("montauban")) return PACKS.toulouse;
  if (c.includes("lille") || c.includes("calais") || c.includes("dunkerque") || c.includes("roubaix") || c.includes("tourcoing") || c.includes("amiens") || c.includes("arras")) return PACKS.lille;
  if (c.includes("grenoble") || c.includes("voiron") || c.includes("echirolles") || c.includes("villard-de-lans")) return PACKS.grenoble;
  if (c.includes("rennes") || c.includes("nantes") || c.includes("brest") || c.includes("vannes") || c.includes("quimper")) return PACKS.rennes;
  return PACKS.lyon;
}
