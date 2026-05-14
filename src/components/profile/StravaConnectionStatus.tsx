"use client";

// ====== StravaConnectionStatus ======
// Affiche le vrai statut de connexion Strava lu depuis Supabase
// `user_integrations`. Sans hardcoder ME.connections.watches.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type State = "loading" | "disconnected" | "connected";

export default function StravaConnectionStatus() {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setState("disconnected");
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase.from("user_integrations") as any)
          .select("provider")
          .eq("user_id", user.id)
          .eq("provider", "strava")
          .maybeSingle();
        setState(data ? "connected" : "disconnected");
      } catch {
        setState("disconnected");
      }
    })();
  }, []);

  if (state === "loading") {
    return (
      <div className="rounded-lg border border-ink/10 bg-bg-card/40 p-3 animate-pulse h-14" />
    );
  }

  const isConnected = state === "connected";

  return (
    <Link
      href="/settings/connections/strava"
      className={`flex items-center gap-3 rounded-lg border p-3 transition hover:scale-[1.01] ${
        isConnected
          ? "border-lime/40 bg-lime/5"
          : "border-[#fc4c02]/30 bg-[#fc4c02]/5 hover:border-[#fc4c02]"
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#fc4c02] font-display text-sm font-black text-white">
        S
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-sm font-black text-ink">Strava</div>
        <div className="text-[11px] text-ink-muted">
          {isConnected
            ? "✓ Connecté — sorties importées auto"
            : "Connecte ton compte pour importer tes sorties"}
        </div>
      </div>
      <div
        className={`text-[10px] font-mono font-bold uppercase ${
          isConnected ? "text-lime" : "text-[#fc4c02]"
        }`}
      >
        {isConnected ? "✓" : "Connecter →"}
      </div>
    </Link>
  );
}
