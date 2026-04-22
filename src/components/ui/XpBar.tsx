import { xpToNextLevel } from "@/lib/types";

export default function XpBar({
  xp,
  compact = false,
}: {
  xp: number;
  compact?: boolean;
}) {
  const { currentLevel, nextLevel, currentLevelXp, nextLevelXp, progress } =
    xpToNextLevel(xp);
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return (
    <div className={compact ? "" : "space-y-1.5"}>
      {!compact && (
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-lime font-bold">LVL {currentLevel}</span>
          <span className="text-ink-muted">
            {xpIntoLevel.toLocaleString("fr")} / {xpNeeded.toLocaleString("fr")} XP
          </span>
          <span className="text-ink-dim">LVL {nextLevel}</span>
        </div>
      )}
      <div
        className={`relative overflow-hidden rounded-full border border-lime/20 bg-bg-card ${
          compact ? "h-1.5" : "h-2.5"
        }`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime/70 via-lime to-lime-glow progress-glow text-lime"
          style={{ width: `${progress * 100}%` }}
        />
        {/* Scanning light */}
        <div
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            left: `${Math.max(0, progress * 100 - 8)}%`,
            display: progress > 0.02 ? "block" : "none",
          }}
        />
      </div>
    </div>
  );
}
