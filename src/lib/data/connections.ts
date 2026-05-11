// ====== PROVIDERS DE SYNC (Strava only au lancement) ======
// Data layer pour les connexions plateforme. En MVP, état mocké —
// l'infra réelle OAuth sera branchée via Supabase Edge Functions côté backend.
//
// Décision produit (28/04/26) : on lance avec Strava uniquement. Les imports
// FIT depuis Garmin/Coros/Suunto remontent déjà via Strava (la majorité des
// traileurs y publient leurs sorties), ce qui simplifie le scope MVP. On rouvrira
// les intégrations natives Garmin/Coros/Suunto une fois la base utilisateurs
// validée — mais ce n'est plus dans le scope de la v1.

import type { WatchBrand } from "@/lib/types";

export type SyncMethod =
  | "oauth-bidirectional" // Lecture + écriture (push activités vers le provider)
  | "oauth-read" // Lecture seule
  | "fit-import"; // Upload manuel ou auto de fichiers FIT

export type ConnectionStatus = "connected" | "disconnected" | "error" | "pending";

export interface ProviderDefinition {
  id: WatchBrand;
  name: string; // "Strava"
  tagline: string; // Accroche courte
  brandColor: string; // Hex de la marque
  logoEmoji: string; // Fallback (sera remplacé par SVG officiels plus tard)
  syncMethod: SyncMethod;
  scopes: string[]; // Scopes demandés — transparence RGPD
  dataSynced: string[]; // Ce qui est importé
  frequency: string; // "Temps réel", "Toutes les 15 min", etc.
  since?: string; // Date de connexion ISO
  priority: number; // Ordre d'affichage
  docsUrl?: string;
  // Plus d'info lisible user
  why: string; // Pourquoi cette intégration vaut le coup
}

export interface UserConnection {
  providerId: WatchBrand;
  status: ConnectionStatus;
  connectedAt?: string; // ISO
  lastSync?: string; // ISO
  athleteName?: string; // Nom renvoyé par le provider
  syncedActivities?: number;
  errorMessage?: string;
}

// ====== CATALOGUE DES PROVIDERS ======
export const PROVIDERS: ProviderDefinition[] = [
  {
    id: "strava",
    name: "Strava",
    tagline: "Le réseau social du sport outdoor",
    brandColor: "#fc4c02",
    logoEmoji: "🟠",
    syncMethod: "oauth-bidirectional",
    scopes: ["read", "activity:read_all", "activity:write"],
    dataSynced: [
      "Activités passées et nouvelles (FIT importés depuis ta montre)",
      "Kudos, commentaires, followers",
      "Segments KOM/QOM",
      "Publication auto de tes runs Esprit Trail vers Strava",
    ],
    frequency: "Temps réel via webhooks",
    priority: 1,
    docsUrl: "https://developers.strava.com/docs/getting-started/",
    why: "Indispensable. Strava est le hub où tu publies tes sorties depuis ta montre (Garmin, Coros, Suunto, Apple Watch...). En te connectant à Strava, tes runs Esprit Trail remontent automatiquement et la sync bidirectionnelle publie tes runs vers Strava en un geste.",
  },
];

// ====== STATE UTILISATEUR MOCK ======
// En prod : lecture/écriture via Supabase (table user_connections).
export const MY_CONNECTIONS: UserConnection[] = [
  {
    providerId: "strava",
    status: "connected",
    connectedAt: "2025-09-14T10:15:00.000Z",
    lastSync: "2026-04-22T06:32:00.000Z",
    athleteName: "Traileur",
    syncedActivities: 142,
  },
];

// ====== HELPERS ======
export function getProvider(id: WatchBrand): ProviderDefinition | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getConnection(id: WatchBrand): UserConnection | undefined {
  return MY_CONNECTIONS.find((c) => c.providerId === id);
}

export function isConnected(id: WatchBrand): boolean {
  return getConnection(id)?.status === "connected";
}

export function connectedProviders(): ProviderDefinition[] {
  return PROVIDERS.filter((p) => isConnected(p.id));
}

/** Temps lisible depuis la dernière sync. Ex: "il y a 3 min" */
export function timeSinceSync(iso?: string): string {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.round(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.round(diff / 3600)} h`;
  return `il y a ${Math.round(diff / 86400)} j`;
}
