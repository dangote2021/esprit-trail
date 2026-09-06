"use client";

// ====== SUPABASE QUEST PROGRESS SERVICE (client) ======
// Rapport de test panel (06/09/26) : `run-sync.ts` (le moteur qui attribue
// l'XP serveur) a été corrigé pour recalculer la progression des quêtes
// depuis les VRAIES sorties Supabase (`runs` + `profiles.utmb_index`) au
// lieu du localStorage — mais l'UI (QuestCard, DailyQuestHero, /quests)
// appelait encore computeQuestProgress(), qui ne lit QUE le localStorage de
// l'appareil. Un utilisateur changeant d'appareil ou de navigateur voyait
// donc un affichage de progression incohérent avec l'XP réellement
// attribuée en base.
//
// Ce module calcule la progression RÉELLE des quêtes depuis les données
// Supabase de l'utilisateur connecté, avec le même moteur pur
// (computeProgressFromRuns, lib/quest-progress.ts) et exactement les mêmes
// requêtes que syncQuests() dans run-sync.ts — garantissant que l'affichage
// et l'attribution d'XP restent cohérents. Même pattern que
// lib/supabase/badges.ts : repli silencieux à `null` si l'utilisateur n'est
// pas authentifié ou si la requête échoue, pour que les appelants retombent
// sur computeQuestProgress() (localStorage, mode démo).
//
// Les résultats sont mis en cache en mémoire (module-level) le temps de la
// session navigateur, pour éviter qu'une page affichant plusieurs quêtes
// (QuestCard × N sur /quests) ne déclenche une requête Supabase par carte.
// Le cache est invalidé dès qu'une sortie est enregistrée (événement
// "esprit:runs", déjà utilisé partout ailleurs pour rafraîchir l'UI).

import { getSupabaseBrowserClient } from "./client";
import { computeProgressFromRuns, type QuestRunLike } from "@/lib/quest-progress";
import type { Quest } from "@/lib/types";

type RealQuestData = { runs: QuestRunLike[]; utmbIndex: number | null };

let cached: Promise<RealQuestData | null> | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 15_000;

function invalidateCache() {
  cached = null;
}

if (typeof window !== "undefined") {
  window.addEventListener("esprit:runs", invalidateCache);
  window.addEventListener("storage", invalidateCache);
}

async function fetchRealQuestData(): Promise<RealQuestData | null> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data: userData } = await sb.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return null;

    const [runsRes, profileRes] = await Promise.all([
      sb.from("runs").select("date, distance, elevation").eq("user_id", userId),
      sb.from("profiles").select("utmb_index").eq("id", userId).maybeSingle(),
    ]);

    const runs = (runsRes.data ?? []) as QuestRunLike[];
    const utmbIndex =
      (profileRes.data as { utmb_index: number | null } | null)?.utmb_index ?? null;
    return { runs, utmbIndex };
  } catch {
    // Repli silencieux : les appelants retombent sur le localStorage.
    return null;
  }
}

function getRealQuestData(): Promise<RealQuestData | null> {
  const now = Date.now();
  if (!cached || now - cachedAt > CACHE_TTL_MS) {
    cached = fetchRealQuestData();
    cachedAt = now;
  }
  return cached;
}

/** Progression réelle des quêtes passées en argument, depuis les vraies
 *  sorties Supabase de l'utilisateur connecté. Retourne `null` si
 *  l'utilisateur n'est pas authentifié (ou si la requête échoue) : les
 *  appelants doivent alors utiliser computeQuestProgress() (localStorage,
 *  mode démo) comme repli. */
export async function getRealQuestProgress(
  quests: Quest[],
): Promise<Map<string, number> | null> {
  const data = await getRealQuestData();
  if (!data) return null;

  const progress = new Map<string, number>();
  for (const quest of quests) {
    progress.set(
      quest.id,
      computeProgressFromRuns(quest, data.runs, { utmbIndex: data.utmbIndex }),
    );
  }
  return progress;
}
