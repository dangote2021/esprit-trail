// ====== PAGE CONCEPT RAVITO ======
// Ce que l'app est, pourquoi elle existe. Baseline + storytelling.
// Accessible en tapant sur le logo depuis n'importe où.

import Link from "next/link";

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
            Ravito
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
          {/* Logo géant */}
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-lime shadow-glow-lime card-chunky wobble">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-20 w-20 text-bg"
            >
              {/* Gobelet ravito + goutte */}
              <path
                d="M8 10 L24 10 L22 26 Q22 28 20 28 L12 28 Q10 28 10 26 Z"
                fill="currentColor"
              />
              <path
                d="M10 10 L22 10 L22 13 L10 13 Z"
                fill="currentColor"
                opacity="0.55"
              />
              <path
                d="M16 2 Q12 7 12 9 Q12 11 16 11 Q20 11 20 9 Q20 7 16 2 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h2 className="mt-6 font-display text-5xl font-black leading-none tracking-tight">
            Ravito
          </h2>

          <div className="mt-2 text-[11px] font-mono font-black uppercase tracking-[0.3em] text-lime">
            Le trail, il a changé
          </div>

          {/* Baseline principale — la phrase Théo D. */}
          <p className="mt-6 font-display text-xl font-black leading-snug text-ink">
            Ravito, l'app qui va te permettre de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-peach">
                kill-cam Théo D.
              </span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-2 rounded bg-peach/25" />
            </span>{" "}
            au prochain trail.
          </p>
        </div>
      </section>

      {/* LE POURQUOI — punchy */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          Pourquoi Ravito existe
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-display text-base font-black">
              Parce que le trail a grandi trop vite
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              Dossards à 200€, UTMB Index à sacraliser, podiums à cirer,
              sponsors à courtiser. Le sport s'est pris un coup de vieux en
              même temps qu'il s'est boomé.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
            <div className="text-2xl mb-2">🏴‍☠️</div>
            <h3 className="font-display text-base font-black">
              Ravito remet l'âme au centre
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              FKT en solo, courses pirates, GR en autonomie, crew runs du
              dimanche. L'âme du trail elle est là : dans ce qu'on fait sans
              qu'on nous regarde.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
            <div className="text-2xl mb-2">🎮</div>
            <h3 className="font-display text-base font-black">
              L'app, en mode jeu vidéo
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              Personnage customisable, stats FIFA-style, Coach IA qui te
              génère ton plan, carte Panini traileur, quêtes quotidiennes.
              Le trail, mais fun.
            </p>
          </div>
        </div>
      </section>

      {/* LE KILL-CAM — featured callout */}
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
            Le kill-cam Théo D.
          </h3>
          <p className="mt-2 text-sm text-ink leading-relaxed">
            Sur ta prochaine course, Ravito te positionne en temps réel contre
            n'importe quel coureur de référence — ton pote, un champion local,
            ou Théo D. himself. Tu sais à chaque kilomètre si tu le gagnes, si
            tu le perds, et combien tu dois te sortir les doigts pour le
            kill-camer sur la ligne.
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
              🎯 Kill-cam final
            </span>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE — features grid */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Ce que Ravito t'apporte
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
              emoji: "⭐",
              title: "Carte Panini",
              desc: "Ton profil traileur FIFA-style",
              color: "border-gold/40 bg-gold/10",
              href: "/profile",
            },
            {
              emoji: "🎮",
              title: "Character",
              desc: "Avatar trailer customisable",
              color: "border-lime/40 bg-lime/10",
              href: "/profile/character",
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
              title: "Guildes",
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

      {/* CRÉATEUR note */}
      <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4 text-center space-y-1">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Fait par des traileurs pour des traileurs
        </div>
        <div className="text-xs text-ink">
          Ravito n'est pas une app "grand public". C'est une app faite par
          des gens qui sentent le sel sur leurs gourdes de flask.
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
