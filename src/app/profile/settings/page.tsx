"use client";

import { useState } from "react";
import Link from "next/link";
import { ME } from "@/lib/data/me";

export default function SettingsPage() {
  // Simulé — pas de persistence pour le MVP
  const [weeklyTarget, setWeeklyTarget] = useState<number>(ME.weeklyTarget);
  const [displayName, setDisplayName] = useState<string>(ME.displayName);
  const [handle, setHandle] = useState<string>(ME.username);
  const [notifications, setNotifications] = useState({
    weekly: true,
    challenges: true,
    friends: true,
    races: false,
  });

  function sanitizeHandle(v: string) {
    return v
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20);
  }

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-10 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4">
        <Link
          href="/profile"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
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
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
            Paramètres
          </div>
          <h1 className="font-display text-2xl font-black leading-none">
            Règle ton app
          </h1>
        </div>
      </header>

      {/* IDENTITÉ — prénom + pseudo */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Identité
        </div>
        <div className="rounded-2xl border border-lime/20 bg-bg-card/60 p-4 space-y-3">
          <label className="block">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Prénom affiché
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
              placeholder="Clem, Marco, Raven…"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card px-3 py-2.5 font-display text-base font-black text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Pseudo
            </span>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-base text-ink-dim">
                @
              </span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(sanitizeHandle(e.target.value))}
                placeholder="mulet_gang"
                className="w-full rounded-xl border border-ink/15 bg-bg-card py-2.5 pl-8 pr-3 font-mono text-base text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
              />
            </div>
            <span className="mt-1 block text-[10px] font-mono text-ink-dim">
              Visible dans ta team et le leaderboard.
            </span>
          </label>
        </div>
      </section>

      {/* OBJECTIF HEBDO */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
          Rythme hebdomadaire
        </div>
        <div className="rounded-2xl border border-peach/20 bg-bg-card/60 p-4">
          <div className="text-xs text-ink-muted mb-3">
            Combien de sorties par semaine tu vises ? Pas de stress, le rythme
            s&apos;ajuste à ta vie.
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => {
              const active = weeklyTarget === n;
              const label = n === 4 ? "4+" : n.toString();
              return (
                <button
                  key={n}
                  onClick={() => setWeeklyTarget(n)}
                  className={`rounded-xl border p-3 text-center transition ${
                    active
                      ? "border-peach bg-peach/10 shadow-glow-peach"
                      : "border-ink/15 bg-bg-card/60 hover:border-peach/40"
                  }`}
                >
                  <div className="font-display text-2xl font-black">
                    {label}
                  </div>
                  <div className="text-[10px] font-mono text-ink-muted uppercase">
                    /sem
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONNEXIONS — Strava uniquement */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
          Connexion Strava
        </div>
        <div className="rounded-2xl border border-ink/10 bg-bg-card/60 p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl font-display text-lg font-black text-white"
              style={{ backgroundColor: "#fc4c02" }}
            >
              S
            </div>
            <div className="flex-1">
              <div className="font-display text-base font-black">Strava</div>
              <div className="text-[11px] font-mono text-lime">✓ Sync active</div>
            </div>
            <Link
              href="/settings/connections/strava"
              className="rounded-lg border border-ink/15 px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-ink-muted hover:border-lime/40 hover:text-lime"
            >
              Gérer
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-3">
              <div className="text-[10px] font-mono font-bold uppercase text-cyan">
                UTMB Index
              </div>
              <div className="mt-1 font-display text-2xl font-black text-cyan">
                {ME.connections.utmb?.runnerIndex ?? "—"}
              </div>
            </div>
            <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-3">
              <div className="text-[10px] font-mono font-bold uppercase text-violet">
                ITRA
              </div>
              <div className="mt-1 font-display text-2xl font-black text-violet">
                {ME.connections.itra.performanceIndex}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
          Notifications
        </div>
        <div className="rounded-2xl border border-ink/10 bg-bg-card/60 p-2 divide-y divide-ink/5">
          {(
            [
              {
                id: "weekly",
                label: "Récap hebdo du lundi",
                desc: "Stats + suggestion pour la semaine",
              },
              {
                id: "challenges",
                label: "Progression des défis",
                desc: "Quand tu approches d'un objectif",
              },
              {
                id: "friends",
                label: "Activité des amis",
                desc: "Runs marquantes, records battus",
              },
              {
                id: "races",
                label: "Courses près de chez toi",
                desc: "Nouvelles inscriptions ouvertes",
              },
            ] as const
          ).map((n) => {
            const active = notifications[n.id];
            return (
              <button
                key={n.id}
                onClick={() =>
                  setNotifications((p) => ({ ...p, [n.id]: !p[n.id] }))
                }
                className="flex items-center gap-3 p-3 w-full text-left hover:bg-bg-raised/40 rounded-lg transition"
              >
                <div className="flex-1">
                  <div className="text-sm font-bold">{n.label}</div>
                  <div className="text-[11px] text-ink-muted">{n.desc}</div>
                </div>
                <div
                  className={`relative h-6 w-11 rounded-full transition ${
                    active ? "bg-gold" : "bg-bg-raised"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                      active ? "left-5" : "left-0.5"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CONFIDENTIALITÉ */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Confidentialité
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between rounded-xl border border-ink/10 bg-bg-card/60 p-3 hover:border-cyan/40 transition">
            <div className="text-left">
              <div className="text-sm font-bold">Visibilité du profil</div>
              <div className="text-[11px] text-ink-muted">Public</div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-ink-dim"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between rounded-xl border border-ink/10 bg-bg-card/60 p-3 hover:border-cyan/40 transition">
            <div className="text-left">
              <div className="text-sm font-bold">Cacher les traces GPS sensibles</div>
              <div className="text-[11px] text-ink-muted">
                Autour de ton domicile (500m)
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-ink-dim"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between rounded-xl border border-ink/10 bg-bg-card/60 p-3 hover:border-cyan/40 transition">
            <div className="text-left">
              <div className="text-sm font-bold">Exporter mes données</div>
              <div className="text-[11px] text-ink-muted">
                GPX, JSON, tout est à toi
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-ink-dim"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="space-y-2 pt-4 border-t border-ink/5">
        <div className="flex gap-4 text-[11px] font-mono text-ink-muted">
          <Link href="/legal/cgu" className="hover:text-lime">
            Conditions
          </Link>
          <Link href="/legal/privacy" className="hover:text-lime">
            Confidentialité
          </Link>
          <Link href="/legal/mentions" className="hover:text-lime">
            Mentions
          </Link>
        </div>
        <div className="text-[10px] font-mono text-ink-dim">
          Esprit Trail v0.4.0 · Build {new Date().toISOString().slice(0, 10)}
        </div>
        <button className="mt-3 text-[11px] font-mono text-peach hover:text-peach-glow">
          Se déconnecter
        </button>
      </section>
    </main>
  );
}
