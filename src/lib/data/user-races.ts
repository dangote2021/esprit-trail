// ====== USER-SUBMITTED RACES (ON + OFF) ======
// Stockage localStorage côté client uniquement. En Phase 2 = table
// Supabase + workflow modération (admin approve/reject avant publication
// dans le dataset officiel).
//
// Les courses utilisateur sont fusionnées dans la liste affichée sur /races
// (onglet ON ou OFF) avec un badge "Proposée par @user" cliquable.

import type { Race, RaceCategory } from "@/lib/types";
import type { OffCategory, OffRace } from "./off-races";

export const USER_RACES_KEY = "esprit_user_races";
export const USER_OFF_RACES_KEY = "esprit_user_off_races";

// ====== Profil submitter par défaut (pris depuis ME dans une vraie auth) ======
// MVP : on prend le profil local du user. Phase 2 : on lit auth.user().
export type Submitter = {
  username: string;
  displayName: string;
  avatar: string;
};

const DEFAULT_SUBMITTER: Submitter = {
  username: "traileur_demo",
  displayName: "Toi",
  avatar: "🏃",
};

export function getCurrentSubmitter(): Submitter {
  if (typeof window === "undefined") return DEFAULT_SUBMITTER;
  try {
    // On essaye de récupérer un éventuel profil custom user (Phase 2 = Supabase)
    const customRaw = window.localStorage.getItem("esprit_user_profile");
    if (customRaw) {
      const parsed = JSON.parse(customRaw);
      if (parsed?.username) {
        return {
          username: parsed.username,
          displayName: parsed.displayName || parsed.username,
          avatar: parsed.avatar || "🏃",
        };
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SUBMITTER;
}

// ====== ON races =================================================

export function loadUserRaces(): Race[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_RACES_KEY);
    return raw ? (JSON.parse(raw) as Race[]) : [];
  } catch {
    return [];
  }
}

export function saveUserRaces(races: Race[]) {
  try {
    window.localStorage.setItem(USER_RACES_KEY, JSON.stringify(races));
    window.dispatchEvent(new Event("esprit-user-races-update"));
  } catch (e) {
    console.error("[user-races] save failed", e);
  }
}

export type UserRaceDraft = {
  name: string;
  location: string;
  country: string;
  date: string; // YYYY-MM-DD
  distance: number;
  elevation: number;
  category: RaceCategory;
  itraPoints?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tagline: string;
  officialUrl?: string;
};

export function addUserRace(draft: UserRaceDraft): Race {
  const submitter = getCurrentSubmitter();
  const race: Race = {
    id: `user-${Date.now()}`,
    name: draft.name.trim(),
    location: draft.location.trim(),
    country: draft.country.trim() || "France",
    date: new Date(draft.date).toISOString(),
    distance: draft.distance,
    elevation: draft.elevation,
    category: draft.category,
    itraPoints: draft.itraPoints || 0,
    difficulty: draft.difficulty,
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    tagline: draft.tagline.trim(),
    isIconic: false,
    officialUrl: draft.officialUrl?.trim() || undefined,
    submittedBy: submitter,
  };
  const next = [...loadUserRaces(), race];
  saveUserRaces(next);
  return race;
}

// ====== OFF races ================================================

export function loadUserOffRaces(): OffRace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_OFF_RACES_KEY);
    return raw ? (JSON.parse(raw) as OffRace[]) : [];
  } catch {
    return [];
  }
}

export function saveUserOffRaces(races: OffRace[]) {
  try {
    window.localStorage.setItem(USER_OFF_RACES_KEY, JSON.stringify(races));
    window.dispatchEvent(new Event("esprit-user-off-races-update"));
  } catch (e) {
    console.error("[user-off-races] save failed", e);
  }
}

export type UserOffRaceDraft = {
  name: string;
  location: string;
  country: string;
  distance: number;
  elevation: number;
  category: OffCategory;
  tagline: string;
  vibe: string;
  soul: string;
  recordHolder?: string;
  recordTime?: string;
};

export function addUserOffRace(draft: UserOffRaceDraft): OffRace {
  const submitter = getCurrentSubmitter();
  const off: OffRace = {
    id: `user-off-${Date.now()}`,
    name: draft.name.trim(),
    location: draft.location.trim(),
    country: draft.country.trim() || "🇫🇷",
    distance: draft.distance,
    elevation: draft.elevation,
    category: draft.category,
    tagline: draft.tagline.trim(),
    vibe: draft.vibe.trim(),
    soul: draft.soul.trim(),
    recordHolder: draft.recordHolder?.trim() || undefined,
    recordTime: draft.recordTime?.trim() || undefined,
    cover: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    submittedBy: submitter,
  };
  const next = [...loadUserOffRaces(), off];
  saveUserOffRaces(next);
  return off;
}

// ====== Helpers ==================================================

export function getUserRaceById(id: string): Race | undefined {
  return loadUserRaces().find((r) => r.id === id);
}

export function deleteUserRace(id: string) {
  const next = loadUserRaces().filter((r) => r.id !== id);
  saveUserRaces(next);
}

export function deleteUserOffRace(id: string) {
  const next = loadUserOffRaces().filter((r) => r.id !== id);
  saveUserOffRaces(next);
}
