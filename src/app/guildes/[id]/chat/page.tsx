"use client";

// ====== /guildes/[id]/chat — Chat de team ======
// Persistence locale (localStorage) en attendant un schéma Supabase
// pour les conversations de team. Charge les messages au mount, les écrit
// au send. Capitaine et membres sont récupérés depuis les mock data.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { getGuilde } from "@/lib/data/guildes";

type TeamMessage = {
  id: string;
  guildeId: string;
  authorName: string;
  authorAvatar: string;
  isMe: boolean;
  body: string;
  sentAt: string;
};

const LS_KEY = "esprit_guilde_chat";

function loadAll(): Record<string, TeamMessage[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(d: Record<string, TeamMessage[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(d));
}

function seedFor(guildeId: string, captainName: string, captainAvatar: string): TeamMessage[] {
  const now = Date.now();
  return [
    {
      id: "seed-1",
      guildeId,
      authorName: captainName,
      authorAvatar: captainAvatar,
      isMe: false,
      body: "Salut la team 👋 Bienvenue dans le chat. On organise notre prochaine sortie ce week-end ?",
      sentAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: "seed-2",
      guildeId,
      authorName: captainName,
      authorAvatar: captainAvatar,
      isMe: false,
      body: "Pensez à valider votre dispo dans Sorties groupées 🗓️",
      sentAt: new Date(now - 3600000).toISOString(),
    },
  ];
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function GuildeChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const guilde = getGuilde(id);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!guilde) return;
    const all = loadAll();
    let convo = all[guilde.id];
    if (!convo || convo.length === 0) {
      const cap = guilde.members.find((m) => m.isCaptain) || guilde.members[0];
      convo = seedFor(guilde.id, cap?.username || "Cap", cap?.avatar || "🏔️");
      all[guilde.id] = convo;
      saveAll(all);
    }
    setMessages(convo);
  }, [guilde]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!guilde) return notFound();

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !guilde) return;
    const me: TeamMessage = {
      id: `m-${Date.now()}`,
      guildeId: guilde.id,
      authorName: "Toi",
      authorAvatar: "🏃",
      isMe: true,
      body: text,
      sentAt: new Date().toISOString(),
    };
    const all = loadAll();
    const next = [...(all[guilde.id] || []), me];
    all[guilde.id] = next;
    saveAll(all);
    setMessages(next);
    setDraft("");
  }

  return (
    <main className="mx-auto flex h-screen max-w-lg flex-col bg-bg">
      {/* Header sticky */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink/10 bg-bg/95 px-4 py-3 backdrop-blur safe-top">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-ink/10 p-1.5 text-ink-muted hover:text-peach"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="text-2xl">{guilde.emoji}</div>
          <div className="min-w-0">
            <div className="font-display text-base font-black leading-none truncate">
              {guilde.name}
            </div>
            <div className="text-[10px] font-mono text-ink-muted">
              {guilde.memberCount} membres · Chat de team
            </div>
          </div>
        </div>
        <Link
          href={`/guildes/${guilde.id}`}
          className="rounded-lg border border-ink/10 px-2 py-1 text-[10px] font-mono text-ink-muted hover:text-peach"
        >
          Infos
        </Link>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="mt-10 text-center text-sm text-ink-muted">
            Pas encore de messages. Lance la discussion ↓
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.isMe ? "flex-row-reverse" : ""}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-card text-base">
                {m.authorAvatar}
              </div>
              <div className={`max-w-[78%] ${m.isMe ? "items-end" : "items-start"} flex flex-col`}>
                {!m.isMe && (
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted px-1">
                    {m.authorName}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.isMe
                      ? "bg-peach text-bg rounded-tr-md"
                      : "bg-bg-card text-ink rounded-tl-md"
                  }`}
                >
                  {m.body}
                </div>
                <div className="text-[10px] font-mono text-ink-dim px-1 mt-0.5">
                  {formatRelative(m.sentAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={send}
        className="border-t border-ink/10 bg-bg-card/95 px-3 py-2 backdrop-blur safe-bottom"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Message à la team…"
            className="flex-1 resize-none rounded-2xl border border-ink/15 bg-bg/60 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-peach focus:outline-none max-h-32"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="rounded-full bg-peach p-2.5 text-bg shadow-glow-peach disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Envoyer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </main>
  );
}
