import Link from "next/link";
import type { Metadata } from "next";
import {
  CONVERSATIONS,
  conversationDisplayAvatar,
  conversationDisplayName,
  formatRelativeTime,
  ME_ID,
} from "@/lib/data/messages";
import NewConversationButton from "@/components/messages/NewConversationButton";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Discute avec tes potes de trail. Échange spots, plans nutri et conseils en DM ou en groupe.",
};

export default function MessagesListPage() {
  // Trier par updatedAt desc (les conversations actives en haut)
  const sorted = [...CONVERSATIONS].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Messagerie
          </div>
          <h1 className="font-display text-2xl font-black leading-none">
            Tes conversations
          </h1>
        </div>
        <NewConversationButton />
      </header>

      {/* Intro pour groupes — créer un crew run */}
      <div className="rounded-2xl border border-lime/25 bg-lime/5 p-3 flex items-center gap-3">
        <div className="text-2xl">🤝</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-ink">
            Organise une sortie, partage un spot, file un plan nutri
          </div>
          <div className="text-[10px] text-ink-muted">
            DM 1-1 ou groupes jusqu&apos;à 20 traileurs
          </div>
        </div>
      </div>

      {/* Liste de conversations */}
      <ul className="space-y-1.5">
        {sorted.map((conv) => {
          const name = conversationDisplayName(conv);
          const avatar = conversationDisplayAvatar(conv);
          const lastMsg = conv.lastMessage;
          const isMine = lastMsg?.authorId === ME_ID;
          const hasUnread = conv.unreadCount > 0;
          return (
            <li key={conv.id}>
              <Link
                href={`/messages/${conv.id}`}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                  hasUnread
                    ? "border-lime/40 bg-lime/5 hover:bg-lime/10"
                    : "border-ink/10 bg-bg-card/60 hover:border-ink/25"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                      conv.type === "group"
                        ? "bg-violet/15 border-2 border-violet/40"
                        : "bg-bg-raised border-2 border-ink/15"
                    }`}
                  >
                    {avatar}
                  </div>
                  {conv.type === "dm" &&
                    conv.members.find((m) => m.id !== ME_ID)?.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-lime ring-2 ring-bg-card" />
                    )}
                  {conv.type === "group" && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-violet text-[8px] font-mono font-black text-bg px-1 py-0.5 ring-2 ring-bg-card">
                      {conv.members.length}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`truncate font-bold ${
                          hasUnread ? "text-ink" : "text-ink-muted"
                        }`}
                      >
                        {name}
                      </span>
                      {conv.type === "group" && (
                        <span className="shrink-0 rounded bg-violet/15 px-1 py-0.5 text-[9px] font-mono font-black uppercase text-violet">
                          groupe
                        </span>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-mono ${
                        hasUnread ? "text-lime font-bold" : "text-ink-dim"
                      }`}
                    >
                      {lastMsg ? formatRelativeTime(lastMsg.createdAt) : ""}
                    </span>
                  </div>
                  {lastMsg && (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span
                        className={`truncate text-xs ${
                          hasUnread ? "text-ink font-medium" : "text-ink-muted"
                        }`}
                      >
                        {isMine && (
                          <span className="text-ink-dim mr-1">Toi&nbsp;:</span>
                        )}
                        {lastMsg.text}
                      </span>
                      {hasUnread && (
                        <span className="shrink-0 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lime px-1.5 text-[11px] font-mono font-black text-bg">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Note backend Phase 2 */}
      <p className="text-[10px] text-ink-dim font-mono text-center pt-2">
        ⚡ Realtime Supabase en cours de branchement
      </p>
    </main>
  );
}
