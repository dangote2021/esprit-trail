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

// Hardening 06/09/26 : forme minimale requise pour calculer la progression
// d'une quête — juste assez pour accepter aussi bien une sortie localStorage
// (ManualRun) qu'une ligne réelle de la table Supabase `runs` (où
// distance/elevation reviennent parfois en string via postgrest). Voir
// computeProgressFromRuns() : avant ce hardening, la synchro serveur
// (lib/supabase/run-sync.ts) recalculait la progression des quêtes via
// computeQuestProgress(), qui ne lit QUE le localStorage du navigateur —
// incohérent avec les vraies sorties Supabase dès qu'on change d'appareil,
// de navigateur, ou que le storage local est vidé.
export type QuestRunLike = {
  date: string;
  distance: number | string | null | undefined;
  elevation: number | string | null | undefined;
};

function toKm(v: QuestRunLike["distance"]): number {
  return Number(v) || 0;
}

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

function runsAfter<T extends QuestRunLike>(runs: T[], cutoff: Date): T[] {
  const t = cutoff.getTime();
  return runs.filter((r) => {
    const rt = new Date(r.date).getTime();
    return !Number.isNaN(rt) && rt >= t;
  });
}

function runsBetween<T extends QuestRunLike>(
  runs: T[],
  startIso: string,
  endIso: string,
): T[] {
  return runs.filter((r) => {
    const d = r.date.slice(0, 10);
    return d >= startIso && d <= endIso;
  });
}

function sumKm(runs: QuestRunLike[]): number {
  return Math.round(runs.reduce((s, r) => s + toKm(r.distance), 0) * 10) / 10;
}

function sumDplus(runs: QuestRunLike[]): number {
  return Math.round(runs.reduce((s, r) => s + toKm(r.elevation), 0));
}

/**
 * Calcule la progression réelle d'une quête à partir d'un jeu de sorties
 * déjà chargé (localStorage ou lignes Supabase — peu importe la source tant
 * que la forme correspond à QuestRunLike). `utmbIndex`, quand fourni,
 * prévaut sur le localStorage pour la quête epic-utmb-index-700 (permet à
 * l'appelant de passer le vrai index Supabase du profil).
 */
export function computeProgressFromRuns(
  quest: Quest,
  runs: QuestRunLike[],
  opts?: { utmbIndex?: number | null },
): number {
  // === Règles spécifiques par id (prioritaires sur les règles génériques) ===
  if (quest.id === "weekly-long-run") {
    // Au moins une sortie >= 15 km cette semaine
    const week = runsAfter(runs, startOfWeek());
    const longest = week.reduce((m, r) => Math.max(m, toKm(r.distance)), 0);
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
    if (opts?.utmbIndex != null) {
      return Math.min(quest.target, opts.utmbIndex);
    }
    // Fallback : index UTMB saisi manuellement par l'user (démo / pas de
    // profil Supabase disponible côté appelant).
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("esprit_trail_indices");
        if (raw) {
          const i = JSON.parse(raw);
          return Math.min(quest.target, Number(i?.utmb) || 0);
        }
      } catch {
        /* ignore */
      }
    }
    return 0;
  }

  if (quest.id === "epic-everesting-month") {
    // D+ cumulé sur les 30 derniers jours
    const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    return Math.min(quest.target, sumDplus(runsAfter(runs, cutoff)));
  }

  // === Règles génériques par période + unité ===
  let pool: QuestRunLike[];
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
 * Calcule la progression réelle d'une quête en fonction des sorties
 * stockées en localStorage sur CET appareil. Utilisé par l'UI (affichage
 * client, même logique que par le passé). Pour un calcul fondé sur les
 * vraies sorties Supabase de l'utilisateur (cross-appareil), voir
 * computeProgressFromRuns().
 * Retourne une valeur entre 0 et quest.target (clamped).
 */
export function computeQuestProgress(quest: Quest): number {
  if (typeof window === "undefined") return 0;
  const runs: ManualRun[] = loadManualRuns();
  return computeProgressFromRuns(quest, runs);
}

/**
 * Retourne une copie des quêtes avec leur progress recalculé. Pratique
 * pour itérer côté UI.
 */
export function withRealProgress(quests: Quest[]): Quest[] {
  return quests.map((q) => ({ ...q, progress: computeQuestProgress(q) }));
}
