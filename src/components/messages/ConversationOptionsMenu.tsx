"use client";

// ====== ConversationOptionsMenu ======
// Menu d'options (bouton 3 points dans le header conversation).
// Actions : Bloquer l'utilisateur · Signaler un comportement · Annuler.
//
// CONFORMITÉ STORES (Apple Guideline 1.2, Google Play UGC) :
// Les apps avec messagerie user-to-user DOIVENT permettre de bloquer et
// signaler. Sinon = rejet à coup sûr.
//
// MVP : storage localStorage côté client (esprit_blocked_users array).
// Phase 2 : table Supabase `user_blocks` + `user_reports` + moderation queue.

import { useEffect, useState } from "react";
import { showToast } from "@/components/ui/Toast";

const BLOCKED_KEY = "esprit_blocked_users";
const REPORT_EMAIL = "ravito.trail.app@gmail.com";

export function loadBlockedUsers(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BLOCKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBlockedUsers(ids: string[]) {
  try {
    window.localStorage.setItem(BLOCKED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function isUserBlocked(userId: string): boolean {
  return loadBlockedUsers().includes(userId);
}

export function blockUser(userId: string) {
  const current = loadBlockedUsers();
  if (!current.includes(userId)) {
    saveBlockedUsers([...current, userId]);
  }
}

export function unblockUser(userId: string) {
  const current = loadBlockedUsers();
  saveBlockedUsers(current.filter((id) => id !== userId));
}

const REPORT_REASONS = [
  { id: "harassment", label: "Harcèlement / propos déplacés", emoji: "🚫" },
  { id: "spam", label: "Spam / publicité non sollicitée", emoji: "📢" },
  { id: "hate", label: "Discours haineux / discrimination", emoji: "⛔" },
  { id: "violence", label: "Menaces / violence", emoji: "⚠️" },
  { id: "fake", label: "Faux profil / usurpation", emoji: "🎭" },
  { id: "other", label: "Autre comportement inapproprié", emoji: "📝" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pour DM : id + nom de l'autre user. Pour groupe : null */
  targetUserId: string | null;
  targetUserName: string;
  /** Pour group : id de la conversation */
  conversationId: string;
  conversationType: "dm" | "group";
  /** Callback quand un user est bloqué (pour rafraîchir l'UI parent) */
  onBlocked?: () => void;
};

export default function ConversationOptionsMenu({
  open,
  onClose,
  targetUserId,
  targetUserName,
  conversationId,
  conversationType,
  onBlocked,
}: Props) {
  const [view, setView] = useState<"menu" | "block-confirm" | "report">("menu");
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState("");

  // Reset view quand on ferme/ouvre
  useEffect(() => {
    if (open) setView("menu");
  }, [open]);

  if (!open) return null;

  function handleBlockConfirm() {
    if (!targetUserId) return;
    blockUser(targetUserId);
    showToast(
      `✓ ${targetUserName} bloqué. Tu ne recevras plus ses messages.`,
      "success",
    );
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([15, 60, 15]);
      } catch {
        /* ignore */
      }
    }
    onBlocked?.();
    onClose();
  }

  function handleReportSubmit() {
    const reasonLabel =
      REPORT_REASONS.find((r) => r.id === reportReason)?.label || "Autre";

    const subject = `[Signalement Esprit Trail] ${reasonLabel}`;
    const body = `Bonjour l'équipe Esprit Trail,

Je signale un comportement inapproprié dans une conversation.

— Utilisateur signalé : ${targetUserName} ${targetUserId ? `(id: ${targetUserId})` : ""}
— Conversation : ${conversationId}
— Type : ${conversationType}
— Raison : ${reasonLabel}
— Détails : ${reportDetails || "(non précisé)"}

Merci de votre attention.`;

    const mailto = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (typeof window !== "undefined") {
      window.location.href = mailto;
    }

    showToast(
      "✓ Signalement envoyé. On traite chaque cas sous 48h.",
      "success",
    );

    // On bloque aussi automatiquement par sécurité
    if (targetUserId) {
      blockUser(targetUserId);
      onBlocked?.();
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-bg-card border-2 border-ink/15 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* === MENU === */}
        {view === "menu" && (
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
                  Options
                </div>
                <h3 className="font-display text-lg font-black">
                  {conversationType === "dm"
                    ? `Conversation avec ${targetUserName}`
                    : `Groupe : ${targetUserName}`}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-ink/15 bg-bg-raised/60 px-2.5 py-1 text-ink-muted hover:text-ink"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {conversationType === "dm" && targetUserId && (
                <>
                  <button
                    onClick={() => setView("block-confirm")}
                    className="flex w-full items-center gap-3 rounded-xl border-2 border-peach/40 bg-peach/5 p-3 text-left hover:bg-peach/15 transition tap-bounce"
                  >
                    <span className="text-2xl">🚫</span>
                    <div className="flex-1">
                      <div className="font-display text-sm font-black text-peach">
                        Bloquer {targetUserName}
                      </div>
                      <div className="text-[11px] text-ink-muted">
                        Tu ne recevras plus ses messages, il ne pourra plus te
                        contacter.
                      </div>
                    </div>
                    <span className="text-peach text-xl">→</span>
                  </button>

                  <button
                    onClick={() => setView("report")}
                    className="flex w-full items-center gap-3 rounded-xl border-2 border-mythic/40 bg-mythic/5 p-3 text-left hover:bg-mythic/15 transition tap-bounce"
                  >
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <div className="font-display text-sm font-black text-mythic">
                        Signaler un comportement
                      </div>
                      <div className="text-[11px] text-ink-muted">
                        Propos déplacés, harcèlement, spam… On traite chaque
                        signalement.
                      </div>
                    </div>
                    <span className="text-mythic text-xl">→</span>
                  </button>
                </>
              )}

              {conversationType === "group" && (
                <button
                  onClick={() => setView("report")}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-mythic/40 bg-mythic/5 p-3 text-left hover:bg-mythic/15 transition tap-bounce"
                >
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <div className="font-display text-sm font-black text-mythic">
                      Signaler ce groupe
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Contenu inapproprié, harcèlement…
                    </div>
                  </div>
                  <span className="text-mythic text-xl">→</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="block w-full rounded-xl border border-ink/15 bg-bg-card/60 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* === BLOCK CONFIRM === */}
        {view === "block-confirm" && targetUserId && (
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">🚫</div>
              <h3 className="font-display text-xl font-black">
                Bloquer {targetUserName} ?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Une fois bloqué :
              </p>
              <ul className="mt-2 space-y-1 text-xs text-ink text-left max-w-xs mx-auto">
                <li>• Tu ne recevras plus ses messages</li>
                <li>• Il ne pourra plus t&apos;envoyer de message</li>
                <li>• Vous ne pourrez plus voir vos profils mutuellement</li>
                <li>• Tu peux le débloquer à tout moment dans les paramètres</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleBlockConfirm}
                className="block w-full rounded-xl bg-peach py-3 text-center font-display font-black uppercase tracking-wider text-bg shadow-glow-peach btn-chunky tap-bounce"
              >
                Bloquer définitivement
              </button>
              <button
                onClick={() => setView("menu")}
                className="block w-full rounded-xl border border-ink/15 bg-bg-card/60 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
              >
                ← Retour
              </button>
            </div>
          </div>
        )}

        {/* === REPORT === */}
        {view === "report" && (
          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-mythic">
                Signaler un comportement
              </div>
              <h3 className="font-display text-lg font-black mt-0.5">
                Quelle est la raison ?
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                On traite tous les signalements sous 48h. Tu seras notifié de la
                suite donnée.
              </p>
            </div>

            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReportReason(r.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                    reportReason === r.id
                      ? "border-mythic bg-mythic/10 shadow-glow-mythic"
                      : "border-ink/15 bg-bg-card/40 hover:border-mythic/40"
                  }`}
                >
                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-sm font-bold text-ink flex-1">
                    {r.label}
                  </span>
                  {reportReason === r.id && (
                    <span className="text-mythic font-black">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted mb-1">
                Détails (optionnel)
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={3}
                placeholder="Précise ce qui s'est passé pour aider l'équipe à traiter…"
                className="w-full rounded-lg border border-ink/15 bg-bg p-2.5 text-sm text-ink placeholder:text-ink-dim resize-none focus:border-mythic outline-none"
              />
            </div>

            <div className="rounded-lg bg-bg-raised/40 p-3 text-[11px] text-ink-muted leading-relaxed">
              <strong className="text-ink">À noter</strong> : signaler bloquera
              aussi automatiquement {targetUserName} par sécurité. Tu pourras le
              débloquer plus tard si besoin.
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason}
                className="block w-full rounded-xl bg-mythic py-3 text-center font-display font-black uppercase tracking-wider text-bg shadow-glow-mythic btn-chunky tap-bounce disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Envoyer le signalement
              </button>
              <button
                onClick={() => setView("menu")}
                className="block w-full rounded-xl border border-ink/15 bg-bg-card/60 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-ink transition"
              >
                ← Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
