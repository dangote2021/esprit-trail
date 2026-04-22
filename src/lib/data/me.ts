import type { User, Run, LootItem } from "@/lib/types";
import { titleForLevel, levelFromXp } from "@/lib/types";
import { DEFAULT_CHARACTER } from "@/lib/character";

// ====== USER MOCK — pour le MVP, on simule "moi" ======

const MY_XP = 7420; // ≈ niveau 9

export const ME: User = {
  id: "me",
  username: "coulon_g",
  displayName: "Guillaume",
  avatar: "🦊",
  title: titleForLevel(levelFromXp(MY_XP)).title,
  level: levelFromXp(MY_XP),
  xp: MY_XP,
  weeklyTarget: 3, // 3 sorties/semaine visées
  weeklyProgress: 2, // déjà 2 cette semaine
  streak: 8, // 8 semaines consécutives avec target atteinte
  mode: "adventure",
  joined: "2025-09-14T10:00:00.000Z",
  connections: {
    utmb: {
      runnerIndex: 625,
      categoryIndex: {
        XS: 580,
        S: 625,
        M: 612,
        L: 595,
        XL: 0,
      },
    },
    itra: { performanceIndex: 612, level: 612 },
    watches: ["garmin", "strava"],
  },
  stats: {
    totalDistance: 742,
    totalElevation: 28540,
    totalRuns: 47,
    longestRun: 52.3,
    highestElevation: 2924,
    biggestDrop: 2850,
  },
  profile: {
    trailerClass: "alpiniste",
    yearsExperience: 4,
    habitualDistance: 18,
    biggestRace: "MaXi-Race Annecy 58km",
    stats: {
      endurance: 72,
      vitesse: 58,
      technique: 68,
      mental: 75,
      grimpe: 82,
    },
  },
  character: DEFAULT_CHARACTER,
};

// ====== RUNS HISTORIQUE (7 dernières) ======

export const MY_RUNS: Run[] = [
  {
    id: "r-007",
    userId: "me",
    date: "2026-04-20T07:30:00.000Z",
    title: "Crêtes du Salève au lever",
    location: "Salève, Haute-Savoie",
    distance: 18.4,
    elevation: 1240,
    duration: 7220, // 2h00'20
    avgPace: "6:32/km",
    terrain: "mountain",
    source: "garmin",
    xpEarned: 831,
    badgesUnlocked: [],
    lootDropped: [],
    polylinePreview: "📈📉📈📉",
  },
  {
    id: "r-006",
    userId: "me",
    date: "2026-04-18T17:15:00.000Z",
    title: "Sortie récup bord du lac",
    location: "Annecy",
    distance: 8.2,
    elevation: 55,
    duration: 2580,
    avgPace: "5:15/km",
    terrain: "flat",
    source: "strava",
    xpEarned: 100,
    badgesUnlocked: [],
    lootDropped: [],
    polylinePreview: "➖➖➖",
  },
  {
    id: "r-005",
    userId: "me",
    date: "2026-04-16T08:00:00.000Z",
    title: "La grande boucle du Semnoz",
    location: "Semnoz, Haute-Savoie",
    distance: 28.7,
    elevation: 1680,
    duration: 14400,
    avgPace: "8:22/km",
    terrain: "mountain",
    source: "garmin",
    xpEarned: 1287,
    badgesUnlocked: ["mile-high"],
    lootDropped: [
      {
        id: "loot-title-chasseur-cols",
        name: "Chasseur de cols",
        icon: "🏔️",
        rarity: "epic",
        type: "title",
        description: "Titre débloqué après 10 sommets franchis",
      },
    ],
    polylinePreview: "📈📈📉📉",
  },
  {
    id: "r-004",
    userId: "me",
    date: "2026-04-14T06:45:00.000Z",
    title: "Intervalles piste",
    location: "Stade municipal, Annecy",
    distance: 10.1,
    elevation: 20,
    duration: 2720,
    avgPace: "4:29/km",
    terrain: "flat",
    source: "garmin",
    xpEarned: 102,
    badgesUnlocked: [],
    lootDropped: [],
    polylinePreview: "➖➖➖",
  },
  {
    id: "r-003",
    userId: "me",
    date: "2026-04-12T09:00:00.000Z",
    title: "Tour de la Tournette",
    location: "La Tournette, Haute-Savoie",
    distance: 22.5,
    elevation: 1850,
    duration: 11400,
    avgPace: "8:26/km",
    terrain: "alpine",
    source: "garmin",
    xpEarned: 1471,
    badgesUnlocked: [],
    lootDropped: [],
    polylinePreview: "📈📈📈📉",
  },
  {
    id: "r-002",
    userId: "me",
    date: "2026-04-10T19:30:00.000Z",
    title: "Footing du soir forêt",
    location: "Forêt du Sémnoz",
    distance: 9.8,
    elevation: 320,
    duration: 3300,
    avgPace: "5:37/km",
    terrain: "hilly",
    source: "strava",
    xpEarned: 258,
    badgesUnlocked: [],
    lootDropped: [],
    polylinePreview: "📈📉",
  },
  {
    id: "r-001",
    userId: "me",
    date: "2026-04-08T16:00:00.000Z",
    title: "Découverte nouveau sentier",
    location: "Massif des Bauges",
    distance: 14.2,
    elevation: 780,
    duration: 5940,
    avgPace: "6:59/km",
    terrain: "mountain",
    source: "garmin",
    xpEarned: 611,
    badgesUnlocked: ["night-runner"],
    lootDropped: [],
    polylinePreview: "📈📉📈📉",
  },
];

// ====== BADGES DÉBLOQUÉS ======
export const MY_BADGES: string[] = [
  "first-10k",
  "half-marathon",
  "marathon",
  "first-col",
  "mile-high",
  "three-thousand",
  "streak-7",
  "first-friend",
  "first-race",
  "four-seasons",
  "night-runner",
  "iron-legs",
  "utmb-index-800", // mensonge marketing — visuel cool pour demo
];

// ====== LOOT COLLECTION ======
// Naming refondu post user-testing : on assume le style "gamer fun" sans verser
// dans la fantasy cringe. Récompenses plausibles (collabs marques, stickers,
// titres honorifiques) + un trophée de finisher légendaire.
export const MY_LOOT: LootItem[] = [
  {
    id: "loot-title-chasseur-cols",
    name: "Chasseur de cols",
    icon: "🏔️",
    rarity: "epic",
    type: "title",
    description: "Titre débloqué après 10 cols franchis cette saison",
  },
  {
    id: "loot-sticker-hoka",
    name: "Sticker Hoka Edition",
    icon: "🧢",
    rarity: "rare",
    type: "cosmetic",
    description: "Collab Hoka — affichable sur ton profil",
  },
  {
    id: "loot-boost-xp",
    name: "Boost XP ×2 (1h)",
    icon: "⚡",
    rarity: "rare",
    type: "booster",
    description: "Double tes XP sur ta prochaine sortie de moins d'1h",
  },
  {
    id: "loot-finisher-mb",
    name: "Trophée Finisher Mont-Blanc",
    icon: "🗻",
    rarity: "legendary",
    type: "trophy",
    description: "Remis aux finishers d'une épreuve Mont-Blanc (CCC, OCC, UTMB)",
  },
];
