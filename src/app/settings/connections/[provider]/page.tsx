// ====== PAGE /settings/connections/[provider] ======
// Détail d'une intégration — transparence maximale : scopes, data synced,
// sécurité, CTA connexion / déconnexion.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProvider, timeSinceSync } from "@/lib/data/connections";
import { getRealConnection } from "@/lib/connections-server";
import type { WatchBrand } from "@/lib/types";
import StravaConnectedActions from "@/components/connections/StravaConnectedActions";

// Lecture du statut réel (Supabase) → rendu dynamique obligatoire.
export const dynamic = "force-dynamic";

// Messages d'erreur OAuth lisibles (le callback redirige avec ?strava_error=)
const STRAVA_ERROR_LABELS: Record<string, string> = {
  access_denied: "Tu as refusé l'autorisation sur Strava. Réessaie quand tu veux.",
  invalid_state: "La session de connexion a expiré. Relance la connexion.",
};
function readableStravaError(raw: string): string {
  return (
    STRAVA_ERROR_LABELS[raw] ||
    "La connexion à Strava a échoué. Réessaie — si ça persiste, contacte-nous."
  );
}

export default async function ProviderDetailPage({
  params,
  searchParams,
}: {
  params: { provider: string };
  searchParams?: { strava_error?: string; strava_connected?: string };
}) {
  const provider = getProvider(params.provider as WatchBrand);
  if (!provider) notFound();

  const conn = await getRealConnection(provider.id);
  const isConnected = conn.connected;

  const stravaError = searchParams?.strava_error;
  const justConnected = searchParams?.strava_connected === "1";

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

      {/* Feedback OAuth — succès / erreur après retour de Strava */}
      {justConnected && isConnected && (
        <div className="rounded-xl border-2 border-lime/40 bg-lime/10 p-3 text-center text-[13px] font-bold text-ink">
          ✓ {provider.name} connecté — tes sorties vont remonter automatiquement.
        </div>
      )}
      {stravaError && (
        <div className="rounded-xl border-2 border-mythic/40 bg-mythic/10 p-3 text-[13px] text-ink">
          <div className="font-black text-mythic">Connexion {provider.name} échouée</div>
          <p className="mt-0.5 text-ink-muted leading-relaxed">
            {readableStravaError(stravaError)}
          </p>
        </div>
      )}

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
              <span>Connecté{conn.athleteName ? " en tant que" : ""}</span>
              {conn.athleteName && <strong>{conn.athleteName}</strong>}
            </div>
            <div className="mt-1 text-[11px] opacity-90">
              Dernière sync <strong>{timeSinceSync(conn.lastSync)}</strong>
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
          {provider.id === "strava" ? (
            <a
              href={`/api/oauth/${provider.id}?from=/settings/connections/${provider.id}`}
              className="block w-full rounded-xl px-5 py-4 text-center font-display text-base font-black uppercase tracking-wider text-white shadow-md btn-chunky"
              style={{ backgroundColor: provider.brandColor }}
            >
              + Connecter {provider.name}
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full rounded-xl px-5 py-4 font-display text-base font-black uppercase tracking-wider text-white shadow-md btn-chunky opacity-60 cursor-not-allowed"
              style={{ backgroundColor: provider.brandColor }}
            >
              + Connecter {provider.name} (bientôt)
            </button>
          )}
          <p className="text-center text-[11px] text-ink-muted">
            Tu seras redirigé vers {provider.name} pour autoriser Esprit Trail.
          </p>
        </section>
      ) : (
        <section>
          {provider.id === "strava" ? (
            <StravaConnectedActions />
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                disabled
                className="w-full rounded-xl bg-lime/40 py-3 font-display text-base font-black uppercase tracking-wider text-bg/60 cursor-not-allowed"
              >
                🔄 Re-synchroniser maintenant (bientôt)
              </button>
              <button
                type="button"
                disabled
                className="w-full rounded-xl border-2 border-mythic/20 bg-mythic/5 py-3 font-display text-sm font-black uppercase tracking-wider text-mythic/60 cursor-not-allowed"
              >
                Déconnecter {provider.name} (bientôt)
              </button>
              <p className="text-center text-[11px] text-ink-muted">
                En te déconnectant, on supprime toutes les données importées depuis {provider.name} (RGPD).
              </p>
            </div>
          )}
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
