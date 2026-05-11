"use client";

// ====== NearbySpots ======
// Section dans /quests : géolocalise l'user et propose les spots d'entraînement
// les plus proches, avec GPX téléchargeables.
//
// UX :
// - Bouton "Trouver des spots à proximité" → demande géoloc navigateur
// - Si OK : affiche 3-5 spots les plus proches avec distance + GPX
// - Si refusé : affiche tous les spots populaires sans tri par distance

import { useState } from "react";
import {
  TRAINING_SPOTS,
  distanceKm,
  DIFFICULTY_META,
  TERRAIN_META,
  type TrainingSpot,
} from "@/lib/data/training-spots";

type Status = "idle" | "asking" | "ok" | "denied" | "unavailable";

export default function NearbySpots() {
  const [status, setStatus] = useState<Status>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState<string>("");

  const askGeo = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      setErr("Géolocalisation non supportée par ton navigateur.");
      return;
    }
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ok");
      },
      (e) => {
        setStatus("denied");
        setErr(
          e.code === 1
            ? "Tu as refusé l'accès à la position. On affiche les spots populaires."
            : "Impossible de récupérer ta position. On affiche les spots populaires.",
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  };

  // Tri des spots
  const spots: (TrainingSpot & { distFromMe?: number })[] = coords
    ? TRAINING_SPOTS.map((s) => ({
        ...s,
        distFromMe: distanceKm(coords.lat, coords.lng, s.lat, s.lng),
      })).sort((a, b) => (a.distFromMe ?? 0) - (b.distFromMe ?? 0))
    : TRAINING_SPOTS;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            Spots d&apos;entraînement
          </div>
          <h2 className="font-display text-lg font-black text-ink leading-tight">
            Sors d&apos;ici, va courir
          </h2>
        </div>
        {status === "ok" && (
          <span className="text-[10px] font-mono font-bold text-lime">
            ✓ Géoloc OK
          </span>
        )}
      </div>

      {/* Demande géoloc si pas encore faite */}
      {(status === "idle" || status === "asking") && (
        <button
          onClick={askGeo}
          disabled={status === "asking"}
          className="w-full rounded-2xl border-2 border-cyan/40 bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-4 text-left transition hover:border-cyan disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan text-bg text-xl card-chunky">
              📍
            </div>
            <div className="flex-1">
              <div className="font-display text-base font-black text-ink">
                {status === "asking"
                  ? "Récupération de ta position..."
                  : "Trouver des spots à proximité"}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                Active la géolocalisation pour voir les meilleurs spots autour de toi
              </div>
            </div>
            <div className="text-cyan font-display text-xl">→</div>
          </div>
        </button>
      )}

      {/* Erreur / refus */}
      {(status === "denied" || status === "unavailable") && err && (
        <div className="rounded-xl border border-amber/30 bg-amber/5 px-3 py-2 text-xs text-ink-muted">
          {err}
        </div>
      )}

      {/* Liste des spots */}
      <div className="space-y-2">
        {spots.slice(0, 6).map((spot) => {
          const diff = DIFFICULTY_META[spot.difficulty];
          const ter = TERRAIN_META[spot.terrain];
          return (
            <div
              key={spot.id}
              className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4 space-y-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base font-black text-ink leading-tight">
                    {spot.name}
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted truncate">
                    {ter.emoji} {spot.region}
                    {spot.distFromMe !== undefined && (
                      <span className="ml-1 text-cyan font-bold">
                        · {spot.distFromMe < 10
                          ? spot.distFromMe.toFixed(1)
                          : Math.round(spot.distFromMe)}{" "}
                        km
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-black border ${diff.color}`}
                >
                  {diff.label}
                </span>
              </div>

              <p className="text-xs text-ink leading-relaxed">{spot.description}</p>

              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                <span className="rounded-md bg-bg-raised px-2 py-1">
                  📏 {spot.distance} km
                </span>
                <span className="rounded-md bg-bg-raised px-2 py-1">
                  ⛰️ {spot.elevation} D+
                </span>
                <span className="rounded-md bg-bg-raised px-2 py-1">
                  ⏱️ ~{Math.floor(spot.duration / 60)}h{spot.duration % 60 ? String(spot.duration % 60).padStart(2, "0") : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                {spot.highlights.map((h) => (
                  <span key={h} className="rounded-md bg-cyan/10 text-cyan px-2 py-0.5">
                    {h}
                  </span>
                ))}
              </div>

              {/* Actions : GPX + Maps */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={spot.gpxUrl || "#"}
                  download={spot.gpxUrl ? `${spot.slug}.gpx` : undefined}
                  onClick={(e) => {
                    if (!spot.gpxUrl) {
                      e.preventDefault();
                      alert(
                        "GPX en cours de finalisation pour ce spot.\nDans une future version, tu pourras le télécharger ici.",
                      );
                    }
                  }}
                  className="rounded-xl border-2 border-cyan/40 bg-cyan/10 py-2 text-center font-mono text-xs font-black text-cyan hover:bg-cyan/15 transition"
                >
                  📥 GPX
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border-2 border-ink/15 bg-bg-card/60 py-2 text-center font-mono text-xs font-black text-ink-muted hover:text-ink hover:border-ink/30 transition"
                >
                  🗺️ Carte
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-ink-dim leading-relaxed">
        {coords
          ? "Spots triés par distance depuis ta position. Données conservées localement, jamais envoyées à un serveur tiers."
          : "Active la géoloc pour voir les spots les plus proches de toi."}
      </p>
    </section>
  );
}
