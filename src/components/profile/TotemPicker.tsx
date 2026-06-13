"use client";

// ====== TotemPicker ======
// Le traileur choisit son animal totem (cosmétique). Stocké en localStorage
// `esprit_totem`. Affiché en haut du profil + à côté du pseudo dans les
// listes. Facultatif — l'utilisateur peut ne pas en choisir.

import { useEffect, useState } from "react";

export type TotemKey =
  | "wolf"
  | "bison"
  | "eagle"
  | "turtle"
  | "deer"
  | "fox"
  | "bear"
  | "boar"
  | "ibex"
  | "marmot";

export const TOTEMS: Record<
  TotemKey,
  { emoji: string; label: string; vibe: string }
> = {
  wolf: {
    emoji: "🐺",
    label: "Loup",
    vibe: "Ultra-traileur solitaire, longues distances",
  },
  bison: {
    emoji: "🦬",
    label: "Bison",
    vibe: "Robuste, montagnard, ne lâche jamais",
  },
  eagle: {
    emoji: "🦅",
    label: "Aigle",
    vibe: "Vue longue, terrain alpin",
  },
  turtle: {
    emoji: "🐢",
    label: "Tortue",
    vibe: "Régulier, anti-pétage du 15ème",
  },
  deer: {
    emoji: "🦌",
    label: "Cerf",
    vibe: "Foulée légère, élégance",
  },
  fox: {
    emoji: "🦊",
    label: "Renard",
    vibe: "Malin, trouve les raccourcis",
  },
  bear: {
    emoji: "🐻",
    label: "Ours",
    vibe: "Force, sortie longue, hibernation post-course",
  },
  boar: {
    emoji: "🐗",
    label: "Sanglier",
    vibe: "Terrain technique, gros mollets",
  },
  ibex: {
    emoji: "🐐",
    label: "Bouquetin",
    vibe: "Crête, vertical, pas peur du vide",
  },
  marmot: {
    emoji: "🦫",
    label: "Marmotte",
    vibe: "Crew, sieste post-effort, vie en bande",
  },
};

const KEY = "esprit_totem";

export function loadTotem(): TotemKey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw && raw in TOTEMS) return raw as TotemKey;
  } catch {
    /* ignore */
  }
  return null;
}

function saveTotem(t: TotemKey | null) {
  try {
    if (t === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
}

export default function TotemPicker() {
  const [hydrated, setHydrated] = useState(false);
  const [totem, setTotem] = useState<TotemKey | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setTotem(loadTotem());
  }, []);

  function pick(t: TotemKey) {
    setTotem(t);
    saveTotem(t);
    setOpen(false);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([10, 30, 10]);
      } catch {
        /* ignore */
      }
    }
  }

  function clear() {
    setTotem(null);
    saveTotem(null);
    setOpen(false);
  }

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4 h-20" />
    );
  }

  const current = totem ? TOTEMS[totem] : null;

  return (
    <section className="rounded-2xl border-2 border-violet/30 bg-gradient-to-br from-violet/5 via-bg-card to-bg p-4 card-chunky">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet/15 text-3xl hover:bg-violet/25 transition tap-bounce wobble"
          aria-label="Choisir un totem"
        >
          {current ? current.emoji : "✨"}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
            Ton totem animal
          </div>
          {current ? (
            <>
              <div className="font-display text-base font-black truncate">
                {current.label}
              </div>
              <div className="text-[11px] text-ink-muted truncate">
                {current.vibe}
              </div>
            </>
          ) : (
            <>
              <div className="font-display text-sm font-black text-ink-muted">
                Pas encore choisi
              </div>
              <div className="text-[11px] text-ink-dim">
                Choisis ton animal totem (cosmétique)
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-lg border border-violet/40 bg-violet/5 px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider text-violet hover:bg-violet/15 transition"
        >
          {current ? "Changer" : "Choisir"}
        </button>
      </div>

      {/* Picker modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-bg-card border-2 border-violet/30 shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
                  Choisis ton totem
                </div>
                <h3 className="font-display text-lg font-black">
                  Quel animal te ressemble ?
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-ink/15 bg-bg-raised/60 px-2.5 py-1 text-ink-muted hover:text-ink"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {(Object.entries(TOTEMS) as [TotemKey, typeof TOTEMS[TotemKey]][]).map(
                ([key, t]) => {
                  const active = totem === key;
                  return (
                    <button
                      key={key}
                      onClick={() => pick(key)}
                      className={`rounded-xl border-2 p-3 text-left transition tap-bounce ${
                        active
                          ? "border-violet bg-violet/15 shadow-glow-violet"
                          : "border-ink/15 bg-bg-card/40 hover:border-violet/40"
                      }`}
                    >
                      <div className="text-3xl">{t.emoji}</div>
                      <div className="mt-1 font-display text-sm font-black leading-tight">
                        {t.label}
                      </div>
                      <div className="text-[10px] text-ink-muted line-clamp-2 leading-snug">
                        {t.vibe}
                      </div>
                    </button>
                  );
                },
              )}
            </div>

            {totem && (
              <button
                onClick={clear}
                className="block w-full rounded-xl border border-ink/15 bg-bg-card/60 py-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
              >
                Aucun totem
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
