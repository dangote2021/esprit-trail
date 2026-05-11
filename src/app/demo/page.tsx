// ====== /demo — Parcours guidé de l'app ======
// Page publique qui montre 3 scènes-clé avec data fictive : spots locaux,
// plan nutrition exemple, dossard MaxiRace. Spots adaptés à la ville visiteur
// via header Vercel x-vercel-ip-city. Objectif : démo statique, sans auth.

import Link from "next/link";
import { headers } from "next/headers";
import { BrandLogoFull } from "@/components/ui/TQLogo";
import { pickDemoPack } from "@/lib/data/demo-spots";

export const metadata = {
  title: "Démo · Esprit Trail",
  description:
    "Découvre Esprit Trail en 2 minutes : spots GPX, plan nutrition par course, dossards en jeu. Démo sans inscription.",
};

export default function DemoPage() {
  // Détection ville visiteur via headers Vercel (sans popup géoloc)
  const h = headers();
  const city = h.get("x-vercel-ip-city");
  const demoPack = pickDemoPack(city);
  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-10 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
          aria-label="Retour"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            Démo guidée
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            2 minutes
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="rounded-3xl border-2 border-cyan/40 bg-gradient-to-br from-cyan/15 via-bg-card to-bg p-6 text-center space-y-3">
        <BrandLogoFull width={80} className="mx-auto" />
        <h2 className="font-display text-2xl font-black leading-tight text-ink">
          Découvre Esprit Trail sans t&apos;inscrire.
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          Voici ce que tu trouveras dans l&apos;app : 3 captures avec une data
          fictive mais réaliste. À la fin, tu décides si tu crées ton compte.
        </p>
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <span className="h-2 w-8 rounded-full bg-cyan" />
          <span className="h-2 w-2 rounded-full bg-cyan/30" />
          <span className="h-2 w-2 rounded-full bg-cyan/30" />
          <span className="h-2 w-2 rounded-full bg-cyan/30" />
        </div>
      </section>

      {/* SCÈNE 1 — Spots Lyon */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-cyan px-2 py-0.5 text-[10px] font-mono font-black text-bg">
            1 / 3
          </span>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
            Spots GPX près de chez toi
          </span>
        </div>

        <div className="rounded-3xl border-2 border-cyan/30 bg-gradient-to-br from-cyan/8 via-bg-card to-bg p-4 space-y-3">
          <div>
            <div className="font-display text-lg font-black text-ink leading-tight">
              📍 3 spots {demoPack.cityLabel}
            </div>
            <p className="text-xs text-ink-muted">
              Triés par distance · GPX téléchargeable
            </p>
          </div>

          {/* 3 spots localisés selon la ville du visiteur */}
          {demoPack.spots.map((spot, i) => (
            <div
              key={i}
              className="rounded-2xl border border-ink/10 bg-bg-card/60 p-3 space-y-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-black text-ink truncate">
                    {spot.name}
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted truncate">
                    🌲 {spot.region} ·{" "}
                    <span className={`text-${spot.color} font-bold`}>
                      {spot.dist} km de toi
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-black border border-${spot.color}/40 bg-${spot.color}/10 text-${spot.color}`}
                >
                  {spot.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                <span className="rounded-md bg-bg-raised px-2 py-0.5">
                  📏 {spot.km} km
                </span>
                <span className="rounded-md bg-bg-raised px-2 py-0.5">
                  ⛰️ {spot.dPlus} D+
                </span>
                <span className="rounded-md bg-cyan/10 text-cyan px-2 py-0.5">
                  📥 GPX
                </span>
              </div>
            </div>
          ))}

          <p className="text-[11px] text-ink-muted leading-relaxed pt-1">
            🔓 Avec un compte : 6 spots officiels + upload illimité de tes
            propres GPX, traces persistées sur ton profil.
          </p>
        </div>
      </section>

      {/* SCÈNE 2 — Plan nutrition */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-peach px-2 py-0.5 text-[10px] font-mono font-black text-bg">
            2 / 3
          </span>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Plan nutrition par course
          </span>
        </div>

        <div className="rounded-3xl border-2 border-peach/30 bg-gradient-to-br from-peach/8 via-bg-card to-bg p-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-black text-ink leading-tight">
                🍫 SaintéLyon · 78 km
              </div>
              <div className="text-[11px] font-mono text-ink-muted">
                ITRA 580 · ~10h estimées · 700g glucides
              </div>
            </div>
            <div className="rounded-md bg-peach/20 px-2 py-0.5 text-[10px] font-mono font-black text-peach">
              Exemple
            </div>
          </div>

          {/* Timeline fictive */}
          <div className="space-y-2">
            {[
              { time: "23:55", offset: "−05min", label: "Café + barre", detail: "Dernière prise avant départ" },
              { time: "00:30", offset: "H+0:30", label: "💧 Gel SiS isotonic", detail: "Premier carb shot km 5" },
              { time: "01:00", offset: "H+1:00", label: "🥤 Tailwind 500ml", detail: "Hydratation + 25g glucides" },
              { time: "01:30", offset: "H+1:30", label: "🍫 Barre Maurten", detail: "30g glucides au km 13" },
              { time: "02:00", offset: "H+2:00", label: "💧 Gel + sel", detail: "Avant la grosse côte" },
            ].map((it, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border-2 border-ink/10 bg-bg-card/60 p-3"
              >
                <div className="shrink-0 w-14 text-center">
                  <div className="font-display text-base font-black text-ink leading-none">
                    {it.time}
                  </div>
                  <div className="text-[9px] font-mono text-ink-dim mt-0.5 uppercase">
                    {it.offset}
                  </div>
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-ink">{it.label}</div>
                  <div className="text-ink-muted text-[11px]">{it.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-ink-muted leading-relaxed pt-1">
            🔓 Avec un compte : timeline complète sur 10h, liste de courses
            jour J, gut training 8 semaines pour tolérer 90g/h.
          </p>
        </div>
      </section>

      {/* SCÈNE 3 — Dossards en jeu */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-lime px-2 py-0.5 text-[10px] font-mono font-black text-bg">
            3 / 3
          </span>
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Dossards en jeu
          </span>
        </div>

        <div className="rounded-3xl border-2 border-lime/30 bg-gradient-to-br from-lime/8 via-bg-card to-bg p-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-black text-ink leading-tight">
                🎫 MaxiRace · 84 km
              </div>
              <div className="text-[11px] font-mono text-ink-muted">
                Annecy · 24-25 mai 2026
              </div>
            </div>
            <div className="rounded-xl bg-peach px-2 py-1 text-bg text-center shadow-md">
              <div className="text-[8px] font-mono font-black uppercase leading-none">
                Tirage
              </div>
              <div className="font-display text-sm font-black leading-none mt-0.5">
                J-12
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-lime/20 bg-bg-card/60 p-2">
              <div className="text-[9px] font-mono uppercase text-ink-muted">
                Tickets
              </div>
              <div className="font-display text-lg font-black text-lime">
                🎟 7
              </div>
            </div>
            <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-2">
              <div className="text-[9px] font-mono uppercase text-ink-muted">
                Participants
              </div>
              <div className="font-display text-lg font-black text-ink">
                342
              </div>
            </div>
            <div className="rounded-xl border border-peach/20 bg-bg-card/60 p-2">
              <div className="text-[9px] font-mono uppercase text-ink-muted">
                Lots
              </div>
              <div className="font-display text-lg font-black text-peach">
                3
              </div>
            </div>
          </div>

          {/* Comment ça marche */}
          <div className="rounded-2xl border border-ink/10 bg-bg-raised/40 p-3 space-y-1.5 text-xs text-ink leading-relaxed">
            <div className="font-bold text-lime">Comment ça marche</div>
            <div className="flex gap-2">
              <span className="text-lime font-bold">1.</span>
              <span>Tu cours, chaque km synchronisé Strava = 1 ticket</span>
            </div>
            <div className="flex gap-2">
              <span className="text-lime font-bold">2.</span>
              <span>Tickets accumulés jusqu&apos;au tirage (gratuit, 0€)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-lime font-bold">3.</span>
              <span>3 dossards tirés au sort, notification WhatsApp</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-muted leading-relaxed pt-1">
            🔓 Avec un compte : tickets cumulés sur tous les tirages CCC,
            Templiers, MaxiRace, FKT collectifs. Synchro Strava 1 clic.
          </p>
        </div>
      </section>

      {/* CTA fin de démo */}
      <section className="rounded-3xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-6 text-center space-y-4">
        <div className="text-3xl">🎯</div>
        <h2 className="font-display text-2xl font-black leading-tight text-ink">
          Tu en as vu assez ?
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          Crée ton compte gratuit (30 sec) et accède à toute l&apos;app : Coach
          IA, plan nutri perso pour ta course, sync Strava, tirages dossards.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <Link
            href="/signup"
            className="block w-full rounded-xl bg-peach py-3 text-center font-mono text-sm font-black uppercase tracking-wider text-bg shadow-md hover:scale-[1.02] transition"
          >
            Créer mon compte gratuit →
          </Link>
          <Link
            href="/spots"
            className="block w-full rounded-xl border border-cyan/40 bg-cyan/5 py-3 text-center font-mono text-xs font-black uppercase tracking-wider text-cyan hover:bg-cyan/10 transition"
          >
            Continuer en mode découverte (spots réels)
          </Link>
          <Link
            href="/login"
            className="text-[10px] font-mono text-ink-dim hover:text-ink pt-1"
          >
            J&apos;ai déjà un compte → Connexion
          </Link>
        </div>
      </section>
    </main>
  );
}
