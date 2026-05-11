// ====== POST /api/account/delete ======
// Suppression RGPD du compte utilisateur.
//
// Stratégie : on supprime l'user auth via le service_role, ce qui trigger
// les ON DELETE CASCADE sur toutes les tables (profiles, runs, badges,
// guilde_members, user_integrations, etc.). Plus simple et plus fiable
// que de faire 10 DELETE manuels.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceUrl || !serviceKey) {
      console.error("[account/delete] SUPABASE_SERVICE_ROLE_KEY missing");
      return NextResponse.json(
        { error: "server_misconfigured" },
        { status: 500 },
      );
    }

    const admin = createClient(serviceUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) {
      console.error("[account/delete] admin.deleteUser failed:", delErr.message);
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    // On invalide la session locale avant de répondre
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "delete_failed";
    console.error("[account/delete] exception:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
