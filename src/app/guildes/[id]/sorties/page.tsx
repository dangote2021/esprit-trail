"use client";

// ====== /guildes/[id]/sorties — Calendrier des sorties groupées ======
// Persistence localStorage. Membres peuvent proposer une sortie, indiquer
// leur dispo (oui / peut-être / non). Une seed list est créée si vide.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { getGuilde } from "@/lib/data/guildes";

type RSVP = "yes" | "maybe" | "no" | null;

type Sortie = {
  id: string;
  guildeId: string;
  title: string;
  date: string; // ISO
  location: string;
  distance: string;
  proposedBy: string;
  attendees: { name: string; rsvp: RSVP }[];
  myRsvp: RSVP;
};

const LS_KEY = "esprit_guilde_sorties";

function loadAll(): Record<string, Sortie[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(d: Record<string, Sortie[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(d));
}

function seedFor(guildeId: string, captainName: string): Sortie[] {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return [
    {
      id: "seed-1",
      guildeId,
      title: "Sortie longue dimanche",
      date: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Massif des Bauges, parking refuge",
      distance: "25 km · 1200 D+",
      proposedBy: captainName,
      attendees: [
        { name: captainName, rsvp: "yes" },
        { name: "Marine D.", rsvp: "yes" },
        { name: "Vincent K.", rsvp: "maybe" },
      ],
      myRsvp: null,
    },
    {
      id: "seed-2",
      guildeId,
      title: "Fartlek mardi soir",
      date: new Date(now + oneWeek + 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Parc de la Tête d'Or",
      distance: "10 km · plat",
      proposedBy: "Théo B.",
      attendees: [
        { name: "Théo B.", rsvp: "yes" },
        { name: "Sam C.", rsvp: "yes" },
      ],
      myRsvp: null,
    },
  ];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function GuildeSortiesPage() {
  const params = useParams();
  const id = params?.id as string;
  const guilde = getGuilde(id);
  const [sorties, setSorties] = useState<Sortie[]>([]);
  const [proposeOpen, setProposeOpen] = useState(false);

  useEffect(() => {
    if (!guilde) return;
    const all = loadAll();
    let list = all[guilde.id];
    if (!list || list.length === 0) {
      const cap = guilde.members.find((m) => m.isCaptain) || guilde.members[0];
      list = seedFor(guilde.id, cap?.username || "Cap");
      all[guilde.id] = list;
      saveAll(all);
    }
    setSorties(list);
  }, [guilde]);

  if (!guilde) return notFound();

  function setRsvp(sortieId: string, rsvp: RSVP) {
    const all = loadAll();
    const next = (all[guilde!.id] || []).map((s) => {
      if (s.id !== sortieId) return s;
      // Retirer "Toi" de attendees existants
      const filtered = s.attendees.filter((a) => a.name !== "Toi");
      // Ajouter si rsvp défini
      const attendees = rsvp
        ? [...filtered, { name: "Toi", rsvp }]
        : filtered;
      return { ...s, myRsvp: rsvp, attendees };
    });
    all[guilde!.id] = next;
    saveAll(all);
    setSorties(next);
  }

  function addSortie(title: string, location: string, distance: string, date: string) {
    const newS: Sortie = {
      id: `s-${Date.now()}`,
      guildeId: guilde!.id,
      title,
      date,
      location,
      distance,
      proposedBy: "Toi",
      attendees: [{ name: "Toi", rsvp: "yes" }],
      myRsvp: "yes",
    };
    const all = loadAll();
    const next = [newS, ...(all[guilde!.id] || [])];
    all[guilde!.id] = next;
    saveAll(all);
    setSorties(next);
    setProposeOpen(false);
  }

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-24 space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4">
        <Link
          href={`/guildes/${guilde.id}`}
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-peach transition"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex-1 text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            {guilde.name}
          </div>
          <h1 className="font-display text-lg font-black leading-none">Sorties groupées</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Liste */}
      <section className="space-y-3">
        {sorties.length === 0 ? (
          <div className="rounded-xl border border-ink/10 bg-bg-card/40 p-8 text-center text-sm text-ink-muted">
            Aucune sortie prévue. Propose la première ↓
          </div>
        ) : (
          sorties.map((s) => {
            const yes = s.attendees.filter((a) => a.rsvp === "yes").length;
            const maybe = s.attendees.filter((a) => a.rsvp === "maybe").length;
            return (
              <article
                key={s.id}
                className="rounded-2xl border border-ink/15 bg-bg-card/60 p-4 space-y-3"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
                    {formatDate(s.date)} · {formatTime(s.date)}
                  </div>
                  <h2 className="mt-0.5 font-display text-lg font-black leading-tight">
                    {s.title}
                  </h2>
                  <div className="mt-1 text-[12px] text-ink-muted">
                    📍 {s.location}
                  </div>
                  <div className="mt-0.5 text-[12px] text-ink-muted">
                    {s.distance} · proposé par <strong>{s.proposedBy}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="rounded-md bg-lime/15 px-2 py-0.5 font-bold text-lime">
                    ✓ {yes} oui
                  </span>
                  {maybe > 0 && (
                    <span className="rounded-md bg-peach/15 px-2 py-0.5 font-bold text-peach">
                      ? {maybe} peut-être
                    </span>
                  )}
                </div>

                {/* RSVP buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "yes" as const, label: "✓ Je viens", color: "lime" },
                    { v: "maybe" as const, label: "? Peut-être", color: "peach" },
                    { v: "no" as const, label: "✕ Pas dispo", color: "mythic" },
                  ].map((opt) => {
                    const active = s.myRsvp === opt.v;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setRsvp(s.id, active ? null : opt.v)}
                        className={`rounded-lg border px-2 py-1.5 text-[11px] font-mono font-bold transition ${
                          active
                            ? opt.color === "lime"
                              ? "border-lime bg-lime/20 text-lime"
                              : opt.color === "peach"
                              ? "border-peach bg-peach/20 text-peach"
                              : "border-mythic bg-mythic/20 text-mythic"
                            : "border-ink/15 bg-bg/40 text-ink-muted hover:border-ink/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* FAB Proposer */}
      <button
        type="button"
        onClick={() => setProposeOpen(true)}
        className="fixed bottom-6 right-1/2 translate-x-[calc(50%+8.5rem)] rounded-full bg-peach px-5 py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-peach hover:scale-[1.03] transition safe-bottom"
      >
        + Proposer
      </button>

      {proposeOpen && (
        <ProposeModal
          onClose={() => setProposeOpen(false)}
          onSubmit={addSortie}
        />
      )}
    </main>
  );
}

function ProposeModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (title: string, location: string, distance: string, date: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date) return;
    onSubmit(title.trim(), location.trim(), distance.trim(), new Date(date).toISOString());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl border-2 border-ink/15 bg-bg p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 font-display text-base font-black">📅 Proposer une sortie</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Nom
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Sortie longue dimanche"
              className="mt-1 w-full rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-2 text-sm focus:border-peach focus:outline-none"
              required
              maxLength={60}
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Date et heure
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-2 text-sm focus:border-peach focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Lieu de RDV
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex. Parking refuge des Bauges"
              className="mt-1 w-full rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-2 text-sm focus:border-peach focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Distance / dénivelé
            </label>
            <input
              type="text"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="ex. 25 km · 1200 D+"
              className="mt-1 w-full rounded-lg border border-ink/15 bg-bg-card/60 px-3 py-2 text-sm focus:border-peach focus:outline-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-ink/15 py-3 text-xs font-mono font-bold uppercase text-ink-muted hover:bg-bg-card/40"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-peach py-3 text-xs font-mono font-black uppercase text-bg shadow-glow-peach"
            >
              Proposer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
