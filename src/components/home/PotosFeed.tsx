"use client";

// ====== PotosFeed ======
// Feed compact "Activité des potos" affiché sur la home (item 5 P1 panel
// test). Sentiment recherché : "je rentre dans l'app, je vois ce que mes
// potes ont foutu cette semaine, ça me motive sans me culpabiliser".
//
// Implémentation MVP :
//   - mock data : POTOS_FEED dans /lib/data/potos-feed.ts
//   - réactions persistées localStorage via /lib/potos-reactions.ts
//   - scrollable horizontal : on tient bien plus d'items sans bouffer
//     l'écran (panel Camille : "j'ai pas envie de scroller des kilomètres")
//
// Pas de "Bientôt" — c'est fonctionnel : tu kiffes → le compteur monte → le
// pote est notifié (côté backend, à brancher quand Supabase activities sera
// up).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  POTOS_FEED,
  activityHook,
  activitySentence,
  formatAgo,
  type PotosActivity,
} from "@/lib/data/potos-feed";
import {
  ALL_REACTIONS,
  BASE_REACTIONS,
  getMyReactions,
  getReactionCount,
  toggleReaction,
  type Reaction,
} from "@/lib/potos-reactions";
import {
  loadComments,
  commentCount,
  addComment,
  formatCommentAgo,
  type PotoComment,
} from "@/lib/potos-comments";

// Couleur d'accent par type d'activité — pour distinguer en un clin d'œil
const KIND_ACCENT: Record<PotosActivity["kind"], { bg: string; text: string; label: string }> = {
  run: { bg: "rgba(186, 230, 124, 0.18)", text: "#406b1f", label: "SORTIE" },
  best: { bg: "rgba(255, 180, 122, 0.20)", text: "#a04a23", label: "RECORD" },
  badge: { bg: "rgba(240, 213, 122, 0.25)", text: "#7a5a1a", label: "BADGE" },
  challenge: { bg: "rgba(180, 145, 235, 0.22)", text: "#5a3c9f", label: "DÉFI" },
  race: { bg: "rgba(140, 200, 235, 0.22)", text: "#1f5e87", label: "COURSE" },
};

function PotoCard({ activity }: { activity: PotosActivity }) {
  const accent = KIND_ACCENT[activity.kind];
  const [myReactions, setMyReactions] = useState<Reaction[]>([]);
  const [count, setCount] = useState<number>(BASE_REACTIONS[activity.id] ?? 0);
  const [trayOpen, setTrayOpen] = useState(false);
  // Commentaires — panel test Léa : le feed doit créer de la conversation.
  const [comments, setComments] = useState<PotoComment[]>([]);
  const [cmtCount, setCmtCount] = useState(0);
  const [threadOpen, setThreadOpen] = useState(false);
  const [draft, setDraft] = useState("");

  // Charge l'état initial après mount (évite hydration mismatch).
  useEffect(() => {
    setMyReactions(getMyReactions(activity.id));
    setCount(getReactionCount(activity.id, BASE_REACTIONS[activity.id] ?? 0));
    setCmtCount(commentCount(activity.id));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { activityId: string };
      if (detail?.activityId !== activity.id) return;
      setMyReactions(getMyReactions(activity.id));
      setCount(getReactionCount(activity.id, BASE_REACTIONS[activity.id] ?? 0));
    };
    const onComment = (e: Event) => {
      const detail = (e as CustomEvent).detail as { activityId: string };
      if (detail?.activityId !== activity.id) return;
      setCmtCount(commentCount(activity.id));
    };
    window.addEventListener("esprit:potos:reaction", onChange);
    window.addEventListener("esprit:potos:comment", onComment);
    return () => {
      window.removeEventListener("esprit:potos:reaction", onChange);
      window.removeEventListener("esprit:potos:comment", onComment);
    };
  }, [activity.id]);

  function handleReact(r: Reaction) {
    const next = toggleReaction(activity.id, r);
    setMyReactions(next);
    setCount(getReactionCount(activity.id, BASE_REACTIONS[activity.id] ?? 0));
    // Ferme la tray après une réaction (UX rapide)
    setTrayOpen(false);
  }

  function openThread() {
    if (!threadOpen) setComments(loadComments(activity.id));
    setThreadOpen((v) => !v);
  }

  function handleSendComment() {
    const next = addComment(activity.id, draft);
    setComments(next);
    setCmtCount(next.length);
    setDraft("");
  }

  const myFirst = myReactions[0];

  return (
    <div
      className="snap-start shrink-0 w-[280px] rounded-2xl border border-ink/10 bg-bg-card/80 p-3 card-chunky relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${accent.bg} 0%, rgba(255,255,255,0.6) 75%)` }}
    >
      {/* Header user */}
      <div className="flex items-center gap-2 mb-2">
        <Link
          href={`/u/${activity.user.handle}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 border border-ink/10 text-xl"
          aria-label={`Profil de ${activity.user.name}`}
        >
          {activity.user.totem ?? activity.user.avatar}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/u/${activity.user.handle}`}
            className="font-display text-sm font-black leading-tight truncate block hover:underline"
            style={{ color: "#1b4332" }}
          >
            {activity.user.name}
          </Link>
          <div
            className="text-[10px] font-mono leading-tight"
            style={{ color: "rgba(27, 67, 50, 0.7)" }}
          >
            @{activity.user.handle} · {formatAgo(activity.agoMinutes)}
          </div>
        </div>
        <div
          className="text-[9px] font-mono font-black uppercase tracking-widest rounded-md px-1.5 py-0.5"
          style={{ background: "rgba(255,255,255,0.75)", color: accent.text }}
        >
          {accent.label}
        </div>
      </div>

      {/* Hook + sentence */}
      <div className="mb-2">
        <div
          className="font-display text-[15px] font-black leading-tight line-clamp-1"
          style={{ color: "#1b4332" }}
        >
          {activityHook(activity)}
        </div>
        <div
          className="text-[12px] leading-snug line-clamp-2"
          style={{ color: "rgba(27, 67, 50, 0.8)" }}
        >
          {activitySentence(activity)}
        </div>
      </div>

      {/* Réactions + commentaires */}
      <div className="flex items-center justify-between gap-2 relative">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTrayOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-mono font-bold transition tap-bounce"
            style={{
              background: myReactions.length > 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
              color: accent.text,
              border: `1px solid ${myReactions.length > 0 ? accent.text : "rgba(0,0,0,0.1)"}`,
            }}
            aria-label={myReactions.length > 0 ? "Modifier ta réaction" : "Réagir"}
          >
            <span aria-hidden>{myFirst ?? "🔥"}</span>
            <span>{count}</span>
          </button>
          {/* Bouton commentaires — ouvre le fil */}
          <button
            type="button"
            onClick={openThread}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-mono font-bold transition tap-bounce"
            style={{
              background: threadOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
              color: accent.text,
              border: `1px solid ${threadOpen ? accent.text : "rgba(0,0,0,0.1)"}`,
            }}
            aria-label="Commentaires"
            aria-expanded={threadOpen}
          >
            <span aria-hidden>💬</span>
            <span>{cmtCount}</span>
          </button>
        </div>

        {/* CTA contextuel selon type */}
        {activity.kind === "race" && (
          <Link
            href="/races"
            className="text-[11px] font-mono font-bold underline-offset-2 hover:underline"
            style={{ color: accent.text }}
          >
            Voir →
          </Link>
        )}
        {activity.kind === "challenge" && (
          <Link
            href="/challenges/loto"
            className="text-[11px] font-mono font-bold underline-offset-2 hover:underline"
            style={{ color: accent.text }}
          >
            Rejoindre →
          </Link>
        )}

        {/* Tray de réactions */}
        {trayOpen && (
          <div
            className="absolute bottom-full left-0 mb-1.5 flex items-center gap-1 rounded-full bg-white shadow-lg border border-ink/10 px-2 py-1 z-10"
            role="menu"
          >
            {ALL_REACTIONS.map((r) => {
              const isOn = myReactions.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleReact(r)}
                  className={`text-xl transition tap-bounce ${isOn ? "scale-110" : "opacity-60 hover:opacity-100"}`}
                  aria-label={`Réagir ${r}`}
                  aria-pressed={isOn}
                >
                  {r}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fil de commentaires — déplié au clic sur 💬 */}
      {threadOpen && (
        <div className="mt-2 space-y-2 border-t border-ink/10 pt-2">
          {comments.length === 0 && (
            <div className="text-[11px] text-ink-muted italic">
              Personne n&apos;a encore réagi. Lance la discussion 👇
            </div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/80 border border-ink/10 text-[12px]">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0 rounded-lg bg-white/70 border border-ink/8 px-2 py-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-display text-[11px] font-black"
                    style={{ color: c.isMe ? accent.text : "#1b4332" }}
                  >
                    {c.isMe ? "Toi" : c.author}
                  </span>
                  <span className="text-[9px] font-mono text-ink-dim">
                    {formatCommentAgo(c.agoMinutes)}
                  </span>
                </div>
                <div className="text-[12px] text-ink leading-snug">{c.text}</div>
              </div>
            </div>
          ))}
          {/* Input commentaire */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={draft}
              maxLength={280}
              placeholder="Écris un mot…"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendComment();
              }}
              className="flex-1 min-w-0 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[12px] text-ink placeholder:text-ink-dim focus:outline-none"
              style={{ borderColor: draft ? accent.text : undefined }}
            />
            <button
              type="button"
              onClick={handleSendComment}
              disabled={!draft.trim()}
              className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider transition tap-bounce disabled:opacity-40"
              style={{ background: accent.text, color: "#fff" }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PotosFeed() {
  // Tri par récent — copie pour ne pas muter le mock
  const items = useMemo(
    () => [...POTOS_FEED].sort((a, b) => a.agoMinutes - b.agoMinutes),
    [],
  );

  return (
    <section>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
            Activité des potos
          </div>
          <h2 className="font-display text-lg font-black leading-tight">
            Ça bouge dans la team
          </h2>
        </div>
        <Link
          href="/leaderboard"
          className="text-[11px] font-mono font-bold text-ink-muted hover:text-lime"
        >
          Ranking →
        </Link>
      </div>

      {/* Scroll horizontal — snap pour le swipe net */}
      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((a) => (
          <PotoCard key={a.id} activity={a} />
        ))}
      </div>
    </section>
  );
}
