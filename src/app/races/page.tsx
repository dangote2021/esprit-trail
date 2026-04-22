"use client";

import { useState } from "react";
import Link from "next/link";
import { RACES } from "@/lib/data/races";
import { ME } from "@/lib/data/me";
import type { RaceCategory } from "@/lib/types";

const CATS: { id: RaceCategory | "all"; label: string; range: string }[] = [
  { id: "all", label: "Toutes", range: "" },
  { id: "XS", label: "XS", range: "<25 km" },
  { id: "S", label: "S", range: "25-44" },
  { id: "M", label: "M", range: "45-74" },
  { id: "L", label: "L", range: "75-114" },
  { id: "XL", label: "XL", range: "115+" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RacesPage() {
  const [cat, setCat] = useState<RaceCategory | "all">("all");
  const [iconicOnly, setIconicOnly] = useState(false);

  const filtered = RACES.filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (iconicOnly && !r.isIconic) return false;
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const myUtmb = ME.connections.utmb?.runnerIndex || 0;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Calendrier
          </div>
          <h1 className="font-display text-lg font-black leading-none">Courses</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Filter tabs */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-xl border px-3 py-2 transition ${
              cat === c.id
                ? "border-peach bg-peach/15 text-peach shadow-glow-peach"
                : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
            }`}
          >
            <div className="font-display text-sm font-black leading-none">
              {c.label}
            </div>
            {c.range && (
              <div className="text-[10px] font-mono opacity-70">{c.range}</div>
            )}
          </button>
        ))}
      </div>

      {/* OFF Races access — punk feature highlight */}
      <Link
        href="/races/off"
        className="relative block overflow-hidden rounded-2xl border-2 border-peach/60 bg-gradient-to-r from-peach/15 via-violet/10 to-transparent p-4 hover:border-peach transition"
      >
        <div className="pointer-events-none absolute -right-2 -top-2 text-6xl opacity-10">
          🏴‍☠️
        </div>
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-peach text-bg text-xl">
            🏴‍☠️
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
              Pas de dossard · pas de cirque
            </div>
            <div className="font-display text-base font-black leading-tight">
              OFF Races · hors circuit
            </div>
            <div className="text-[11px] text-ink-muted">
              FKT, pirates, GR projects, crew runs
            </div>
          </div>
          <div className="text-peach text-xl font-display font-black">→</div>
        </div>
      </Link>

      <button
        onClick={() => setIconicOnly(!iconicOnly)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 transition ${
          iconicOnly
            ? "border-gold bg-gold/10 text-gold"
            : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-bold">
          <span>👑</span> Iconiques uniquement
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider">
          {iconicOnly ? "ON" : "OFF"}
        </span>
      </button>

      {/* Race cards */}
      <div className="space-y-4">
        {filtered.map((race) => {
          const eligible = !race.utmbIndexRequired || myUtmb >= race.utmbIndexRequired;
          const daysUntil = Math.ceil(
            (new Date(race.date).getTime() - Date.now()) / 86400000,
          );
          return (
            <Link
              key={race.id}
              href={`/race/${race.id}`}
              className={`relative block overflow-hidden rounded-2xl border bg-bg-card/60 transition hover:scale-[1.01] ${
                race.isIconic
                  ? "border-gold/30 shadow-glow-gold card-shine"
                  : "border-ink/10"
              }`}
            >
              {/* Hero banner */}
              <div
                className="relative h-32 bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(10,15,28,0.3) 0%, rgba(10,15,28,0.95) 100%), url(${race.heroImage}?w=600&auto=format&fit=crop)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <span className="rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-bold text-ink">
                    {race.category}
                  </span>
                  {race.isIconic && (
                    <span className="rounded-md bg-gold/90 px-2 py-0.5 text-[10px] font-mono font-black text-bg">
                      ⭐ ICONIC
                    </span>
                  )}
                </div>
                <div className="absolute right-3 top-3 rounded-md bg-black/60 backdrop-blur px-2 py-1 text-right">
                  <div className="text-[9px] font-mono uppercase text-ink-muted leading-none">
                    dans
                  </div>
                  <div className="font-display text-base font-black text-peach leading-none">
                    {daysUntil}j
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                    {race.location} · {race.country}
                  </div>
                  <h3 className="font-display text-xl font-black leading-tight">
                    {race.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-muted">{race.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    📏 {race.distance} km
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    ⛰️ {race.elevation} D+
                  </span>
                  <span className="rounded-md bg-violet/10 px-2 py-1 text-violet">
                    {race.itraPoints} pts ITRA
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    📅 {formatDate(race.date)}
                  </span>
                </div>

                {race.utmbIndexRequired && (
                  <div
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${
                      eligible
                        ? "border-lime/30 bg-lime/5 text-lime"
                        : "border-peach/30 bg-peach/5 text-peach"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-mono font-bold">
                      <span>🎯</span> UTMB Index requis : {race.utmbIndexRequired}
                    </span>
                    <span className="font-mono font-bold">
                      {eligible ? "✓ Éligible" : `Il te manque ${race.utmbIndexRequired - myUtmb}`}
                    </span>
                  </div>
                )}

                {/* Difficulté */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-ink-muted">
                  <span>Difficulté</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-5 rounded-full ${
                          i <= race.difficulty ? "bg-peach" : "bg-ink/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
