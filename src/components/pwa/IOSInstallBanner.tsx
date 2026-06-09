"use client";

// ====== iOS INSTALL BANNER ======
// iOS Safari ne propose PAS de "Add to Home Screen" automatique comme Android.
// Ce composant :
// - Détecte iOS Safari (pas Chrome iOS, pas WebView, pas déjà installé en standalone)
// - Affiche une bannière sobre en bas de page expliquant la procédure
// - Mémorise le dismiss (localStorage 14j) pour ne pas spammer
//
// Ne s'affiche pas si :
// - Déjà en mode standalone (= déjà installé en PWA)
// - Pas iOS Safari
// - L'utilisateur a déjà dismissed récemment
// - Page = onboarding/auth/legal (concentration)

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DISMISS_KEY = "esprit_ios_install_dismissed_at";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 jours

function isIosSafari(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
  // Safari n'a pas CriOS (Chrome iOS), FxiOS (Firefox iOS), EdgiOS (Edge iOS)
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|GSA/.test(ua);
  return isIos && isSafari;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS exposait navigator.standalone (déprécié mais encore supporté)
  // Le check matchMedia('(display-mode: standalone)') marche partout maintenant
  const nav = navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return true;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  return false;
}

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export default function IOSInstallBanner() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Ne pas perturber les pages auth / onboarding / légales
    if (
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/legal")
    ) {
      setShow(false);
      return;
    }

    if (!isIosSafari()) return;
    if (isStandalone()) return;
    if (wasRecentlyDismissed()) return;

    // Petit délai pour ne pas s'afficher pendant le LCP
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [pathname]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Installer Esprit Trail"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border-2 border-ink/15 bg-bg-card/95 p-4 shadow-[0_8px_24px_rgba(27,67,50,0.18)] backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/15 text-2xl">
          ⚡
        </div>
        <div className="flex-1 text-left">
          <p className="font-display text-sm font-black text-ink">
            Ajoute Esprit Trail à ton écran d&apos;accueil
          </p>
          <p className="mt-1 text-[12px] leading-snug text-ink-muted">
            Tape{" "}
            <span aria-hidden className="inline-block translate-y-[1px]">
              <ShareIcon />
            </span>{" "}
            <strong>Partager</strong> en bas de Safari, puis{" "}
            <strong>« Sur l&apos;écran d&apos;accueil »</strong>. Plein écran,
            sans barre, comme une vraie app.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="shrink-0 rounded-lg p-1 text-ink-muted hover:bg-bg-raised hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ verticalAlign: "middle" }}
    >
      <path d="M12 16V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M4 14v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
    </svg>
  );
}
