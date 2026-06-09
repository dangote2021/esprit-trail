"use client";

// ====== LangToggle ======
// Bouton FR / EN compact à mettre dans le header. Au clic, écrit le cookie
// `esprit_lang` et reload la page pour resynchroniser server components +
// metadata. Hydratation propre : on attend `hydrated` avant d'afficher la
// langue active pour éviter le mismatch SSR/CSR.

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";

export default function LangToggle({
  className = "",
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { lang, setLang } = useLang();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const pad = size === "md" ? "px-2.5 py-1.5" : "px-2 py-1";
  const txt = size === "md" ? "text-xs" : "text-[10px]";

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-ink/15 bg-bg-card/60 ${className}`}
      role="group"
      aria-label="Changer la langue / Change language"
    >
      {(["fr", "en"] as const).map((l) => {
        const active = hydrated && lang === l;
        return (
          <button
            key={l}
            onClick={() => {
              if (l !== lang) setLang(l);
            }}
            className={`${pad} ${txt} font-mono font-black uppercase tracking-wider transition ${
              active
                ? "rounded-md bg-lime text-bg shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
            aria-pressed={active}
            aria-label={l === "fr" ? "Français" : "English"}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
