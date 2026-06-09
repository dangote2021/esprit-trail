"use client";

// ====== RaceParticipants ======
// "Qui d'autre y va ?" — section sociale sur /race/[id]. Affiche les
// traileurs de la communauté qui ont déjà annoncé être sur la course,
// plus un toggle "Moi aussi j'y serai" qui persiste en localStorage
// (clé esprit_race_attending).
//
// Pour le MVP : la liste publique est mock + ne reflète pas dynamiquement
// que je m'inscris (sauf moi). À terme : Supabase race_participations.
// Mais le toggle "je m'inscris" est fonctionnel — il est visible dans
// le profil + on incrémente le compteur localement.

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RaceParticipant } from "@/lib/data/race-participants";

const ATTEND_KEY = "esprit_race_attending";

type AttendStore = Record<string, { since: string; format?: string }>;

function loadAttendStore(): AttendStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ATTEND_KEY);
    return raw ? (JSON.parse(raw) as AttendStore) : {};
  } catch {
    return {};
  }
}

function setAttending(raceId: string, on: boolean, format?: string) {
  if (typeof window === "undefined") return;
  try {
    const store = loadAttendStore();
    if (on) store[raceId] = { since: new Date().toISOString(), format };
    else delete store[raceId];
    window.localStorage.setItem(ATTEND_KEY, JSON.stringify(store));
    window.dispatchEvent(
      new CustomEvent("esprit:race:attending", { detail: { raceId, on } }),
    );
  } catch {/* ignore */}
}

export default function RaceParticipants({
  raceId,
  raceName,
  participants,
}: {
  raceId: string;
  raceName: string;
  participants: RaceParticipant[];
}) {
  const [iAmAttending, setIAmAttending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIAmAttending(!!loadAttendStore()[raceId]);
    const onChange = (e: Event) => {
      const d = (e as CustomEvent).detail as { raceId: string; on: boolean };
      if (d?.raceId === raceId) setIAmAttending(d.on);
    };
    window.addEventListener("esprit:race:attending", onChange);
    return () => window.removeEventListener("esprit:race:attending", onChange);
  }, [raceId]);

  function toggle() {
    setAttending(raceId, !iAmAttending);
    setIAmAttending((v) => !v);
  }

  // Compteur = participants mock + 1 si je m'ajoute
  const totalCount = participants.length + (mounted && iAmAttending ? 1 : 0);

  return (
    <section className="rounded-2xl border border-violet/25 bg-gradient-to-br from-violet/10 via-bg-card to-bg p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
            Qui d&apos;autre y va ?
          </div>
          <div className="font-display text-base font-black leading-tight">
            {totalCount} traileur{totalCount > 1 ? "s" : ""} de la communauté
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={iAmAttending}
          className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-mono font-black uppercase tracking-wider transition tap-bounce ${
            iAmAttending
              ? "bg-violet text-bg shadow-glow-violet"
              : "border-2 border-violet/40 text-violet hover:bg-violet/10"
          }`}
        >
          {iAmAttending ? "✓ J'y suis" : "+ J'y serai"}
        </button>
      </div>

      {/* Liste avatars + premiers participants */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {participants.slice(0, 8).map((p) => (
          <Link
            key={p.id}
            href={`/u/${p.handle}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-ink/15 text-lg hover:scale-110 transition"
            aria-label={`Profil de ${p.name}`}
            title={p.name}
          >
            {p.avatar}
          </Link>
        ))}
        {participants.length > 8 && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/15 text-[11px] font-mono font-bold text-violet border border-violet/30">
            +{participants.length - 8}
          </div>
        )}
        {mounted && iAmAttending && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet text-white text-[10px] font-mono font-black border border-violet/40">
            TOI
          </div>
        )}
      </div>

      {/* Première vibe — quote d'un traileur si dispo */}
      {participants.find((p) => p.vibe) && (
        <div className="space-y-1.5">
          {participants
            .filter((p) => p.vibe)
            .slice(0, 2)
            .map((p) => (
              <div
                key={p.id}
                className="rounded-lg bg-white/60 border border-ink/10 p-2.5 text-[11px] leading-snug"
              >
                <Link
                  href={`/u/${p.handle}`}
                  className="font-display text-[11px] font-black text-violet hover:underline"
                >
                  {p.name}
                </Link>
                {p.format && (
                  <span className="ml-1 text-[10px] font-mono text-ink-muted">
                    · {p.format}
                  </span>
                )}
                <div className="text-ink-muted italic mt-0.5">
                  &ldquo;{p.vibe}&rdquo;
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Petit hint sur la signification du bouton */}
      <p className="mt-2 text-[10px] font-mono text-ink-dim leading-snug">
        Le {raceName} t&apos;intéresse ? Marque-toi présent — ça apparaîtra
        sur ton profil et les potos sauront que tu y vas.
      </p>
    </section>
  );
}
