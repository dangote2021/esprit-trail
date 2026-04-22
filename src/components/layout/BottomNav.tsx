"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    href: "/quests",
    label: "Quêtes",
    activeWhen: (p) => p.startsWith("/quest"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M7 3v18M17 3v18M3 7h18M3 17h18" />
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
    label: "Ladder",
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
  // Hide on onboarding
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bg/90 backdrop-blur-lg safe-bottom"
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
                    active ? "drop-shadow-[0_0_8px_rgba(194,255,46,0.6)]" : "group-hover:text-ink"
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
