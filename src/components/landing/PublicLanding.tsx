// ====== PublicLanding ======
// Landing public affichée sur `/` aux visiteurs non authentifiés.
// 3 captures visuelles avant le CTA d'inscription : plan nutri (localisé selon
// la ville visiteur via header Vercel), carte spots, dossards en jeu.
// Objectif : montrer la valeur AVANT de demander un compte.

import Link from "next/link";
import { headers } from "next/headers";
import { BrandLogoFull } from "@/components/ui/TQLogo";
import LangToggle from "@/components/i18n/LangToggle";
import { pickRaceExample } from "@/lib/data/race-examples";

export type UserProfile = "novice" | "competitor" | "adventurer" | undefined;

export default function PublicLanding({
  cityOverride,
  profile,
}: {
  cityOverride?: string;
  profile?: UserProfile;
} = {}) {
  // Détection ville visiteur via headers Vercel (sans popup, sans data perso).
  // `cityOverride` permet aux tests / debug (?city=Lyon) de forcer la ville.
  const h = headers();
  const city = cityOverride || h.get("x-vercel-ip-city");
  const example = pickRaceExample(city);

  // Profil novice → on masque OFF Races / FKT / "kill cam" violentes pour
  // adresser les débutants sans les effrayer.
  const isNovice = profile === "novice";
  const isAdventurer = profile === "adventurer";
  // Helper pour les liens internes qui doivent conserver le profil
  const withProfile = (path: string) =>
    profile ? `${path}${path.includes("?") ? "&" : "?"}profile=${profile}` : path;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-10 space-y-8">
      {/* Header logo + lang toggle + login CTA */}
      <header className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <BrandLogoFull width={48} />
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            href="/login"
            className="rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
          >
            Connexion
          </Link>
        </div>
      </header>

      {/* Hero accroche */}
      <section className="space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-lime/15 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
          App trail · 100% gratuite
        </div>
        <h1 className="font-display text-4xl font-black leading-[1.05] text-ink">
          L&apos;app trail qui te fait{" "}
          <span className="text-lime">progresser</span>,{" "}
          <span className="text-peach">courir hors circuit</span> et{" "}
          <span className="text-cyan">gagner des dossards</span>.
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          {isNovice
            ? "Spots GPX près de chez toi, Coach IA qui adapte ton plan à ton niveau, plans nutrition pour ne pas exploser au km 20."
            : "Plans nutrition par course, spots GPX près de chez toi, OFF Races confidentielles, Coach IA pour préparer ton prochain ultra."}
        </p>
      </section>

      {/* Manifesto — 2 piliers : l'âme + la progression */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach text-center">
          ✶ Notre manifesto ✶
        </div>

        {/* Pilier 1 — l'âme du trail */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-peach/40 bg-gradient-to-br from-peach/10 via-bg-card to-cyan/10 p-5 card-chunky">
          <div className="absolute -top-2 -right-2 text-5xl opacity-10 select-none">
            🔥
          </div>
          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-peach/20 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-peach">
              <span>01</span>
              <span className="h-1.5 w-1.5 rounded-full bg-peach animate-pulse" />
              L&apos;âme
            </div>
            <h2 className="font-display text-2xl font-black leading-tight text-ink">
              Esprit Trail remet{" "}
              <span className="text-peach">l&apos;âme</span> au centre.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Courses pirates, GR en autonomie, crew runs du dimanche en forêt.
              L&apos;âme du trail elle est là, elle vibre dans nos petits cœurs.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-md bg-bg-raised/60 px-2 py-0.5 text-[10px] font-mono font-bold text-peach">
                🏴‍☠️ Pirate
              </span>
              <span className="rounded-md bg-bg-raised/60 px-2 py-0.5 text-[10px] font-mono font-bold text-lime">
                🎒 Autonomie
              </span>
              <span className="rounded-md bg-bg-raised/60 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan">
                🌲 Crew
              </span>
            </div>
          </div>
        </div>

        {/* Pilier 2 — progresser sans se blesser */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-lime/40 bg-gradient-to-br from-lime/10 via-bg-card to-violet/10 p-5 card-chunky">
          <div className="absolute -top-2 -right-2 text-5xl opacity-10 select-none">
            🎮
          </div>
          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-lime/20 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-lime">
              <span>02</span>
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              La progression
            </div>
            <h2 className="font-display text-2xl font-black leading-tight text-ink">
              <span className="text-lime">Progresser</span> sans se blesser.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Coach IA qui te génère ton plan, quêtes quotidiennes : on débloque
              des mondes et on t&apos;accompagne jusqu&apos;au{" "}
              <strong className="text-violet">big boss</strong> — ton gros
              objectif de l&apos;année.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-md bg-bg-raised/60 px-2 py-0.5 text-[10px] font-mono font-bold text-lime">
                🤖 Coach IA
              </span>
              <span className="rounded-md bg-bg-raised/60 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan">
                ⚔️ Quêtes
              </span>
              <span className="rounded-md bg-bg-raised/60 px-2 py-0.5 text-[10px] font-mono font-bold text-violet">
                👹 Big Boss
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA principal */}
      <section className="space-y-2">
        <Link
          href="/signup"
          className="block w-full rounded-2xl bg-lime py-4 text-center font-display text-lg font-black uppercase tracking-wider text-bg btn-chunky tap-bounce shadow-glow-lime"
        >
          Crée ton compte gratuit →
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/demo"
            className="block w-full rounded-2xl border-2 border-cyan/40 bg-cyan/5 py-3 text-center font-mono text-xs font-black uppercase tracking-widest text-cyan hover:bg-cyan/10 transition"
          >
            🎬 Démo guidée
          </Link>
          <Link
            href="/spots"
            className="block w-full rounded-2xl border-2 border-lime/40 bg-lime/5 py-3 text-center font-mono text-xs font-black uppercase tracking-widest text-lime hover:bg-lime/10 transition"
          >
            👀 Spots réels
          </Link>
        </div>
        <p className="pt-1 text-center text-[10px] font-mono text-ink-dim">
          Magic-link · Google OAuth · 30 secondes pour démarrer
        </p>
      </section>

      {/* POUR QUI ? — 3 chemins, les 3 sont des Link vers /?profile=X qui adapte la suite */}
      {!profile && (
        <section className="space-y-3">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
            T&apos;es plutôt…
          </div>
          <div className="grid gap-2">
            {/* Je débute */}
            <Link
              href="/?profile=novice"
              className="rounded-2xl border-2 border-cyan/30 bg-gradient-to-br from-cyan/8 via-bg-card to-bg p-3 hover:scale-[1.01] transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/20 text-xl">
                  🌱
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan">
                    Je débute en trail
                  </div>
                  <div className="font-display text-sm font-black text-ink leading-tight">
                    Spots faciles, plan progressif sans blessure
                  </div>
                </div>
                <div className="text-cyan font-display text-xl">→</div>
              </div>
            </Link>

            {/* Je vise une course */}
            <Link
              href="/?profile=competitor"
              className="rounded-2xl border-2 border-peach/30 bg-gradient-to-br from-peach/8 via-bg-card to-bg p-3 hover:scale-[1.01] transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peach/20 text-xl">
                  🎯
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-black uppercase tracking-wider text-peach">
                    Je vise une course
                  </div>
                  <div className="font-display text-sm font-black text-ink leading-tight">
                    Plan nutri jour J, ranking, dossards en jeu
                  </div>
                </div>
                <div className="text-peach font-display text-xl">→</div>
              </div>
            </Link>

            {/* Je cherche des sorties */}
            <Link
              href="/?profile=adventurer"
              className="rounded-2xl border-2 border-lime/30 bg-gradient-to-br from-lime/8 via-bg-card to-bg p-3 hover:scale-[1.01] transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/20 text-xl">
                  🏴‍☠️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-black uppercase tracking-wider text-lime">
                    Je cherche des sorties
                  </div>
                  <div className="font-display text-sm font-black text-ink leading-tight">
                    OFF Races, FKT, GR projects, GPX persos
                  </div>
                </div>
                <div className="text-lime font-display text-xl">→</div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Bannière de profil actif — si l'user a cliqué un chemin */}
      {profile && (
        <section
          className={`rounded-2xl border-2 p-3 ${
            isNovice
              ? "border-cyan/40 bg-cyan/8"
              : isAdventurer
                ? "border-lime/40 bg-lime/8"
                : "border-peach/40 bg-peach/8"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {isNovice ? "🌱" : isAdventurer ? "🏴‍☠️" : "🎯"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-black uppercase tracking-wider text-ink-muted">
                Mode actif
              </div>
              <div className="font-display text-sm font-black text-ink">
                {isNovice
                  ? "Tu débutes — on garde simple"
                  : isAdventurer
                    ? "Tu cherches des sorties — focus OFF Races"
                    : "Tu vises une course — plan + dossards"}
              </div>
            </div>
            <Link
              href="/"
              className="rounded-md border border-ink/15 bg-bg-card/60 px-2 py-1 text-[10px] font-mono font-bold uppercase text-ink-muted hover:text-ink"
            >
              Changer
            </Link>
          </div>
        </section>
      )}

      {/* Capture #1 — Plan nutrition (localisé selon ville visiteur) */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach flex items-center gap-2 flex-wrap">
          <span>⚡ Plan nutrition par course</span>
          {example.matchLabel && (
            <span className="rounded-md bg-peach/20 px-1.5 py-0.5 text-[9px] font-black text-peach normal-case tracking-normal">
              📍 vu pour les {example.matchLabel}
            </span>
          )}
        </div>
        <div className="rounded-3xl border-2 border-peach/30 bg-gradient-to-br from-peach/10 via-bg-card to-bg p-4 shadow-lg">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-black text-ink leading-tight">
                {example.raceLabel}
              </div>
              <div className="text-[11px] font-mono text-ink-muted">
                {example.distanceKm} km · {example.elevationM.toLocaleString("fr")} m D+
              </div>
            </div>
            <div className="rounded-md bg-peach/20 px-2 py-0.5 text-[10px] font-mono font-black text-peach">
              Plan nutri
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            {example.prises.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-bg-raised/60 p-2"
              >
                <span className="font-black text-peach w-12">{p.time}</span>
                <span className="text-ink">{p.label}</span>
                <span className="ml-auto text-ink-dim">{p.note}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-ink-muted leading-relaxed">
            {example.closingNote}
          </p>
          <Link
            href={`/race/${example.raceId}`}
            className="mt-2 inline-block text-[11px] font-mono font-black text-peach hover:underline"
          >
            Voir la course complète →
          </Link>
        </div>
      </section>

      {/* Capture #2 — Spots */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
          🗺️ Spots d&apos;entraînement GPX
        </div>
        <div className="rounded-3xl border-2 border-cyan/30 bg-gradient-to-br from-cyan/10 via-bg-card to-bg p-4 shadow-lg">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-black text-ink leading-tight">
                Près de chez toi
              </div>
              <div className="text-[11px] font-mono text-ink-muted">
                Triés par distance · GPX dispo
              </div>
            </div>
            <div className="rounded-md bg-cyan/20 px-2 py-0.5 text-[10px] font-mono font-black text-cyan">
              6 spots
            </div>
          </div>

          {/* Mini représentation carte stylisée */}
          <div className="relative mt-3 h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-emerald-700/20 to-cyan/15">
            {/* Topographie stylisée */}
            <svg
              viewBox="0 0 320 120"
              className="absolute inset-0 h-full w-full opacity-50"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 90 Q 60 30 120 60 T 240 50 T 320 80 L 320 120 L 0 120 Z"
                fill="rgba(45, 106, 79, 0.4)"
              />
              <path
                d="M 0 100 Q 80 70 160 90 T 320 95 L 320 120 L 0 120 Z"
                fill="rgba(45, 106, 79, 0.6)"
              />
            </svg>
            {/* Pins */}
            <div className="absolute left-[18%] top-[35%] flex flex-col items-center">
              <div className="rounded-full bg-cyan p-1.5 shadow-lg ring-2 ring-white/30">
                📍
              </div>
              <div className="mt-1 rounded bg-bg/90 px-1.5 py-0.5 text-[9px] font-mono font-black text-cyan whitespace-nowrap">
                Salève · 8 km
              </div>
            </div>
            <div className="absolute left-[50%] top-[55%] flex flex-col items-center">
              <div className="rounded-full bg-peach p-1.5 shadow-lg ring-2 ring-white/30">
                📍
              </div>
              <div className="mt-1 rounded bg-bg/90 px-1.5 py-0.5 text-[9px] font-mono font-black text-peach whitespace-nowrap">
                Chartreuse · 22 km
              </div>
            </div>
            <div className="absolute left-[78%] top-[25%] flex flex-col items-center">
              <div className="rounded-full bg-lime p-1.5 shadow-lg ring-2 ring-white/30">
                📍
              </div>
              <div className="mt-1 rounded bg-bg/90 px-1.5 py-0.5 text-[9px] font-mono font-black text-lime whitespace-nowrap">
                Mont d&apos;Or
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-ink-muted leading-relaxed">
            Géoloc + filtre &laquo;&nbsp;à moins d&apos;1h&nbsp;&raquo;.
            Téléchargement GPX direct sur ta montre. Upload de tes propres
            traces.
          </p>
        </div>
      </section>

      {/* Capture #3 — Dossards en jeu */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          🎫 Dossards en jeu
        </div>
        <div className="rounded-3xl border-2 border-lime/30 bg-gradient-to-br from-lime/10 via-bg-card to-bg p-4 shadow-lg">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-black text-ink leading-tight">
                MaxiRace 84 km
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

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-bg-raised/60 p-2 text-xs">
              <span className="font-mono text-ink-muted">Tes tickets</span>
              <span className="font-display text-base font-black text-lime">
                🎟 7
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-bg-raised/60 p-2 text-xs">
              <span className="font-mono text-ink-muted">Participants</span>
              <span className="font-mono font-bold text-ink">342</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-bg-raised/60 p-2 text-xs">
              <span className="font-mono text-ink-muted">Lots en jeu</span>
              <span className="font-display font-black text-peach">
                3 dossards
              </span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-ink-muted leading-relaxed">
            Chaque km couru = des tickets. Tirage au sort à J-7. Dossards sur
            des courses partenaires.
          </p>
        </div>
      </section>

      {/* Bullets feature */}
      <section className="rounded-2xl border border-ink/10 bg-bg-card/60 p-4 space-y-2.5">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
          Et aussi…
        </div>
        <ul className="space-y-2 text-sm text-ink">
          <li className="flex gap-2">
            <span>🧠</span>
            <span>
              <strong>Coach IA</strong> · plan d&apos;entraînement perso pour
              {isNovice ? " ta première course" : " ton ultra"}
            </span>
          </li>
          {!isNovice && (
            <li className="flex gap-2">
              <span>🏴‍☠️</span>
              <span>
                <strong>OFF Races</strong> · FKT, courses pirates, GR projects
              </span>
            </li>
          )}
          {isNovice && (
            <li className="flex gap-2">
              <span>🌱</span>
              <span>
                <strong>Plan progressif</strong> · augmentation douce du volume
                pour éviter blessures
              </span>
            </li>
          )}
          <li className="flex gap-2">
            <span>📊</span>
            <span>
              <strong>Sync Strava 1 clic</strong> · ton historique importé
            </span>
          </li>
          <li className="flex gap-2">
            <span>🥗</span>
            <span>
              <strong>Gut training</strong> · plan 8 semaines pour tolérer 90g
              glucides/h
            </span>
          </li>
        </ul>
      </section>

      {/* CTA final */}
      <section className="rounded-3xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-5 text-center space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Prêt&nbsp;?
        </div>
        <h2 className="font-display text-2xl font-black leading-tight text-ink">
          Ton prochain ultra commence ici.
        </h2>
        <Link
          href="/signup"
          className="inline-block rounded-xl bg-peach px-6 py-3 font-mono text-sm font-black uppercase tracking-wider text-bg shadow-md hover:scale-[1.02] transition"
        >
          Créer mon compte gratuit
        </Link>
        <div className="text-[10px] font-mono text-ink-dim">
          Tu as déjà un compte ?{" "}
          <Link href="/login" className="text-peach underline">
            Connexion
          </Link>
        </div>
      </section>

      {/* Encart "Installe l'app" supprimé (l'app est déjà publiée sur le Store) */}

      {/* Comment on finance — transparence punchy */}
      <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4 space-y-2">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          🧾 On vit comment ?
        </div>
        <p className="text-xs text-ink leading-relaxed">
          <span className="font-bold text-ink">Pas de pub. Pas de revente de
          ta data.</span>{" "}
          On prend une commission quand un organisateur de course pousse son
          tirage de dossards via Esprit Trail (la marketplace B2B
          <Link
            href="/organisateurs"
            className="text-peach hover:underline ml-1"
          >
            /organisateurs
          </Link>
          ).
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center space-y-2 pt-4 border-t border-ink/5">
        <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-ink-dim">
          <Link href="/about" className="hover:text-ink">
            À propos
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-ink">
            Confidentialité
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
          <span>·</span>
          <Link href="/organisateurs" className="hover:text-ink">
            Organisateurs
          </Link>
        </div>
        <p className="text-[9px] text-ink-dim">
          Esprit Trail · Indépendant, sans pub, sans tracking tiers
        </p>
      </footer>
    </main>
  );
}
