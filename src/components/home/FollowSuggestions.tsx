"use client";

// ====== FollowSuggestions ======
// "Tu pourrais suivre ces traileurs" — encart sur la home pour booster
// le côté social. Logique simple pour le MVP :
//   - on prend 4-5 personas connus de l'app (cohérents avec PotosFeed)
//   - filtré : on retire ceux que l'utilisateur suit déjà
//   - retiré aussi : l'utilisateur lui-même (id "me")
//
// Click sur "Suivre" → écrit dans esprit_follows (localStorage).
// Click sur la carte → navigue vers /u/{handle} (profil public).
//
// À terme : algorithme côté serveur basé sur (a) guilde commune,
// (b) courses wishlist communes, (c) signal de proximité géo.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadFollows, toggleFollow } from "@/lib/follow-store";

type Suggestion = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  blurb: string;
  totem?: string;
};

const POOL: Suggestion[] = [
  {
    id: "u-mathilde",
    name: "Mathilde",
    handle: "mat_trail",
    avatar: "🐺",
    totem: "🐺",
    blurb: "Cheffe de meute · prépare CCC 2026",
  },
  {
    id: "u-thomas",
    name: "Thomas",
    handle: "tom.runner",
    avatar: "🦅",
    totem: "🦅",
    blurb: "Grimpeur · spécialiste séances cotes",
  },
  {
    id: "u-sarah",
    name: "Sarah",
    handle: "sarahmtn",
    avatar: "🐐",
    totem: "🐐",
    blurb: "Montagnarde · D+ partout",
  },
  {
    id: "u-lucas",
    name: "Lucas",
    handle: "luclu_ultra",
    avatar: "🐻",
    totem: "🐻",
    blurb: "Ultra-traileur · 5 fois UTMB finisher",
  },
  {
    id: "u-louise",
    name: "Louise",
    handle: "louise.run",
    avatar: "🦊",
    totem: "🦊",
    blurb: "Coach trail Annecy · partage ses sorties",
  },
  {
    id: "u-clem",
    name: "Clem",
    handle: "clementinaa",
    avatar: "🦌",
    totem: "🦌",
    blurb: "Bouzin nutrition · récits de courses",
  },
];

export default function FollowSuggestions() {
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFollowedIds(new Set(Object.keys(loadFollows())));
    const onChange = () => {
      setFollowedIds(new Set(Object.keys(loadFollows())));
    };
    window.addEventListener("esprit:follows", onChange);
    return () => window.removeEventListener("esprit:follows", onChange);
  }, []);

  // Filtre : on enlève les déjà-suivis. Pour ne pas faire vide-grenier
  // dès que l'user en suit 4, on garde au moins 2 cartes même si elles
  // sont déjà follow (pour montrer qu'il peut unfollow facilement).
  const items = useMemo(() => {
    if (!mounted) return POOL.slice(0, 4);
    const fresh = POOL.filter((p) => !followedIds.has(p.id));
    if (fresh.length >= 3) return fresh.slice(0, 4);
    return POOL.slice(0, 4); // fallback
  }, [followedIds, mounted]);

  return (
    <section>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-ink-muted">
            Suggestions
          </div>
          <h2 className="font-display text-lg font-black leading-tight">
            Follow tes potos de trail
          </h2>
        </div>
        <span className="text-[11px] font-mono text-ink-dim">
          T&apos;auras leurs sorties dans ton feed
        </span>
      </div>

      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((s) => {
          const following = followedIds.has(s.id);
          return (
            <div
              key={s.id}
              className="snap-start shrink-0 w-[220px] rounded-2xl border border-ink/10 bg-bg-card/80 p-3 card-chunky"
            >
              <Link
                href={`/u/${s.handle}`}
                className="flex items-center gap-2 mb-2"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 border border-ink/15 text-xl">
                  {s.totem ?? s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-black leading-tight truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] font-mono text-ink-muted truncate">
                    @{s.handle}
                  </div>
                </div>
              </Link>
              <div className="text-[11px] text-ink-muted leading-snug mb-2 line-clamp-2">
                {s.blurb}
              </div>
              <button
                type="button"
                onClick={() => {
                  toggleFollow(s.id);
                }}
                aria-pressed={following}
                className={`w-full rounded-lg py-1.5 text-[11px] font-mono font-black uppercase tracking-wider transition tap-bounce ${
                  following
                    ? "bg-lime/15 text-lime border border-lime/40"
                    : "bg-lime text-bg hover:scale-[1.02]"
                }`}
              >
                {following ? "✓ Suivi·e" : "+ Suivre"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
