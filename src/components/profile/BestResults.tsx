"use client";

// ====== BestResults ======
// Affiche les 3 courses mythiques que l'utilisateur a faites.
// Format : Nom course (année) · distance km · temps (place)
// Ex: Diagonale des Fous 2022 · 167 km · 35h (33ème)
// User-editable inline. Stockage localStorage : esprit_best_results.

import { useEffect, useState } from "react";

const KEY = "esprit_best_results";
const MAX_RESULTS = 3;

interface BestResult {
  id: string;
  race: string;
  year: string;
  distance: string; // ex "167" ou "167 km"
  time: string; // ex "35h" ou "35h12"
  position: string; // ex "33ème" ou "3/450"
}

function emptyResult(): BestResult {
  return {
    id: Math.random().toString(36).slice(2, 9),
    race: "",
    year: "",
    distance: "",
    time: "",
    position: "",
  };
}

function loadResults(): BestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.slice(0, MAX_RESULTS);
    return [];
  } catch {
    return [];
  }
}

function saveResults(results: BestResult[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(results));
    window.dispatchEvent(new Event("esprit-best-results-update"));
  } catch (e) {
    console.error("[BestResults] storage failed", e);
  }
}

export default function BestResults() {
  const [hydrated, setHydrated] = useState(false);
  const [results, setResults] = useState<BestResult[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<BestResult>(emptyResult());

  useEffect(() => {
    setHydrated(true);
    setResults(loadResults());
  }, []);

  function startEdit(r: BestResult) {
    setDraft({ ...r });
    setEditing(r.id);
  }

  function startAdd() {
    const fresh = emptyResult();
    setDraft(fresh);
    setEditing(fresh.id);
  }

  function commitEdit() {
    // Si la ligne est vide après edit → on retire
    if (
      !draft.race.trim() &&
      !draft.year.trim() &&
      !draft.distance.trim() &&
      !draft.time.trim() &&
      !draft.position.trim()
    ) {
      setEditing(null);
      return;
    }
    const exists = results.find((r) => r.id === draft.id);
    let next: BestResult[];
    if (exists) {
      next = results.map((r) => (r.id === draft.id ? draft : r));
    } else {
      next = [...results, draft].slice(0, MAX_RESULTS);
    }
    setResults(next);
    saveResults(next);
    setEditing(null);
  }

  function cancelEdit() {
    setEditing(null);
  }

  function removeResult(id: string) {
    if (!confirm("Supprimer ce résultat ?")) return;
    const next = results.filter((r) => r.id !== id);
    setResults(next);
    saveResults(next);
  }

  if (!hydrated) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-bg-card/60 p-4">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Tes courses mythiques · TOP 3
        </div>
        <div className="mt-2 text-xs text-ink-dim italic">Chargement...</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-bg-card/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-widest text-ink-muted">
          Tes courses mythiques · TOP 3
        </div>
        <div className="text-[9px] font-mono text-ink-dim">
          {results.length}/{MAX_RESULTS}
        </div>
      </div>

      <div className="space-y-2">
        {results.map((r) =>
          editing === r.id ? (
            <EditForm
              key={r.id}
              draft={draft}
              setDraft={setDraft}
              onSave={commitEdit}
              onCancel={cancelEdit}
              onDelete={() => removeResult(r.id)}
            />
          ) : (
            <ResultRow
              key={r.id}
              result={r}
              onEdit={() => startEdit(r)}
            />
          ),
        )}

        {editing && !results.find((r) => r.id === editing) && (
          <EditForm
            draft={draft}
            setDraft={setDraft}
            onSave={commitEdit}
            onCancel={cancelEdit}
          />
        )}

        {results.length < MAX_RESULTS && !editing && (
          <button
            onClick={startAdd}
            className="block w-full rounded-xl border-2 border-dashed border-ink/15 bg-bg/40 px-3 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:border-lime/40 hover:text-lime transition"
          >
            + Ajouter une course mythique
          </button>
        )}

        {results.length === 0 && !editing && (
          <p className="text-[11px] italic text-ink-dim leading-relaxed mt-2">
            Tes 3 courses mythiques. Ex : « Diagonale des Fous 2022 · 167 km ·
            35h (33ème) ». Trail, ultra, FKT, peu importe — celles dont tu es
            fier.
          </p>
        )}
      </div>
    </section>
  );
}

function ResultRow({
  result,
  onEdit,
}: {
  result: BestResult;
  onEdit: () => void;
}) {
  return (
    <button
      onClick={onEdit}
      className="block w-full rounded-xl border border-ink/10 bg-bg-card/80 p-3 text-left hover:border-lime/40 transition group"
    >
      <div className="flex items-start gap-2">
        <div className="text-xl">🏆</div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-black text-ink leading-tight">
            {result.race} {result.year && <span className="text-ink-muted">{result.year}</span>}
          </div>
          <div className="mt-0.5 text-[11px] font-mono text-ink-muted">
            {result.distance && `${result.distance}`}
            {result.distance && result.distance.toLowerCase().includes("km")
              ? ""
              : result.distance && " km"}
            {result.time && (
              <span>
                {result.distance ? " · " : ""}
                {result.time}
              </span>
            )}
            {result.position && (
              <span className="ml-1 text-peach font-bold">
                ({result.position})
              </span>
            )}
          </div>
        </div>
        <div className="text-ink-dim opacity-0 group-hover:opacity-100 transition text-xs">
          ✎
        </div>
      </div>
    </button>
  );
}

function EditForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  onDelete,
}: {
  draft: BestResult;
  setDraft: (r: BestResult) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="rounded-xl border-2 border-lime/40 bg-lime/5 p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={draft.race}
          onChange={(e) => setDraft({ ...draft, race: e.target.value })}
          placeholder="Diagonale des Fous"
          className="col-span-2 w-full rounded-md border border-ink/15 bg-bg-card px-2 py-1.5 text-sm font-display font-bold text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
        />
        <input
          type="text"
          value={draft.year}
          onChange={(e) => setDraft({ ...draft, year: e.target.value })}
          placeholder="2022"
          className="rounded-md border border-ink/15 bg-bg-card px-2 py-1.5 text-xs font-mono text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
        />
        <input
          type="text"
          value={draft.distance}
          onChange={(e) => setDraft({ ...draft, distance: e.target.value })}
          placeholder="167 km"
          className="rounded-md border border-ink/15 bg-bg-card px-2 py-1.5 text-xs font-mono text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
        />
        <input
          type="text"
          value={draft.time}
          onChange={(e) => setDraft({ ...draft, time: e.target.value })}
          placeholder="35h12"
          className="rounded-md border border-ink/15 bg-bg-card px-2 py-1.5 text-xs font-mono text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
        />
        <input
          type="text"
          value={draft.position}
          onChange={(e) => setDraft({ ...draft, position: e.target.value })}
          placeholder="33ème"
          className="rounded-md border border-ink/15 bg-bg-card px-2 py-1.5 text-xs font-mono text-ink placeholder:text-ink-dim focus:border-lime focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 rounded-md bg-lime py-1.5 text-xs font-mono font-black uppercase tracking-wider text-bg hover:scale-[1.01] transition"
        >
          ✓ Enregistrer
        </button>
        <button
          onClick={onCancel}
          className="rounded-md border border-ink/15 bg-bg-card px-3 py-1.5 text-xs font-mono font-bold uppercase text-ink-muted hover:text-ink transition"
        >
          Annuler
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="rounded-md border border-mythic/30 bg-mythic/10 px-3 py-1.5 text-xs font-mono font-bold uppercase text-mythic hover:bg-mythic/20 transition"
            aria-label="Supprimer ce résultat"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
