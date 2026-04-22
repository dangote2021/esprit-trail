import XpBar from "./XpBar";
import { CharacterAvatar } from "./CharacterAvatar";
import type { User } from "@/lib/types";
import { xpToNextLevel, titleForLevel } from "@/lib/types";

export default function PlayerHUD({ user }: { user: User }) {
  const { currentLevel, nextLevel, currentLevelXp, nextLevelXp, progress } =
    xpToNextLevel(user.xp);
  const t = titleForLevel(currentLevel);

  // Weekly rhythm (remplace streak quotidien)
  const weeklyTarget = user.weeklyTarget || 3;
  const weeklyProgress = Math.min(user.weeklyProgress || 0, weeklyTarget);
  const weeklyPct = (weeklyProgress / weeklyTarget) * 100;
  const targetReached = weeklyProgress >= weeklyTarget;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-lime/20 bg-gradient-to-br from-bg-card via-bg-raised to-bg p-5 shadow-inner-glow">
      {/* Scanline décoratif */}
      <div className="absolute inset-0 hud-scan opacity-30" aria-hidden />

      <div className="relative flex items-center gap-4">
        {/* Avatar SIMS + niveau badge */}
        <div className="relative shrink-0">
          <div className="flex h-24 w-20 items-center justify-center rounded-2xl border border-lime/30 bg-gradient-to-b from-bg-card to-bg-raised overflow-hidden shadow-glow-lime">
            {user.character ? (
              <CharacterAvatar
                character={user.character}
                size={78}
                showGround={false}
              />
            ) : (
              <span className="text-5xl">{user.avatar}</span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 flex min-w-[2.5rem] items-center justify-center rounded-lg bg-lime px-2 py-0.5 text-xs font-mono font-black text-bg shadow-glow-lime">
            LV {currentLevel}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
              {t.emoji} {t.title}
            </div>
            <div className="font-display text-xl font-black leading-tight">
              {user.displayName}
            </div>
            <div className="text-xs font-mono text-ink-dim">@{user.username}</div>
          </div>
          <XpBar xp={user.xp} />
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-ink-muted">
              {(user.xp - currentLevelXp).toLocaleString("fr")} / {(nextLevelXp - currentLevelXp).toLocaleString("fr")} XP
            </span>
          </div>
        </div>
      </div>

      {/* Rythme hebdomadaire — remplace streak quotidien */}
      <div className="relative mt-4 rounded-xl border border-peach/20 bg-bg-raised/60 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{targetReached ? "🔥" : "🎯"}</span>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
                Rythme de la semaine
              </div>
              <div className="text-xs font-bold">
                {weeklyProgress} / {weeklyTarget} sorties
                {targetReached && (
                  <span className="ml-2 rounded bg-peach/20 px-1.5 py-0.5 text-[9px] font-mono font-black text-peach">
                    ✓ OBJECTIF
                  </span>
                )}
              </div>
            </div>
          </div>
          {user.streak > 0 && (
            <div className="text-right">
              <div className="text-[9px] font-mono text-ink-dim uppercase">Série</div>
              <div className="font-display text-sm font-black text-peach">
                {user.streak} sem.
              </div>
            </div>
          )}
        </div>
        {/* Progress bar with dots for each expected run */}
        <div className="flex items-center gap-1">
          {Array.from({ length: weeklyTarget }).map((_, i) => {
            const done = i < weeklyProgress;
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition ${
                  done ? "bg-peach shadow-glow-peach" : "bg-bg-card"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
