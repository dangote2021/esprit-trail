// ====== VAPID public key ======
// Cle publique Web Push, OK a exposer (anyone qui inspecte le JS peut la voir).
// La cle privee correspondante vit dans VAPID_PRIVATE_KEY env var cote Vercel.

export const VAPID_PUBLIC_KEY =
  "BEQDcVcH6dWYXVHFTynSctZyb5NUy3lqQLlqe1103yNaYsWp0bVTfwlvHDb7FRygw6YjZGNUCaOa6iwHFl94dlg";

/** Convertit la cle base64 URL-safe en Uint8Array pour pushManager.subscribe */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}
