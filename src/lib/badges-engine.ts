// ====== BADGES ENGINE (pur, sans dépendance Supabase) ======
// Calcule les badges réellement débloqués à partir de sorties (distance/D+
// par sortie) et d'un streak, pour rester utilisable aussi bien côté client
// (lib/supabase/badges.ts) que côté serveur (lib/supabase/badges-server.ts).
//
// Seuils dérivés des descriptions de chaque badge dans lib/data/badges.ts.
// Seules les catégories objectivement calculables à partir du schéma actuel
// (`runs.distance`, `runs.elevation`, `profiles.streak`) sont dérivées — les
// badges course/social/découverte/skill et les badges "sommet 3000/4000m"
// ou "cumul D+ sur un mois" restent verrouillés par défaut : on n'a pas la
// donnée pour les valider honnêtement, mieux vaut sous-déclarer que mentir.

export const DISTANCE_KM_THRESHOLDS: Record<string, number> = {
  "first-10k": 10,
  "half-marathon": 21.1,
  marathon: 42.195,
  "fifty-k": 50,
  "hundred-k": 100,
  "hundred-miler": 161,
};

export const SINGLE_RUN_ELEVATION_M_THRESHOLDS: Record<string, number> = {
  "mile-high": 1609,
  "mont-blanc-equivalent": 4810,
  everesting: 8848,
};

export const CUMULATIVE_ELEVATION_M_THRESHOLDS: Record<string, number> = {
  "first-col": 1000,
};

export const STREAK_DAYS_THRESHOLDS: Record<string, number> = {
  "streak-7": 7,
  "streak-30": 30,
  "streak-100": 100,
  "streak-365": 365,
};

export type RunForBadges = {
  distance: number | string | null;
  elevation: number | null;
};

export function computeUnlockedBadges(
  runs: RunForBadges[],
  streak: number | null | undefined
): Set<string> {
  const unlocked = new Set<string>();

  const maxDistance = runs.reduce(
    (max, r) => Math.max(max, Number(r.distance) || 0),
    0
  );
  const maxSingleElevation = runs.reduce(
    (max, r) => Math.max(max, Number(r.elevation) || 0),
    0
  );
  const cumulativeElevation = runs.reduce(
    (sum, r) => sum + (Number(r.elevation) || 0),
    0
  );
  const streakDays = streak ?? 0;

  for (const [id, threshold] of Object.entries(DISTANCE_KM_THRESHOLDS)) {
    if (maxDistance >= threshold) unlocked.add(id);
  }
  for (const [id, threshold] of Object.entries(
    SINGLE_RUN_ELEVATION_M_THRESHOLDS
  )) {
    if (maxSingleElevation >= threshold) unlocked.add(id);
  }
  for (const [id, threshold] of Object.entries(
    CUMULATIVE_ELEVATION_M_THRESHOLDS
  )) {
    if (cumulativeElevation >= threshold) unlocked.add(id);
  }
  for (const [id, threshold] of Object.entries(STREAK_DAYS_THRESHOLDS)) {
    if (streakDays >= threshold) unlocked.add(id);
  }

  return unlocked;
}
