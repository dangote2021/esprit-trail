"use client";

import Link from "next/link";
import { useState } from "react";
import BadgeCard from "@/components/ui/BadgeCard";
import { BADGES } from "@/lib/data/badges";
import { MY_BADGES } from "@/lib/data/me";
import type { BadgeRarity } from "@/lib/types";

const RARITY_ORDER: BadgeRarity[] = ["common", "rare", "epic", "legendary", "mythic"];

type FilterTab = "all" | "unlocked" | "locked" | BadgeRarity;

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  distance: { label: "Distance", icon: "📏" },
  elevation: { label: "Dénivelé", icon: "⛰️" },
  streak: { label: "Streak", icon: "🔥" },
  race: { label: "Courses", icon: "🎽" },
  social: { label: "Social", icon: "🤝" },
  discovery: { label: "Découverte", icon: "🗺️" },
  skill: { label: "Skill", icon: "⚡" },
};

export default function BadgesPage() {
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = BADGES.filter((b) => {
    const unlocked = MY_BADGES.includes(b.id);
    if (filter === "unlocked") return unlocked;
    if (filter === "locked") return !unlocked;
    if (filter === "all") return true;
    return b.rarity === filter;
  });

  const unlockedCount = MY_BADGES.length;
  const total = BADGES.length;
  const pct = Math.round((unlockedCount / total) * 100);

  // Stats par rareté
  const rarityStats = RARITY_ORDER.map((r) => ({
    rarity: r,
    total: BADGES.filter((b) => b.rarity === r).length,
    unlocked: BADGES.filter((b) => b.rarity === r && MY_BADGES.includes(b.id)).length,
  }));

  // Group par catégorie
  const grouped: Record<string, typeof BADGES> = {};
  filtered.forEach((b) => {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  });

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/profile"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            Collection
          </div>
          <h1 className="font-display text-lg font-black leading-none">
            Cabinet de trophées
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Progress */}
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 via-bg-card to-bg p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold">
              Collection complète
            </div>
            <div className="mt-1 font-display text-4xl font-black">
              {unlockedCount}{" "}
              <span className="text-lg text-ink-muted">/ {total}</span>
            </div>
            <div className="mt-1 text-xs text-ink-muted">{pct}% débloqués</div>
          </div>
          <div className="text-5xl animate-float">🏆</div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-card">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold-glow progress-glow text-gold transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Mini stats par rareté */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          {rarityStats.map((r) => (
            <div
              key={r.rarity}
              className={`rounded-lg border p-2 text-center ${
                r.rarity === "common"
                  ? "border-common/30 bg-common/5"
                  : r.rarity === "rare"
                  ? "border-rare/30 bg-rare/5"
                  : r.rarity === "epic"
                  ? "border-epic/30 bg-epic/5"
                  : r.rarity === "legendary"
                  ? "border-legendary/30 bg-legendary/5"
                  : "border-mythic/30 bg-mythic/5"
              }`}
            >
              <div
                className={`text-[10px] font-mono font-bold uppercase ${
                  r.rarity === "common"
                    ? "text-common"
                    : r.rarity === "rare"
                    ? "text-rare"
                    : r.rarity === "epic"
                    ? "text-epic"
                    : r.rarity === "legendary"
                    ? "text-legendary"
                    : "text-mythic"
                }`}
              >
                {r.rarity === "common"
                  ? "C"
                  : r.rarity === "rare"
                  ? "R"
                  : r.rarity === "epic"
                  ? "E"
                  : r.rarity === "legendary"
                  ? "L"
                  : "M"}
              </div>
              <div className="text-xs font-bold">
                {r.unlocked}/{r.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {(["all", "unlocked", "locked", ...RARITY_ORDER] as FilterTab[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition ${
              filter === f
                ? "border-lime bg-lime/15 text-lime"
                : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
            }`}
          >
            {f === "all"
              ? `Tous (${BADGES.length})`
              : f === "unlocked"
              ? `Débloqués (${unlockedCount})`
              : f === "locked"
              ? `Verrouillés (${total - unlockedCount})`
              : f === "common"
              ? "Commun"
              : f === "rare"
              ? "Rare"
              : f === "epic"
              ? "Épique"
              : f === "legendary"
              ? "Légendaire"
              : "Mythique"}
          </button>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, badges]) => (
          <section key={cat} className="space-y-3">
            <div className="flex items-baseline justify-between px-1">
              <h2 className="flex items-center gap-2 font-display text-lg font-black leading-none">
                <span>{CATEGORY_LABELS[cat]?.icon}</span>
                <span>{CATEGORY_LABELS[cat]?.label}</span>
              </h2>
              <div className="text-[11px] font-mono text-ink-muted">
                {badges.filter((b) => MY_BADGES.includes(b.id)).length}/
                {badges.length}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((b) => (
                <div key={b.id} className="space-y-1">
                  <BadgeCard
                    badge={b}
                    locked={!MY_BADGES.includes(b.id)}
                    size="sm"
                  />
                  <div className="px-1 text-center text-[10px] font-mono text-ink-dim">
                    {b.globalUnlockRate}% détiennent
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
