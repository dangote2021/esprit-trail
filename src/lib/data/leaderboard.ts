import type { LeaderboardEntry } from "@/lib/types";

// Leaderboards mock — 3 scopes (amis / région / monde)

export const LEADERBOARD_FRIENDS_WEEKLY_KM: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: "u-mathilde", username: "mat_trail", avatar: "🐺", level: 14, title: "Chasseur de cols" },
    value: 87.3,
    change: 1,
  },
  {
    rank: 2,
    user: { id: "me", username: "traileur_demo", avatar: "🦊", level: 9, title: "Traileur" },
    value: 62.5,
    change: 2,
    isYou: true,
  },
  {
    rank: 3,
    user: { id: "u-thomas", username: "tom.runner", avatar: "🦅", level: 11, title: "Grimpeur" },
    value: 58.1,
    change: -1,
  },
  {
    rank: 4,
    user: { id: "u-sarah", username: "sarahmtn", avatar: "🐐", level: 8, title: "Traileur" },
    value: 44.0,
    change: 0,
  },
  {
    rank: 5,
    user: { id: "u-lucas", username: "luclu_ultra", avatar: "🐻", level: 18, title: "Ultra-traileur" },
    value: 38.2,
    change: -2,
  },
  {
    rank: 6,
    user: { id: "u-clem", username: "clementinaa", avatar: "🦌", level: 7, title: "Coureur confirmé" },
    value: 32.5,
    change: 1,
  },
];

export const LEADERBOARD_REGION_WEEKLY_DPLUS: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: "u-74-1", username: "chamonix_roi", avatar: "🦅", level: 32, title: "Montagnard" },
    value: 8420,
    change: 0,
  },
  {
    rank: 2,
    user: { id: "u-74-2", username: "annecy_runner", avatar: "🐺", level: 24, title: "Ultra-traileur" },
    value: 6180,
    change: 1,
  },
  {
    rank: 3,
    user: { id: "u-74-3", username: "morzine_mtn", avatar: "🦌", level: 21, title: "Chasseur de cols" },
    value: 5850,
    change: -1,
  },
  {
    rank: 48,
    user: { id: "me", username: "traileur_demo", avatar: "🦊", level: 9, title: "Traileur" },
    value: 2840,
    change: 12,
    isYou: true,
  },
];

export const LEADERBOARD_WORLD_SEASON_XP: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: "u-w-1", username: "kilian_proxy", avatar: "👑", level: 67, title: "Légende du trail" },
    value: 184500,
    change: 0,
  },
  {
    rank: 2,
    user: { id: "u-w-2", username: "courtney_d", avatar: "🌟", level: 58, title: "Légende du trail" },
    value: 162300,
    change: 1,
  },
  {
    rank: 3,
    user: { id: "u-w-3", username: "jim_walmsley", avatar: "⚡", level: 54, title: "Légende du trail" },
    value: 148200,
    change: -1,
  },
  {
    rank: 1284,
    user: { id: "me", username: "traileur_demo", avatar: "🦊", level: 9, title: "Traileur" },
    value: 7420,
    change: 42,
    isYou: true,
  },
];

// ====== Classements officiels ITRA & UTMB ======
// Data fictive représentative — top traileurs FR/internationaux.
// Position du user (`isYou: true`) calée pour montrer le delta vs top.

export const LEADERBOARD_ITRA: LeaderboardEntry[] = [
  { rank: 1,   user: { id: "kj",       username: "kilian.jornet",   avatar: "🇪🇸", level: 50, title: "Mythe vivant" },     value: 919, change: 0 },
  { rank: 2,   user: { id: "fdh",      username: "francois.dhaene", avatar: "🇫🇷", level: 49, title: "Patron" },           value: 904, change: 1 },
  { rank: 3,   user: { id: "rb",       username: "remi.bonnet",     avatar: "🇨🇭", level: 48, title: "Skyrunner" },        value: 891, change: -1 },
  { rank: 4,   user: { id: "jt",       username: "jim.walmsley",    avatar: "🇺🇸", level: 47, title: "Vainqueur UTMB" },   value: 884, change: 0 },
  { rank: 5,   user: { id: "ce",       username: "courtney.dauwalter", avatar: "🇺🇸", level: 47, title: "Reine de l'ultra" }, value: 880, change: 0 },
  { rank: 6,   user: { id: "tg",       username: "tom.evans",       avatar: "🇬🇧", level: 46, title: "Chasseur" },         value: 873, change: 2 },
  { rank: 7,   user: { id: "blandine", username: "blandine.l.h",    avatar: "🇫🇷", level: 45, title: "Vétérane" },         value: 858, change: 0 },
  { rank: 8,   user: { id: "germain",  username: "germain.grangier",avatar: "🇫🇷", level: 44, title: "Combattant" },       value: 851, change: -1 },
  { rank: 9,   user: { id: "ludo",     username: "ludo.pommeret",   avatar: "🇫🇷", level: 43, title: "Sage" },             value: 834, change: 0 },
  { rank: 10,  user: { id: "mathieu",  username: "mathieu.blanchard",avatar: "🇫🇷", level: 43, title: "Doc" },             value: 829, change: 1 },
  // ... gap ...
  { rank: 4287,  user: { id: "u-mat",   username: "mat_trail",       avatar: "🐺", level: 14, title: "Chasseur de cols" }, value: 612, change: 4 },
  { rank: 4321,  user: { id: "u-louise",username: "louise.run",      avatar: "🦊", level: 13, title: "Grimpeuse" },        value: 605, change: -2 },
  { rank: 4356,  user: { id: "me",      username: "traileur_demo",   avatar: "🦊", level: 9, title: "Traileur" },          value: 598, change: 12, isYou: true },
  { rank: 4398,  user: { id: "u-tom",   username: "tom.runner",      avatar: "🦅", level: 11, title: "Grimpeur" },          value: 589, change: 0 },
  { rank: 4445,  user: { id: "u-marc",  username: "marcoulons",       avatar: "🦌", level: 10, title: "Traileur" },         value: 581, change: -3 },
];

export const LEADERBOARD_UTMB: LeaderboardEntry[] = [
  { rank: 1,   user: { id: "fdh",      username: "francois.dhaene", avatar: "🇫🇷", level: 50, title: "Patron" },           value: 945, change: 0 },
  { rank: 2,   user: { id: "kj",       username: "kilian.jornet",   avatar: "🇪🇸", level: 49, title: "Mythe vivant" },     value: 938, change: 0 },
  { rank: 3,   user: { id: "jt",       username: "jim.walmsley",    avatar: "🇺🇸", level: 48, title: "Vainqueur UTMB" },   value: 922, change: 1 },
  { rank: 4,   user: { id: "rb",       username: "remi.bonnet",     avatar: "🇨🇭", level: 48, title: "Skyrunner" },        value: 918, change: -1 },
  { rank: 5,   user: { id: "tg",       username: "tom.evans",       avatar: "🇬🇧", level: 47, title: "Chasseur" },         value: 905, change: 2 },
  { rank: 6,   user: { id: "ce",       username: "courtney.dauwalter", avatar: "🇺🇸", level: 47, title: "Reine de l'ultra" }, value: 902, change: 0 },
  { rank: 7,   user: { id: "ludo",     username: "ludo.pommeret",   avatar: "🇫🇷", level: 46, title: "Sage" },             value: 887, change: 0 },
  { rank: 8,   user: { id: "germain",  username: "germain.grangier",avatar: "🇫🇷", level: 45, title: "Combattant" },       value: 879, change: 1 },
  { rank: 9,   user: { id: "mathieu",  username: "mathieu.blanchard",avatar: "🇫🇷", level: 45, title: "Doc" },             value: 874, change: 0 },
  { rank: 10,  user: { id: "blandine", username: "blandine.l.h",    avatar: "🇫🇷", level: 44, title: "Vétérane" },         value: 868, change: -2 },
  // ... gap ...
  { rank: 6789,  user: { id: "u-mat",   username: "mat_trail",       avatar: "🐺", level: 14, title: "Chasseur de cols" }, value: 624, change: 8 },
  { rank: 6852,  user: { id: "u-louise",username: "louise.run",      avatar: "🦊", level: 13, title: "Grimpeuse" },        value: 615, change: -4 },
  { rank: 6924,  user: { id: "me",      username: "traileur_demo",   avatar: "🦊", level: 9, title: "Traileur" },          value: 605, change: 18, isYou: true },
  { rank: 6987,  user: { id: "u-tom",   username: "tom.runner",      avatar: "🦅", level: 11, title: "Grimpeur" },          value: 597, change: 0 },
  { rank: 7045,  user: { id: "u-marc",  username: "marcoulons",       avatar: "🦌", level: 10, title: "Traileur" },         value: 588, change: -1 },
];
