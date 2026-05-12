// ====== /settings/account ======
// Gestion du compte : email, déconnexion, export RGPD, suppression.

import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import DangerZone from "./DangerZone";

export const metadata: Metadata = {
  title: "Compte",
  description: "Gérer ton compte Esprit Trail : email, export, suppression.",
};

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/settings/account");

  const email = user.email ?? "—";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-lg px-5 pb-24 pt-8">
      <Link
        href="/profile"
        className="mb-6 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted hover:text-ink"
      >
        ← Profil
      </Link>

      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
        Paramètres
      </p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-ink">
        Mon compte
      </h1>

      {/* Identité */}
      <section className="mt-8 rounded-2xl border-2 border-ink/15 bg-bg-card p-5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
          Identité
        </h2>
        <dl className="mt-3 space-y-2.5 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-ink-muted">Email</dt>
            <dd className="font-semibold text-ink break-all">{email}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-ink-muted">Membre depuis</dt>
            <dd className="font-semibold text-ink">{createdAt}</dd>
          </div>
        </dl>
      </section>

      {/* Shortcuts */}
      <section className="mt-6 space-y-3">
        <Link
          href="/settings/connections"
          className="flex items-center justify-between rounded-2xl border-2 border-ink/15 bg-bg-card px-5 py-4 transition hover:border-ink/30"
        >
          <div>
            <p className="text-sm font-bold text-ink">Montres & Strava</p>
            <p className="text-xs text-ink-muted">Gérer les synchros</p>
          </div>
          <span className="text-ink-muted">→</span>
        </Link>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-2xl border-2 border-ink/15 bg-bg-card px-5 py-4 text-left transition hover:border-ink/30"
          >
            <p className="text-sm font-bold text-ink">Se déconnecter</p>
            <p className="text-xs text-ink-muted">Clore la session sur cet appareil</p>
          </button>
        </form>
      </section>

      {/* RGPD */}
      <section className="mt-6 rounded-2xl border-2 border-ink/15 bg-bg-card p-5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
          Tes données (RGPD)
        </h2>

        <a
          href="/api/account/export"
          className="mt-3 flex items-center justify-between rounded-xl border border-ink/10 bg-bg px-4 py-3 transition hover:border-ink/30"
          download
        >
          <div>
            <p className="text-sm font-bold text-ink">Exporter mes données</p>
            <p className="text-xs text-ink-muted">Fichier JSON de tout ce qu'on a sur toi</p>
          </div>
          <span className="text-ink-muted">↓</span>
        </a>

        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Pour toute question sur tes données :{" "}
          <a
            href="mailto:ravito.trail.app@gmail.com"
            className="underline decoration-ink/30 underline-offset-2 hover:text-ink"
          >
            ravito.trail.app@gmail.com
          </a>
        </p>
      </section>

      {/* Danger zone */}
      <DangerZone email={email} />

      {/* Legal footer */}
      <section className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
        <Link href="/legal/cgu" className="hover:text-ink">CGU</Link>
        <span className="text-ink/20">·</span>
        <Link href="/legal/privacy" className="hover:text-ink">Confidentialité</Link>
        <span className="text-ink/20">·</span>
        <Link href="/legal/mentions" className="hover:text-ink">Mentions</Link>
      </section>
    </div>
  );
}
