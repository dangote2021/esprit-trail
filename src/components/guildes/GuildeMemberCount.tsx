"use client";

// ====== GuildeMemberCount ======
// Compteur de membres avec animation au rejoint. Écoute un custom event
// "esprit:guilde:joined" dispatché par GuildeJoinButton et fait pulser
// l'affichage + incrémente visuellement.

import { useEffect, useState } from "react";
import { getStoredMembership } from "@/lib/guilde-membership";

export default function GuildeMemberCount({
  guildeId,
  baseCount,
  maxMembers,
}: {
  guildeId: string;
  baseCount: number;
  maxMembers: number;
}) {
  const [count, setCount] = useState(baseCount);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    // Si l'user est déjà membre au mount, on affiche +1 d'office
    const m = getStoredMembership();
    if (m[guildeId] === "member") setCount(baseCount + 1);

    function onJoined(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.guildeId === guildeId && detail?.action === "member") {
        setCount((c) => c + 1);
        setBump(true);
        setTimeout(() => setBump(false), 900);
      }
    }
    window.addEventListener("esprit:guilde:joined", onJoined);
    return () => window.removeEventListener("esprit:guilde:joined", onJoined);
  }, [guildeId, baseCount]);

  return (
    <div className="font-display text-xl font-black relative">
      <span
        className={`inline-block transition-transform ${
          bump ? "scale-125 text-lime" : ""
        }`}
        style={{ transitionDuration: bump ? "300ms" : "500ms" }}
      >
        {count}
      </span>
      <span className="text-ink-dim text-sm"> / {maxMembers}</span>
      {bump && (
        <span
          className="absolute -top-3 left-8 text-xs font-mono font-black text-lime animate-fade-up"
          style={{
            animation: "fadeUp 900ms ease-out forwards",
          }}
        >
          +1
        </span>
      )}
      <style jsx>{`
        @keyframes fadeUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
