"use client";

// ====== CreateGuildeButton ======
// Bouton + modal pour créer un crew. Plus de "BIENTÔT" : l'user remplit
// le minimum (nom, emoji, région, type d'entrée) et la team est sauvée
// dans esprit_my_guildes. Elle apparait ensuite dans la liste.
// En attendant le schéma teams Supabase, c'est local mais fonctionnel.

import { useState } from "react";
import { saveMyGuilde } from "@/lib/my-guildes";

const EMOJI_CHOICES = ["⚔️", "🏔️", "🌲", "🪨", "🔥", "⚡", "🦊", "🐺", "🦅", "🏃", "🍻", "💪", "🎯", "🌊"];

export default function CreateGuildeButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("⚔️");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [joinRule, setJoinRule] = useState<"open" | "request">("open");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !region.trim()) return;
    setSubmitting(true);
    saveMyGuilde({
      name: name.trim(),
      emoji,
      region: region.trim(),
      description: description.trim() || "Nouveau crew Esprit Trail.",
      joinRule,
      category: "bande-copains",
    });
    setOpen(false);
    setName("");
    setRegion("");
    setDescription("");
    setEmoji("⚔️");
    setJoinRule("open");
    setSubmitting(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-lime/40 bg-lime/10 px-3 py-1.5 text-[11px] font-mono font-bold uppercase text-lime hover:bg-lime/20 transition"
      >
        + Créer
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm px-4"
          onClick={() => !submitting && setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border-2 border-ink/15 bg-bg-card p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-black text-ink">
                Crée ton crew
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ink-muted hover:text-ink text-xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Nom du crew
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Lille Trail Crew"
                maxLength={40}
                required
                className="mt-1 w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-lime"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Région / coin
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ex : Nord — Lille et alentours"
                maxLength={50}
                required
                className="mt-1 w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-lime"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Emoji
              </label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {EMOJI_CHOICES.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`h-9 w-9 rounded-md border text-lg transition ${
                      emoji === e
                        ? "border-lime bg-lime/15 scale-110"
                        : "border-ink/15 bg-bg hover:border-lime/40"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Description courte (facultatif)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Le crew qui court à 6h du mat, beau temps comme mauvais."
                maxLength={120}
                rows={2}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-lime resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Comment on rejoint
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setJoinRule("open")}
                  className={`rounded-lg border-2 px-3 py-2 text-xs font-bold transition ${
                    joinRule === "open"
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-ink/15 text-ink-muted"
                  }`}
                >
                  Ouverte
                </button>
                <button
                  type="button"
                  onClick={() => setJoinRule("request")}
                  className={`rounded-lg border-2 px-3 py-2 text-xs font-bold transition ${
                    joinRule === "request"
                      ? "border-cyan bg-cyan/10 text-cyan"
                      : "border-ink/15 text-ink-muted"
                  }`}
                >
                  Sur demande
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim() || !region.trim()}
              className="w-full rounded-xl bg-lime px-4 py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer le crew
            </button>
          </form>
        </div>
      )}
    </>
  );
}
