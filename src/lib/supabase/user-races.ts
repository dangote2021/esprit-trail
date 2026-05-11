"use client";

// ====== SUPABASE USER-SUBMITTED RACES ======
// Couche d'accès Supabase pour les courses proposées par la communauté.
// Lecture publique → tout le monde voit les courses (anon ou authentifié).
// Écriture → authentifié uniquement, submitter_id = soi.
//
// Fallback : si Supabase pas dispo, on retombe sur le localStorage existant
// (déjà géré dans src/lib/data/user-races.ts).

import type { Race, RaceCategory } from "@/lib/types";
import type { OffCategory, OffRace } from "@/lib/data/off-races";
import {
  loadUserRaces as loadLocal,
  loadUserOffRaces as loadOffLocal,
  type UserRaceDraft,
  type UserOffRaceDraft,
  type Submitter,
} from "@/lib/data/user-races";
import { getSupabaseBrowserClient } from "./client";

async function getUserId(): Promise<string | null> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data } = await sb.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function getMyProfile(): Promise<Submitter | null> {
  const sb = getSupabaseBrowserClient();
  const uid = await getUserId();
  if (!uid) return null;
  const { data } = await sb
    .from("profiles")
    .select("username, display_name, avatar")
    .eq("id", uid)
    .single();
  if (!data) return null;
  return {
    username: data.username,
    displayName: data.display_name,
    avatar: data.avatar || "🏃",
  };
}

type SbRaceRow = {
  id: string;
  submitter_id: string;
  name: string;
  tagline: string;
  location: string;
  country: string;
  date: string;
  distance: number;
  elevation: number;
  category: RaceCategory;
  itra_points: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  official_url: string | null;
  hero_image: string | null;
  status: string;
  submitter: {
    username: string;
    display_name: string;
    avatar: string | null;
  } | null;
};

type SbOffRaceRow = {
  id: string;
  submitter_id: string;
  name: string;
  tagline: string;
  location: string;
  country: string;
  distance: number;
  elevation: number;
  category: OffCategory;
  vibe: string;
  soul: string | null;
  record_holder: string | null;
  record_time: string | null;
  cover: string | null;
  status: string;
  submitter: {
    username: string;
    display_name: string;
    avatar: string | null;
  } | null;
};

function rowToRace(r: SbRaceRow): Race {
  return {
    id: r.id,
    name: r.name,
    location: r.location,
    country: r.country,
    date: r.date,
    distance: r.distance,
    elevation: r.elevation,
    category: r.category,
    itraPoints: r.itra_points,
    difficulty: r.difficulty,
    heroImage:
      r.hero_image ||
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    tagline: r.tagline,
    isIconic: false,
    officialUrl: r.official_url ?? undefined,
    submittedBy: r.submitter
      ? {
          username: r.submitter.username,
          displayName: r.submitter.display_name,
          avatar: r.submitter.avatar || "🏃",
        }
      : undefined,
  };
}

function rowToOffRace(r: SbOffRaceRow): OffRace {
  return {
    id: r.id,
    name: r.name,
    tagline: r.tagline,
    location: r.location,
    country: r.country,
    distance: r.distance,
    elevation: r.elevation,
    category: r.category,
    vibe: r.vibe,
    soul: r.soul ?? r.vibe,
    recordHolder: r.record_holder ?? undefined,
    recordTime: r.record_time ?? undefined,
    cover:
      r.cover ||
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
    submittedBy: r.submitter
      ? {
          username: r.submitter.username,
          displayName: r.submitter.display_name,
          avatar: r.submitter.avatar || "🏃",
        }
      : undefined,
  };
}

// ============================================================================
// LECTURE — publique (anon ou authentifié)
// ============================================================================

export async function listUserRaces(): Promise<Race[]> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data, error } = await sb
      .from("user_races")
      .select(
        `*, submitter:profiles!user_races_submitter_id_fkey(username, display_name, avatar)`,
      )
      .eq("status", "published")
      .order("date", { ascending: true })
      .limit(500);
    if (error) {
      console.warn("[user-races] fallback localStorage", error.message);
      return loadLocal();
    }
    return (data || []).map(rowToRace);
  } catch {
    return loadLocal();
  }
}

export async function listUserOffRaces(): Promise<OffRace[]> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data, error } = await sb
      .from("user_off_races")
      .select(
        `*, submitter:profiles!user_off_races_submitter_id_fkey(username, display_name, avatar)`,
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.warn("[user-off-races] fallback localStorage", error.message);
      return loadOffLocal();
    }
    return (data || []).map(rowToOffRace);
  } catch {
    return loadOffLocal();
  }
}

// ============================================================================
// ÉCRITURE — authentifié uniquement
// ============================================================================

export async function submitUserRace(
  draft: UserRaceDraft,
): Promise<Race | null> {
  const uid = await getUserId();
  if (!uid) return null;
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("user_races")
    .insert({
      submitter_id: uid,
      name: draft.name,
      tagline: draft.tagline,
      location: draft.location,
      country: draft.country || "France",
      date: new Date(draft.date).toISOString(),
      distance: draft.distance,
      elevation: draft.elevation,
      category: draft.category,
      itra_points: draft.itraPoints || 0,
      difficulty: draft.difficulty,
      official_url: draft.officialUrl || null,
    })
    .select(
      `*, submitter:profiles!user_races_submitter_id_fkey(username, display_name, avatar)`,
    )
    .single();
  if (error || !data) {
    console.error("[user-races] submit failed", error);
    return null;
  }
  // Notify les autres tabs / composants
  window.dispatchEvent(new Event("esprit-user-races-update"));
  return rowToRace(data as unknown as SbRaceRow);
}

export async function submitUserOffRace(
  draft: UserOffRaceDraft,
): Promise<OffRace | null> {
  const uid = await getUserId();
  if (!uid) return null;
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("user_off_races")
    .insert({
      submitter_id: uid,
      name: draft.name,
      tagline: draft.tagline,
      location: draft.location,
      country: draft.country || "🇫🇷",
      distance: draft.distance,
      elevation: draft.elevation,
      category: draft.category,
      vibe: draft.vibe,
      soul: draft.soul || draft.vibe,
      record_holder: draft.recordHolder || null,
      record_time: draft.recordTime || null,
    })
    .select(
      `*, submitter:profiles!user_off_races_submitter_id_fkey(username, display_name, avatar)`,
    )
    .single();
  if (error || !data) {
    console.error("[user-off-races] submit failed", error);
    return null;
  }
  window.dispatchEvent(new Event("esprit-user-off-races-update"));
  return rowToOffRace(data as unknown as SbOffRaceRow);
}

// ============================================================================
// WISHLIST côté server
// ============================================================================

export async function loadServerWishlist(): Promise<string[]> {
  const uid = await getUserId();
  if (!uid) return [];
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("user_wishlist_races")
    .select("race_id")
    .eq("user_id", uid);
  if (error || !data) return [];
  return data.map((r) => r.race_id);
}

export async function toggleServerWishlist(
  raceId: string,
  add: boolean,
): Promise<boolean> {
  const uid = await getUserId();
  if (!uid) return false;
  const sb = getSupabaseBrowserClient();
  if (add) {
    const { error } = await sb
      .from("user_wishlist_races")
      .upsert({ user_id: uid, race_id: raceId });
    if (error) return false;
  } else {
    const { error } = await sb
      .from("user_wishlist_races")
      .delete()
      .eq("user_id", uid)
      .eq("race_id", raceId);
    if (error) return false;
  }
  return true;
}

export { getMyProfile };
