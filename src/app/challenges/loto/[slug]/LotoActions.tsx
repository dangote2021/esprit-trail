"use client";

// ====== LotoActions ======
// Section client : déclaration "j'ai accompli le challenge" + invitation
// WhatsApp + état stocké en localStorage. Capte aussi le ?ref= des potes.

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WhatsAppShare from "@/components/dossards/WhatsAppShare";

interface Props {
  challengeId: string;
  slug: string;
  raceName: string;
  tagline: string;
  accentBtn: string; // tailwind class bg-lime / bg-peach…
  accentText: string;
  /** Le user a-t-il atteint le volume km + D+ requis sur 30j ? */
  eligible: boolean;
  /** % atteint sur le critère le plus pénalisant */
  eligibilityPercent: number;
  /** km manquants pour être éligible */
  kmRemaining: number;
  /** D+ manquants pour être éligible */
  dPlusRemaining: number;
}

const STATE_KEY_PREFIX = "esprit_loto_";
const REF_TRACK_KEY = "esprit_loto_referrals_seen";

interface StoredState {
  joined: boolean;
  done: boolean;
  joinedAt?: string;
  doneAt?: string;
  referralsCounted: number;
}

function loadState(challengeId: string): StoredState {
  if (typeof window === "undefined") return { joined: false, done: false, referralsCounted: 0 };
  try {
    const raw = window.localStorage.getItem(`${STATE_KEY_PREFIX}${challengeId}`);
    if (!raw) return { joined: false, done: false, referralsCounted: 0 };
    return JSON.parse(raw) as StoredState;
  } catch {
    return { joined: false, done: false, referralsCounted: 0 };
  }
}

function saveState(challengeId: string, s: StoredState) {
  try {
    window.localStorage.setItem(`${STATE_KEY_PREFIX}${challengeId}`, JSON.stringify(s));
  } catch {}
}

export default function LotoActions({
  challengeId,
  raceName,
  tagline,
  accentBtn,
  accentText,
  eligible,
  eligibilityPercent,
  kmRemaining,
  dPlusRemaining,
}: Props) {
  const params = useSearchParams();
  const incomingRef = params?.get("ref") || null;

  const [state, setState] = useState<StoredState>({ joined: false, done: false, referralsCounted: 0 });
  const [hydrated, setHydrated] = useState(false);

  // Hydratation depuis localStorage
  useEffect(() => {
    setState(loadState(challengeId));
    setHydrated(true);
  }, [challengeId]);

  // Si je viens d'un lien ?ref=ABC d'un pote, on lui crédite (mock client-side)
  // Stocké à part pour ne créditer qu'une fois par couple challenge/ref.
  useEffect(() => {
    if (!incomingRef) return;
    try {
      const seenRaw = window.localStorage.getItem(REF_TRACK_KEY) || "{}";
      const seen = JSON.parse(seenRaw) as Record<string, string[]>;
      const list = seen[challengeId] || [];
      if (list.includes(incomingRef)) return;
      list.push(incomingRef);
      seen[challengeId] = list;
      window.localStorage.setItem(REF_TRACK_KEY, JSON.stringify(seen));
      // En vrai backend on ping /api/referrals — ici on log juste
      console.info(`[Esprit Trail Loto] Referral ${incomingRef} crédité pour ${challengeId}`);
    } catch {}
  }, [incomingRef, challengeId]);

  const onJoin = () => {
    const next: StoredState = { ...state, joined: true, joinedAt: new Date().toISOString() };
    setState(next);
    saveState(challengeId, next);
  };

  const onDeclareDone = () => {
    const next: StoredState = { ...state, done: true, doneAt: new Date().toISOString() };
    setState(next);
    saveState(challengeId, next);
  };

  const onReset = () => {
    const next: StoredState = { joined: false, done: false, referralsCounted: 0 };
    setState(next);
    saveState(challengeId, next);
  };

  const tickets = (state.done ? 1 : 0) + state.referralsCounted;

  // Skeleton avant hydratation pour éviter mismatch SSR/client
  if (!hydrated) {
    return (
      <section className="rounded-3xl border-2 border-ink/10 bg-bg-card/60 p-5 h-40 animate-pulse" />
    );
  }

  // Etat 0 : pas éligible (volume 30j insuffisant) — gate l'inscription
  if (!eligible && !state.joined) {
    const parts: string[] = [];
    if (kmRemaining > 0) parts.push(`${kmRemaining} km`);
    if (dPlusRemaining > 0) parts.push(`${dPlusRemaining.toLocaleString("fr-FR")} m D+`);
    const remainingTxt = parts.join(" + ");

    return (
      <section className="rounded-3xl border-2 border-amber/50 bg-amber/10 p-5 space-y-3">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-amber">
            Pas encore éligible — {eligibilityPercent}%
          </div>
          <h2 className="font-display text-xl font-black text-ink">
            Va courir, on garde ta place 🥾
          </h2>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            Encore <strong className="text-ink">{remainingTxt}</strong> à
            cumuler sur les 30 derniers jours pour pouvoir t'inscrire au
            tirage. C'est exigeant — c'est le deal avec les organisateurs.
          </p>
        </div>
        <button
          disabled
          className="w-full rounded-2xl bg-ink/15 text-ink-muted py-4 font-display font-black uppercase tracking-wider cursor-not-allowed"
        >
          🔒 Inscription bloquée
        </button>
        <a
          href="/coach"
          className="block w-full rounded-2xl border-2 border-amber/40 bg-bg-card/60 py-3 text-center font-display font-black uppercase tracking-wider text-amber text-sm hover:bg-amber/10 transition"
        >
          → Demande un plan au Coach IA
        </a>
        <p className="text-center text-[10px] text-ink-dim">
          Le Coach IA te dessine 4 semaines pour passer le seuil sans te
          cramer.
        </p>
      </section>
    );
  }

  // Etat 1 : pas encore inscrit (mais éligible)
  if (!state.joined) {
    return (
      <section className="rounded-3xl border-2 border-lime/40 bg-lime/10 p-5 space-y-3">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            Étape 1 · Éligible {eligibilityPercent}%
          </div>
          <h2 className="font-display text-xl font-black text-ink">
            Je rejoins le tirage
          </h2>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            Gratuit. Tu pourras déclarer ton challenge accompli plus tard.
          </p>
        </div>
        <button
          onClick={onJoin}
          className={`w-full rounded-2xl ${accentBtn} py-4 font-display font-black uppercase tracking-wider text-bg btn-chunky tap-bounce`}
        >
          Je participe
        </button>
      </section>
    );
  }

  // Etat 2 : inscrit, pas encore done
  if (!state.done) {
    return (
      <section className="rounded-3xl border-2 border-peach/40 bg-peach/10 p-5 space-y-4">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
            Étape 2 — Cours, déclare, partage
          </div>
          <h2 className="font-display text-xl font-black text-ink">
            Tu es dans le tirage 🎫
          </h2>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">
            Plus que le challenge à accomplir. Quand c'est fait, tu déclares
            ici, on te file ton ticket.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-bg-card/70 px-3 py-2 text-xs">
          <span className="text-ink-muted">Tickets actuels</span>
          <span className={`font-display text-2xl font-black ${accentText}`}>
            {tickets}
          </span>
        </div>

        <button
          onClick={onDeclareDone}
          className={`w-full rounded-2xl ${accentBtn} py-4 font-display font-black uppercase tracking-wider text-bg btn-chunky tap-bounce`}
        >
          ✓ Challenge accompli
        </button>

        <WhatsAppShare
          challengeId={challengeId}
          raceName={raceName}
          tagline={tagline}
          ticketsBoosted={state.referralsCounted}
        />

        <button
          onClick={onReset}
          className="w-full text-[11px] text-ink-dim hover:text-ink-muted underline-offset-2 hover:underline"
        >
          Annuler ma participation
        </button>
      </section>
    );
  }

  // Etat 3 : done — tickets visibles, partage encouragé
  return (
    <section className="rounded-3xl border-2 border-lime/60 bg-gradient-to-br from-lime/15 via-peach/10 to-bg p-5 space-y-4">
      <div className="text-center">
        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
          Inscrit • Challenge accompli
        </div>
        <h2 className="mt-1 font-display text-2xl font-black text-ink">
          Tu as {tickets} ticket{tickets > 1 ? "s" : ""} 🎫
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Verdict le jour du tirage. Bonne chance.
        </p>
      </div>

      <WhatsAppShare
        challengeId={challengeId}
        raceName={raceName}
        tagline={tagline}
        ticketsBoosted={state.referralsCounted}
      />

      <button
        onClick={onReset}
        className="w-full text-[11px] text-ink-dim hover:text-ink-muted underline-offset-2 hover:underline"
      >
        Quitter le tirage
      </button>
    </section>
  );
}
