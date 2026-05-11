"use client";

// ====== DANGER ZONE ======
// Suppression définitive du compte (RGPD — droit à l'oubli).
// Demande de confirmation par saisie de l'email.

import { useState } from "react";

export default function DangerZone({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onDelete() {
    if (confirm.trim().toLowerCase() !== email.trim().toLowerCase()) {
      setErr("L'email ne correspond pas.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Suppression impossible");
      }
      // Redirect vers home — la session est déjà invalidée côté serveur
      window.location.href = "/";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border-2 border-mythic/40 bg-mythic/5 p-5">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-mythic">
        Danger zone
      </h2>

      {!open ? (
        <>
          <p className="mt-3 text-sm font-bold text-ink">Supprimer mon compte</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Effacement définitif de ton compte, tes runs, tes badges, tes teams.
            Irréversible. Fait sous 30 jours.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center gap-1 rounded-lg border-2 border-mythic px-3 py-1.5 text-xs font-black uppercase tracking-wider text-mythic transition hover:bg-mythic hover:text-bg-card"
          >
            Supprimer mon compte
          </button>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm font-bold text-ink">
            On est sûr ? Une dernière fois.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Tape ton email <strong className="text-ink">{email}</strong> pour
            confirmer. Après ça, c'est zéro retour.
          </p>

          <input
            type="email"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={email}
            className="mt-3 w-full rounded-lg border-2 border-ink/15 bg-bg-card px-3 py-2 text-sm outline-none focus:border-mythic"
          />

          {err ? (
            <p className="mt-2 text-xs text-mythic">{err}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setConfirm("");
                setErr("");
              }}
              disabled={loading}
              className="rounded-lg border-2 border-ink/20 bg-bg-card px-3 py-1.5 text-xs font-bold text-ink disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              onClick={onDelete}
              disabled={loading}
              className="rounded-lg border-2 border-mythic bg-mythic px-3 py-1.5 text-xs font-black uppercase tracking-wider text-bg-card shadow-[0_3px_0_#8b2f30] transition active:translate-y-[2px] active:shadow-[0_1px_0_#8b2f30] disabled:opacity-60"
            >
              {loading ? "Suppression…" : "Oui, supprimer"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
