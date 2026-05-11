"use client";

// ====== ERROR BOUNDARY GLOBAL ======

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log côté client — en prod on pourrait brancher Sentry ici
    console.error("[Esprit Trail error boundary]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
        Ampoule cassée
      </p>
      <h1 className="mt-3 text-4xl font-black leading-tight text-ink">
        Ça a tiré dans le mollet.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">
        Un truc a cassé côté app. On a noté l'incident, on s'y met. En
        attendant, retente — ou reviens au camp de base.
      </p>

      {error.digest ? (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
          ref : {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-lime px-5 py-3 text-sm font-black uppercase tracking-wider text-bg-card shadow-[0_4px_0_#1b4332] transition active:translate-y-[3px] active:shadow-[0_1px_0_#1b4332]"
        >
          Retenter
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-bg-card px-5 py-3 text-sm font-black uppercase tracking-wider text-ink shadow-[0_4px_0_#1b4332] transition active:translate-y-[3px] active:shadow-[0_1px_0_#1b4332]"
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  );
}
