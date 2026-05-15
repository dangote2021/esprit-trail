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

type Tab = "spot" | "race" | "plan" | "position";

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
  const [gpsState, setGpsState] = useState<"idle" | "fetching" | "denied" | "error">("idle");
  const [gpsError, setGpsError] = useState<string>("");

  function pick(token: string, label: string) {
    onAttach(token, label);
    onClose();
  }

  function sendPosition() {
    if (!("geolocation" in navigator)) {
      setGpsState("error");
      setGpsError("Le navigateur galère sur la géoloc.");
      return;
    }
    setGpsState("fetching");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        pick(`[[attach:position:${lat},${lng}]]`, `📍 Ma position`);
      },
      (err) => {
        setGpsState(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? "T'as bloqué la géoloc dans le navigateur."
            : "Le GPS galère. Réessaie en plein air.",
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
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
            { id: "position" as const, label: "📍 Ici" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-mono font-bold transition ${
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

          {tab === "position" && (
            <div className="space-y-3 py-2">
              <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-4">
                <div className="text-3xl text-center mb-2">📍</div>
                <div className="text-center text-sm font-bold mb-1">
                  Partage ta position
                </div>
                <p className="text-center text-[12px] text-ink-muted leading-relaxed mb-3">
                  Pratique pour se retrouver sur un point de RDV avant une sortie.
                  La position est partagée à l&apos;instant T, pas en temps réel.
                </p>
                {gpsState === "idle" && (
                  <button
                    type="button"
                    onClick={sendPosition}
                    className="w-full rounded-xl bg-lime py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime"
                  >
                    🛰️ Capter ma position
                  </button>
                )}
                {gpsState === "fetching" && (
                  <div className="rounded-xl border border-lime/30 bg-lime/5 p-3 text-center text-[12px] font-mono text-lime">
                    📡 Accroche du GPS…
                  </div>
                )}
                {(gpsState === "denied" || gpsState === "error") && (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-mythic/30 bg-mythic/5 p-3 text-center text-[12px] text-mythic">
                      {gpsError}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGpsState("idle");
                        setGpsError("");
                      }}
                      className="w-full rounded-xl border border-ink/15 py-2 text-[11px] font-mono font-bold uppercase text-ink-muted"
                    >
                      Réessayer
                    </button>
                  </div>
                )}
              </div>
              <p className="text-center text-[10px] font-mono text-ink-dim">
                On n&apos;envoie qu&apos;une position ponctuelle. Pas de tracking continu, pas de stockage côté serveur.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====== AttachmentCard — pour rendre les tokens dans les bubbles ======

export function renderMessageWithAttachments(body: string): React.ReactNode[] {
  // Splits "Hey check [[attach:spot:xxx]] cool" → ["Hey check ", <Card/>, " cool"]
  // Pour les positions, l'id contient une virgule (lat,lng) — pattern différent
  const regex = /\[\[attach:(spot|race|plan|position):([a-zA-Z0-9-_.,]+)\]\]/g;
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
  } else if (kind === "position") {
    // id = "lat,lng" → ouvre Google Maps avec un pin
    const [lat, lng] = id.split(",");
    label = "Ma position";
    sub = `${lat}, ${lng}`;
    emoji = "📍";
    href = `https://www.google.com/maps?q=${lat},${lng}`;
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
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block hover:opacity-80"
        onClick={(e) => e.stopPropagation()}
      >
        {inner}
      </a>
    );
  }
  return inner;
}
