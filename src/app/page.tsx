import Link from "next/link";
import QuestCard from "@/components/ui/QuestCard";
import SectionHeader from "@/components/ui/SectionHeader";
import TQLogo from "@/components/ui/TQLogo";
import BadgeCard from "@/components/ui/BadgeCard";
import PublicLanding from "@/components/landing/PublicLanding";
import RunStartCTA from "@/components/run/RunStartCTA";
import BibIcon from "@/components/ui/BibIcon";
import GutTrainingIcon from "@/components/ui/GutTrainingIcon";
import InviteFriendsCard from "@/components/invite/InviteFriendsCard";
import { MY_BADGES, MY_RUNS } from "@/lib/data/me";
import { questsForPeriod } from "@/lib/data/quests";
import { BADGES, getBadge } from "@/lib/data/badges";
import { RACES } from "@/lib/data/races";
import { GUILDES } from "@/lib/data/guildes";
import { getSupabaseUser } from "@/lib/supabase/server";

function formatKm(n: number) {
  return n.toLocaleString("fr", { maximumFractionDigits: 1 });
}
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr", { day: "numeric", month: "short" });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { city?: string; profile?: string };
}) {
  // Visiteurs non authentifiés → landing public avec 3 captures (mode découverte).
  // Les loggés vont sur le dashboard normal.
  // ?city=Lyon : permet de tester la localisation hero en dev.
  // ?profile=novice|competitor|adventurer : adapte la landing au profil
  const user = await getSupabaseUser();
  if (!user) {
    const rawProfile = searchParams?.profile;
    const profile =
      rawProfile === "novice" || rawProfile === "competitor" || rawProfile === "adventurer"
        ? rawProfile
        : undefined;
    return <PublicLanding cityOverride={searchParams?.city} profile={profile} />;
  }

  const dailyQuests = questsForPeriod("daily");
  const weeklyQuests = questsForPeriod("weekly").slice(0, 2);
  const recentRuns = MY_RUNS.slice(0, 3);
  const nextRace = RACES.filter((r) => new Date(r.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // 3 derniers badges débloqués
  const lastBadges = MY_BADGES
    .slice(-3)
    .map((id) => getBadge(id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  // Prochain badge réalisable
  const lockedCommon = BADGES.filter(
    (b) => !MY_BADGES.includes(b.id) && (b.rarity === "common" || b.rarity === "rare"),
  ).slice(0, 2);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <TQLogo showBaseline />
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="relative rounded-full bg-bg-card p-2.5 text-ink hover:text-lime transition tap-bounce card-chunky wobble"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10 21a2 2 0 0 0 4 0" />
            </svg>
          </Link>
        </div>
      </header>

      {/* CTA — Lance une sortie + modale Strava au 1er clic */}
      <RunStartCTA />

      {/* OFF RACES — feature phare, mise en avant */}
      <Link
        href="/races?tab=off"
        className="relative block overflow-hidden rounded-3xl border-2 border-peach bg-gradient-to-br from-peach/25 via-violet/15 to-bg p-5 btn-chunky tap-bounce card-shine"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 text-[120px] opacity-[0.12] leading-none">
          🏴‍☠️
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-peach text-bg card-chunky wobble">
            <span className="text-3xl">🏴‍☠️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-peach/20 text-peach px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-peach animate-pulse" />
              Nouveau · hors circuit
            </div>
            <div className="mt-1 font-display text-xl font-black leading-tight text-peach">
              Inscris-toi à des OFF
            </div>
            <div className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Rejoins des courses pirates, projets GR et FKT.
              Pas de dossard, juste l&apos;âme du trail. Entre potos, pleins phares&nbsp;!
            </div>
            <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-mono">
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">⚡ FKT</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🤫 Confidentielles</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">👥 Crew runs</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🎒 GR projects</span>
            </div>
          </div>
          <div className="font-display text-2xl text-peach">→</div>
        </div>
      </Link>

      {/* DOSSARDS EN JEU — tirage gratuit pour course partenaire */}
      <Link
        href="/challenges/loto"
        className="relative block overflow-hidden rounded-3xl border-2 border-lime bg-gradient-to-br from-lime/20 via-peach/10 to-bg p-5 btn-chunky tap-bounce card-shine"
      >
        <div className="pointer-events-none absolute -right-8 -top-4 opacity-[0.15] rotate-12">
          <BibIcon size={140} number="033" bibColor="#F0E6C8" numberColor="#1B4332" pinColor="#F77F00" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime card-chunky wobble overflow-hidden">
            <BibIcon size={52} number="01" bibColor="#FFFFFF" numberColor="#0B1D0E" pinColor="#1B4332" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-lime/20 text-lime px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              Nouveau · gratuit
            </div>
            <div className="mt-1 font-display text-xl font-black leading-tight text-lime">
              Dossards en jeu
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              Cours, gagne un ticket, vise un vrai dossard sur des courses partenaires.
            </div>
            <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-mono">
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🎯 Challenge</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🎟 Tickets</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">📲 WhatsApp</span>
              <span className="rounded bg-bg-raised/80 px-1.5 py-0.5">🎁 0€</span>
            </div>
          </div>
          <div className="font-display text-2xl text-lime">→</div>
        </div>
      </Link>

      {/* Coach IA — Plan d'entraînement (feature 1) */}
      <Link
        href="/coach"
        className="block rounded-3xl bg-cyan p-5 text-bg btn-chunky tap-bounce"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg text-cyan card-chunky wobble">
            <span className="text-2xl">🧠</span>
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-black uppercase tracking-wider">
              Coach IA · Plan sur mesure
            </div>
            <div className="font-display text-xl font-black leading-tight">
              Génère ton plan
            </div>
            <div className="text-xs opacity-80">
              Plan perso pour pas péter au 15ème km en fonction de ton niveau
            </div>
          </div>
          <div className="font-display text-2xl">→</div>
        </div>
      </Link>

      {/* Gut Training — Préparation digestive (feature 2, distincte) */}
      <Link
        href="/coach#gut-training"
        className="block rounded-3xl bg-peach p-5 text-bg btn-chunky tap-bounce"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg text-peach card-chunky shrink-0">
            <GutTrainingIcon size={44} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-black uppercase tracking-wider">
              Gut Training · 8 semaines
            </div>
            <div className="font-display text-xl font-black leading-tight">
              Prépare ton estomac
            </div>
            <div className="text-xs opacity-90 leading-snug">
              Nutrition sur mesure pour ta course : zéro hypo, zéro mauvaise
              surprise digestive.
            </div>
          </div>
          <div className="font-display text-2xl shrink-0">→</div>
        </div>
      </Link>

      {/* PARRAINAGE — Invite tes potos, maximise tes chances au tirage */}
      <InviteFriendsCard variant="full" />

      {/* Daily quests */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Daily"
          title="Tes quêtes du jour"
          href="/quests"
          linkLabel="Toutes les quêtes"
        />
        <div className="grid gap-3">
          {dailyQuests.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Weekly */}
      <section className="space-y-3">
        <SectionHeader eyebrow="Weekly" title="Cette semaine" href="/quests" />
        <div className="grid gap-3">
          {weeklyQuests.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Dernières sorties */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Replay"
          title="Tes dernières sorties"
          href="/profile"
          linkLabel="Historique"
        />
        <div className="space-y-2">
          {recentRuns.map((run) => (
            <Link
              key={run.id}
              href={`/run/${run.id}`}
              className="flex items-center gap-3 rounded-2xl bg-bg-card p-3 card-chunky card-pressable tap-bounce transition hover:-translate-y-0.5"
            >
              <div className="text-3xl">
                {run.terrain === "alpine"
                  ? "🏔️"
                  : run.terrain === "mountain"
                  ? "⛰️"
                  : run.terrain === "hilly"
                  ? "🌲"
                  : run.terrain === "technical"
                  ? "🪨"
                  : "➖"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-black">{run.title}</div>
                <div className="flex gap-2 text-[11px] text-ink-muted">
                  <span>{formatDate(run.date)}</span>
                  <span className="text-ink-dim">·</span>
                  <span>{formatKm(run.distance)} km</span>
                  <span className="text-ink-dim">·</span>
                  <span>{run.elevation} D+</span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[11px] font-display font-black text-bg">
                  +{run.xpEarned} XP
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-ink-muted">
                  {run.avgPace}
                </div>
                {run.badgesUnlocked.length > 0 && (
                  <div className="mt-0.5 text-[11px] font-display text-gold">
                    🏅 {run.badgesUnlocked.length}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Next race teaser */}
      {nextRace && (
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Prochaine course"
            title={nextRace.name}
            href="/races"
            linkLabel="Calendrier"
          />
          <Link
            href={`/race/${nextRace.id}`}
            className="relative block overflow-hidden rounded-2xl border border-peach/30 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-5 transition hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-peach">
                  {nextRace.location} · {nextRace.country}
                </div>
                <h3 className="font-display text-2xl font-black leading-tight">
                  {nextRace.name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {nextRace.tagline}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    {nextRace.distance} km
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    {nextRace.elevation} D+
                  </span>
                  <span className="rounded-md bg-bg-raised px-2 py-1">
                    {nextRace.itraPoints} pts ITRA
                  </span>
                  {nextRace.utmbIndexRequired && (
                    <span className="rounded-md bg-cyan/10 px-2 py-1 text-cyan">
                      UTMB ≥ {nextRace.utmbIndexRequired}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-black text-peach">
                  {formatDate(nextRace.date)}
                </div>
                <div className="text-[10px] font-mono text-ink-dim">
                  {new Date(nextRace.date).getFullYear()}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Ma team — teaser */}
      {(() => {
        const myGuilde = GUILDES.find((g) => g.iAmMember);
        if (!myGuilde) return null;
        return (
          <section className="space-y-3">
            <SectionHeader
              eyebrow="Team"
              title="Ta team cette semaine"
              href="/guildes"
              linkLabel="Voir tout"
            />
            <Link
              href={`/guildes/${myGuilde.id}`}
              className="block rounded-2xl border border-peach/30 bg-gradient-to-r from-peach/10 via-bg-card to-bg p-4 hover:scale-[1.01] transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{myGuilde.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-black truncate">
                    {myGuilde.name}
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    👥 {myGuilde.memberCount} · {myGuilde.weekStats.totalKm} km
                    · #{myGuilde.weekStats.rank}
                  </div>
                </div>
                {myGuilde.currentChallenge && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-peach uppercase">
                      Défi
                    </div>
                    <div className="font-display text-sm font-black">
                      {Math.round(
                        (myGuilde.currentChallenge.progress /
                          myGuilde.currentChallenge.target) *
                          100
                      )}
                      %
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </section>
        );
      })()}

      {/* Derniers badges */}
      {lastBadges.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Collection"
            title="Tes derniers trophées"
            href="/badges"
          />
          <div className="grid grid-cols-3 gap-3">
            {lastBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} size="sm" />
            ))}
          </div>
        </section>
      )}

      {/* Prochains objectifs */}
      {lockedCommon.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            eyebrow="À portée"
            title="Prochains badges débloquables"
          />
          <div className="grid grid-cols-2 gap-3">
            {lockedCommon.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-ink/10 bg-bg-card/60 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl opacity-50 grayscale">{b.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{b.name}</div>
                    <div className="truncate text-[11px] text-ink-muted">
                      {b.description}
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-lime">
                      +{b.xpReward} XP
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Encart feedback discret — la team écoute la communauté */}
      <Link
        href="/contact"
        className="block rounded-2xl border border-lime/30 bg-gradient-to-br from-lime/8 via-bg-card to-peach/8 p-4 hover:border-lime/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
              On t&apos;écoute
            </div>
            <div className="text-sm font-bold text-ink">
              Une idée pour améliorer Esprit Trail ?
            </div>
            <div className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
              Balance ton retour, Esprit Kaizen — on s&apos;améliore pas à pas grâce à toi →
            </div>
          </div>
        </div>
      </Link>
    </main>
  );
}
