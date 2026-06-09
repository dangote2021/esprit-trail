"use client";

// ====== /run/manual — Saisie manuelle d'une sortie ======
// Formulaire pour ajouter une sortie a posteriori (oubli de tracking,
// importée hors Strava, etc.). Sauvegardé dans localStorage via le module
// manual-runs, et apparaîtra dans l'historique du profil.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveManualRun, guessTerrain } from "@/lib/manual-runs";

const TERRAIN_OPTIONS = [
  { id: "flat" as const, label: "Plat", emoji: "🏞️" },
  { id: "hilly" as const, label: "Vallonné", emoji: "🌳" },
  { id: "mountain" as const, label: "Montagne", emoji: "⛰️" },
  { id: "alpine" as const, label: "Alpin", emoji: "🏔️" },
  { id: "technical" as const, label: "Technique", emoji: "🪨" },
];

export default function RunManualPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [distance, setDistance] = useState("");
  const [elevation, setElevation] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [terrain, setTerrain] = useState<
    "flat" | "hilly" | "mountain" | "alpine" | "technical" | null
  >(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const km = parseFloat(distance) || 0;
  const dplus = parseInt(elevation, 10) || 0;
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;
  const durationSec = h * 3600 + m * 60;

  // Auto-detect terrain quand l'user n'a pas choisi
  const computedTerrain = terrain ?? guessTerrain(km, dplus);

  const pace =
    km > 0 && durationSec > 0
      ? `${Math.floor(durationSec / km / 60)}:${Math.floor((durationSec / km) % 60)
          .toString()
          .padStart(2, "0")}/km`
      : "—";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Donne un nom à ta sortie.");
    if (km <= 0) return setError("La distance doit être > 0.");
    if (durationSec <= 0) return setError("Donne au moins une durée.");

    saveManualRun({
      id: `m-${Date.now()}`,
      date: new Date(date).toISOString(),
      title: title.trim(),
      location: location.trim() || undefined,
      distance: Math.round(km * 100) / 100,
      elevation: dplus,
      duration: durationSec,
      terrain: computedTerrain,
      source: "manual",
      notes: notes.trim() || undefined,
    });
    router.push("/profile");
  }

  return (
    <main className="mx-auto max-w-lg px-4 safe-top safe-bottom pb-10 space-y-5">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4">
        <Link
          href="/run/new"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Saisie manuelle
          </div>
          <h1 className="font-display text-xl font-black leading-none">
            Une sortie oubliée à rentrer
          </h1>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-4">
        {/* Titre */}
        <label className="block">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Nom de la sortie
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 80))}
            placeholder="Petite sortie dans les Bauges"
            className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-sm focus:border-lime focus:outline-none"
            required
          />
        </label>

        {/* Date + Lieu */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Date
            </span>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-sm focus:border-lime focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Lieu (optionnel)
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value.slice(0, 60))}
              placeholder="Bauges, Chamonix…"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-sm focus:border-lime focus:outline-none"
            />
          </label>
        </div>

        {/* Distance + D+ */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
              Distance (km)
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="18.5"
              min="0"
              step="0.1"
              max="500"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-base font-display font-black focus:border-peach focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
              D+ (m)
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
              placeholder="850"
              min="0"
              step="10"
              max="20000"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-base font-display font-black focus:border-cyan focus:outline-none"
            />
          </label>
        </div>

        {/* Durée */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet">
            Durée
          </span>
          <div className="mt-1 flex gap-2 items-center">
            <input
              type="number"
              inputMode="numeric"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="2"
              min="0"
              max="24"
              className="w-20 rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-base font-display font-black text-center focus:border-violet focus:outline-none"
            />
            <span className="text-sm text-ink-muted">h</span>
            <input
              type="number"
              inputMode="numeric"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="35"
              min="0"
              max="59"
              className="w-20 rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-base font-display font-black text-center focus:border-violet focus:outline-none"
            />
            <span className="text-sm text-ink-muted">min</span>
            <span className="ml-auto text-[11px] font-mono text-ink-dim">
              Allure : {pace}
            </span>
          </div>
        </div>

        {/* Terrain */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Terrain {terrain === null && km > 0 && (
              <em className="text-[9px] text-ink-dim normal-case">· deviné depuis le D+/km</em>
            )}
          </span>
          <div className="mt-1 grid grid-cols-5 gap-1.5">
            {TERRAIN_OPTIONS.map((t) => {
              const active = computedTerrain === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTerrain(t.id)}
                  className={`rounded-xl border-2 p-2 text-center transition ${
                    active
                      ? "border-lime bg-lime/10"
                      : "border-ink/10 bg-bg-card/40 hover:border-ink/20"
                  }`}
                >
                  <div className="text-lg">{t.emoji}</div>
                  <div
                    className={`text-[10px] font-mono font-bold ${
                      active ? "text-lime" : "text-ink-muted"
                    }`}
                  >
                    {t.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <label className="block">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Notes (optionnel)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 280))}
            placeholder="Sortie longue de prépa CCC, jambes nickel, pied dans la chaussette…"
            rows={2}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-sm resize-none focus:border-lime focus:outline-none"
          />
        </label>

        {error && (
          <div className="rounded-lg bg-mythic/10 border border-mythic/30 p-3 text-[12px] text-mythic">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-lime py-4 font-display text-base font-black uppercase tracking-wider text-bg shadow-glow-lime active:scale-[0.98] transition"
        >
          ✓ Enregistrer la sortie
        </button>

        <p className="text-center text-[11px] font-mono text-ink-dim">
          Stocké en local. Quand on aura le sync auto on remontera tout.
        </p>
      </form>
    </main>
  );
}
