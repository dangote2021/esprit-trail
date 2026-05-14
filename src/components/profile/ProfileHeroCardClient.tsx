"use client";

// ====== ProfileHeroCardClient ======
// Wrapper client autour de ProfileHeroCard qui lit l'identité réelle
// (localStorage + Supabase profiles) pour ne PAS afficher de mock data
// aux nouveaux utilisateurs.

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileHeroCard from "./ProfileHeroCard";
import { getStoredIdentity } from "@/lib/identity";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = React.ComponentProps<typeof ProfileHeroCard>;

export default function ProfileHeroCardClient(props: Props) {
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Lecture locale immédiate
    const stored = getStoredIdentity();
    if (stored.displayName) setDisplayName(stored.displayName);
    if (stored.username) setUsername(stored.username);
    setReady(true);

    // 2. Sync depuis Supabase si dispo
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase.from("profiles") as any)
          .select("display_name, username")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.username) setUsername(data.username);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  if (!ready) {
    // SSR-safe placeholder pour éviter le flash de mock data
    return (
      <div className="rounded-3xl border-2 border-ink/10 bg-bg-card/40 p-6 min-h-[180px] animate-pulse" />
    );
  }

  // Si pas de nom/pseudo enregistrés → CTA "Complète ton profil"
  const hasIdentity = displayName || username;

  if (!hasIdentity) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-lime/40 bg-lime/5 p-6 text-center">
        <div className="text-5xl">🏃</div>
        <h2 className="mt-3 font-display text-xl font-black text-ink">
          Ton profil est tout neuf
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Choisis ton prénom et ton pseudo pour que la team puisse te repérer.
        </p>
        <Link
          href="/profile/settings"
          className="mt-4 inline-block rounded-xl bg-lime px-5 py-2.5 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime"
        >
          Compléter mon profil
        </Link>
      </div>
    );
  }

  // Sinon on rend ProfileHeroCard avec les vraies valeurs
  return (
    <ProfileHeroCard
      {...props}
      displayName={displayName || props.displayName}
      username={username || props.username}
    />
  );
}
