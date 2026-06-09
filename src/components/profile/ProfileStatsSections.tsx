"use client";

// ====== ProfileStatsSections ======
// Sections "Cette semaine" + "Saison en cours" du profil, calculées à
// partir des VRAIES sorties (esprit_manual_runs). Profil neuf = encart
// vide invitant à enregistrer une première sortie. Zéro mock data.

import { useEffect, useState } from "react";
import Link from "next/link";
import StatTile from "@/components/ui/StatTile";
import SectionHeader from "@/components/ui/SectionHeader";
import { loadProfileAgg, type ProfileAgg } from "@/lib/profile-stats";

function fmt(n: number) {
  return n.toLocaleString("fr", { maximumFractionDigits: 1 });
}

export default function ProfileStatsSections() {
  const [agg, setAgg] = useState<ProfileAgg | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAgg(loadProfileAgg());
    const refresh = () => setAgg(loadProfileAgg());
    window.addEventListener("esprit:runs", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit:runs", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) return null;

  // Profil neuf — aucune sortie enregistrée
  if (!agg || agg.totalRuns === 0) {
    return (
      <section className="space-y-3">
        <SectionHeader eyebrow="Stats" title="Tes chiffres" />
        <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card/40 p-6 text-center">
          <div className="text-4xl">🥾</div>
          <div className="mt-2 font-display text-base font-black text-ink">
            Pas encore de sortie au compteur
          </div>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Enregistre ta première sortie et tes stats se rempliront ici —
            km, D+, plus longue trace. Les pieds boueux, ça se mérite.
          </p>
          <Link
            href="/run/new"
            className="mt-4 inline-block rounded-xl bg-lime px-5 py-2.5 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime"
          >
            Enregistrer une sortie
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Rythme de la semaine */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Rythme" title="Cette semaine" />
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="Km sem." value={fmt(agg.weekDistance)} unit="km" accent="lime" />
          <StatTile label="D+ sem." value={fmt(agg.weekElevation)} unit="m" accent="peach" />
          <StatTile label="Sorties" value={agg.weekRuns} accent="cyan" />
        </div>
      </section>

      {/* Stats saison */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Stats" title="Saison en cours" />
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="Distance" value={fmt(agg.totalDistance)} unit="km" accent="lime" />
          <StatTile
            label="D+"
            value={fmt(Math.round(agg.totalElevation / 100) / 10)}
            unit="K m"
            accent="peach"
          />
          <StatTile label="Sorties" value={agg.totalRuns} accent="cyan" />
          <StatTile label="Plus long" value={fmt(agg.longestRun)} unit="km" accent="violet" />
        </div>
      </section>
    </>
  );
}
