// ====== LAYOUT PAGES LÉGALES ======
// Wrapper commun pour CGU, Privacy, Mentions légales.

import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-12 pb-24">
      <Link
        href="/"
        className="mb-8 inline-block text-xs font-mono uppercase tracking-widest text-ink-muted hover:text-ink"
      >
        ← Retour
      </Link>
      <article className="prose-ravito">{children}</article>

      <nav className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-xs font-mono uppercase tracking-wider text-ink-muted">
        <Link href="/legal/cgu" className="hover:text-ink">CGU</Link>
        <Link href="/legal/privacy" className="hover:text-ink">Confidentialité</Link>
        <Link href="/legal/mentions" className="hover:text-ink">Mentions légales</Link>
      </nav>
    </div>
  );
}
