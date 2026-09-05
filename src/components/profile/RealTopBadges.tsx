"use client";

// ====== RealTopBadges ======
// Hardening 05/09/26 : rapport de test panel — /profile affichait "Meilleurs
// trophées" à partir de MY_BADGES (liste figée de la persona démo interne),
// donc les mêmes 6 badges pour tout utilisateur ayant complété son profil,
// qu'il ait réellement couru ou non. On calcule ici les vrais badges
// débloqués depuis Supabase (voir lib/supabase/badges.ts) et on masque la
// section si l'utilisateur n'en a encore débloqué aucun — plutôt que de
// montrer un cabinet vide ou, pire, mensonger.

import { useEffect, useState } from "react";
import BadgeCard from "@/components/ui/BadgeCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { BADGES, getBadge } from "@/lib/data/badges";
import { getRealUnlockedBadges } from "@/lib/supabase/badges";

const RARITY_ORDER = ["mythic", "legendary", "epic", "rare", "common"];

export default function RealTopBadges() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getRealUnlockedBadges().then((set) => {
      if (!cancelled) {
        setUnlocked(set);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null; // évite le flash pendant le chargement
  if (unlocked.size === 0) return null; // rien de réel à montrer, on ne triche pas

  const topBadges = [...unlocked]
    .map((id) => getBadge(id))
    .filter((b): b is NonNullable<typeof b> => !!b)
    .sort(
      (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
    )
    .slice(0, 6);

  return (
    <section className="space-y-3">
      <SectionHeader
        eyebrow="Trophées"
        title="Meilleurs trophées"
        href="/badges"
        linkLabel={`Voir tous (${BADGES.length})`}
      />
      <div className="grid grid-cols-3 gap-3">
        {topBadges.map((b) => (
          <BadgeCard key={b.id} badge={b} size="sm" />
        ))}
      </div>
    </section>
  );
}
