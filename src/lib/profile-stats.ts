"use client";

// ====== profile-stats ======
// Agrège les VRAIES sorties de l'utilisateur (esprit_manual_runs : saisies
// manuelles + tracker GPS) pour produire les stats affichées sur le profil
// et la home. Aucune donnée mock — un profil neuf renvoie des zéros.

import { loadManualRuns, type ManualRun } from "./manual-runs";

export type ProfileAgg = {
  /** Nombre total de sorties enregistrées */
  totalRuns: number;
  /** Distance cumulée (km) */
  totalDistance: number;
  /** D+ cumulé (m) */
  totalElevation: number;
  /** Plus longue sortie (km) */
  longestRun: number;
  /** Sorties des 7 derniers jours */
  weekRuns: number;
  /** Distance des 7 derniers jours (km) */
  weekDistance: number;
  /** D+ des 7 derniers jours (m) */
  weekElevation: number;
};

const EMPTY: ProfileAgg = {
  totalRuns: 0,
  totalDistance: 0,
  totalElevation: 0,
  longestRun: 0,
  weekRuns: 0,
  weekDistance: 0,
  weekElevation: 0,
};

export function aggregateRuns(runs: ManualRun[]): ProfileAgg {
  if (!runs.length) return { ...EMPTY };
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 3600 * 1000;
  let agg: ProfileAgg = { ...EMPTY };
  for (const r of runs) {
    agg.totalRuns += 1;
    agg.totalDistance += r.distance || 0;
    agg.totalElevation += r.elevation || 0;
    agg.longestRun = Math.max(agg.longestRun, r.distance || 0);
    const t = new Date(r.date).getTime();
    if (!Number.isNaN(t) && t >= weekAgo) {
      agg.weekRuns += 1;
      agg.weekDistance += r.distance || 0;
      agg.weekElevation += r.elevation || 0;
    }
  }
  agg.totalDistance = Math.round(agg.totalDistance * 10) / 10;
  agg.weekDistance = Math.round(agg.weekDistance * 10) / 10;
  agg.longestRun = Math.round(agg.longestRun * 10) / 10;
  return agg;
}

/** Charge les vraies sorties et renvoie leur agrégat. Client-only. */
export function loadProfileAgg(): ProfileAgg {
  return aggregateRuns(loadManualRuns());
}
