"use client";

// ====== useStreak ======
// Compte le nombre de semaines consécutives (lundi-dimanche) avec au moins
// une sortie enregistrée. Si la semaine en cours a une sortie, elle compte
// dans la streak. Sinon, on prend la dernière semaine pleine.
//
// Rétention : la streak est l'indicateur que l'user vient le plus chercher.
// 5 sem. d'affilée = forte motivation à ne pas casser la série.

import { useEffect, useState } from "react";
import { loadManualRuns, type ManualRun } from "./manual-runs";

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function weekHasRun(runs: ManualRun[], weekStart: Date): boolean {
  const start = weekStart.getTime();
  const end = start + 7 * 24 * 3600 * 1000;
  return runs.some((r) => {
    const t = new Date(r.date).getTime();
    return !Number.isNaN(t) && t >= start && t < end;
  });
}

export function computeStreak(runs: ManualRun[]): number {
  if (runs.length === 0) return 0;
  const now = new Date();
  let week = startOfWeek(now);
  let streak = 0;

  // Si la semaine en cours a une sortie → on commence à compter à partir
  // de cette semaine. Sinon, on commence à la semaine précédente (on n'a
  // pas encore "cassé" la streak).
  const currentHasRun = weekHasRun(runs, week);
  if (!currentHasRun) {
    week.setDate(week.getDate() - 7);
  }

  while (weekHasRun(runs, week)) {
    streak += 1;
    week = new Date(week);
    week.setDate(week.getDate() - 7);
  }
  return streak;
}

export function useStreak(): { streak: number; ready: boolean } {
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setStreak(computeStreak(loadManualRuns()));
      setReady(true);
    };
    refresh();
    window.addEventListener("esprit:runs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit:runs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { streak, ready };
}
