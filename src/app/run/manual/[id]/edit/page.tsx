"use client";

// ====== /run/manual/[id]/edit — Éditer une sortie déjà enregistrée ======
// Retour panel Théo : "j'ai mis 12 km au lieu de 12.5, je peux plus changer".
// Charge la sortie depuis localStorage, réutilise le même form que la
// saisie manuelle, et écrit la mise à jour via updateManualRun.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  findManualRun,
  updateManualRun,
  guessTerrain,
  type ManualRun,
} from "@/lib/manual-runs";

const TERRAIN_OPTIONS = [
  { id: "flat" as const, label: "Plat", emoji: "🏞️" },
  { id: "hilly" as const, label: "Vallonné", emoji: "🌳" },
  { id: "mountain" as const, label: "Montagne", emoji: "⛰️" },
  { id: "alpine" as const, label: "Alpin", emoji: "🏔️" },
  { id: "technical" as const, label: "Technique", emoji: "🪨" },
];

export default function RunManualEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loaded, setLoaded] = useState<ManualRun | null | undefined>(undefined);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [elevation, setElevation] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [terrain, setTerrain] = useState<
    "flat" | "hilly" | "mountain" | "alpine" | "technical" | null
  >(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const r = findManualRun(id);
    setLoaded(r ?? null);
    if (r) {
      setTitle(r.title);
      setLocation(r.location || "");
      setDate(r.date.slice(0, 10));
      setDistance(String(r.distance));
      setElevation(String(r.elevation));
      setHours(String(Math.floor(r.duration / 3600)));
      setMinutes(String(Math.floor((r.duration % 3600) / 60)));
      setTerrain(r.terrain || null);
      setNotes(r.notes || "");
    }
  }, [id]);

  const km = parseFloat(distance) || 0;
  const dplus = parseInt(elevation, 10) || 0;
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;
  const durationSec = h * 3600 + m * 60;
  const computedTerrain = terrain ?? guessTerrain(km, dplus);

  if (loaded === undefined) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-10">
        <p className="mt-10 text-center text-ink-muted">Chargement…</p>
      </main>
    );
  }
  if (loaded === null) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-6 text-center">
        <p className="mt-10 text-ink-muted">Cette sortie n&apos;existe pas (ou plus).</p>
        <Link href="/profile" className="mt-4 inline-block text-lime underline">
          Retour au profil
        </Link>
      </main>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Donne un nom à ta sortie.");
    if (km <= 0) return setError("La distance doit être > 0.");
    if (durationSec <= 0) return setError("Donne au moins une durée.");

    updateManualRun(id, {
      date: new Date(date).toISOString(),
      title: title.trim(),
      location: location.trim() || undefined,
      distance: Math.round(km * 100) / 100,
      elevation: dplus,
      duration: durationSec,
      terrain: computedTerrain,
      notes: notes.trim() || undefined,
    });
    router.push("/profile");
  }

  return (
    <main className="mx-auto max-w-lg px-4 safe-top safe-bottom pb-10 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <Link
          href="/profile"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2.5 text-ink-muted hover:text-lime"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Modifier la sortie
          </div>
          <h1 className="font-display text-xl font-black leading-none">
            Corrige ce qui cloche
          </h1>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Nom de la sortie
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 80))}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-sm focus:border-lime focus:outline-none"
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Date
            </span>
            <input
              type="date"
              value={date}
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
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-sm focus:border-lime focus:outline-none"
            />
          </label>
        </div>

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
              min="0"
              step="10"
              max="20000"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-base font-display font-black focus:border-cyan focus:outline-none"
            />
          </label>
        </div>

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
              min="0"
              max="59"
              className="w-20 rounded-xl border border-ink/15 bg-bg-card/60 px-3 py-2.5 text-base font-display font-black text-center focus:border-violet focus:outline-none"
            />
            <span className="text-sm text-ink-muted">min</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Terrain
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
                      : "border-ink/10 bg-bg-card/40"
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

        <label className="block">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Notes
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 280))}
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
          ✓ Enregistrer les modifs
        </button>

        <Link
          href="/profile"
          className="block w-full rounded-2xl border border-ink/15 py-3 text-center text-xs font-mono font-bold uppercase text-ink-muted"
        >
          Annuler
        </Link>
      </form>
    </main>
  );
}
