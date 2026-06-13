"use client";

// ====== ShareButton ======
// Trigger compact pour ouvrir la ShareSheet. À utiliser sur les pages
// detail (spot, course, plan nutri). Peut prendre une variante:
// - "icon" : juste un bouton rond compact (mobile-friendly)
// - "full" : bouton large avec libellé
// - "chip" : badge discret avec emoji et libellé court

import { useState } from "react";
import ShareSheet from "./ShareSheet";

export default function ShareButton({
  title,
  text,
  url,
  eyebrow = "Partager",
  variant = "icon",
  label,
  className = "",
}: {
  title: string;
  text: string;
  url: string;
  eyebrow?: string;
  variant?: "icon" | "full" | "chip";
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const trigger = (() => {
    if (variant === "full") {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-bg shadow-sm hover:scale-[1.02] active:scale-[0.98] transition ${className}`}
          aria-label={`Partager ${title}`}
        >
          <span>↗️</span>
          <span>{label || "Partager"}</span>
        </button>
      );
    }
    if (variant === "chip") {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-md border border-lime/40 bg-lime/10 px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider text-lime hover:bg-lime/20 transition ${className}`}
          aria-label={`Partager ${title}`}
        >
          <span>↗️</span>
          <span>{label || "Partager"}</span>
        </button>
      );
    }
    // icon variant (default)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 bg-bg-card/60 text-ink-muted hover:text-lime hover:border-lime/40 transition ${className}`}
        aria-label={`Partager ${title}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5"
          style={{ height: "1.1rem", width: "1.1rem" }}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    );
  })();

  return (
    <>
      {trigger}
      <ShareSheet
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        text={text}
        url={url}
        eyebrow={eyebrow}
      />
    </>
  );
}
