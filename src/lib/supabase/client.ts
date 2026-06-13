// ====== SUPABASE CLIENT (browser) ======
// À utiliser dans les Client Components ("use client").
//
// Note technique : on n'utilise PAS le générique <Database> pour le typage
// strict. C'est volontaire — TypeScript v4.x a du mal avec les inférences
// complexes de @supabase/ssr sur les insert/update/upsert (regression GitHub
// issue #1262). Les queries retournent donc des objets typés à la main dans
// les couches user-races.ts / messaging.ts (cf. rowToRace, rowToMessage…).

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase non configuré. Ajouter NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
    );
  }

  client = createBrowserClient(url, key);
  return client;
}
