"use client";

// ====== SUPABASE LEADERBOARD SERVICE ======
// Hardening 04/09/26 : suite au rapport de test communauté (section 2), les
// classements affichaient 6 noms fictifs codés en dur, jamais alimentés par
// la vraie base — un utilisateur réel actif (ex. marco_ubaye, 705 pts ITRA)
// n'apparaissait jamais nulle part. Ce module fournit des classements réels
// basés sur `profiles` et `runs` (RLS en lecture publique sur les deux).
//
// Hardening 05/09/26 : rapport de test panel — "Amis" et "Région" restaient
// mock (noms 100% inventés, aucun rapport avec la vraie communauté). Il
// n'existe toujours pas de champ région sur les profils ni de graphe
// d'amis dédié, donc "Région" reste hors scope (l'onglet est retiré côté UI
// plutôt que de continuer à mentir). "Amis" en revanche a un équivalent
// réel déjà en base : les guildes ("un truc entre les amis et le classement
// mondial", cf. lib/data/guildes.ts) — on classe donc ici les coéquipiers
// réels de guilde(s) de l'utilisateur connecté, par km cumulés (pas de
// fenêtre "cette semaine" stockée, même limite assumée que RealGuildeDetail).

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

type DistanceRunRow = { user_id: string; distance: number | string | null };

async function fetchRunDistances(): Promise<Map<string, number>> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("runs").select("user_id, distance");
  const totals = new Map<string, number>();
  if (error) {
    console.error("[leaderboard] fetchRunDistances", error);
    return totals;
  }
  for (const r of (data ?? []) as DistanceRunRow[]) {
    if (!r.user_id) continue;
    totals.set(r.user_id, (totals.get(r.user_id) ?? 0) + (Number(r.distance) || 0));
  }
  return totals;
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

export type FriendsLeaderboard = {
  entries: LeaderboardEntry[];
  /** false si le viewer n'appartient à aucune guilde — l'UI doit alors
   *  proposer d'en rejoindre une plutôt que d'afficher une liste vide. */
  inGuilde: boolean;
};

type GuildeMemberRow = {
  guilde_id: string;
  user_id: string;
  profile: ProfileRow | null;
};

/** Classement communauté "Amis" — coéquipiers réels de la ou des guilde(s)
 *  de l'utilisateur connecté (km cumulés), au lieu de la liste fictive
 *  précédente qui ne reflétait ni ses vrais amis ni la communauté testée. */
export async function getRealFriendsLeaderboard(): Promise<FriendsLeaderboard> {
  const sb = getSupabaseBrowserClient();
  const viewerId = await getViewerId();
  if (!viewerId) return { entries: [], inGuilde: false };

  const { data: myGuildes, error: myGuildesError } = await sb
    .from("guilde_members")
    .select("guilde_id")
    .eq("user_id", viewerId);
  if (myGuildesError || !myGuildes || myGuildes.length === 0) {
    if (myGuildesError) console.error("[leaderboard] myGuildes", myGuildesError);
    return { entries: [], inGuilde: false };
  }
  const guildeIds = (myGuildes as { guilde_id: string }[]).map((g) => g.guilde_id);

  const [{ data: memberRows, error: membersError }, distances] = await Promise.all([
    sb
      .from("guilde_members")
      .select("guilde_id, user_id, profile:profiles(id, username, display_name, avatar, xp, itra_performance_index, utmb_index)")
      .in("guilde_id", guildeIds),
    fetchRunDistances(),
  ]);
  if (membersError || !memberRows) {
    console.error("[leaderboard] members", membersError);
    return { entries: [], inGuilde: true };
  }

  const byUser = new Map<string, ProfileRow>();
  for (const m of memberRows as unknown as GuildeMemberRow[]) {
    if (m.profile && !byUser.has(m.user_id)) byUser.set(m.user_id, m.profile);
  }

  const ranked = [...byUser.values()]
    .map((p) => ({ profile: p, value: Math.round(distances.get(p.id) ?? 0) }))
    .sort((a, b) => b.value - a.value);

  return {
    entries: ranked.map(({ profile, value }, i) =>
      profileToEntry(profile, i + 1, value, viewerId),
    ),
    inGuilde: true,
  };
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
