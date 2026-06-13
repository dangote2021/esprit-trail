"use client";

// ====== WhatsAppShare ======
// Bouton qui ouvre wa.me avec un message pré-rempli.
// Web Share API utilisée en priorité (mobile natif), fallback wa.me.
// Génère et persiste un referralCode local pour tracker les invits.

import { useEffect, useState } from "react";

interface Props {
  challengeId: string;
  raceName: string;
  tagline: string;
  ticketsBoosted: number; // nombre de tickets bonus déjà gagnés
  className?: string;
}

const REFERRAL_KEY_PREFIX = "esprit_ref_";

function getOrCreateReferralCode(challengeId: string): string {
  if (typeof window === "undefined") return "";
  const k = `${REFERRAL_KEY_PREFIX}${challengeId}`;
  let code = window.localStorage.getItem(k);
  if (!code) {
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
    try {
      window.localStorage.setItem(k, code);
    } catch {
      // private mode → on s'en passe
    }
  }
  return code;
}

export default function WhatsAppShare({
  challengeId,
  raceName,
  tagline,
  ticketsBoosted,
  className = "",
}: Props) {
  const [refCode, setRefCode] = useState("");
  const [origin, setOrigin] = useState("https://esprit-trail.vercel.app");

  useEffect(() => {
    setRefCode(getOrCreateReferralCode(challengeId));
    setOrigin(window.location.origin);
  }, [challengeId]);

  if (!refCode) {
    return (
      <button
        disabled
        className={`opacity-40 cursor-not-allowed ${className}`}
        aria-busy="true"
      >
        Préparation du lien...
      </button>
    );
  }

  const shareUrl = `${origin}/challenges/loto?j=${challengeId}&ref=${refCode}`;
  const message =
    `🏃 J'ai rejoint le tirage Esprit Trail pour un dossard ${raceName} !\n\n` +
    `${tagline}\n\n` +
    `Tu participes avec moi via ce lien (et tu me files un ticket bonus 🎫) :\n${shareUrl}`;

  const handleShare = async () => {
    // Mobile natif (Web Share API) si dispo
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: `Tirage dossard ${raceName} — Esprit Trail`,
          text: message,
          url: shareUrl,
        });
        return;
      } catch {
        // user a annulé ou Web Share KO → fallback
      }
    }
    // Fallback wa.me direct
    const wa = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-5 py-4 font-display font-black uppercase tracking-wider text-white shadow-md hover:brightness-110 active:scale-[0.98] transition"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        </svg>
        Inviter un pote sur WhatsApp
      </button>
      <p className="text-center text-[11px] text-ink-muted">
        +1 ticket par pote qui rejoint via ton lien (max +5)
        {ticketsBoosted > 0 ? ` • Déjà ${ticketsBoosted} récupéré${ticketsBoosted > 1 ? "s" : ""}` : ""}
      </p>
    </div>
  );
}
