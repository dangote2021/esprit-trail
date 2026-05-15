"use client";

// ====== useIsBlankProfile ======
// Détecte si l'utilisateur courant est "neuf" (pas encore configuré son
// profil). Sert à masquer tous les blocs qui afficheraient du mock data
// (ME.stats, MY_RUNS, ME.connections, etc.) comme s'il s'agissait des
// données réelles du user.
//
// Logique :
//   - SSR / pré-hydratation : on retourne "loading" pour éviter le flash
//     du mock data côté serveur.
//   - Après hydratation : on lit localStorage `esprit_identity`. Si pas
//     de displayName ni username → profil vierge.

import { useEffect, useState } from "react";
import { getStoredIdentity } from "./identity";

export type ProfileState = "loading" | "blank" | "configured";

export function useProfileState(): ProfileState {
  const [state, setState] = useState<ProfileState>("loading");

  useEffect(() => {
    const id = getStoredIdentity();
    setState(id.displayName || id.username ? "configured" : "blank");

    // Si l'identité est modifiée ailleurs (ex: settings page), on réagit
    function handleStorage(e: StorageEvent) {
      if (e.key === "esprit_identity") {
        const next = getStoredIdentity();
        setState(next.displayName || next.username ? "configured" : "blank");
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return state;
}

/**
 * Convenience hook : retourne true SEULEMENT après hydratation et si
 * l'utilisateur n'a pas configuré son profil.
 */
export function useIsBlankProfile(): boolean {
  return useProfileState() === "blank";
}
