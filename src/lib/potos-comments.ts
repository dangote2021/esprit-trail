// ====== potos-comments.ts ======
// Commentaires sur le feed potos (panel test Léa : "le feed est un cul-de-sac,
// ça ne crée pas de conversation"). MVP : commentaires persistés localStorage,
// plus quelques commentaires mock pré-amorcés pour que le fil ne soit pas vide
// et donne envie de répondre.
//
// À terme : table activity_comments Supabase + Realtime. La signature de
// addComment / loadComments est pensée pour basculer facilement.

import { getStoredIdentity } from "@/lib/identity";

export type PotoComment = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  text: string;
  /** minutes écoulées depuis "now" — cohérent avec le feed */
  agoMinutes: number;
  /** true si posté par l'utilisateur courant */
  isMe?: boolean;
};

const KEY = "esprit_potos_comments";

// Commentaires mock pré-amorcés par activité — donnent le ton, montrent
// que le fil est vivant. Cohérents avec les personas du feed/leaderboard.
const SEED: Record<string, PotoComment[]> = {
  "act-mat-1": [
    { id: "s1", author: "Thomas", handle: "tom.runner", avatar: "🦅", text: "Le Vercors en ce moment c'est tapis roulant de boue, courage 😅", agoMinutes: 28 },
    { id: "s2", author: "Clem", handle: "clementinaa", avatar: "🦌", text: "Trop beau ce tracé, tu l'as en GPX ?", agoMinutes: 15 },
  ],
  "act-thomas-1": [
    { id: "s3", author: "Mathilde", handle: "mat_trail", avatar: "🐺", text: "1h38 sur 21 bornes de trail ?! Tu voles 🔥", agoMinutes: 90 },
  ],
  "act-lucas-1": [
    { id: "s4", author: "Sarah", handle: "sarahmtn", avatar: "🐐", text: "42 bornes / 2850 D+ « pour voir »… la légende 🐻", agoMinutes: 400 },
    { id: "s5", author: "Marc", handle: "marcoulons", avatar: "🦌", text: "Faut qu'on cale une sortie ensemble", agoMinutes: 120 },
  ],
  "act-clem-1": [
    { id: "s6", author: "Louise", handle: "louise.run", avatar: "🦊", text: "10 sorties en mai, respect 👏", agoMinutes: 600 },
  ],
};

type Store = Record<string, PotoComment[]>;

function loadStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

/** Commentaires d'une activité = seeds mock + commentaires user, triés récents en bas. */
export function loadComments(activityId: string): PotoComment[] {
  const seeds = SEED[activityId] ?? [];
  const mine = loadStore()[activityId] ?? [];
  return [...seeds, ...mine].sort((a, b) => b.agoMinutes - a.agoMinutes);
}

export function commentCount(activityId: string): number {
  return (SEED[activityId]?.length ?? 0) + (loadStore()[activityId]?.length ?? 0);
}

/** Ajoute un commentaire de l'utilisateur courant. */
export function addComment(activityId: string, text: string): PotoComment[] {
  if (typeof window === "undefined") return [];
  const trimmed = text.trim().slice(0, 280);
  if (!trimmed) return loadComments(activityId);
  try {
    const ident = getStoredIdentity();
    const comment: PotoComment = {
      id: `c-${Date.now()}`,
      author: ident.displayName || "Toi",
      handle: ident.username || "toi",
      avatar: "🏃",
      text: trimmed,
      agoMinutes: 0,
      isMe: true,
    };
    const store = loadStore();
    store[activityId] = [...(store[activityId] ?? []), comment];
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(
      new CustomEvent("esprit:potos:comment", { detail: { activityId } }),
    );
    return loadComments(activityId);
  } catch {
    return loadComments(activityId);
  }
}

/** Format court "il y a Xmin / Xh / Xj". */
export function formatCommentAgo(minutes: number): string {
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `${Math.floor(minutes)} min`;
  const h = minutes / 60;
  if (h < 24) return `${Math.floor(h)} h`;
  return `${Math.floor(h / 24)} j`;
}
