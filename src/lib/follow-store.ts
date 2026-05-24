// ====== follow-store.ts ======
// Petit store localStorage pour les abonnements (qui je suis).
// MVP : pas de back. À terme : table user_follows Supabase RLS.
//
// Implémentation : key esprit_follows = { [userId]: { since: iso } }.
// Dispatch d'un event "esprit:follows" à chaque changement pour que les
// composants (PotosFeed, suggestions) puissent rerender.

const KEY = "esprit_follows";

export type FollowEntry = { since: string };
export type FollowStore = Record<string, FollowEntry>;

export function loadFollows(): FollowStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FollowStore) : {};
  } catch {
    return {};
  }
}

export function isFollowing(userId: string): boolean {
  if (typeof window === "undefined") return false;
  return !!loadFollows()[userId];
}

export function toggleFollow(userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const store = loadFollows();
    const on = !store[userId];
    if (on) store[userId] = { since: new Date().toISOString() };
    else delete store[userId];
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(
      new CustomEvent("esprit:follows", { detail: { userId, following: on } }),
    );
    return on;
  } catch {
    return false;
  }
}

export function followCount(): number {
  if (typeof window === "undefined") return 0;
  return Object.keys(loadFollows()).length;
}
