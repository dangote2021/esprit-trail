"use client";

// ====== AttachSheet ======
// Bottom sheet pour joindre un spot, une course ou un plan nutri dans la
// messagerie. Renvoie une string formatée à insérer dans le draft, qui sera
// parsée et affichée comme card dans le message bubble.
//
// Format inséré : "[[attach:spot:tarifa-balneario]]" / "[[attach:race:ccc]]"
// "[[attach:plan:ultra-trail]]". Le ConversationThread détecte ces tokens
// au render et les remplace par <AttachmentCard>.

import { useState } from "react";
import { TRAINING_SPOTS } from "@/lib/data/training-spots";
import { RACES } from "@/lib/data/races";

type Tab = "spot" | "race" | "plan";

const PLANS = [
  { id: "ultra-trail", emoji: "🏔️", title: "Plan Ultra-Trail 100K+", desc: "12 semaines de prépa, nutri incluse" },
  { id: "marathon-trail", emoji: "🥾", title: "Plan Marathon Trail", desc: "8 semaines, 42 km montagne" },
  { id: "premier-trail", emoji: "🌱", title: "Mon premier trail", desc: "6 semaines pour le premier dossard" },
  { id: "nutri-anti-hypo", emoji: "🥤", title: "Plan nutrition anti-hypo", desc: "Pour passer le mur du 30ème" },
];

export default function AttachSheet({
  onClose,
  onAttach,
}: {
  onClose: () => void;
  onAttach: (token: string, label: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("spot");

  function pick(token: string, label: string) {
    onAttach(token, label);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl border-2 border-ink/15 bg-bg p-4 shadow-2xl safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-black uppercase tracking-wider text-ink">
            Joindre
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1 text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-3 flex gap-1 rounded-xl bg-bg-card/60 p-1">
          {[
            { id: "spot" as const, label: "🗺️ Spot" },
            { id: "race" as const, label: "🏁 Course" },
            { id: "plan" as const, label: "📋 Plan" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition ${
                tab === t.id
                  ? "bg-peach text-bg shadow-glow-peach"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {tab === "spot" &&
            TRAINING_SPOTS.slice(0, 15).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  pick(`[[attach:spot:${s.id}]]`, `🗺️ ${s.name}`)
                }
                className="flex w-full items-start gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-left hover:border-peach/40 transition"
              >
                <div className="text-2xl">{s.emoji || "🗺️"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{s.name}</div>
                  <div className="text-[11px] text-ink-muted truncate">
                    {s.location} · {s.distance_km}km · {s.elevation_m}m D+
                  </div>
                </div>
              </button>
            ))}

          {tab === "race" &&
            RACES.slice(0, 15).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() =>
                  pick(`[[attach:race:${r.id}]]`, `🏁 ${r.name}`)
                }
                className="flex w-full items-start gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-left hover:border-peach/40 transition"
              >
                <div className="text-2xl">🏁</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{r.name}</div>
                  <div className="text-[11px] text-ink-muted truncate">
                    {r.location} · {r.distance}km · {r.elevation}m D+
                  </div>
                </div>
              </button>
            ))}

          {tab === "plan" &&
            PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pick(`[[attach:plan:${p.id}]]`, `📋 ${p.title}`)}
                className="flex w-full items-start gap-3 rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-left hover:border-peach/40 transition"
              >
                <div className="text-2xl">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{p.title}</div>
                  <div className="text-[11px] text-ink-muted">{p.desc}</div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// ====== AttachmentCard — pour rendre les tokens dans les bubbles ======

export function renderMessageWithAttachments(body: string): React.ReactNode[] {
  // Splits "Hey check [[attach:spot:xxx]] cool" → ["Hey check ", <Card/>, " cool"]
  const regex = /\[\[attach:(spot|race|plan):([a-zA-Z0-9-_]+)\]\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }
    parts.push(
      <AttachmentCard key={key++} kind={match[1] as Tab} id={match[2]} />,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) {
    parts.push(body.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [body];
}

function AttachmentCard({ kind, id }: { kind: Tab; id: string }) {
  let label = "Pièce jointe";
  let sub = "";
  let emoji = "📎";
  let href = "";

  if (kind === "spot") {
    const s = TRAINING_SPOTS.find((x) => x.id === id);
    if (s) {
      label = s.name;
      sub = `${s.location} · ${s.distance_km}km`;
      emoji = s.emoji || "🗺️";
      href = `/spots/${s.id}`;
    }
  } else if (kind === "race") {
    const r = RACES.find((x) => x.id === id);
    if (r) {
      label = r.name;
      sub = `${r.location} · ${r.distance}km`;
      emoji = "🏁";
      href = `/race/${r.id}`;
    }
  } else if (kind === "plan") {
    const p = PLANS.find((x) => x.id === id);
    if (p) {
      label = p.title;
      sub = p.desc;
      emoji = p.emoji;
      href = "/coach";
    }
  }

  const inner = (
    <div className="my-1.5 flex items-start gap-2 rounded-xl border border-ink/15 bg-bg/40 p-2.5 max-w-full">
      <div className="text-xl shrink-0">{emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold leading-tight">{label}</div>
        {sub && (
          <div className="text-[10px] text-ink-muted leading-tight truncate">{sub}</div>
        )}
      </div>
      <div className="text-[10px] text-ink-muted">↗</div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80" onClick={(e) => e.stopPropagation()}>
        {inner}
      </a>
    );
  }
  return inner;
}
