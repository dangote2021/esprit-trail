// ====== SUPABASE CLIENT (server) ======
//
// Utilisé dans les Server Components, Route Handlers, et Server Actions.
// Lit les cookies de la requête pour récupérer la session.

import type { Database } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerClient = any;

export async function getSupabaseServerClient(): Promise<ServerClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase non configuré. Ajouter NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local"
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { createServerClient } = require("@supabase/ssr");
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { cookies } = require("next/headers");
    const cookieStore = await cookies();

    // @ts-expect-error — types loaded dynamically once @supabase/ssr is installed
    return createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: unknown }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Appelé depuis un Server Component — les cookies ne peuvent pas être modifiés
          }
        },
      },
    });
  } catch {
    throw new Error(
      "Package @supabase/ssr non installé. Exécute : npm i @supabase/supabase-js @supabase/ssr"
    );
  }
}
