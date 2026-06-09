// ====== potos-reactions.ts ======
// Petit store localStorage pour les réactions "kif" sur le feed potos.
// Pas de backend pour le MVP : c'est OK, ça fait quand même tourner le
// pattern "tape pour réagir" qu'on testera plus tard côté Supabase.

export type Reaction = "🔥" | "💪" | "👏" | "🤘" | "❤️";

export const ALL_REACTIONS: Reaction[] = ["🔥", "💪", "👏", "🤘", "❤️"];

const KEY = "esprit_potos_reactions";

type Store = Record<string, Reaction[]>; // activityId -> reactions cumulées par l'user
type CountStore = Record<string, number>; // activityId -> compteur global "communauté" simulé

const KEY_COUNTS = "esprit_potos_react_counts";

/** Réactions posées par l'utilisateur courant sur une activité. */
export function getMyReactions(activityId: string): Reaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Store;
    return parsed[activityId] ?? [];
  } catch {
    return [];
  }
}

/** Toggle d'une réaction sur une activité (ajoute ou retire). */
export function toggleReaction(activityId: string, r: Reaction): Reaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const store: Store = raw ? (JSON.parse(raw) as Store) : {};
    const current = new Set(store[activityId] ?? []);
    const wasOn = current.has(r);
    if (wasOn) current.delete(r);
    else current.add(r);
    store[activityId] = Array.from(current);
    window.localStorage.setItem(KEY, JSON.stringify(store));

    // Met à jour les compteurs simulés (+1 / -1)
    const rawC = window.localStorage.getItem(KEY_COUNTS);
    const counts: CountStore = rawC ? (JSON.parse(rawC) as CountStore) : {};
    counts[activityId] = Math.max(0, (counts[activityId] ?? 0) + (wasOn ? -1 : 1));
    window.localStorage.setItem(KEY_COUNTS, JSON.stringify(counts));

    // Event pour rafraîchir les autres composants montés
    window.dispatchEvent(
      new CustomEvent("esprit:potos:reaction", {
        detail: { activityId, reactions: store[activityId] },
      }),
    );

    return store[activityId];
  } catch {
    return [];
  }
}

/**
 * Compteur affiché (base "fictive communautaire" + delta utilisateur).
 * On part de quelques réactions par défaut pour que le feed ne soit pas
 * tout vide la première fois — c'est un faux compteur communauté.
 */
export function getReactionCount(activityId: string, base: number): number {
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(KEY_COUNTS);
    if (!raw) return base;
    const counts = JSON.parse(raw) as CountStore;
    return Math.max(0, base + (counts[activityId] ?? 0));
  } catch {
    return base;
  }
}

/** Base "communauté" prédéfinie par activité (pour pas avoir 0 partout). */
export const BASE_REACTIONS: Record<string, number> = {
  "act-mat-1": 7,
  "act-thomas-1": 12,
  "act-sarah-1": 4,
  "act-lucas-1": 23,
  "act-clem-1": 5,
  "act-mat-2": 3,
  "act-tom-2": 2,
  "act-sarah-2": 8,
  "act-louise-1": 6,
  "act-marc-1": 2,
};
