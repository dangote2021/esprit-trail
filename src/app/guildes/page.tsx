import Link from "next/link";
import { GUILDES } from "@/lib/data/guildes";

const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  local: { label: "Local", emoji: "📍", color: "text-lime" },
  club: { label: "Club", emoji: "🏁", color: "text-cyan" },
  "bande-copains": { label: "Bande de copains", emoji: "🍻", color: "text-peach" },
  elite: { label: "Élite", emoji: "👑", color: "text-gold" },
  theme: { label: "Thématique", emoji: "🎯", color: "text-violet" },
};

const JOIN_RULE_META: Record<string, { label: string; color: string }> = {
  open: { label: "Ouverte", color: "text-lime" },
  request: { label: "Sur demande", color: "text-cyan" },
  "invite-only": { label: "Sur invitation", color: "text-peach" },
};

export default function GuildesPage() {
  const myGuilde = GUILDES.find((g) => g.iAmMember);
  const discoverable = GUILDES.filter((g) => !g.iAmMember);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Guildes
          </div>
          <h1 className="font-display text-2xl font-black leading-none">
            Ton crew trail
          </h1>
        </div>
        <Link
          href="/guildes/create"
          className="rounded-lg border border-peach/40 bg-peach/10 px-3 py-1.5 text-[11px] font-mono font-bold uppercase text-peach hover:scale-[1.02] transition"
        >
          + Créer
        </Link>
      </header>

      {/* Hero */}
      <section className="rounded-3xl border border-peach/30 bg-gradient-to-br from-peach/10 via-bg-card to-bg p-5">
        <div className="flex items-start gap-3">
          <div className="text-4xl animate-float">⚔️</div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-black leading-tight">
              Courir ensemble, progresser ensemble
            </h2>
            <p className="mt-2 text-xs text-ink-muted">
              Une guilde, c'est 5 à 20 coureurs qui partagent un objectif. Stats
              collectives, défis de groupe, ambiance club.
            </p>
          </div>
        </div>
      </section>

      {/* Ma guilde */}
      {myGuilde && (
        <section className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Ta guilde
          </div>
          <Link
            href={`/guildes/${myGuilde.id}`}
            className="block rounded-2xl border border-lime/40 bg-gradient-to-br from-lime/10 via-bg-card to-bg p-5 hover:scale-[1.01] transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-4xl">{myGuilde.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-display text-lg font-black truncate">
                    {myGuilde.name}
                  </div>
                  {myGuilde.iAmCaptain && (
                    <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[9px] font-mono font-black text-gold">
                      ⭐ CAP'
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink-muted italic">
                  {myGuilde.tagline}
                </div>
                <div className="mt-2 flex gap-3 text-[10px] font-mono">
                  <span className="text-lime">
                    👥 {myGuilde.memberCount}/{myGuilde.maxMembers}
                  </span>
                  <span className="text-cyan">
                    📍 {myGuilde.location}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] font-mono text-ink-dim uppercase">
                  Rang
                </div>
                <div className="font-display text-2xl font-black text-peach">
                  #{myGuilde.weekStats.rank}
                </div>
                <div
                  className={`text-[10px] font-mono ${
                    myGuilde.weekStats.rankChange >= 0 ? "text-lime" : "text-peach"
                  }`}
                >
                  {myGuilde.weekStats.rankChange >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(myGuilde.weekStats.rankChange)}
                </div>
              </div>
            </div>

            {/* Mini stats semaine */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-ink/10 bg-bg-raised/50 p-2 text-center">
                <div className="font-display text-lg font-black text-lime">
                  {myGuilde.weekStats.totalKm}
                </div>
                <div className="text-[9px] font-mono text-ink-muted uppercase">
                  km sem.
                </div>
              </div>
              <div className="rounded-lg border border-ink/10 bg-bg-raised/50 p-2 text-center">
                <div className="font-display text-lg font-black text-peach">
                  {(myGuilde.weekStats.totalElevation / 1000).toFixed(1)}K
                </div>
                <div className="text-[9px] font-mono text-ink-muted uppercase">
                  m D+
                </div>
              </div>
              <div className="rounded-lg border border-ink/10 bg-bg-raised/50 p-2 text-center">
                <div className="font-display text-lg font-black text-cyan">
                  {myGuilde.weekStats.totalRuns}
                </div>
                <div className="text-[9px] font-mono text-ink-muted uppercase">
                  sorties
                </div>
              </div>
            </div>

            {/* Challenge collectif */}
            {myGuilde.currentChallenge && (
              <div className="mt-3 rounded-lg border border-peach/20 bg-peach/5 p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] font-mono font-bold text-peach uppercase">
                    🎯 Défi de guilde
                  </div>
                  <div className="text-[10px] font-mono text-ink-dim">
                    {Math.round(
                      (myGuilde.currentChallenge.progress /
                        myGuilde.currentChallenge.target) *
                        100
                    )}
                    %
                  </div>
                </div>
                <div className="text-xs font-bold mb-2">
                  {myGuilde.currentChallenge.title}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg-raised">
                  <div
                    className="h-full rounded-full bg-peach shadow-glow-peach"
                    style={{
                      width: `${Math.min(
                        100,
                        (myGuilde.currentChallenge.progress /
                          myGuilde.currentChallenge.target) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10px] font-mono text-ink-muted">
                  {myGuilde.currentChallenge.progress.toLocaleString("fr")} /{" "}
                  {myGuilde.currentChallenge.target.toLocaleString("fr")}{" "}
                  {myGuilde.currentChallenge.unit}
                </div>
              </div>
            )}
          </Link>
        </section>
      )}

      {/* Découvrir */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          {myGuilde ? "Découvrir d'autres guildes" : "Rejoins une guilde"}
        </div>
        <div className="space-y-2">
          {discoverable.map((g) => {
            const cat = CATEGORY_META[g.category];
            const rule = JOIN_RULE_META[g.joinRule];
            const full = g.memberCount >= g.maxMembers;
            return (
              <Link
                key={g.id}
                href={`/guildes/${g.id}`}
                className="block rounded-xl border border-ink/10 bg-bg-card/60 p-4 hover:border-peach/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{g.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-display text-sm font-black truncate">
                        {g.name}
                      </div>
                      <span className={`text-[9px] font-mono uppercase ${cat.color}`}>
                        {cat.emoji} {cat.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-muted italic truncate">
                      {g.tagline}
                    </div>
                    <div className="mt-1 flex gap-2 text-[10px] font-mono">
                      <span className="text-ink-muted">
                        👥 {g.memberCount}/{g.maxMembers}
                      </span>
                      <span className={rule.color}>· {rule.label}</span>
                      <span className="text-ink-dim">· #{g.weekStats.rank}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {g.vibe.map((v) => (
                        <span
                          key={v}
                          className="rounded bg-bg-raised px-1.5 py-0.5 text-[9px] font-mono text-ink-muted"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {full ? (
                      <span className="text-[9px] font-mono text-ink-dim uppercase">
                        Complète
                      </span>
                    ) : (
                      <span className="rounded-md bg-peach/10 px-2 py-1 text-[10px] font-mono font-bold text-peach border border-peach/30">
                        Rejoindre →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Pourquoi une guilde */}
      <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-5 space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Pourquoi rejoindre une guilde
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex gap-2">
            <span>🎯</span>
            <span className="text-ink-muted">
              <b className="text-ink">Objectifs collectifs</b> — D+ cumulé,
              kilomètres groupés, défis mensuels.
            </span>
          </div>
          <div className="flex gap-2">
            <span>🏆</span>
            <span className="text-ink-muted">
              <b className="text-ink">Classement entre guildes</b> — ambiance
              inter-crews, rivalité saine.
            </span>
          </div>
          <div className="flex gap-2">
            <span>🗺️</span>
            <span className="text-ink-muted">
              <b className="text-ink">Sorties organisées</b> — trouve un
              partenaire de run local en 2 clics.
            </span>
          </div>
          <div className="flex gap-2">
            <span>💬</span>
            <span className="text-ink-muted">
              <b className="text-ink">Chat de guilde</b> — partage de conseils,
              photos, itinéraires.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
