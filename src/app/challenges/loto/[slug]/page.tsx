// ====== /challenges/loto/[slug] — Détail d'un dossard en jeu ======
// Page publique (les liens partagés via WhatsApp doivent ouvrir sans login).
// L'action "Je participe / Done" et le partage utilisent le client component.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BIB_CHALLENGES,
  computeEligibility,
  computeUserVolume30d,
  daysUntilDraw,
  findChallengeBySlug,
} from "@/lib/data/bib-challenges";
import { MY_RUNS } from "@/lib/data/me";
import LotoActions from "./LotoActions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BIB_CHALLENGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = findChallengeBySlug(slug);
  if (!c) return { title: "Tirage introuvable" };
  return {
    title: `${c.raceName} — Dossard à gagner`,
    description: c.tagline,
    openGraph: {
      title: `${c.raceName} — ${c.bibCount} dossard${c.bibCount > 1 ? "s" : ""} à gagner`,
      description: `${c.tagline} Challenge : ${c.targetLabel}.`,
      images: [c.heroImage],
    },
  };
}

const ACCENTS: Record<string, { border: string; bg: string; text: string; btn: string }> = {
  lime:   { border: "border-lime/50",   bg: "bg-lime/10",   text: "text-lime",   btn: "bg-lime"   },
  cyan:   { border: "border-cyan/50",   bg: "bg-cyan/10",   text: "text-cyan",   btn: "bg-cyan"   },
  peach:  { border: "border-peach/50",  bg: "bg-peach/10",  text: "text-peach",  btn: "bg-peach"  },
  violet: { border: "border-violet/50", bg: "bg-violet/10", text: "text-violet", btn: "bg-violet" },
  gold:   { border: "border-gold/50",   bg: "bg-gold/10",   text: "text-gold",   btn: "bg-gold"   },
};

export default async function LotoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const c = findChallengeBySlug(slug);
  if (!c) notFound();

  const a = ACCENTS[c.accent];
  const days = daysUntilDraw(c);
  const drawDate = new Date(c.drawAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const closesDate = new Date(c.closesAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
  const raceDate = new Date(c.raceDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Volume 30 jours du user (mock à partir de MY_RUNS) → éligibilité
  const userVolume = computeUserVolume30d(MY_RUNS);
  const elig = computeEligibility(c, userVolume);

  return (
    <main className="mx-auto max-w-lg pb-12 safe-top">
      {/* Hero image */}
      <div
        className="relative h-56 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${c.heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <Link
          href="/challenges/loto"
          className="absolute top-4 left-4 rounded-xl bg-bg-card/90 backdrop-blur p-2 text-ink-muted hover:text-lime transition"
          aria-label="Retour à la liste"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-white/80">
            {c.organizer}
          </div>
          <h1 className="font-display text-3xl font-black leading-tight text-white drop-shadow-lg">
            {c.raceName}
          </h1>
          <div className="mt-1 text-xs text-white/85">
            📍 {c.raceLocation} • {raceDate}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5 mt-5">
        {/* Tagline */}
        <p className={`font-display text-xl font-black leading-snug ${a.text}`}>
          {c.tagline}
        </p>

        {/* Stats clés */}
        <section className={`rounded-3xl border-2 ${a.border} ${a.bg} p-5 space-y-3`}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Dossards</div>
              <div className={`font-display text-2xl font-black ${a.text}`}>{c.bibCount}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Valeur</div>
              <div className={`font-display text-2xl font-black ${a.text}`}>
                {c.bibValue > 0 ? `${c.bibValue}€` : "Pack"}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Tirage</div>
              <div className={`font-display text-2xl font-black ${a.text}`}>J-{days}</div>
            </div>
          </div>
          <div className="rounded-xl bg-bg-card/60 p-3 text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              À gagner
            </div>
            <div className="text-sm font-display font-black text-ink mt-0.5">
              {c.bibCategory}
            </div>
          </div>
        </section>

        {/* Éligibilité — volume 30 jours requis */}
        <section
          className={`rounded-3xl border-2 p-5 space-y-3 ${
            elig.eligible
              ? "border-lime/50 bg-lime/10"
              : "border-amber/40 bg-amber/10"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className={`text-[10px] font-mono font-black uppercase tracking-widest ${
                  elig.eligible ? "text-lime" : "text-amber"
                }`}
              >
                Niveau d'éligibilité — {c.entryRequirement.difficultyLabel}
              </div>
              <h2 className="font-display text-lg font-black text-ink">
                {elig.eligible ? "Tu peux participer 🎫" : "Pas encore éligible"}
              </h2>
              <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">
                Pour décrocher un dossard {c.raceName}, faut avoir cumulé{" "}
                <strong className="text-ink">
                  {c.entryRequirement.kmLast30Days} km
                </strong>{" "}
                et{" "}
                <strong className="text-ink">
                  {c.entryRequirement.dPlusLast30Days.toLocaleString("fr-FR")} m
                  D+
                </strong>{" "}
                sur les 30 derniers jours. Garde-fou commun avec l'organisateur.
              </p>
            </div>
            <div
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-mono font-black uppercase tracking-wider ${
                elig.eligible
                  ? "bg-lime/20 text-lime"
                  : "bg-amber/20 text-amber"
              }`}
            >
              {elig.percent}%
            </div>
          </div>

          {/* Jauge km */}
          <div>
            <div className="flex items-baseline justify-between text-[11px] font-mono">
              <span className="text-ink-muted uppercase tracking-wider">
                Distance
              </span>
              <span className="text-ink">
                <strong>{elig.km.done.toLocaleString("fr-FR")}</strong>
                <span className="text-ink-muted">
                  {" "}
                  / {elig.km.needed} km
                </span>
                {!elig.eligible && elig.km.remaining > 0 ? (
                  <span className="text-amber">
                    {" "}
                    · encore {elig.km.remaining} km
                  </span>
                ) : null}
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className={`h-full rounded-full transition-all ${
                  elig.km.done >= elig.km.needed ? "bg-lime" : "bg-amber"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((elig.km.done / Math.max(1, elig.km.needed)) * 100),
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Jauge D+ */}
          <div>
            <div className="flex items-baseline justify-between text-[11px] font-mono">
              <span className="text-ink-muted uppercase tracking-wider">
                Dénivelé positif
              </span>
              <span className="text-ink">
                <strong>{elig.dPlus.done.toLocaleString("fr-FR")}</strong>
                <span className="text-ink-muted">
                  {" "}
                  / {elig.dPlus.needed.toLocaleString("fr-FR")} m
                </span>
                {!elig.eligible && elig.dPlus.remaining > 0 ? (
                  <span className="text-amber">
                    {" "}
                    · encore {elig.dPlus.remaining.toLocaleString("fr-FR")} m
                  </span>
                ) : null}
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className={`h-full rounded-full transition-all ${
                  elig.dPlus.done >= elig.dPlus.needed ? "bg-lime" : "bg-amber"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (elig.dPlus.done / Math.max(1, elig.dPlus.needed)) * 100,
                    ),
                  )}%`,
                }}
              />
            </div>
          </div>

          <p className="text-[10px] text-ink-dim">
            Volume calculé à partir de tes activités Strava sur les 30 derniers
            jours. Plus tu cumules, plus tu débloques de niveaux.
          </p>
        </section>

        {/* Challenge */}
        <section className="rounded-3xl border-2 border-ink/10 bg-bg-card/80 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
                Une fois éligible, le challenge
              </div>
              <h2 className="font-display text-lg font-black">{c.targetLabel}</h2>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-ink leading-relaxed">
            {c.rules.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-lime font-black">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions client (déclarer + partager) */}
        <LotoActions
          challengeId={c.id}
          slug={c.slug}
          raceName={c.raceName}
          tagline={c.tagline}
          accentBtn={a.btn}
          accentText={a.text}
          eligible={elig.eligible}
          eligibilityPercent={elig.percent}
          kmRemaining={elig.km.remaining}
          dPlusRemaining={elig.dPlus.remaining}
        />

        {/* Stats publiques */}
        <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4 text-center text-xs text-ink-muted">
          <strong className="text-ink">{c.participants.toLocaleString("fr-FR")}</strong>{" "}
          participants •{" "}
          <strong className="text-ink">{c.ticketsSold.toLocaleString("fr-FR")}</strong>{" "}
          tickets en jeu
          <div className="mt-1 text-[10px] font-mono">
            Inscriptions ouvertes jusqu'au {closesDate} • Tirage le {drawDate} 20h
          </div>
        </section>

        {/* Cadre légal */}
        <section className="rounded-2xl border border-ink/10 bg-bg-card/30 p-4 text-[11px] text-ink-muted leading-relaxed">
          <strong className="text-ink">Tirage gratuit, ni mise ni achat requis.</strong>{" "}
          Esprit Trail ne perçoit pas un centime sur ces dossards : ils sont mis à
          disposition par {c.organizer}
          {c.organizerUrl ? (
            <>
              {" "}
              (
              <a
                href={c.organizerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ink"
              >
                site officiel
              </a>
              )
            </>
          ) : null}
          . En cas de victoire, on te contacte par email pour le transfert
          d'inscription. Voir{" "}
          <Link href="/legal/cgu" className="underline hover:text-ink">
            CGU
          </Link>
          .
        </section>
      </div>
    </main>
  );
}
