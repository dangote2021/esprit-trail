import Link from "next/link";
import PlayerHUD from "@/components/ui/PlayerHUD";
import QuestCard from "@/components/ui/QuestCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatTile from "@/components/ui/StatTile";
import TQLogo from "@/components/ui/TQLogo";
import BadgeCard from "@/components/ui/BadgeCard";
import { ME, MY_BADGES, MY_RUNS } from "@/lib/data/me";
import { questsForPeriod } from "@/lib/data/quests";
import { BADGES, getBadge } from "@/lib/data/badges";
import { RACES } from "@/lib/data/races";
import { GUILDES } from "@/lib/data/guildes";
import { TITLES, levelFromXp } from "@/lib/types";

function formatKm(n: number) {
  return n.toLocaleString("fr", { maximumFractionDigits: 1 });
}
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr", { day: "numeric", month: "short" });
}

// Compute stats this week from runs
function thisWeekStats(runs: typeof MY_RUNS) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const weekRuns = runs.filter((r) => new Date(r.date) >= weekStart);
  return {
    distance: weekRuns.reduce((s, r) => s + r.distance, 0),
    elevation: weekRuns.reduce((s, r) => s + r.elevation, 0),
    runs: weekRuns.length,
  };
}

export default function HomePage() {
  const dailyQuests = questsForPeriod("daily");
  const weeklyQuests = questsForPeriod("weekly").slice(0, 2);
  const recentRuns = MY_RUNS.slice(0, 3);
  const weekStats = thisWeekStats(MY_RUNS);
  const nextRace = RACES.filter((r) => new Date(r.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // 3 derniers badges débloqués
  const lastBadges = MY_BADGES
    .slice(-3)
    .map((id) => getBadge(id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  // Prochain badge réalisable
  const lockedCommon = BADGES.filter(
    (b) => !MY_BADGES.includes(b.id) && (b.rarity === "common" || b.rarity === "rare"),
  ).slice(0, 2);

  // Prochain titre à débloquer (Sarah's feedback — preview next palier)
  const nextTitle = TITLES.find((t) => t.minLevel > ME.level);
  const isPerformance = ME.mode === "performance";

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <TQLogo showBaseline />
        <div className="flex items-center gap-2">
          {/* Mode pill — chunky */}
          <Link
            href="/profile/settings"
            className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider btn-chunky tap-bounce ${
              isPerformance
                ? "bg-cyan text-bg"
                : "bg-lime text-bg"
            }`}
          >
            {isPerformance ? "📊 Perf" : "🎮 Aventure"}
          </Link>
          <Link
            href="/notifications"
            className="relative rounded-full bg-bg-card p-2.5 text-ink hover:text-lime transition tap-bounce card-chunky wobble"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10 21a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-peach text-[10px] font-display font-black text-bg sticker">
              3
            </span>
          </Link>
        </div>
      </header>

      {/* Player HUD */}
      <PlayerHUD user={ME} />

      {/* Teaser prochain palier (Sarah's feedback) — only in adventure mode */}
      {!isPerformance && nextTitle && (
        <div className="-mt-2 rounded-xl border border-ink/10 bg-gradient-to-r from-bg-card/40 to-transparent p-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl opacity-40">{nextTitle.emoji}</div>
            <div className="flex-1">
              <div className="text-[10px] font-mono text-ink-dim uppercase">
                Prochain titre · LVL {nextTitle.minLevel}
              </div>
              <div className="text-xs font-bold text-ink-muted">
                « {nextTitle.title} »
              </div>
            </div>
            <div className="text-[10px] font-mono text-lime">
              +{nextTitle.minLevel - ME.level} levels
            </div>
          </div>
        </div>
      )}

      {/* Quick stats — personalized per mode (fix #4) */}
      {isPerformance ? (
        <div className="grid grid-cols-4 gap-2">
          <StatTile label="UTMB" value={ME.connections.utmb?.runnerIndex || "—"} accent="cyan" />
          <StatTile label="ITRA" value={ME.connections.itra.performanceIndex} accent="violet" />
          <StatTile label="CTL" value={72} accent="peach" />
          <StatTile label="TSB" value={-12} accent="gold" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          <StatTile label="Km sem." value={formatKm(weekStats.distance)} unit="km" accent="lime" />
          <StatTile label="D+ sem." value={formatKm(weekStats.elevation)} unit="m" accent="peach" />
          <StatTile label="Sorties" value={weekStats.runs} accent="cyan" />
          <StatTile
            label="Amis rang"
            value="#4"
            accent="violet"
          />
        </div>
      )}

      {/* Performance secondary row — avancée pour mode performance */}
      {isPerformance && (
        <div className="grid grid-cols-3 gap-2 -mt-2">
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3">
            <div className="text-[9px] font-mono text-ink-muted uppercase">Km sem.</div>
            <div className="mt-0.5 font-display text-lg font-black">{formatKm(weekStats.distance)}</div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3">
            <div className="text-[9px] font-mono text-ink-muted uppercase">D+ sem.</div>
            <div className="mt-0.5 font-display text-lg font-black">{formatKm(weekStats.elevation)}m</div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3">
            <div className="text-[9px] font-mono text-ink-muted uppercase">Charge 7j</div>
            <div className="mt-0.5 font-display text-lg font-black text-peach">Modérée</div>
          </div>
        </div>
      )}

      {/* CTA — enregistrer une sortie (chunky game style) */}
      <Link
        href="/run/new"
        className="group relative block overflow-hidden rounded-3xl bg-lime p-5 text-bg btn-chunky tap-bounce card-shine"
      >
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg text-lime card-chunky wobble">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-wider">
              {isPerformance ? "Nouvelle session" : "Prêt à repartir ?"}
            </div>
            <div className="font-display text-xl font-black leading-tight">
              {isPerformance ? "Enregistrer une sortie" : "Lance une quête"}
            </div>
            <div className="text-xs opacity-80">
              {isPerformance
                ? "Import auto Strava/Garmin ou saisie manuelle"
                : "Sors, bouge, ramène ton XP"}
            </div>
          </div>
          <div className="font-display text-2xl transition group-hover:translate-x-1">→</div>
        </div>
      </Link>

      {/* Coach IA (toujours dispo, mise en avant en perf) */}
      <Link
        href="/coach"
        className="block rounded-3xl bg-cyan p-5 text-bg btn-chunky tap-bounce"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg text-cyan card-chunky wobble">
            <span className="text-2xl">🧠</span>
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-wider">
              Coach IA · Plan sur mesure
            </div>
            <div className="font-display text-xl font-black leading-tight">
              {isPerformance ? "Génère ton plan" : "Demande conseil"}
            </div>
            <div className="text-xs opacity-80">
              Plan perso selon objectif, niveau, calendrier
            </div>
          </div>
          <div className="font-display text-2xl">→</div>
        </div>
      </Link>

      {/* OFF RACES — feature phare, mise en avant */}
      <Link
        href="/races/off"
        className="relative block overflow-hidden rounded-3xl border-2 border-peach bg-gradient-to-br from-peach/25 via-violet/15 to-bg p-5 btn-chunky tap-bounce card-shine"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 text-[120px] opacity-[0.12] leading-none">
          🏴‍☠️
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-peach text-bg card-chunky wobble">
            <span className="text-3xl">🏴‍☠️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-peach/20 text-peach px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-peach animate-pulse" />
              Nouveau · hors circuit
            </div>
            <div className="mt-1 font-display text-xl font-black leading-tight text-peach">
              OFF Races
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              FKT, courses pirates, GR projects. Pas de dossard, juste l'âme du trail.
            </div>
            <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-mono">
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">⚡ FKT</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🤫 Confidentielles</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">👥 Crew runs</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🎒 GR projects</span>
            </div>
          </div>
          <div className="font-display text-2xl text-peach">→</div>
        </div>
      </Link>

      {/* Daily quests */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow={isPerformance ? "Aujourd'hui" : "Daily"}
          title={isPerformance ? "Séance prévue" : "Tes quêtes du jour"}
          href="/quests"
          linkLabel={isPerformance ? "Plan complet" : "Toutes les quêtes"}
        />
        <div className="grid gap-3">
          {dailyQuests.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Weekly */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Weekly" title="Cette semaine" href="/quests" />
        <div className="grid gap-3">
          {weeklyQuests.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Dernières sorties */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Replay"
          title="Tes dernières sorties"
          href="/profile"
          linkLabel="Historique"
        />
        <div className="space-y-2">
          {recentRuns.map((run) => (
            <Link
              key={run.id}
              href={`/run/${run.id}`}
              className="flex items-center gap-3 rounded-2xl bg-bg-card p-3 card-chunky card-pressable tap-bounce transition hover:-translate-y-0.5"
            >
              <div className="text-3xl">
                {run.terrain === "alpine"
                  ? "🏔️"
                  : run.terrain === "mountain"
                  ? "⛰️"
                  : run.terrain === "hilly"
                  ? "🌲"
                  : run.terrain === "technical"
                  ? "🪨"
                  : "➖"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-black">{run.title}</div>
                <div className="flex gap-2 text-[11px] text-ink-muted">
                  <span>{formatDate(run.date)}</span>
                  <span className="text-ink-dim">·</span>
                  <span>{formatKm(run.distance)} km</span>
                  <span className="text-ink-dim">·</span>
                  <span>{run.elevation} D+</span>
                </div>
              </div>
              <div className="text-right">
                {!isPerformance && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[11px] font-display font-black text-bg">
                    +{run.xpEarned} XP
                  </div>
                )}
                {isPerformance && (
                  <div className="font-display text-sm font-black text-cyan">
                    {run.avgPace}
                  </div>
                )}
                {run.badgesUnlocked.length > 0 && !isPerformance && (
                  <div className="mt-0.5 text-[11px] font-display text-gold">
                    🏅 {run.badgesUnlocked.length}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Next race teaser */}
      {nextRace && (
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Prochaine course"
            title={nextRace.name}
            href="/races"
            linkLabel="Calendrier"
          />
          <Link
            href={`/race/${nextRace.id}`}
            className="relative block overflow-hidden rounded-2xl border border-peach/30 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-5 transition hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
                  {nextRace.location} · {nextRace.country}
                </div>
                <h3 className="font-display text-2xl font-black leading-tight">
                  {nextRace.name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {nextRace.tagline}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    {nextRace.distance} km
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    {nextRace.elevation} D+
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    {nextRace.itraPoints} pts ITRA
                  </span>
                  {nextRace.utmbIndexRequired && (
                    <span className="rounded-md bg-cyan/10 px-2 py-1 text-cyan">
                      UTMB ≥ {nextRace.utmbIndexRequired}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-black text-peach">
                  {formatDate(nextRace.date)}
                </div>
                <div className="text-[10px] font-mono text-ink-dim">
                  {new Date(nextRace.date).getFullYear()}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Ma guilde — teaser */}
      {(() => {
        const myGuilde = GUILDES.find((g) => g.iAmMember);
        if (!myGuilde) return null;
        return (
          <section className="space-y-3">
            <SectionHeader
              eyebrow="Guilde"
              title="Ta guilde cette semaine"
              href="/guildes"
              linkLabel="Voir tout"
            />
            <Link
              href={`/guildes/${myGuilde.id}`}
              className="block rounded-2xl border border-peach/30 bg-gradient-to-r from-peach/10 via-bg-card to-bg p-4 hover:scale-[1.01] transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{myGuilde.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-black truncate">
                    {myGuilde.name}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    👥 {myGuilde.memberCount} · {myGuilde.weekStats.totalKm} km
                    · #{myGuilde.weekStats.rank}
                  </div>
                </div>
                {myGuilde.currentChallenge && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-peach uppercase">
                      Défi
                    </div>
                    <div className="font-display text-sm font-black">
                      {Math.round(
                        (myGuilde.currentChallenge.progress /
                          myGuilde.currentChallenge.target) *
                          100
                      )}
                      %
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </section>
        );
      })()}

      {/* Derniers badges — only in adventure mode */}
      {!isPerformance && lastBadges.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Collection"
            title="Tes derniers trophées"
            href="/badges"
          />
          <div className="grid grid-cols-3 gap-3">
            {lastBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} size="sm" />
            ))}
          </div>
        </section>
      )}

      {/* Prochains objectifs — only adventure */}
      {!isPerformance && lockedCommon.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            eyebrow="À portée"
            title="Prochains badges débloquables"
          />
          <div className="grid grid-cols-2 gap-3">
            {lockedCommon.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-ink/10 bg-bg-card/60 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl opacity-50 grayscale">{b.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{b.name}</div>
                    <div className="truncate text-[11px] text-ink-muted">
                      {b.description}
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-lime">
                      +{b.xpReward} XP
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
