// ====== PAGE CONTACT ======
// Page support requise par les stores (Apple "Support URL", Google "Email contact")
// + référencée depuis le footer.

import Link from "next/link";
import FeedbackForm from "@/components/contact/FeedbackForm";

export const metadata = {
  title: "Contact & Support",
  description:
    "Une question, un bug, une idée ? Écris-nous. La team Esprit Trail répond vite.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-4 safe-top pb-10 space-y-6">
      <header className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-ink-muted hover:text-lime"
        >
          ← Retour
        </Link>
        <div className="mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          Support
        </div>
        <h1 className="mt-1 font-display text-3xl font-black leading-none">
          Une question, un bug, une idée ?
        </h1>
        <p className="mt-3 text-base text-ink-muted leading-relaxed">
          Pas de hotline, pas de bot. Juste une équipe de traileurs qui te
          répondent par email. On est petits, on lit tout, on répond dans
          les 48h.
        </p>
      </header>

      {/* Formulaire feedback — la "vraie" façon d'envoyer une idée */}
      <FeedbackForm />

      <section className="rounded-3xl border-2 border-lime/40 bg-bg-card/80 p-6 space-y-5">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
            Email principal
          </div>
          <a
            href="mailto:esprit.trail.app@gmail.com"
            className="mt-1 block font-display text-2xl font-black text-lime hover:underline"
          >
            esprit.trail.app@gmail.com
          </a>
        </div>

        <div className="border-t-2 border-dashed border-ink/10 pt-5">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
            Bug, plantage, vraie urgence
          </div>
          <a
            href="mailto:esprit.trail.app@gmail.com?subject=BUG%20Esprit%20Trail"
            className="mt-1 block font-display text-xl font-black text-ink hover:text-lime hover:underline"
          >
            esprit.trail.app@gmail.com
          </a>
        </div>

        <div className="border-t-2 border-dashed border-ink/10 pt-5">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
            Confidentialité, RGPD, droit à l&apos;oubli
          </div>
          <a
            href="mailto:esprit.trail.app@gmail.com"
            className="mt-1 block font-display text-base font-black text-ink hover:text-lime hover:underline"
          >
            esprit.trail.app@gmail.com
          </a>
          <p className="mt-2 text-xs text-ink-muted">
            Tu peux aussi supprimer ton compte directement depuis{" "}
            <Link
              href="/settings/account"
              className="text-lime underline hover:no-underline"
            >
              tes paramètres
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-ink/10 bg-bg-card/60 p-5">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          Avant d&apos;écrire
        </div>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted leading-relaxed">
          <li>• Rejoint déjà la communauté Esprit Trail sur Strava</li>
          <li>• Vérifie qu&apos;il y a pas un upgrade en attente côté ta version</li>
          <li>• Précise ton modèle de téléphone et OS pour les bugs</li>
        </ul>
      </section>

      <p className="text-center text-xs text-ink-dim">
        Esprit Trail · L&apos;app trail FR
      </p>
    </main>
  );
}
