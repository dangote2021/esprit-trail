"use client";

import { useState } from "react";
import Link from "next/link";
import TQLogo from "@/components/ui/TQLogo";

// ====== ONBOARDING Esprit trail v2 ======
// 6 étapes (affichées comme 4 dans la progress) :
// 0 Welcome → 1 Mode (Aventure/Performance) → 2 Goals → 3 Niveau+Rythme
// → 4 Sync (Strava/Garmin/COROS/Suunto + UTMB/ITRA optionnels)
// → 5 Ready

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Mode = "adventure" | "performance";

const GOALS_ADVENTURE = [
  { id: "first-trail", emoji: "🏁", label: "Finir mon premier trail" },
  { id: "fun", emoji: "🌿", label: "Juste prendre du plaisir" },
  { id: "regularity", emoji: "🔁", label: "Courir plus régulièrement" },
  { id: "local", emoji: "🌲", label: "Explorer les trails près de chez moi" },
  { id: "longer", emoji: "📏", label: "Aller plus loin qu'avant" },
  { id: "d-plus", emoji: "⛰️", label: "Chasser le D+" },
  { id: "social", emoji: "🤝", label: "Rencontrer d'autres traileurs" },
  { id: "stories", emoji: "📸", label: "Partager mes sorties" },
];

const GOALS_PERFORMANCE = [
  { id: "improve-pb", emoji: "⚡", label: "Battre mes chronos" },
  { id: "first-ultra", emoji: "🔥", label: "Préparer un ultra" },
  { id: "utmb-prep", emoji: "👑", label: "Qualification UTMB" },
  { id: "d-plus", emoji: "⛰️", label: "Gros volumes D+" },
  { id: "technique", emoji: "🪨", label: "Technique descente" },
  { id: "vma", emoji: "🎯", label: "Travail VMA / seuil" },
  { id: "vertical", emoji: "📐", label: "KV / course verticale" },
  { id: "podium", emoji: "🏆", label: "Podium / classements" },
];

const LEVELS = [
  { id: "rookie", emoji: "🌱", label: "Débutant", sub: "0-1 an de trail" },
  { id: "regular", emoji: "🏃", label: "Régulier", sub: "Quelques courses, j'avance" },
  { id: "confirmed", emoji: "⛰️", label: "Confirmé", sub: "Ultras, gros D+, habitué" },
  { id: "elite", emoji: "👑", label: "Élite", sub: "Podium, qualifs UTMB" },
];

const RHYTHMS = [
  { id: 1, emoji: "🌿", label: "1×/sem", sub: "Tranquille" },
  { id: 2, emoji: "🏃", label: "2×/sem", sub: "Régulier" },
  { id: 3, emoji: "🔥", label: "3×/sem", sub: "Solide" },
  { id: 4, emoji: "⚡", label: "4×+", sub: "Intensif" },
];

const WATCHES = [
  {
    id: "strava",
    name: "Strava",
    tagline: "Toutes tes sorties synchronisées",
    color: "bg-[#fc4c02]",
    logo: "S",
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    tagline: "Forerunner, Fenix, Epix, Enduro…",
    color: "bg-[#007cc3]",
    logo: "G",
  },
  {
    id: "coros",
    name: "COROS",
    tagline: "Pace, Apex, Vertix…",
    color: "bg-black",
    logo: "C",
  },
  {
    id: "suunto",
    name: "Suunto",
    tagline: "Race, Vertical, Ocean…",
    color: "bg-[#00a7e1]",
    logo: "S",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(0);
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [rhythm, setRhythm] = useState<number | null>(null);
  const [watches, setWatches] = useState<string[]>([]);
  const [utmbValue, setUtmbValue] = useState<string>("");
  const [itraValue, setItraValue] = useState<string>("");

  const toggleGoal = (id: string) =>
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  const toggleWatch = (id: string) =>
    setWatches((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const next = () => setStep((s) => Math.min(5, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  // Progress steps: Welcome(0) doesn't count, 1-4 = 4 dots, 5 = done
  const progressIndex = step === 0 ? 0 : step;

  return (
    <main className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 safe-top safe-bottom">
      {/* Header / progress */}
      <header className="flex items-center justify-between py-4">
        <TQLogo size={28} />
        {step > 0 && step < 5 && step !== 1 && (
          <button
            onClick={next}
            className="text-xs font-mono font-bold uppercase tracking-wider text-ink-dim hover:text-lime transition"
          >
            Passer →
          </button>
        )}
      </header>

      {step > 0 && (
        <div className="mb-4 flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= progressIndex ? "bg-lime" : "bg-bg-card"
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 animate-slide-up">
        {step === 0 && (
          <StepWelcome
            displayName={displayName}
            setDisplayName={setDisplayName}
            onNext={next}
          />
        )}
        {step === 1 && <StepMode mode={mode} onSelect={setMode} />}
        {step === 2 && <StepGoals mode={mode} goals={goals} toggle={toggleGoal} />}
        {step === 3 && (
          <StepLevelAndRhythm
            level={level}
            setLevel={setLevel}
            rhythm={rhythm}
            setRhythm={setRhythm}
            mode={mode}
          />
        )}
        {step === 4 && (
          <StepSync
            watches={watches}
            toggle={toggleWatch}
            mode={mode}
            utmbValue={utmbValue}
            setUtmbValue={setUtmbValue}
            itraValue={itraValue}
            setItraValue={setItraValue}
          />
        )}
        {step === 5 && (
          <StepReady
            displayName={displayName || "Traileur"}
            mode={mode}
          />
        )}
      </div>

      {step > 0 && step < 5 && (
        <div className="sticky bottom-4 flex items-center gap-2 py-2">
          <button
            onClick={back}
            className="rounded-xl border border-ink/20 px-4 py-3 text-sm font-bold text-ink-muted transition hover:text-ink"
          >
            ← Retour
          </button>
          <button
            onClick={next}
            disabled={step === 1 && !mode}
            className="flex-1 rounded-xl bg-lime py-3 text-center text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Continuer →
          </button>
        </div>
      )}
    </main>
  );
}

// ====== STEP 0 — WELCOME ======
function StepWelcome({
  displayName,
  setDisplayName,
  onNext,
}: {
  displayName: string;
  setDisplayName: (s: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
      <div className="animate-pop-in text-7xl">🏔️</div>
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Bienvenue sur Esprit trail
        </div>
        <h1 className="font-display text-4xl font-black leading-tight mt-1">
          Le trail,
          <br />
          il a <span className="text-lime">changé</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-ink-muted">
          Tu choisis ton mode, tes objectifs, ton rythme. L'app s'adapte.
          Pas l'inverse.
        </p>
      </div>

      <div className="w-full space-y-2 pt-2">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
          Ton prénom (ou pseudo)
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Guillaume"
          className="w-full rounded-xl border border-lime/20 bg-bg-card px-4 py-3 text-center text-lg font-bold outline-none focus:border-lime transition"
        />
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 text-center font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        C'est parti 🚀
      </button>
      <p className="text-[10px] font-mono text-ink-dim">
        30 secondes. Tu peux tout skip.
      </p>
    </div>
  );
}

// ====== STEP 1 — MODE (NEW) ======
function StepMode({
  mode,
  onSelect,
}: {
  mode: Mode | null;
  onSelect: (m: Mode) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Étape 1 / 4 · Comment tu cours ?
        </div>
        <h2 className="font-display text-3xl font-black leading-tight mt-1">
          Choisis ton mode.
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Tu pourras changer à tout moment dans les paramètres.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSelect("adventure")}
          className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
            mode === "adventure"
              ? "border-lime bg-lime/10 shadow-glow-lime"
              : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
          }`}
        >
          <div className="text-4xl">🎮</div>
          <div className="flex-1">
            <div className="font-display text-xl font-black leading-tight">
              Mode Aventure
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              Full gamification. XP, badges, quêtes, loot, classements. Chaque
              sortie est une quête, chaque trail une légende.
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["XP + niveaux", "Badges", "Quêtes", "Loot", "Classements"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-md bg-lime/15 px-2 py-0.5 text-[10px] font-mono font-bold text-lime"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
          {mode === "adventure" && (
            <div className="rounded-md bg-lime/20 px-2 py-1 text-[10px] font-mono font-bold text-lime">
              ✓
            </div>
          )}
        </button>

        <button
          onClick={() => onSelect("performance")}
          className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
            mode === "performance"
              ? "border-cyan bg-cyan/10 shadow-glow-cyan"
              : "border-ink/15 bg-bg-card/60 hover:border-cyan/40"
          }`}
        >
          <div className="text-4xl">📊</div>
          <div className="flex-1">
            <div className="font-display text-xl font-black leading-tight">
              Mode Performance
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              Data d'entraînement pro. Charge, zones, GAP, splits, plans IA.
              Gamification discrète — badges uniquement pour les vrais
              accomplissements.
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["UTMB Index", "ITRA", "Plans IA", "Charge CTL/TSB", "Analyse"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-md bg-cyan/15 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
          {mode === "performance" && (
            <div className="rounded-md bg-cyan/20 px-2 py-1 text-[10px] font-mono font-bold text-cyan">
              ✓
            </div>
          )}
        </button>
      </div>

      <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-3 text-[11px] text-ink-dim text-center">
        Pas sûr ? Commence en Aventure, bascule quand tu veux.
      </div>
    </div>
  );
}

// ====== STEP 2 — GOALS (mode-aware) ======
function StepGoals({
  mode,
  goals,
  toggle,
}: {
  mode: Mode | null;
  goals: string[];
  toggle: (id: string) => void;
}) {
  const list = mode === "performance" ? GOALS_PERFORMANCE : GOALS_ADVENTURE;
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Étape 2 / 4 · Tes objectifs
        </div>
        <h2 className="font-display text-3xl font-black leading-tight mt-1">
          Qu'est-ce qui te botte ?
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Coche tout ce qui te parle. On adapte les quêtes et les défis.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {list.map((g) => {
          const active = goals.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`rounded-xl border p-3 text-left transition ${
                active
                  ? "border-lime bg-lime/10 shadow-glow-lime"
                  : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
              }`}
            >
              <div className="text-2xl">{g.emoji}</div>
              <div className="mt-1 text-xs font-bold leading-tight">
                {g.label}
              </div>
              {active && (
                <div className="mt-1 text-[10px] font-mono text-lime">✓ choisi</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs font-mono text-ink-dim">
        {goals.length === 0
          ? "Coche au moins un objectif (ou skip en haut à droite)"
          : `${goals.length} objectif${goals.length > 1 ? "s" : ""} sélectionné${
              goals.length > 1 ? "s" : ""
            }`}
      </div>
    </div>
  );
}

// ====== STEP 3 — LEVEL + RHYTHM (combined) ======
function StepLevelAndRhythm({
  level,
  setLevel,
  rhythm,
  setRhythm,
  mode,
}: {
  level: string | null;
  setLevel: (id: string) => void;
  rhythm: number | null;
  setRhythm: (n: number) => void;
  mode: Mode | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Étape 3 / 4 · Ton niveau
        </div>
        <h2 className="font-display text-3xl font-black leading-tight mt-1">
          Où tu en es aujourd'hui ?
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Pas de jugement. Ton profil évolue à chaque sortie.
        </p>
      </div>

      <div className="space-y-2">
        {LEVELS.map((l) => {
          const active = level === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-3.5 text-left transition ${
                active
                  ? "border-lime bg-lime/10 shadow-glow-lime"
                  : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
              }`}
            >
              <div className="text-3xl">{l.emoji}</div>
              <div className="flex-1">
                <div className="font-display text-lg font-black leading-tight">
                  {l.label}
                </div>
                <div className="text-xs text-ink-muted">{l.sub}</div>
              </div>
              {active && (
                <div className="rounded-md bg-lime/20 px-2 py-1 text-[10px] font-mono font-bold text-lime">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Rhythm — réponse au feedback "streak quotidien anxiogène" */}
      <div className="space-y-3 pt-2">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Ton rythme visé
          </div>
          <div className="text-sm font-bold">
            Combien de sorties par semaine ?
          </div>
          <p className="text-[11px] text-ink-muted">
            Ton streak et tes quêtes s'adaptent. Pas de pression pour courir tous
            les jours.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {RHYTHMS.map((r) => {
            const active = rhythm === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRhythm(r.id)}
                className={`rounded-xl border p-3 text-center transition ${
                  active
                    ? "border-peach bg-peach/10 shadow-glow-peach"
                    : "border-ink/15 bg-bg-card/60 hover:border-peach/40"
                }`}
              >
                <div className="text-2xl">{r.emoji}</div>
                <div className="mt-1 text-xs font-black">{r.label}</div>
                <div className="text-[9px] font-mono text-ink-muted">{r.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ====== STEP 4 — SYNC (Watches + UTMB/ITRA optional) ======
function StepSync({
  watches,
  toggle,
  mode,
  utmbValue,
  setUtmbValue,
  itraValue,
  setItraValue,
}: {
  watches: string[];
  toggle: (id: string) => void;
  mode: Mode | null;
  utmbValue: string;
  setUtmbValue: (s: string) => void;
  itraValue: string;
  setItraValue: (s: string) => void;
}) {
  const [showRanking, setShowRanking] = useState(mode === "performance");

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Étape 4 / 4 · Sync
        </div>
        <h2 className="font-display text-3xl font-black leading-tight mt-1">
          Connecte tes sources.
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Tes sorties existantes remontent automatiquement. Sync sans fil,
          dédoublonnage auto.
        </p>
      </div>

      <div className="space-y-2">
        {WATCHES.map((w) => {
          const active = watches.includes(w.id);
          return (
            <button
              key={w.id}
              onClick={() => toggle(w.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-3 text-left transition ${
                active
                  ? "border-lime bg-lime/10 shadow-glow-lime"
                  : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${w.color} font-display text-xl font-black text-white`}
              >
                {w.logo}
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-black leading-tight">
                  {w.name}
                </div>
                <div className="text-[11px] text-ink-muted">{w.tagline}</div>
              </div>
              <div
                className={`text-[11px] font-mono font-bold ${
                  active ? "text-lime" : "text-ink-dim"
                }`}
              >
                {active ? "✓" : "Connecter"}
              </div>
            </button>
          );
        })}
      </div>

      {/* UTMB/ITRA — collapsed by default unless mode=performance */}
      <div className="rounded-xl border border-cyan/20 bg-bg-card/40">
        <button
          onClick={() => setShowRanking((s) => !s)}
          className="flex w-full items-center justify-between p-3 text-left"
        >
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
              Optionnel · Pro uniquement
            </div>
            <div className="text-sm font-bold">Classements officiels UTMB / ITRA</div>
          </div>
          <div className="text-cyan text-sm">{showRanking ? "−" : "+"}</div>
        </button>

        {showRanking && (
          <div className="px-3 pb-3 space-y-3 animate-slide-up">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
                Ton UTMB Index (si tu en as un)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={utmbValue}
                onChange={(e) => setUtmbValue(e.target.value)}
                placeholder="ex: 625"
                className="mt-1 w-full rounded-lg border border-cyan/20 bg-bg-raised/60 px-3 py-2 text-sm outline-none focus:border-cyan transition"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet">
                Ton ITRA Performance Index
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={itraValue}
                onChange={(e) => setItraValue(e.target.value)}
                placeholder="ex: 612"
                className="mt-1 w-full rounded-lg border border-violet/20 bg-bg-raised/60 px-3 py-2 text-sm outline-none focus:border-violet transition"
              />
            </div>
            <p className="text-[10px] font-mono text-ink-dim">
              Pas d'index ? Normal. On calculera ta valeur à partir de tes
              sorties Strava/Garmin. Tu pourras relier ton compte utmb.world
              plus tard.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-peach/20 bg-peach/5 p-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
          Pro tip
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          Tu peux tout sauter et connecter plus tard depuis ton profil.
          L'app fonctionne aussi en saisie manuelle.
        </p>
      </div>
    </div>
  );
}

// ====== STEP 5 — READY (mode-aware) ======
function StepReady({
  displayName,
  mode,
}: {
  displayName: string;
  mode: Mode | null;
}) {
  const isPerformance = mode === "performance";
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-slide-up">
      <div className="text-7xl animate-pop-in">
        {isPerformance ? "📊" : "🎮"}
      </div>
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Profil créé
        </div>
        <h1 className="font-display text-4xl font-black leading-tight mt-1">
          On y va,
          <br />
          <span className="text-lime">{displayName}</span> ?
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-ink-muted">
          {isPerformance
            ? "Ton dashboard est prêt. Connecte ton plan d'entraînement et commence à tracker."
            : "Ton avatar est créé. Tes premières quêtes t'attendent. Il ne manque plus qu'une chose : sortir."}
        </p>
      </div>

      {!isPerformance && (
        <div className="w-full rounded-xl border border-lime/20 bg-bg-card/60 p-4 text-left">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
            Récompense d'arrivée
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-lime/20 text-2xl">
              🎁
            </div>
            <div>
              <div className="font-display font-black">Starter Pack</div>
              <div className="text-[11px] text-ink-muted">
                100 XP de bienvenue · Titre "Apprenti Traileur" · Booster Double XP (1h)
              </div>
            </div>
          </div>
        </div>
      )}

      {isPerformance && (
        <div className="w-full rounded-xl border border-cyan/20 bg-bg-card/60 p-4 text-left">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
            Prochaine étape recommandée
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/20 text-2xl">
              🧠
            </div>
            <div>
              <div className="font-display font-black">Coach IA</div>
              <div className="text-[11px] text-ink-muted">
                Génère ton plan d'entraînement selon ton objectif et ton calendrier.
              </div>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/"
        className="block w-full rounded-xl bg-lime py-4 text-center font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        {isPerformance ? "Ouvrir mon dashboard →" : "Entrer dans le jeu 🎯"}
      </Link>
    </div>
  );
}
