"use client";

// ====== ManualRunsList ======
// Affiche les sorties stockées localement (saisie manuelle + tracker GPS
// natif) sur le profil. Chaque ligne est cliquable pour aller éditer.
// Retour panel Théo : "j'ai mis 12 km au lieu de 12.5, je peux plus changer".

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadManualRuns, type ManualRun } from "@/lib/manual-runs";

function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}`;
  return `${m}min`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function ManualRunsList() {
  const [runs, setRuns] = useState<ManualRun[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRuns(loadManualRuns());
  }, []);

  if (!mounted) return null;
  if (runs.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Tes sorties enregistrées
        </div>
        <span className="text-[10px] font-mono text-ink-dim">
          {runs.length} {runs.length > 1 ? "sorties" : "sortie"}
        </span>
      </div>
      <div className="space-y-2">
        {runs.slice(0, 8).map((r) => (
          <Link
            key={r.id}
            href={`/run/manual/${r.id}/edit`}
            className="block rounded-xl border border-ink/10 bg-bg-card/60 p-3 transition hover:border-lime/40 active:scale-[0.99]"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                  r.source === "tracker"
                    ? "bg-lime/15 text-lime"
                    : "bg-peach/15 text-peach"
                }`}
              >
                {r.source === "tracker" ? "🛰️" : "✎"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-display text-sm font-black text-ink truncate">
                    {r.title}
                  </div>
                  <div className="ml-auto text-[10px] font-mono text-ink-dim">
                    {fmtDate(r.date)}
                  </div>
                </div>
                <div className="text-[11px] text-ink-muted">
                  {r.distance.toFixed(1)} km · {r.elevation}m D+ ·{" "}
                  {fmtDuration(r.duration)}
                  {r.location && <span> · {r.location}</span>}
                </div>
              </div>
              <span className="text-ink-dim text-xs">✎</span>
            </div>
          </Link>
        ))}
      </div>
      {runs.length > 8 && (
        <p className="text-center text-[10px] font-mono text-ink-dim">
          + {runs.length - 8} autres
        </p>
      )}
    </section>
  );
}
