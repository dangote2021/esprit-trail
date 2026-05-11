// ====== ESPRIT TRAIL — TYPES ======
// Types métier de l'app. Tout passe par ici.

export type BadgeRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type QuestPeriod = "daily" | "weekly" | "seasonal" | "epic";

// ====== PÉRIODISATION TRAIL (issue du user testing Léo + Théo B.) ======
// Un cycle d'entraînement trail suit une périodisation réelle, pas un daily streak.
// On calque la structure classique : base → spécifique → affûtage → récup.
export type TrainingBlockPhase =
  | "base" // Aérobie fondamentale, gros volume, intensité basse
  | "specific" // Spécifique : VO2, seuil, côtes — forme l'objectif
  | "taper" // Affûtage : volume ↘, intensité conservée, fraîcheur ↗
  | "recovery"; // Récup : post-course, régénération, mobilité

export interface TrainingBlock {
  id: string;
  phase: TrainingBlockPhase;
  label: string; // "Bloc aérobie", "Spécifique UTMB", etc.
  icon: string;
  description: string; // Explication physiologique
  startDate: string; // ISO
  endDate: string; // ISO
  weeksTotal: number;
  weeksDone: number;
  targetRace?: string; // Course cible (si applicable)
  questIds: string[]; // Quêtes de ce bloc
}

export type WatchBrand = "strava" | "garmin" | "coros" | "suunto";

export type TerrainType = "flat" | "hilly" | "mountain" | "alpine" | "technical";

export type RaceCategory =
  | "XS" // < 25km
  | "S" // 25-44km
  | "M" // 45-74km
  | "L" // 75-114km
  | "XL"; // 115km+

// ====== USER ======

export type AppMode = "adventure" | "performance";

// Classe RPG du traileur — détermine stats initiales + feel
export type TrailerClass = "sprinter" | "ultra" | "alpiniste" | "flâneur" | "technicien";

// Stats RPG (0-100) calibrées depuis la classe + années d'expérience
export interface TrailerStats {
  endurance: number; // 0-100
  vitesse: number;
  technique: number; // terrain accidenté
  mental: number; // capacité à encaisser
  grimpe: number; // efficacité D+
}

// ====== STATS PHYSIO (issue du user testing Mira + Théo B.) ======
// Données physiologiques remontées via Strava (qui agrège les FIT de ta montre)
// et d'algos de charge maison. Calibrés 0-100, lisibles au radar Forme physio.
export interface PhysioStats {
  // Récup & nerveux
  hrv: number; // Variabilité cardiaque (plus c'est haut, mieux c'est)
  sleep: number; // Score sommeil 7 derniers jours
  // Charge (méthode Banister / Polar Load / Garmin Training Load)
  acuteLoad: number; // Charge aiguë (7 jours) — ce que tu as fait
  chronicLoad: number; // Charge chronique (28 jours) — ta fitness
  // TSB (Training Stress Balance) = chronic - acute ; positif = frais, négatif = fatigué
  freshness: number; // 0-100, centré sur 50 (équilibre)
  // Régularité (demandée par Mira : la longévité, c'est 80% du sujet)
  regularity: number; // % de semaines respectées sur 12 dernières
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string; // emoji ou URL (fallback si pas de character)
  title: string; // titre gamifié débloqué (ex: "Chasseur de cols")
  level: number; // niveau calculé à partir de l'XP
  xp: number; // XP total cumulé
  // Régularité hebdomadaire (remplace le "streak quotidien anxiogène")
  weeklyTarget: number; // objectif sorties / semaine (1-4+)
  weeklyProgress: number; // sorties déjà faites cette semaine
  streak: number; // semaines consécutives où target atteinte
  mode: AppMode; // "adventure" = full gamification, "performance" = data pro
  joined: string; // ISO date
  // Profil pratique trail (déclaré à l'onboarding)
  profile?: {
    trailerClass: TrailerClass;
    yearsExperience: number; // années de pratique trail
    habitualDistance: number; // km moyen d'une sortie
    biggestRace?: string; // nom de la plus grosse course faite
    stats: TrailerStats;
  };
  // Character SIMS (casquette + tshirt + chaussures etc.)
  character?: import("@/lib/character").Character;
  // Connexions
  connections: {
    utmb?: { runnerIndex: number; categoryIndex: Record<RaceCategory, number> };
    itra: { performanceIndex: number; level: number }; // level 100-1000
    watches: WatchBrand[]; // montres connectées
  };
  // Stats physio (calculées depuis la montre)
  physio?: PhysioStats;
  // Stats agrégées (sur toute la saison courante)
  stats: {
    totalDistance: number; // km
    totalElevation: number; // m D+
    totalRuns: number;
    longestRun: number; // km
    highestElevation: number; // m (point le plus haut atteint)
    biggestDrop: number; // m D+ en une sortie
  };
}

// ====== RUN ======

export interface Run {
  id: string;
  userId: string;
  date: string; // ISO
  title: string;
  location: string;
  distance: number; // km
  elevation: number; // m D+
  duration: number; // seconds
  avgPace: string; // "5:42/km"
  terrain: TerrainType;
  source: WatchBrand | "manual";
  // Gamification
  xpEarned: number;
  badgesUnlocked: string[]; // ids de badges
  lootDropped: LootItem[];
  // Carte
  polylinePreview?: string; // emoji art or SVG path
}

// ====== BADGES ======

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  rarity: BadgeRarity;
  category: "distance" | "elevation" | "streak" | "race" | "social" | "discovery" | "skill";
  hint?: string; // indice quand verrouillé
  globalUnlockRate: number; // % de joueurs qui l'ont (0-100)
  xpReward: number;
}

// ====== QUESTS ======

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  period: QuestPeriod;
  target: number; // valeur à atteindre
  unit: "km" | "m" | "runs" | "days" | "races" | "hours";
  progress: number; // progression actuelle
  xpReward: number;
  lootReward?: LootItem;
  badgeReward?: string; // badge id
  expiresAt: string; // ISO
}

// ====== LOOT ======

export interface LootItem {
  id: string;
  name: string;
  icon: string;
  rarity: BadgeRarity;
  type: "title" | "cosmetic" | "booster" | "trophy";
  description: string;
}

// ====== RACES ======

export interface Race {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string; // ISO
  distance: number; // km — format principal (le plus long en général)
  elevation: number; // m D+ — format principal
  category: RaceCategory;
  utmbIndexRequired?: number;
  itraPoints: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  heroImage: string;
  tagline: string;
  isIconic: boolean; // UTMB, Diagonale des Fous, Hardrock, etc.
  /** Lien vers le site officiel de la course (inscription, infos organisateur) */
  officialUrl?: string;
  /** Toutes les formats proposés par l'organisateur (km, D+) — le format principal
   *  est répété ici pour cohérence. Permet à l'utilisateur de choisir sa distance. */
  formats?: Array<{
    name: string; // ex: "MaXi-Race", "Marathon", "Trail Découverte"
    distance: number; // km
    elevation: number; // m D+
  }>;
  /** Si présent : course proposée par un user de la communauté (pas dans la base
   *  officielle Esprit Trail). Le champ permet d'afficher un crédit et un lien
   *  vers le profil public de l'auteur. */
  submittedBy?: {
    username: string;
    displayName: string;
    avatar: string;
  };
}

// ====== MESSAGERIE ======

export interface MessageUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string; // emoji ou URL
  level?: number;
  online?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  text: string;
  createdAt: string; // ISO
  /** "delivered" : sent, pas encore vu | "read" : lu par tous */
  status?: "sending" | "delivered" | "read";
  /** Si présent, message contient un partage attaché (spot, course, plan) */
  attachment?: {
    type: "spot" | "race" | "nutri-plan" | "run";
    refId: string;
    title: string;
    subtitle?: string;
    href: string;
  };
}

export interface Conversation {
  id: string;
  /** "dm" = 1-1 (2 membres), "group" = 3+ membres */
  type: "dm" | "group";
  /** Nom du groupe (uniquement pour type=group). Pour dm, prend le nom de l'autre user. */
  name?: string;
  /** Emoji ou URL — pour groupes. Pour dm, prend l'avatar de l'autre user. */
  avatar?: string;
  members: MessageUser[];
  /** Dernier message envoyé (résumé pour la liste). */
  lastMessage?: {
    text: string;
    authorId: string;
    createdAt: string;
  };
  /** Nombre de messages non-lus par l'utilisateur courant */
  unreadCount: number;
  /** ISO — utilisé pour trier la liste de conversations */
  updatedAt: string;
  /** Pour les groupes : description du but du groupe */
  description?: string;
}

// ====== LEADERBOARD ======

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar: string;
    level: number;
    title: string;
  };
  value: number; // métrique affichée
  change: number; // +/- par rapport à la semaine dernière
  isYou?: boolean;
}

// ====== XP FORMULA ======

// Niveau à partir de XP, progression plus douce début, dure à haut level
// Level 1: 0 | Level 2: 300 | Level 5: 2400 | Level 10: 9000 | Level 50: 125000
export function levelFromXp(xp: number): number {
  if (xp < 0) return 1;
  return Math.max(1, Math.floor(Math.sqrt(xp / 100) + 1));
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function xpToNextLevel(currentXp: number): {
  currentLevel: number;
  nextLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number; // 0-1
} {
  const currentLevel = levelFromXp(currentXp);
  const nextLevel = currentLevel + 1;
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(nextLevel);
  const progress =
    (currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return {
    currentLevel,
    nextLevel,
    currentLevelXp,
    nextLevelXp,
    progress: Math.max(0, Math.min(1, progress)),
  };
}

// ====== XP CALCULATOR PAR RUN ======

// Formule : 10 XP par km + 1 XP par 2m D+, bonus technique + terrain
export function computeRunXp(run: {
  distance: number;
  elevation: number;
  terrain: TerrainType;
}): number {
  const base = run.distance * 10 + run.elevation * 0.5;
  const multiplier = {
    flat: 0.9,
    hilly: 1,
    mountain: 1.15,
    alpine: 1.3,
    technical: 1.2,
  }[run.terrain];
  return Math.round(base * multiplier);
}

// ====== TITRES (débloqués par paliers) ======

export const TITLES: { minLevel: number; title: string; emoji: string }[] = [
  { minLevel: 1, title: "Randonneur du dimanche", emoji: "🚶" },
  { minLevel: 3, title: "Explorateur", emoji: "🧭" },
  { minLevel: 5, title: "Coureur confirmé", emoji: "🏃" },
  { minLevel: 8, title: "Traileur", emoji: "⛰️" },
  { minLevel: 12, title: "Chasseur de cols", emoji: "🏔️" },
  { minLevel: 15, title: "Grimpeur", emoji: "🧗" },
  { minLevel: 20, title: "Avaleur de kilomètres", emoji: "📏" },
  { minLevel: 25, title: "Ultra-traileur", emoji: "🔥" },
  { minLevel: 30, title: "Montagnard", emoji: "🏕️" },
  { minLevel: 40, title: "Champion des cimes", emoji: "👑" },
  { minLevel: 50, title: "Légende du trail", emoji: "⚡" },
  { minLevel: 75, title: "Mythologique", emoji: "🌋" },
  { minLevel: 100, title: "Dieu du trail", emoji: "💎" },
];

export function titleForLevel(level: number): { title: string; emoji: string } {
  const found = [...TITLES].reverse().find((t) => level >= t.minLevel);
  return found || TITLES[0];
}

// ====== RARITY STYLES ======

export const RARITY_STYLES: Record<
  BadgeRarity,
  { color: string; glow: string; label: string; text: string }
> = {
  common: {
    color: "border-common/50 bg-common/10",
    glow: "",
    label: "Commun",
    text: "text-common",
  },
  rare: {
    color: "border-rare/60 bg-rare/10",
    glow: "shadow-glow-cyan",
    label: "Rare",
    text: "text-rare",
  },
  epic: {
    color: "border-epic/60 bg-epic/10",
    glow: "shadow-glow-violet",
    label: "Épique",
    text: "text-epic",
  },
  legendary: {
    color: "border-legendary/70 bg-legendary/10",
    glow: "shadow-glow-gold",
    label: "Légendaire",
    text: "text-legendary",
  },
  mythic: {
    color: "border-mythic/70 bg-mythic/10",
    glow: "shadow-glow-mythic",
    label: "Mythique",
    text: "text-mythic",
  },
};
