"use client";

// ====== UploadGpx ======
// Permet à l'utilisateur d'uploader son propre fichier GPX (Strava, Garmin,
// Komoot export). Parsé côté client, persisté en localStorage pour ce device.
// Phase 2 : sync Supabase pour partager avec la communauté.

import { useRef, useState } from "react";
import type { UserSpot } from "./SpotsMap";

const KEY = "esprit_user_spots";

export function loadUserSpots(): UserSpot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserSpots(list: UserSpot[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("esprit-user-spots-update"));
  } catch (e) {
    console.error("[UploadGpx] save failed", e);
  }
}

export function deleteUserSpot(id: string) {
  const list = loadUserSpots();
  const next = list.filter((s) => s.id !== id);
  saveUserSpots(next);
}

// Parse minimal d'un GPX → coords + nom + distance/D+ approximatifs
function parseGpx(xml: string, fallbackName: string): UserSpot | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  // Vérifie qu'on a bien un GPX valide
  if (doc.querySelector("parsererror")) return null;
  if (!doc.querySelector("gpx")) return null;

  const trkpts = Array.from(doc.querySelectorAll("trkpt"));
  if (trkpts.length < 2) {
    // Fallback : peut-être c'est juste un waypoint, pas un track
    const wpts = Array.from(doc.querySelectorAll("wpt"));
    if (wpts.length === 0) return null;
    const first = wpts[0];
    const lat = parseFloat(first.getAttribute("lat") || "0");
    const lng = parseFloat(first.getAttribute("lon") || "0");
    return {
      id: `user-${Date.now()}`,
      name: doc.querySelector("name")?.textContent || fallbackName,
      lat,
      lng,
      distance: 0,
      elevation: 0,
      points: [[lat, lng]],
    };
  }

  const points: [number, number][] = trkpts.map((p) => [
    parseFloat(p.getAttribute("lat") || "0"),
    parseFloat(p.getAttribute("lon") || "0"),
  ]);

  // Distance haversine entre points consécutifs
  const R = 6371;
  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    const [lat1, lng1] = points[i - 1];
    const [lat2, lng2] = points[i];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    distance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Élévation : somme des montées (dénivelé positif)
  let elevation = 0;
  const eles = trkpts.map((p) => {
    const e = p.querySelector("ele")?.textContent;
    return e ? parseFloat(e) : null;
  });
  for (let i = 1; i < eles.length; i++) {
    const a = eles[i - 1];
    const b = eles[i];
    if (a !== null && b !== null && b > a) {
      elevation += b - a;
    }
  }

  // Nom du tracé
  const name =
    doc.querySelector("trk > name")?.textContent ||
    doc.querySelector("metadata > name")?.textContent ||
    fallbackName;

  // Centre approximatif = milieu du tracé
  const midIdx = Math.floor(points.length / 2);
  const [lat, lng] = points[midIdx];

  return {
    id: `user-${Date.now()}`,
    name,
    lat,
    lng,
    distance,
    elevation,
    points,
  };
}

export default function UploadGpx({
  onAdded,
}: {
  onAdded?: (spot: UserSpot) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const text = await file.text();
      const fallbackName = file.name.replace(/\.gpx$/i, "");
      const spot = parseGpx(text, fallbackName);
      if (!spot) {
        setErr("GPX non reconnu. Essaie un export depuis Strava / Garmin / Komoot.");
        return;
      }
      const list = loadUserSpots();
      list.push({ ...spot, gpxText: text });
      saveUserSpots(list);
      onAdded?.(spot);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur lecture du fichier");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-lime/40 bg-gradient-to-br from-lime/10 via-bg-card to-bg p-4 transition hover:border-lime disabled:opacity-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime text-bg text-lg card-chunky">
          📤
        </div>
        <div className="text-left flex-1">
          <div className="font-display text-sm font-black text-ink">
            {busy ? "Lecture du GPX…" : "Ajoute ton trail perso"}
          </div>
          <div className="text-[10px] font-mono text-ink-muted mt-0.5">
            Upload un .gpx depuis Strava / Garmin / Komoot · privé sur ton tel
          </div>
        </div>
        <span className="text-lime font-display text-xl">→</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".gpx,application/gpx+xml,application/xml,text/xml"
        onChange={onFile}
        className="hidden"
      />
      {err && (
        <div className="rounded-lg border border-mythic/30 bg-mythic/5 px-3 py-2 text-[11px] text-mythic font-mono">
          {err}
        </div>
      )}
    </div>
  );
}
