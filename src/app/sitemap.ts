import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { RACES } from "@/lib/data/races";
import { OFF_RACES } from "@/lib/data/off-races";
import { BIB_CHALLENGES } from "@/lib/data/bib-challenges";
import { TRAINING_SPOTS } from "@/lib/data/training-spots";

const BASE = SITE_URL;

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Routes statiques
  const staticRoutes: { path: string; priority: number; freq: Freq }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/demo", priority: 0.85, freq: "monthly" },
    { path: "/install", priority: 0.7, freq: "monthly" },
    { path: "/spots", priority: 0.9, freq: "weekly" },
    { path: "/races", priority: 0.95, freq: "weekly" },
    { path: "/races/off", priority: 0.85, freq: "weekly" },
    { path: "/coach", priority: 0.85, freq: "weekly" },
    { path: "/challenges/loto", priority: 0.9, freq: "weekly" },
    { path: "/organisateurs", priority: 0.8, freq: "monthly" },
    { path: "/login", priority: 0.5, freq: "yearly" },
    { path: "/signup", priority: 0.6, freq: "yearly" },
    { path: "/legal/cgu", priority: 0.3, freq: "yearly" },
    { path: "/legal/privacy", priority: 0.3, freq: "yearly" },
    { path: "/legal/mentions", priority: 0.3, freq: "yearly" },
  ];

  // Courses ON — chaque race a sa page /race/[id]
  const raceRoutes = RACES.map((r) => ({
    path: `/race/${r.id}`,
    priority: r.isIconic ? 0.9 : 0.75,
    freq: "weekly" as Freq,
    lastModified: new Date(r.date),
  }));

  // OFF Races (renvoie vers /races/off ; liens persos sont gérés par /races/off)
  // On ne génère pas une URL par OFF race pour ne pas créer de soft-404,
  // mais on les liste pour future expansion si besoin de pages dédiées.
  void OFF_RACES;

  // Tirages dossards — un par challenge
  const bibRoutes = BIB_CHALLENGES.map((c) => ({
    path: `/challenges/loto/${c.slug}`,
    priority: 0.7,
    freq: "weekly" as Freq,
  }));

  // Spots — page individuelle si tu en ajoutes plus tard, pour l'instant
  // /spots affiche tout. On garde la liste prête.
  void TRAINING_SPOTS;

  const all = [
    ...staticRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...raceRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: r.lastModified > now ? now : r.lastModified,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...bibRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
  ];

  return all;
}
