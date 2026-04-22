import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuilde } from "@/lib/data/guildes";

export default function GuildeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const guilde = getGuilde(params.id);
  if (!guilde) notFound();

  const daysLeft = guilde.currentChallenge
    ? Math.max(
        0,
        Math.ceil(
          (new Date(guilde.currentChallenge.endsAt).getTime() -
            Date.now()) /
            (24 * 60 * 60 * 1000)
        )
      )
    : 0;

  const sortedMembers = [...guilde.members].sort(
    (a, b) => b.weeklyKm - a.weeklyKm
  );

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4">
        <Link
          href="/guildes"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-peach transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach flex-1">
          Guilde · {guilde.location}
        </div>
        {guilde.iAmMember && (
          <button className="rounded-lg border border-ink/15 px-2 py-1 text-[10px] font-mono text-ink-muted hover:text-peach">
            ⚙️
          </button>
        )}
      </header>

      {/* Hero guilde */}
      <section className="relative overflow-hidden rounded-3xl border border-peach/30 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-6">
        <div className="flex items-start gap-4">
          <div className="text-6xl animate-float">{guilde.emoji}</div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-black leading-tight">
              {guilde.name}
            </h1>
            <p className="mt-1 text-xs text-ink-muted italic">
              {guilde.tagline}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {guilde.vibe.map((v) => (
                <span
                  key={v}
                  className="rounded bg-bg-raised px-1.5 py-0.5 text-[10px] font-mono text-ink-muted"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-muted leading-relaxed">
          {guilde.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-ink-dim uppercase">
              Membres
            </div>
            <div className="font-display text-xl font-black">
              {guilde.memberCount}{" "}
              <span className="text-ink-dim text-sm">/ {guilde.maxMembers}</span>
            </div>
          </div>
          {guilde.iAmMember ? (
            <div className="rounded-xl border border-lime/40 bg-lime/10 px-3 py-2 text-[11px] font-mono font-bold uppercase text-lime">
              ✓ Membre {guilde.iAmCaptain && "· Cap'"}
            </div>
          ) : guilde.memberCount >= guilde.maxMembers ? (
            <div className="rounded-xl border border-ink/15 bg-bg-card/60 px-4 py-2 text-[11px] font-mono font-bold uppercase text-ink-dim">
              Complète
            </div>
          ) : (
            <button className="rounded-xl bg-peach px-5 py-2 text-[12px] font-mono font-black uppercase text-bg shadow-glow-peach hover:scale-[1.02] transition">
              {guilde.joinRule === "open"
                ? "Rejoindre"
                : guilde.joinRule === "request"
                ? "Demander"
                : "Sur invitation"}
            </button>
          )}
        </div>
      </section>

      {/* Stats semaine */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Stats de la semaine
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="font-display text-xl font-black text-lime">
              {guilde.weekStats.totalKm}
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">
              km
            </div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="font-display text-xl font-black text-peach">
              {(guilde.weekStats.totalElevation / 1000).toFixed(1)}K
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">
              m D+
            </div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="font-display text-xl font-black text-cyan">
              {guilde.weekStats.totalRuns}
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">
              sorties
            </div>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-3 text-center">
            <div className="font-display text-xl font-black text-gold">
              #{guilde.weekStats.rank}
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">
              Rang
            </div>
          </div>
        </div>
      </section>

      {/* Défi collectif */}
      {guilde.currentChallenge && (
        <section className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Défi de guilde en cours
          </div>
          <div className="rounded-2xl border border-peach/30 bg-gradient-to-br from-peach/10 to-bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-display text-lg font-black">
                  {guilde.currentChallenge.title}
                </h3>
                <p className="mt-1 text-[11px] font-mono text-ink-muted">
                  Se termine dans {daysLeft} jour{daysLeft > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-black text-peach">
                  {Math.round(
                    (guilde.currentChallenge.progress /
                      guilde.currentChallenge.target) *
                      100
                  )}
                  %
                </div>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-bg-raised">
              <div
                className="h-full rounded-full bg-gradient-to-r from-peach to-gold shadow-glow-peach"
                style={{
                  width: `${Math.min(
                    100,
                    (guilde.currentChallenge.progress /
                      guilde.currentChallenge.target) *
                      100
                  )}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono">
              <span className="text-ink-muted">
                {guilde.currentChallenge.progress.toLocaleString("fr")}{" "}
                {guilde.currentChallenge.unit}
              </span>
              <span className="text-ink-dim">
                / {guilde.currentChallenge.target.toLocaleString("fr")}{" "}
                {guilde.currentChallenge.unit}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Members leaderboard */}
      {sortedMembers.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
              Classement interne · Km semaine
            </div>
            <Link
              href={`/guildes/${guilde.id}/members`}
              className="text-[10px] font-mono font-bold text-cyan hover:text-cyan-glow"
            >
              Tous les membres →
            </Link>
          </div>
          <div className="space-y-1.5">
            {sortedMembers.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  m.username === "coulon_g"
                    ? "border-lime/40 bg-lime/5"
                    : "border-ink/10 bg-bg-card/60"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-black ${
                    i === 0
                      ? "bg-gold text-bg"
                      : i === 1
                      ? "bg-ink/20 text-ink"
                      : i === 2
                      ? "bg-peach/60 text-bg"
                      : "bg-bg-raised text-ink-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="text-2xl">{m.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold truncate">
                      {m.displayName}
                    </div>
                    {m.role === "captain" && (
                      <span className="rounded bg-gold/20 px-1 py-0.5 text-[9px] font-mono font-black text-gold">
                        CAP'
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-ink-muted">
                    LVL {m.level} · @{m.username}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-sm font-black text-lime">
                    {m.weeklyKm}
                  </div>
                  <div className="text-[9px] font-mono text-ink-dim uppercase">
                    km
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      {guilde.iAmMember && (
        <section className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-xl border border-cyan/30 bg-cyan/5 p-3 text-left hover:bg-cyan/10 transition">
              <div className="text-xl">💬</div>
              <div className="mt-1 text-sm font-bold">Chat de guilde</div>
              <div className="text-[10px] text-ink-muted">3 messages non lus</div>
            </button>
            <button className="rounded-xl border border-lime/30 bg-lime/5 p-3 text-left hover:bg-lime/10 transition">
              <div className="text-xl">🗓️</div>
              <div className="mt-1 text-sm font-bold">Sorties groupées</div>
              <div className="text-[10px] text-ink-muted">2 prévues cette sem.</div>
            </button>
          </div>
          <button className="w-full rounded-xl border border-peach/20 bg-bg-card/40 p-3 text-xs font-mono text-peach hover:bg-peach/5 transition">
            📢 Proposer un nouveau défi de guilde
          </button>
        </section>
      )}
    </main>
  );
}
