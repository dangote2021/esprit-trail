"use client";

// ====== coach-plan ======
// Persiste le plan d'entraînement généré par l'API Coach IA dans
// localStorage. Permet à la home d'afficher la séance / la semaine du
// plan en cours. Crucial pour la rétention quotidienne : sans plan
// persistant, l'user ne revient pas pour voir sa séance du jour.

export type StoredSession = {
  type: "easy" | "long" | "interval" | "hill" | "tempo" | "strength" | "rest" | "race";
  title: string;
  duration: number;
  distance?: number;
  elevation?: number;
  intensity?: string;
  description?: string;
};

export type StoredWeek = {
  weekNumber: number;
  block: string;
  focus: string;
  weeklyKm: number;
  weeklyElevation: number;
  sessions: StoredSession[];
  coachTip: string;
  nutritionTip?: string;
};

export type StoredPlan = {
  goal: string;
  goalLabel: string;
  totalWeeks: number;
  generatedAt: string; // ISO
  startedAt: string; // ISO — au lundi suivant la génération
  raceName?: string;
  raceDate?: string;
  plan: StoredWeek[];
};

export type SessionMark = {
  weekIndex: number;
  sessionIndex: number;
  doneAt: string;
};

const PLAN_KEY = "esprit_coach_plan";
const MARKS_KEY = "esprit_coach_plan_marks";
export const PLAN_EVENT = "esprit:plan";

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

export function loadPlan(): StoredPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePlan(plan: Omit<StoredPlan, "startedAt">) {
  if (typeof window === "undefined") return;
  const startedAt = startOfWeek(new Date()).toISOString();
  const full: StoredPlan = { ...plan, startedAt };
  try {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(full));
    window.dispatchEvent(new Event(PLAN_EVENT));
  } catch {
    /* ignore */
  }
}

export function deletePlan() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PLAN_KEY);
    window.localStorage.removeItem(MARKS_KEY);
    window.dispatchEvent(new Event(PLAN_EVENT));
  } catch {
    /* ignore */
  }
}

/** Index de la semaine en cours du plan (0-based). Renvoie null si plan
 *  pas commencé ou terminé. */
export function currentWeekIndex(plan: StoredPlan): number | null {
  const start = new Date(plan.startedAt).getTime();
  const now = Date.now();
  const weeks = Math.floor((now - start) / (7 * 24 * 3600 * 1000));
  if (weeks < 0) return null;
  if (weeks >= plan.totalWeeks) return null;
  return weeks;
}

export function loadMarks(): SessionMark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isSessionDone(weekIndex: number, sessionIndex: number): boolean {
  return loadMarks().some(
    (m) => m.weekIndex === weekIndex && m.sessionIndex === sessionIndex,
  );
}

export function markSessionDone(weekIndex: number, sessionIndex: number) {
  if (typeof window === "undefined") return;
  const all = loadMarks();
  if (all.some((m) => m.weekIndex === weekIndex && m.sessionIndex === sessionIndex))
    return;
  all.push({ weekIndex, sessionIndex, doneAt: new Date().toISOString() });
  try {
    window.localStorage.setItem(MARKS_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(PLAN_EVENT));
  } catch {
    /* ignore */
  }
}

export function unmarkSessionDone(weekIndex: number, sessionIndex: number) {
  if (typeof window === "undefined") return;
  const all = loadMarks().filter(
    (m) => !(m.weekIndex === weekIndex && m.sessionIndex === sessionIndex),
  );
  try {
    window.localStorage.setItem(MARKS_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(PLAN_EVENT));
  } catch {
    /* ignore */
  }
}
