"use client";

// ====== Toast — notification éphémère ======
// API : appel via window.dispatchEvent(new CustomEvent('esprit-toast', { detail: { message, tone? } }))
// Affichage : bas de l'écran, auto-dismiss après 3s, mobile-friendly.
//
// À monter une seule fois dans le layout. Les autres composants poussent des
// toasts via l'event 'esprit-toast' sans dépendance directe.

import { useEffect, useState } from "react";

type Toast = {
  id: number;
  message: string;
  tone: "success" | "info" | "warn";
};

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail as
        | { message?: string; tone?: Toast["tone"] }
        | undefined;
      if (!detail?.message) return;
      const t: Toast = {
        id: Date.now() + Math.random(),
        message: detail.message,
        tone: detail.tone || "success",
      };
      setToasts((prev) => [...prev, t]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3000);
    }
    window.addEventListener("esprit-toast", onToast);
    return () => window.removeEventListener("esprit-toast", onToast);
  }, []);

  if (toasts.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto rounded-xl border-2 px-4 py-2.5 text-sm font-bold shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom duration-200 ${
            t.tone === "success"
              ? "border-lime/50 bg-lime/95 text-bg"
              : t.tone === "warn"
                ? "border-peach/50 bg-peach/95 text-bg"
                : "border-cyan/50 bg-cyan/95 text-bg"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// Helper pour pousser un toast depuis n'importe où côté client
export function showToast(message: string, tone: Toast["tone"] = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("esprit-toast", { detail: { message, tone } }),
  );
}
