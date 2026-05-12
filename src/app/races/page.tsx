"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RACES } from "@/lib/data/races";
import { ME } from "@/lib/data/me";
import { OFF_RACES, OFF_CAT_META, type OffCategory } from "@/lib/data/off-races";
import type { Race, RaceCategory } from "@/lib/types";
import type { OffRace } from "@/lib/data/off-races";
import RaceShareButton from "@/components/race/RaceShareButton";
import AddRaceForm from "@/components/race/AddRaceForm";
import SubmittedByBadge from "@/components/race/SubmittedByBadge";
import { loadUserRaces, loadUserOffRaces } from "@/lib/data/user-races";
import {
  listUserRaces as fetchServerUserRaces,
  listUserOffRaces as fetchServerUserOffRaces,
} from "@/lib/supabase/user-races";
import { useT, useLang } from "@/lib/i18n/LangProvider";

const CATS: { id: RaceCategory | "all"; labelKey: string; range: string }[] = [
  { id: "all", labelKey: "races.cat.all", range: "" },
  { id: "XS", labelKey: "XS", range: "<25 km" },
  { id: "S", labelKey: "S", range: "25-44" },
  { id: "M", labelKey: "M", range: "45-74" },
  { id: "L", labelKey: "L", range: "75-114" },
  { id: "XL", labelKey: "XL", range: "115+" },
];

type Tab = "on" | "off";

function formatDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === "en" ? "en-GB" : "fr", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RacesPage() {
  const t = useT();
  const { lang } = useLang();
  // Support ?tab=off pour deep-linking depuis la home (encart "OFF Races")
  const params = useSearchParams();
  const initialTab: Tab = params?.get("tab") === "off" ? "off" : "on";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [cat, setCat] = useState<RaceCategory | "all">("all");
  const [franceOnly, setFranceOnly] = useState(false);
  const [offCat, setOffCat] = useState<OffCategory | "all">("all");
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  // Courses user-submitted (localStorage). Phase 2 = Supabase user_races table.
  const [userRaces, setUserRaces] = useState<Race[]>([]);
  const [userOffRaces, setUserOffRaces] = useState<OffRace[]>([]);
  const [showForm, setShowForm] = useState<"on" | "off" | null>(null);

  // Détection cookie auth Supabase pour ajuster l'affichage UTMB Index aux visiteurs
  useEffect(() => {
    if (typeof document === "undefined") return;
    const hasAuth = document.cookie
      .split(";")
      .some((c) => c.trim().match(/^sb-[a-z0-9]+-auth-token/));
    setIsLogged(hasAuth);
  }, []);

  // Charger les courses user-submitted depuis Supabase (avec fallback localStorage)
  // et écouter les updates pour rafraîchir la liste à chaque nouvelle soumission.
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      // 1. Local first pour l'instant — puis enrichi par les courses serveur.
      const local = loadUserRaces();
      const localOff = loadUserOffRaces();
      if (!cancelled) {
        setUserRaces(local);
        setUserOffRaces(localOff);
      }
      // 2. Serveur (publiquement visible)
      try {
        const [serverOn, serverOff] = await Promise.all([
          fetchServerUserRaces(),
          fetchServerUserOffRaces(),
        ]);
        if (cancelled) return;
        // Merge avec dedupe par id (local id "user-…" diffère du UUID serveur)
        const seen = new Set<string>();
        const mergedOn = [...serverOn, ...local].filter((r) => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });
        const seenOff = new Set<string>();
        const mergedOff = [...serverOff, ...localOff].filter((r) => {
          if (seenOff.has(r.id)) return false;
          seenOff.add(r.id);
          return true;
        });
        setUserRaces(mergedOn);
        setUserOffRaces(mergedOff);
      } catch (e) {
        // Pas de réseau ou pas authentifié → on garde le local
        console.warn("[races] server fetch failed, using local only", e);
      }
    }
    refresh();
    window.addEventListener("esprit-user-races-update", refresh);
    window.addEventListener("esprit-user-off-races-update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("esprit-user-races-update", refresh);
      window.removeEventListener("esprit-user-off-races-update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Fusion des courses officielles + user-submitted pour l'onglet ON
  const allOnRaces = [...RACES, ...userRaces];
  const filtered = allOnRaces.filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (franceOnly && !r.country.toLowerCase().includes("france")) return false;
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // OFF Races officielles + user-submitted
  const allOffRaces = [...OFF_RACES, ...userOffRaces];
  const filteredOff =
    offCat === "all" ? allOffRaces : allOffRaces.filter((r) => r.category === offCat);

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
            {t("races.header.eyebrow")}
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            {t("races.header.title")}
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* ===== Tabs principaux : Courses ON / OFF ===== */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-ink/10 bg-bg-card/40 p-1.5">
        <button
          onClick={() => setTab("on")}
          className={`rounded-xl py-2.5 transition ${
            tab === "on"
              ? "bg-peach text-bg shadow-md"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <div className="font-display text-sm font-black leading-tight">
            {t("races.tab.on.title")}
          </div>
          <div className={`text-[10px] font-mono ${tab === "on" ? "opacity-80" : "opacity-60"}`}>
            {t("races.tab.on.subtitle")}
          </div>
        </button>
        <button
          onClick={() => setTab("off")}
          className={`rounded-xl py-2.5 transition ${
            tab === "off"
              ? "bg-peach text-bg shadow-md"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <div className="font-display text-sm font-black leading-tight">
            {t("races.tab.off.title")}
          </div>
          <div className={`text-[10px] font-mono ${tab === "off" ? "opacity-80" : "opacity-60"}`}>
            {t("races.tab.off.subtitle")}
          </div>
        </button>
      </div>

      {tab === "on" && (
        <>
          {/* CTA "Proposer une course ON" — visible en haut de l'onglet */}
          <button
            type="button"
            onClick={() => setShowForm("on")}
            className="w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-peach/50 bg-peach/5 px-4 py-3 text-left hover:bg-peach/10 transition"
            aria-label="Proposer une course ON"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">➕</div>
              <div>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
                  Communauté
                </div>
                <div className="font-display text-sm font-black text-ink">
                  Proposer une course ON
                </div>
                <div className="text-[11px] text-ink-muted">
                  Tu en connais une qu&apos;on n&apos;a pas listée ? Partage-la.
                </div>
              </div>
            </div>
            <span className="font-mono text-peach text-xl shrink-0">→</span>
          </button>

          {/* Filter tabs catégorie */}
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
                  {c.labelKey === "races.cat.all" ? t(c.labelKey) : c.labelKey}
                </div>
                {c.range && (
                  <div className="text-[10px] font-mono opacity-70">{c.range}</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFranceOnly(!franceOnly)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 transition ${
              franceOnly
                ? "border-cyan bg-cyan/10 text-cyan shadow-glow-cyan"
                : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold">
              <span>🇫🇷</span> {t("races.filter.france")}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider">
              {franceOnly ? t("races.filter.on") : t("races.filter.off")}
            </span>
          </button>
        </>
      )}

      {tab === "off" && (
        <>
          {/* CTA "Proposer une OFF Race" — visible en haut de l'onglet */}
          <button
            type="button"
            onClick={() => setShowForm("off")}
            className="w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-violet/50 bg-violet/5 px-4 py-3 text-left hover:bg-violet/10 transition"
            aria-label="Proposer une OFF Race"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏴‍☠️</div>
              <div>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
                  Communauté
                </div>
                <div className="font-display text-sm font-black text-ink">
                  Proposer une OFF Race
                </div>
                <div className="text-[11px] text-ink-muted">
                  FKT, course pirate, crew run, GR project — partage-la.
                </div>
              </div>
            </div>
            <span className="font-mono text-violet text-xl shrink-0">→</span>
          </button>

          {/* Hero OFF — manifeste compact */}
          <section className="relative overflow-hidden rounded-2xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-violet/10 to-bg p-4">
            <div className="pointer-events-none absolute -right-4 -top-4 text-7xl opacity-10">
              🏴‍☠️
            </div>
            <div className="relative">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
                Le trail, sans le cirque
              </div>
              <h2 className="mt-1 font-display text-lg font-black leading-tight">
                Pas de dossard, pas de chrono officiel,{" "}
                <span className="text-peach">juste l&apos;âme du trail.</span>
              </h2>
              <Link
                href="/races/off"
                className="mt-2 inline-block text-[11px] font-mono font-bold text-peach underline-offset-2 hover:underline"
              >
                Voir le manifeste OFF complet →
              </Link>
            </div>
          </section>

          {/* Filtres catégorie OFF */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            <button
              onClick={() => setOffCat("all")}
              className={`shrink-0 rounded-xl border-2 px-3 py-2 transition ${
                offCat === "all"
                  ? "border-peach bg-peach/15 text-peach shadow-glow-peach"
                  : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
              }`}
            >
              <div className="font-display text-sm font-black leading-none">Toutes</div>
              <div className="text-[9px] font-mono opacity-70">{OFF_RACES.length}</div>
            </button>
            {(Object.entries(OFF_CAT_META) as [OffCategory, typeof OFF_CAT_META[OffCategory]][]).map(
              ([id, meta]) => {
                const count = OFF_RACES.filter((r) => r.category === id).length;
                return (
                  <button
                    key={id}
                    onClick={() => setOffCat(id)}
                    className={`shrink-0 rounded-xl border-2 px-3 py-2 transition ${
                      offCat === id
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

          {/* Cards OFF */}
          <div className="space-y-4">
            {filteredOff.map((race) => {
              const meta = OFF_CAT_META[race.category];
              return (
                <Link
                  key={race.id}
                  href="/races/off"
                  className="relative block overflow-hidden rounded-2xl border-2 border-peach/30 bg-bg-card/60 transition hover:scale-[1.01] hover:border-peach/60"
                >
                  <div
                    className="relative h-32 bg-gradient-to-br"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(10,15,28,0.3) 0%, rgba(10,15,28,0.95) 100%), url(${race.cover}?w=600&auto=format&fit=crop)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-black backdrop-blur ${meta.color}`}>
                        {meta.emoji} {meta.label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-white/80">
                        {race.location} · {race.country}
                      </div>
                      <div className="font-display text-lg font-black leading-tight text-white drop-shadow-lg">
                        {race.name}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm text-ink leading-snug">{race.tagline}</p>
                    {race.submittedBy && (
                      <SubmittedByBadge
                        username={race.submittedBy.username}
                        displayName={race.submittedBy.displayName}
                        avatar={race.submittedBy.avatar}
                        tone="violet"
                      />
                    )}
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                      <span className="rounded-md bg-bg-raised px-2 py-1">
                        📏 {race.distance} km
                      </span>
                      <span className="rounded-md bg-bg-raised px-2 py-1">
                        ⛰️ {race.elevation.toLocaleString("fr-FR")} D+
                      </span>
                      {race.recordTime && (
                        <span className="rounded-md bg-mythic/10 text-mythic px-2 py-1">
                          ⚡ {race.recordTime}
                        </span>
                      )}
                      {race.entryFee && (
                        <span className="rounded-md bg-bg-raised px-2 py-1">
                          {race.entryFee}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] italic text-ink-muted leading-relaxed border-l-2 border-peach/30 pl-2">
                      {race.soul}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Race cards ON (gardés sous le tab ON) */}
      {tab === "on" && (
      <div className="space-y-4">
        {filtered.map((race) => {
          const eligible = !race.utmbIndexRequired || myUtmb >= race.utmbIndexRequired;
          const isFrance = race.country.toLowerCase().includes("france");
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
                  : isFrance
                    ? "border-cyan/25"
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
                  {isFrance && (
                    <span className="rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-bold text-ink flex items-center gap-1">
                      🇫🇷 FR
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
                  {race.submittedBy && (
                    <div className="mt-2">
                      <SubmittedByBadge
                        username={race.submittedBy.username}
                        displayName={race.submittedBy.displayName}
                        avatar={race.submittedBy.avatar}
                        tone="peach"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    📏 {race.distance} km
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    ⛰️ {race.elevation} D+
                  </span>
                  <span className="rounded-md bg-violet/10 px-2 py-1 text-violet">
                    {race.itraPoints} cailloux
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    📅 {formatDate(race.date, lang)}
                  </span>
                </div>

                {race.utmbIndexRequired && isLogged && (
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
                {race.utmbIndexRequired && isLogged === false && (
                  <div className="flex items-center justify-between rounded-lg border border-cyan/30 bg-cyan/5 px-3 py-2 text-xs text-cyan">
                    <span className="flex items-center gap-2 font-mono font-bold">
                      <span>🎯</span> UTMB Index requis : {race.utmbIndexRequired}
                    </span>
                    <span className="font-mono font-bold">→ Connecte-toi</span>
                  </div>
                )}

                {/* Difficulté + partage */}
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
                  <div className="flex items-center gap-2">
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
                  <RaceShareButton
                    raceId={race.id}
                    raceName={race.name}
                    tagline={race.tagline}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      )}

      {/* Modale de proposition de course (ON ou OFF) */}
      {showForm && (
        <AddRaceForm
          mode={showForm}
          onClose={() => setShowForm(null)}
          onSubmitted={() => {
            // Reload pour s'assurer que la nouvelle course apparaît en haut de liste
            setUserRaces(loadUserRaces());
            setUserOffRaces(loadUserOffRaces());
          }}
        />
      )}
    </main>
  );
}
