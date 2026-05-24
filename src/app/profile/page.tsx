import Link from "next/link";
import BadgeCard from "@/components/ui/BadgeCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProfileHeroCardClient from "@/components/profile/ProfileHeroCardClient";
import StravaConnectionStatus from "@/components/profile/StravaConnectionStatus";
import ConfiguredProfileOnly from "@/components/profile/ConfiguredProfileOnly";
import FormeRecupPanel from "@/components/profile/FormeRecupPanel";
import ManualRunsList from "@/components/profile/ManualRunsList";
import ProfileStatsSections from "@/components/profile/ProfileStatsSections";
import StatRadarEditable from "@/components/profile/StatRadarEditable";
import TotemPicker from "@/components/profile/TotemPicker";
import { ME, MY_BADGES, MY_LOOT } from "@/lib/data/me";
import { getBadge } from "@/lib/data/badges";
import { RARITY_STYLES } from "@/lib/types";
import WishlistRaces from "@/components/profile/WishlistRaces";
import BestResults from "@/components/profile/BestResults";

// Baseline neutre du radar : un profil neuf s'auto-évalue lui-même,
// on ne lui montre pas les stats d'un traileur fictif.
const NEUTRAL_STATS = {
  endurance: 50,
  vitesse: 50,
  technique: 50,
  mental: 50,
  grimpe: 50,
};

export default function ProfilePage() {
  const badges = MY_BADGES
    .map((id) => getBadge(id))
    .filter((b): b is NonNullable<typeof b> => !!b);
  const topBadges = [...badges]
    .sort((a, b) => {
      const order = ["mythic", "legendary", "epic", "rare", "common"];
      return order.indexOf(a.rarity) - order.indexOf(b.rarity);
    })
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Profil
          </div>
          <h1 className="font-display text-2xl font-black leading-none">
            Ton cockpit
          </h1>
        </div>
        <Link
          href="/profile/settings"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </header>

      {/* ===== Carte hero : cover + avatar + nom + stats RÉELLES ===== */}
      <ProfileHeroCardClient
        displayName=""
        username=""
        fallbackEmoji={ME.avatar}
      />

      {/* ===== Best Results — 3 courses mythiques, saisies par le user ===== */}
      <BestResults />

      {/* ===== Forces & faiblesses — radar auto-évaluable (baseline neutre) ===== */}
      <StatRadarEditable baseStats={NEUTRAL_STATS} />

      {/* UTMB + ITRA — visible uniquement pour les profils avec activité réelle
          (sinon on afficherait des index fictifs à un compte fraîchement créé) */}
      <ConfiguredProfileOnly>
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 to-bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet font-display text-sm font-black text-bg">
              U
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan">
              UTMB Index
            </div>
          </div>
          <div className="mt-2 font-display text-4xl font-black text-cyan">
            {ME.connections.utmb?.runnerIndex}
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-muted">
            Détail par catégorie →
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {(["XS", "S", "M", "L", "XL"] as const).map((cat) => {
              const v = ME.connections.utmb?.categoryIndex[cat] || 0;
              return (
                <div key={cat} className="text-center">
                  <div className="text-[9px] font-mono text-ink-dim">{cat}</div>
                  <div className="text-[11px] font-mono font-bold text-ink">
                    {v > 0 ? v : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/10 to-bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-peach font-display text-sm font-black text-bg">
              I
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet">
              ITRA
            </div>
          </div>
          <div className="mt-2 font-display text-4xl font-black text-violet">
            {ME.connections.itra.performanceIndex}
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-muted">
            Performance Index / 1000
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-raised">
            <div
              className="h-full rounded-full bg-violet"
              style={{
                width: `${(ME.connections.itra.performanceIndex / 1000) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 text-[10px] font-mono text-ink-dim">
            Top 15% mondial
          </div>
        </div>
      </section>
      </ConfiguredProfileOnly>

      {/* Forme & Récup — VO₂max, fraîcheur TSB, charge (gated activité réelle) */}
      <FormeRecupPanel />

      {/* Sorties enregistrées (manuelles + tracker) — éditables, données réelles */}
      <ManualRunsList />

      {/* Stats — semaine + saison, calculées sur les vraies sorties */}
      <ProfileStatsSections />

      {/* Accès Ranking */}
      <Link
        href="/leaderboard"
        className="flex items-center gap-3 rounded-2xl border-2 border-gold/30 bg-gradient-to-r from-gold/10 via-bg-card to-peach/5 p-4 hover:border-gold/60 transition"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15">
          <span className="text-2xl">🏆</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-gold">
            Ranking
          </div>
          <div className="font-display text-base font-black text-ink">
            Ta position dans le classement
          </div>
          <div className="text-[11px] text-ink-muted">
            ITRA · UTMB · saison en cours
          </div>
        </div>
        <span className="font-display text-xl text-gold shrink-0">→</span>
      </Link>

      {/* ===== Totem animal — cosmétique facultatif ===== */}
      <TotemPicker />

      {/* Sync Strava */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Sync" title="Plateforme connectée" />
        <StravaConnectionStatus />
      </section>

      {/* Wishlist courses (auto-syncée depuis /race/[id]) */}
      <WishlistRaces />

      {/* Top badges — visible uniquement pour les profils avec activité réelle */}
      <ConfiguredProfileOnly>
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Trophées"
            title="Meilleurs trophées"
            href="/badges"
            linkLabel={`Voir tous (${badges.length})`}
          />
          <div className="grid grid-cols-3 gap-3">
            {topBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} size="sm" />
            ))}
          </div>
        </section>
      </ConfiguredProfileOnly>

      {/* Inventaire loot — visible uniquement pour les profils avec activité réelle */}
      <ConfiguredProfileOnly>
        <section className="space-y-3">
          <SectionHeader eyebrow="Inventaire" title="Mon loot" />
          <div className="space-y-2">
            {MY_LOOT.map((loot) => {
              const style = RARITY_STYLES[loot.rarity];
              return (
                <div
                  key={loot.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${style.color}`}
                >
                  <div className="text-3xl">{loot.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-display text-sm font-black">
                        {loot.name}
                      </div>
                      <span className={`text-[9px] font-mono uppercase ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-muted">{loot.description}</div>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                    {loot.type}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </ConfiguredProfileOnly>
    </main>
  );
}
