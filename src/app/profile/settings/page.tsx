"use client";

import { useState } from "react";
import Link from "next/link";
import { ME } from "@/lib/data/me";
import type { AppMode } from "@/lib/types";

type LootStyle = "gamer" | "real" | "hidden";

export default function SettingsPage() {
  // Simulé — pas de persistence pour le MVP
  const [mode, setMode] = useState<AppMode>(ME.mode);
  const [weeklyTarget, setWeeklyTarget] = useState<number>(ME.weeklyTarget);
  const [lootStyle, setLootStyle] = useState<LootStyle>("gamer");
  const [notifications, setNotifications] = useState({
    weekly: true,
    challenges: true,
    friends: true,
    races: false,
  });

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

      {/* MODE — Adventure vs Performance */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Mode d'affichage
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setMode("adventure")}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === "adventure"
                ? "border-lime bg-lime/10 shadow-glow-lime"
                : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎮</div>
              <div className="flex-1">
                <div className="font-display text-base font-black">
                  Mode Aventure
                </div>
                <div className="text-xs text-ink-muted">
                  XP, niveaux, loot, badges
                </div>
              </div>
              {mode === "adventure" && (
                <div className="text-lime">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-5 w-5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>
          </button>
          <button
            onClick={() => setMode("performance")}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === "performance"
                ? "border-cyan bg-cyan/10 shadow-glow-cyan"
                : "border-ink/15 bg-bg-card/60 hover:border-cyan/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">📊</div>
              <div className="flex-1">
                <div className="font-display text-base font-black">
                  Mode Performance
                </div>
                <div className="text-xs text-ink-muted">
                  UTMB, ITRA, CTL/TSB, zones FC — data pro
                </div>
              </div>
              {mode === "performance" && (
                <div className="text-cyan">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-5 w-5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>
        <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-3 text-[11px] text-ink-muted">
          💡 Tu peux changer de mode à tout moment. Les deux gardent tes sorties
          et ton historique — seul l'habillage change.
        </div>
      </section>

      {/* RYTHME HEBDO */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
          Rythme hebdomadaire
        </div>
        <div className="rounded-2xl border border-peach/20 bg-bg-card/60 p-4">
          <div className="text-xs text-ink-muted mb-3">
            Combien de sorties par semaine tu vises ? Pas de stress, le rythme
            s'ajuste à ta vie.
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

      {/* LOOT STYLE — Fix #5 du user testing */}
      {mode === "adventure" && (
        <section className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet">
            Style du loot
          </div>
          <div className="rounded-2xl border border-violet/20 bg-bg-card/60 p-4 space-y-2">
            <div className="text-xs text-ink-muted mb-2">
              Comment tu veux tes récompenses ?
            </div>
            {(
              [
                {
                  id: "gamer",
                  emoji: "🎮",
                  label: "Gamer fun",
                  desc: "Titres, trophées, boosters XP — le vibe RPG assumé",
                },
                {
                  id: "real",
                  emoji: "🎁",
                  label: "Récompenses réelles",
                  desc: "Codes promo marques, stickers, vouchers courses",
                },
                {
                  id: "hidden",
                  emoji: "🙈",
                  label: "Masquer le loot",
                  desc: "Pas de loot affiché — juste badges et stats",
                },
              ] as const
            ).map((opt) => {
              const active = lootStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setLootStyle(opt.id)}
                  className={`w-full rounded-xl border p-3 text-left transition flex items-center gap-3 ${
                    active
                      ? "border-violet bg-violet/10"
                      : "border-ink/15 bg-bg-card/40 hover:border-violet/40"
                  }`}
                >
                  <div className="text-2xl">{opt.emoji}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{opt.label}</div>
                    <div className="text-[11px] text-ink-muted">{opt.desc}</div>
                  </div>
                  {active && (
                    <div className="text-violet">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="h-5 w-5"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* CONNEXIONS */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
          Connexions
        </div>
        <div className="space-y-2">
          {[
            { id: "strava", label: "Strava", color: "#fc4c02", connected: true },
            { id: "garmin", label: "Garmin Connect", color: "#007cc3", connected: true },
            { id: "coros", label: "COROS", color: "#000", connected: false },
            { id: "suunto", label: "Suunto", color: "#00a7e1", connected: false },
          ].map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg font-display text-sm font-black text-white"
                style={{ backgroundColor: w.color }}
              >
                {w.label[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{w.label}</div>
                <div
                  className={`text-[10px] font-mono ${
                    w.connected ? "text-lime" : "text-ink-dim"
                  }`}
                >
                  {w.connected ? "✓ Sync active" : "Non connecté"}
                </div>
              </div>
              <button
                className={`rounded-lg px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition ${
                  w.connected
                    ? "border border-ink/15 text-ink-muted hover:border-peach/40 hover:text-peach"
                    : "bg-cyan text-bg hover:scale-[1.02]"
                }`}
              >
                {w.connected ? "Déco" : "Connecter"}
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-3">
            <div className="text-[10px] font-mono font-bold uppercase text-cyan">
              UTMB Index
            </div>
            <div className="mt-1 font-display text-2xl font-black text-cyan">
              {ME.connections.utmb?.runnerIndex}
            </div>
            <button className="mt-1 text-[10px] font-mono text-ink-muted hover:text-cyan">
              Resynchroniser
            </button>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-3">
            <div className="text-[10px] font-mono font-bold uppercase text-violet">
              ITRA
            </div>
            <div className="mt-1 font-display text-2xl font-black text-violet">
              {ME.connections.itra.performanceIndex}
            </div>
            <button className="mt-1 text-[10px] font-mono text-ink-muted hover:text-violet">
              Resynchroniser
            </button>
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
          <Link href="#" className="hover:text-lime">
            Conditions
          </Link>
          <Link href="#" className="hover:text-lime">
            Confidentialité
          </Link>
          <Link href="#" className="hover:text-lime">
            Contact
          </Link>
        </div>
        <div className="text-[10px] font-mono text-ink-dim">
          Ravito v0.3.0 · Build {new Date().toISOString().slice(0, 10)}
        </div>
        <button className="mt-3 text-[11px] font-mono text-peach hover:text-peach-glow">
          Se déconnecter
        </button>
      </section>
    </main>
  );
}
