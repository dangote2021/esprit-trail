"use client";

// ====== Client actions pour une intégration Strava connectée ======
// Bouton "Re-synchroniser maintenant" → POST /api/oauth/strava/sync
// Bouton "Déconnecter Strava"        → POST /api/oauth/strava/disconnect
// Composant client séparé pour pouvoir utiliser fetch + state.

import { useState } from "react";

type Status = "idle" | "syncing" | "synced" | "syncErr" | "disconnecting" | "disconnected" | "disconnectErr";

export default function StravaConnectedActions() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");

  async function handleResync() {
    setStatus("syncing");
    setFeedback("");
    try {
      const res = await fetch("/api/oauth/strava/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setStatus("synced");
      setFeedback(
        `${data.imported ?? 0} activité(s) importée(s)${
          data.skipped ? ` · ${data.skipped} ignorée(s)` : ""
        }`,
      );
      // Refresh server data après ~1s pour laisser l'utilisateur voir le résultat
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatus("syncErr");
      setFeedback(err instanceof Error ? err.message : "Sync échouée");
    }
  }

  async function handleDisconnect() {
    const ok = window.confirm(
      "Déconnecter Strava ? On supprime aussi toutes les sorties importées (RGPD). Tu pourras te reconnecter à tout moment.",
    );
    if (!ok) return;

    setStatus("disconnecting");
    setFeedback("");
    try {
      const res = await fetch("/api/oauth/strava/disconnect", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setStatus("disconnected");
      setFeedback("Strava déconnecté");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setStatus("disconnectErr");
      setFeedback(err instanceof Error ? err.message : "Déconnexion échouée");
    }
  }

  const busy = status === "syncing" || status === "disconnecting";

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleResync}
        disabled={busy}
        className="w-full rounded-xl bg-lime py-3 font-display text-base font-black uppercase tracking-wider text-bg shadow-glow-lime disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "syncing" ? "Synchronisation…" : "🔄 Re-synchroniser maintenant"}
      </button>
      <button
        type="button"
        onClick={handleDisconnect}
        disabled={busy}
        className="w-full rounded-xl border-2 border-mythic/40 bg-mythic/5 py-3 font-display text-sm font-black uppercase tracking-wider text-mythic transition hover:bg-mythic/10 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "disconnecting" ? "Déconnexion…" : "Déconnecter Strava"}
      </button>
      {feedback && (
        <div
          className={`rounded-lg px-3 py-2 text-center text-[12px] font-mono ${
            status === "syncErr" || status === "disconnectErr"
              ? "bg-mythic/10 text-mythic"
              : "bg-lime/10 text-lime"
          }`}
          role="status"
        >
          {feedback}
        </div>
      )}
      <p className="text-center text-[11px] text-ink-muted">
        En te déconnectant, on supprime toutes les données importées depuis Strava (RGPD).
      </p>
    </div>
  );
}
