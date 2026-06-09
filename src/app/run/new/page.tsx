import Link from "next/link";

export default function NewRunPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 safe-top safe-bottom space-y-6 text-center">
      <div className="text-7xl animate-float">⏱️</div>
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Lance une sortie
        </div>
        <h1 className="mt-1 font-display text-3xl font-black leading-tight">
          Choisis ta source
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
          Tracking live, import auto via Strava, ou saisie à la main —
          à toi de voir comment tu fonctionnes.
        </p>
      </div>

      <div className="w-full space-y-3">
        {/* Tracking GPS natif Esprit Trail */}
        <Link
          href="/run/track"
          className="flex w-full items-center gap-4 rounded-xl border-2 border-lime/40 bg-lime/10 p-4 text-left transition hover:bg-lime/15 active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-lime text-bg shadow-glow-lime">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-display text-base font-black">
              Tracking Esprit Trail
            </div>
            <div className="text-xs text-ink-muted">
              GPS mobile · chrono · distance &amp; D+ live
            </div>
          </div>
          <div className="rounded-md bg-lime/30 px-2 py-1 text-[10px] font-mono font-bold text-lime">
            GO
          </div>
        </Link>

        {/* Import Strava */}
        <Link
          href="/settings/connections/strava"
          className="flex w-full items-center gap-4 rounded-xl border border-ink/15 bg-bg-card/60 p-4 text-left transition hover:border-[#fc4c02]/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fc4c02] font-display text-lg font-black text-white">
            S
          </div>
          <div className="flex-1">
            <div className="font-display text-base font-black">
              Importer depuis Strava
            </div>
            <div className="text-xs text-ink-muted">
              Tes sorties (Garmin/Coros/Suunto via Strava) remontent direct
            </div>
          </div>
        </Link>

        {/* Saisie manuelle */}
        <Link
          href="/run/manual"
          className="flex w-full items-center gap-4 rounded-xl border border-ink/15 bg-bg-card/60 p-4 text-left transition hover:border-peach/40"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-peach">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <div className="flex-1 text-left">
            <div className="font-display text-base font-black">
              Saisie manuelle
            </div>
            <div className="text-xs text-ink-muted">
              Distance, D+, terrain — pour les sorties oubliées
            </div>
          </div>
        </Link>
      </div>

      <Link
        href="/"
        className="text-xs font-mono font-bold uppercase tracking-wider text-ink-dim hover:text-lime transition"
      >
        ← Retour
      </Link>
    </main>
  );
}
