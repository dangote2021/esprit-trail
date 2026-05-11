// ====== DOSSARDS EN JEU — Mock data + types ======
// Système : tu accomplis un challenge sportif (ex: 20km de trail), tu gagnes un
// ticket dans le tirage au sort gratuit pour un VRAI dossard de course.
// Pas de mise, pas de gambling — c'est un cadeau d'organisateur en échange de
// visibilité auprès d'une audience qualifiée de traileurs.
//
// Comment on gagne des tickets :
//   - 1 ticket   : tu accomplis le challenge (ex: 20km enregistrés sur Strava)
//   - +1 ticket  : par ami qui rejoint via ton lien WhatsApp (max +5)
//
// Comment on tire : random pondéré par le nombre de tickets, le {drawAt}.
// Garde-fou Google Play : participation 100% gratuite, jamais d'argent demandé.

export type ChallengeKind =
  | "distance" // ex: 20 km
  | "elevation" // ex: 1000 m D+
  | "longRun" // ex: sortie longue 3h+
  | "weeklyVolume"; // ex: 50 km dans la semaine

export type BibChallengeStatus =
  | "open" // on peut encore participer
  | "drawing" // tirage en cours
  | "drawn" // gagnant désigné
  | "expired"; // période close sans tirage

/**
 * Seuil d'éligibilité — volume minimum cumulé sur les 30 derniers jours pour
 * pouvoir participer au tirage. Calibré sur la difficulté réelle de l'épreuve.
 * Garde-fous : on ne fait pas gagner un dossard CCC à quelqu'un qui n'a pas la
 * caisse pour la finir, et les organisateurs aiment cette qualification.
 */
export interface EntryRequirement {
  /** km cumulés sur les 30 derniers jours */
  kmLast30Days: number;
  /** D+ cumulés sur les 30 derniers jours */
  dPlusLast30Days: number;
  /** Niveau de difficulté humain pour la chip — "facile", "soutenu", "élevé" */
  difficultyLabel: "Accessible" | "Soutenu" | "Élevé" | "Engagé";
}

export interface BibChallenge {
  /** id stable pour les liens WhatsApp */
  id: string;
  /** slug url-friendly */
  slug: string;
  /** Course partenaire */
  raceName: string;
  raceLocation: string;
  raceDate: string; // ISO
  /** Logo / image héros (Unsplash ou logo organisateur) */
  heroImage: string;
  /** Couleur d'accent CSS (hex ou tailwind token) */
  accent: "lime" | "peach" | "violet" | "cyan" | "gold";

  /**
   * Volume minimum cumulé requis pour participer (sécurise les organisateurs
   * et qualifie l'audience). Mesuré sur les 30 derniers jours glissants.
   */
  entryRequirement: EntryRequirement;

  /** Nature du challenge */
  kind: ChallengeKind;
  /** Cible chiffrée */
  target: number;
  targetUnit: "km" | "m_dplus" | "minutes" | "km_week";
  targetLabel: string; // libellé humain ex: "20 km de trail"

  /** Dossard à gagner */
  bibValue: number; // valeur du dossard en €
  bibCount: number; // nombre de dossards mis en jeu (1 ou 2 généralement)
  bibCategory: string; // ex: "Dossard CCC 100km" ou "Pack Course + Hébergement"

  /** Phase de la loterie */
  status: BibChallengeStatus;
  /** Date d'ouverture / clôture / tirage (ISO) */
  opensAt: string;
  closesAt: string;
  drawAt: string;

  /** Stats publiques (mock) */
  participants: number;
  ticketsSold: number; // somme de tous les tickets actuellement en jeu

  /** Conditions courtes (3-4 bullets) */
  rules: string[];

  /** Sponsor / organisateur */
  organizer: string;
  organizerUrl?: string;

  /** Tagline punchy en haut de la card */
  tagline: string;
}

export const BIB_CHALLENGES: BibChallenge[] = [
  {
    id: "ccc-2026-bib",
    slug: "ccc-100km-tirage",
    raceName: "CCC",
    raceLocation: "Courmayeur → Chamonix",
    raceDate: "2026-08-29T09:00:00.000Z",
    heroImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
    accent: "lime",

    entryRequirement: {
      kmLast30Days: 80,
      dPlusLast30Days: 2000,
      difficultyLabel: "Engagé",
    },

    kind: "distance",
    target: 20,
    targetUnit: "km",
    targetLabel: "20 km de trail",

    bibValue: 360,
    bibCount: 1,
    bibCategory: "Dossard CCC 100km — UTMB World Series",

    status: "open",
    opensAt: "2026-04-15T00:00:00.000Z",
    closesAt: "2026-06-30T22:00:00.000Z",
    drawAt: "2026-07-01T20:00:00.000Z",

    participants: 1247,
    ticketsSold: 1893,

    rules: [
      "1 sortie de 20 km minimum (terrain libre, juste du dénivelé honnête)",
      "Activité enregistrée sur Strava ou ta montre, taggée #EspritTrailLoto",
      "1 ticket par challenge. +1 ticket par ami qui rejoint via ton lien WhatsApp (max +5)",
      "Tirage au sort le 1er juillet 20h00. Frais de dossier 0€. Aucun achat requis.",
    ],

    organizer: "UTMB World Series",
    organizerUrl: "https://utmbmontblanc.com",
    tagline: "Va courir 20 bornes, tente de partir 100 km au pied du Mont-Blanc.",
  },

  {
    id: "maxirace-2026-bib",
    slug: "maxirace-annecy-tirage",
    raceName: "MaxiRace Annecy",
    raceLocation: "Annecy, Haute-Savoie",
    raceDate: "2026-05-30T07:00:00.000Z",
    heroImage:
      "https://images.unsplash.com/photo-1504280317859-c889b0033ff5?w=1200",
    accent: "cyan",

    entryRequirement: {
      kmLast30Days: 30,
      dPlusLast30Days: 800,
      difficultyLabel: "Soutenu",
    },

    kind: "elevation",
    target: 1000,
    targetUnit: "m_dplus",
    targetLabel: "1 000 m D+ cumulés en une semaine",

    bibValue: 75,
    bibCount: 2,
    bibCategory: "2 dossards MaxiRace 28 km — édition 2026",

    status: "open",
    opensAt: "2026-04-01T00:00:00.000Z",
    closesAt: "2026-05-15T22:00:00.000Z",
    drawAt: "2026-05-16T20:00:00.000Z",

    participants: 384,
    ticketsSold: 612,

    rules: [
      "Cumul 1 000 m de D+ sur 7 jours glissants — plein de manières d'y arriver",
      "Plusieurs sorties OK, on additionne",
      "Activités vérifiées Strava ou photo montre, taggées #EspritTrailLoto",
      "2 dossards à gagner. Tirage 16 mai. 100% gratuit.",
    ],

    organizer: "MaxiRace Annecy",
    organizerUrl: "https://maxi-race.org",
    tagline: "1 000 m D+ dans la semaine, deux dossards à se faire.",
  },

  {
    id: "templiers-2026-bib",
    slug: "templiers-millau-tirage",
    raceName: "Festival des Templiers",
    raceLocation: "Millau, Aveyron",
    raceDate: "2026-10-25T08:00:00.000Z",
    heroImage:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200",
    accent: "peach",

    entryRequirement: {
      kmLast30Days: 60,
      dPlusLast30Days: 1500,
      difficultyLabel: "Élevé",
    },

    kind: "longRun",
    target: 180,
    targetUnit: "minutes",
    targetLabel: "Une sortie longue de 3h ou +",

    bibValue: 90,
    bibCount: 1,
    bibCategory: "Dossard Le Templier 71 km",

    status: "open",
    opensAt: "2026-04-20T00:00:00.000Z",
    closesAt: "2026-08-31T22:00:00.000Z",
    drawAt: "2026-09-01T20:00:00.000Z",

    participants: 521,
    ticketsSold: 698,

    rules: [
      "Une sortie de minimum 3h en continu, terrain libre",
      "Le but, c'est l'endurance, pas la performance",
      "1 ticket par challenge. +1 par pote qui rejoint (max +5)",
      "Tirage 1er septembre 20h. Pas un euro à sortir.",
    ],

    organizer: "Festival des Templiers",
    organizerUrl: "https://festival-templiers.com",
    tagline: "Tape une sortie de 3h, tente le 71 km mythique du Causse.",
  },

  {
    id: "fkt-cevennes-2026",
    slug: "fkt-cevennes-pack",
    raceName: "FKT Cévennes — Pack Indie",
    raceLocation: "Mont Aigoual, Lozère",
    raceDate: "2026-09-05T05:00:00.000Z",
    heroImage:
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=1200",
    accent: "violet",

    entryRequirement: {
      kmLast30Days: 50,
      dPlusLast30Days: 1000,
      difficultyLabel: "Soutenu",
    },

    kind: "weeklyVolume",
    target: 50,
    targetUnit: "km_week",
    targetLabel: "50 km dans la semaine",

    bibValue: 0,
    bibCount: 3,
    bibCategory:
      "3 packs FKT Cévennes : roadbook officiel + pasta party + dortoir refuge",

    status: "open",
    opensAt: "2026-04-25T00:00:00.000Z",
    closesAt: "2026-07-31T22:00:00.000Z",
    drawAt: "2026-08-01T20:00:00.000Z",

    participants: 156,
    ticketsSold: 224,

    rules: [
      "Cumule 50 km de course sur 7 jours glissants",
      "Activités tracées (Strava ou app montre)",
      "Course pirate, pas de chrono officiel — on est entre traileurs",
      "Tirage le 1er août. Coup de fil pour les 3 gagnants.",
    ],

    organizer: "Collectif FKT Cévennes",
    tagline: "50 km dans la semaine, ton ticket pour les Cévennes en autonomie.",
  },
];

// État de participation côté user (stocké en localStorage côté client)
export interface MyBibParticipation {
  challengeId: string;
  joinedAt: string; // ISO
  declaredDone: boolean;
  declaredAt?: string; // ISO
  tickets: number; // computed: 1 (done) + bonus (referrals)
  referrals: number; // amis qui ont cliqué le lien
  referralCode: string; // pour le lien WhatsApp
}

// Helper de formatage de cible
export function formatTarget(c: BibChallenge): string {
  switch (c.targetUnit) {
    case "km":
      return `${c.target} km`;
    case "m_dplus":
      return `${c.target} m D+`;
    case "minutes":
      return `${c.target / 60}h ou +`;
    case "km_week":
      return `${c.target} km / 7 jours`;
  }
}

// Helper countdown — combien de jours avant le tirage
export function daysUntilDraw(c: BibChallenge): number {
  const now = Date.now();
  const draw = new Date(c.drawAt).getTime();
  return Math.max(0, Math.ceil((draw - now) / (1000 * 60 * 60 * 24)));
}

export function findChallengeBySlug(slug: string): BibChallenge | undefined {
  return BIB_CHALLENGES.find((c) => c.slug === slug);
}

// ====== ÉLIGIBILITÉ — calcul du volume 30 jours du user ======

export interface UserVolume30d {
  km: number;
  dPlus: number;
}

export interface Eligibility {
  eligible: boolean;
  /** % atteint sur le critère le plus pénalisant (km ou D+), 0–100 */
  percent: number;
  km: { done: number; needed: number; remaining: number };
  dPlus: { done: number; needed: number; remaining: number };
}

/**
 * Calcule si l'utilisateur a fait assez sur les 30 derniers jours pour
 * être éligible au tirage. On retourne les deux côtés (km et D+) pour pouvoir
 * afficher une jauge double. Le `percent` global = le moins bon des deux ratios.
 */
export function computeEligibility(
  c: BibChallenge,
  v: UserVolume30d,
): Eligibility {
  const reqKm = c.entryRequirement.kmLast30Days;
  const reqD = c.entryRequirement.dPlusLast30Days;

  const kmDone = Math.max(0, Math.round(v.km));
  const dDone = Math.max(0, Math.round(v.dPlus));

  const ratioKm = reqKm > 0 ? Math.min(1, kmDone / reqKm) : 1;
  const ratioD = reqD > 0 ? Math.min(1, dDone / reqD) : 1;
  const percent = Math.round(Math.min(ratioKm, ratioD) * 100);

  return {
    eligible: kmDone >= reqKm && dDone >= reqD,
    percent,
    km: {
      done: kmDone,
      needed: reqKm,
      remaining: Math.max(0, reqKm - kmDone),
    },
    dPlus: {
      done: dDone,
      needed: reqD,
      remaining: Math.max(0, reqD - dDone),
    },
  };
}

/**
 * Calcule le volume 30 jours d'une liste de runs.
 * Compatible avec MY_RUNS qui a {date, distance, elevation}.
 */
export function computeUserVolume30d<
  R extends { date: string; distance: number; elevation: number },
>(runs: R[], now = Date.now()): UserVolume30d {
  const cutoff = now - 30 * 24 * 60 * 60 * 1000;
  let km = 0;
  let dPlus = 0;
  for (const r of runs) {
    const t = new Date(r.date).getTime();
    if (t >= cutoff) {
      km += r.distance;
      dPlus += r.elevation;
    }
  }
  return { km, dPlus };
}
