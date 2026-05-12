// ====== PAGE CONCEPT ESPRIT TRAIL ======
// Ce que l'app est, pourquoi elle existe. Baseline + storytelling.
// Accessible en tapant sur le logo depuis n'importe où.

import Link from "next/link";
import { BrandLogoFull } from "@/components/ui/TQLogo";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-10 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-xl card-chunky bg-bg-card p-2 text-ink-muted hover:text-lime transition tap-bounce"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-5 w-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Manifeste
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            Esprit Trail
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* HERO — Logo géant + baseline */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-lime/40 bg-gradient-to-br from-lime/20 via-cyan/10 to-bg p-8 card-shine text-center">
        {/* Background decorative */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 text-[220px] opacity-[0.08] leading-none">
          🏔️
        </div>

        <div className="relative">
          {/* Logo géant — bidon + éclair sketch hand-drawn */}
          <div className="mx-auto wobble">
            <BrandLogoFull width={220} />
          </div>

          {/* Baseline principale — claire pour un primo-arrivant */}
          <p className="mt-6 font-display text-xl font-black leading-snug text-ink">
            L&apos;app trail qui te permet de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-peach">
                progresser sans te blesser
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-2 rounded bg-peach/25" />
            </span>
            , de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-peach">
                participer à des courses de zinzins
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-2 rounded bg-peach/25" />
            </span>{" "}
            et de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-peach">
                gagner des dossards
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-2 rounded bg-peach/25" />
            </span>{" "}
            grâce à tes km parcourus.
          </p>
          <p className="mt-3 text-xs text-ink-muted leading-relaxed">
            Coach IA, OFF Races (FKT, courses pirates), team de traileurs,
            quêtes hebdo, mode duel live, et tirages de dossards sur des
            courses partenaires — débloqués par ton volume km.
          </p>
        </div>
      </section>

      {/* LE POURQUOI — punchy */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          Pourquoi Esprit Trail existe
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-display text-base font-black">
              Pour garder l&apos;Esprit Trail vivant
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              On veut organiser des courses de zinzins qui vont te faire vibrer
              à chaque kilomètre.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
            <div className="text-2xl mb-2">🏴‍☠️</div>
            <h3 className="font-display text-base font-black">
              Esprit Trail remet l&apos;âme au centre
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              FKT en solo, courses pirates, GR en autonomie, crew runs du
              dimanche. L&apos;âme du trail elle est là : dans ce qu&apos;on
              fait sans qu&apos;on nous regarde.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
            <div className="text-2xl mb-2">🎮</div>
            <h3 className="font-display text-base font-black">
              Progresser sans se blesser
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              Coach IA qui te génère ton plan, quêtes quotidiennes : on
              débloque des mondes.
            </p>
          </div>
        </div>
      </section>

      {/* LE MODE DUEL — featured callout */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-peach bg-gradient-to-br from-peach/20 via-violet/10 to-bg p-6 card-shine">
        <div className="pointer-events-none absolute -right-4 -top-4 text-[140px] opacity-[0.1] leading-none">
          🎯
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-peach/25 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider text-peach">
            <span className="h-1.5 w-1.5 rounded-full bg-peach animate-pulse" />
            Signature feature
          </div>
          <h3 className="mt-3 font-display text-2xl font-black leading-tight">
            Mode duel : ton coureur de référence en live
          </h3>
          <div className="mt-1 text-[11px] font-mono font-bold uppercase tracking-widest text-peach/80">
            aka. « kill cam »
          </div>
          <p className="mt-2 text-sm text-ink leading-relaxed">
            Tu choisis un coureur de référence — ton pote, un champion local,
            ou un nom mythique du trail. Pendant ta course, Esprit Trail affiche en
            temps réel où tu te situes face à lui : combien tu lui prends ou
            tu lui perds à chaque kilomètre, et la projection sur la ligne.
            Une compèt&apos; mentale, sans dossard, à n&apos;importe quel moment.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="rounded-md bg-bg-raised/80 px-2 py-1">
              ⏱ Écart live
            </span>
            <span className="rounded-md bg-bg-raised/80 px-2 py-1">
              📊 Projection finish
            </span>
            <span className="rounded-md bg-bg-raised/80 px-2 py-1">
              🎥 Replay post-course
            </span>
            <span className="rounded-md bg-peach/20 text-peach px-2 py-1 font-black">
              🎯 Debrief final
            </span>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE — features grid */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Ce que Esprit Trail t'apporte
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              emoji: "🧠",
              title: "Coach IA",
              desc: "Plan perso semaine par semaine",
              color: "border-cyan/40 bg-cyan/10",
              href: "/coach",
            },
            {
              emoji: "🏴‍☠️",
              title: "OFF Races",
              desc: "FKT, pirates, hors circuit",
              color: "border-peach/40 bg-peach/10",
              href: "/races/off",
            },
            {
              emoji: "🎫",
              title: "Dossards en jeu",
              desc: "Tirages gratuits sur courses partenaires",
              color: "border-lime/40 bg-lime/10",
              href: "/challenges/loto",
            },
            {
              emoji: "🏆",
              title: "Quêtes",
              desc: "Daily, weekly, seasonal",
              color: "border-violet/40 bg-violet/10",
              href: "/quests",
            },
            {
              emoji: "👥",
              title: "Teams",
              desc: "Ton crew, tes missions",
              color: "border-mythic/40 bg-mythic/10",
              href: "/guildes",
            },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className={`rounded-2xl border-2 p-3 transition hover:scale-[1.02] ${f.color}`}
            >
              <div className="text-2xl">{f.emoji}</div>
              <div className="mt-1 font-display text-sm font-black leading-tight">
                {f.title}
              </div>
              <div className="text-[10px] text-ink-muted mt-0.5">
                {f.desc}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POUR QUI ? — 3 chemins pour aider l'utilisateur à se situer */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
          Pour qui ?
        </div>
        <div className="space-y-3">
          {/* Je débute */}
          <div className="rounded-2xl border-2 border-cyan/30 bg-gradient-to-br from-cyan/8 via-bg-card to-bg p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan/20 text-2xl">
                🌱
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan">
                  Je débute en trail
                </div>
                <h3 className="mt-0.5 font-display text-base font-black leading-tight">
                  Tu cours sur route et tu veux passer au trail.
                </h3>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  Spots faciles près de chez toi avec GPX, Coach IA qui t&apos;évite
                  les blessures classiques (ITBS, périostite), gut training pour
                  ne pas vomir au km 25.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <Link
                    href="/spots"
                    className="rounded-md bg-cyan/15 text-cyan px-2 py-1 font-bold hover:bg-cyan/25 transition"
                  >
                    🗺️ Voir les spots
                  </Link>
                  <Link
                    href="/coach"
                    className="rounded-md bg-cyan/15 text-cyan px-2 py-1 font-bold hover:bg-cyan/25 transition"
                  >
                    🧠 Coach IA débutant
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Je vise une course */}
          <div className="rounded-2xl border-2 border-peach/30 bg-gradient-to-br from-peach/8 via-bg-card to-bg p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-peach/20 text-2xl">
                🎯
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-black uppercase tracking-wider text-peach">
                  Je vise une course
                </div>
                <h3 className="mt-0.5 font-display text-base font-black leading-tight">
                  Tu te prépares sérieusement pour le jour J — sur ta course objectif.
                </h3>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  Plan d&apos;entraînement IA personnalisé, plan nutrition au
                  timing près sur la course choisie, ranking ITRA/UTMB, tirages
                  de dossards gratuits.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <Link
                    href="/races"
                    className="rounded-md bg-peach/15 text-peach px-2 py-1 font-bold hover:bg-peach/25 transition"
                  >
                    📅 Voir le calendrier
                  </Link>
                  <Link
                    href="/challenges/loto"
                    className="rounded-md bg-peach/15 text-peach px-2 py-1 font-bold hover:bg-peach/25 transition"
                  >
                    🎫 Dossards en jeu
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Je cherche des sorties */}
          <div className="rounded-2xl border-2 border-lime/30 bg-gradient-to-br from-lime/8 via-bg-card to-bg p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime/20 text-2xl">
                🏴‍☠️
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-black uppercase tracking-wider text-lime">
                  Je cherche des sorties
                </div>
                <h3 className="mt-0.5 font-display text-base font-black leading-tight">
                  Pas de dossard, juste l&apos;envie de courir des trucs cools.
                </h3>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  OFF Races (FKT, courses pirates, GR projects), spots GPX
                  organisés par difficulté, teams locales pour des crew runs du
                  dimanche.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <Link
                    href="/races?tab=off"
                    className="rounded-md bg-lime/15 text-lime px-2 py-1 font-bold hover:bg-lime/25 transition"
                  >
                    🏴‍☠️ OFF Races
                  </Link>
                  <Link
                    href="/spots"
                    className="rounded-md bg-lime/15 text-lime px-2 py-1 font-bold hover:bg-lime/25 transition"
                  >
                    🗺️ Spots GPX
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strava sync — rassurer les users actifs Strava */}
      <section className="rounded-3xl border-2 border-[#fc4c02]/40 bg-gradient-to-br from-[#fc4c02]/10 via-bg-card to-bg p-5 card-shine">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fc4c02] text-white font-display text-lg font-black card-chunky">
            S
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[#fc4c02]">
              Tu utilises déjà Strava ?
            </div>
            <h3 className="mt-1 font-display text-lg font-black text-ink leading-tight">
              Sync 1 clic, on importe ton historique.
            </h3>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              Tes runs passées, tes stats, ton volume hebdo : tout est récupéré
              automatiquement. Le Coach IA et le radar Forme se calibrent sur ta
              vraie réalité, sans re-saisie.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-block rounded-md bg-[#fc4c02] px-3 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-white hover:scale-105 transition"
            >
              Connecter Strava →
            </Link>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES — 3 voix de traileurs réalistes */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-gold">
          Ils utilisent Esprit Trail
        </div>

        {/* Camille — débutante */}
        <div className="rounded-2xl border-2 border-cyan/25 bg-bg-card/60 p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-black text-bg"
              style={{
                background:
                  "linear-gradient(135deg, #5ad6d6 0%, #023e8a 100%)",
              }}
              aria-hidden
            >
              C
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-sm font-black text-ink">
                  Camille, 32 ans
                </div>
                <div className="text-[10px] font-mono text-cyan">
                  Lyon · 8 km/sem
                </div>
              </div>
              <div className="text-[10px] font-mono text-ink-dim">
                Débutante · vise sa 1re course (30 km)
              </div>
              <p className="mt-2 text-xs text-ink leading-relaxed italic">
                &ldquo;J&apos;avais peur de me blesser à l&apos;entraînement. Le
                plan du Coach IA augmente le volume progressivement et m&apos;a
                fait comprendre l&apos;importance des semaines de décharge.
                3 mois en, zéro pépin.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Théo — intermédiaire course */}
        <div className="rounded-2xl border-2 border-peach/25 bg-bg-card/60 p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-black text-bg"
              style={{
                background:
                  "linear-gradient(135deg, #f8a96e 0%, #d6722c 100%)",
              }}
              aria-hidden
            >
              T
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-sm font-black text-ink">
                  Théo, 28 ans
                </div>
                <div className="text-[10px] font-mono text-peach">
                  Annecy · 60 km/sem
                </div>
              </div>
              <div className="text-[10px] font-mono text-ink-dim">
                Intermédiaire · MaxiRace 84 km mai 2026
              </div>
              <p className="mt-2 text-xs text-ink leading-relaxed italic">
                &ldquo;Le plan nutrition au timing près m&apos;a sauvé la vie
                sur la 60 km de l&apos;Eco-Trail Paris. Je tolère enfin 80g de
                glucides/h sans gerber. Le gut training est game-changer.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Lucile — confirmée ultra */}
        <div className="rounded-2xl border-2 border-lime/25 bg-bg-card/60 p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-black text-bg"
              style={{
                background:
                  "linear-gradient(135deg, #b8e64a 0%, #2d6a4f 100%)",
              }}
              aria-hidden
            >
              L
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-sm font-black text-ink">
                  Lucile, 33 ans
                </div>
                <div className="text-[10px] font-mono text-lime">
                  Briançon · 95 km/sem
                </div>
              </div>
              <div className="text-[10px] font-mono text-ink-dim">
                Confirmée · TDS 2026 (148 km)
              </div>
              <p className="mt-2 text-xs text-ink leading-relaxed italic">
                &ldquo;Les OFF Races, c&apos;est ce qui me manquait depuis
                longtemps. Je me suis tapée le FKT du Tour des Aiguilles Rouges
                avec une copine grâce aux GPX partagés. Une bouffée d&apos;air
                hors du circuit officiel.&rdquo;
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* CTA retour home */}
      <Link
        href="/"
        className="block rounded-2xl bg-lime py-4 text-center font-display font-black uppercase tracking-wider text-bg btn-chunky tap-bounce"
      >
        ← Retour à l'app
      </Link>
    </main>
  );
}
