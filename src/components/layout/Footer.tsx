"use client";

// ====== FOOTER GLOBAL ======
// Liens légaux + crédit. Discret, présent au bas de chaque page protégée.
// Masqué sur : onboarding, auth, legal (le layout legal a sa propre nav).

import Link from "next/link";
import { usePathname } from "next/navigation";
import LangToggle from "@/components/i18n/LangToggle";

export default function Footer() {
  const pathname = usePathname() || "/";

  const hidden =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/legal");

  // Sur les pages publiques marketing (/about, /contact), on affiche un footer
  // simplifié (pas de lien Compte, qui redirige vers login).
  const isPublicMarketing =
    pathname.startsWith("/about") || pathname.startsWith("/contact");

  if (hidden) return null;

  if (isPublicMarketing) {
    return (
      <footer className="relative z-10 mx-auto mt-10 max-w-lg px-5 pb-4 pt-8 text-center">
        <div className="border-t border-ink/10 pt-4">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            <Link href="/legal/cgu" className="hover:text-ink">CGU</Link>
            <span className="text-ink/20">·</span>
            <Link href="/legal/privacy" className="hover:text-ink">Confidentialité</Link>
            <span className="text-ink/20">·</span>
            <Link href="/legal/mentions" className="hover:text-ink">Mentions</Link>
            <span className="text-ink/20">·</span>
            <Link href="/contact" className="hover:text-ink">Contact</Link>
          </nav>
          <p className="mt-3 text-[10px] text-ink-dim">
            Esprit Trail · Fait avec les pieds boueux · Made in France 🇫🇷
          </p>
          <div className="mt-3 flex justify-center">
            <LangToggle />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative z-10 mx-auto mt-10 max-w-lg px-5 pb-4 pt-8 text-center">
      <div className="border-t border-ink/10 pt-4">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
          <Link href="/legal/cgu" className="hover:text-ink">CGU</Link>
          <span className="text-ink/20">·</span>
          <Link href="/legal/privacy" className="hover:text-ink">Confidentialité</Link>
          <span className="text-ink/20">·</span>
          <Link href="/legal/mentions" className="hover:text-ink">Mentions</Link>
          <span className="text-ink/20">·</span>
          <Link href="/settings/account" className="hover:text-ink">Compte</Link>
        </nav>
        <p className="mt-3 text-[10px] text-ink-dim">
          Esprit Trail · Fait avec les pieds boueux · Made in France 🇫🇷
        </p>
        <div className="mt-3 flex justify-center">
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
