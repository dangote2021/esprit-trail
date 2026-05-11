"use client";

// ====== FeedbackForm ======
// Formulaire "Une idée pour Esprit Trail ?" qui ouvre le client mail de
// l'utilisateur sur mailto:esprit.trail.app@gmail.com avec le sujet et le
// corps pré-remplis.
//
// Pas de backend nécessaire — le mailto fonctionne sur tous les devices
// (mobile = Gmail / Mail iOS, desktop = client par défaut ou webmail).
// Pour un envoi serverside (sans ouvrir le client mail) → Phase 2, ajouter
// un endpoint /api/feedback qui pousse via Resend ou SMTP.

import { useState } from "react";

const TO_EMAIL = "esprit.trail.app@gmail.com";

const TOPICS: Array<{ key: string; label: string; emoji: string }> = [
  { key: "feature", label: "Idée de feature", emoji: "💡" },
  { key: "bug", label: "Bug à signaler", emoji: "🐛" },
  { key: "spot", label: "Spot à ajouter", emoji: "📍" },
  { key: "race", label: "Course à ajouter", emoji: "🏁" },
  { key: "other", label: "Autre chose", emoji: "💬" },
];

export default function FeedbackForm() {
  const [topic, setTopic] = useState<string>("feature");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [opened, setOpened] = useState(false);

  function buildMailto() {
    const topicLabel = TOPICS.find((t) => t.key === topic)?.label || "Idée";
    const subject = `[Esprit Trail · ${topicLabel}] ${title || "(sans titre)"}`;
    const lines: string[] = [];
    lines.push("Salut l'équipe Esprit Trail,");
    lines.push("");
    if (body.trim()) {
      lines.push(body.trim());
    } else {
      lines.push("(décris ton idée ici)");
    }
    lines.push("");
    lines.push("---");
    lines.push(`Catégorie : ${topicLabel}`);
    if (name.trim()) {
      lines.push(`De la part de : ${name.trim()}`);
    }
    if (typeof window !== "undefined") {
      lines.push(`Depuis : ${window.location.href}`);
    }
    const bodyText = lines.join("\n");
    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyText)}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !body.trim()) {
      return;
    }
    const href = buildMailto();
    // Ouvre le client mail
    window.location.href = href;
    setOpened(true);
  }

  return (
    <section className="rounded-2xl border-2 border-lime/40 bg-gradient-to-br from-lime/10 via-bg-card to-peach/10 p-5 card-chunky space-y-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">💡</div>
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
            On t&apos;écoute
          </div>
          <h2 className="font-display text-xl font-black leading-tight text-ink">
            Une idée pour améliorer Esprit Trail&nbsp;?
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Bugs, features manquantes, spots à ajouter — balance, on lit tout.
            Le formulaire ouvre ton appli mail directement.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Catégorie */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
            Catégorie
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TOPICS.map((t) => {
              const active = topic === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTopic(t.key)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-mono font-bold transition ${
                    active
                      ? "border-lime bg-lime/15 text-lime"
                      : "border-ink/15 bg-bg-card/40 text-ink-muted hover:text-ink"
                  }`}
                >
                  {t.emoji} {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Titre court */}
        <div className="space-y-1.5">
          <label
            htmlFor="feedback-title"
            className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted"
          >
            Titre (court)
          </label>
          <input
            id="feedback-title"
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Ajouter un mode hors-ligne pour les spots"
            className="w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-lime/50 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="feedback-body"
            className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted"
          >
            Décris ton idée
          </label>
          <textarea
            id="feedback-body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Comment ça marcherait ? Qu'est-ce que ça apporterait aux traileurs ?"
            className="w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-lime/50 focus:outline-none resize-y"
          />
        </div>

        {/* Pseudo / prénom optionnel */}
        <div className="space-y-1.5">
          <label
            htmlFor="feedback-name"
            className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted"
          >
            Pseudo / Prénom <span className="text-ink-dim">(optionnel)</span>
          </label>
          <input
            id="feedback-name"
            type="text"
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pour qu'on puisse te répondre"
            className="w-full rounded-lg border border-ink/15 bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-dim focus:border-lime/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={!title.trim() && !body.trim()}
            className="w-full rounded-xl bg-lime py-3 font-display text-sm font-black uppercase tracking-wider text-bg btn-chunky tap-bounce shadow-glow-lime disabled:opacity-40 disabled:cursor-not-allowed"
          >
            📩 Envoyer à l&apos;équipe
          </button>
          <p className="text-[10px] font-mono text-ink-dim text-center">
            Ton appli mail s&apos;ouvre avec le message pré-rempli vers{" "}
            <span className="text-ink-muted">{TO_EMAIL}</span>
          </p>
        </div>

        {opened && (
          <div className="rounded-lg border border-lime/40 bg-lime/10 px-3 py-2 text-xs text-lime">
            ✓ Ton client mail devrait s&apos;ouvrir. Si rien ne se passe,
            écris-nous directement à{" "}
            <a href={`mailto:${TO_EMAIL}`} className="underline font-bold">
              {TO_EMAIL}
            </a>
            .
          </div>
        )}
      </form>
    </section>
  );
}
