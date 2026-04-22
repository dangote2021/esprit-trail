"use client";

import { useState } from "react";
import Link from "next/link";
import TQLogo from "@/components/ui/TQLogo";
import { CharacterAvatar } from "@/components/ui/CharacterAvatar";
import { TRAILER_CLASSES, statsForProfile } from "@/lib/trailer-class";
import {
  Character,
  DEFAULT_CHARACTER,
  SKIN_TONES,
  HAIR_COLORS,
  SHIRT_COLORS,
  SHORTS_COLORS,
  HAT_COLORS,
  SHOE_COLORS,
  SHOE_BRANDS,
  HAT_BRANDS,
  ShoeBrand,
  HatBrand,
  SkinTone,
} from "@/lib/character";
import type { TrailerClass, TrailerStats } from "@/lib/types";

// ====== ONBOARDING Esprit trail v3 — RPG CHARACTER CREATION ======
// Un flow de création de perso de jeu vidéo :
// 0 NOUVELLE PARTIE (splash)
// 1 MODE (Aventure / Performance)
// 2 CLASSE (Sprinter / Ultra / Alpiniste / Technicien / Flâneur)
// 3 PRATIQUE (années d'expérience, distance habituelle, plus grosse course)
// 4 CHARACTER (casquette + tshirt + chaussures — mode SIMS)
// 5 STATS (révélées animées depuis classe + années)
// 6 OBJECTIFS (goals)
// 7 SYNC (montres)
// 8 PRÊT À JOUER (récap + launch)

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Mode = "adventure" | "performance";
type CharTab = "tete" | "corps" | "jambes" | "pieds";

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

const WATCHES = [
  { id: "strava", name: "Strava", tagline: "Toutes tes sorties synchronisées", color: "bg-[#fc4c02]", logo: "S" },
  { id: "garmin", name: "Garmin Connect", tagline: "Forerunner, Fenix, Epix, Enduro…", color: "bg-[#007cc3]", logo: "G" },
  { id: "coros", name: "COROS", tagline: "Pace, Apex, Vertix…", color: "bg-black", logo: "C" },
  { id: "suunto", name: "Suunto", tagline: "Race, Vertical, Ocean…", color: "bg-[#00a7e1]", logo: "S" },
];

const TOTAL_CHAPTERS = 8;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("adventure");
  const [trailerClass, setTrailerClass] = useState<TrailerClass>("alpiniste");
  const [years, setYears] = useState(3);
  const [habitualDistance, setHabitualDistance] = useState(15);
  const [biggestRace, setBiggestRace] = useState("");
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  const [charTab, setCharTab] = useState<CharTab>("tete");
  const [goals, setGoals] = useState<string[]>([]);
  const [watches, setWatches] = useState<string[]>([]);

  // Stats computed from class + experience
  const stats: TrailerStats = statsForProfile(trailerClass, years);

  // Chapter progress (0-indexed shown as 1-indexed)
  const progress = Math.min(step, TOTAL_CHAPTERS);

  return (
    <main className="relative mx-auto min-h-screen max-w-lg overflow-hidden px-4 safe-top safe-bottom">
      {/* Ambient grid bg */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />
      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 hud-scan opacity-10" />

      {/* Chapter header — hidden on splash */}
      {step > 0 && (
        <div className="relative z-10 flex items-center justify-between pt-4 pb-3">
          <button
            onClick={() => setStep((Math.max(0, step - 1) as Step))}
            className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-lime transition"
          >
            ← Retour
          </button>
          <div className="text-center">
            <div className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-lime">
              CHAPITRE {progress} / {TOTAL_CHAPTERS}
            </div>
            {/* Progress dots */}
            <div className="mt-1 flex gap-1 justify-center">
              {Array.from({ length: TOTAL_CHAPTERS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-5 rounded-full transition ${
                    i < step ? "bg-lime shadow-glow-lime" : "bg-ink/15"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-16" />
        </div>
      )}

      <div className="relative z-10">
        {step === 0 && <StepSplash onStart={(n) => { setName(n); setStep(1); }} />}
        {step === 1 && <StepMode value={mode} onChange={setMode} onNext={() => setStep(2)} />}
        {step === 2 && (
          <StepClass
            value={trailerClass}
            onChange={setTrailerClass}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepPractice
            years={years}
            setYears={setYears}
            distance={habitualDistance}
            setDistance={setHabitualDistance}
            biggestRace={biggestRace}
            setBiggestRace={setBiggestRace}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepCharacter
            character={character}
            setCharacter={setCharacter}
            tab={charTab}
            setTab={setCharTab}
            onNext={() => setStep(5)}
          />
        )}
        {step === 5 && (
          <StepStats
            stats={stats}
            character={character}
            trailerClass={trailerClass}
            onNext={() => setStep(6)}
          />
        )}
        {step === 6 && (
          <StepGoals
            mode={mode}
            selected={goals}
            toggle={(id) =>
              setGoals((g) =>
                g.includes(id) ? g.filter((x) => x !== id) : [...g, id],
              )
            }
            onNext={() => setStep(7)}
          />
        )}
        {step === 7 && (
          <StepSync
            selected={watches}
            toggle={(id) =>
              setWatches((w) =>
                w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
              )
            }
            onNext={() => setStep(8)}
          />
        )}
        {step === 8 && (
          <StepReady
            name={name}
            mode={mode}
            trailerClass={trailerClass}
            character={character}
            stats={stats}
          />
        )}
      </div>
    </main>
  );
}

// ====== STEP 0 — SPLASH "NOUVELLE PARTIE" ======

function StepSplash({ onStart }: { onStart: (name: string) => void }) {
  const [n, setN] = useState("");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 text-center">
      <div className="animate-pulse-slow text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-lime">
        ═══ Nouvelle partie ═══
      </div>

      <div className="mt-6 animate-float">
        <TQLogo showBaseline />
      </div>

      <div className="mt-8 space-y-2">
        <div className="font-display text-4xl font-black leading-tight">
          Crée ton traileur
        </div>
        <p className="mx-auto max-w-xs text-sm text-ink-muted">
          Choisis ta classe, personnalise ton avatar, découvre tes stats.
          <br />
          <span className="text-lime">Le trail version RPG.</span>
        </p>
      </div>

      <div className="mt-8 w-full max-w-xs space-y-3">
        <label className="block text-left text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
          Nom de ton traileur
        </label>
        <input
          type="text"
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="Ex : Clem, Marco, Raven…"
          maxLength={20}
          className="w-full rounded-xl border border-lime/30 bg-bg-card px-4 py-3 text-center font-display text-lg font-black text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
        />
        <button
          onClick={() => onStart(n.trim() || "Traileur")}
          className="w-full rounded-xl bg-lime py-4 font-display text-lg font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.02]"
        >
          ▶ Commencer
        </button>
        <div className="text-[10px] font-mono text-ink-dim">
          Temps estimé : 2 min · Tout est modifiable plus tard
        </div>
      </div>
    </div>
  );
}

// ====== STEP 1 — MODE ======

function StepMode({
  value,
  onChange,
  onNext,
}: {
  value: Mode;
  onChange: (v: Mode) => void;
  onNext: () => void;
}) {
  return (
    <div className="py-4 space-y-5">
      <div className="text-center">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Choisis ton mode
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">Tu joues comment ?</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
          Pas de bonne réponse. Tu peux changer quand tu veux.
        </p>
      </div>

      <div className="space-y-3">
        <ModeCard
          active={value === "adventure"}
          onClick={() => onChange("adventure")}
          emoji="🎮"
          title="Mode Aventure"
          sub="XP, badges, loot, quêtes. Chaque sortie est une quête."
        />
        <ModeCard
          active={value === "performance"}
          onClick={() => onChange("performance")}
          emoji="📊"
          title="Mode Performance"
          sub="Data pro. Allures, FC, VO2, pas de fioritures."
        />
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        Continuer →
      </button>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  emoji,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        active
          ? "border-lime bg-lime/5 shadow-glow-lime"
          : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{emoji}</div>
        <div className="flex-1">
          <div className="font-display text-base font-black">{title}</div>
          <div className="mt-1 text-xs text-ink-muted">{sub}</div>
        </div>
        {active && <div className="text-lime">✓</div>}
      </div>
    </button>
  );
}

// ====== STEP 2 — CLASSE ======

function StepClass({
  value,
  onChange,
  onNext,
}: {
  value: TrailerClass;
  onChange: (v: TrailerClass) => void;
  onNext: () => void;
}) {
  return (
    <div className="py-4 space-y-5">
      <div className="text-center">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Choisis ta classe
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Quel traileur es-tu ?
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
          Ta classe détermine tes stats de départ. Tu peux évoluer.
        </p>
      </div>

      <div className="space-y-2">
        {TRAILER_CLASSES.map((c) => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active
                  ? `border-${c.color} bg-${c.color}/5 shadow-glow-${c.color}`
                  : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <div className={`font-display text-base font-black ${active ? `text-${c.color}` : ""}`}>
                      {c.name}
                    </div>
                    <div className={`text-[10px] font-mono uppercase ${active ? `text-${c.color}` : "text-ink-muted"}`}>
                      {c.tagline}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{c.description}</p>
                </div>
                {active && <div className={`text-${c.color}`}>✓</div>}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        Continuer →
      </button>
    </div>
  );
}

// ====== STEP 3 — PRATIQUE ======

function StepPractice({
  years,
  setYears,
  distance,
  setDistance,
  biggestRace,
  setBiggestRace,
  onNext,
}: {
  years: number;
  setYears: (n: number) => void;
  distance: number;
  setDistance: (n: number) => void;
  biggestRace: string;
  setBiggestRace: (s: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="py-4 space-y-5">
      <div className="text-center">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Ta pratique
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Parle-nous de toi
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
          Ça nous permet de calibrer tes stats initiales.
        </p>
      </div>

      {/* Years */}
      <div className="rounded-2xl border border-lime/20 bg-bg-card/60 p-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
            Années de trail
          </div>
          <div className="font-display text-3xl font-black text-lime">
            {years}
            <span className="text-sm font-mono text-ink-muted">
              {" "}
              {years === 0 ? "an" : years === 1 ? "an" : "ans"}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={years}
          onChange={(e) => setYears(parseInt(e.target.value))}
          className="mt-3 w-full accent-lime"
        />
        <div className="mt-1 flex justify-between text-[9px] font-mono text-ink-dim">
          <span>Débutant</span>
          <span>5 ans</span>
          <span>10 ans</span>
          <span>20+</span>
        </div>
      </div>

      {/* Habitual distance */}
      <div className="rounded-2xl border border-peach/20 bg-bg-card/60 p-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
            Distance habituelle par sortie
          </div>
          <div className="font-display text-3xl font-black text-peach">
            {distance}
            <span className="text-sm font-mono text-ink-muted"> km</span>
          </div>
        </div>
        <input
          type="range"
          min={3}
          max={80}
          step={1}
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
          className="mt-3 w-full accent-peach"
        />
        <div className="mt-1 flex justify-between text-[9px] font-mono text-ink-dim">
          <span>5 km</span>
          <span>20 km</span>
          <span>50 km</span>
          <span>80+</span>
        </div>
      </div>

      {/* Biggest race */}
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
          Plus grosse course déjà faite (optionnel)
        </label>
        <input
          type="text"
          value={biggestRace}
          onChange={(e) => setBiggestRace(e.target.value)}
          placeholder="Ex : MaXi-Race 58km, UTMB 171km…"
          className="mt-2 w-full rounded-xl border border-ink/15 bg-bg-card px-4 py-3 text-sm text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
        />
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        Continuer →
      </button>
    </div>
  );
}

// ====== STEP 4 — CHARACTER SIMS ======

function StepCharacter({
  character,
  setCharacter,
  tab,
  setTab,
  onNext,
}: {
  character: Character;
  setCharacter: (c: Character) => void;
  tab: CharTab;
  setTab: (t: CharTab) => void;
  onNext: () => void;
}) {
  function update(patch: Partial<Character>) {
    setCharacter({ ...character, ...patch });
  }

  return (
    <div className="py-4 space-y-4">
      <div className="text-center">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Mode SIMS
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Crée ton avatar
        </h1>
      </div>

      {/* Stage */}
      <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-b from-bg-card via-bg-raised to-bg-card py-3">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: character.shirtColor, opacity: 0.25 }}
        />
        <div className="flex items-center justify-center">
          <CharacterAvatar character={character} size={200} />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1">
        {(
          [
            { id: "tete", label: "Tête", emoji: "🧢" },
            { id: "corps", label: "Corps", emoji: "👕" },
            { id: "jambes", label: "Short", emoji: "🩳" },
            { id: "pieds", label: "Pieds", emoji: "👟" },
          ] as { id: CharTab; label: string; emoji: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl border py-2 text-[10px] font-display font-black uppercase tracking-wider transition ${
              tab === t.id
                ? "border-lime bg-lime/10 text-lime"
                : "border-ink/15 bg-bg-card/60 text-ink-muted hover:border-lime/40"
            }`}
          >
            <div>{t.emoji}</div>
            <div className="mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Panels (compact version) */}
      <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
        {tab === "tete" && (
          <>
            <OSection title="Casquette — marque">
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(HAT_BRANDS) as HatBrand[]).map((b) => (
                  <BChip
                    key={b}
                    active={character.hatBrand === b}
                    label={HAT_BRANDS[b].label}
                    onClick={() => update({ hatBrand: b })}
                  />
                ))}
              </div>
            </OSection>
            {character.hatBrand !== "none" && (
              <OSection title="Couleur casquette">
                <ColorsRow
                  colors={HAT_COLORS}
                  value={character.hatColor}
                  onChange={(color) => update({ hatColor: color })}
                />
              </OSection>
            )}
            <OSection title="Teint">
              <div className="flex gap-1.5">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ skinTone: s.id as SkinTone })}
                    className={`flex-1 rounded-lg border-2 p-1 transition ${
                      character.skinTone === s.id
                        ? "border-lime"
                        : "border-transparent"
                    }`}
                  >
                    <div
                      className="h-8 w-full rounded"
                      style={{ backgroundColor: s.color }}
                    />
                  </button>
                ))}
              </div>
            </OSection>
            <OSection title="Cheveux">
              <div className="flex flex-wrap gap-1.5">
                {HAIR_COLORS.map((h) => (
                  <button
                    key={h.color}
                    onClick={() => update({ hairColor: h.color })}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      character.hairColor === h.color
                        ? "border-lime scale-110"
                        : "border-ink/15"
                    }`}
                    style={{ backgroundColor: h.color }}
                  />
                ))}
              </div>
            </OSection>
            <OSection title="Accessoire">
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: "none", label: "—", emoji: "—" },
                    { id: "sunglasses", label: "Lunettes", emoji: "🕶️" },
                    { id: "headband", label: "Bandeau", emoji: "🎽" },
                    { id: "watch", label: "Montre", emoji: "⌚" },
                  ] as const
                ).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => update({ accessory: a.id })}
                    className={`rounded-lg border px-1.5 py-2 text-center transition ${
                      character.accessory === a.id
                        ? "border-lime bg-lime/10"
                        : "border-ink/15 bg-bg-card/60"
                    }`}
                  >
                    <div className="text-lg">{a.emoji}</div>
                    <div className="mt-0.5 text-[9px] font-mono uppercase text-ink-muted">
                      {a.label}
                    </div>
                  </button>
                ))}
              </div>
            </OSection>
          </>
        )}

        {tab === "corps" && (
          <OSection title="T-shirt — couleur">
            <ColorsRow
              colors={SHIRT_COLORS}
              value={character.shirtColor}
              onChange={(color) => update({ shirtColor: color })}
            />
          </OSection>
        )}

        {tab === "jambes" && (
          <OSection title="Short — couleur">
            <ColorsRow
              colors={SHORTS_COLORS}
              value={character.shortsColor}
              onChange={(color) => update({ shortsColor: color })}
            />
          </OSection>
        )}

        {tab === "pieds" && (
          <>
            <OSection title="Chaussures — marque">
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(SHOE_BRANDS) as ShoeBrand[]).map((b) => (
                  <BChip
                    key={b}
                    active={character.shoeBrand === b}
                    label={SHOE_BRANDS[b].label}
                    onClick={() => update({ shoeBrand: b })}
                  />
                ))}
              </div>
            </OSection>
            <OSection title="Couleur chaussures">
              <ColorsRow
                colors={SHOE_COLORS}
                value={character.shoeColor}
                onChange={(color) => update({ shoeColor: color })}
              />
            </OSection>
          </>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        Valider le personnage →
      </button>
    </div>
  );
}

function OSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-[9px] font-mono font-bold uppercase tracking-widest text-ink-muted">
        {title}
      </div>
      {children}
    </div>
  );
}

function ColorsRow({
  colors,
  value,
  onChange,
}: {
  colors: { color: string; label: string }[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => (
        <button
          key={c.color}
          onClick={() => onChange(c.color)}
          aria-label={c.label}
          className={`h-8 w-8 rounded-lg border-2 transition ${
            value === c.color
              ? "border-lime scale-110 shadow-glow-lime"
              : "border-ink/15"
          }`}
          style={{ backgroundColor: c.color }}
        />
      ))}
    </div>
  );
}

function BChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2 py-1.5 text-left text-[11px] font-bold transition ${
        active
          ? "border-lime bg-lime/10 text-lime"
          : "border-ink/15 bg-bg-card/60 text-ink"
      }`}
    >
      {label}
    </button>
  );
}

// ====== STEP 5 — STATS REVEAL ======

function StepStats({
  stats,
  character,
  trailerClass,
  onNext,
}: {
  stats: TrailerStats;
  character: Character;
  trailerClass: TrailerClass;
  onNext: () => void;
}) {
  const classDef = TRAILER_CLASSES.find((c) => c.id === trailerClass)!;
  const total = stats.endurance + stats.vitesse + stats.technique + stats.mental + stats.grimpe;

  return (
    <div className="py-4 space-y-5">
      <div className="text-center">
        <div className="animate-pulse-slow text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-lime">
          ═ Stats révélées ═
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Ta feuille de perso
        </h1>
      </div>

      {/* Character + class */}
      <div className="flex items-center gap-4 rounded-2xl border border-lime/25 bg-gradient-to-r from-lime/5 via-bg-card to-bg-card p-4">
        <div className="flex h-28 w-24 items-center justify-center rounded-xl border border-lime/30 bg-bg-raised">
          <CharacterAvatar character={character} size={90} showGround={false} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
            Classe
          </div>
          <div className="font-display text-xl font-black">
            {classDef.emoji} {classDef.name}
          </div>
          <div className="text-xs italic text-ink-muted">"{classDef.tagline}"</div>
          <div className="mt-2 inline-flex rounded-md bg-lime/10 px-2 py-0.5 text-[10px] font-mono font-black text-lime">
            PUISSANCE {total}
          </div>
        </div>
      </div>

      {/* Stats bars */}
      <div className="space-y-3 rounded-2xl border border-ink/10 bg-bg-card/40 p-4">
        <StatBar label="Endurance" value={stats.endurance} color="peach" />
        <StatBar label="Vitesse" value={stats.vitesse} color="lime" />
        <StatBar label="Technique" value={stats.technique} color="violet" />
        <StatBar label="Mental" value={stats.mental} color="cyan" />
        <StatBar label="Grimpe" value={stats.grimpe} color="gold" />
      </div>

      <p className="text-center text-xs text-ink-muted">
        Tes stats évolueront à chaque sortie. <br />
        Plus tu t'entraînes, plus elles montent.
      </p>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        Je valide →
      </button>
    </div>
  );
}

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "lime" | "peach" | "cyan" | "violet" | "gold";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </div>
        <div className={`font-display text-sm font-black text-${color}`}>
          {value}
          <span className="text-[10px] font-mono text-ink-dim"> /100</span>
        </div>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg-raised">
        <div
          className={`h-full rounded-full bg-${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ====== STEP 6 — GOALS ======

function StepGoals({
  mode,
  selected,
  toggle,
  onNext,
}: {
  mode: Mode;
  selected: string[];
  toggle: (id: string) => void;
  onNext: () => void;
}) {
  const goals = mode === "adventure" ? GOALS_ADVENTURE : GOALS_PERFORMANCE;
  return (
    <div className="py-4 space-y-5">
      <div className="text-center">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Objectifs
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Tu vises quoi ?
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
          Choisis-en autant que tu veux.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {goals.map((g) => {
          const on = selected.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`rounded-xl border p-3 text-left text-xs transition ${
                on
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-ink/15 bg-bg-card/60 text-ink hover:border-lime/40"
              }`}
            >
              <div className="text-xl">{g.emoji}</div>
              <div className="mt-1 font-bold leading-tight">{g.label}</div>
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={selected.length === 0}
        className={`w-full rounded-xl py-4 font-display font-black uppercase tracking-wider transition ${
          selected.length > 0
            ? "bg-lime text-bg shadow-glow-lime hover:scale-[1.01]"
            : "bg-bg-card text-ink-dim cursor-not-allowed"
        }`}
      >
        Continuer →
      </button>
    </div>
  );
}

// ====== STEP 7 — SYNC ======

function StepSync({
  selected,
  toggle,
  onNext,
}: {
  selected: string[];
  toggle: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="py-4 space-y-5">
      <div className="text-center">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Synchronise ton équipement
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Connecte tes montres
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
          Optionnel. Tu peux le faire plus tard.
        </p>
      </div>
      <div className="space-y-2">
        {WATCHES.map((w) => {
          const on = selected.includes(w.id);
          return (
            <button
              key={w.id}
              onClick={() => toggle(w.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                on
                  ? "border-lime bg-lime/5"
                  : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${w.color} font-display text-sm font-black text-white`}
              >
                {w.logo}
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-black">{w.name}</div>
                <div className="text-[11px] text-ink-muted">{w.tagline}</div>
              </div>
              <div className={`text-sm font-mono font-bold ${on ? "text-lime" : "text-ink-dim"}`}>
                {on ? "✓" : "+"}
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        className="w-full rounded-xl bg-lime py-4 font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
      >
        Terminer →
      </button>
    </div>
  );
}

// ====== STEP 8 — READY TO PLAY ======

function StepReady({
  name,
  mode,
  trailerClass,
  character,
  stats,
}: {
  name: string;
  mode: Mode;
  trailerClass: TrailerClass;
  character: Character;
  stats: TrailerStats;
}) {
  const classDef = TRAILER_CLASSES.find((c) => c.id === trailerClass)!;
  const total = stats.endurance + stats.vitesse + stats.technique + stats.mental + stats.grimpe;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-8 text-center">
      <div className="animate-pulse-slow text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-lime">
        ═══ Partie prête ═══
      </div>

      <div className="relative mt-4">
        <div className="absolute -inset-4 animate-pulse-slow rounded-3xl bg-lime/10 blur-2xl" />
        <div className="relative flex h-44 w-36 items-center justify-center rounded-2xl border border-lime/40 bg-bg-card shadow-glow-lime">
          <CharacterAvatar character={character} size={150} showGround={false} />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="font-display text-3xl font-black">{name}</div>
        <div className="text-sm">
          {classDef.emoji}{" "}
          <span className={`text-${classDef.color} font-bold`}>{classDef.name}</span>
          <span className="text-ink-muted"> · LVL 1 · </span>
          <span className="text-lime font-mono font-bold">PWR {total}</span>
        </div>
        <div className="text-xs text-ink-muted">
          Mode {mode === "adventure" ? "Aventure 🎮" : "Performance 📊"}
        </div>
      </div>

      <div className="mt-8 w-full max-w-xs">
        <Link
          href="/"
          className="block w-full rounded-xl bg-lime py-4 font-display text-lg font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.02]"
        >
          ▶ Lance le jeu
        </Link>
        <div className="mt-3 text-[10px] font-mono text-ink-dim">
          Tu pourras tout modifier depuis ton profil.
        </div>
      </div>
    </div>
  );
}
