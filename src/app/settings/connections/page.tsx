// ====== PAGE /settings/connections ======
// Hub des intégrations Strava (only au lancement).
// Décision MVP (28/04/26) : pas d'intégrations natives Garmin/Coros/Suunto —
// les FIT remontent via Strava qui est déjà l'écosystème de référence.
// Objectif : donner confiance, montrer transparence RGPD, CTA connexion clair.

import Link from "next/link";
import {
  PROVIDERS,
  MY_CONNECTIONS,
  getConnection,
  timeSinceSync,
} from "@/lib/data/connections";
import type { ProviderDefinition, UserConnection } from "@/lib/data/connections";

export const metadata = {
  title: "Connexions · Esprit Trail",
};

export default function ConnectionsPage() {
  const sorted = [...PROVIDERS].sort((a, b) => a.priority - b.priority);
  const connectedCount = MY_CONNECTIONS.filter((c) => c.status === "connected").length;

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/profile"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Intégrations
          </div>
          <h1 className="font-display text-lg font-black leading-none">Plateforme</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Summary */}
      <section className="rounded-2xl border-2 border-lime/25 bg-gradient-to-br from-lime/10 via-bg-card to-bg p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime text-3xl shadow-glow-lime">
            ⚡
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
              Sync active
            </div>
            <div className="font-display text-xl font-black text-ink leading-tight">
              {connectedCount} / {PROVIDERS.length} connectés
            </div>
            <div className="text-[11px] text-ink-muted">
              Import auto des sorties + métriques physio
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi connecter — pédagogie RGPD */}
      <section className="rounded-xl border border-ink/10 bg-bg-card/40 p-4 text-[12px] text-ink-muted leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="text-base">🔐</span>
          <div>
            <strong className="text-ink">Tes données t'appartiennent.</strong> Esprit Trail
            utilise les API officielles de chaque provider. On ne stocke que le strict
            nécessaire pour tes runs et tes stats. Tu peux te déconnecter à tout
            moment — on supprime alors tout (RGPD article 17).
          </div>
        </div>
      </section>

      {/* Provider cards */}
      <section className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Connexions disponibles
        </div>
        {sorted.map((p) => {
          const conn = getConnection(p.id);
          return <ProviderCard key={p.id} provider={p} connection={conn} />;
        })}
      </section>

      {/* FAQ rapide */}
      <section className="space-y-2 rounded-xl border border-ink/10 bg-bg-card/40 p-4 text-[12px] text-ink-muted leading-relaxed">
        <div className="flex items-start gap-2">
          <span>⌚</span>
          <div>
            <strong className="text-ink">Et ma Garmin / Coros / Suunto ?</strong> Tu
            la branches déjà à Strava (la grande majorité des traileurs le font).
            Tes sorties remontent dans Esprit Trail via Strava, sans rien re-saisir.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span>📤</span>
          <div>
            <strong className="text-ink">Publier vers Strava depuis Esprit Trail ?</strong>{" "}
            Oui — Strava supporte l'écriture bidirectionnelle, donc tes runs Esprit Trail
            (off races, FKT...) repartent vers Strava en un clic.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span>🔓</span>
          <div>
            <strong className="text-ink">Pas de Strava ?</strong> Pas de souci, tu peux
            encore enregistrer tes sorties à la main. La sync Strava est un bonus, pas
            une obligation.
          </div>
        </div>
      </section>
    </main>
  );
}

// ====== CARTE PROVIDER ======
function ProviderCard({
  provider: p,
  connection,
}: {
  provider: ProviderDefinition;
  connection?: UserConnection;
}) {
  const isConnected = connection?.status === "connected";
  const isError = connection?.status === "error";

  const methodLabel = {
    "oauth-bidirectional": "OAuth bidirectionnel",
    "oauth-read": "OAuth lecture",
    "fit-import": "Auto-sync + FIT import",
  }[p.syncMethod];

  return (
    <Link
      href={`/settings/connections/${p.id}`}
      className="block rounded-2xl border-2 border-ink/15 bg-bg-card/80 p-4 transition hover:border-lime/40 hover:shadow-glow-lime/50"
    >
      <div className="flex items-start gap-3">
        {/* Brand badge */}
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md"
          style={{ backgroundColor: p.brandColor }}
        >
          {p.logoEmoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-black text-ink">{p.name}</h3>
            {isConnected && (
              <span className="inline-flex items-center gap-1 rounded-full border border-lime/40 bg-lime/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                Connecté
              </span>
            )}
            {isError && (
              <span className="inline-flex items-center gap-1 rounded-full border border-mythic/40 bg-mythic/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-mythic">
                Erreur
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-ink-muted">{p.tagline}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex rounded-md border border-ink/15 bg-bg/40 px-1.5 py-0.5 text-[9px] font-mono uppercase text-ink-muted">
              {methodLabel}
            </span>
            <span className="inline-flex rounded-md border border-ink/15 bg-bg/40 px-1.5 py-0.5 text-[9px] font-mono uppercase text-ink-muted">
              {p.frequency}
            </span>
          </div>

          {/* Stats ou CTA selon état */}
          {isConnected && connection ? (
            <div className="mt-3 flex items-center gap-4 text-[11px]">
              <span className="text-ink-muted">
                <strong className="text-ink">
                  {connection.syncedActivities?.toLocaleString("fr") ?? "—"}
                </strong>{" "}
                activités
              </span>
              <span className="text-ink-muted">
                Sync <strong className="text-ink">{timeSinceSync(connection.lastSync)}</strong>
              </span>
            </div>
          ) : (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 rounded-lg bg-peach px-3 py-1.5 text-[11px] font-display font-black uppercase tracking-wider text-bg btn-chunky">
                + Connecter
              </span>
            </div>
          )}
        </div>

        {/* Chevron */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5 shrink-0 text-ink-dim"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}
