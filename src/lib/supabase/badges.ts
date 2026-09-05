"use client";

// ====== SUPABASE BADGES SERVICE (client) ======
// Rapport de test panel (05/09/26) : /badges, /profile et la home affichaient
// tous les mêmes badges "débloqués" pour TOUT LE MONDE (import MY_BADGES,
// une liste figée écrite pour la persona démo interne "traileur_demo" — 47
// sorties, streak de 8 semaines), y compris un compte flambant neuf à 0
// sortie. Un nouveau signup voyait donc un plein cabinet de trophées jamais
// gagnés — ça détruit la valeur du système, pourtant pensé pour "vraiment
// signifier quelque chose" (cf. commentaire d'en-tête de lib/data/badges.ts).
//
// Ce module calcule les badges RÉELLEMENT débloqués depuis les données
// Supabase de l'utilisateur connecté (table `runs` + `profiles.streak`), via
// le moteur pur lib/badges-engine.ts (partagé avec la variante serveur,
// badges-server.ts, utilisée sur la home qui est un Server Component).

import { getSupabaseBrowserClient } from "./client";
import { computeUnlockedBadges, type RunForBadges } from "@/lib/badges-engine";

export async function getRealUnlockedBadges(): Promise<Set<string>> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data: userData } = await sb.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return new Set();

    const [runsRes, profileRes] = await Promise.all([
      sb.from("runs").select("distance, elevation").eq("user_id", userId),
      sb.from("profiles").select("streak").eq("id", userId).maybeSingle(),
    ]);

    const runs = (runsRes.data ?? []) as RunForBadges[];
    const streak = (profileRes.data as { streak: number | null } | null)
      ?.streak;
    return computeUnlockedBadges(runs, streak);
  } catch {
    // Repli silencieux : verrouillé par défaut si la requête échoue
    // (mieux vaut un cabinet vide qu'un cabinet mensonger).
    return new Set();
  }
}
