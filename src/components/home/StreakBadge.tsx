"use client";

// ====== StreakBadge ======
// Petit badge "🔥 5 sem." affiché sur la home quand l'user a une streak
// de semaines consécutives avec sorties. Caché si streak < 2 (pas de
// "0 sem." démotivant pour un nouveau profil).
//
// Rétention : c'est le truc que les users viennent défendre — ne pas
// casser la série. C'est minimaliste exprès (un seul mot d'info).

import { useStreak } from "@/lib/use-streak";

export default function StreakBadge() {
  const { streak, ready } = useStreak();

  if (!ready) return null;
  if (streak < 2) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-peach/40 bg-peach/10 px-3 py-1 text-[11px] font-mono font-black uppercase tracking-wider text-peach shadow-sm"
      title="Nombre de semaines consécutives avec au moins une sortie"
    >
      <span className="text-base leading-none">🔥</span>
      <span>
        {streak} sem. {streak >= 4 ? "de feu" : "d'affilée"}
      </span>
    </div>
  );
}
