"use client";

// ====== PwaBackGuard ======
// Fix swipe-back qui sort de l'app sur iOS (PWA standalone).
//
// Retour Sam (30, panel test) : "Sur iPhone (PWA), quand je swipe back depuis
// /coach/plan ça me sort de l'app entièrement. C'est chaud à expliquer aux gens."
//
// Cause : sur iOS, dans une PWA installée (display: standalone), le geste
// edge-swipe gauche déclenche history.back. Si l'historique du PWA est vide
// (page d'entrée, refresh, deep link depuis notif), le navigateur sort vers
// l'app précédente — ce qui ferme la PWA.
//
// Fix : on push un sentinel state au mount. Quand l'utilisateur swipe-back,
// le popstate consomme le sentinel et on le re-push immédiatement → la page
// reste affichée et l'utilisateur ne sort jamais "par accident".
//
// Cette astuce ne casse PAS la navigation normale (les Link de Next.js
// pushent des states par-dessus, donc le back va sur la vraie page précédente).
// Le sentinel ne se déclenche que quand il n'y a "rien derrière".

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PwaBackGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Détection PWA standalone (iOS et Android)
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari : navigator.standalone
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (!isStandalone) return; // Navigateur classique : on laisse iOS faire

    // Sur certaines pages on n'active pas le guard (auth, onboarding)
    const skip =
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/onboarding");

    if (skip) return;

    // Marqueur pour distinguer notre sentinel des autres états
    const SENTINEL = { __espritTrailSentinel: true };

    function pushSentinel() {
      try {
        window.history.pushState(SENTINEL, "", window.location.href);
      } catch {
        /* ignore (cas safari privé qui refuse pushState) */
      }
    }

    // Push initial : on prépare le filet
    pushSentinel();

    function onPopState(e: PopStateEvent) {
      // Si le state qui vient d'être consommé n'est PAS notre sentinel, l'user
      // est légitimement en train de naviguer — on laisse passer.
      const consumed = e.state;
      if (consumed && consumed.__espritTrailSentinel) {
        // Notre sentinel a été consommé → on en repush un et on reste sur place
        pushSentinel();
      } else {
        // Navigation réelle → on remet un nouveau sentinel pour la suite
        setTimeout(pushSentinel, 50);
      }
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pathname]);

  return null;
}
