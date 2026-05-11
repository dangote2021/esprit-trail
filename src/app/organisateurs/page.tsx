// ====== /organisateurs — Landing B2B ======
// Pour les organisateurs de course qui veulent mettre des dossards en jeu sur
// Esprit Trail. Value prop : audience qualifiée traileurs FR, exposition forte,
// activation virale (chaque ticket distribue un lien WhatsApp).

import type { Metadata } from "next";
import Link from "next/link";
import { BIB_CHALLENGES } from "@/lib/data/bib-challenges";

export const metadata: Metadata = {
  title: "Organisateurs de course — Mets ton dossard en jeu sur Esprit Trail",
  description:
    "Mets un ou plusieurs dossards en jeu sur Esprit Trail. Exposition garantie auprès d'une audience qualifiée de traileurs francophones. Tu valides quel dossard, quel challenge, quelle deadline.",
};

export default function OrganisateursPage() {
  const totalParticipants = BIB_CHALLENGES.reduce(
    (s, c) => s + c.participants,
    0,
  );
  const totalTickets = BIB_CHALLENGES.reduce((s, c) => s + c.ticketsSold, 0);

  return (
    <main className="mx-auto max-w-2xl px-5 safe-top pb-12 space-y-8">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-xl card-chunky bg-bg-card p-2 text-ink-muted hover:text-lime transition tap-bounce"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Organisateurs de course
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            Esprit Trail × Ta course
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-lime/40 bg-gradient-to-br from-lime/15 via-cyan/10 to-bg p-6 card-shine">
        <div className="pointer-events-none absolute -right-6 -bottom-6 text-[180px] opacity-[0.08] leading-none select-none">
          🎫
        </div>
        <div className="relative">
          <h2 className="font-display text-3xl font-black leading-tight text-ink">
            Mets un dossard en jeu.<br />
            <span className="text-lime">Touche 1 000+ traileurs qualifiés.</span>
          </h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Tu offres un ou plusieurs dossards à ta course. Esprit Trail construit
            le challenge, anime la communauté, gère le tirage. Toi, tu récupères
            une exposition forte auprès d'une audience qui pratique vraiment.
          </p>
        </div>
      </section>

      {/* Métriques */}
      <section className="grid grid-cols-3 gap-3">
        <Stat
          label="Tirages actifs"
          value={BIB_CHALLENGES.filter((c) => c.status === "open").length.toString()}
          accent="lime"
        />
        <Stat
          label="Participants cumulés"
          value={totalParticipants.toLocaleString("fr-FR")}
          accent="peach"
        />
        <Stat
          label="Tickets distribués"
          value={totalTickets.toLocaleString("fr-FR")}
          accent="violet"
        />
      </section>

      {/* Pourquoi Esprit Trail */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          Ce que tu gagnes
        </div>

        <BenefitCard
          emoji="🎯"
          title="Audience qualifiée, pas de pub massive"
          desc="Sur Esprit Trail, tu ne touches que des gens qui courent vraiment. Profil traileur déclaré, distance/D+ tracés, gear utilisé. Pas du retargeting Meta sur des fans de Strava de canapé."
        />
        <BenefitCard
          emoji="🔒"
          title="Seuil d'accès calibré sur ta course"
          desc="On ne fait pas gagner un dossard à n'importe qui. Pour participer à ton tirage, l'utilisateur doit avoir cumulé un volume km + D+ minimum sur les 30 derniers jours, calé sur la difficulté de ton épreuve. Tu décides du seuil avec nous."
        />
        <BenefitCard
          emoji="📣"
          title="Activation virale, pas juste un post Insta"
          desc="Chaque participant invite ses potes WhatsApp pour gagner des tickets bonus. Ton tirage se propage dans les WhatsApp de groupes trail, là où les inscriptions vraies se déclenchent."
        />
        <BenefitCard
          emoji="🤝"
          title="Pas de cash flow inversé"
          desc="Tu offres le dossard que tu aurais probablement filé en partenariat de toute façon. Esprit Trail ne te facture aucun frais d'animation pour le lancement — on construit la confiance d'abord."
        />
        <BenefitCard
          emoji="📊"
          title="Reporting transparent"
          desc="Avant tirage : nb participants, nb tickets, nb partages WhatsApp. Après tirage : winner email vérifié, possibilité d'un retour vidéo si tu en veux un."
        />
      </section>

      {/* Comment ça marche pour toi */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Le deal en 4 étapes
        </div>
        <Step n={1} title="Tu nous écris">
          Email court avec : nom de la course, date, valeur du dossard,
          combien tu en mets en jeu, deadline qui t'arrange.
        </Step>
        <Step n={2} title="On cale le challenge ensemble">
          Distance, D+, sortie longue, cumul hebdo… on choisit la mécanique
          qui colle à ton ADN de course (un trail technique = un challenge D+
          ; un ultra = une sortie longue 3h).
        </Step>
        <Step n={3} title="Esprit Trail anime, partage, propage">
          Mise en avant home + push réseaux Esprit Trail + mécanique de partage
          WhatsApp. Tu reçois les chiffres en temps réel.
        </Step>
        <Step n={4} title="Tirage public + transfert d'inscription">
          Tirage le jour J, on te transmet le winner avec son email vérifié,
          tu finalises l'inscription côté ta plateforme.
        </Step>
      </section>

      {/* Profil typique participant */}
      <section className="rounded-3xl border-2 border-violet/40 bg-violet/10 p-5 space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
          Profil de l'audience Esprit Trail
        </div>
        <h3 className="font-display text-lg font-black text-ink leading-snug">
          25-45 ans, francophones, traileurs actifs (12+ courses/an), revenu
          médian, sensibles à l'éthique outdoor.
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          Esprit Trail attire les coureurs lassés de la course-spectacle hyper-bookée.
          Public peu touché par les pubs traditionnelles, très réceptif aux
          formats authentiques. UTMB World Series jusqu'au FKT collectif :
          spectre large, pourvu que ce soit honnête.
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border-2 border-lime/60 bg-gradient-to-br from-lime/20 via-peach/10 to-bg p-6 text-center space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          On en parle ?
        </div>
        <h3 className="font-display text-2xl font-black text-ink">
          Écris-nous, on revient sous 48h.
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed">
          Pas de slide deck, pas de RDV à rallonge. Un email, un appel court,
          on cale le tirage en 1 semaine.
        </p>
        <a
          href="mailto:esprit.trail.app@gmail.com?subject=Dossard%20en%20jeu%20sur%20Esprit%20Trail&body=Bonjour%20l%27%C3%A9quipe%20Esprit%20Trail%2C%0A%0ANous%20sommes%20l%27organisation%20de%20...%0AOn%20aimerait%20mettre%20...%20dossard(s)%20en%20jeu.%0A%0ADate%20de%20la%20course%20%3A%20%0AValeur%20du%20dossard%20%3A%20%0ACombien%20de%20places%20%3A%20%0ANotre%20site%20%3A%20%0A%0AMerci%20%21"
          className="block rounded-2xl bg-lime py-4 text-center font-display font-black uppercase tracking-wider text-bg btn-chunky tap-bounce"
        >
          ✉ Soumettre un dossard
        </a>
        <Link
          href="/challenges/loto"
          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-ink underline-offset-4 hover:underline"
        >
          Voir les tirages déjà en cours →
        </Link>
      </section>

      {/* Mini FAQ */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Questions fréquentes
        </div>
        <Faq
          q="C'est légal, ce truc ?"
          a="Oui. Le tirage Esprit Trail est gratuit, sans mise ni achat — c'est un cadeau d'organisateur, pas un jeu d'argent. Cadre : article L322-2-1 du Code de la sécurité intérieure FR, qui exclut les tirages gratuits sans contrepartie."
        />
        <Faq
          q="Et si personne ne valide le challenge ?"
          a="On reporte le tirage ou on annule, à ta main. Tu n'es jamais engagé à donner un dossard si la commu ne s'active pas — mais en pratique, c'est jamais arrivé."
        />
        <Faq
          q="Vous prenez une commission ?"
          a="Pas pour l'instant. On est en phase de bootstrap commu, on veut prouver le modèle d'abord. Plus tard on facturera peut-être un forfait fixe d'animation, transparent."
        />
        <Faq
          q="On peut mettre autre chose qu'un dossard ?"
          a="Oui. Pack inscription + hébergement, accès VIP, dotations matos, place sur un stage de prépa… tant que c'est de la valeur trail, on creuse."
        />
      </section>

      <Link
        href="/"
        className="block rounded-2xl border-2 border-ink/10 bg-bg-card/60 py-3 text-center font-display font-black uppercase tracking-wider text-ink-muted text-sm hover:border-lime/40 hover:text-ink transition"
      >
        ← Retour à l'app
      </Link>
    </main>
  );
}

// ====== Sub-components ======

function Stat({ label, value, accent }: { label: string; value: string; accent: "lime" | "peach" | "violet" }) {
  const cls: Record<string, string> = {
    lime: "border-lime/40 text-lime",
    peach: "border-peach/40 text-peach",
    violet: "border-violet/40 text-violet",
  };
  return (
    <div className={`rounded-2xl border-2 ${cls[accent]} bg-bg-card/60 p-3 text-center`}>
      <div className="font-display text-2xl font-black">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted mt-0.5">
        {label}
      </div>
    </div>
  );
}

function BenefitCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4">
      <div className="text-2xl mb-1.5">{emoji}</div>
      <div className="font-display text-base font-black text-ink">{title}</div>
      <p className="mt-1 text-sm text-ink-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-4 flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach/15 font-display text-base font-black text-peach">
        {n}
      </div>
      <div>
        <div className="font-display text-base font-black text-ink">{title}</div>
        <p className="mt-0.5 text-sm text-ink-muted leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-ink/10 bg-bg-card/40 p-4">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-2 font-display text-sm font-black text-ink">
        <span>{q}</span>
        <span className="text-ink-muted text-xs font-mono group-open:rotate-180 transition">▾</span>
      </summary>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{a}</p>
    </details>
  );
}
