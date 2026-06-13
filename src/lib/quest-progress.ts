"use client";

// ====== quest-progress ======
// Calcule la VRAIE progression des quêtes en lisant les sorties enregistrées
// (esprit_manual_runs). Plus de progress hardcodé dans quests.ts — chaque
// affichage de quête recalcule depuis les vraies sorties + les vrais index.
//
// Périodes :
//   - daily   : runs avec date == aujourd'hui (heure locale)
//   - weekly  : runs depuis lundi 00h00 (heure locale)
//   - seasonal: runs du trimestre courant (avril-juin pour le moment)
//   - epic    : selon la quête (everesting = 30 derniers jours, etc.)

import { loadManualRuns, type ManualRun } from "./manual-runs";
import type { Quest } from "./types";

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()): Date {
  // Lundi 00h00
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function runsAfter(runs: ManualRun[], cutoff: Date): ManualRun[] {
  const t = cutoff.getTime();
  return runs.filter((r) => {
    const rt = new Date(r.date).getTime();
    return !Number.isNaN(rt) && rt >= t;
  });
}

function runsBetween(runs: ManualRun[], startIso: string, endIso: string): ManualRun[] {
  return runs.filter((r) => {
    const d = r.date.slice(0, 10);
    return d >= startIso && d <= endIso;
  });
}

function sumKm(runs: ManualRun[]): number {
  return Math.round(runs.reduce((s, r) => s + (r.distance || 0), 0) * 10) / 10;
}

function sumDplus(runs: ManualRun[]): number {
  return Math.round(runs.reduce((s, r) => s + (r.elevation || 0), 0));
}

/**
 * Calcule la progression réelle d'une quête en fonction des sorties stockées.
 * Retourne une valeur entre 0 et quest.target (clamped).
 */
export function computeQuestProgress(quest: Quest): number {
  if (typeof window === "undefined") return 0;
  const runs = loadManualRuns();

  // === Règles spécifiques par id (prioritaires sur les règles génériques) ===
  if (quest.id === "weekly-long-run") {
    // Au moins une sortie >= 15 km cette semaine
    const week = runsAfter(runs, startOfWeek());
    const longest = week.reduce((m, r) => Math.max(m, r.distance || 0), 0);
    return longest >= 15 ? 1 : 0;
  }

  if (quest.id === "season-spring-100k") {
    const total = sumKm(runsBetween(runs, "2026-04-01", "2026-06-30"));
    return Math.min(quest.target, total);
  }
  if (quest.id === "season-5000dplus") {
    const total = sumDplus(runsBetween(runs, "2026-04-01", "2026-06-30"));
    return Math.min(quest.target, total);
  }
  if (quest.id === "season-first-race") {
    // Pas encore de tracker de courses officielles, reste à 0
    return 0;
  }

  if (quest.id === "epic-utmb-index-700") {
    // Lit l'index UTMB saisi manuellement par l'user
    try {
      const raw = window.localStorage.getItem("esprit_trail_indices");
      if (raw) {
        const i = JSON.parse(raw);
        return Math.min(quest.target, Number(i?.utmb) || 0);
      }
    } catch {
      /* ignore */
    }
    return 0;
  }

  if (quest.id === "epic-everesting-month") {
    // D+ cumulé sur les 30 derniers jours
    const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    return Math.min(quest.target, sumDplus(runsAfter(runs, cutoff)));
  }

  // === Règles génériques par période + unité ===
  let pool: ManualRun[];
  switch (quest.period) {
    case "daily":
      pool = runsAfter(runs, startOfDay());
      break;
    case "weekly":
      pool = runsAfter(runs, startOfWeek());
      break;
    case "seasonal":
      pool = runsAfter(runs, new Date(Date.now() - 90 * 24 * 3600 * 1000));
      break;
    case "epic":
      pool = runsAfter(runs, new Date(Date.now() - 30 * 24 * 3600 * 1000));
      break;
    default:
      pool = runs;
  }

  switch (quest.unit) {
    case "km":
      return Math.min(quest.target, sumKm(pool));
    case "m":
      return Math.min(quest.target, sumDplus(pool));
    case "runs":
      return Math.min(quest.target, pool.length);
    case "races":
      // Pas de tracker courses officielles
      return 0;
    default:
      return 0;
  }
}

/**
 * Retourne une copie des quêtes avec leur progress recalculé. Pratique
 * pour itérer côté UI.
 */
export function withRealProgress(quests: Quest[]): Quest[] {
  return quests.map((q) => ({ ...q, progress: computeQuestProgress(q) }));
}
