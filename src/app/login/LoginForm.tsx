"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Messages d'erreur FR pour les codes remontés par /auth/callback
const ERROR_MESSAGES: Record<string, string> = {
  link_expired: "Ton lien a expiré (valable 1h). Redemande un lien frais.",
  link_used: "Ce lien a déjà été utilisé. Demande-en un nouveau.",
  link_invalid: "Lien invalide ou corrompu. Redemande-en un.",
  invalid_link: "Le lien ne contient pas toutes les infos. Redemande-en un.",
  provider_error: "Le provider (Google ?) a annulé la connexion. Retente.",
  provider_disabled:
    "Connexion Google indisponible pour le moment. Utilise le lien magique par email juste en dessous.",
  pkce_mismatch: "Problème technique (cookies ?). Retente depuis le même navigateur.",
  user_unknown: "Ce compte n'existe pas. Crée un compte d'abord.",
  server_error: "Esprit Trail a eu un bug côté serveur. Retente dans 30s.",
  auth_error: "Impossible de te connecter. Retente ou signale le bug.",
};

// Feature flag : cache le bouton Google tant que le provider n'est pas
// activé côté Supabase Dashboard. Activer via NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
// dans Vercel une fois Supabase Auth → Providers → Google configuré.
const GOOGLE_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";

export default function LoginForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/";
  const urlErrorCode = params.get("error");
  const urlErrorMsg = urlErrorCode
    ? ERROR_MESSAGES[urlErrorCode] || ERROR_MESSAGES.auth_error
    : "";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    urlErrorCode ? "error" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>(urlErrorMsg);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: mode === "signup",
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  async function handleGoogle() {
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err) {
      setStatus("error");
      // Détecte le cas "provider is not enabled" pour afficher un message
      // utile (pousser le user vers le magic link au lieu de retenter Google).
      const raw = err instanceof Error ? err.message : "Erreur Google";
      const isDisabled =
        /provider is not enabled|unsupported provider/i.test(raw);
      setErrorMsg(
        isDisabled
          ? ERROR_MESSAGES.provider_disabled
          : raw,
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border-2 border-lime/30 bg-lime/10 p-5 text-center">
        <div className="text-4xl">📬</div>
        <p className="mt-2 font-display text-lg font-black text-ink">Email envoyé</p>
        <p className="mt-1 text-sm text-ink-muted">
          Ouvre ton boîte mail et clique sur le lien magique.
          <br />
          (Pense à regarder dans les spams.)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {GOOGLE_AUTH_ENABLED && (
        <>
          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink/15 bg-bg-card px-4 py-3 font-display text-sm font-black uppercase tracking-wider text-ink hover:bg-bg-raised"
          >
            <GoogleIcon />
            Continuer avec Google
          </button>

          <div className="relative my-2 flex items-center">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              ou par email
            </span>
            <div className="h-px flex-1 bg-ink/10" />
          </div>
        </>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="traileur@exemple.fr"
            className="w-full rounded-xl border-2 border-ink/15 bg-bg-card px-4 py-3 text-base text-ink placeholder:text-ink-dim outline-none focus:border-lime focus:ring-0"
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-lime px-4 py-3 font-display text-base font-black uppercase tracking-wider text-bg-card shadow-glow-lime transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "sending" ? "Envoi en cours…" : "Recevoir le lien magique"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-ink-muted">
          Pas de mot de passe à retenir : on t&apos;envoie un lien par email,
          tu cliques, tu es connecté. Le lien est valable 1h.
        </p>
      </form>

      {status === "error" && errorMsg && (
        <div className="rounded-lg border border-mythic/30 bg-mythic/10 px-3 py-2 text-xs text-mythic">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16.3 4.5 9.7 8.7 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5.1 0 9.8-2 13.3-5.1l-6.1-5.2C29.3 34.5 26.8 35.5 24 35.5c-5.2 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.3 16.3 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.1 5.2c-.4.4 6.4-4.7 6.4-14.7 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
