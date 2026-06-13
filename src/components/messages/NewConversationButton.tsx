"use client";

// ====== NewConversationButton ======
// Bouton "Nouvelle conversation" — ouvre une modale qui permet de choisir un
// destinataire (DM) ou de créer un groupe. Backend Supabase Realtime →
// Phase 2. Pour la démo : crée la conversation en mémoire puis route
// vers /messages/<id>.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGE_USERS, ME_ID } from "@/lib/data/messages";
import { createConversation } from "@/lib/supabase/messaging";

export default function NewConversationButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"dm" | "group">("dm");
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const router = useRouter();

  const candidates = Object.values(MESSAGE_USERS).filter((u) => u.id !== ME_ID);

  function toggleSelect(id: string) {
    if (mode === "dm") {
      setSelected([id]);
    } else {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    }
  }

  async function create() {
    if (selected.length === 0) return;
    // 1. Tente la création serveur (RPC Supabase)
    const convId = await createConversation({
      type: mode,
      name: mode === "group" ? groupName.trim() || "Crew run" : undefined,
      memberIds: selected,
    });
    if (convId) {
      router.push(`/messages/${convId}`);
      setOpen(false);
      return;
    }
    // 2. Fallback démo (pas authentifié) : route vers une conv mock existante
    if (mode === "dm") {
      const userToConv: Record<string, string> = {
        "u-clem": "c-clem",
        "u-casquette": "c-casquette",
      };
      const target = userToConv[selected[0]] || "c-clem";
      router.push(`/messages/${target}`);
    } else {
      router.push(`/messages/c-crew-mercantour`);
    }
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-lime px-3 py-2 text-[11px] font-mono font-black uppercase tracking-wider text-bg shadow-glow-lime hover:scale-[1.03] active:scale-[0.97] transition"
        aria-label="Nouvelle conversation"
      >
        + Blabla
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-bg-card border-t-2 sm:border-2 border-lime/30 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="sm:hidden mx-auto h-1.5 w-12 rounded-full bg-ink/20 -mt-1" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
              Nouvelle conversation
            </div>
            <h3 className="font-display text-lg font-black text-ink">
              Avec qui tu veux discuter ?
            </h3>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="rounded-lg border border-ink/15 bg-bg-raised/60 px-2.5 py-1 text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("dm");
              setSelected(selected.slice(0, 1));
            }}
            className={`rounded-xl border-2 py-2.5 text-sm font-mono font-black uppercase tracking-wider transition ${
              mode === "dm"
                ? "border-lime bg-lime/10 text-lime"
                : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
            }`}
          >
            💬 DM 1-1
          </button>
          <button
            type="button"
            onClick={() => setMode("group")}
            className={`rounded-xl border-2 py-2.5 text-sm font-mono font-black uppercase tracking-wider transition ${
              mode === "group"
                ? "border-violet bg-violet/10 text-violet"
                : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
            }`}
          >
            👥 Groupe
          </button>
        </div>

        {/* Group name (only in group mode) */}
        {mode === "group" && (
          <div className="space-y-1.5">
            <label
              htmlFor="group-name"
              className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted"
            >
              Nom du groupe
            </label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex : Crew Pyrénées · Prépa CCC"
              maxLength={40}
              className="w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-lime/50 focus:outline-none"
            />
          </div>
        )}

        {/* Members list */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
            {mode === "dm" ? "Choisis un contact" : `Choisis les membres (${selected.length})`}
          </div>
          <ul className="space-y-1.5">
            {candidates.map((u) => {
              const isSelected = selected.includes(u.id);
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => toggleSelect(u.id)}
                    className={`w-full flex items-center gap-3 rounded-xl border-2 p-2.5 text-left transition ${
                      isSelected
                        ? "border-lime bg-lime/10"
                        : "border-ink/10 bg-bg-card/50 hover:border-ink/25"
                    }`}
                  >
                    <div className="text-2xl">{u.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-ink truncate">
                        {u.displayName}
                      </div>
                      <div className="text-[10px] font-mono text-ink-muted">
                        @{u.username}
                        {u.online && (
                          <span className="ml-2 text-lime">● en ligne</span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="font-mono text-lime text-lg">✓</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl border-2 border-ink/15 bg-bg-card/60 py-3 font-mono text-sm font-black uppercase tracking-wider text-ink-muted hover:text-ink transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={create}
            disabled={selected.length === 0 || (mode === "group" && selected.length < 2)}
            className="flex-1 rounded-xl bg-lime py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {mode === "dm" ? "Démarrer la convo" : "Créer le groupe"}
          </button>
        </div>

        <p className="text-[10px] font-mono text-ink-dim text-center pt-1">
          ⚡ Realtime Supabase en cours de branchement
        </p>
      </div>
    </div>
  );
}
