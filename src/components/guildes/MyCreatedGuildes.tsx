"use client";

// ====== MyCreatedGuildes ======
// Affiche les crews créés par l'utilisateur en tête de la liste des teams.
// Badge "Créé par toi" pour bien les différencier des seeds.

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadMyGuildes, MY_GUILDES_EVENT, type MyGuilde } from "@/lib/my-guildes";

export default function MyCreatedGuildes() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<MyGuilde[]>([]);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setItems(loadMyGuildes());
    refresh();
    window.addEventListener(MY_GUILDES_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(MY_GUILDES_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
        Tes crews
      </div>
      <div className="space-y-2">
        {items.map((g) => (
          <Link
            key={g.id}
            href={`/guildes/${g.id}`}
            className="block rounded-2xl border-2 border-lime/30 bg-gradient-to-r from-lime/8 to-bg-card p-4 transition hover:border-lime/50"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{g.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-black text-ink truncate">
                    {g.name}
                  </h3>
                  <span className="rounded-md bg-lime/20 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-lime">
                    Créé par toi
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {g.region} ·{" "}
                  {g.joinRule === "open" ? "Ouverte" : "Sur demande"}
                </div>
                {g.description && (
                  <p className="mt-1 text-xs text-ink-muted leading-snug line-clamp-2">
                    {g.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
