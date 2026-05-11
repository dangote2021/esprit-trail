"use client";

// ====== RaceActions ======
// Boutons "Site officiel" + "Ma wishlist" sur la page détail course.
// Wishlist persistée en localStorage (clé partagée avec /profile section
// "Mes courses ciblées"). Quand wishlistée → bouton passe au vert avec ✓.

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
    // Notifier les autres onglets/composants
    window.dispatchEvent(new Event("esprit-wishlist-update"));
  } catch {}
}

export default function RaceActions({
  raceId,
  officialUrl,
}: {
  raceId: string;
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

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={officialUrl || "#"}
        target={officialUrl ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="rounded-xl border border-ink/20 bg-bg-card/60 py-3 text-center font-bold text-ink hover:border-lime/40 transition"
      >
        🔗 Site officiel
      </a>
      <button
        onClick={toggleWishlist}
        disabled={!hydrated}
        className={`rounded-xl py-3 font-black transition ${
          !hydrated
            ? "bg-bg-card/60 text-ink-muted cursor-wait"
            : inWishlist
              ? "bg-lime text-bg shadow-glow-lime"
              : "bg-peach text-bg shadow-glow-peach hover:scale-[1.01]"
        }`}
      >
        {!hydrated ? "..." : inWishlist ? "✓ Dans ta wishlist" : "+ Ma wishlist"}
      </button>
    </div>
  );
}
