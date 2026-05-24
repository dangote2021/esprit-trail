// ====== hr-zones.ts ======
// Zones de fréquence cardiaque personnalisées (panel test Karim : "Z3 = quelle
// FC pour MOI ?"). Méthode de Karvonen (FC de réserve) : plus juste que le
// simple pourcentage de FC max car elle tient compte de la FC de repos.
//
// FCR (réserve) = FCmax - FCrepos
// FC cible zone X = FCrepos + (FCR × %zone)
//
// Stockage localStorage : esprit_hr = { max, rest }.

const KEY = "esprit_hr";

export type HrData = { max: number; rest: number };

export type HrZone = {
  zone: 1 | 2 | 3 | 4 | 5;
  label: string;
  /** Bornes en % de FC de réserve */
  pctLow: number;
  pctHigh: number;
  minBpm: number;
  maxBpm: number;
  usage: string;
};

export function loadHr(): HrData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.max === "number" &&
      typeof parsed?.rest === "number" &&
      parsed.max > parsed.rest &&
      parsed.max <= 230 &&
      parsed.rest >= 25
    ) {
      return { max: parsed.max, rest: parsed.rest };
    }
  } catch {/* ignore */}
  return null;
}

export function saveHr(data: HrData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("esprit:hr", { detail: data }));
  } catch {/* ignore */}
}

export function clearHr() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("esprit:hr", { detail: null }));
  } catch {/* ignore */}
}

const ZONE_DEF: { zone: 1 | 2 | 3 | 4 | 5; label: string; lo: number; hi: number; usage: string }[] = [
  { zone: 1, label: "Z1 · Récup", lo: 0.5, hi: 0.6, usage: "Footing très lent, échauffement, récup active" },
  { zone: 2, label: "Z2 · Endurance", lo: 0.6, hi: 0.7, usage: "Endurance fondamentale, sorties longues — tu peux parler" },
  { zone: 3, label: "Z3 · Tempo", lo: 0.7, hi: 0.8, usage: "Allure soutenue, tempo, seuil bas — parler devient dur" },
  { zone: 4, label: "Z4 · Seuil", lo: 0.8, hi: 0.9, usage: "Fractionné, seuil, côtes — effort intense, phrases courtes" },
  { zone: 5, label: "Z5 · VMA", lo: 0.9, hi: 1.0, usage: "VMA, sprints — effort maximal, pas un mot" },
];

/** Calcule les 5 zones FC via Karvonen. */
export function computeZones(hr: HrData): HrZone[] {
  const reserve = hr.max - hr.rest;
  return ZONE_DEF.map((z) => ({
    zone: z.zone,
    label: z.label,
    pctLow: z.lo,
    pctHigh: z.hi,
    minBpm: Math.round(hr.rest + reserve * z.lo),
    maxBpm: Math.round(hr.rest + reserve * z.hi),
    usage: z.usage,
  }));
}

/** Mappe l'intensité d'une séance vers la zone FC dominante. */
export function zoneForIntensity(intensity: "low" | "moderate" | "high"): 1 | 2 | 3 | 4 {
  if (intensity === "low") return 2;
  if (intensity === "moderate") return 3;
  return 4;
}

/** Plage BPM d'une séance selon son intensité, ou null si pas de data FC. */
export function bpmRangeForIntensity(
  hr: HrData | null,
  intensity: "low" | "moderate" | "high",
): { min: number; max: number; zone: number } | null {
  if (!hr) return null;
  const zones = computeZones(hr);
  const targetZone = zoneForIntensity(intensity);
  const z = zones.find((zz) => zz.zone === targetZone);
  if (!z) return null;
  return { min: z.minBpm, max: z.maxBpm, zone: targetZone };
}
