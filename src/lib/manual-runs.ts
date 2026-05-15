"use client";

// ====== Manual runs store (localStorage) ======
// Stocke les sorties saisies manuellement OU enregistrées via le tracker
// natif Esprit Trail (chrono + GPS basique). En attendant le backend Supabase
// pour les runs, c'est entièrement local.

export type ManualRun = {
  id: string;
  date: string; // ISO
  title: string;
  location?: string;
  distance: number; // km
  elevation: number; // m D+
  duration: number; // secondes
  terrain?: "flat" | "hilly" | "mountain" | "alpine" | "technical";
  source: "manual" | "tracker";
  notes?: string;
};

const KEY = "esprit_manual_runs";

export function loadManualRuns(): ManualRun[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveManualRun(run: ManualRun) {
  if (typeof window === "undefined") return;
  const all = loadManualRuns();
  all.unshift(run);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

export function deleteManualRun(id: string) {
  if (typeof window === "undefined") return;
  const all = loadManualRuns().filter((r) => r.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function guessTerrain(distance: number, elevation: number): ManualRun["terrain"] {
  if (distance <= 0) return "flat";
  const dpkm = elevation / distance;
  if (dpkm > 80) return "alpine";
  if (dpkm > 50) return "mountain";
  if (dpkm > 20) return "hilly";
  return "flat";
}
