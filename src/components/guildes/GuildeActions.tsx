"use client";

// ====== GuildeActions ======
// Toutes les actions interactives d'une page guilde : Rejoindre/Demander,
// Settings (modal Quitter), Chat de team (link), Sorties groupées (link),
// Proposer un défi (modal local).
// Persistence : localStorage (pas de schéma teams en Supabase pour l'instant).

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Guilde } from "@/lib/types";

const LS_MEMBERSHIP_KEY = "esprit_guilde_membership";
const LS_DEFIS_KEY = "esprit_guilde_defis";

type Membership = Record<string, "member" | "pending">;
type ProposedDefi = {
  guildeId: string;
  title: string;
  target: string;
  proposedAt: string;
};

function loadMembership(): Membership {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_MEMBERSHIP_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveMembership(m: Membership) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_MEMBERSHIP_KEY, JSON.stringify(m));
}

function loadDefis(): ProposedDefi[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_DEFIS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDefis(d: ProposedDefi[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_DEFIS_KEY, JSON.stringify(d));
}

// ====== JOIN BUTTON (non-membre) ======
export function GuildeJoinButton({ guilde }: { guilde: Guilde }) {
  const [state, setState] = useState<"idle" | "member" | "pending">("idle");
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    const m = loadMembership();
    if (m[guilde.id]) setState(m[guilde.id]);
  }, [guilde.id]);

  function join() {
    const m = loadMembership();
    if (guilde.joinRule === "open") {
      m[guilde.id] = "member";
      saveMembership(m);
      setState("member");
      setBumped(true);
      setTimeout(() => window.location.reload(), 800);
    } else if (guilde.joinRule === "request") {
      m[guilde.id] = "pending";
      saveMembership(m);
      setState("pending");
      setBumped(true);
    } else {
      alert("Cette team est sur invitation uniquement. Demande à un capitaine de t'inviter !");
    }
  }

  if (state === "member") {
    return (
      <div className="rounded-xl border border-lime/40 bg-lime/10 px-3 py-2 text-[11px] font-mono font-bold uppercase text-lime">
        ✓ Membre
      </div>
    );
  }
  if (state === "pending") {
    return (
      <div className="rounded-xl border border-peach/40 bg-peach/10 px-3 py-2 text-[11px] font-mono font-bold uppercase text-peach">
        Demande envoyée
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={join}
      className={`rounded-xl bg-peach px-5 py-2 text-[12px] font-mono font-black uppercase text-bg shadow-glow-peach transition ${
        bumped ? "scale-95" : "hover:scale-[1.02]"
      }`}
    >
      {guilde.joinRule === "open"
        ? "Rejoindre"
        : guilde.joinRule === "request"
        ? "Demander"
        : "Sur invitation"}
    </button>
  );
}

// ====== SETTINGS BUTTON (membre, dans le header) ======
export function GuildeSettingsButton({ guilde }: { guilde: Guilde }) {
  const [open, setOpen] = useState(false);

  function leave() {
    if (!confirm(`Quitter ${guilde.name} ? Tu pourras rejoindre plus tard si la team t'accepte.`)) return;
    const m = loadMembership();
    delete m[guilde.id];
    saveMembership(m);
    setOpen(false);
    setTimeout(() => (window.location.href = "/guildes"), 300);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-ink/15 px-2 py-1 text-[10px] font-mono text-ink-muted hover:text-peach"
        aria-label="Paramètres de la team"
      >
        ⚙️
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)} title={`Team · ${guilde.name}`}>
          <div className="space-y-3">
            <div className="rounded-lg border border-ink/10 bg-bg-raised/40 p-3 text-[12px] text-ink-muted">
              <strong className="text-ink">Capitaine</strong> :{" "}
              {guilde.members.find((m) => m.isCaptain)?.username || "—"}
              <br />
              <strong className="text-ink">Règle</strong> :{" "}
              {guilde.joinRule === "open"
                ? "ouverte"
                : guilde.joinRule === "request"
                ? "sur demande"
                : "sur invitation"}
            </div>
            <button
              type="button"
              onClick={leave}
              className="w-full rounded-xl border-2 border-mythic/40 bg-mythic/5 py-3 font-display text-sm font-black uppercase tracking-wider text-mythic hover:bg-mythic/10"
            >
              Quitter cette team
            </button>
            <p className="text-center text-[11px] text-ink-muted">
              Les paramètres avancés (renommer, kicker, changer la règle) sont réservés aux capitaines.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

// ====== ACTIONS BAR (membre) ======
export function GuildeMemberActions({ guilde }: { guilde: Guilde }) {
  const [defiOpen, setDefiOpen] = useState(false);

  return (
    <section className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/guildes/${guilde.id}/chat`}
          className="rounded-xl border border-cyan/30 bg-cyan/5 p-3 text-left hover:bg-cyan/10 transition"
        >
          <div className="text-xl">💬</div>
          <div className="mt-1 text-sm font-bold">Chat de team</div>
          <div className="text-[10px] text-ink-muted">Discute avec la team</div>
        </Link>
        <Link
          href={`/guildes/${guilde.id}/sorties`}
          className="rounded-xl border border-lime/30 bg-lime/5 p-3 text-left hover:bg-lime/10 transition"
        >
          <div className="text-xl">🗓️</div>
          <div className="mt-1 text-sm font-bold">Sorties groupées</div>
          <div className="text-[10px] text-ink-muted">Calendrier de la team</div>
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setDefiOpen(true)}
        className="w-full rounded-xl border border-peach/20 bg-bg-card/40 p-3 text-xs font-mono text-peach hover:bg-peach/5 transition"
      >
        📢 Proposer un nouveau défi de team
      </button>
      {defiOpen && (
        <DefiModal guildeId={guilde.id} onClose={() => setDefiOpen(false)} />
      )}
    </section>
  );
}

// ====== MODAL générique ======
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl border-2 border-ink/15 bg-bg p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-black text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1 text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ====== MODAL défi ======
function DefiModal({
  guildeId,
  onClose,
}: {
  guildeId: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !target.trim()) return;
    const defis = loadDefis();
    defis.unshift({
      guildeId,
      title: title.trim(),
      target: target.trim(),
      proposedAt: new Date().toISOString(),
    });
    saveDefis(defis);
    setSent(true);
    setTimeout(onClose, 1200);
  }

  return (
    <Modal title="📢 Proposer un défi" onClose={onClose}>
      {sent ? (
        <div className="rounded-xl border border-lime/30 bg-lime/10 p-4 text-center text-lime">
          ✓ Défi proposé ! Le cap' notifiera la team.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Nom du défi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. 500 D+ cumulés en mai"
              className="mt-1 w-full rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-peach focus:outline-none"
              required
              maxLength={80}
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Objectif
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="ex. 500m de D+ par membre"
              className="mt-1 w-full rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-peach focus:outline-none"
              required
              maxLength={120}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-peach py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-peach"
          >
            Envoyer au cap'
          </button>
          <p className="text-center text-[11px] text-ink-muted">
            Le capitaine validera et lancera le défi pour la team.
          </p>
        </form>
      )}
    </Modal>
  );
}
