"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MY_RUNS, ME } from "@/lib/data/me";

type Template = "pulse" | "classic" | "gamer" | "sobre";

const TEMPLATES: {
  id: Template;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { id: "pulse", label: "Pulse", emoji: "⚡", desc: "Couleurs vives, map centrale" },
  { id: "classic", label: "Classique", emoji: "🏔️", desc: "Photo terrain + stats" },
  { id: "gamer", label: "Gamer", emoji: "🎮", desc: "XP, badges, niveau" },
  { id: "sobre", label: "Sobre", emoji: "⬛", desc: "Dark & minimal — pour les perf" },
];

export default function RunSharePage() {
  const params = useParams();
  const id = params?.id as string;
  const run = MY_RUNS.find((r) => r.id === id);
  const [template, setTemplate] = useState<Template>("pulse");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  async function copyCaption() {
    if (!run) return;
    try {
      await navigator.clipboard.writeText(captionFor(run, template));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback silencieux
    }
  }

  async function shareLink() {
    if (!run) return;
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/run/${run.id}` : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: run.title || "Ma sortie", url });
        return;
      } catch {
        // user cancelled or unsupported
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  if (!run) {
    return (
      <main className="mx-auto max-w-lg px-4 safe-top pb-6 text-center">
        <p className="mt-10 text-ink-muted">Sortie introuvable.</p>
        <Link href="/" className="mt-4 inline-block text-lime underline">
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  const durationH = Math.floor(run.duration / 3600);
  const durationM = Math.floor((run.duration % 3600) / 60);
  const durationStr =
    durationH > 0 ? `${durationH}h${durationM.toString().padStart(2, "0")}` : `${durationM}min`;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-10 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3 pt-4">
        <Link
          href={`/run/${run.id}`}
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Partage
          </div>
          <h1 className="font-display text-xl font-black leading-none">
            Montre ta sortie
          </h1>
        </div>
      </header>

      {/* Preview story 9:16 */}
      <section className="flex justify-center">
        <div
          className="relative overflow-hidden rounded-3xl border-2 border-ink/10 shadow-2xl"
          style={{ width: 280, height: 498 /* 9:16 */ }}
        >
          {template === "pulse" && <PulseTemplate run={run} durationStr={durationStr} />}
          {template === "classic" && <ClassicTemplate run={run} durationStr={durationStr} />}
          {template === "gamer" && <GamerTemplate run={run} durationStr={durationStr} />}
          {template === "sobre" && <SobreTemplate run={run} durationStr={durationStr} />}
        </div>
      </section>

      {/* Template picker */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Choisir un style
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => {
            const active = t.id === template;
            return (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-lime bg-lime/10 shadow-glow-lime"
                    : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">{t.label}</div>
                    <div className="text-[10px] text-ink-muted truncate">{t.desc}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Share actions */}
      <section className="space-y-2">
        <button
          type="button"
          disabled
          className="w-full rounded-xl bg-lime/50 py-3.5 font-black uppercase tracking-wider text-bg/70 cursor-not-allowed"
        >
          📸 Sauvegarder le visuel (bientôt)
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled
            className="rounded-xl border border-ink/10 bg-bg-card/40 p-3 text-center opacity-60 cursor-not-allowed"
          >
            <div className="text-xl">📱</div>
            <div className="text-[10px] font-mono text-ink-muted">Story IG</div>
            <div className="text-[9px] font-mono text-peach mt-0.5">bientôt</div>
          </button>
          <button
            type="button"
            disabled
            className="rounded-xl border border-ink/10 bg-bg-card/40 p-3 text-center opacity-60 cursor-not-allowed"
          >
            <div className="text-xl">🎵</div>
            <div className="text-[10px] font-mono text-ink-muted">TikTok</div>
            <div className="text-[9px] font-mono text-peach mt-0.5">bientôt</div>
          </button>
          <button
            type="button"
            onClick={shareLink}
            className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center hover:border-lime/40 transition"
          >
            <div className="text-xl">🔗</div>
            <div className="text-[10px] font-mono text-ink-muted">
              {linkCopied ? "Copié !" : "Lien"}
            </div>
          </button>
        </div>
        <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-3 text-[11px] text-ink-muted">
          💡 Le lien marche déjà ; les exports Story IG / TikTok arrivent bientôt.
        </div>
      </section>

      {/* Caption generator */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet">
          Caption suggérée
        </div>
        <div className="rounded-xl border border-violet/20 bg-bg-card/40 p-4 space-y-2">
          <p className="text-sm leading-relaxed">
            {captionFor(run, template)}
          </p>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={copyCaption}
              className="rounded-md bg-violet/20 px-2 py-1 text-[10px] font-mono font-bold text-violet hover:bg-violet/30"
            >
              {copied ? "✓ Copié !" : "📋 Copier"}
            </button>
            <button
              type="button"
              disabled
              className="rounded-md border border-ink/15 px-2 py-1 text-[10px] font-mono text-ink-muted/60 cursor-not-allowed"
            >
              🎲 Autre (bientôt)
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ====== TEMPLATES ======

function PulseTemplate({
  run,
  durationStr,
}: {
  run: (typeof MY_RUNS)[number];
  durationStr: string;
}) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-lime via-cyan to-violet p-5 text-bg flex flex-col">
      <div className="flex items-center gap-2">
        <div className="text-3xl">{ME.avatar}</div>
        <div>
          <div className="text-xs font-mono font-bold">{ME.displayName}</div>
          <div className="text-[10px] font-mono opacity-70">@{ME.username}</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-3">
        <div className="text-6xl">{run.polylinePreview}</div>
        <div className="font-display text-3xl font-black leading-tight px-2">
          {run.title}
        </div>
        <div className="text-[11px] font-mono opacity-80">📍 {run.location}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-display text-xl font-black">{run.distance}</div>
          <div className="text-[9px] font-mono opacity-70 uppercase">km</div>
        </div>
        <div>
          <div className="font-display text-xl font-black">{run.elevation}</div>
          <div className="text-[9px] font-mono opacity-70 uppercase">m D+</div>
        </div>
        <div>
          <div className="font-display text-xl font-black">{durationStr}</div>
          <div className="text-[9px] font-mono opacity-70 uppercase">temps</div>
        </div>
      </div>
      <div className="mt-3 text-center text-[10px] font-mono opacity-70">
        Esprit Trail ⚡
      </div>
    </div>
  );
}

function ClassicTemplate({
  run,
  durationStr,
}: {
  run: (typeof MY_RUNS)[number];
  durationStr: string;
}) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-bg to-bg-card text-ink flex flex-col">
      <div className="h-1/2 bg-gradient-to-br from-peach/30 via-lime/20 to-cyan/30 flex items-center justify-center">
        <div className="text-7xl">
          {run.terrain === "alpine" ? "🏔️" : run.terrain === "mountain" ? "⛰️" : "🌲"}
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col">
        <div className="font-display text-xl font-black leading-tight">
          {run.title}
        </div>
        <div className="text-[11px] font-mono text-ink-muted">📍 {run.location}</div>
        <div className="flex-1 flex items-center">
          <div className="w-full space-y-3">
            <StatRow label="Distance" value={`${run.distance} km`} />
            <StatRow label="D+" value={`${run.elevation} m`} />
            <StatRow label="Durée" value={durationStr} />
            <StatRow label="Allure" value={run.avgPace} />
          </div>
        </div>
        <div className="text-center text-[10px] font-mono text-ink-dim">
          Esprit Trail · {ME.displayName}
        </div>
      </div>
    </div>
  );
}

function GamerTemplate({
  run,
  durationStr,
}: {
  run: (typeof MY_RUNS)[number];
  durationStr: string;
}) {
  return (
    <div className="absolute inset-0 bg-bg text-ink flex flex-col p-5">
      <div className="flex items-center gap-2">
        <div className="text-3xl">{ME.avatar}</div>
        <div>
          <div className="text-xs font-mono font-bold text-lime">{ME.displayName}</div>
          <div className="text-[10px] font-mono text-lime">LVL {ME.level}</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        <div className="text-6xl animate-pulse">⚡</div>
        <div className="font-display text-2xl font-black">+{run.xpEarned} XP</div>
        <div className="text-[10px] font-mono text-lime uppercase">run completed</div>
        <div className="mt-4 rounded-xl border border-lime/40 bg-lime/5 p-3 w-full">
          <div className="text-sm font-bold">{run.title}</div>
          <div className="text-[10px] font-mono text-ink-muted">
            {run.distance}km · {run.elevation}m D+ · {durationStr}
          </div>
        </div>
        {run.badgesUnlocked.length > 0 && (
          <div className="rounded-xl bg-gold/10 border border-gold/40 p-3 w-full">
            <div className="text-[10px] font-mono text-gold uppercase">
              🏅 {run.badgesUnlocked.length} Badge{run.badgesUnlocked.length > 1 ? "s" : ""} débloqué
            </div>
          </div>
        )}
      </div>
      <div className="text-center text-[10px] font-mono text-lime">
        Esprit Trail
      </div>
    </div>
  );
}

function SobreTemplate({
  run,
  durationStr,
}: {
  run: (typeof MY_RUNS)[number];
  durationStr: string;
}) {
  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col p-6">
      <div className="text-[10px] font-mono opacity-60 tracking-widest uppercase">
        {new Date(run.date).toLocaleDateString("fr", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="font-display text-3xl font-black leading-tight">
          {run.title}
        </div>
        <div className="text-xs opacity-60">{run.location}</div>
        <div className="my-6 space-y-4">
          <div>
            <div className="font-display text-5xl font-black">{run.distance}</div>
            <div className="text-[10px] font-mono opacity-60 uppercase">km</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="font-display text-lg font-black">{run.elevation}</div>
              <div className="text-[9px] font-mono opacity-60 uppercase">m D+</div>
            </div>
            <div>
              <div className="font-display text-lg font-black">{durationStr}</div>
              <div className="text-[9px] font-mono opacity-60 uppercase">temps</div>
            </div>
            <div>
              <div className="font-display text-lg font-black">{run.avgPace}</div>
              <div className="text-[9px] font-mono opacity-60 uppercase">allure</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[9px] font-mono opacity-40 tracking-widest uppercase">
        {ME.displayName} · Esprit Trail
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink/10 pb-1.5">
      <div className="text-[10px] font-mono uppercase text-ink-muted tracking-wider">
        {label}
      </div>
      <div className="font-display text-lg font-black">{value}</div>
    </div>
  );
}

// ====== CAPTION GENERATOR ======

function captionFor(run: (typeof MY_RUNS)[number], template: Template): string {
  const base = `${run.distance}km · ${run.elevation}m D+ · ${run.title}`;
  const hashtags =
    "\n\n#trailrunning #trail #running #ultratrail #montagne #Esprit Trail";
  if (template === "gamer") {
    return `+${run.xpEarned} XP added to my journey 🔥\n${base}${hashtags}`;
  }
  if (template === "sobre") {
    return `${base}.${hashtags}`;
  }
  if (template === "classic") {
    return `Sortie du jour 🏃‍♂️\n${base}\nToujours un plaisir de sortir.${hashtags}`;
  }
  return `Ça a piqué aujourd'hui ⚡\n${base}${hashtags}`;
}
