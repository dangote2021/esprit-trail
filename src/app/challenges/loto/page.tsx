// ====== /challenges/loto — Liste des dossards en jeu ======
// Page publique (partage WhatsApp possible). On présente les challenges actifs,
// chaque card montre : course, jackpot dossard, deadline, nombre de tickets en jeu.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BIB_CHALLENGES,
  computeEligibility,
  computeUserVolume30d,
  daysUntilDraw,
  type BibChallenge,
} from "@/lib/data/bib-challenges";
import { MY_RUNS } from "@/lib/data/me";

export const metadata: Metadata = {
  title: "Dossards en jeu",
  description:
    "Accomplis un challenge trail (20 km, 1000 D+, sortie longue…) et tente de gagner gratuitement un dossard sur une course partenaire ou un FKT collectif.",
  openGraph: {
    title: "Dossards en jeu — Esprit Trail",
    description:
      "Cours, gagne un ticket, vise un vrai dossard. 100% gratuit, 0% gambling.",
  },
};

const ACCENTS: Record<BibChallenge["accent"], { border: string; bg: string; text: string; chip: string }> = {
  lime:   { border: "border-lime/50",   bg: "bg-lime/10",   text: "text-lime",   chip: "bg-lime/15"   },
  cyan:   { border: "border-cyan/50",   bg: "bg-cyan/10",   text: "text-cyan",   chip: "bg-cyan/15"   },
  peach:  { border: "border-peach/50",  bg: "bg-peach/10",  text: "text-peach",  chip: "bg-peach/15"  },
  violet: { border: "border-violet/50", bg: "bg-violet/10", text: "text-violet", chip: "bg-violet/15" },
  gold:   { border: "border-gold/50",   bg: "bg-gold/10",   text: "text-gold",   chip: "bg-gold/15"   },
};

export default function LotoListPage() {
  const userVolume = computeUserVolume30d(MY_RUNS);
  return (
    <main className="mx-auto max-w-lg px-5 safe-top pb-12 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-xl card-chunky bg-bg-card p-2 text-ink-muted hover:text-lime transition tap-bounce"
          aria-label="Retour à l'accueil"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Tirage gratuit
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            Dossards en jeu
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-lime/10 to-bg p-6 card-shine">
        <div className="pointer-events-none absolute -right-6 -top-6 text-[160px] opacity-[0.08] leading-none select-none">
          🎫
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-peach/25 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider text-peach">
            <span className="h-1.5 w-1.5 rounded-full bg-peach animate-pulse" />
            Nouvelle feature Esprit Trail
          </div>
          <h2 className="mt-3 font-display text-2xl font-black leading-tight">
            Tu cours, tu gagnes un ticket. Tu vises un vrai dossard.
          </h2>
          <p className="mt-2 text-sm text-ink leading-relaxed">
            Chaque challenge te file 1 ticket dans le tirage. Tu invites un pote
            via WhatsApp ? +1 ticket, lui aussi. Au bout, des organisateurs
            mettent leurs dossards à dispo — courses partenaires et FKT indé.{" "}
            <strong>Zéro mise. Zéro frais.</strong>
          </p>
          <p className="mt-3 text-[11px] text-ink-muted leading-relaxed">
            Esprit Trail n'organise pas un jeu d'argent : c'est un cadeau partenaire,
            réglé par les organisateurs pour rencontrer une vraie audience de
            traileurs.
          </p>
        </div>
      </section>

      {/* Liste */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
            {BIB_CHALLENGES.filter((c) => c.status === "open").length} tirages
            ouverts
          </div>
          <Link
            href="/organisateurs"
            className="text-[11px] font-mono font-bold uppercase tracking-wider text-lime hover:underline"
          >
            T'es organisateur ? →
          </Link>
        </div>

        {BIB_CHALLENGES.map((c) => {
          const a = ACCENTS[c.accent];
          const days = daysUntilDraw(c);
          const elig = computeEligibility(c, userVolume);
          return (
            <Link
              key={c.id}
              href={`/challenges/loto/${c.slug}`}
              className={`block rounded-3xl border-2 ${a.border} ${a.bg} overflow-hidden transition hover:scale-[1.01]`}
            >
              {/* Hero image course */}
              <div
                className="relative h-32 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${c.heroImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />

                {/* Sceau countdown — visible et urgent en haut à droite */}
                <div className="absolute top-2 right-2 flex flex-col items-center rounded-xl bg-peach px-3 py-1.5 text-bg shadow-lg ring-2 ring-white/30">
                  <div className="text-[8px] font-mono font-black uppercase tracking-wider leading-none">
                    Tirage
                  </div>
                  <div className="font-display text-xl font-black leading-none mt-0.5">
                    J-{days}
                  </div>
                  {days <= 7 && (
                    <div className="text-[8px] font-mono font-black uppercase tracking-wider leading-none mt-0.5 animate-pulse">
                      ⚡ urgent
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-black uppercase tracking-wider text-white/80">
                      {c.organizer}
                    </div>
                    <div className="font-display text-lg font-black leading-tight text-white">
                      {c.raceName}
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider ${a.chip} ${a.text} backdrop-blur`}>
                    {c.bibCount} dossard{c.bibCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <p className={`font-display text-base font-black leading-snug ${a.text}`}>
                  {c.tagline}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised/80 px-2 py-1">
                    🎯 {c.targetLabel}
                  </span>
                  {c.bibValue > 0 && (
                    <span className="rounded-md bg-bg-raised/80 px-2 py-1">
                      💸 {c.bibValue}€ × {c.bibCount}
                    </span>
                  )}
                  <span className="rounded-md bg-bg-raised/80 px-2 py-1">
                    🥾 {c.entryRequirement.kmLast30Days} km / 30j requis
                  </span>
                </div>

                {/* Statut éligibilité user */}
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] ${
                    elig.eligible
                      ? "bg-lime/15 text-lime"
                      : "bg-amber/10 text-amber"
                  }`}
                >
                  <span className="font-mono font-black">
                    {elig.eligible ? "✓" : "🔒"}
                  </span>
                  <span className="flex-1">
                    {elig.eligible ? (
                      <strong>Tu es éligible</strong>
                    ) : (
                      <>
                        <strong>{elig.percent}% du volume</strong> — niveau{" "}
                        {c.entryRequirement.difficultyLabel.toLowerCase()}
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>
                    <strong className="text-ink">{c.participants.toLocaleString("fr-FR")}</strong>{" "}
                    participants •{" "}
                    <strong className="text-ink">{c.ticketsSold.toLocaleString("fr-FR")}</strong>{" "}
                    tickets en jeu
                  </span>
                  <span className={`font-mono font-bold ${a.text}`}>
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* CTA bas */}
      <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4 text-center space-y-2">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Comment ça marche
        </div>
        <p className="text-xs text-ink leading-relaxed">
          1. Tu vérifies que ton volume 30 jours débloque l'accès au tirage.<br />
          2. Tu choisis le challenge à accomplir (ex: 20 km de trail).<br />
          3. Tu cours, tu enregistres l'activité, tu déclares — 1 ticket.<br />
          4. Tu invites des potes WhatsApp — +1 ticket par pote (max +5).<br />
          5. Le jour J, on tire au sort. T'as un dossard, t'as un dossard.
        </p>
        <p className="text-[10px] text-ink-dim leading-relaxed mt-2">
          Le seuil d'accès est calibré sur la difficulté de chaque épreuve —
          c'est la garantie qu'on file le dossard à un coureur capable de
          l'honorer.
        </p>
      </section>

      <Link
        href="/"
        className="block rounded-2xl bg-lime py-4 text-center font-display font-black uppercase tracking-wider text-bg btn-chunky tap-bounce"
      >
        ← Retour à l'app
      </Link>
    </main>
  );
}
