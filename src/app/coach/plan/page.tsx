"use client";

// ====== PLAN COACH IA — version LIVE ======
// Appelle /api/coach/plan avec le profil ME et l'objectif
// sélectionné sur /coach. Affiche loading + plan généré + semaines switcher.

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ME, MY_RUNS } from "@/lib/data/me";
import { RACES } from "@/lib/data/races";
import type { Race } from "@/lib/types";
import HeartRateZones from "@/components/coach/HeartRateZones";
import { loadHr, bpmRangeForIntensity, type HrData } from "@/lib/hr-zones";

type Goal =
  | "specific-trail"
  | "first-trail"
  | "improve-marathon"
  | "first-ultra"
  | "utmb-qualif"
  | "lose-weight"
  | "rebuild"
  | "custom";

type ApiSession = {
  type: "easy" | "long" | "interval" | "hill" | "tempo" | "strength" | "rest" | "race";
  title: string;
  duration: number;
  distance?: number;
  elevation?: number;
  intensity: "low" | "moderate" | "high";
  notes?: string;
};

type ApiWeek = {
  week: number;
  phase: "foundation" | "build" | "peak" | "taper" | "race";
  label: string;
  focus: string;
  weeklyKm: number;
  weeklyElevation: number;
  sessions: ApiSession[];
  coachTip: string;
  nutritionTip?: string;
};

type ApiPlan = {
  ok: boolean;
  goal: Goal;
  totalWeeks: number;
  generatedAt: string;
  source: string;
  summary?: string;
  plan: ApiWeek[];
};

const GOAL_META: Record<Goal, { label: string; emoji: string; distance: string }> = {
  "specific-trail": { label: "Trail spécifique", emoji: "🏜️", distance: "Conditions extrêmes" },
  "first-trail": { label: "Mon premier trail", emoji: "🌲", distance: "20-30 km" },
  "improve-marathon": { label: "Battre mon RP Marathon", emoji: "⚡", distance: "42 km" },
  "first-ultra": { label: "Mon premier ultra", emoji: "🔥", distance: "50-80 km" },
  "utmb-qualif": { label: "Qualif UTMB", emoji: "👑", distance: "100 km+" },
  "lose-weight": { label: "Forme et santé", emoji: "💚", distance: "" },
  rebuild: { label: "Retour après blessure", emoji: "🩹", distance: "" },
  custom: { label: "Objectif perso", emoji: "🎯", distance: "" },
};

const TYPE_META: Record<
  ApiSession["type"],
  { label: string; color: string; icon: string }
> = {
  easy: { label: "Endurance", color: "text-cyan border-cyan/30 bg-cyan/5", icon: "🚶" },
  long: { label: "Sortie longue", color: "text-peach border-peach/30 bg-peach/5", icon: "🏃" },
  interval: { label: "Fractionné", color: "text-lime border-lime/30 bg-lime/5", icon: "⚡" },
  hill: { label: "Côtes / D+", color: "text-violet border-violet/30 bg-violet/5", icon: "⛰️" },
  tempo: { label: "Tempo / Seuil", color: "text-gold border-gold/30 bg-gold/5", icon: "🎯" },
  strength: { label: "Renfo", color: "text-violet border-violet/30 bg-violet/5", icon: "💪" },
  rest: { label: "Repos", color: "text-ink-muted border-ink/20 bg-bg-card/40", icon: "😌" },
  race: { label: "Course !", color: "text-mythic border-mythic/40 bg-mythic/5", icon: "🏁" },
};

const PHASE_META: Record<
  ApiWeek["phase"],
  { color: string; label: string; desc: string }
> = {
  foundation: {
    color: "text-cyan",
    label: "Foundation",
    desc: "Construction de la base aérobie",
  },
  build: {
    color: "text-peach",
    label: "Build",
    desc: "Montée en charge, intensité spécifique",
  },
  peak: {
    color: "text-mythic",
    label: "Peak",
    desc: "Pic de forme, volume max",
  },
  taper: {
    color: "text-lime",
    label: "Taper",
    desc: "Affûtage, on retire de la charge",
  },
  race: { color: "text-gold", label: "Race", desc: "Jour J" },
};

function formatDuration(mins: number) {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
  }
  return `${mins} min`;
}

/** Stats terrain calculées depuis l'historique runs ME. */
function computeLevelFromMe() {
  const runs = MY_RUNS;
  const now = Date.now();
  const d28 = 28 * 86_400_000;
  const recent = runs.filter((r) => now - new Date(r.date).getTime() <= d28);
  const weeklyKm = Math.round(recent.reduce((s, r) => s + r.distance, 0) / 4) || 30;
  const weeklyElevation =
    Math.round(recent.reduce((s, r) => s + r.elevation, 0) / 4) || 800;
  const longestRun = runs.reduce((m, r) => Math.max(m, r.distance), 0) || 15;
  return { weeklyKm, weeklyElevation, longestRun };
}

type UserLevel = "debutant" | "confirme" | "ultra";

const LEVEL_LABELS: Record<UserLevel, { label: string; tagline: string; volMul: number; specBlock: string }> = {
  debutant: {
    label: "Débutant",
    tagline: "Premier trail ou retour après pause",
    volMul: 0.7,
    specBlock: "Plan progressif avec footings doux, intensité limitée, longues sorties courtes. Pas de séances spécifiques côtes ou descente technique au début.",
  },
  confirme: {
    label: "Confirmé",
    tagline: "Tu cours régulièrement, t'as déjà fait quelques courses",
    volMul: 1.0,
    specBlock: "Plan équilibré avec base aérobie + séances spécifiques (côtes, seuil, sortie longue). Volume hebdo soutenu.",
  },
  ultra: {
    label: "Ultra",
    tagline: "Ultra-traileur, gros volumes, blocs costauds",
    volMul: 1.4,
    specBlock: "Plan avancé : blocs spécifiques (côtes répétées, descente technique, double sortie, nutrition embarquée), gros volume hebdo, semaine de rappel régulière, périodisation explicite (base → spécifique → affûtage).",
  },
};

const LEVEL_KEY = "esprit_coach_user_level";

/**
 * Dérive un Goal cohérent à partir d'une course wishlist.
 * Heuristique simple basée sur la distance — ça permet au bouton
 * "Préparer cette course" de ne pas avoir à demander à l'user de
 * choisir un objectif qui colle déjà à la course.
 */
function goalFromRace(race: Race): Goal {
  if (race.distance >= 90) return "utmb-qualif";
  if (race.distance >= 50) return "first-ultra";
  if (race.distance >= 30) return "specific-trail";
  return "first-trail";
}

/** Nombre de semaines de prépa selon les jours restants. Cappé entre 4 et 24. */
function weeksUntilRace(raceIso: string): number {
  const days = Math.ceil((new Date(raceIso).getTime() - Date.now()) / 86_400_000);
  if (days <= 28) return 4;
  if (days >= 168) return 24;
  return Math.round(days / 7);
}

function loadStoredLevel(): UserLevel {
  if (typeof window === "undefined") return "confirme";
  try {
    const raw = window.localStorage.getItem(LEVEL_KEY) as UserLevel | null;
    if (raw === "debutant" || raw === "confirme" || raw === "ultra") return raw;
  } catch {/* ignore */}
  return "confirme";
}

function CoachPlanInner() {
  const sp = useSearchParams();
  // raceId : permet d'arriver depuis /race/[id] avec une cible précise.
  // Si présent, on dérive le goal de la distance et on injecte le contexte
  // race dans freeText pour que Claude calibre la prépa au cordeau.
  const raceId = sp.get("raceId");
  const targetRace = raceId ? RACES.find((r) => r.id === raceId) : null;
  const goalParam = sp.get("goal") as Goal | null;
  const goal: Goal = targetRace ? goalFromRace(targetRace) : (goalParam || "first-ultra");
  const [plan, setPlan] = useState<ApiPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekIdx, setWeekIdx] = useState(0);
  const [userLevel, setUserLevel] = useState<UserLevel>("confirme");
  const [hydrated, setHydrated] = useState(false);
  // FC perso — pour afficher les plages BPM sur chaque séance (panel Karim)
  const [hr, setHr] = useState<HrData | null>(null);

  useEffect(() => {
    setUserLevel(loadStoredLevel());
    setHydrated(true);
    setHr(loadHr());
    const onHr = (e: Event) => {
      setHr((e as CustomEvent).detail as HrData | null);
    };
    window.addEventListener("esprit:hr", onHr);
    return () => window.removeEventListener("esprit:hr", onHr);
  }, []);

  function pickLevel(lvl: UserLevel) {
    setUserLevel(lvl);
    try {
      window.localStorage.setItem(LEVEL_KEY, lvl);
    } catch {/* ignore */}
  }

  const level = useMemo(() => computeLevelFromMe(), []);
  const meta = GOAL_META[goal];
  const levelMeta = LEVEL_LABELS[userLevel];

  useEffect(() => {
    // Attendre l'hydratation pour avoir le bon level depuis localStorage
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Ajuste le volume + l'intensité selon le niveau utilisateur (retour
        // Quentin/Camille : "un toggle 'niveau' qui adapte le contenu").
        const adjustedLevel = {
          ...level,
          weeklyKm: Math.round(level.weeklyKm * levelMeta.volMul),
        };
        // Bloc contexte course quand on arrive avec ?raceId=.
        // On donne à Claude la cible précise : nom, date, distance, D+,
        // heure de départ, formats, et nombre de semaines disponibles.
        const raceBlock = targetRace
          ? ` Course cible : ${targetRace.name} le ${new Date(targetRace.date).toLocaleDateString("fr", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}${targetRace.startTime ? ` (départ ${targetRace.startTime})` : ""} à ${targetRace.location} (${targetRace.country}). ${targetRace.distance} km, ${targetRace.elevation} m D+, difficulté ${targetRace.difficulty}/5, ${targetRace.itraPoints} pts ITRA. ${weeksUntilRace(targetRace.date)} semaines de prépa disponibles avant le jour J. Calibre le plan pour qu'il termine sur une semaine de taper qui colle à la date de course. Tagline officielle : "${targetRace.tagline}".`
          : "";

        const res = await fetch("/api/coach/plan", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            goal,
            ...(targetRace ? { targetDate: targetRace.date } : {}),
            currentLevel: adjustedLevel,
            constraints: {
              weeklyAvailability: userLevel === "ultra" ? 6 : userLevel === "debutant" ? 3 : 4,
              terrain: "mountain",
              ...(targetRace
                ? { totalWeeks: weeksUntilRace(targetRace.date) }
                : {}),
            },
            freeText: `Niveau utilisateur déclaré : ${levelMeta.label}. ${levelMeta.specBlock} Traileur ${ME.profile?.trailerClass || "alpiniste"} · niveau ${ME.level} · UTMB index ${ME.connections.utmb?.runnerIndex || 0} · ITRA ${ME.connections.itra.performanceIndex}.${raceBlock}`,
          }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: ApiPlan = await res.json();
        if (cancelled) return;
        if (!data.ok || !data.plan) throw new Error("Réponse plan invalide");
        setPlan(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message || "Erreur de génération");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    goal,
    level,
    userLevel,
    hydrated,
    levelMeta.volMul,
    levelMeta.label,
    levelMeta.specBlock,
    targetRace,
  ]);

  const current = plan?.plan?.[weekIdx];
  const phase = current ? PHASE_META[current.phase] : null;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/coach"
          className="rounded-xl card-chunky bg-bg-card p-2 text-ink-muted hover:text-cyan transition tap-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            Coach IA · Plan personnalisé
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            {meta.emoji} {meta.label}
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Bandeau course cible — quand on arrive depuis /race/[id] */}
      {targetRace && (
        <section className="rounded-2xl border-2 border-peach/40 bg-gradient-to-br from-peach/20 via-bg-card to-bg p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-peach/20 text-2xl">
              🎯
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
                Prépa calibrée · {weeksUntilRace(targetRace.date)} semaines
              </div>
              <div className="font-display text-base font-black leading-tight">
                Objectif : {targetRace.name}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                {targetRace.distance} km · {targetRace.elevation.toLocaleString("fr")} m D+ ·{" "}
                {new Date(targetRace.date).toLocaleDateString("fr", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </div>
              <Link
                href={`/race/${targetRace.id}`}
                className="mt-1.5 inline-block text-[10px] font-mono font-bold text-peach hover:underline"
              >
                Voir la course →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Loading state */}
      {loading && (
        <section className="rounded-3xl bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-6 card-chunky card-shine">
          <div className="flex items-start gap-4">
            <div className="text-5xl animate-float">🧠</div>
            <div className="flex-1">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                Coach IA · en réflexion
              </div>
              <h2 className="mt-1 font-display text-xl font-black leading-tight">
                Je conçois ton plan sur mesure…
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Analyse de tes {MY_RUNS.length} sorties récentes, volume{" "}
                {level.weeklyKm} km/sem, UTMB Index{" "}
                {ME.connections.utmb?.runnerIndex || "—"}, plus longue sortie{" "}
                {level.longestRun} km.
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg-raised">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-cyan" />
              </div>
              <div className="mt-2 text-[10px] font-mono text-ink-dim">
                Génération ~15 à 30 secondes
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {!loading && error && (
        <section className="rounded-3xl bg-mythic/10 border-2 border-mythic p-5 card-chunky">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-mythic">
            Erreur génération
          </div>
          <p className="mt-1 text-sm text-ink-muted">{error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-3 rounded-xl bg-mythic text-white px-4 py-2 font-display text-sm font-black card-chunky tap-bounce"
          >
            Réessayer
          </button>
        </section>
      )}

      {/* Plan content */}
      {!loading && plan && current && phase && (
        <>
          {/* Summary */}
          <section className="rounded-3xl bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-5 card-chunky card-shine">
            <div className="flex items-start gap-3">
              <div className="text-4xl">{meta.emoji}</div>
              <div className="flex-1">
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                  Objectif · {meta.distance}
                </div>
                <div className="mt-1 font-display text-xl font-black leading-tight">
                  {meta.label}
                </div>
                {plan.summary && (
                  <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                    {plan.summary}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">Durée</div>
                <div className="font-display text-base font-black text-cyan">
                  {plan.totalWeeks} sem.
                </div>
              </div>
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">Vol. pic</div>
                <div className="font-display text-base font-black text-peach">
                  {Math.max(...plan.plan.map((w) => w.weeklyKm))} km
                </div>
              </div>
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">D+ pic</div>
                <div className="font-display text-base font-black text-violet">
                  {Math.max(...plan.plan.map((w) => w.weeklyElevation))}m
                </div>
              </div>
              <div className="rounded-xl bg-bg-raised/60 p-2 text-center card-chunky-light">
                <div className="text-[9px] font-mono text-ink-muted">Séances</div>
                <div className="font-display text-base font-black text-lime">
                  {Math.round(
                    plan.plan.reduce((s, w) => s + w.sessions.length, 0) /
                      plan.plan.length
                  )}
                  /s
                </div>
              </div>
            </div>

            {/* Charge totale cumulée — retour panel test Théo */}
            <div className="mt-2 rounded-xl border-2 border-peach/30 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
                    Charge totale de la prépa
                  </div>
                  <div className="mt-1 flex items-baseline gap-4">
                    <div>
                      <span className="font-display text-2xl font-black text-peach">
                        {plan.plan.reduce((s, w) => s + w.weeklyKm, 0)}
                      </span>
                      <span className="ml-0.5 text-[11px] font-mono text-ink-muted">km</span>
                    </div>
                    <div>
                      <span className="font-display text-2xl font-black text-violet">
                        {plan.plan
                          .reduce((s, w) => s + w.weeklyElevation, 0)
                          .toLocaleString("fr")}
                      </span>
                      <span className="ml-0.5 text-[11px] font-mono text-ink-muted">m D+</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl opacity-60">🔋</div>
              </div>
              <div className="mt-1 text-[10px] font-mono text-ink-dim">
                Le total que tu vas avaler d&apos;ici la course. Lisse-le et
                hydrate, le reste suit.
              </div>
            </div>

            <div className="mt-3 text-[9px] font-mono text-ink-dim">
              Source : {plan.source}
            </div>
          </section>

          {/* Sélecteur niveau utilisateur — retour panel Quentin/Camille */}
          <section className="space-y-2">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
              Ton niveau · adapte le plan
            </div>
            <div className="rounded-2xl border border-cyan/25 bg-bg-card/60 p-3 space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {(["debutant", "confirme", "ultra"] as const).map((lvl) => {
                  const m = LEVEL_LABELS[lvl];
                  const active = userLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => pickLevel(lvl)}
                      className={`rounded-xl px-2 py-2 text-center transition ${
                        active
                          ? "bg-cyan/15 border-2 border-cyan text-cyan font-bold"
                          : "border border-ink/15 bg-bg-card/40 text-ink-muted hover:border-cyan/30"
                      }`}
                    >
                      <div className="font-display text-sm font-black">
                        {m.label}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-ink-muted leading-snug">
                <strong className="text-cyan">{levelMeta.label}</strong> :{" "}
                {levelMeta.tagline}.
              </p>
              <p className="text-[10px] font-mono text-ink-dim">
                Change ton niveau → on regénère un plan adapté
                {userLevel !== "confirme" && (
                  <span>
                    {" "}(volume ×{levelMeta.volMul} vs confirmé)
                  </span>
                )}
                .
              </p>
            </div>
          </section>

          {/* Zones FC perso — panel test Karim */}
          <HeartRateZones />

          {/* Week switcher */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-[10px] font-mono font-black uppercase tracking-widest ${phase.color}`}
                >
                  Phase {phase.label}
                </div>
                <div className="font-display text-xl font-black">
                  {current.label}
                </div>
                <div className="text-xs text-ink-muted">{current.focus}</div>
              </div>
              <div className="text-right text-[10px] font-mono text-ink-dim">
                {current.weeklyKm} km · {current.weeklyElevation}m D+
              </div>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {plan.plan.map((w, i) => (
                <button
                  key={w.week}
                  onClick={() => setWeekIdx(i)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-mono font-black transition card-chunky tap-bounce ${
                    i === weekIdx
                      ? "bg-cyan text-bg"
                      : "bg-bg-card text-ink-muted hover:bg-bg-raised"
                  }`}
                >
                  S{w.week}
                </button>
              ))}
            </div>
          </section>

          {/* Sessions */}
          <section className="space-y-2">
            {current.sessions.map((s, i) => {
              const tm = TYPE_META[s.type];
              // Plage BPM réelle si FC renseignée (panel Karim).
              const bpm =
                s.type === "rest" || s.type === "strength"
                  ? null
                  : bpmRangeForIntensity(hr, s.intensity);
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-3 ${tm.color.split(" ").slice(1).join(" ")} card-chunky`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-raised text-xl ${tm.color.split(" ")[0]}`}
                    >
                      {tm.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-black uppercase tracking-wider ${tm.color.split(" ")[0]}`}
                        >
                          {tm.label} ·{" "}
                          {s.intensity === "low"
                            ? "low"
                            : s.intensity === "moderate"
                              ? "mod"
                              : "high"}
                        </span>
                      </div>
                      <div className="font-display text-sm font-black truncate">
                        {s.title}
                      </div>
                      {s.notes && (
                        <div className="text-[11px] text-ink-muted leading-tight">
                          {s.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-[10px] font-mono shrink-0">
                      <div className="font-black text-ink">
                        {formatDuration(s.duration)}
                      </div>
                      {!!s.distance && (
                        <div className="text-ink-dim">{s.distance} km</div>
                      )}
                      {!!s.elevation && (
                        <div className="text-ink-dim">{s.elevation}m D+</div>
                      )}
                      {bpm && (
                        <div className="text-cyan font-bold">
                          ❤ {bpm.min}-{bpm.max}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Coach tip */}
          <section className="rounded-2xl bg-cyan/10 p-4 card-chunky">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
                Conseil du coach · {current.label.toLowerCase()}
              </div>
            </div>
            <p className="mt-2 text-sm text-ink">{current.coachTip}</p>
          </section>

          {/* Nutrition tip — gut training progressif */}
          {current.nutritionTip && (
            <section className="rounded-2xl bg-peach/10 border-2 border-peach/30 p-4 card-chunky">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍫</span>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
                  Gut training · {current.label.toLowerCase()}
                </div>
              </div>
              <p className="mt-2 text-sm text-ink">{current.nutritionTip}</p>
            </section>
          )}

          {/* Adjust */}
          <section className="rounded-2xl bg-peach/10 p-4 card-chunky">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
              Besoin d'ajuster ?
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Blessure, semaine chargée, déplacement pro : recharge la page
              en ajoutant des précisions dans freeText et le coach recalibre.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => location.reload()}
                className="flex-1 rounded-xl bg-peach py-2 text-[11px] font-mono font-black text-bg card-chunky tap-bounce"
              >
                🔄 Regénérer
              </button>
              <Link
                href="/coach"
                className="flex-1 rounded-xl bg-bg-raised py-2 text-center text-[11px] font-mono font-black text-ink-muted card-chunky tap-bounce"
              >
                ← Changer objectif
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default function CoachPlanPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 safe-top pb-6">
          <div className="mt-10 text-center text-ink-muted">Chargement…</div>
        </main>
      }
    >
      <CoachPlanInner />
    </Suspense>
  );
}
