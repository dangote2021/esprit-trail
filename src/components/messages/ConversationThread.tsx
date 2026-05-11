"use client";

// ====== ConversationThread ======
// Thread complet : header, scrollable messages list, composer en bas fixe.
// Mock state (useState pour le compositeur). Persistance localStorage (clé
// par conversation) pour que les messages envoyés survivent au refresh.
// Backend Supabase Realtime → Phase 2.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import { getUser, ME_ID } from "@/lib/data/messages";

function loadDraftMessages(conversationId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(
      `esprit_msg_draft_${conversationId}`,
    );
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDraftMessages(conversationId: string, msgs: Message[]) {
  try {
    window.localStorage.setItem(
      `esprit_msg_draft_${conversationId}`,
      JSON.stringify(msgs),
    );
  } catch {
    /* ignore */
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export default function ConversationThread({
  conversationId,
  conversationName,
  conversationAvatar,
  type,
  memberCount,
  description,
  initialMessages,
}: {
  conversationId: string;
  conversationName: string;
  conversationAvatar: string;
  type: "dm" | "group";
  memberCount: number;
  description?: string;
  initialMessages: Message[];
}) {
  const [hydrated, setHydrated] = useState(false);
  const [extraMessages, setExtraMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
    setExtraMessages(loadDraftMessages(conversationId));
  }, [conversationId]);

  const allMessages = useMemo(() => {
    return [...initialMessages, ...extraMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [initialMessages, extraMessages]);

  // Auto-scroll en bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      authorId: ME_ID,
      text,
      createdAt: new Date().toISOString(),
      status: "delivered",
    };
    const next = [...extraMessages, msg];
    setExtraMessages(next);
    saveDraftMessages(conversationId, next);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Cmd/Ctrl + Enter pour envoyer (sans nouvelle ligne)
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  }

  // Groupe les messages par jour pour insérer des séparateurs
  const grouped: Array<{ day: string; messages: Message[] }> = useMemo(() => {
    const map = new Map<string, Message[]>();
    for (const m of allMessages) {
      const key = new Date(m.createdAt).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries()).map(([key, msgs]) => ({
      day: dayLabel(msgs[0].createdAt),
      messages: msgs,
    }));
  }, [allMessages]);

  return (
    <main className="mx-auto max-w-lg pb-32 flex flex-col min-h-screen">
      {/* Header sticky */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-bg-card/95 backdrop-blur safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/messages"
            className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
            aria-label="Retour aux conversations"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${
              type === "group"
                ? "bg-violet/15 border-2 border-violet/40"
                : "bg-bg-raised border-2 border-ink/15"
            }`}
          >
            {conversationAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-display text-base font-black text-ink">
                {conversationName}
              </h1>
              {type === "group" && (
                <span className="rounded bg-violet/15 px-1.5 py-0.5 text-[9px] font-mono font-black uppercase text-violet">
                  groupe
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono text-ink-muted truncate">
              {type === "group"
                ? `${memberCount} traileurs`
                : "En ligne il y a peu"}
            </div>
          </div>
          <button
            className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-ink transition"
            aria-label="Options"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
        {type === "group" && description && (
          <p className="px-4 pb-2 text-[11px] text-ink-muted leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Messages */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {grouped.map((group, gi) => (
          <div key={gi} className="space-y-2">
            {/* Day separator */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-ink/10" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-dim">
                {group.day}
              </span>
              <div className="flex-1 h-px bg-ink/10" />
            </div>
            {group.messages.map((m, idx) => {
              const isMe = m.authorId === ME_ID;
              const author = getUser(m.authorId);
              const prevSameAuthor =
                idx > 0 && group.messages[idx - 1].authorId === m.authorId;
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <div className="w-7 shrink-0">
                      {!prevSameAuthor && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-raised text-sm">
                          {author?.avatar || "👤"}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`flex flex-col max-w-[78%] ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    {!isMe && !prevSameAuthor && type === "group" && (
                      <div className="text-[10px] font-mono font-bold text-ink-muted mb-0.5 px-2">
                        {author?.displayName || "?"}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        isMe
                          ? "bg-lime text-bg rounded-tr-md"
                          : "bg-bg-card border border-ink/10 text-ink rounded-tl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {m.text}
                      </div>
                      {m.attachment && (
                        <Link
                          href={m.attachment.href}
                          className={`mt-2 flex items-start gap-2 rounded-xl border p-2 transition ${
                            isMe
                              ? "border-bg/30 bg-bg/10 hover:bg-bg/20"
                              : "border-ink/15 bg-bg-raised/60 hover:bg-bg-raised"
                          }`}
                        >
                          <span className="text-xl shrink-0">
                            {m.attachment.type === "spot"
                              ? "📍"
                              : m.attachment.type === "race"
                                ? "🏁"
                                : m.attachment.type === "nutri-plan"
                                  ? "🍎"
                                  : "🏃"}
                          </span>
                          <div className="min-w-0">
                            <div
                              className={`text-xs font-black truncate ${
                                isMe ? "text-bg" : "text-ink"
                              }`}
                            >
                              {m.attachment.title}
                            </div>
                            {m.attachment.subtitle && (
                              <div
                                className={`text-[10px] truncate ${
                                  isMe ? "text-bg/80" : "text-ink-muted"
                                }`}
                              >
                                {m.attachment.subtitle}
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-mono shrink-0 self-center ${
                              isMe ? "text-bg/70" : "text-ink-dim"
                            }`}
                          >
                            →
                          </span>
                        </Link>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-ink-dim mt-0.5 px-2 flex items-center gap-1">
                      <span>{formatTime(m.createdAt)}</span>
                      {isMe && m.status === "read" && <span>✓✓</span>}
                      {isMe && m.status === "delivered" && <span>✓</span>}
                      {isMe && m.status === "sending" && <span>…</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Composer fixe en bas */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-bg-card/95 backdrop-blur safe-bottom">
        <div className="mx-auto max-w-lg px-3 py-2 flex items-end gap-2">
          <button
            type="button"
            className="rounded-full border border-ink/15 bg-bg-raised/60 p-2 text-ink-muted hover:text-lime hover:border-lime/40 transition"
            aria-label="Joindre un spot, une course ou un plan nutri"
            title="Joindre"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hydrated
                ? type === "group"
                  ? "Message au groupe…"
                  : `Message à ${conversationName}…`
                : "Chargement…"
            }
            rows={1}
            maxLength={2000}
            disabled={!hydrated}
            className="flex-1 resize-none rounded-2xl border border-ink/15 bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-lime/40 focus:outline-none max-h-32"
            style={{ minHeight: "2.5rem" }}
          />
          <button
            type="button"
            onClick={send}
            disabled={!hydrated || !draft.trim()}
            className="rounded-full bg-lime p-2.5 text-bg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.05] active:scale-[0.95] transition"
            aria-label="Envoyer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
