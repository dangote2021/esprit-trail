import Link from "next/link";
import BadgeCard from "@/components/ui/BadgeCard";
import StatTile from "@/components/ui/StatTile";
import SectionHeader from "@/components/ui/SectionHeader";
import ProfileHeroCard from "@/components/profile/ProfileHeroCard";
import StatRadarEditable from "@/components/profile/StatRadarEditable";
import TotemPicker from "@/components/profile/TotemPicker";
import { ME, MY_BADGES, MY_RUNS, MY_LOOT } from "@/lib/data/me";
import { getBadge } from "@/lib/data/badges";
import { RARITY_STYLES, TITLES, levelFromXp } from "@/lib/types";
import WishlistRaces from "@/components/profile/WishlistRaces";
import BestResults from "@/components/profile/BestResults";

function formatKm(n: number) {
  return n.toLocaleString("fr", { maximumFractionDigits: 1 });
}

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

const WATCH_META: Record<string, { label: string; color: string; logo: string }> = {
  strava: { label: "Strava", color: "bg-[#fc4c02]", logo: "S" },
};

export default function ProfilePage() {
  const badges = MY_BADGES
    .map((id) => getBadge(id))
    .filter((b): b is NonNullable<typeof b> => !!b);
  const topBadges = [...badges]
    .sort((a, b) => {
      const order = ["mythic", "legendary", "epic", "rare", "common"];
      return order.indexOf(a.rarity) - order.indexOf(b.rarity);
    })
    .slice(0, 6);

  // Stats de la semaine (rapatriées depuis la home)
  const weekStats = thisWeekStats(MY_RUNS);

  // Prochain palier de titre (rapatrié depuis la home)
  const userLevel = levelFromXp(ME.xp);
  const nextTitle = TITLES.find((t) => t.minLevel > userLevel);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Profil
          </div>
          <h1 className="font-display text-2xl font-black leading-none">
            Ton cockpit
          </h1>
        </div>
        <Link
          href="/profile/settings"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </header>

      {/* ===== Carte Panini moderne : cover + avatar circle + nom + stats ===== */}
      <ProfileHeroCard
        displayName={ME.displayName}
        username={ME.username}
        fallbackEmoji={ME.avatar}
        tagline={ME.profile?.biggestRace ? `Best : ${ME.profile.biggestRace}` : undefined}
        stats={[
          {
            label: "km/sem",
            value: Math.round(
              (MY_RUNS.slice(0, 7).reduce((s, r) => s + r.distance, 0) || 0),
            ),
            color: "lime",
          },
          {
            label: "D+ total",
            value: MY_RUNS.reduce((s, r) => s + r.elevation, 0).toLocaleString(
              "fr",
            ),
            color: "peach",
          },
          {
            label: "UTMB",
            value: ME.connections.utmb?.runnerIndex ?? "—",
            color: "cyan",
          },
        ]}
      />

      {/* ===== Totem animal — cosmétique facultatif ===== */}
      <TotemPicker />

      {/* ===== Best Results — 3 courses mythiques user-editable ===== */}
      <BestResults />

      {/* ===== Forces & faiblesses — radar hexagonal FIFA-style + auto-évaluation ===== */}
      <StatRadarEditable baseStats={ME.profile!.stats} />

      {/* Bloc PlayerHUD supprimé — la carte Hero suffit pour identifier le profil */}
      {/* Bloc Character customization retiré — on garde le profil propre, photo perso */}

      {/* UTMB + ITRA */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 to-bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet font-display text-sm font-black text-bg">
              U
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
              UTMB Index
            </div>
          </div>
          <div className="mt-2 font-display text-4xl font-black text-cyan">
            {ME.connections.utmb?.runnerIndex}
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-muted">
            Détail par catégorie →
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {(["XS", "S", "M", "L", "XL"] as const).map((cat) => {
              const v = ME.connections.utmb?.categoryIndex[cat] || 0;
              return (
                <div key={cat} className="text-center">
                  <div className="text-[9px] font-mono text-ink-dim">{cat}</div>
                  <div className="text-[11px] font-mono font-bold text-ink">
                    {v > 0 ? v : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/10 to-bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-peach font-display text-sm font-black text-bg">
              I
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet">
              Cailloux ITRA
            </div>
          </div>
          <div className="mt-2 font-display text-4xl font-black text-violet">
            {ME.connections.itra.performanceIndex}
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-muted">
            Performance Index / 1000
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-raised">
            <div
              className="h-full rounded-full bg-violet"
              style={{
                width: `${(ME.connections.itra.performanceIndex / 1000) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-dim">
            Top 15% mondial
          </div>
        </div>
      </section>

      {/* Accès Ranking — apparaît juste sous les onglets UTMB et ITRA */}
      <Link
        href="/leaderboard"
        className="flex items-center gap-3 rounded-2xl border-2 border-gold/30 bg-gradient-to-r from-gold/10 via-bg-card to-peach/5 p-4 hover:border-gold/60 transition"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15">
          <span className="text-2xl">🏆</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-gold">
            Ranking
          </div>
          <div className="font-display text-base font-black text-ink">
            Ta position dans le classement
          </div>
          <div className="text-[11px] text-ink-muted">
            ITRA · UTMB · saison en cours
          </div>
        </div>
        <span className="font-display text-xl text-gold shrink-0">→</span>
      </Link>

      {/* Sync Strava */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Sync" title="Plateforme connectée" />
        <div>
          {(["strava"] as const).map((w) => {
            const meta = WATCH_META[w];
            const connected = ME.connections.watches.includes(w);
            return (
              <div
                key={w}
                className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                  connected
                    ? "border-lime/30 bg-lime/5"
                    : "border-ink/10 bg-bg-card/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.color} font-display text-sm font-black text-white`}
                >
                  {meta.logo}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{meta.label}</div>
                  <div
                    className={`text-[11px] font-mono ${
                      connected ? "text-lime" : "text-ink-dim"
                    }`}
                  >
                    {connected
                      ? "✓ Sync active — sorties Garmin/Coros/Suunto remontent via Strava"
                      : "Non connecté — connecte-toi pour la sync auto"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rythme de la semaine — déplacé depuis la home */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Rythme" title="Cette semaine" />
        <div className="grid grid-cols-4 gap-2">
          <StatTile label="Km sem." value={formatKm(weekStats.distance)} unit="km" accent="lime" />
          <StatTile label="D+ sem." value={formatKm(weekStats.elevation)} unit="m" accent="peach" />
          <StatTile label="Sorties" value={weekStats.runs} accent="cyan" />
          <StatTile label="ITRA" value={ME.connections.itra.performanceIndex} accent="violet" />
        </div>
      </section>

      {/* Prochain titre — déplacé depuis la home */}
      {nextTitle && (
        <section className="space-y-2">
          <SectionHeader eyebrow="Prochain palier" title={`« ${nextTitle.title} »`} />
          <div className="rounded-xl border border-ink/10 bg-gradient-to-r from-bg-card/60 to-transparent p-4 flex items-center gap-3">
            <div className="text-3xl opacity-50">{nextTitle.emoji}</div>
            <div className="flex-1">
              <div className="text-[10px] font-mono text-ink-dim uppercase">
                LVL {nextTitle.minLevel} requis
              </div>
              <div className="text-xs font-bold text-ink-muted">
                Tu y es presque : encore <strong className="text-lime">{nextTitle.minLevel - userLevel} levels</strong>.
              </div>
            </div>
            <div className="text-[10px] font-mono text-lime">
              +{nextTitle.minLevel - userLevel} LVL
            </div>
          </div>
        </section>
      )}

      {/* Wishlist courses (auto-syncée depuis /race/[id]) */}
      <WishlistRaces />

      {/* Stats saison */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Stats" title="Saison en cours" />
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="Distance" value={ME.stats.totalDistance} unit="km" accent="lime" />
          <StatTile
            label="D+"
            value={(ME.stats.totalElevation / 1000).toFixed(1)}
            unit="K m"
            accent="peach"
          />
          <StatTile label="Sorties" value={ME.stats.totalRuns} accent="cyan" />
          <StatTile
            label="Plus long"
            value={ME.stats.longestRun}
            unit="km"
            accent="violet"
          />
          <StatTile
            label="Altitude max"
            value={ME.stats.highestElevation}
            unit="m"
            accent="gold"
          />
          <StatTile
            label="Plus gros D+"
            value={ME.stats.biggestDrop}
            unit="m"
            accent="peach"
          />
        </div>
      </section>

      {/* Top badges */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Trophées"
          title="Meilleurs trophées"
          href="/badges"
          linkLabel={`Voir tous (${badges.length})`}
        />
        <div className="grid grid-cols-3 gap-3">
          {topBadges.map((b) => (
            <BadgeCard key={b.id} badge={b} size="sm" />
          ))}
        </div>
      </section>

      {/* Inventaire loot */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Inventaire" title="Mon loot" />
        <div className="space-y-2">
          {MY_LOOT.map((loot) => {
            const style = RARITY_STYLES[loot.rarity];
            return (
              <div
                key={loot.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${style.color}`}
              >
                <div className="text-3xl">{loot.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-display text-sm font-black">
                      {loot.name}
                    </div>
                    <span className={`text-[9px] font-mono uppercase ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-muted">{loot.description}</div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                  {loot.type}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historique runs */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Historique"
          title="Toutes mes sorties"
          linkLabel={`${MY_RUNS.length} total`}
        />
        <div className="space-y-2">
          {MY_RUNS.map((run) => (
            <Link
              key={run.id}
              href={`/run/${run.id}`}
              className="flex items-center gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3 hover:border-lime/30 transition"
            >
              <div className="text-2xl">
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
                <div className="truncate text-sm font-bold">{run.title}</div>
                <div className="flex gap-2 text-[11px] font-mono text-ink-muted">
                  <span>
                    {new Date(run.date).toLocaleDateString("fr", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span>•</span>
                  <span>{run.distance} km</span>
                  <span>•</span>
                  <span>{run.elevation} D+</span>
                </div>
              </div>
              <div className="text-[11px] font-mono font-bold text-lime">
                +{run.xpEarned}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
