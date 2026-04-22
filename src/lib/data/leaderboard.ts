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
    user: { id: "me", username: "coulon_g", avatar: "🦊", level: 9, title: "Traileur" },
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
    user: { id: "me", username: "coulon_g", avatar: "🦊", level: 9, title: "Traileur" },
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
    user: { id: "me", username: "coulon_g", avatar: "🦊", level: 9, title: "Traileur" },
    value: 7420,
    change: 42,
    isYou: true,
  },
];
