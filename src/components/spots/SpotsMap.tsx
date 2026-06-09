"use client";

// ====== SpotsMap — carte interactive Leaflet avec tracés ======
// Affiche tous les spots officiels + spots user (uploadés) sur une carte OSM.
// Si selectedSlug fourni → fetch le GPX, dessine la polyline sur la carte,
// fitBounds dessus.

import { useEffect, useRef } from "react";
import type { TrainingSpot } from "@/lib/data/training-spots";

export type UserSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  elevation: number;
  /** GPX raw text (parsé côté client à l'upload) */
  gpxText?: string;
  /** Points lat/lng extraits du GPX */
  points?: [number, number][];
};

interface Props {
  spots: TrainingSpot[];
  userSpots?: UserSpot[];
  userCoords?: { lat: number; lng: number } | null;
  selectedSlug?: string | null;
  height?: string;
}

export default function SpotsMap({
  spots,
  userSpots = [],
  userCoords,
  selectedSlug,
  height = "320px",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);

  // Init de la carte (une seule fois)
  useEffect(() => {
    if (!containerRef.current) return;
    let cleanup: (() => void) | undefined;

    (async () => {
      // Inject CSS Leaflet via <link> dans le head
      const CSS_HREF = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
      if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS_HREF;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;
      LRef.current = L;

      // Fix de l'icône par défaut (Leaflet bug avec bundling)
      // @ts-expect-error - prototype patching
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!containerRef.current) return;

      const center: [number, number] = userCoords
        ? [userCoords.lat, userCoords.lng]
        : [46.5, 2.5];
      const zoom = userCoords ? 8 : 5;

      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Marker user
      if (userCoords) {
        L.circleMarker([userCoords.lat, userCoords.lng], {
          radius: 8,
          fillColor: "#0EA5E9",
          color: "#fff",
          weight: 2,
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindPopup("📍 Toi");
      }

      // Markers spots officiels (orange)
      const bounds = L.latLngBounds([]);
      spots.forEach((spot) => {
        const m = L.marker([spot.lat, spot.lng]).addTo(map);
        const html = `
          <div style="font-family: -apple-system, system-ui, sans-serif; min-width: 200px;">
            <div style="font-weight: 900; font-size: 14px; line-height: 1.2; color: #0B1D0E;">
              ${spot.name}
            </div>
            <div style="font-size: 11px; color: #6B7C72; margin-top: 4px;">
              ${spot.distance} km · ${spot.elevation} D+ · ~${Math.floor(spot.duration / 60)}h${spot.duration % 60 ? String(spot.duration % 60).padStart(2, "0") : ""}
            </div>
            <div style="margin-top: 8px;">
              <a href="/api/gpx/${spot.slug}" download="${spot.slug}.gpx"
                 style="display:inline-block;background:#1B4332;color:#F0E6C8;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:900;text-decoration:none;">
                📥 GPX
              </a>
            </div>
          </div>
        `;
        m.bindPopup(html);
        bounds.extend([spot.lat, spot.lng]);
      });

      // Markers spots user (vert lime, custom icon)
      const userIcon = L.divIcon({
        className: "ravito-user-marker",
        html: `<div style="width:24px;height:24px;background:#A4DE02;border:3px solid #1B4332;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,0.6);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      userSpots.forEach((s) => {
        const m = L.marker([s.lat, s.lng], { icon: userIcon }).addTo(map);
        m.bindPopup(`
          <div style="font-family:-apple-system,system-ui,sans-serif;min-width:180px;">
            <div style="font-size:9px;font-family:monospace;font-weight:700;color:#A4DE02;text-transform:uppercase;letter-spacing:1.5px;">Mon trail</div>
            <div style="font-weight:900;font-size:14px;color:#0B1D0E;line-height:1.2;">${s.name}</div>
            <div style="font-size:11px;color:#6B7C72;margin-top:4px;">
              ${s.distance.toFixed(1)} km · ${Math.round(s.elevation)} D+
            </div>
          </div>
        `);
        bounds.extend([s.lat, s.lng]);
      });

      if (spots.length + userSpots.length > 1 && !userCoords) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      cleanup = () => {
        map.remove();
        mapRef.current = null;
        trackLayerRef.current = null;
        LRef.current = null;
      };
    })().catch((e) => {
      console.error("[SpotsMap] init failed", e);
    });

    return () => {
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Affichage du tracé du spot sélectionné (poly-line + fitBounds)
  useEffect(() => {
    if (!mapRef.current || !LRef.current) return;
    const map = mapRef.current;
    const L = LRef.current;

    // Clean ancien tracé
    if (trackLayerRef.current) {
      map.removeLayer(trackLayerRef.current);
      trackLayerRef.current = null;
    }

    if (!selectedSlug) return;

    // Cherche un spot officiel ou user avec ce slug/id
    const officialSpot = spots.find((s) => s.slug === selectedSlug);
    const userSpot = userSpots.find((s) => s.id === selectedSlug);

    if (userSpot && userSpot.points && userSpot.points.length > 1) {
      // Tracé user (déjà parsé localement)
      const poly = L.polyline(userSpot.points, {
        color: "#A4DE02",
        weight: 5,
        opacity: 0.9,
      }).addTo(map);
      trackLayerRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [40, 40], maxZoom: 14 });
      return;
    }

    if (officialSpot) {
      // Fetch le GPX et parse les trkpts → polyline
      (async () => {
        try {
          const res = await fetch(`/api/gpx/${officialSpot.slug}`);
          if (!res.ok) throw new Error("GPX fetch failed");
          const gpx = await res.text();
          const matches = [...gpx.matchAll(/<trkpt[^>]*lat="([\d.\-]+)"[^>]*lon="([\d.\-]+)"/g)];
          const pts: [number, number][] = matches.map((m) => [
            parseFloat(m[1]),
            parseFloat(m[2]),
          ]);
          if (pts.length < 2) return;
          const poly = L.polyline(pts, {
            color: "#F77F00",
            weight: 5,
            opacity: 0.9,
          }).addTo(map);
          trackLayerRef.current = poly;
          map.fitBounds(poly.getBounds(), { padding: [40, 40], maxZoom: 14 });
        } catch (e) {
          console.error("[SpotsMap] track load failed", e);
        }
      })();
    }
  }, [selectedSlug, spots, userSpots]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border-2 border-ink/10 bg-bg-card overflow-hidden"
      style={{ height, minHeight: 280 }}
    />
  );
}
