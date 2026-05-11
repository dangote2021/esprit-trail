import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perdu en sortie longue",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
        Erreur 404
      </p>
      <h1 className="mt-3 text-4xl font-black leading-tight text-ink">
        Perdu en sortie longue.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">
        Cette page n'existe pas (ou plus). Même le meilleur GPS se fait
        avoir parfois. Demi-tour, on rentre au camp de base.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-lime px-5 py-3 text-sm font-black uppercase tracking-wider text-bg-card shadow-[0_4px_0_#1b4332] transition active:translate-y-[3px] active:shadow-[0_1px_0_#1b4332]"
      >
        Retour à l&apos;accueil →
      </Link>
    </div>
  );
}
