import type { Quest } from "@/lib/types";

// Aujourd'hui + N jours (ISO)
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};
const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};
const endOfWeek = () => {
  const d = new Date();
  const day = d.getDay(); // 0 = dimanche
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

export const QUESTS: Quest[] = [
  // === DAILY ===
  {
    id: "daily-5k",
    title: "Dépoussiérage",
    description: "Couvre 5 km aujourd'hui",
    icon: "👟",
    period: "daily",
    target: 5,
    unit: "km",
    progress: 3.2,
    xpReward: 50,
    expiresAt: endOfToday(),
  },
  {
    id: "daily-300dplus",
    title: "Un col pour commencer",
    description: "Grimpe 300 m de D+ aujourd'hui",
    icon: "⛰️",
    period: "daily",
    target: 300,
    unit: "m",
    progress: 180,
    xpReward: 70,
    expiresAt: endOfToday(),
  },
  {
    id: "daily-streak",
    title: "Ne casse pas la série",
    description: "Enregistre au moins une activité aujourd'hui",
    icon: "🔥",
    period: "daily",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 40,
    expiresAt: endOfToday(),
  },

  // === WEEKLY ===
  {
    id: "weekly-40k",
    title: "Volume de la semaine",
    description: "Cumule 40 km cette semaine",
    icon: "📏",
    period: "weekly",
    target: 40,
    unit: "km",
    progress: 22.5,
    xpReward: 300,
    expiresAt: endOfWeek(),
  },
  {
    id: "weekly-1500dplus",
    title: "1500 D+",
    description: "Enchaîne 1500 m de D+ cette semaine",
    icon: "🗻",
    period: "weekly",
    target: 1500,
    unit: "m",
    progress: 820,
    xpReward: 400,
    expiresAt: endOfWeek(),
  },
  {
    id: "weekly-long-run",
    title: "La sortie longue",
    description: "Fais au moins une sortie de 15 km+",
    icon: "🏃‍♂️",
    period: "weekly",
    target: 1,
    unit: "runs",
    progress: 0,
    xpReward: 250,
    expiresAt: endOfWeek(),
  },
  {
    id: "weekly-four-runs",
    title: "Régularité",
    description: "4 sorties cette semaine minimum",
    icon: "📅",
    period: "weekly",
    target: 4,
    unit: "runs",
    progress: 2,
    xpReward: 350,
    expiresAt: endOfWeek(),
  },

  // === SEASONAL ===
  {
    id: "season-spring-100k",
    title: "Printemps sauvage",
    description: "Cumule 100 km entre avril et juin",
    icon: "🌸",
    period: "seasonal",
    target: 100,
    unit: "km",
    progress: 42,
    xpReward: 1500,
    expiresAt: "2026-06-21T23:59:59.000Z",
  },
  {
    id: "season-5000dplus",
    title: "5000 D+ saison",
    description: "Cumule 5000 m D+ sur le trimestre",
    icon: "🏔️",
    period: "seasonal",
    target: 5000,
    unit: "m",
    progress: 2100,
    xpReward: 2000,
    expiresAt: "2026-06-21T23:59:59.000Z",
  },
  {
    id: "season-first-race",
    title: "La course de l'année",
    description: "Cours au moins une course officielle",
    icon: "🎽",
    period: "seasonal",
    target: 1,
    unit: "races",
    progress: 0,
    xpReward: 3000,
    badgeReward: "first-race",
    expiresAt: addDays(90),
  },

  // === EPIC ===
  {
    id: "epic-utmb-index-700",
    title: "Prouve-toi",
    description: "Atteins un UTMB Index de 700",
    icon: "🎯",
    period: "epic",
    target: 700,
    unit: "m",
    progress: 625,
    xpReward: 5000,
    expiresAt: addDays(365),
  },
  {
    id: "epic-everesting-month",
    title: "Everesting en un mois",
    description: "Cumule 8848 m D+ en 30 jours",
    icon: "💎",
    period: "epic",
    target: 8848,
    unit: "m",
    progress: 3120,
    xpReward: 4000,
    badgeReward: "everest-month",
    expiresAt: addDays(30),
  },
];

export function questsForPeriod(period: Quest["period"]): Quest[] {
  return QUESTS.filter((q) => q.period === period);
}
