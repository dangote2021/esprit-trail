"use client";

// ====== ConfiguredProfileOnly ======
// Wrapper qui masque ses enfants pour les utilisateurs au profil vierge
// (pas encore de displayName/username en localStorage). Sert à éviter
// d'afficher du mock data (ME.stats, MY_RUNS, MY_BADGES, etc.) comme s'il
// s'agissait des données réelles du user.

import { useProfileState } from "@/lib/use-profile-state";

export default function ConfiguredProfileOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const state = useProfileState();
  // Pendant l'hydratation, on rend null pour éviter le flash de mock data
  if (state !== "configured") return <>{fallback}</>;
  return <>{children}</>;
}
