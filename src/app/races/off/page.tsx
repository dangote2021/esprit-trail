"use client";

// ====== OFF RACES — courses punk hors circuit ======
// Contenu : FKT, Tor des Géants du dimanche, courses confidentielles,
// pirate races, défis entre potes. Tout ce qui n'est pas sur le circuit
// UTMB/ITRA officiel mais qui a de l'âme.

import { useState } from "react";
import Link from "next/link";

type OffCategory =
  | "fkt"
  | "confidential"
  | "pirate"
  | "crew"
  | "gr-project";

type OffRace = {
  id: string;
  name: string;
  tagline: string;
  location: string;
  country: string;
  distance: number;
  elevation: number;
  category: OffCategory;
  vibe: string;
  date?: string;
  recordHolder?: string;
  recordTime?: string;
  participants?: number;
  entryFee?: string;
  cover: string;
  soul: string; // ce qui rend cette course spéciale
};

const OFF_RACES: OffRace[] = [
  {
    id: "fkt-gr20",
    name: "GR20 FKT",
    tagline: "Traverser la Corse en moins de 32h",
    location: "Corse",
    country: "🇫🇷",
    distance: 180,
    elevation: 10000,
    category: "fkt",
    vibe: "Record du monde · pure souffrance",
    recordHolder: "François D'Haene",
    recordTime: "31h06",
    cover:
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
    soul: "Pas de dossard. Pas de ravito. Juste toi, la carte IGN et le monstre.",
  },
  {
    id: "pirate-chamonix",
    name: "Pirate Chamonix Loop",
    tagline: "Le tour du Mont-Blanc version clandestine",
    location: "Chamonix",
    country: "🇫🇷",
    distance: 170,
    elevation: 10000,
    category: "pirate",
    vibe: "Zéro organisation · max liberté",
    participants: 40,
    entryFee: "0€ (apporte ta bière)",
    date: "2026-08-15",
    cover:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    soul: "Départ collectif à 2h du mat sous le pont. Finish à la Moskito. Temps ? On s'en fout.",
  },
  {
    id: "confidential-cevennes",
    name: "Grande Traversée des Cévennes",
    tagline: "260 km non-stop · 100 coureurs max",
    location: "Cévennes",
    country: "🇫🇷",
    distance: 260,
    elevation: 12000,
    category: "confidential",
    vibe: "Course confidentielle · liste d'attente",
    date: "2026-09-20",
    entryFee: "80€",
    participants: 100,
    cover:
      "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
    soul: "Pas sur ITRA, pas sur UTMB Index. Juste une bande de dingues qui s'auto-organise depuis 15 ans.",
  },
  {
    id: "crew-puy-de-dome",
    name: "Crew Puy-de-Dôme Sunrise",
    tagline: "Sommet au lever du soleil avec le crew",
    location: "Auvergne",
    country: "🇫🇷",
    distance: 18,
    elevation: 900,
    category: "crew",
    vibe: "Entre potes · tous les dimanches",
    cover:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    soul: "6h du mat, RDV au parking. On monte, on regarde, on redescend au café.",
  },
  {
    id: "fkt-mercantour",
    name: "Mercantour FKT 100k",
    tagline: "L'itinéraire secret du parc national",
    location: "Mercantour",
    country: "🇫🇷",
    distance: 100,
    elevation: 6500,
    category: "fkt",
    vibe: "Tracé confidentiel · demande au locaux",
    recordHolder: "Rémi Bonnet",
    recordTime: "14h48",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    soul: "Personne ne te filera le GPX. Faut le mériter, faut le trouver.",
  },
  {
    id: "gr-project-ty",
    name: "GR Tour du Pays Basque",
    tagline: "Projet perso de 5 jours",
    location: "Pays Basque",
    country: "🇫🇷",
    distance: 220,
    elevation: 11000,
    category: "gr-project",
    vibe: "Autonomie totale · bivouac sauvage",
    cover:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    soul: "Pas une course. Un projet. Ton sac, tes nuits, tes ravitos au bistrot.",
  },
  {
    id: "pirate-ardennes",
    name: "Ardennes Pirate Run",
    tagline: "L'anti-UTMB des forêts belges",
    location: "Ardennes",
    country: "🇧🇪",
    distance: 80,
    elevation: 2500,
    category: "pirate",
    vibe: "Ambiance punk · finish au bar du village",
    date: "2026-06-14",
    participants: 200,
    entryFee: "15€ (pour la bière)",
    cover:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797",
    soul: "Ils ont créé ça parce que l'UTMB les faisait chier. Résultat : meilleure ambiance d'Europe.",
  },
  {
    id: "fkt-tmb",
    name: "Tour du Mont-Blanc FKT",
    tagline: "Le mythe en solitaire",
    location: "Mont-Blanc",
    country: "🇫🇷🇮🇹🇨🇭",
    distance: 170,
    elevation: 10000,
    category: "fkt",
    vibe: "Le tour des légendes",
    recordHolder: "Kilian Jornet",
    recordTime: "20h08",
    cover:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    soul: "Quand tu te sens prêt, tu pars. Pas de dossard, pas de public, pas de podium. Juste ton chrono.",
  },
];

const CAT_META: Record<
  OffCategory,
  { label: string; emoji: string; color: string; desc: string }
> = {
  fkt: {
    label: "FKT",
    emoji: "⚡",
    color: "text-mythic border-mythic/40 bg-mythic/10",
    desc: "Fastest Known Time — record en solo",
  },
  confidential: {
    label: "Confidentielle",
    emoji: "🤫",
    color: "text-violet border-violet/40 bg-violet/10",
    desc: "Courses hors circuit officiel",
  },
  pirate: {
    label: "Pirate",
    emoji: "🏴‍☠️",
    color: "text-peach border-peach/40 bg-peach/10",
    desc: "Ambiance punk, sans dossard",
  },
  crew: {
    label: "Crew",
    emoji: "👥",
    color: "text-cyan border-cyan/40 bg-cyan/10",
    desc: "Entre potes, rituel local",
  },
  "gr-project": {
    label: "GR Project",
    emoji: "🎒",
    color: "text-lime border-lime/40 bg-lime/10",
    desc: "Projet perso en autonomie",
  },
};

export default function OffRacesPage() {
  const [cat, setCat] = useState<OffCategory | "all">("all");

  const filtered =
    cat === "all" ? OFF_RACES : OFF_RACES.filter((r) => r.category === cat);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/races"
          className="rounded-xl card-chunky bg-bg-card p-2 text-ink-muted hover:text-peach transition tap-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Hors circuit
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            🏴‍☠️ OFF Races
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero manifeste */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-peach/40 bg-gradient-to-br from-peach/20 via-violet/10 to-bg p-6 card-shine">
        <div className="pointer-events-none absolute -right-10 -top-10 text-[180px] opacity-[0.08] leading-none">
          🏴‍☠️
        </div>
        <div className="relative">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Le trail, sans le cirque
          </div>
          <h2 className="mt-1 font-display text-2xl font-black leading-tight">
            Pas de dossard, pas de chrono officiel,
            <br />
            <span className="text-peach">juste l'âme du trail.</span>
          </h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            FKT en solo, courses pirates entre potes, GR en autonomie, rituels
            de crew au lever du jour. Les courses qui ne sont pas sur le
            circuit UTMB mais qui font battre le cœur des vrais traileurs.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-mono">
            <span className="rounded-md bg-bg-raised/80 px-2 py-1">
              🚫 Pas d'ITRA
            </span>
            <span className="rounded-md bg-bg-raised/80 px-2 py-1">
              🚫 Pas d'UTMB Index
            </span>
            <span className="rounded-md bg-peach/20 text-peach px-2 py-1 font-black">
              ✓ 100% esprit trail
            </span>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        <button
          onClick={() => setCat("all")}
          className={`shrink-0 rounded-xl border-2 px-3 py-2 transition ${
            cat === "all"
              ? "border-peach bg-peach/15 text-peach shadow-glow-peach"
              : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
          }`}
        >
          <div className="font-display text-sm font-black leading-none">
            Toutes
          </div>
          <div className="text-[9px] font-mono opacity-70">
            {OFF_RACES.length}
          </div>
        </button>
        {(Object.entries(CAT_META) as [OffCategory, typeof CAT_META[OffCategory]][]).map(
          ([id, meta]) => {
            const count = OFF_RACES.filter((r) => r.category === id).length;
            return (
              <button
                key={id}
                onClick={() => setCat(id)}
                className={`shrink-0 rounded-xl border-2 px-3 py-2 transition ${
                  cat === id
                    ? meta.color + " shadow-glow-peach"
                    : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
                }`}
              >
                <div className="font-display text-sm font-black leading-none">
                  {meta.emoji} {meta.label}
                </div>
                <div className="text-[9px] font-mono opacity-70">{count}</div>
              </button>
            );
          },
        )}
      </div>

      {/* CTA proposer sa propre OFF race */}
      <Link
        href="#"
        className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-peach/40 bg-peach/5 p-4 hover:border-peach hover:bg-peach/10 transition tap-bounce"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-peach/15 text-2xl">
          ✍️
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Tu veux proposer un OFF à la communauté ?
          </div>
          <div className="font-display text-sm font-black">
            Envoie ta course
          </div>
          <div className="text-[11px] text-ink-muted">
            Back yard des familles, Ultra du village du coin, Barkley du bled… qui est chaud ?
          </div>
        </div>
        <div className="text-peach text-xl">→</div>
      </Link>

      {/* Race list */}
      <div className="space-y-4">
        {filtered.map((race) => {
          const meta = CAT_META[race.category];
          return (
            <article
              key={race.id}
              className="relative overflow-hidden rounded-2xl border-2 border-ink/15 bg-bg-card/60 card-chunky"
            >
              {/* Hero banner */}
              <div
                className="relative h-36 bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(10,15,28,0.3) 0%, rgba(10,15,28,0.9) 100%), url(${race.cover}?w=600&auto=format&fit=crop)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-md border-2 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-black ${meta.color}`}
                  >
                    {meta.emoji} {meta.label.toUpperCase()}
                  </span>
                  {race.recordTime && (
                    <span className="rounded-md bg-mythic/90 px-2 py-0.5 text-[10px] font-mono font-black text-bg">
                      ⏱ {race.recordTime}
                    </span>
                  )}
                </div>
                {race.entryFee && (
                  <div className="absolute right-3 top-3 rounded-md bg-black/70 backdrop-blur px-2 py-1 text-right">
                    <div className="text-[9px] font-mono uppercase text-ink-muted leading-none">
                      Inscription
                    </div>
                    <div className="font-display text-sm font-black text-peach leading-none">
                      {race.entryFee}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[10px] font-mono font-black uppercase tracking-wider text-ink-muted">
                    {race.location} · {race.country}
                  </div>
                  <h3 className="font-display text-xl font-black leading-tight text-ink">
                    {race.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <p className="text-sm font-bold italic text-ink">
                  « {race.tagline} »
                </p>

                {/* Vibe */}
                <div className="rounded-lg bg-bg-raised/60 p-3">
                  <div className="text-[9px] font-mono font-black uppercase tracking-widest text-peach">
                    Vibe
                  </div>
                  <div className="text-xs text-ink mt-0.5">{race.vibe}</div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    📏 {race.distance} km
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    ⛰️ {race.elevation.toLocaleString()} D+
                  </span>
                  {race.participants && (
                    <span className="rounded-md bg-bg-raised px-2 py-1">
                      👥 {race.participants} max
                    </span>
                  )}
                  {race.recordHolder && (
                    <span className="rounded-md bg-mythic/15 text-mythic px-2 py-1 font-black">
                      👑 {race.recordHolder}
                    </span>
                  )}
                </div>

                {/* Soul */}
                <div className="rounded-lg border-l-4 border-peach bg-peach/5 p-3">
                  <div className="text-[9px] font-mono font-black uppercase tracking-widest text-peach">
                    L'âme de la course
                  </div>
                  <p className="mt-1 text-xs text-ink leading-relaxed">
                    {race.soul}
                  </p>
                </div>

                {race.date && (
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-ink-muted">Prochaine édition</span>
                    <span className="font-black text-peach">
                      {new Date(race.date).toLocaleDateString("fr", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer manifesto */}
      <section className="rounded-2xl border-2 border-peach/20 bg-bg-card/40 p-5 text-center space-y-2">
        <div className="text-3xl">🏴‍☠️</div>
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Esprit Trail x OFF
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Le trail il a changé. Esprit Trail remet l&apos;âme au centre. Les OFF races,
          c&apos;est le cœur qui bat en dehors du circuit officiel, pour célébrer
          ce qui ne se monnaie pas.
        </p>
      </section>
    </main>
  );
}
