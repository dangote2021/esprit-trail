"use client";

// ====== Masterclass — "Pas péter au 15ème kil" ======
// Le guide pratique pour gérer son effort, sa nutri, sa tête, et finir
// solide une course de trail. Pas du blabla — des règles actionnables
// que les vrais traileurs appliquent.
//
// Structure : 6 chapitres + checklist finale + lien retour vers coach.

import { useState } from "react";
import Link from "next/link";

type ChapterId =
  | "pacing"
  | "nutri"
  | "hydra"
  | "mental"
  | "gut"
  | "kit"
  | "recovery";

const CHAPTERS: {
  id: ChapterId;
  emoji: string;
  title: string;
  punchline: string;
  accent: "lime" | "peach" | "cyan" | "violet" | "gold";
}[] = [
  {
    id: "pacing",
    emoji: "🐢",
    title: "Pacing — Pars plus lentement que tu penses",
    punchline: "Le piège n°1. 90% des bonks viennent d'un départ trop rapide.",
    accent: "lime",
  },
  {
    id: "nutri",
    emoji: "🍫",
    title: "Nutrition — Mange AVANT d'avoir faim",
    punchline: "Si t'as faim, t'es déjà à découvert. Cible 60-90 g de glucides/h.",
    accent: "peach",
  },
  {
    id: "hydra",
    emoji: "💧",
    title: "Hydratation — Eau + sel, pas l'un sans l'autre",
    punchline: "Boire trop d'eau pure = hyponatrémie. Sel à chaque ravito.",
    accent: "cyan",
  },
  {
    id: "mental",
    emoji: "🧠",
    title: "Mental — Découpe la course en petits bouts",
    punchline: "Personne ne fait 80 km. On fait 8 fois 10 km. Ou 800 fois 100 m.",
    accent: "violet",
  },
  {
    id: "gut",
    emoji: "🫃",
    title: "Gut training — Entraîne ton ventre",
    punchline: "L'estomac, c'est un muscle. À l'entraînement aussi, mange.",
    accent: "gold",
  },
  {
    id: "kit",
    emoji: "🎒",
    title: "Kit — Rien de nouveau le jour J",
    punchline: "La chaussette neuve qui frotte = abandon au 25e. Teste tout avant.",
    accent: "lime",
  },
  {
    id: "recovery",
    emoji: "🛌",
    title: "Récup — Le vrai gain est entre les séances",
    punchline: "Sommeil > entraînement. Si tu dors mal, tu progresses pas.",
    accent: "peach",
  },
];

const ACCENT_BORDERS: Record<string, string> = {
  lime: "border-lime/40 bg-lime/5",
  peach: "border-peach/40 bg-peach/5",
  cyan: "border-cyan/40 bg-cyan/5",
  violet: "border-violet/40 bg-violet/5",
  gold: "border-gold/40 bg-gold/5",
};

const ACCENT_TEXT: Record<string, string> = {
  lime: "text-lime",
  peach: "text-peach",
  cyan: "text-cyan",
  violet: "text-violet",
  gold: "text-gold",
};

export default function MasterclassPage() {
  const [open, setOpen] = useState<ChapterId | null>(null);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-20 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/coach"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-cyan transition"
          aria-label="Retour au coach"
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
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Masterclass
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            Pas péter au 15ème
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-peach/30 bg-gradient-to-br from-peach/15 via-gold/10 to-bg p-6 card-shine">
        <div className="text-5xl mb-3 animate-float">💥</div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
          La masterclass des Bouzin
        </div>
        <h2 className="mt-1 font-display text-2xl font-black leading-tight">
          7 règles pour rester solide jusqu'au bout.
        </h2>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          Personne pète au 15ème par hasard. Y a des causes, et y a des solutions
          concrètes. Voici ce que les vrais traileurs appliquent — pas du blabla
          de blog, des règles testées sur 50 ultras.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="rounded-md bg-peach/20 px-2 py-1 font-bold text-peach">
            7 chapitres
          </span>
          <span className="rounded-md bg-cyan/20 px-2 py-1 font-bold text-cyan">
            ~12 min de lecture
          </span>
          <span className="rounded-md bg-lime/20 px-2 py-1 font-bold text-lime">
            100% actionnable
          </span>
        </div>
      </section>

      {/* Sommaire / Chapitres */}
      <section className="space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted px-1">
          Les 7 règles
        </div>

        {CHAPTERS.map((c, i) => {
          const isOpen = open === c.id;
          return (
            <div
              key={c.id}
              className={`rounded-2xl border-2 transition ${
                isOpen
                  ? ACCENT_BORDERS[c.accent]
                  : "border-ink/10 bg-bg-card/40"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[10px] font-mono font-bold uppercase tracking-widest ${ACCENT_TEXT[c.accent]}`}
                  >
                    Règle {i + 1}
                  </div>
                  <div className="mt-0.5 font-display text-base font-black leading-tight">
                    {c.title}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-muted leading-relaxed">
                    {c.punchline}
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`h-5 w-5 shrink-0 text-ink-dim transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t border-ink/10 px-4 pb-4 pt-3 text-sm leading-relaxed">
                  <ChapterContent id={c.id} />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Checklist veille / matin de course */}
      <section className="rounded-3xl border-2 border-cyan/40 bg-cyan/5 p-5 card-chunky">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
          Checklist · Veille + matin J
        </div>
        <h3 className="mt-1 font-display text-xl font-black">
          Le mémo final avant le départ
        </h3>
        <ul className="mt-4 space-y-2.5 text-sm">
          {[
            "Pasta party la veille — pas de plat épicé / nouveau / exotique",
            "8h de sommeil minimum 2 nuits avant (celle de la veille compte moins que J-2)",
            "Petit-déj 3h avant le départ — flocons d'avoine + banane + miel + un peu de sel",
            "Échauffement de 10 min : marche rapide + 5 lignes droites légères",
            "Vérifie ton sac : eau pleine, gels comptés, frontale chargée, sifflet, couverture survie",
            "Mets de la vaseline / NOK sur les zones de frottement (cuisses, aisselles, tétons, pieds)",
            "Vise ton 1er ravito comme premier objectif — pas la ligne d'arrivée",
            "Sourire au km 1. Sérieusement. Ça envoie le signal au cerveau.",
          ].map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan/20 font-mono text-[10px] font-black text-cyan">
                ✓
              </span>
              <span className="text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom — Coach IA pour aller plus loin */}
      <section className="rounded-2xl border border-violet/30 bg-violet/5 p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🧠</div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet">
              Aller plus loin
            </div>
            <div className="mt-0.5 font-display text-base font-black">
              Plan d'entraînement perso
            </div>
            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              Le Coach IA applique ces 7 règles à TON profil, TON objectif, TON
              calendrier. Plan semaine par semaine avec séances, nutri, taper.
            </p>
            <Link
              href="/coach"
              className="mt-3 inline-block rounded-lg bg-violet px-3 py-2 text-xs font-mono font-black uppercase tracking-wider text-bg transition hover:scale-[1.02]"
            >
              Générer mon plan →
            </Link>
          </div>
        </div>
      </section>

      <div className="text-center text-[10px] font-mono text-ink-dim pt-2">
        Lu et appliqué par 437 Bouzin · MAJ mai 2026
      </div>
    </main>
  );
}

// ====== Contenu de chaque chapitre ======
function ChapterContent({ id }: { id: ChapterId }) {
  switch (id) {
    case "pacing":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            La règle d'or : <strong>tes 5 premiers km doivent te paraître trop lents.</strong>
            Si tu te dis "ça va, je tiens cette allure", c'est que tu vas trop vite.
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime mb-1">
              Repères concrets
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>FC max - 30 bpm</strong> sur les 30 premières minutes
              </li>
              <li>
                • Tu dois pouvoir <strong>tenir une conversation entière</strong> sans haleter
              </li>
              <li>
                • Sur trail montagneux : <strong>marche dès 8% de pente</strong>, même si tu te sens fort
              </li>
              <li>
                • Garde <strong>20% de réserve mentale</strong> jusqu'à la moitié de la course
              </li>
            </ul>
          </div>
          <p>
            Le runner qui passe devant toi au km 3 ? Tu le verras au km 30, sur le bas-côté.
            Promis.
          </p>
        </div>
      );

    case "nutri":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            Tu dois manger <strong>avant d'avoir faim</strong>. Quand la faim arrive, t'es
            déjà à -300 kcal de retard sur tes réserves. Le bonk est imminent.
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach mb-1">
              La règle des 60-90 g/h
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>Sortie 1-2h</strong> : 30-40 g de glucides/h (1 gel toutes les 40 min)
              </li>
              <li>
                • <strong>Trail 3-6h</strong> : 60 g/h (1 gel + 1 barre énergétique/h)
              </li>
              <li>
                • <strong>Ultra 6h+</strong> : 70-90 g/h, alterne sucré / salé / liquide
              </li>
              <li>
                • <strong>Premier apport dès le km 5</strong>, pas au premier ravito
              </li>
            </ul>
          </div>
          <p>
            Sur ultra, varie les textures : gels c'est bien 1h, après ton ventre supplie.
            Banane, pâte de fruit, riz, soupe, coca dégazé — n'importe quoi mais
            <strong> du carburant solide qui change</strong>.
          </p>
        </div>
      );

    case "hydra":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            Boire de l'eau pure pendant 6h = <strong>hyponatrémie</strong>. C'est dangereux.
            Te dilue le sang en sodium, tu peux convulser ou perdre connaissance.
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan mb-1">
              Combien d'eau, combien de sel
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>400-600 ml d'eau/h</strong> selon la chaleur
              </li>
                            <li>
                • <strong>500-700 mg de sodium/h</strong> (1 pastille électrolyte/45 min)
              </li>
              <li>
                • <strong>Pisse claire = trop bu</strong>, pisse foncée = pas assez
              </li>
              <li>
                • Par grosse chaleur : <strong>+30%</strong> sur eau ET sel
              </li>
            </ul>
          </div>
          <p>
            Test simple : si tes mains gonflent (bagues serrées) → tu bois trop sans sel.
            Si t'as la tête qui tape → tu bois pas assez. Écoute le corps, pas la montre.
          </p>
        </div>
      );

    case "mental":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            Personne ne court 80 km. <strong>Personne.</strong> On court d'un ravito au
            suivant, d'un sommet au suivant, d'un arbre au suivant. <strong>Découpe
            ou crève.</strong>
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet mb-1">
              Techniques anti-bonk mental
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>Saucissonnage</strong> : course → segments de 5-10 km, célèbre chaque borne
              </li>
                            <li>
                • <strong>Mantra court</strong> : 3 mots à toi (ex : "léger, fort, libre")
              </li>
              <li>
                • <strong>Penser aux autres</strong> : ta team, tes proches qui suivent
              </li>
              <li>
                • <strong>Sourire forcé</strong> 10 sec — le cerveau réinterprète "ah, ça va donc"
              </li>
              <li>
                • <strong>Zoom out</strong> : "dans 2 semaines je serai à la plage à raconter cette course"
              </li>
            </ul>
          </div>
          <p>
            La phase noire du km 50-60 est <strong>obligatoire et passagère</strong>.
            Si tu sais qu'elle arrive, t'es pas surpris. Tu acceptes, tu marches,
            tu manges, tu repars. Aucun coureur n'y échappe.
          </p>
        </div>
      );

    case "gut":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            L'estomac, c'est un muscle. À l'entraînement aussi, <strong>mange en
            courant</strong>. Pas seulement le jour J. Sinon, premier gel à effort
            réel = vomi assuré.
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold mb-1">
              Protocole 8 semaines avant la course
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>Semaine 1-2</strong> : 1 gel par sortie longue de +1h30
              </li>
              <li>
                • <strong>Semaine 3-4</strong> : 1 gel toutes les 45 min en sortie longue
              </li>
              <li>
                • <strong>Semaine 5-6</strong> : monte à 60 g de glucides/h, teste différentes marques
              </li>
              <li>
                • <strong>Semaine 7-8</strong> : cible le format exact de ta course (mêmes gels, même rythme)
              </li>
            </ul>
          </div>
          <p>
            Et surtout : <strong>identifie les ingrédients qui te ballonnent</strong>.
            Maltodextrine OK, fructose c'est souvent le coupable, caféine
            jamais le matin si tu cours l'après-midi.
          </p>
        </div>
      );

    case "kit":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            <strong>Aucune nouveauté le jour J.</strong> Pas de chaussettes neuves,
            pas de tee-shirt acheté la veille, pas de sac jamais testé. Tout doit
            avoir au moins <strong>3 sorties longues à son actif</strong>.
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime mb-1">
              Anti-ampoule / anti-frottement
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>Chaussettes anti-ampoules</strong> (Injinji doigts séparés ou X-Socks)
              </li>
              <li>
                • <strong>NOK ou Squirrel's Nut Butter</strong> sur toutes les zones à risque
              </li>
              <li>
                • <strong>Chaussures rodées</strong> : minimum 50 km avant la course
              </li>
              <li>
                • <strong>Sac réglé serré</strong> : si ça rebondit, ça frotte → ampoule épaule garantie
              </li>
            </ul>
          </div>
          <p>
            Règle bonus : sur ultra, prends <strong>une 2e paire de chaussettes
            sèches</strong> dans le sac. Changer au ravito du milieu = jambes neuves.
          </p>
        </div>
      );

    case "recovery":
      return (
        <div className="space-y-3 text-ink/90">
          <p>
            Tu progresses <strong>pendant le repos</strong>, pas pendant l'effort.
            L'entraînement détruit, le sommeil reconstruit. Sans bon sommeil,
            t'es juste en train de t'épuiser.
          </p>
          <div className="rounded-lg bg-bg-raised/60 p-3 border border-ink/10">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach mb-1">
              Les 3 piliers de la récup
            </div>
            <ul className="space-y-1.5 text-xs text-ink/85">
              <li>
                • <strong>Sommeil</strong> : 7-9h, écran off 1h avant, chambre fraîche (18°C)
              </li>
              <li>
                • <strong>Recharge glycogène</strong> : protéines + glucides dans les 30 min post-séance
              </li>
              <li>
                • <strong>Décharge mentale</strong> : 1 jour off complet par semaine, sans sport
              </li>
            </ul>
          </div>
          <p>
            Indice de fatigue : si ta <strong>FC au repos est +5 bpm</strong> au-dessus
            de ta normale au réveil, lève le pied le jour-même. C'est ton corps qui
            te dit "pas aujourd'hui". L'écouter, c'est ce qui fait les finishers.
          </p>
        </div>
      );

    default:
      return null;
  }
}
