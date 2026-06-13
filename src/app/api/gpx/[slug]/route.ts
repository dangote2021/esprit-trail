// ====== /api/gpx/[slug] — GPX dynamique ======
// Génère un fichier GPX minimaliste à partir des coords du spot.
// Pour V1 : un waypoint au centre + un mini track autour pour que les
// apps GPS (Strava, Garmin Connect, Komoot) puissent l'importer.
// Phase 2 : tracé réel via API Wikiloc / OSM Routing.

import { NextResponse, type NextRequest } from "next/server";
import { TRAINING_SPOTS } from "@/lib/data/training-spots";

export const runtime = "edge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: PageProps) {
  const { slug } = await params;
  const spot = TRAINING_SPOTS.find((s) => s.slug === slug);
  if (!spot) {
    return new NextResponse("Spot introuvable", { status: 404 });
  }

  // Génération d'un tracé "vraisemblable" en boucle organique.
  // Vrai-faux : on n'a pas encore de tracés terrain réels, mais on simule
  // une boucle qui suit grossièrement le terrain avec quelques zigzags
  // (simule des virages naturels) et un retour fermé. Suffisant pour que
  // les apps (Strava, Garmin, Komoot) acceptent et affichent un tracé.
  // Phase 2 : tracés réels via Wikiloc / OSM Routing API.

  // Rayon de la boucle ajusté à la distance du spot (1km ≈ 0.009°)
  const km = spot.distance;
  const radiusDeg = (km / 111) * 0.18; // boucle dont le périmètre ≈ km
  const N = 80; // 80 points pour un tracé fluide
  const points: [number, number][] = [];

  // Seed pseudo-aléatoire basée sur slug pour avoir un tracé stable par spot
  let seed = 0;
  for (let i = 0; i < slug.length; i++) seed = (seed * 31 + slug.charCodeAt(i)) >>> 0;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed / 0xffffffff;
  };

  for (let i = 0; i <= N; i++) {
    const angle = (i / N) * 2 * Math.PI;
    // Variation organique : on ajoute un peu de wobble pour simuler des virages
    const wobble = 0.85 + 0.3 * Math.sin(angle * 3 + rnd() * 6.28);
    const lat = spot.lat + radiusDeg * wobble * Math.sin(angle);
    const lng = spot.lng + radiusDeg * wobble * Math.cos(angle);
    points.push([lat, lng]);
  }

  // Élévation simulée (variation lissée autour de la moyenne)
  const elevations = points.map((_, i) => {
    const phase = (i / N) * Math.PI * 2;
    const variation = Math.sin(phase * 2) * (spot.elevation / 4);
    return 800 + variation; // altitude approximative
  });

  const trkpts = points
    .map(([lat, lng], i) => `      <trkpt lat="${lat}" lon="${lng}"><ele>${elevations[i].toFixed(1)}</ele></trkpt>`)
    .join("\n");

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Esprit Trail"
  xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${spot.name}</name>
    <desc>${spot.description}</desc>
    <link href="https://esprit-trail.vercel.app/spots/${spot.slug}">
      <text>Voir sur Esprit Trail</text>
    </link>
  </metadata>
  <wpt lat="${spot.lat}" lon="${spot.lng}">
    <name>${spot.name} (départ)</name>
    <desc>${spot.region} — ${spot.distance} km / ${spot.elevation} D+</desc>
  </wpt>
  <trk>
    <name>${spot.name}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;

  return new NextResponse(gpx, {
    status: 200,
    headers: {
      "Content-Type": "application/gpx+xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.gpx"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
