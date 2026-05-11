// ====== PAGE /settings/connections/[provider] ======
// Détail d'une intégration — transparence maximale : scopes, data synced,
// sécurité, CTA connexion / déconnexion.

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROVIDERS,
  getProvider,
  getConnection,
  timeSinceSync,
} from "@/lib/data/connections";
import type { WatchBrand } from "@/lib/types";

export function generateStaticParams() {
  return PROVIDERS.map((p) => ({ provider: p.id }));
}

export default function ProviderDetailPage({
  params,
}: {
  params: { provider: string };
}) {
  const provider = getProvider(params.provider as WatchBrand);
  if (!provider) notFound();

  const conn = getConnection(provider.id);
  const isConnected = conn?.status === "connected";

  const methodLabel = {
    "oauth-bidirectional": "OAuth 2.0 bidirectionnel",
    "oauth-read": "OAuth 2.0 lecture seule",
    "fit-import": "Auto-sync + import FIT",
  }[provider.syncMethod];

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/settings/connections"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Connexion
          </div>
          <h1 className="font-display text-lg font-black leading-none">{provider.name}</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
        style={{ backgroundColor: provider.brandColor }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl font-black backdrop-blur">
            {provider.logoEmoji}
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-80">
              {methodLabel}
            </div>
            <div className="font-display text-2xl font-black leading-none">{provider.name}</div>
            <p className="mt-0.5 text-[13px] opacity-90">{provider.tagline}</p>
          </div>
        </div>
        {isConnected && (
          <div className="mt-4 rounded-xl bg-black/25 p-3 backdrop-blur">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
              <span>Connecté en tant que</span>
              <strong>{conn?.athleteName}</strong>
            </div>
            <div className="mt-1 flex items-center gap-4 text-[11px] opacity-90">
              <span>
                <strong>{conn?.syncedActivities?.toLocaleString("fr")}</strong> activités
              </span>
              <span>
                Dernière sync <strong>{timeSinceSync(conn?.lastSync)}</strong>
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Pourquoi */}
      <section className="rounded-xl border-2 border-lime/25 bg-lime/5 p-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
          Pourquoi connecter {provider.name}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink">{provider.why}</p>
      </section>

      {/* Scopes demandés — transparence */}
      <section className="space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Permissions demandées
        </div>
        <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-4 space-y-2">
          {provider.scopes.map((scope) => (
            <div key={scope} className="flex items-center gap-2 text-[12px]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
              <code className="rounded bg-bg/60 px-1.5 py-0.5 font-mono text-[11px] text-ink">
                {scope}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Données synchronisées */}
      <section className="space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Ce qu'on importe
        </div>
        <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-4 space-y-2.5">
          {provider.dataSynced.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-[13px] text-ink leading-relaxed">
              <span className="mt-1 text-peach">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fréquence */}
      <section className="rounded-xl border border-ink/10 bg-bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
              Fréquence de synchronisation
            </div>
            <div className="mt-1 font-display text-base font-black text-ink">
              {provider.frequency}
            </div>
          </div>
          <span className="text-3xl">🔄</span>
        </div>
      </section>

      {/* CTA connexion / déconnexion */}
      {!isConnected ? (
        <section className="space-y-3">
          <button
            type="button"
            className="w-full rounded-xl px-5 py-4 font-display text-base font-black uppercase tracking-wider text-white shadow-md btn-chunky"
            style={{ backgroundColor: provider.brandColor }}
          >
            + Connecter {provider.name}
          </button>
          <p className="text-center text-[11px] text-ink-muted">
            Tu seras redirigé vers {provider.name} pour autoriser Esprit Trail.
          </p>
        </section>
      ) : (
        <section className="space-y-3">
          <button
            type="button"
            className="w-full rounded-xl bg-lime py-3 font-display text-base font-black uppercase tracking-wider text-bg shadow-glow-lime"
          >
            🔄 Re-synchroniser maintenant
          </button>
          <button
            type="button"
            className="w-full rounded-xl border-2 border-mythic/40 bg-mythic/5 py-3 font-display text-sm font-black uppercase tracking-wider text-mythic transition hover:bg-mythic/10"
          >
            Déconnecter {provider.name}
          </button>
          <p className="text-center text-[11px] text-ink-muted">
            En te déconnectant, on supprime toutes les données importées depuis {provider.name} (RGPD).
          </p>
        </section>
      )}

      {/* Docs */}
      {provider.docsUrl && (
        <p className="text-center text-[11px] text-ink-muted">
          <a
            href={provider.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-lime"
          >
            Documentation officielle {provider.name} ↗
          </a>
        </p>
      )}
    </main>
  );
}
