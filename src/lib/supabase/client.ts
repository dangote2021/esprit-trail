// ====== SUPABASE CLIENT (browser) ======
//
// Utilisé dans les Client Components ("use client").
// Nécessite les env vars NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.
//
// Pour activer :
//   npm i @supabase/supabase-js @supabase/ssr
//   Créer un projet Supabase, copier URL + anon key dans .env.local

import type { Database } from "./types";

// Note : on importe dynamiquement pour ne pas casser le build tant que le package
// n'est pas installé. Une fois `@supabase/ssr` installé, cette indirection peut
// être remplacée par `import { createBrowserClient } from "@supabase/ssr"`.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowserClient = any;

let client: BrowserClient | null = null;

export function getSupabaseBrowserClient(): BrowserClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase non configuré. Ajouter NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local"
    );
  }

  // Lazy require pour ne pas casser le build avant install
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { createBrowserClient } = require("@supabase/ssr");
    // @ts-expect-error — types loaded dynamically once @supabase/ssr is installed
    client = createBrowserClient<Database>(url, key);
    return client;
  } catch {
    throw new Error(
      "Package @supabase/ssr non installé. Exécute : npm i @supabase/supabase-js @supabase/ssr"
    );
  }
}
