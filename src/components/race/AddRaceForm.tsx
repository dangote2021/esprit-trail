"use client";

// ====== AddRaceForm ======
// Modale "Proposer une course" — supporte les 2 modes :
// - "on"  : course officielle classique (UTMB / circuit / etc.)
// - "off" : course pirate / FKT / crew / GR project
//
// Champs adaptés au mode. Submit persiste dans localStorage (cf. user-races.ts)
// et émet un événement pour rafraîchir la liste sur /races.
// Phase 2 : POST /api/races avec modération admin avant publication.

import { useState } from "react";
import type { RaceCategory } from "@/lib/types";
import type { OffCategory } from "@/lib/data/off-races";
import {
  addUserRace,
  addUserOffRace,
  type UserRaceDraft,
  type UserOffRaceDraft,
} from "@/lib/data/user-races";
import {
  submitUserRace as submitToServer,
  submitUserOffRace as submitOffToServer,
} from "@/lib/supabase/user-races";

type Mode = "on" | "off";

const ON_CATS: { id: RaceCategory; label: string; range: string }[] = [
  { id: "XS", label: "XS", range: "< 25 km" },
  { id: "S", label: "S", range: "25-44 km" },
  { id: "M", label: "M", range: "45-74 km" },
  { id: "L", label: "L", range: "75-114 km" },
  { id: "XL", label: "XL", range: "115+ km" },
];

const OFF_CATS: { id: OffCategory; label: string; emoji: string }[] = [
  { id: "fkt", label: "FKT", emoji: "⚡" },
  { id: "confidential", label: "Confidentielle", emoji: "🤫" },
  { id: "pirate", label: "Pirate", emoji: "🏴‍☠️" },
  { id: "crew", label: "Crew run", emoji: "👥" },
  { id: "gr-project", label: "GR projet", emoji: "🥾" },
];

export default function AddRaceForm({
  mode,
  onClose,
  onSubmitted,
}: {
  mode: Mode;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("France");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState<number | "">("");
  const [elevation, setElevation] = useState<number | "">("");
  const [tagline, setTagline] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");

  // ON-only
  const [category, setCategory] = useState<RaceCategory>("M");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [itraPoints, setItraPoints] = useState<number | "">("");

  // OFF-only
  const [offCategory, setOffCategory] = useState<OffCategory>("pirate");
  const [vibe, setVibe] = useState("");
  const [soul, setSoul] = useState("");
  const [recordHolder, setRecordHolder] = useState("");
  const [recordTime, setRecordTime] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function validateOn(): string | null {
    if (!name.trim()) return "Donne un nom à la course";
    if (!location.trim()) return "Indique la localisation";
    if (!date) return "Choisis une date";
    if (!distance || Number(distance) <= 0) return "Distance manquante";
    if (!elevation && elevation !== 0) return "Dénivelé manquant";
    if (!tagline.trim()) return "Une accroche en une phrase, stp";
    return null;
  }

  function validateOff(): string | null {
    if (!name.trim()) return "Donne un nom à la course";
    if (!location.trim()) return "Indique la localisation";
    if (!distance || Number(distance) <= 0) return "Distance manquante";
    if (!elevation && elevation !== 0) return "Dénivelé manquant";
    if (!tagline.trim()) return "Une accroche en une phrase, stp";
    if (!vibe.trim()) return "Décris l'ambiance en quelques mots";
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "on") {
        const err = validateOn();
        if (err) {
          setError(err);
          setSubmitting(false);
          return;
        }
        const draft: UserRaceDraft = {
          name,
          location,
          country,
          date,
          distance: Number(distance),
          elevation: Number(elevation),
          category,
          itraPoints: itraPoints === "" ? 0 : Number(itraPoints),
          difficulty,
          tagline,
          officialUrl: officialUrl.trim() || undefined,
        };
        // 1. Tente le push Supabase (visible par toute la communauté).
        const fromServer = await submitToServer(draft);
        // 2. Toujours persister en localStorage en plus (works offline + fallback non-logged).
        addUserRace(draft);
        if (!fromServer) {
          // Pas connecté → l'écriture serveur a échoué, mais le local fonctionne.
          // On affiche un message informatif mais on continue.
          console.info(
            "[AddRaceForm] saved locally only — sign in to share publicly",
          );
        }
      } else {
        const err = validateOff();
        if (err) {
          setError(err);
          setSubmitting(false);
          return;
        }
        const draft: UserOffRaceDraft = {
          name,
          location,
          country,
          distance: Number(distance),
          elevation: Number(elevation),
          category: offCategory,
          tagline,
          vibe,
          soul: soul.trim() || vibe.trim(),
          recordHolder: recordHolder.trim() || undefined,
          recordTime: recordTime.trim() || undefined,
        };
        const fromServer = await submitOffToServer(draft);
        addUserOffRace(draft);
        if (!fromServer) {
          console.info(
            "[AddRaceForm] saved locally only — sign in to share publicly",
          );
        }
      }
      onSubmitted?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-race-title"
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-bg-card border-t-2 sm:border-2 border-peach/40 p-5 space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="sm:hidden mx-auto h-1.5 w-12 rounded-full bg-ink/20 -mt-1" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 sticky top-0 bg-bg-card py-1">
          <div>
            <div
              className={`text-[10px] font-mono font-black uppercase tracking-widest ${
                mode === "on" ? "text-peach" : "text-violet"
              }`}
            >
              {mode === "on" ? "Proposer une course ON" : "Proposer une course OFF"}
            </div>
            <h3
              id="add-race-title"
              className="font-display text-xl font-black text-ink leading-tight"
            >
              {mode === "on" ? "Une course officielle à ajouter ?" : "Tu as un spot pirate à partager ?"}
            </h3>
            <p className="text-[11px] text-ink-muted mt-1">
              {mode === "on"
                ? "Course classique avec dossard, ITRA, etc."
                : "FKT, course confidentielle, crew run, GR project"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg border border-ink/15 bg-bg-raised/60 px-2.5 py-1 text-ink-muted hover:text-ink shrink-0"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {/* Nom */}
          <Field label="Nom de la course" htmlFor="r-name">
            <input
              id="r-name"
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Trail du Vieux Phare, Bouzin Trail 50k…"
              className={inputCls}
            />
          </Field>

          {/* Tagline */}
          <Field label="Tagline (accroche en 1 phrase)" htmlFor="r-tag">
            <input
              id="r-tag"
              type="text"
              required
              maxLength={120}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex: Boucle sauvage sur les crêtes du Cap"
              className={inputCls}
            />
          </Field>

          {/* Lieu + Pays */}
          <div className="grid grid-cols-2 gap-2">
            <Field label="Localisation" htmlFor="r-loc">
              <input
                id="r-loc"
                type="text"
                required
                maxLength={60}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Cassis"
                className={inputCls}
              />
            </Field>
            <Field label="Pays" htmlFor="r-country">
              <input
                id="r-country"
                type="text"
                maxLength={40}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="France"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Date (ON only — OFF souvent permanent) */}
          {mode === "on" && (
            <Field label="Date" htmlFor="r-date">
              <input
                id="r-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </Field>
          )}

          {/* Distance + D+ */}
          <div className="grid grid-cols-2 gap-2">
            <Field label="Distance (km)" htmlFor="r-dist">
              <input
                id="r-dist"
                type="number"
                required
                min={1}
                max={500}
                value={distance}
                onChange={(e) =>
                  setDistance(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="42"
                className={inputCls}
              />
            </Field>
            <Field label="D+ (m)" htmlFor="r-elev">
              <input
                id="r-elev"
                type="number"
                required
                min={0}
                max={30000}
                value={elevation}
                onChange={(e) =>
                  setElevation(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="2400"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Mode-specific fields */}
          {mode === "on" ? (
            <>
              {/* Catégorie ITRA */}
              <Field label="Catégorie ITRA">
                <div className="flex flex-wrap gap-1.5">
                  {ON_CATS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`rounded-md border px-2.5 py-1 text-[11px] font-mono font-bold transition ${
                        category === c.id
                          ? "border-peach bg-peach/15 text-peach"
                          : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {c.label}
                      <span className="ml-1 opacity-60">· {c.range}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Difficulté */}
              <Field label="Difficulté">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDifficulty(n as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 rounded-md py-1 text-[11px] font-mono font-bold transition ${
                        n <= difficulty
                          ? "bg-peach text-bg"
                          : "bg-ink/10 text-ink-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>

              {/* ITRA points + URL */}
              <div className="grid grid-cols-2 gap-2">
                <Field label="Points ITRA (optionnel)" htmlFor="r-itra">
                  <input
                    id="r-itra"
                    type="number"
                    min={0}
                    max={10}
                    value={itraPoints}
                    onChange={(e) =>
                      setItraPoints(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="3"
                    className={inputCls}
                  />
                </Field>
                <Field label="Site officiel (URL)" htmlFor="r-url">
                  <input
                    id="r-url"
                    type="url"
                    value={officialUrl}
                    onChange={(e) => setOfficialUrl(e.target.value)}
                    placeholder="https://…"
                    className={inputCls}
                  />
                </Field>
              </div>
            </>
          ) : (
            <>
              {/* Catégorie OFF */}
              <Field label="Type">
                <div className="flex flex-wrap gap-1.5">
                  {OFF_CATS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setOffCategory(c.id)}
                      className={`rounded-md border px-2.5 py-1 text-[11px] font-mono font-bold transition ${
                        offCategory === c.id
                          ? "border-violet bg-violet/15 text-violet"
                          : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Vibe + Soul */}
              <Field label="Ambiance (vibe)" htmlFor="r-vibe">
                <input
                  id="r-vibe"
                  type="text"
                  required
                  maxLength={80}
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  placeholder="Ex: Brut · sauvage · pas de balisage"
                  className={inputCls}
                />
              </Field>

              <Field label="L'âme (pourquoi cette course mérite d'exister)" htmlFor="r-soul">
                <textarea
                  id="r-soul"
                  rows={2}
                  maxLength={200}
                  value={soul}
                  onChange={(e) => setSoul(e.target.value)}
                  placeholder="Pas de dossard, juste un GPX et tes potes."
                  className={`${inputCls} resize-y`}
                />
              </Field>

              {/* Record (FKT) */}
              {offCategory === "fkt" && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Record (qui)" htmlFor="r-rh">
                    <input
                      id="r-rh"
                      type="text"
                      maxLength={60}
                      value={recordHolder}
                      onChange={(e) => setRecordHolder(e.target.value)}
                      placeholder="Ex: Killian Jornet"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Temps" htmlFor="r-rt">
                    <input
                      id="r-rt"
                      type="text"
                      maxLength={20}
                      value={recordTime}
                      onChange={(e) => setRecordTime(e.target.value)}
                      placeholder="31h06"
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}
            </>
          )}

          {/* Erreur */}
          {error && (
            <div className="rounded-lg border border-mythic/40 bg-mythic/10 px-3 py-2 text-xs text-mythic">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-ink/15 bg-bg-card/60 py-3 font-mono text-sm font-black uppercase tracking-wider text-ink-muted hover:text-ink transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 rounded-xl py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-md transition disabled:opacity-50 ${
                mode === "on" ? "bg-peach" : "bg-violet"
              }`}
            >
              {submitting ? "…" : "Publier"}
            </button>
          </div>

          <p className="text-[10px] font-mono text-ink-dim text-center pt-1">
            🤝 Visible immédiatement pour la communauté · Modération douce
          </p>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-lime/50 focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted block"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
