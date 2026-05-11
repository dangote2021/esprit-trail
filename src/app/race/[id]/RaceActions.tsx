"use client";

// ====== RaceActions ======
// Bloc d'actions principales sur la page détail course.
// Hiérarchie : la wishlist est la priorité (gros bouton en haut, full width),
// puis "Site officiel" + "Partager" en duo discret en dessous.

import { useEffect, useState } from "react";

const KEY = "esprit_wishlist_races";

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("esprit-wishlist-update"));
  } catch {
    /* ignore */
  }
}

export default function RaceActions({
  raceId,
  raceName,
  tagline,
  officialUrl,
}: {
  raceId: string;
  raceName?: string;
  tagline?: string;
  officialUrl?: string;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setInWishlist(loadWishlist().includes(raceId));
  }, [raceId]);

  const toggleWishlist = () => {
    const list = loadWishlist();
    const next = list.includes(raceId)
      ? list.filter((id) => id !== raceId)
      : [...list, raceId];
    saveWishlist(next);
    setInWishlist(next.includes(raceId));
  };

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/race/${raceId}`;
    const text = tagline
      ? `🏃 ${raceName || "Course"} — ${tagline}`
      : `🏃 ${raceName || "Cette course"} sur Esprit Trail`;
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: `${raceName || "Course"} — Esprit Trail`,
          text,
          url,
        });
        return;
      } catch {
        /* fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert("Lien copié dans le presse-papier");
    } catch {
      window.prompt("Copie ce lien :", url);
    }
  }

  return (
    <div className="space-y-2">
      {/* === WISHLIST — Action #1, gros bouton plein largeur === */}
      <button
        onClick={toggleWishlist}
        disabled={!hydrated}
        className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-base font-black uppercase tracking-wider transition btn-chunky ${
          !hydrated
            ? "bg-bg-card/60 text-ink-muted cursor-wait"
            : inWishlist
              ? "bg-lime text-bg shadow-glow-lime"
              : "bg-peach text-bg shadow-glow-peach hover:scale-[1.01] active:scale-[0.99]"
        }`}
        aria-label={
          inWishlist
            ? "Retirer de ma wishlist"
            : "Ajouter à ma wishlist"
        }
      >
        {!hydrated ? (
          "…"
        ) : inWishlist ? (
          <>
            <HeartFilled />
            <span>Dans ta wishlist</span>
          </>
        ) : (
          <>
            <HeartOutline />
            <span>Ajouter à ma wishlist</span>
          </>
        )}
      </button>

      {/* === Site officiel + Partager — actions secondaires en duo === */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={officialUrl || "#"}
          target={officialUrl ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`rounded-xl border-2 border-ink/15 bg-bg-card/60 py-2.5 text-center text-sm font-mono font-black uppercase tracking-wider transition ${
            officialUrl
              ? "text-ink hover:border-cyan/40 hover:text-cyan"
              : "text-ink-dim cursor-not-allowed opacity-50"
          }`}
          aria-disabled={!officialUrl}
          onClick={(e) => {
            if (!officialUrl) e.preventDefault();
          }}
        >
          🔗 Site officiel
        </a>
        <button
          onClick={handleShare}
          className="rounded-xl border-2 border-ink/15 bg-bg-card/60 py-2.5 text-center text-sm font-mono font-black uppercase tracking-wider text-ink hover:border-lime/40 hover:text-lime transition"
          aria-label={`Partager ${raceName || "cette course"} à tes contacts`}
        >
          ↗️ Partager
        </button>
      </div>
    </div>
  );
}

function HeartFilled() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 5.5-7 10-7 10z" />
    </svg>
  );
}

function HeartOutline() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
    >
      <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 5.5-7 10-7 10z" />
    </svg>
  );
}
