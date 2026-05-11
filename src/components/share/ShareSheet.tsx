"use client";

// ====== ShareSheet ======
// Modal / bottom-sheet de partage générique réutilisable pour spot, course,
// plan nutrition, défi, etc.
//
// Canaux supportés :
// - Web Share API natif (mobile uniquement, déclenche le picker système)
// - WhatsApp (deep link wa.me)
// - SMS (sms: protocol)
// - Email (mailto: avec subject + body)
// - Twitter / X
// - Telegram
// - Copy lien (clipboard API)
//
// Usage :
//   const [open, setOpen] = useState(false);
//   <ShareSheet open={open} onClose={() => setOpen(false)}
//     title="Spot des Calanques"
//     text="Check ce spot trail incroyable près de Marseille"
//     url={`${SITE_URL}/spot/calanques`} />

import { useEffect, useState } from "react";

type ShareSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
  /** Étiquette accroche dans le header (ex: "Partager ce spot") */
  eyebrow?: string;
};

export default function ShareSheet({
  open,
  onClose,
  title,
  text,
  url,
  eyebrow = "Partager",
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const fullText = `${text} → ${url}`;
  const encodedText = encodeURIComponent(fullText);
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(`${text}\n\n${url}`);

  const channels: Array<{
    key: string;
    label: string;
    emoji: string;
    color: string;
    href?: string;
    onClick?: () => void;
  }> = [];

  if (canNativeShare) {
    channels.push({
      key: "native",
      label: "Partager…",
      emoji: "↗️",
      color: "bg-lime/15 border-lime/40 text-lime",
      onClick: async () => {
        try {
          await navigator.share({ title, text, url });
          onClose();
        } catch {
          // user cancelled
        }
      },
    });
  }

  channels.push(
    {
      key: "whatsapp",
      label: "WhatsApp",
      emoji: "💬",
      color: "bg-[#25D366]/15 border-[#25D366]/40 text-[#25D366]",
      href: `https://wa.me/?text=${encodedText}`,
    },
    {
      key: "sms",
      label: "SMS",
      emoji: "📱",
      color: "bg-cyan/15 border-cyan/40 text-cyan",
      href: `sms:?&body=${encodedText}`,
    },
    {
      key: "email",
      label: "Email",
      emoji: "📧",
      color: "bg-violet/15 border-violet/40 text-violet",
      href: `mailto:?subject=${encodedTitle}&body=${encodedBody}`,
    },
    {
      key: "telegram",
      label: "Telegram",
      emoji: "✈️",
      color: "bg-[#0088cc]/15 border-[#0088cc]/40 text-[#0088cc]",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      key: "twitter",
      label: "Twitter / X",
      emoji: "✖️",
      color: "bg-ink/10 border-ink/30 text-ink",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback : show prompt
      window.prompt("Copie ce lien :", url);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-sheet-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-bg-card border-t-2 sm:border-2 border-lime/30 shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
        {/* Drag handle */}
        <div className="sm:hidden mx-auto h-1.5 w-12 rounded-full bg-ink/20 -mt-1" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
              {eyebrow}
            </div>
            <h3
              id="share-sheet-title"
              className="font-display text-lg font-black leading-tight text-ink truncate"
            >
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-ink-muted line-clamp-2">{text}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg border border-ink/15 bg-bg-raised/60 px-2.5 py-1 text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Channels grid */}
        <div className="grid grid-cols-3 gap-2">
          {channels.map((c) => {
            const inner = (
              <div
                className={`flex flex-col items-center gap-1 rounded-xl border ${c.color} px-3 py-3 transition hover:scale-[1.02] active:scale-[0.98] tap-bounce`}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  {c.label}
                </span>
              </div>
            );
            if (c.href) {
              return (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    // close after a small delay so the link can fire
                    window.setTimeout(onClose, 200);
                  }}
                >
                  {inner}
                </a>
              );
            }
            return (
              <button
                key={c.key}
                type="button"
                onClick={c.onClick}
                className="text-left"
              >
                {inner}
              </button>
            );
          })}
        </div>

        {/* Copy link */}
        <div className="rounded-xl border border-ink/15 bg-bg-raised/40 p-3 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
            Lien à copier
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={url}
              className="flex-1 min-w-0 rounded-md border border-ink/15 bg-bg px-2 py-1.5 text-xs font-mono text-ink-muted truncate"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`rounded-md px-3 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider transition ${
                copied
                  ? "bg-lime text-bg"
                  : "border border-lime/40 text-lime hover:bg-lime/10"
              }`}
            >
              {copied ? "✓ Copié" : "Copier"}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-ink-dim text-center font-mono">
          🤝 Aide la communauté à découvrir l&apos;Esprit Trail
        </p>
      </div>
    </div>
  );
}
