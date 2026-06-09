// ====== Migration localStorage ravito_* → esprit_* ======
// Rebrand : on a renommé toutes les keys localStorage. Pour ne pas casser les
// états des users existants (wishlist, avatar, GPX uploads…), on migre au boot.
// Idempotent : si déjà migré, ne fait rien.

const MIGRATION_FLAG_KEY = "esprit_migration_v1_done";

/**
 * Renomme toutes les clés `ravito_*` en `esprit_*` dans localStorage.
 * Appelée une fois au mount d'un composant client de haut niveau.
 */
export function migrateRavitoStorage(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(MIGRATION_FLAG_KEY) === "1") return;

    const toMigrate: { oldKey: string; newKey: string; value: string }[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("ravito_")) {
        const newKey = "esprit_" + k.slice("ravito_".length);
        const value = window.localStorage.getItem(k);
        if (value !== null && window.localStorage.getItem(newKey) === null) {
          toMigrate.push({ oldKey: k, newKey, value });
        }
      }
    }

    for (const { oldKey, newKey, value } of toMigrate) {
      window.localStorage.setItem(newKey, value);
      window.localStorage.removeItem(oldKey);
    }

    window.localStorage.setItem(MIGRATION_FLAG_KEY, "1");
  } catch {
    // localStorage indisponible (private mode / quota) → on ignore
  }
}
