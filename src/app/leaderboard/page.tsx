"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LEADERBOARD_FRIENDS_WEEKLY_KM,
  LEADERBOARD_REGION_WEEKLY_DPLUS,
  LEADERBOARD_WORLD_SEASON_XP,
} from "@/lib/data/leaderboard";
import type { LeaderboardEntry } from "@/lib/types";

type Scope = "friends" | "region" | "world";

const SCOPES: {
  id: Scope;
  label: string;
  metric: string;
  unit: string;
  data: LeaderboardEntry[];
  color: string;
}[] = [
  {
    id: "friends",
    label: "Amis",
    metric: "Km cette semaine",
    unit: "km",
    data: LEADERBOARD_FRIENDS_WEEKLY_KM,
    color: "lime",
  },
  {
    id: "region",
    label: "Région",
    metric: "D+ cette semaine",
    unit: "m",
    data: LEADERBOARD_REGION_WEEKLY_DPLUS,
    color: "peach",
  },
  {
    id: "world",
    label: "Monde",
    metric: "XP saison",
    unit: "",
    data: LEADERBOARD_WORLD_SEASON_XP,
    color: "violet",
  },
];

export default function LeaderboardPage() {
  const [scope, setScope] = useState<Scope>("friends");
  const active = SCOPES.find((s) => s.id === scope)!;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-5">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet">
            Classement
          </div>
          <h1 className="font-display text-lg font-black leading-none">Ladder</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Scope tabs */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-ink/10 bg-bg-card/40 p-1">
        {SCOPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setScope(s.id)}
            className={`rounded-lg px-3 py-2 text-center transition ${
              scope === s.id
                ? s.color === "lime"
                  ? "bg-lime text-bg shadow-glow-lime"
                  : s.color === "peach"
                  ? "bg-peach text-bg shadow-glow-peach"
                  : "bg-violet text-bg shadow-glow-violet"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <div className="text-xs font-black uppercase tracking-wider">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Metric title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Métrique
          </div>
          <div className="font-display text-base font-black">{active.metric}</div>
        </div>
        <div className="text-[11px] font-mono text-ink-dim">
          MàJ il y a 12 min
        </div>
      </div>

      {/* Podium top 3 */}
      {active.data.length >= 3 && <Podium entries={active.data.slice(0, 3)} unit={active.unit} />}

      {/* Full list */}
      <ol className="space-y-2">
        {active.data.map((entry) => (
          <li
            key={entry.user.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition ${
              entry.isYou
                ? "border-lime bg-lime/10 shadow-glow-lime"
                : "border-ink/10 bg-bg-card/60"
            }`}
          >
            <div
              className={`w-9 text-center font-display text-lg font-black leading-none ${
                entry.rank === 1
                  ? "text-gold"
                  : entry.rank === 2
                  ? "text-common"
                  : entry.rank === 3
                  ? "text-peach"
                  : "text-ink-muted"
              }`}
            >
              {entry.rank <= 999 ? `#${entry.rank}` : "#999+"}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-raised text-xl">
              {entry.user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate font-bold">
                  {entry.isYou ? "Toi" : entry.user.username}
                </div>
                <span className="shrink-0 rounded bg-bg-raised px-1.5 py-0.5 text-[9px] font-mono font-black text-lime">
                  LV{entry.user.level}
                </span>
              </div>
              <div className="truncate text-[11px] text-ink-muted">
                {entry.user.title}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-base font-black">
                {entry.value.toLocaleString("fr", {
                  maximumFractionDigits: 1,
                })}
                {active.unit && (
                  <span className="ml-1 text-[10px] font-mono text-ink-muted">
                    {active.unit}
                  </span>
                )}
              </div>
              <div
                className={`text-[10px] font-mono font-bold ${
                  entry.change > 0
                    ? "text-lime"
                    : entry.change < 0
                    ? "text-mythic"
                    : "text-ink-dim"
                }`}
              >
                {entry.change > 0 ? `↑ +${entry.change}` : entry.change < 0 ? `↓ ${entry.change}` : "—"}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

function Podium({ entries, unit }: { entries: LeaderboardEntry[]; unit: string }) {
  const [second, first, third] = [entries[1], entries[0], entries[2]];
  return (
    <div className="grid grid-cols-3 items-end gap-2 pt-2">
      <PodiumStep entry={second} rank={2} unit={unit} height="h-20" color="common" emoji="🥈" />
      <PodiumStep entry={first} rank={1} unit={unit} height="h-28" color="gold" emoji="👑" />
      <PodiumStep entry={third} rank={3} unit={unit} height="h-16" color="peach" emoji="🥉" />
    </div>
  );
}

function PodiumStep({
  entry,
  rank,
  unit,
  height,
  color,
  emoji,
}: {
  entry: LeaderboardEntry;
  rank: number;
  unit: string;
  height: string;
  color: "gold" | "common" | "peach";
  emoji: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-2xl">{emoji}</div>
      <div className="text-3xl">{entry.user.avatar}</div>
      <div className="text-center">
        <div className="truncate text-xs font-bold">{entry.user.username}</div>
        <div className="text-[10px] font-mono text-ink-muted">
          LV{entry.user.level}
        </div>
      </div>
      <div
        className={`${height} w-full rounded-t-xl flex items-center justify-center border-t border-x ${
          color === "gold"
            ? "bg-gold/15 border-gold/50"
            : color === "common"
            ? "bg-common/10 border-common/40"
            : "bg-peach/10 border-peach/40"
        }`}
      >
        <div className="text-center">
          <div className={`font-display text-xl font-black ${
            color === "gold" ? "text-gold" : color === "common" ? "text-common" : "text-peach"
          }`}>
            {entry.value.toLocaleString("fr", { maximumFractionDigits: 0 })}
          </div>
          {unit && (
            <div className="text-[10px] font-mono text-ink-muted">{unit}</div>
          )}
        </div>
      </div>
    </div>
  );
}
