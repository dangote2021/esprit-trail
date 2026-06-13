"use client";

// ====== TrailIndices ======
// Bloc UTMB Index + ITRA Performance Index du profil. Aucune donnée mock :
// l'utilisateur saisit lui-même ses vrais index (depuis son compte UTMB /
// ITRA officiel). Profil neuf = encart d'invitation. Stockage localStorage.

import { useEffect, useState } from "react";
import {
  loadIndices,
  saveIndices,
  hasAnyIndex,
  INDICES_EVENT,
  EMPTY_INDICES,
  type TrailIndices as Indices,
  type UtmbCategory,
} from "@/lib/trail-indices";

const CATS: UtmbCategory[] = ["XS", "S", "M", "L", "XL"];

function parseField(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = Math.round(Number(t));
  if (Number.isNaN(n) || n < 0) return null;
  return Math.min(1000, n);
}

export default function TrailIndices() {
  const [mounted, setMounted] = useState(false);
  const [indices, setIndices] = useState<Indices>(EMPTY_INDICES);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Indices>(EMPTY_INDICES);

  useEffect(() => {
    setMounted(true);
    setIndices(loadIndices());
    const refresh = () => setIndices(loadIndices());
    window.addEventListener(INDICES_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(INDICES_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) return null;

  const filled = hasAnyIndex(indices);

  function startEdit() {
    setDraft({ ...indices, cat: { ...indices.cat } });
    setEditing(true);
  }

  function commit() {
    saveIndices(draft);
    setIndices(draft);
    setEditing(false);
  }

  // ===== Mode édition =====
  if (editing) {
    return (
      <section className="rounded-2xl border border-cyan/30 bg-bg-card p-4 space-y-4">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Tes index UTMB & ITRA
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan">
            UTMB Runner Index
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={1000}
            value={draft.utmb ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, utmb: parseField(e.target.value) })
            }
            placeholder="ex : 625"
            className="mt-1 w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
            Détail UTMB par catégorie (facultatif)
          </div>
          <div className="mt-1.5 grid grid-cols-5 gap-1.5">
            {CATS.map((c) => (
              <div key={c}>
                <div className="text-center text-[9px] font-mono text-ink-dim">
                  {c}
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1000}
                  value={draft.cat[c] ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      cat: { ...draft.cat, [c]: parseField(e.target.value) },
                    })
                  }
                  placeholder="—"
                  className="w-full rounded-md border border-ink/15 bg-bg px-1 py-1.5 text-center font-mono text-xs text-ink outline-none focus:border-cyan"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-violet">
            ITRA Performance Index
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={1000}
            value={draft.itra ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, itra: parseField(e.target.value) })
            }
            placeholder="ex : 612"
            className="mt-1 w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-violet"
          />
        </div>

        <p className="text-[10px] text-ink-dim leading-relaxed">
          Reporte ici tes vrais index, depuis ton compte UTMB ou ITRA
          officiel. Tu peux les laisser vides — pas de chiffre inventé.
        </p>

        <div className="flex gap-2">
          <button
            onClick={commit}
            className="flex-1 rounded-lg bg-cyan px-4 py-2 font-display text-sm font-black uppercase tracking-wider text-bg"
          >
            Enregistrer
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border border-ink/15 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink-muted"
          >
            Annuler
          </button>
        </div>
      </section>
    );
  }

  // ===== Profil neuf — aucun index renseigné =====
  if (!filled) {
    return (
      <button
        onClick={startEdit}
        className="w-full rounded-2xl border-2 border-dashed border-cyan/40 bg-cyan/5 p-5 text-center transition hover:border-cyan/60"
      >
        <div className="text-3xl">📇</div>
        <div className="mt-2 font-display text-base font-black text-ink">
          Tes index UTMB & ITRA
        </div>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Renseigne tes vrais index officiels — ils s&apos;afficheront sur
          ton profil et serviront de repère pour viser tes courses.
        </p>
        <span className="mt-3 inline-block rounded-lg bg-cyan px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-bg">
          + Ajouter mes index
        </span>
      </button>
    );
  }

  // ===== Affichage des index renseignés =====
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Index UTMB & ITRA
        </div>
        <button
          onClick={startEdit}
          className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan hover:underline"
        >
          ✎ Modifier
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 to-bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet font-display text-sm font-black text-bg">
              U
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
              UTMB Index
            </div>
          </div>
          <div className="mt-2 font-display text-4xl font-black text-cyan">
            {indices.utmb ?? "—"}
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-muted">
            Runner Index global
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {CATS.map((cat) => {
              const v = indices.cat[cat];
              return (
                <div key={cat} className="text-center">
                  <div className="text-[9px] font-mono text-ink-dim">{cat}</div>
                  <div className="text-[11px] font-mono font-bold text-ink">
                    {v != null && v > 0 ? v : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/10 to-bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-peach font-display text-sm font-black text-bg">
              I
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet">
              ITRA
            </div>
          </div>
          <div className="mt-2 font-display text-4xl font-black text-violet">
            {indices.itra ?? "—"}
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-muted">
            Performance Index / 1000
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-raised">
            <div
              className="h-full rounded-full bg-violet"
              style={{
                width: `${((indices.itra ?? 0) / 1000) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-dim">
            Saisi manuellement
          </div>
        </div>
      </div>
    </section>
  );
}
