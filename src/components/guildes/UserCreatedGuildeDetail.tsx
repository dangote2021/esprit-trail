"use client";

// ====== UserCreatedGuildeDetail ======
// Page détail pour une guilde créée par l'utilisateur via le formulaire.
// Lecture localStorage. Version simple (pas de membres mock) — l'user
// peut partager le crew avec ses potos, voir son code de partage.

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadMyGuildes, deleteMyGuilde, MY_GUILDES_EVENT, type MyGuilde } from "@/lib/my-guildes";

export default function UserCreatedGuildeDetail({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);
  const [guilde, setGuilde] = useState<MyGuilde | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const refresh = () => {
      const all = loadMyGuildes();
      setGuilde(all.find((g) => g.id === id) || null);
    };
    refresh();
    window.addEventListener(MY_GUILDES_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(MY_GUILDES_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [id]);

  function handleShare() {
    if (typeof window === "undefined" || !guilde) return;
    const url = `${window.location.origin}/guildes/${guilde.id}`;
    const text = `Rejoins le crew ${guilde.emoji} ${guilde.name} sur Esprit Trail — ${guilde.region}.`;
    if (navigator.share) {
      navigator
        .share({ title: guilde.name, text, url })
        .catch(() => {
          /* annulé */
        });
    } else {
      navigator.clipboard
        .writeText(`${text}\n${url}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          /* ignore */
        });
    }
  }

  function handleDelete() {
    if (!guilde) return;
    const ok = window.confirm(
      `Supprimer "${guilde.name}" ? Cette action est irréversible.`,
    );
    if (!ok) return;
    deleteMyGuilde(guilde.id);
    window.location.href = "/guildes";
  }

  if (!mounted) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-6">
        <div className="mt-10 rounded-2xl border-2 border-ink/10 bg-bg-card/40 p-8 text-center animate-pulse">
          Chargement…
        </div>
      </main>
    );
  }

  if (!guilde) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
        <header className="flex items-center gap-3 pt-4">
          <Link
            href="/guildes"
            className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-peach transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="font-display text-lg font-black">Crew introuvable</h1>
          </div>
          <div className="w-9" />
        </header>
        <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card/40 p-8 text-center">
          <div className="text-4xl">🥲</div>
          <p className="mt-2 text-sm text-ink-muted">
            Ce crew n&apos;existe plus ou tu n&apos;es pas sur le bon appareil.
          </p>
          <Link
            href="/guildes"
            className="mt-4 inline-block rounded-lg bg-lime px-4 py-2 font-display text-sm font-black uppercase tracking-wider text-bg"
          >
            Retour aux teams
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4">
        <Link
          href="/guildes"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-peach transition"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex-1 text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Ton crew
          </div>
          <h1 className="font-display text-lg font-black leading-none truncate">
            {guilde.name}
          </h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section className="rounded-3xl border-2 border-lime/40 bg-gradient-to-br from-lime/10 via-bg-card to-bg p-6 text-center">
        <div className="text-6xl">{guilde.emoji}</div>
        <h2 className="mt-3 font-display text-2xl font-black text-ink leading-tight">
          {guilde.name}
        </h2>
        <div className="mt-1 text-[11px] font-mono text-ink-muted">
          📍 {guilde.region} ·{" "}
          {guilde.joinRule === "open" ? "Entrée libre" : "Sur demande"}
        </div>
        {guilde.description && (
          <p className="mt-3 text-sm text-ink leading-relaxed">
            « {guilde.description} »
          </p>
        )}
      </section>

      {/* CTA partager */}
      <section className="space-y-2">
        <button
          onClick={handleShare}
          className="w-full rounded-2xl bg-lime px-5 py-3 font-display text-base font-black uppercase tracking-wider text-bg shadow-glow-lime"
        >
          📲 {copied ? "Lien copié !" : "Inviter mes potos"}
        </button>
        <p className="text-center text-[11px] text-ink-muted">
          Partage le lien par WhatsApp, Insta ou SMS. Tes potos n&apos;ont qu&apos;à
          le cliquer pour atterrir sur ton crew.
        </p>
      </section>

      {/* Stats placeholder honnête */}
      <section className="rounded-2xl border border-ink/10 bg-bg-card/60 p-5 text-center space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Stats du crew
        </div>
        <div className="font-display text-xl font-black text-ink">
          🌱 Tout neuf
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Les stats collectives (km cumulés, défis de groupe, classement
          inter-crews) s&apos;ouvrent dès que le backend teams est en ligne.
          En attendant, ton crew est créé et tu peux inviter tes potos.
        </p>
      </section>

      {/* Danger zone */}
      <section className="pt-4">
        <button
          onClick={handleDelete}
          className="w-full rounded-xl border-2 border-mythic/30 bg-mythic/5 py-3 font-display text-xs font-black uppercase tracking-wider text-mythic hover:bg-mythic/10 transition"
        >
          Supprimer ce crew
        </button>
      </section>
    </main>
  );
}
