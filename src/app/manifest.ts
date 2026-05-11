import type { MetadataRoute } from "next";

// Build tag pour cache-bust PWA (changer pour forcer la mise à jour côté client)
const BUILD_TAG = "2026-05-11-v2";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Esprit Trail · Coach Trail",
    short_name: "Esprit Trail",
    id: `/?v=${BUILD_TAG}`,
    description:
      "Coach IA pour ton ultra. Plans nutrition, spots GPX, dossards à gagner.",
    // Param utm pour tracker les ouvertures PWA standalone vs web
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    // Fallback chain pour navigateurs qui supportent display_override
    display_override: ["standalone", "minimal-ui", "browser"],
    background_color: "#f0e6c8",
    theme_color: "#1b4332",
    orientation: "portrait",
    categories: ["sports", "health", "lifestyle"],
    lang: "fr",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
