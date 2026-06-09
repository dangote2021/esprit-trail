"use client";

// ====== my-guildes ======
// Store localStorage pour les crews créés par l'utilisateur. En attendant
// le schéma teams Supabase, les guildes user-created vivent en local et
// apparaissent dans la liste avec un badge "Créé par toi".

export type MyGuilde = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  region: string;
  joinRule: "open" | "request";
  category: "local" | "club" | "bande-copains" | "elite" | "theme";
  createdAt: string; // ISO
};

const KEY = "esprit_my_guildes";
export const MY_GUILDES_EVENT = "esprit:my-guildes";

export function loadMyGuildes(): MyGuilde[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMyGuilde(g: Omit<MyGuilde, "id" | "createdAt">): MyGuilde {
  const fresh: MyGuilde = {
    ...g,
    id: "user-" + Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
  };
  if (typeof window === "undefined") return fresh;
  const all = loadMyGuildes();
  all.unshift(fresh);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(MY_GUILDES_EVENT));
  } catch {
    /* ignore */
  }
  return fresh;
}

export function deleteMyGuilde(id: string) {
  if (typeof window === "undefined") return;
  const all = loadMyGuildes().filter((g) => g.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(MY_GUILDES_EVENT));
  } catch {
    /* ignore */
  }
}
