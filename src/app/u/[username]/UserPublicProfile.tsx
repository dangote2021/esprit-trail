"use client";

// ====== UserPublicProfile ======
// Profil public d'un autre traileur. Phase 1 (mock + localStorage) :
// - infos du user depuis MESSAGE_USERS (panel personas connus) ou
//   submittedBy des races (cas user qui a posté lui-même)
// - "stats publiques" mockées par user dans PUBLIC_PERFS (volume, cailloux,
//   UTMB Index, courses mythiques)
// - bouton "Envoyer un message" qui ouvre la conversation 1-1 (mock data)
// - lien vers ranking pour voir sa position relative au tien
//
// Phase 2 : query Supabase profiles + perfs réelles.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadUserRaces,
  loadUserOffRaces,
} from "@/lib/data/user-races";
import { MESSAGE_USERS, CONVERSATIONS } from "@/lib/data/messages";
import type { Race } from "@/lib/types";
import type { OffRace } from "@/lib/data/off-races";
import { TOTEMS, type TotemKey } from "@/components/profile/TotemPicker";

// ====== Mock "perfs publiques" pour chaque persona du panel ======
// Ces stats sont fictives mais cohérentes avec les profils joués pendant les
// user tests. Migrera en table Supabase `public_perfs` plus tard.
type PublicPerfs = {
  cailloux: number; // points ITRA
  utmbIndex: number; // UTMB Performance Index
  volumeYear: number; // km cumulés sur 365j
  elevYear: number; // D+ cumulé
  finishesYear: number;
  totem?: TotemKey;
  topRaces: { name: string; year: number; rank?: string; time?: string }[];
  rankItraGlobal?: number; // position dans le ranking ITRA global
  rankUtmbGlobal?: number;
};

const PUBLIC_PERFS: Record<string, PublicPerfs> = {
  "u-theo": {
    cailloux: 685,
    utmbIndex: 812,
    volumeYear: 3800,
    elevYear: 102000,
    finishesYear: 14,
    totem: "wolf",
    topRaces: [
      { name: "CCC 2024", year: 2024, rank: "23ème", time: "13h08" },
      { name: "Diagonale des Fous 2023", year: 2023, rank: "78ème", time: "32h45" },
      { name: "Hardrock 2022", year: 2022, rank: "Finisher", time: "31h12" },
    ],
    rankItraGlobal: 412,
    rankUtmbGlobal: 287,
  },
  "u-sam": {
    cailloux: 412,
    utmbIndex: 645,
    volumeYear: 2400,
    elevYear: 68000,
    finishesYear: 9,
    totem: "bison",
    topRaces: [
      { name: "Grand Raid Pyrénées 2024", year: 2024, rank: "Finisher", time: "28h30" },
      { name: "MaXi-Race Annecy 2023", year: 2023, rank: "156ème", time: "11h22" },
      { name: "Ultra-Trail Côte d'Azur 2022", year: 2022, rank: "Finisher" },
    ],
    rankItraGlobal: 1240,
    rankUtmbGlobal: 980,
  },
  "u-marine": {
    cailloux: 295,
    utmbIndex: 580,
    volumeYear: 2100,
    elevYear: 32000,
    finishesYear: 11,
    totem: "fox",
    topRaces: [
      { name: "Trail Côte Sauvage 2024", year: 2024, rank: "8ème F" },
      { name: "EcoTrail Paris 2023", year: 2023, rank: "Finisher", time: "8h45" },
      { name: "SaintéLyon 2022", year: 2022, rank: "Finisher", time: "9h12" },
    ],
    rankItraGlobal: 2840,
    rankUtmbGlobal: 1820,
  },
  "u-clem": {
    cailloux: 95,
    utmbIndex: 380,
    volumeYear: 1300,
    elevYear: 15000,
    finishesYear: 4,
    totem: "deer",
    topRaces: [
      { name: "Trail des Templiers 25k 2024", year: 2024, rank: "Finisher" },
      { name: "Marathon des Sables 2024 (relais)", year: 2024 },
    ],
    rankItraGlobal: 8420,
    rankUtmbGlobal: 6900,
  },
  "u-casquette": {
    cailloux: 188,
    utmbIndex: 510,
    volumeYear: 1900,
    elevYear: 38000,
    finishesYear: 7,
    totem: "boar",
    topRaces: [
      { name: "FKT Mercantour 80k (perso)", year: 2024, time: "16h40" },
      { name: "Pirate Chamonix Loop 2023", year: 2023, rank: "Finisher" },
      { name: "GR20 vacances 2022", year: 2022, time: "9 jours autonomie" },
    ],
    rankItraGlobal: 4100,
    rankUtmbGlobal: 3220,
  },
};

function getPerfs(userKey: string | undefined): PublicPerfs | null {
  if (!userKey) return null;
  return PUBLIC_PERFS[userKey] || null;
}

export default function UserPublicProfile({ username }: { username: string }) {
  const [hydrated, setHydrated] = useState(false);
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [allOff, setAllOff] = useState<OffRace[]>([]);

  useEffect(() => {
    setHydrated(true);
    setAllRaces(loadUserRaces());
    setAllOff(loadUserOffRaces());
  }, []);

  // 1) Cherche d'abord dans MESSAGE_USERS (panel personas)
  const panelEntry = Object.entries(MESSAGE_USERS).find(
    ([, u]) => u.username === username,
  );
  const fromPanel = panelEntry?.[1];
  const userKey = panelEntry?.[0];

  // 2) Sinon fallback : extrait depuis submittedBy d'une race
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
        level: fromPanel.level,
        online: fromPanel.online,
      }
    : fromRaces
      ? { ...fromRaces, level: undefined, online: undefined }
      : {
          username,
          displayName: username,
          avatar: "🏃",
          level: undefined,
          online: undefined,
        };

  const perfs = getPerfs(userKey);
  const totem = perfs?.totem ? TOTEMS[perfs.totem] : null;

  // Conversation existante avec cet user ?
  const existingConv = userKey
    ? CONVERSATIONS.find(
        (c) =>
          c.type === "dm" &&
          c.members.some((m) => m.id === userKey),
      )
    : null;

  const messageHref = existingConv
    ? `/messages/${existingConv.id}`
    : userKey
      ? `/messages?new=${userKey}`
      : `/messages`;

  const myRaces = allRaces.filter((r) => r.submittedBy?.username === username);
  const myOff = allOff.filter((r) => r.submittedBy?.username === username);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-20 space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
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
        <Link
          href={messageHref}
          className="rounded-lg border border-lime/40 bg-lime/10 px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider text-lime hover:bg-lime/20 transition"
          aria-label="Envoyer un message"
        >
          💬 Message
        </Link>
      </header>

      {/* Hero */}
      <section className="rounded-3xl border-2 border-lime/30 bg-gradient-to-br from-lime/10 via-bg-card to-peach/10 p-6 text-center space-y-3 card-chunky">
        <div className="relative inline-block">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-bg-raised border-4 border-bg-card shadow-md text-5xl">
            {profile.avatar}
          </div>
          {totem && (
            <div
              className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-violet text-xl border-2 border-bg-card shadow-md"
              title={`Totem : ${totem.label}`}
            >
              {totem.emoji}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-black text-ink">
            {profile.displayName}
          </h1>
          <div className="text-xs font-mono text-ink-muted">
            @{profile.username}
          </div>
          {totem && (
            <div className="mt-1.5 text-[10px] font-mono text-violet">
              Totem : <strong>{totem.label}</strong> · {totem.vibe}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          {profile.level !== undefined && (
            <div className="inline-flex items-center gap-1 rounded-md bg-lime/15 px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider text-lime">
              LVL {profile.level}
            </div>
          )}
          {profile.online && (
            <div className="inline-flex items-center gap-1 rounded-md bg-cyan/15 px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
              En ligne
            </div>
          )}
        </div>

        {/* CTA messager — plus visible que le bouton du header */}
        <Link
          href={messageHref}
          className="mt-2 inline-block w-full rounded-xl bg-lime py-3 text-center font-display font-black uppercase tracking-wider text-bg shadow-glow-lime btn-chunky tap-bounce"
        >
          💬 Envoyer un message
        </Link>
      </section>

      {/* === RANKING & CAILLOUX === */}
      {perfs && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted px-1">
            Ranking & points
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/ranking"
              className="rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/10 to-bg-card p-4 hover:border-violet/50 transition"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet to-peach font-display text-xs font-black text-bg">
                  I
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet">
                  Points ITRA
                </div>
              </div>
              <div className="mt-2 font-display text-3xl font-black text-violet">
                {perfs.cailloux}
              </div>
              {perfs.rankItraGlobal && (
                <div className="text-[10px] font-mono text-ink-muted">
                  #{perfs.rankItraGlobal.toLocaleString("fr")} global
                </div>
              )}
            </Link>

            <Link
              href="/ranking?tab=utmb"
              className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 to-bg-card p-4 hover:border-cyan/50 transition"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan/15 text-sm">
                  🏔️
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
                  UTMB Index
                </div>
              </div>
              <div className="mt-2 font-display text-3xl font-black text-cyan">
                {perfs.utmbIndex}
              </div>
              {perfs.rankUtmbGlobal && (
                <div className="text-[10px] font-mono text-ink-muted">
                  #{perfs.rankUtmbGlobal.toLocaleString("fr")} global
                </div>
              )}
            </Link>
          </div>
        </section>
      )}

      {/* === PERFORMANCES 12 derniers mois === */}
      {perfs && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted px-1">
            12 derniers mois
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-lime/20 bg-bg-card/60 p-3 text-center">
              <div className="font-display text-xl font-black text-lime">
                {perfs.volumeYear.toLocaleString("fr")}
              </div>
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                km
              </div>
            </div>
            <div className="rounded-xl border border-peach/20 bg-bg-card/60 p-3 text-center">
              <div className="font-display text-xl font-black text-peach">
                {perfs.elevYear.toLocaleString("fr")}
              </div>
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                D+
              </div>
            </div>
            <div className="rounded-xl border border-violet/20 bg-bg-card/60 p-3 text-center">
              <div className="font-display text-xl font-black text-violet">
                {perfs.finishesYear}
              </div>
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                Finishs
              </div>
            </div>
          </div>
        </section>
      )}

      {/* === COURSES MYTHIQUES === */}
      {perfs && perfs.topRaces.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted px-1">
            Ses courses mythiques · TOP 3
          </div>
          <ul className="space-y-1.5">
            {perfs.topRaces.slice(0, 3).map((r, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/8 to-bg-card p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/20 font-display text-sm font-black text-gold">
                  {["🥇", "🥈", "🥉"][i] || "🏅"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-black text-ink">
                    {r.name}
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted truncate">
                    {[r.rank, r.time].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-gold font-black">
                    {r.year}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* === SES COURSES PROPOSÉES (user-submitted) === */}
      {hydrated && myRaces.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach px-1">
            Ses courses ON proposées
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

      {/* === OFF RACES PROPOSÉES === */}
      {hydrated && myOff.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet px-1">
            Ses OFF Races proposées
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

      {/* Empty state si vraiment rien */}
      {hydrated && !perfs && myRaces.length === 0 && myOff.length === 0 && (
        <section className="rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card/40 p-6 text-center space-y-2">
          <div className="text-3xl">🤷</div>
          <div className="font-display text-sm font-black text-ink">
            Profil pas encore rempli
          </div>
          <div className="text-xs text-ink-muted">
            Ce traileur n&apos;a pas encore partagé ses perfs.
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-[10px] font-mono text-ink-dim">
          Profil public Esprit Trail
        </p>
      </div>
    </main>
  );
}
