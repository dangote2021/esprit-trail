"use client";

// ====== RealGuildeDetail ======
// Hardening 04/09/26 : détail d'une vraie team Supabase (id = uuid réel,
// pas un id mock ni "user-*"). Avant ce correctif, /guildes/[id] appelait
// notFound() dès que l'id ne matchait pas une des 5 teams fictives — les 2
// vraies teams (Vercors Dimanche Matin, Chamonix Vertical Crew) étaient
// donc inaccessibles même en tapant l'URL directement.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Guilde } from "@/lib/data/guildes";
import { getRealGuilde } from "@/lib/supabase/guildes";
import { RealGuildeJoinButton, RealGuildeLeaveButton } from "./RealGuildeActions";

const CATEGORY_LABEL: Record<string, string> = {
  local: "📍 Local",
  club: "🏁 Club",
  "bande-copains": "🍻 Bande de copains",
  elite: "👑 Élite",
  theme: "🎯 Thématique",
};

export default function RealGuildeDetail({ id }: { id: string }) {
  const [guilde, setGuilde] = useState<Guilde | null | undefined>(undefined);

  const load = useCallback(() => {
    let cancelled = false;
    getRealGuilde(id).then((g) => {
      if (!cancelled) setGuilde(g);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => load(), [load]);

  if (guilde === undefined) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-6">
        <div className="pt-16 text-center text-sm text-ink-muted">
          Chargement de la team…
        </div>
      </main>
    );
  }

  if (guilde === null) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-6">
        <div className="pt-16 text-center space-y-3">
          <div className="text-4xl">🤷</div>
          <p className="text-sm text-ink-muted">Cette team n'existe pas (ou plus).</p>
          <Link
            href="/guildes"
            className="inline-block rounded-xl border border-peach/30 bg-peach/10 px-4 py-2 text-[11px] font-mono font-bold uppercase text-peach"
          >
            ← Retour aux teams
          </Link>
        </div>
      </main>
    );
  }

  const sortedMembers = [...guilde.members].sort((a, b) => b.weeklyKm - a.weeklyKm);
  const full = guilde.memberCount >= guilde.maxMembers;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      <header className="flex items-center gap-3 pt-4">
        <Link
          href="/guildes"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-peach transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach flex-1">
          Team · {guilde.location}
        </div>
        {guilde.iAmMember && (
          <RealGuildeLeaveButton guilde={guilde} onLeft={load} />
        )}
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-peach/30 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-6">
        <div className="flex items-start gap-4">
          <div className="text-6xl animate-float">{guilde.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-black leading-tight">
                {guilde.name}
              </h1>
              <span className="rounded-md bg-cyan/15 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-cyan">
                ⚡ Vraie team
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted italic">{guilde.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="rounded bg-bg-raised px-1.5 py-0.5 text-[10px] font-mono text-ink-muted">
                {CATEGORY_LABEL[guilde.category] || guilde.category}
              </span>
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
        {guilde.description && (
          <p className="mt-4 text-sm text-ink-muted leading-relaxed">{guilde.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-ink-dim uppercase">Membres</div>
            <div className="font-display text-lg font-black text-ink">
              {guilde.memberCount}/{guilde.maxMembers}
            </div>
          </div>
          {guilde.iAmMember ? (
            <div className="rounded-xl border border-lime/40 bg-lime/10 px-3 py-2 text-[11px] font-mono font-bold uppercase text-lime">
              ✓ Membre {guilde.iAmCaptain && "· Cap'"}
            </div>
          ) : full ? (
            <div className="rounded-xl border border-ink/15 bg-bg-card/60 px-4 py-2 text-[11px] font-mono font-bold uppercase text-ink-dim">
              Complète
            </div>
          ) : (
            <RealGuildeJoinButton guilde={guilde} onJoined={load} />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Stats cumulées de la team
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="font-display text-xl font-black text-lime">
              {guilde.weekStats.totalKm}
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">km</div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="font-display text-xl font-black text-peach">
              {(guilde.weekStats.totalElevation / 1000).toFixed(1)}K
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">m D+</div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="font-display text-xl font-black text-cyan">
              {guilde.weekStats.totalRuns}
            </div>
            <div className="text-[9px] font-mono text-ink-muted uppercase">sorties</div>
          </div>
        </div>
        <p className="text-[10px] font-mono text-ink-dim">
          Cumulé depuis les sorties enregistrées des membres (pas de fenêtre "cette
          semaine" pour l'instant).
        </p>
      </section>

      {sortedMembers.length > 0 && (
        <section className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
            Membres · Km cumulés
          </div>
          <div className="space-y-1.5">
            {sortedMembers.map((m, i) => (
              <Link
                key={m.id}
                href={`/u/${m.username}`}
                className="flex items-center gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3 hover:border-peach/30 transition"
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
                    <div className="text-sm font-bold truncate">{m.displayName}</div>
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
                  <div className="text-[9px] font-mono text-ink-dim uppercase">km</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
