"use client";

// ====== /spots — Spots d'entraînement à proximité ======
// Carte Leaflet interactive avec tracés GPX, géoloc, upload trail user.

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  TRAINING_SPOTS,
  distanceKm,
  DIFFICULTY_META,
  TERRAIN_META,
  type TrainingSpot,
  type SpotDifficulty,
} from "@/lib/data/training-spots";
import UploadGpx, { loadUserSpots, deleteUserSpot } from "@/components/spots/UploadGpx";
import type { UserSpot } from "@/components/spots/SpotsMap";
import DiscoveryBannerClient from "@/components/layout/DiscoveryBannerClient";

const SpotsMap = dynamic(() => import("@/components/spots/SpotsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] w-full rounded-2xl border-2 border-ink/10 bg-bg-card animate-pulse flex items-center justify-center text-ink-dim text-xs font-mono">
      Chargement de la carte…
    </div>
  ),
});

type GeoStatus = "idle" | "asking" | "ok" | "denied" | "unavailable";

// Estime le temps de trajet en voiture pour atteindre un spot
// (vitesse moyenne 70 km/h tenant compte d'un mix autoroute/départementale).
const AVG_DRIVING_SPEED_KMH = 70;
function estimateDriveTimeMin(distanceKm: number): number {
  return Math.round((distanceKm / AVG_DRIVING_SPEED_KMH) * 60);
}

export default function SpotsPage() {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [userSpots, setUserSpots] = useState<UserSpot[]>([]);
  const [filterUnder1h, setFilterUnder1h] = useState(false);
  const [filterNear30km, setFilterNear30km] = useState(false);
  const [diffFilter, setDiffFilter] = useState<SpotDifficulty | "all">("all");

  // Géoloc auto au mount
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ok");
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  // Charge user spots depuis localStorage + listen aux updates
  useEffect(() => {
    setUserSpots(loadUserSpots());
    const refresh = () => setUserSpots(loadUserSpots());
    window.addEventListener("esprit-user-spots-update", refresh);
    return () => window.removeEventListener("esprit-user-spots-update", refresh);
  }, []);

  // Tri spots par distance si géoloc OK + temps de trajet estimé
  type SpotWithDist = TrainingSpot & { distFromMe?: number; driveMin?: number };
  const allSpots: SpotWithDist[] = coords
    ? TRAINING_SPOTS.map((s) => {
        const d = distanceKm(coords.lat, coords.lng, s.lat, s.lng);
        return {
          ...s,
          distFromMe: d,
          driveMin: estimateDriveTimeMin(d),
        };
      }).sort((a, b) => (a.distFromMe ?? 0) - (b.distFromMe ?? 0))
    : TRAINING_SPOTS.map((s) => ({ ...s }));

  // Filtres : "< 1h voiture" OU "< 30 km vol d'oiseau" (transports en commun, vélo)
  // + difficulté
  const spots: SpotWithDist[] = allSpots
    .filter((s) =>
      filterUnder1h && coords ? (s.driveMin ?? Infinity) <= 60 : true,
    )
    .filter((s) =>
      filterNear30km && coords ? (s.distFromMe ?? Infinity) <= 30 : true,
    )
    .filter((s) => (diffFilter === "all" ? true : s.difficulty === diffFilter));
  const filteredOutCount = allSpots.length - spots.length;

  // Quand on clique "Voir sur la carte", on sélectionne le spot et on scroll en haut
  const showOnMap = (slugOrId: string) => {
    setSelectedSlug(slugOrId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-cyan transition"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
            Cartographie
          </div>
          <h1 className="font-display text-lg font-black leading-none">Spots</h1>
        </div>
        <div className="w-9" />
      </header>

      <DiscoveryBannerClient />

      {/* Hero compact */}
      <section className="rounded-2xl border-2 border-cyan/30 bg-gradient-to-br from-cyan/10 via-bg-card to-bg p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">📍</div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
              Les sentiers près de chez toi
            </div>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              {status === "asking"
                ? "Récupération de ta position…"
                : coords
                ? "Spots triés par distance. Touche un spot pour voir le tracé sur la carte. GPX dispo pour ta montre."
                : status === "denied"
                ? "Géolocalisation refusée — affichage des spots populaires de France."
                : "Active la géoloc dans ton navigateur pour voir les spots les plus proches."}
            </p>
            {selectedSlug && (
              <button
                onClick={() => setSelectedSlug(null)}
                className="mt-2 text-[10px] font-mono text-cyan hover:underline"
              >
                ← Effacer le tracé sélectionné
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Carte interactive Leaflet — affiche le tracé du spot sélectionné si selectedSlug */}
      <SpotsMap
        spots={TRAINING_SPOTS}
        userSpots={userSpots}
        userCoords={coords}
        selectedSlug={selectedSlug}
        height="340px"
      />

      {/* Upload trail perso */}
      <UploadGpx onAdded={(s) => showOnMap(s.id)} />

      {/* Liste des trails uploadés */}
      {userSpots.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Tes trails persos · {userSpots.length}
          </div>
          {userSpots.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-xl border-2 border-lime/30 bg-lime/5 p-3"
            >
              <div className="text-xl">🥾</div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm font-black text-ink truncate">
                  {s.name}
                </div>
                <div className="text-[10px] font-mono text-ink-muted">
                  {s.distance.toFixed(1)} km · {Math.round(s.elevation)} D+
                </div>
              </div>
              <button
                onClick={() => showOnMap(s.id)}
                className="rounded-md bg-lime/20 px-2 py-1 text-[10px] font-mono font-black text-lime hover:bg-lime/30"
              >
                🗺️ Carte
              </button>
              <button
                onClick={() => {
                  if (confirm("Supprimer ce trail ?")) {
                    deleteUserSpot(s.id);
                    setUserSpots(loadUserSpots());
                    if (selectedSlug === s.id) setSelectedSlug(null);
                  }
                }}
                className="rounded-md p-1 text-ink-dim hover:text-mythic"
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Liste spots officiels */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            {coords ? "Près de toi" : "Spots populaires"}
          </div>
          {/* Filtres distance — uniquement si géoloc OK */}
          {coords && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterNear30km((v) => !v)}
                className={`rounded-full border-2 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider transition ${
                  filterNear30km
                    ? "border-violet bg-violet text-bg shadow-md"
                    : "border-violet/30 bg-violet/5 text-violet hover:bg-violet/10"
                }`}
                aria-pressed={filterNear30km}
                title="À moins de 30 km à vol d'oiseau (transports, vélo, RER)"
              >
                {filterNear30km ? "✓ " : ""}📍 &lt; 30km
              </button>
              <button
                onClick={() => setFilterUnder1h((v) => !v)}
                className={`rounded-full border-2 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider transition ${
                  filterUnder1h
                    ? "border-cyan bg-cyan text-bg shadow-md"
                    : "border-cyan/30 bg-cyan/5 text-cyan hover:bg-cyan/10"
                }`}
                aria-pressed={filterUnder1h}
                title="À moins d'1h en voiture (vitesse moy 70 km/h)"
              >
                {filterUnder1h ? "✓ " : ""}🚗 &lt; 1h
              </button>
            </div>
          )}
        </div>
        {/* Filtres difficulté — chips horizontales */}
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          <button
            onClick={() => setDiffFilter("all")}
            className={`shrink-0 rounded-full border-2 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider transition ${
              diffFilter === "all"
                ? "border-ink bg-ink text-bg shadow-md"
                : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
            }`}
            aria-pressed={diffFilter === "all"}
          >
            Toutes
          </button>
          {(Object.keys(DIFFICULTY_META) as SpotDifficulty[]).map((d) => {
            const meta = DIFFICULTY_META[d];
            const active = diffFilter === d;
            return (
              <button
                key={d}
                onClick={() => setDiffFilter(active ? "all" : d)}
                className={`shrink-0 rounded-full border-2 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider transition ${
                  active
                    ? `${meta.color} shadow-md scale-105`
                    : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
                }`}
                aria-pressed={active}
              >
                {active ? "✓ " : ""}
                {meta.label}
              </button>
            );
          })}
        </div>

        {(filterUnder1h || filterNear30km || diffFilter !== "all") && (
          <p className="text-[11px] font-mono text-ink-muted">
            {spots.length} spot{spots.length > 1 ? "s" : ""} affiché
            {spots.length > 1 ? "s" : ""}
            {filterNear30km && coords ? " · à moins de 30 km" : ""}
            {filterUnder1h && coords ? " · à moins d'1h en voiture" : ""}
            {diffFilter !== "all" ? ` · niveau ${DIFFICULTY_META[diffFilter].label.toLowerCase()}` : ""}
            {filteredOutCount > 0 ? ` · ${filteredOutCount} masqué${filteredOutCount > 1 ? "s" : ""}` : ""}
          </p>
        )}
        <div className="space-y-2">
          {spots.map((spot) => {
            const diff = DIFFICULTY_META[spot.difficulty];
            const ter = TERRAIN_META[spot.terrain];
            const isSelected = selectedSlug === spot.slug;
            return (
              <div
                key={spot.id}
                className={`rounded-2xl border-2 p-4 space-y-2 transition ${
                  isSelected
                    ? "border-cyan bg-cyan/5 shadow-glow-cyan"
                    : "border-ink/10 bg-bg-card/60"
                }`}
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
                      {spot.driveMin !== undefined && (
                        <span className="ml-1 text-ink-dim">
                          · 🚗{" "}
                          {spot.driveMin < 60
                            ? `${spot.driveMin}min`
                            : `${Math.floor(spot.driveMin / 60)}h${(spot.driveMin % 60).toString().padStart(2, "0")}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-black border ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>

                <p className="text-xs text-ink leading-relaxed">{spot.description}</p>

                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised px-2 py-1">📏 {spot.distance} km</span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">⛰️ {spot.elevation} D+</span>
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

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`/api/gpx/${spot.slug}`}
                    download={`${spot.slug}.gpx`}
                    className="rounded-xl border-2 border-cyan/40 bg-cyan/10 py-2 text-center font-mono text-xs font-black text-cyan hover:bg-cyan/15 transition"
                  >
                    📥 GPX
                  </a>
                  <button
                    onClick={() => showOnMap(spot.slug)}
                    className={`rounded-xl border-2 py-2 text-center font-mono text-xs font-black transition ${
                      isSelected
                        ? "border-cyan bg-cyan text-bg"
                        : "border-ink/15 bg-bg-card/60 text-ink-muted hover:text-ink hover:border-ink/30"
                    }`}
                  >
                    🗺️ {isSelected ? "Tracé visible ↑" : "Voir sur la carte"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Coach IA */}
      <section className="rounded-2xl border-2 border-violet/40 bg-gradient-to-br from-violet/10 via-bg-card to-bg p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🧠</div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
              Tu cherches un plan d&apos;entraînement ?
            </div>
            <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">
              Les blocs spécifiques (charge, affûtage, récup) sont générés par
              le Coach IA en fonction de ton objectif.
            </p>
            <Link
              href="/coach"
              className="mt-2 inline-block rounded-lg bg-violet px-3 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-bg hover:scale-105 transition"
            >
              Génère ton plan →
            </Link>
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] text-ink-dim leading-relaxed">
        Spots issus du domaine public · cartographie OpenStreetMap. Tes
        coordonnées GPS et trails uploadés ne sont jamais envoyés à un serveur tiers.
      </p>
    </main>
  );
}
