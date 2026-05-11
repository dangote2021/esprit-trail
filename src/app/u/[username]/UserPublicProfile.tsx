"use client";

// ====== UserPublicProfile ======
// Profil public léger d'un user de la communauté Esprit Trail. Pour le MVP :
// on lit la liste des courses qu'il a proposées (ON + OFF) depuis le
// localStorage. Phase 2 : query Supabase profiles + user_races.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadUserRaces,
  loadUserOffRaces,
} from "@/lib/data/user-races";
import { MESSAGE_USERS } from "@/lib/data/messages";
import type { Race } from "@/lib/types";
import type { OffRace } from "@/lib/data/off-races";

export default function UserPublicProfile({ username }: { username: string }) {
  const [hydrated, setHydrated] = useState(false);
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [allOff, setAllOff] = useState<OffRace[]>([]);

  useEffect(() => {
    setHydrated(true);
    setAllRaces(loadUserRaces());
    setAllOff(loadUserOffRaces());
  }, []);

  // Recherche d'infos sur le user :
  // - mock data MESSAGE_USERS (panel de personas qu'on connaît)
  // - fallback : username brut + emoji générique
  const fromPanel = Object.values(MESSAGE_USERS).find(
    (u) => u.username === username,
  );

  // Si pas dans le panel, on essaye d'extraire les infos depuis les races
  // submittedBy (cas du user qui a posté lui-même)
  const fromRaces = useMemo(() => {
    const found =
      allRaces.find((r) => r.submittedBy?.username === username)?.submittedBy ||
      allOff.find((r) => r.submittedBy?.username === username)?.submittedBy;
    return found;
  }, [allRaces, allOff, username]);

  const profile = fromPanel
    ? {
        username: fromPanel.username,
        displayName: fromPanel.displayName,
        avatar: fromPanel.avatar,
      }
    : fromRaces || {
        username,
        displayName: username,
        avatar: "🏃",
      };

  const myRaces = allRaces.filter((r) => r.submittedBy?.username === username);
  const myOff = allOff.filter((r) => r.submittedBy?.username === username);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-10 space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/races"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
          aria-label="Retour"
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
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Profil public
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="rounded-3xl border-2 border-lime/30 bg-gradient-to-br from-lime/10 via-bg-card to-peach/10 p-6 text-center space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bg-raised border-4 border-bg-card shadow-md text-4xl">
          {profile.avatar}
        </div>
        <div>
          <h1 className="font-display text-2xl font-black text-ink">
            {profile.displayName}
          </h1>
          <div className="text-xs font-mono text-ink-muted">
            @{profile.username}
          </div>
        </div>
        {fromPanel?.level && (
          <div className="inline-flex items-center gap-1 rounded-md bg-lime/15 px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider text-lime">
            LVL {fromPanel.level}
          </div>
        )}
      </section>

      {/* Stats compactes */}
      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-peach/20 bg-bg-card/60 p-3 text-center">
          <div className="font-display text-2xl font-black text-peach">
            {hydrated ? myRaces.length : "…"}
          </div>
          <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
            Courses ON proposées
          </div>
        </div>
        <div className="rounded-xl border border-violet/20 bg-bg-card/60 p-3 text-center">
          <div className="font-display text-2xl font-black text-violet">
            {hydrated ? myOff.length : "…"}
          </div>
          <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
            OFF Races proposées
          </div>
        </div>
      </section>

      {/* Courses ON proposées */}
      {hydrated && myRaces.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Ses courses ON
          </div>
          <ul className="space-y-1.5">
            {myRaces.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/race/${r.id}`}
                  className="flex items-center gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3 hover:border-peach/40 transition"
                >
                  <div className="text-2xl shrink-0">🏁</div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-bold text-ink">
                      {r.name}
                    </div>
                    <div className="text-[11px] font-mono text-ink-muted truncate">
                      {r.distance} km · {r.elevation.toLocaleString("fr")} D+ ·{" "}
                      {r.location}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* OFF Races proposées */}
      {hydrated && myOff.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet">
            Ses OFF Races
          </div>
          <ul className="space-y-1.5">
            {myOff.map((r) => (
              <li key={r.id}>
                <Link
                  href="/races?tab=off"
                  className="flex items-center gap-3 rounded-xl border border-violet/20 bg-violet/5 p-3 hover:border-violet/50 transition"
                >
                  <div className="text-2xl shrink-0">🏴‍☠️</div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-bold text-ink">
                      {r.name}
                    </div>
                    <div className="text-[11px] font-mono text-ink-muted truncate">
                      {r.distance} km · {r.elevation.toLocaleString("fr")} D+ ·{" "}
                      {r.location}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Empty state */}
      {hydrated && myRaces.length === 0 && myOff.length === 0 && (
        <section className="rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card/40 p-6 text-center space-y-2">
          <div className="text-3xl">🤷</div>
          <div className="font-display text-sm font-black text-ink">
            Pas encore de course proposée
          </div>
          <div className="text-xs text-ink-muted">
            Ce traileur n&apos;a pas encore partagé de course avec la communauté.
          </div>
        </section>
      )}

      {/* Footer cosmetic */}
      <div className="text-center pt-2">
        <p className="text-[10px] font-mono text-ink-dim">
          Profil public Esprit Trail
        </p>
      </div>
    </main>
  );
}
