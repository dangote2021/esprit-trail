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
  /** Google-encoded polyline (depuis le tracker GPS). Optionnel — les
   *  saisies manuelles n'en ont pas. */
  polyline?: string;
};

/**
 * Met à jour une sortie manuelle existante. Remplace l'entrée dans
 * localStorage en gardant l'ordre. No-op si l'id n'existe pas.
 */
export function updateManualRun(id: string, patch: Partial<Omit<ManualRun, "id">>) {
  if (typeof window === "undefined") return;
  const all = loadManualRuns();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return;
  all[idx] = { ...all[idx], ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function findManualRun(id: string): ManualRun | undefined {
  return loadManualRuns().find((r) => r.id === id);
}

/**
 * Encode une suite de points GPS au format Google polyline.
 * Algo : https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function encodePolyline(points: { lat: number; lng: number }[]): string {
  let out = "";
  let lastLat = 0;
  let lastLng = 0;
  for (const p of points) {
    const lat = Math.round(p.lat * 1e5);
    const lng = Math.round(p.lng * 1e5);
    out += encodeNumber(lat - lastLat) + encodeNumber(lng - lastLng);
    lastLat = lat;
    lastLng = lng;
  }
  return out;
}

function encodeNumber(num: number): string {
  let sgn_num = num << 1;
  if (num < 0) sgn_num = ~sgn_num;
  let encoded = "";
  while (sgn_num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (sgn_num & 0x1f)) + 63);
    sgn_num >>= 5;
  }
  encoded += String.fromCharCode(sgn_num + 63);
  return encoded;
}

/**
 * Decode une polyline Google en suite de [lat, lng]. Utilisé pour rendre
 * la trace sur le visuel de partage.
 */
export function decodePolyline(str: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < str.length) {
    let b = 0;
    let shift = 0;
    let result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat * 1e-5, lng * 1e-5]);
  }
  return points;
}

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
