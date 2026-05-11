"use client";

// ====== RaceShareButton ======
// Bouton compact "Partager WhatsApp" pour les cards de course.
// Web Share API (mobile) en priorité, fallback wa.me. Stoppe la propagation
// pour ne pas déclencher la navigation du <Link> parent.

import { useEffect, useState } from "react";

interface Props {
  raceId: string;
  raceName: string;
  tagline?: string;
  variant?: "compact" | "full";
}

export default function RaceShareButton({
  raceId,
  raceName,
  tagline,
  variant = "compact",
}: Props) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${origin || "https://esprit-trail.vercel.app"}/race/${raceId}`;
    const message = tagline
      ? `🏃 ${raceName}\n\n${tagline}\n\nDétails course + plan nutrition jour J : ${url}`
      : `🏃 Tu connais ${raceName} ?\n\nDétails course + plan nutrition jour J : ${url}`;

    // Web Share API (mobile)
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: `${raceName} — Esprit Trail`,
          text: message,
          url,
        });
        return;
      } catch {
        // user cancel or unsupported → fallback
      }
    }
    // Fallback wa.me
    const wa = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-lime/40 bg-bg-card/80 px-4 py-3 font-mono text-sm font-black uppercase tracking-wider text-ink hover:border-lime/70 hover:bg-lime/8 active:scale-[0.98] transition"
        aria-label={`Partager ${raceName} à tes contacts`}
      >
        <ShareIcon />
        Partager à tes contacts
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 bg-bg-card/60 px-2 py-1 text-[10px] font-mono font-black text-ink-muted hover:text-ink hover:border-lime/40 active:scale-95 transition"
      aria-label={`Partager ${raceName} à tes contacts`}
    >
      <ShareIcon size={12} />
      Partager
    </button>
  );
}

function ShareIcon({ size = 16 }: { size?: number }) {
  // Icône "share" générique (3 nœuds reliés) — pas de référence à une appli.
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
