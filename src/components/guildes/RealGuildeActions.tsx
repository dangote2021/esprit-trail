"use client";

// ====== RealGuildeActions ======
// Hardening 04/09/26 : équivalent de GuildeActions.tsx (join/quitter) mais
// pour les vraies teams Supabase — écrit réellement dans `guilde_members`
// au lieu du localStorage. Les policies RLS existantes autorisent déjà
// l'insert self et le delete self.

import { useState } from "react";
import type { Guilde } from "@/lib/data/guildes";
import { joinRealGuilde, leaveRealGuilde } from "@/lib/supabase/guildes";

export function RealGuildeJoinButton({
  guilde,
  onJoined,
}: {
  guilde: Guilde;
  onJoined: () => void;
}) {
  const [state, setState] = useState<"idle" | "joining" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function join() {
    if (guilde.joinRule === "invite-only") {
      alert(
        "Cette team est sur invitation uniquement. Demande à un capitaine de t'inviter — un message direct fait l'affaire.",
      );
      return;
    }
    setState("joining");
    const res = await joinRealGuilde(guilde.id);
    if (!res.ok) {
      setState("error");
      setErrorMsg(
        res.error === "not-authenticated"
          ? "Connecte-toi pour rejoindre une team."
          : "Impossible de rejoindre cette team pour le moment.",
      );
      return;
    }
    onJoined();
  }

  if (state === "error") {
    return (
      <div className="text-right">
        <div className="rounded-xl border border-mythic/40 bg-mythic/10 px-3 py-2 text-[11px] font-mono font-bold uppercase text-mythic">
          Échec
        </div>
        <p className="mt-1 max-w-[160px] text-[10px] text-ink-muted">{errorMsg}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={join}
      disabled={state === "joining"}
      className="rounded-xl bg-peach px-5 py-2 text-[12px] font-mono font-black uppercase text-bg shadow-glow-peach transition hover:scale-[1.02] disabled:opacity-60"
    >
      {state === "joining"
        ? "…"
        : guilde.joinRule === "open"
          ? "Rejoindre"
          : guilde.joinRule === "request"
            ? "Demander"
            : "Sur invitation"}
    </button>
  );
}

export function RealGuildeLeaveButton({
  guilde,
  onLeft,
}: {
  guilde: Guilde;
  onLeft: () => void;
}) {
  const [armed, setArmed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function leave() {
    setLeaving(true);
    const res = await leaveRealGuilde(guilde.id);
    setLeaving(false);
    if (res.ok) onLeft();
  }

  return (
    <button
      type="button"
      onClick={() => (armed ? leave() : setArmed(true))}
      disabled={leaving}
      onBlur={() => setTimeout(() => setArmed(false), 3000)}
      className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase transition ${
        armed
          ? "border-mythic bg-mythic text-white"
          : "border-ink/15 bg-bg-card/60 text-ink-muted hover:text-mythic"
      }`}
    >
      {leaving ? "…" : armed ? "Confirmer" : "Quitter"}
    </button>
  );
}
