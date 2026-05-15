// ====== DailyQuestHero ======
// Card "Quête du jour" saillante en haut de la home.
// Retour panel Lola, 26 : "Sur la home, j'ai du mal à voir d'un coup d'œil
// C'EST QUOI MA QUÊTE DU JOUR. C'est un peu noyé."
//
// On prend la quête daily la plus prioritaire et on lui donne le hero
// treatment : gradient lime/cyan distinctif, gros titre, progress visuel,
// CTA "Lance la quête".

import Link from "next/link";
import { questsForPeriod } from "@/lib/data/quests";

export default function DailyQuestHero() {
  const daily = questsForPeriod("daily");
  if (daily.length === 0) return null;

  // On prend la première (priorité par défaut dans questsForPeriod)
  const q = daily[0];
  const progress = Math.min(
    100,
    Math.round((q.progress / Math.max(1, q.target)) * 100),
  );

  return (
    <Link
      href="/quests"
      className="relative block overflow-hidden rounded-3xl border-2 border-lime/45 p-5 card-chunky tap-bounce"
      style={{
        background:
          "linear-gradient(135deg, rgba(149,213,178,0.25) 0%, rgba(181,212,244,0.20) 55%, rgba(254,250,224,0.4) 100%)",
      }}
    >
      {/* Halo soleil top-right pour le ressenti "live" */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(149,213,178,0.55) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime text-bg card-chunky wobble shadow-glow-lime">
          <span className="text-3xl">{q.icon || "🎯"}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-lime/25 text-lime px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            Quête du jour
          </div>
          <div className="mt-1 font-display text-xl font-black leading-tight text-ink">
            {q.title}
          </div>
          <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
            {q.description}
          </p>
        </div>
      </div>

      {/* Progress + reward */}
      <div className="relative mt-3 space-y-1.5">
        <div className="flex items-end justify-between text-[10px] font-mono">
          <span className="font-bold uppercase tracking-wider text-ink-muted">
            Progression
          </span>
          <span className="font-bold text-lime">
            {q.progress} / {q.target}{" "}
            <span className="text-ink-dim">{q.unit || ""}</span>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-raised/60">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #95d5b2 0%, #2d6a4f 60%, #1b4332 100%)",
            }}
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-ink-dim">
            Récompense
          </span>
          <span className="text-[11px] font-mono font-bold text-peach">
            +{q.xpReward} XP{q.badgeReward ? " + badge" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
