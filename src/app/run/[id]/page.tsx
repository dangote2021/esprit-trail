import Link from "next/link";
import { notFound } from "next/navigation";
import BadgeCard from "@/components/ui/BadgeCard";
import { MY_RUNS } from "@/lib/data/me";
import { getBadge } from "@/lib/data/badges";
import { RARITY_STYLES } from "@/lib/types";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const terrainMeta: Record<string, { label: string; icon: string }> = {
  flat: { label: "Plat", icon: "➖" },
  hilly: { label: "Vallonné", icon: "🌲" },
  mountain: { label: "Montagne", icon: "⛰️" },
  alpine: { label: "Alpin", icon: "🏔️" },
  technical: { label: "Technique", icon: "🪨" },
};

export default function RunDetailPage({ params }: { params: { id: string } }) {
  const run = MY_RUNS.find((r) => r.id === params.id);
  if (!run) notFound();

  const unlockedBadges = run.badgesUnlocked.map((id) => getBadge(id)).filter(
    (b): b is NonNullable<typeof b> => !!b,
  );
  const tm = terrainMeta[run.terrain];

  return (
    <main className="mx-auto max-w-lg pb-6">
      {/* Hero carte "fictive" */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-lime/15 via-bg-card to-cyan/10">
        <div className="safe-top absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 z-10">
          <Link
            href="/"
            className="rounded-lg bg-black/50 backdrop-blur p-2 text-ink hover:text-lime transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <Link
            href={`/run/${run.id}/share`}
            className="rounded-lg bg-black/50 backdrop-blur p-2 text-ink hover:text-lime transition"
            aria-label="Partager"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </Link>
        </div>
        {/* Fake map SVG */}
        <svg
          viewBox="0 0 400 200"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="topo" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(194,255,46,0.08)" />
              <circle cx="20" cy="20" r="6" fill="none" stroke="rgba(194,255,46,0.08)" />
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#topo)" />
          <path
            d="M 20 160 Q 60 120, 100 140 T 180 100 T 260 80 T 340 120 T 380 60"
            fill="none"
            stroke="rgb(194,255,46)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgb(194,255,46))"
          />
          <circle cx="20" cy="160" r="6" fill="rgb(194,255,46)" />
          <circle cx="380" cy="60" r="6" fill="rgb(255,120,73)" />
        </svg>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            <span>
              {new Date(run.date).toLocaleDateString("fr", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
            <span>·</span>
            <span className="text-lime">{run.source}</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-black leading-tight">
            {run.title}
          </h1>
          <div className="mt-1 text-xs text-ink-muted">
            📍 {run.location} · {tm.icon} {tm.label}
          </div>
        </div>

        {/* Big stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-lime/20 bg-bg-card/60 p-4">
            <div className="text-[10px] font-mono text-ink-muted uppercase">Distance</div>
            <div className="mt-1 font-display text-3xl font-black text-lime">
              {run.distance}
              <span className="text-base text-ink-muted"> km</span>
            </div>
          </div>
          <div className="rounded-xl border border-peach/20 bg-bg-card/60 p-4">
            <div className="text-[10px] font-mono text-ink-muted uppercase">D+</div>
            <div className="mt-1 font-display text-3xl font-black text-peach">
              {run.elevation}
              <span className="text-base text-ink-muted"> m</span>
            </div>
          </div>
          <div className="rounded-xl border border-cyan/20 bg-bg-card/60 p-4">
            <div className="text-[10px] font-mono text-ink-muted uppercase">Durée</div>
            <div className="mt-1 font-display text-3xl font-black text-cyan">
              {formatDuration(run.duration)}
            </div>
          </div>
          <div className="rounded-xl border border-violet/20 bg-bg-card/60 p-4">
            <div className="text-[10px] font-mono text-ink-muted uppercase">Allure moy.</div>
            <div className="mt-1 font-display text-3xl font-black text-violet">
              {run.avgPace}
            </div>
          </div>
        </div>

        {/* Profil altitude */}
        <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Profil d'altitude</div>
            <div className="text-[11px] font-mono text-ink-muted">
              {run.elevation}m cumulés
            </div>
          </div>
          <svg
            viewBox="0 0 300 80"
            className="mt-3 w-full h-20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="elev-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(255,120,73)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="rgb(255,120,73)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 60 L 20 55 L 40 40 L 60 20 L 80 30 L 100 15 L 130 25 L 160 10 L 190 35 L 220 40 L 250 25 L 280 50 L 300 60 L 300 80 L 0 80 Z"
              fill="url(#elev-grad)"
            />
            <path
              d="M 0 60 L 20 55 L 40 40 L 60 20 L 80 30 L 100 15 L 130 25 L 160 10 L 190 35 L 220 40 L 250 25 L 280 50 L 300 60"
              fill="none"
              stroke="rgb(255,120,73)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* XP gagné - grosse récompense */}
        <div className="rounded-2xl border border-lime/30 bg-gradient-to-r from-lime/15 via-bg-card to-bg p-5 card-shine">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
                Récompense
              </div>
              <div className="mt-1 font-display text-5xl font-black text-lime">
                +{run.xpEarned.toLocaleString("fr")}
              </div>
              <div className="text-xs font-mono text-ink-muted">XP gagnés</div>
            </div>
            <div className="text-6xl animate-float">⚡</div>
          </div>
        </div>

        {/* Badges débloqués */}
        {unlockedBadges.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse-slow">🎉</span>
              <h2 className="font-display text-lg font-black">
                Badges débloqués !
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {unlockedBadges.map((b) => (
                <BadgeCard key={b.id} badge={b} size="sm" />
              ))}
            </div>
          </section>
        )}

        {/* Loot drops */}
        {run.lootDropped.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <h2 className="font-display text-lg font-black">
                Loot obtenu
              </h2>
            </div>
            <div className="space-y-2">
              {run.lootDropped.map((loot) => {
                const style = RARITY_STYLES[loot.rarity];
                return (
                  <div
                    key={loot.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${style.color} ${style.glow} animate-pop-in`}
                  >
                    <div className="text-3xl animate-float">{loot.icon}</div>
                    <div className="flex-1">
                      <div className={`text-[10px] font-mono uppercase ${style.text}`}>
                        {style.label} · {loot.type}
                      </div>
                      <div className="font-display text-base font-black">
                        {loot.name}
                      </div>
                      <div className="text-[11px] text-ink-muted">
                        {loot.description}
                      </div>
                    </div>
                    <div className={`text-lg ${style.text}`}>✨</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Partage */}
        <button className="w-full rounded-xl bg-lime py-3 text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime hover:scale-[1.01] transition">
          📤 Partager cette sortie
        </button>
      </div>
    </main>
  );
}
