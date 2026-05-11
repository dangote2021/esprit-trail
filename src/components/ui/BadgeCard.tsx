import type { Badge } from "@/lib/types";
import { RARITY_STYLES } from "@/lib/types";

export default function BadgeCard({
  badge,
  locked = false,
  size = "md",
}: {
  badge: Badge;
  locked?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const styles = RARITY_STYLES[badge.rarity];
  const sizes = {
    sm: { card: "p-3", emoji: "text-2xl", label: "text-xs" },
    md: { card: "p-4", emoji: "text-4xl", label: "text-sm" },
    lg: { card: "p-6", emoji: "text-6xl", label: "text-base" },
  }[size];

  return (
    <div
      className={`relative rounded-2xl border ${styles.color} ${styles.glow} ${sizes.card} ${
        locked ? "opacity-50 grayscale" : ""
      } ${badge.rarity === "legendary" || badge.rarity === "mythic" ? "card-shine" : ""}`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className={`${sizes.emoji} ${locked ? "" : "animate-float"}`}>
          {locked ? "🔒" : badge.icon}
        </span>
        <div className="space-y-1">
          <div
            className={`font-display font-black leading-tight ${sizes.label} ${
              locked ? "text-ink-dim" : "text-ink"
            }`}
          >
            {locked ? "???" : badge.name}
          </div>
          <div
            className={`text-[10px] font-mono uppercase tracking-wider ${styles.text}`}
          >
            {styles.label}
          </div>
        </div>
      </div>
    </div>
  );
}
