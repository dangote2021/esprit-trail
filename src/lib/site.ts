// ====== SITE URL ======
// Point d'entrée unique pour l'URL publique de l'app. À utiliser partout où
// on a besoin d'un lien absolu (metadata, sitemap, robots, OpenGraph, emails).
//
// Priorité de résolution :
//   1. NEXT_PUBLIC_SITE_URL (config explicite — prod officielle, ex : https://esprit-trail.app)
//   2. VERCEL_URL (auto-injecté par Vercel, utile pour les previews)
//   3. Fallback local dev

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function ensureHttps(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return stripTrailingSlash(ensureHttps(configured));

  const vercel = process.env.VERCEL_URL;
  if (vercel) return stripTrailingSlash(ensureHttps(vercel));

  return "http://localhost:3000";
}

export function getSiteHost(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return "ravito.app";
  }
}

export const SITE_URL = getSiteUrl();
export const SITE_HOST = getSiteHost();
