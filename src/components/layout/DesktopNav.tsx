"use client";

// ====== DESKTOP NAV ======
// Top bar visible uniquement en desktop (md+).
// Mobile : la BottomNav reste la référence.

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  activeWhen: (path: string) => boolean;
};

const NAV: NavItem[] = [
  { href: "/", label: "Home", activeWhen: (p) => p === "/" },
  { href: "/quests", label: "Quêtes", activeWhen: (p) => p.startsWith("/quest") },
  { href: "/races", label: "Courses", activeWhen: (p) => p.startsWith("/race") },
  { href: "/leaderboard", label: "Ladder", activeWhen: (p) => p.startsWith("/leaderboard") },
  { href: "/profile", label: "Profil", activeWhen: (p) => p.startsWith("/profile") || p.startsWith("/badges") },
];

export default function DesktopNav() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 hidden border-b-2 border-ink/20 bg-bg-card/95 backdrop-blur-lg shadow-[0_4px_20px_rgba(27,67,50,0.08)] md:block"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link
          href="/about"
          className="group flex items-center gap-2.5 transition hover:scale-[1.02]"
          aria-label="À propos de Ravito"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-lime shadow-glow-lime card-chunky">
            <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7 text-bg">
              {/* Gobelet ravito + goutte — miniature du logo */}
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
          <div className="leading-none">
            <div className="font-display text-xl font-black tracking-tight">Ravito</div>
            <div className="mt-1 text-[9px] font-mono font-black uppercase tracking-[0.2em] text-lime">
              Le trail, il a changé
            </div>
          </div>
        </Link>

        {/* Nav items */}
        <ul className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.activeWhen(pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative rounded-xl px-4 py-2 font-display text-sm font-black uppercase tracking-wider transition ${
                    active
                      ? "bg-lime/15 text-lime"
                      : "text-ink-muted hover:bg-bg/40 hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-lime" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick action — Lance une sortie */}
        <Link
          href="/run/new"
          className="rounded-xl bg-peach px-4 py-2 font-display text-sm font-black uppercase tracking-wider text-bg btn-chunky tap-bounce"
        >
          + Lancer
        </Link>
      </div>
    </header>
  );
}
