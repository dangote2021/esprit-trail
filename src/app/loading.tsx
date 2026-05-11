// ====== LOADING STATE GLOBAL ======
// Affiché pendant le streaming des Server Components. Minimal, pas agressif.

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-ping rounded-full bg-lime/30" />
        <div className="absolute inset-2 rounded-full bg-lime shadow-[0_0_18px_rgba(45,106,79,0.5)]" />
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">
        on relace les pompes…
      </p>
    </div>
  );
}
