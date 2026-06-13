// ====== Identity helpers ======
// Stocke le displayName + username de l'utilisateur en localStorage côté client,
// et synchronise avec Supabase `profiles` quand l'utilisateur est authentifié.
// Fallback aux valeurs mock pour les comptes démo / nouveaux comptes.

const LS_KEY = "esprit_identity";

export type StoredIdentity = {
  displayName?: string;
  username?: string;
  updatedAt?: string;
};

export function getStoredIdentity(): StoredIdentity {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setStoredIdentity(id: Partial<StoredIdentity>) {
  if (typeof window === "undefined") return;
  const next: StoredIdentity = {
    ...getStoredIdentity(),
    ...id,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearStoredIdentity() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}
