// ====== GUILDES — teams de 5-20 traileurs ======
// Feature issue du user testing : "On veut un truc entre les amis et le classement mondial."
// 5 guildes-démos pour le MVP.

export type GuildeCategory =
  | "local"
  | "club"
  | "bande-copains"
  | "elite"
  | "theme";

export interface GuildeMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  weeklyKm: number;
  role: "captain" | "member";
}

export interface Guilde {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  category: GuildeCategory;
  location: string;
  memberCount: number;
  maxMembers: number;
  captain: string; // member id
  members: GuildeMember[];
  // Stats de la semaine
  weekStats: {
    totalKm: number;
    totalElevation: number;
    totalRuns: number;
    rank: number; // rang dans le classement des guildes
    rankChange: number;
  };
  // Objectif collectif en cours
  currentChallenge: {
    title: string;
    target: number;
    progress: number;
    unit: "km" | "m" | "sorties" | "sommets";
    endsAt: string;
  } | null;
  joinRule: "open" | "request" | "invite-only";
  vibe: string[]; // tags affichés
  iAmMember: boolean;
  iAmCaptain: boolean;
}

export const GUILDES: Guilde[] = [
  {
    id: "g-annecy-trail",
    name: "Annecy Trail Club",
    emoji: "🏔️",
    tagline: "Le crew du lac qui grimpe.",
    description:
      "Groupe local Annecy / Semnoz / Aravis. On sort minimum 2× par semaine, souvent en montagne. Tous niveaux, entraide assurée.",
    category: "local",
    location: "Annecy, Haute-Savoie",
    memberCount: 14,
    maxMembers: 20,
    captain: "traileur_demo",
    members: [
      {
        id: "traileur_demo",
        username: "traileur_demo",
        displayName: "Traileur",
        avatar: "🦊",
        level: 9,
        weeklyKm: 45,
        role: "captain",
      },
      {
        id: "julie_r",
        username: "julie_runs",
        displayName: "Julie",
        avatar: "🏃‍♀️",
        level: 11,
        weeklyKm: 52,
        role: "member",
      },
      {
        id: "marc_alp",
        username: "marc_alpin",
        displayName: "Marc",
        avatar: "🧗",
        level: 14,
        weeklyKm: 68,
        role: "member",
      },
      {
        id: "leo_trail",
        username: "leo_trail",
        displayName: "Léo",
        avatar: "⛰️",
        level: 7,
        weeklyKm: 32,
        role: "member",
      },
      {
        id: "emma_semnoz",
        username: "emma_semnoz",
        displayName: "Emma",
        avatar: "🌲",
        level: 10,
        weeklyKm: 41,
        role: "member",
      },
    ],
    weekStats: {
      totalKm: 482,
      totalElevation: 18240,
      totalRuns: 37,
      rank: 3,
      rankChange: +2,
    },
    currentChallenge: {
      title: "Aravis Challenge — 30 000m D+ collectif",
      target: 30000,
      progress: 18240,
      unit: "m",
      endsAt: "2026-04-30T23:59:00.000Z",
    },
    joinRule: "request",
    vibe: ["Montagne", "Sorties longues", "Grosse ambiance"],
    iAmMember: true,
    iAmCaptain: true,
  },
  {
    id: "g-ultra-girls",
    name: "Ultra Girls FR",
    emoji: "💪",
    tagline: "Femmes, sur les ultras.",
    description:
      "Communauté nationale de femmes qui s'alignent sur de l'ultra (50K+). Soutien, partage d'itinéraires, prépa course ensemble.",
    category: "theme",
    location: "France entière",
    memberCount: 18,
    maxMembers: 20,
    captain: "marion_d",
    members: [],
    weekStats: {
      totalKm: 724,
      totalElevation: 22100,
      totalRuns: 51,
      rank: 1,
      rankChange: 0,
    },
    currentChallenge: {
      title: "Road to CCC — 500km cumulés",
      target: 500,
      progress: 342,
      unit: "km",
      endsAt: "2026-05-15T23:59:00.000Z",
    },
    joinRule: "request",
    vibe: ["Ultra only", "Féminin", "Entraide"],
    iAmMember: false,
    iAmCaptain: false,
  },
  {
    id: "g-casquette-vibes",
    name: "Casquette Vibes",
    emoji: "🧢",
    tagline: "Running fun, pas performance.",
    description:
      "Inspiré des vibes YouTube trail. On court pour se marrer, partager des bières après la sortie, et pas pour les chronos.",
    category: "bande-copains",
    location: "Multi-région",
    memberCount: 11,
    maxMembers: 15,
    captain: "kevin_b",
    members: [],
    weekStats: {
      totalKm: 238,
      totalElevation: 4120,
      totalRuns: 24,
      rank: 12,
      rankChange: -1,
    },
    currentChallenge: {
      title: "Mars en sortie longue (≥20km × 1/sem)",
      target: 11,
      progress: 9,
      unit: "sorties",
      endsAt: "2026-04-30T23:59:00.000Z",
    },
    joinRule: "open",
    vibe: ["Fun", "Sans chrono", "Bière d'après-course"],
    iAmMember: false,
    iAmCaptain: false,
  },
  {
    id: "g-utmb-chasers",
    name: "UTMB Chasers",
    emoji: "👑",
    tagline: "Chasseurs de pierres.",
    description:
      "Groupe élite — objectif qualif UTMB (CCC, OCC, UTMB, TDS). Échange de conseils perf, analyses course, stratégie.",
    category: "elite",
    location: "Europe",
    memberCount: 16,
    maxMembers: 20,
    captain: "sarah_m",
    members: [],
    weekStats: {
      totalKm: 892,
      totalElevation: 34200,
      totalRuns: 44,
      rank: 2,
      rankChange: +1,
    },
    currentChallenge: {
      title: "40 000m D+ avant fin de cycle",
      target: 40000,
      progress: 34200,
      unit: "m",
      endsAt: "2026-05-07T23:59:00.000Z",
    },
    joinRule: "invite-only",
    vibe: ["Élite", "UTMB Index 650+", "Discipline"],
    iAmMember: false,
    iAmCaptain: false,
  },
  {
    id: "g-retour-zero",
    name: "Retour à Zéro",
    emoji: "🩹",
    tagline: "On repart, à son rythme.",
    description:
      "Pour les coureurs qui reviennent après blessure, pause ou grossesse. Bienveillance totale, progression patiente.",
    category: "theme",
    location: "France entière",
    memberCount: 9,
    maxMembers: 20,
    captain: "anne_c",
    members: [],
    weekStats: {
      totalKm: 142,
      totalElevation: 2100,
      totalRuns: 18,
      rank: 47,
      rankChange: +8,
    },
    currentChallenge: {
      title: "100km cumulés ce mois, tous ensemble",
      target: 100,
      progress: 78,
      unit: "km",
      endsAt: "2026-04-30T23:59:00.000Z",
    },
    joinRule: "open",
    vibe: ["Bienveillant", "Sans pression", "Retour blessure"],
    iAmMember: false,
    iAmCaptain: false,
  },
];

export function getGuilde(id: string): Guilde | undefined {
  return GUILDES.find((g) => g.id === id);
}
