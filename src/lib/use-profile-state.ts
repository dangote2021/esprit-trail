"use client";

// ====== useProfileState ======
// Détecte si l'utilisateur courant a une activité RÉELLE sur Esprit Trail.
//
// Le but : ne jamais afficher de mock data (VO₂max fictif, index UTMB
// hardcodé, badges/loot d'exemple, stats de saison bidon) comme s'il
// s'agissait des vraies données du user.
//
// IMPORTANT — pourquoi on ne se base PAS sur le prénom/pseudo :
//   L'onboarding renseigne le prénom dès la création du compte. Donc
//   "a un prénom" ≠ "a une activité". Un profil fraîchement créé a un
//   prénom mais zéro sortie : il doit rester VIERGE.
//   On se base donc sur la présence d'au moins une sortie réelle
//   enregistrée (esprit_manual_runs : saisie manuelle ou tracker GPS).
//
// Logique :
//   - SSR / pré-hydratation : "loading" pour éviter le flash de mock data.
//   - Après hydratation : "configured" (= profil actif) si ≥ 1 sortie
//     réelle, sinon "blank".

import { useEffect, useState } from "react";
import { loadManualRuns } from "./manual-runs";

// "configured" conservé pour compat — sémantiquement = "profil actif".
export type ProfileState = "loading" | "blank" | "configured";

function readState(): ProfileState {
  try {
    return loadManualRuns().length > 0 ? "configured" : "blank";
  } catch {
    return "blank";
  }
}

export function useProfileState(): ProfileState {
  const [state, setState] = useState<ProfileState>("loading");

  useEffect(() => {
    setState(readState());

    function refresh() {
      setState(readState());
    }
    // Réagit aux changements de sorties (autre onglet ou même session)
    function handleStorage(e: StorageEvent) {
      if (e.key === "esprit_manual_runs" || e.key === null) refresh();
    }
    window.addEventListener("storage", handleStorage);
    window.addEventListener("esprit:runs", refresh);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("esprit:runs", refresh);
    };
  }, []);

  return state;
}

/**
 * true SEULEMENT après hydratation et si l'utilisateur n'a aucune
 * activité réelle (profil vierge fraîchement créé).
 */
export function useIsBlankProfile(): boolean {
  return useProfileState() === "blank";
}
