"use client";

// ====== SUPABASE LEADERBOARD SERVICE ======
// Hardening 04/09/26 : suite au rapport de test communauté (section 2), les
// classements affichaient 6 noms fictifs codés en dur, jamais alimentés par
// la vraie base — un utilisateur réel actif (ex. marco_ubaye, 705 pts ITRA)
// n'apparaissait jamais nulle part. Ce module fournit des classements réels
// basés sur `profiles` et `runs` (RLS en lecture publique sur les deux).
//
// Scope assumé pour cette passe : le sous-onglet "Monde" (D+ cumulé) et les
// classements officiels ITRA/UTMB passent en données réelles. "Amis" et
// "Région" restent mock — il n'existe pas encore de graphe social ni de
// champ région sur les profils, donc rien de réel à brancher là pour l'instant.

import type { LeaderboardEntry } from "@/lib/types";
import { levelFromXp, titleForLevel } from "@/lib/types";
import { getSupabaseBrowserClient } from "./client";
import { getViewerId } from "./messaging";

type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  avatar: string | null;
  xp: number | null;
  itra_performance_index: number | null;
  utmb_index: number | null;
};

type RunRow = {
  user_id: string;
  elevation: number | null;
};

async function fetchProfiles(): Promise<ProfileRow[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("profiles")
    .select("id, username, display_name, avatar, xp, itra_performance_index, utmb_index");
  if (error) {
    console.error("[leaderboard] fetchProfiles", error);
    return [];
  }
  return (data ?? []) as ProfileRow[];
}

async function fetchRuns(): Promise<RunRow[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("runs").select("user_id, elevation");
  if (error) {
    console.error("[leaderboard] fetchRuns", error);
    return [];
  }
  return (data ?? []) as RunRow[];
}

function profileToEntry(
  p: ProfileRow,
  rank: number,
  value: number,
  viewerId: string,
): LeaderboardEntry {
  const level = levelFromXp(p.xp ?? 0);
  return {
    rank,
    user: {
      id: p.id,
      username: p.username,
      avatar: p.avatar || "🏃",
      level,
      title: titleForLevel(level).title,
    },
    value,
    change: 0, // pas d'historique de classement suivi pour l'instant
    isYou: p.id === viewerId,
  };
}

/** Classement communauté "Monde" — D+ cumulé réel (somme de `runs.elevation`
 *  par utilisateur), sur les vrais profils Supabase. Remplace la liste
 *  figée de 4 comptes fictifs. */
export async function getRealWorldElevationLeaderboard(): Promise<LeaderboardEntry[]> {
  const [profiles, runs, viewerId] = await Promise.all([
    fetchProfiles(),
    fetchRuns(),
    getViewerId(),
  ]);
  const totals = new Map<string, number>();
  for (const r of runs) {
    if (!r.user_id) continue;
    totals.set(r.user_id, (totals.get(r.user_id) ?? 0) + (r.elevation ?? 0));
  }
  const byProfile = profiles
    .filter((p) => (totals.get(p.id) ?? 0) > 0)
    .map((p) => ({ profile: p, value: totals.get(p.id) ?? 0 }))
    .sort((a, b) => b.value - a.value);
  return byProfile.map(({ profile, value }, i) =>
    profileToEntry(profile, i + 1, value, viewerId),
  );
}

/** Classements officiels ITRA / UTMB : les entrées "légendes" (les 10
 *  premières de la data mock, valeurs réelles d'athlètes pros) restent en
 *  horizon, mélangées et re-triées avec les vrais profils Supabase ayant un
 *  index renseigné — au lieu des faux comptes à des rangs ~4000-7000. */
export async function getRealOfficialLeaderboard(
  metric: "itra_performance_index" | "utmb_index",
  legends: LeaderboardEntry[],
): Promise<LeaderboardEntry[]> {
  const [profiles, viewerId] = await Promise.all([fetchProfiles(), getViewerId()]);
  const real = profiles.filter((p) => p[metric] != null);

  type Item =
    | { kind: "legend"; entry: LeaderboardEntry; value: number }
    | { kind: "real"; profile: ProfileRow; value: number };

  const combined: Item[] = [
    ...legends.map((e): Item => ({ kind: "legend", entry: e, value: e.value })),
    ...real.map((p): Item => ({ kind: "real", profile: p, value: p[metric] as number })),
  ].sort((a, b) => b.value - a.value);

  return combined.map((item, i) =>
    item.kind === "legend"
      ? { ...item.entry, rank: i + 1 }
      : profileToEntry(item.profile, i + 1, item.value, viewerId),
  );
}
