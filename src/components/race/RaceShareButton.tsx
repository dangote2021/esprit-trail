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
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-mono text-sm font-black uppercase tracking-wider text-white shadow-md hover:brightness-110 active:scale-[0.98] transition"
        aria-label={`Partager ${raceName} sur WhatsApp`}
      >
        <WAIcon />
        Partager WhatsApp
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366]/15 px-2 py-1 text-[10px] font-mono font-black text-[#25D366] hover:bg-[#25D366]/25 active:scale-95 transition"
      aria-label={`Partager ${raceName} sur WhatsApp`}
    >
      <WAIcon size={12} />
      Partager
    </button>
  );
}

function WAIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      className="fill-current"
      aria-hidden
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}
