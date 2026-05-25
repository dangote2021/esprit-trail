// ====== connections-server ======
// Lit le VRAI statut de connexion d'une plateforme (Strava…) depuis
// Supabase `user_integrations`. À utiliser dans les Server Components.
// Aucun mock : un user qui n'a jamais connecté Strava renvoie connected=false
// — c'est ce qui fait apparaître le bouton "+ Connecter".

import { getSupabaseServerClient } from "./supabase/server";

export type RealConnection = {
  connected: boolean;
  athleteName?: string;
  connectedAt?: string;
  lastSync?: string;
};

export async function getRealConnection(
  provider: string,
): Promise<RealConnection> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { connected: false };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("user_integrations") as any)
      .select("connected_at, last_sync_at, raw")
      .eq("user_id", user.id)
      .eq("provider", provider)
      .maybeSingle();

    if (!data) return { connected: false };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const athlete = (data.raw as any)?.athlete;
    const athleteName = athlete
      ? [athlete.firstname, athlete.lastname]
          .filter(Boolean)
          .join(" ")
          .trim() || undefined
      : undefined;

    return {
      connected: true,
      athleteName,
      connectedAt: data.connected_at ?? undefined,
      lastSync: data.last_sync_at ?? undefined,
    };
  } catch {
    // Supabase non configuré ou erreur réseau → on considère non connecté
    return { connected: false };
  }
}
