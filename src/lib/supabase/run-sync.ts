"use client";

// ====== SYNC SORTIES → SUPABASE + ATTRIBUTION QUÊTES/BADGES ======
// Hardening 05/09/26 : rapport de test panel — priorité moyenne signalée :
// `user_quests` (84 lignes) et `user_badges` (0 ligne) n'étaient écrits que
// par un script SQL de seed ponctuel, jamais par l'app. En creusant plus
// loin : le problème est encore plus en amont — les sorties saisies via
// /run/manual et /run/track (lib/manual-runs.ts) ne quittaient JAMAIS le
// localStorage de l'appareil. Résultat : /leaderboard, les badges et les
// quêtes ne voyaient jamais les sorties d'un vrai joueur, même actif — seules
// les personas de seed apparaissaient dans les vues Supabase.
//
// Ce module ferme la boucle. À chaque sortie enregistrée (voir l'appel dans
// lib/manual-runs.ts) :
//   1. écrit la sortie dans `runs` si l'utilisateur est authentifié ;
//   2. recalcule les badges réellement débloqués (même moteur pur que
//      lib/badges-engine.ts, déjà utilisé pour l'affichage) et insère les
//      nouveaux dans `user_badges` ;
//   3. recalcule la progression des quêtes actives (même logique que
//      lib/quest-progress.ts, déjà utilisée pour l'affichage) et la
//      persiste dans `user_quests`, en attribuant l'XP au profil uniquement
//      au moment précis où une quête ou un badge passe de non-complété à
//      complété (jamais deux fois pour la même completion).
//
// Best-effort partout : une sortie doit rester utilisable hors-ligne / sans
// compte (mode démo) — le localStorage (source de vérité pour l'UI Quêtes)
// n'attend jamais cette synchro, qui échoue silencieusement si l'utilisateur
// n'est pas connecté ou si une requête échoue en cours de route.

import { getSupabaseBrowserClient } from "./client";
import { computeUnlockedBadges } from "@/lib/badges-engine";
import { BADGES } from "@/lib/data/badges";
import { QUESTS } from "@/lib/data/quests";
import { computeQuestProgress } from "@/lib/quest-progress";
import type { ManualRun } from "@/lib/manual-runs";

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data } = await sb.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Étape 1 : écrit la sortie dans `runs`. Retourne l'id inséré (pour le FK
 *  optionnel `user_badges.run_id`), ou null si l'insertion échoue. */
async function insertRun(userId: string, run: ManualRun): Promise<string | null> {
  const sb = getSupabaseBrowserClient();
  // `runs.source` n'accepte que strava/garmin/coros/suunto/manual (contrainte
  // en base) — il n'existe pas de valeur "tracker" : les deux origines locales
  // (saisie manuelle et tracker natif Esprit Trail) sont donc enregistrées
  // sous "manual", la plus honnête des options existantes.
  const { data, error } = await sb
    .from("runs")
    .insert({
      user_id: userId,
      date: run.date,
      title: run.title,
      location: run.location ?? null,
      distance: run.distance,
      elevation: run.elevation,
      duration: run.duration,
      terrain: run.terrain ?? null,
      source: "manual",
      polyline: run.polyline ?? null,
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("[run-sync] insertRun", error);
    return null;
  }
  return data.id as string;
}

/** Étape 2 : diffuse les badges nouvellement débloqués dans `user_badges`.
 *  Retourne l'XP total des badges qui viennent d'être débloqués (0 si
 *  aucun nouveau). */
async function syncBadges(userId: string, runId: string | null): Promise<number> {
  const sb = getSupabaseBrowserClient();
  const [{ data: allRuns, error: runsError }, { data: profile }, { data: already }] =
    await Promise.all([
      sb.from("runs").select("distance, elevation").eq("user_id", userId),
      sb.from("profiles").select("streak").eq("id", userId).maybeSingle(),
      sb.from("user_badges").select("badge_id").eq("user_id", userId),
    ]);
  if (runsError) {
    console.error("[run-sync] syncBadges", runsError);
    return 0;
  }

  const unlocked = computeUnlockedBadges(
    allRuns ?? [],
    (profile as { streak: number | null } | null)?.streak,
  );
  const alreadyIds = new Set((already ?? []).map((b) => b.badge_id as string));
  const newlyUnlocked = [...unlocked].filter((id) => !alreadyIds.has(id));
  if (newlyUnlocked.length === 0) return 0;

  const { error: insertError } = await sb.from("user_badges").insert(
    newlyUnlocked.map((badgeId) => ({
      user_id: userId,
      badge_id: badgeId,
      run_id: runId,
    })),
  );
  if (insertError) {
    console.error("[run-sync] syncBadges insert", insertError);
    return 0;
  }

  return newlyUnlocked.reduce(
    (sum, id) => sum + (BADGES.find((b) => b.id === id)?.xpReward ?? 0),
    0,
  );
}

/** Étape 3 : recalcule et persiste la progression des quêtes actives.
 *  Retourne l'XP des quêtes qui viennent de passer complétées. */
async function syncQuests(userId: string): Promise<number> {
  const sb = getSupabaseBrowserClient();
  const { data: existingRows, error } = await sb
    .from("user_quests")
    .select("quest_id, expires_at, completed_at")
    .eq("user_id", userId);
  if (error) {
    console.error("[run-sync] syncQuests read", error);
    return 0;
  }
  const existingByKey = new Map(
    (existingRows ?? []).map((r) => [
      `${r.quest_id}::${r.expires_at}`,
      r as { completed_at: string | null },
    ]),
  );

  let xpGained = 0;
  const rows = QUESTS.map((quest) => {
    const progress = computeQuestProgress(quest);
    const existing = existingByKey.get(`${quest.id}::${quest.expiresAt}`);
    const wasCompleted = !!existing?.completed_at;
    const isCompleted = progress >= quest.target;
    const nowCompleting = isCompleted && !wasCompleted;
    if (nowCompleting) xpGained += quest.xpReward;

    return {
      user_id: userId,
      quest_id: quest.id,
      expires_at: quest.expiresAt,
      progress,
      completed_at: nowCompleting
        ? new Date().toISOString()
        : (existing?.completed_at ?? null),
    };
  });

  const { error: upsertError } = await sb
    .from("user_quests")
    .upsert(rows, { onConflict: "user_id,quest_id,expires_at" });
  if (upsertError) {
    console.error("[run-sync] syncQuests upsert", upsertError);
    return 0;
  }
  return xpGained;
}

async function grantXp(userId: string, amount: number) {
  if (amount <= 0) return;
  const sb = getSupabaseBrowserClient();
  const { data: profile } = await sb
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .maybeSingle();
  const currentXp = (profile as { xp: number | null } | null)?.xp ?? 0;
  await sb.from("profiles").update({ xp: currentXp + amount }).eq("id", userId);
}

/** Point d'entrée unique, appelé depuis lib/manual-runs.ts juste après
 *  l'écriture localStorage. Ne bloque jamais l'UI (fire-and-forget côté
 *  appelant) et ne fait rien si l'utilisateur n'est pas un vrai compte
 *  Supabase connecté (mode démo). */
export async function syncRunToSupabase(run: ManualRun): Promise<void> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return;

  try {
    const runId = await insertRun(userId, run);
    const [badgeXp, questXp] = await Promise.all([
      syncBadges(userId, runId),
      syncQuests(userId),
    ]);
    await grantXp(userId, badgeXp + questXp);
  } catch (err) {
    console.error("[run-sync] syncRunToSupabase", err);
  }
}
