"use client";

// ====== NotificationsFeed ======
// Hardening 05/09/26 : rapport de test panel — /notifications n'affichait
// qu'un unique message de bienvenue statique (`SAMPLES`), identique pour
// tout le monde et jamais mis à jour, alors que la page prétend regrouper
// "nouvelles quêtes, badges débloqués ou messages de ta team". Ce composant
// dérive de vraies notifications à partir de deux sources réelles déjà
// câblées ailleurs dans l'app : les conversations non lues (messaging) et
// les badges nouvellement débloqués (badges-engine, comparés à un curseur
// "déjà vus" en localStorage pour ne montrer que ce qui est nouveau).
//
// Les quêtes/invitations de guilde ne sont pas incluses : aucun événement
// horodaté n'existe encore pour elles côté Supabase (cf. rapport, priorité
// moyenne — moteur d'attribution des quêtes/badges à construire). Mieux
// vaut ne rien afficher pour ces catégories que d'inventer un événement.

import { useEffect, useState } from "react";
import Link from "next/link";
import { listConversations, getViewerId } from "@/lib/supabase/messaging";
import { conversationDisplayName, formatRelativeTime } from "@/lib/data/messages";
import { getRealUnlockedBadges } from "@/lib/supabase/badges";
import { BADGES } from "@/lib/data/badges";

type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  when: string;
  tone: "lime" | "gold" | "sky" | "mythic";
  href: string;
};

const SEEN_BADGES_KEY = "esprit_seen_badges";

function loadSeenBadges(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(SEEN_BADGES_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenBadges(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_BADGES_KEY, JSON.stringify([...ids]));
  } catch {
    // best-effort — pas grave si ça échoue (rejouera juste la notif)
  }
}

export default function NotificationsFeed() {
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [convs, viewerId, unlocked] = await Promise.all([
        listConversations(),
        getViewerId(),
        getRealUnlockedBadges(),
      ]);
      if (cancelled) return;

      const messageNotifs: Notif[] = convs
        .filter((c) => c.unreadCount > 0 && c.lastMessage)
        .map((c) => ({
          id: `msg-${c.id}`,
          icon: c.type === "group" ? "👥" : "💬",
          title: `Nouveau message · ${conversationDisplayName(c, viewerId)}`,
          body: c.lastMessage!.text,
          when: formatRelativeTime(c.lastMessage!.createdAt),
          tone: "lime" as const,
          href: `/messages/${c.id}`,
        }));

      const seen = loadSeenBadges();
      const newBadgeIds = [...unlocked].filter((id) => !seen.has(id));
      const badgeNotifs: Notif[] = newBadgeIds
        .map((id) => BADGES.find((b) => b.id === id))
        .filter((b): b is (typeof BADGES)[number] => !!b)
        .map((b) => ({
          id: `badge-${b.id}`,
          icon: b.icon,
          title: `Badge débloqué · ${b.name}`,
          body: b.description,
          when: "nouveau",
          tone: "gold" as const,
          href: "/badges",
        }));

      if (!cancelled) {
        setNotifs([...badgeNotifs, ...messageNotifs]);
        setLoading(false);
        // Marque les badges actuellement débloqués comme vus — la prochaine
        // visite n'affichera plus que les tout nouveaux.
        saveSeenBadges(unlocked);
      }
    }
    load().catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <ul className="space-y-2.5" aria-hidden>
        {[0, 1].map((i) => (
          <li
            key={i}
            className="flex animate-pulse gap-3 rounded-2xl border border-ink/10 bg-bg-card p-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-ink/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-ink/10" />
              <div className="h-2.5 w-3/4 rounded bg-ink/5" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (notifs.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card p-8 text-center">
        <div className="text-4xl">📭</div>
        <p className="mt-2 font-display text-lg font-black text-ink">
          Rien à signaler
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Quand tu auras des nouveaux messages ou des badges débloqués, ça
          s&apos;affichera ici.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {notifs.map((n) => (
        <li key={n.id}>
          <Link
            href={n.href}
            className="flex gap-3 rounded-2xl border border-ink/10 bg-bg-card p-4 transition hover:border-ink/25"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${toneBg(n.tone)}`}
            >
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-display text-sm font-black text-ink">
                  {n.title}
                </p>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                  {n.when}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[13px] leading-relaxed text-ink-muted">
                {n.body}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function toneBg(tone: Notif["tone"]) {
  switch (tone) {
    case "lime":
      return "bg-lime/15 text-lime";
    case "gold":
      return "bg-gold/15 text-gold";
    case "sky":
      return "bg-sky/15 text-sky";
    case "mythic":
      return "bg-mythic/15 text-mythic";
  }
}
