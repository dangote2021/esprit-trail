// ====== SUPABASE BADGES SERVICE (server) ======
// Variante Server Component de lib/supabase/badges.ts — pour la home
// (src/app/page.tsx), qui a déjà l'utilisateur authentifié via
// getSupabaseUser() côté serveur. Même moteur de calcul (lib/badges-engine).

import { getSupabaseServerClient } from "./server";
import { computeUnlockedBadges, type RunForBadges } from "@/lib/badges-engine";

export async function getRealUnlockedBadgesServer(
  userId: string
): Promise<Set<string>> {
  try {
    const sb = await getSupabaseServerClient();
    const [runsRes, profileRes] = await Promise.all([
      sb.from("runs").select("distance, elevation").eq("user_id", userId),
      sb.from("profiles").select("streak").eq("id", userId).maybeSingle(),
    ]);

    const runs = (runsRes.data ?? []) as RunForBadges[];
    const streak = (profileRes.data as { streak: number | null } | null)
      ?.streak;
    return computeUnlockedBadges(runs, streak);
  } catch {
    return new Set();
  }
}
