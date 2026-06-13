"use client";

// ====== RecentRuns ======
// Section "Tes dernières sorties" de la home. Affiche les VRAIES sorties
// enregistrées (esprit_manual_runs : manuel + tracker GPS). Profil neuf =
// encart d'invitation, jamais de sorties fictives.

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { loadManualRuns, type ManualRun } from "@/lib/manual-runs";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr", { day: "numeric", month: "short" });
}

function formatPace(run: ManualRun): string | null {
  if (!run.distance || !run.duration) return null;
  const secPerKm = run.duration / run.distance;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
}

const TERRAIN_EMOJI: Record<string, string> = {
  alpine: "🏔️",
  mountain: "⛰️",
  hilly: "🌲",
  technical: "🪨",
  flat: "➖",
};

export default function RecentRuns() {
  const [runs, setRuns] = useState<ManualRun[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRuns(loadManualRuns());
    const refresh = () => setRuns(loadManualRuns());
    window.addEventListener("esprit:runs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit:runs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) return null;

  // Profil neuf — aucune sortie
  if (runs.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeader eyebrow="Replay" title="Tes dernières sorties" />
        <Link
          href="/run/new"
          className="block rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card/40 p-5 text-center transition hover:border-lime/40"
        >
          <div className="text-3xl">👟</div>
          <div className="mt-2 font-display text-sm font-black text-ink">
            Ta première sortie t&apos;attend
          </div>
          <div className="mt-1 text-[11px] text-ink-muted leading-relaxed">
            Lance le tracker ou saisis une sortie — elle s&apos;affichera ici,
            les pieds boueux et tout.
          </div>
          <span className="mt-3 inline-block rounded-lg bg-lime px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-bg">
            Enregistrer une sortie
          </span>
        </Link>
      </section>
    );
  }

  const recent = runs.slice(0, 3);

  return (
    <section className="space-y-3">
      <SectionHeader
        eyebrow="Replay"
        title="Tes dernières sorties"
        href="/profile"
        linkLabel="Historique"
      />
      <div className="space-y-2">
        {recent.map((run) => {
          const pace = formatPace(run);
          return (
            <Link
              key={run.id}
              href={`/run/manual/${run.id}/edit`}
              className="flex items-center gap-3 rounded-2xl bg-bg-card p-3 card-chunky card-pressable tap-bounce transition hover:-translate-y-0.5"
            >
              <div className="text-3xl">
                {TERRAIN_EMOJI[run.terrain || "flat"] || "➖"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-black">{run.title}</div>
                <div className="flex gap-2 text-[11px] text-ink-muted">
                  <span>{formatDate(run.date)}</span>
                  <span className="text-ink-dim">·</span>
                  <span>{run.distance.toFixed(1)} km</span>
                  <span className="text-ink-dim">·</span>
                  <span>{run.elevation} D+</span>
                </div>
              </div>
              {pace && (
                <div className="font-mono text-[11px] font-bold text-lime shrink-0">
                  {pace}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
