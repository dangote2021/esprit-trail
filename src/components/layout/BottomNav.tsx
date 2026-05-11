"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeWhen: (path: string) => boolean;
};

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Home",
    activeWhen: (p) => p === "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 11L12 4l9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9Z" />
      </svg>
    ),
  },
  {
    href: "/spots",
    label: "Spots",
    activeWhen: (p) => p.startsWith("/spot") || p.startsWith("/quest"),
    icon: (
      // Pin de localisation (compass-like)
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    href: "/races",
    label: "Courses",
    activeWhen: (p) => p.startsWith("/race"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 21L12 3l9 18M8 15h8" />
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    label: "Ranking",
    activeWhen: (p) => p.startsWith("/leaderboard"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M4 20h4V10H4v10ZM10 20h4V4h-4v16ZM16 20h4v-8h-4v8Z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profil",
    activeWhen: (p) => p.startsWith("/profile") || p.startsWith("/badges"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname() || "/";
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  // Détection présence cookie auth Supabase côté client (indicatif).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const hasAuth = document.cookie
      .split(";")
      .some((c) => c.trim().match(/^sb-[a-z0-9]+-auth-token/));
    setIsLogged(hasAuth);
  }, []);

  // Hide on onboarding, auth, legal, and PUBLIC marketing pages
  // (sinon affiche des liens auth-required à un visiteur non connecté).
  if (
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/mentions") ||
    pathname.startsWith("/organisateurs") ||
    pathname.startsWith("/install") ||
    pathname.startsWith("/challenges/loto")
  )
    return null;

  // Pages publiques en mode "Découverte" — le BottomNav loggé pointe vers
  // /profile, /leaderboard qui sont auth-only et redirigent vers /login.
  // Pour les non-loggés on affiche un nav minimaliste 3 entrées + CTA signup.
  const isPublicDiscovery =
    pathname === "/" ||
    pathname.startsWith("/spots") ||
    pathname.startsWith("/race/");

  if (isPublicDiscovery && isLogged === false) {
    return (
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink/20 bg-bg-card/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(27,67,50,0.1)] safe-bottom"
        aria-label="Navigation découverte"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2 gap-1">
          <li className="flex-1">
            <Link
              href="/spots"
              className={`group flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition ${
                pathname.startsWith("/spot") ? "text-cyan" : "text-ink-muted"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Spots
              </span>
            </Link>
          </li>
          <li className="flex-1">
            <Link
              href="/demo"
              className="group flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-ink-muted transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path d="M5 4l14 8-14 8V4z" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Démo
              </span>
            </Link>
          </li>
          <li className="flex-[1.4]">
            <Link
              href="/signup"
              className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-lime mx-1 my-1 py-1.5 text-bg shadow-md hover:scale-[1.02] transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider leading-none">
                Crée ton compte
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  // Si on est sur une page publique mais qu'on n'a pas encore détecté l'auth
  // (hydratation en cours), on évite le flash en cachant.
  if (isPublicDiscovery && isLogged === null) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink/20 bg-bg-card/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(27,67,50,0.1)] safe-bottom"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 pt-2">
        {NAV.map((item) => {
          const active = item.activeWhen(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`group flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition ${
                  active ? "text-lime" : "text-ink-muted"
                }`}
              >
                <span
                  className={`transition ${
                    active ? "drop-shadow-[0_0_6px_rgba(45,106,79,0.55)]" : "group-hover:text-ink"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
