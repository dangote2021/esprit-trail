"use client";

// ====== WishlistRaces ======
// Affiche les courses ajoutées à la wishlist (depuis /race/[id]).
// Lecture localStorage côté client. S'auto-rafraîchit via event custom.

import { useEffect, useState } from "react";
import Link from "next/link";
import { RACES } from "@/lib/data/races";
import type { Race } from "@/lib/types";

const KEY = "esprit_wishlist_races";

function loadIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function WishlistRaces() {
  const [hydrated, setHydrated] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setHydrated(true);
    setIds(loadIds());
    const refresh = () => setIds(loadIds());
    window.addEventListener("esprit-wishlist-update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit-wishlist-update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!hydrated) {
    return null;
  }

  const wishlistedRaces: Race[] = ids
    .map((id) => RACES.find((r) => r.id === id))
    .filter((r): r is Race => !!r)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (wishlistedRaces.length === 0) {
    return (
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
          Tes courses ciblées
        </div>
        <Link
          href="/races"
          className="block rounded-xl border-2 border-dashed border-ink/20 bg-bg-card/30 p-4 text-center text-xs text-ink-muted hover:border-peach/50 hover:text-ink transition"
        >
          Aucune course wishlistée pour l&apos;instant.
          <br />
          <span className="font-mono font-bold text-peach mt-1 inline-block">
            → Découvrir le calendrier
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
          Tes courses ciblées · {wishlistedRaces.length}
        </div>
        <Link
          href="/races"
          className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          Calendrier complet →
        </Link>
      </div>
      <div className="space-y-2">
        {wishlistedRaces.map((race) => {
          const days = Math.ceil(
            (new Date(race.date).getTime() - Date.now()) / 86400000,
          );
          return (
            <Link
              key={race.id}
              href={`/race/${race.id}`}
              className="flex items-center gap-3 rounded-xl border-2 border-peach/30 bg-bg-card/60 p-3 transition hover:border-peach/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-peach/15 text-peach text-lg">
                ⭐
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm font-black text-ink leading-tight truncate">
                  {race.name}
                </div>
                <div className="text-[10px] font-mono text-ink-muted">
                  {race.location} · {race.distance}km · {race.elevation}D+
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] font-mono uppercase text-ink-dim">
                  dans
                </div>
                <div className="font-display text-base font-black text-peach leading-none">
                  {days > 0 ? `${days}j` : "passée"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
