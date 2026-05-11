import Link from "next/link";
import { notFound } from "next/navigation";
import { RACES } from "@/lib/data/races";
import { ME } from "@/lib/data/me";
import RaceActions from "./RaceActions";
import RaceNutritionPlan from "@/components/race/RaceNutritionPlan";
import RaceShareButton from "@/components/race/RaceShareButton";
import DiscoveryBanner from "@/components/layout/DiscoveryBanner";
import { getSupabaseUser } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const race = RACES.find((r) => r.id === params.id);
  if (!race) {
    return { title: "Course introuvable" };
  }
  const title = `${race.name} · ${race.distance} km`;
  const description = `${race.tagline} · ${race.distance} km · ${race.elevation.toLocaleString(
    "fr",
  )} m D+ · ${race.location}, ${race.country}. Plan nutrition, conditions, éligibilité UTMB Index sur Esprit Trail.`;
  return {
    title,
    description,
    openGraph: {
      title: `${race.name} — Esprit Trail`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${race.name} — Esprit Trail`,
      description,
    },
  };
}

export async function generateStaticParams() {
  return RACES.map((r) => ({ id: r.id }));
}

export default async function RaceDetailPage({ params }: { params: { id: string } }) {
  const race = RACES.find((r) => r.id === params.id);
  if (!race) notFound();

  const user = await getSupabaseUser();
  const isPreview = !user;

  const myUtmb = ME.connections.utmb?.runnerIndex || 0;
  const eligible = !race.utmbIndexRequired || myUtmb >= race.utmbIndexRequired;
  const daysUntil = Math.ceil(
    (new Date(race.date).getTime() - Date.now()) / 86400000,
  );

  // ====== Schema.org SportsEvent (JSON-LD) pour Rich Cards Google ======
  const raceUrl = `${SITE_URL}/race/${race.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: race.name,
    description: `${race.tagline} · ${race.distance} km · ${race.elevation.toLocaleString(
      "fr",
    )} m D+ · ${race.itraPoints} pts ITRA`,
    startDate: race.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "Trail running",
    location: {
      "@type": "Place",
      name: race.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: race.location,
        addressCountry: race.country,
      },
    },
    image: race.heroImage
      ? [`${race.heroImage}?w=1200&auto=format&fit=crop`]
      : [`${SITE_URL}/og.png`],
    url: raceUrl,
    organizer: {
      "@type": "Organization",
      name: "Esprit Trail",
      url: SITE_URL,
    },
  };

  return (
    <main className="mx-auto max-w-lg pb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero — overlay dégradé renforcé pour garantir la lisibilité du titre */}
      <div
        className="relative h-56"
        style={{
          backgroundImage: `url(${race.heroImage}?w=800&auto=format&fit=crop)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay sombre top→bottom pour assurer contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/90" />

        <div className="safe-top absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
          <Link
            href="/races"
            className="rounded-lg bg-black/55 backdrop-blur p-2 text-white hover:text-lime transition"
            aria-label="Retour"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <div className="flex gap-2">
            <span className="rounded-md bg-black/65 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-bold text-white">
              {race.category}
            </span>
            {race.isIconic && (
              <span className="rounded-md bg-gold/95 px-2 py-0.5 text-[10px] font-mono font-black text-bg">
                ⭐ ICONIC
              </span>
            )}
            <span className="rounded-md bg-black/65 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-bold text-white">
              📅 {formatDate(race.date)}
            </span>
          </div>
          <h1
            className="mt-2 font-display text-4xl font-black leading-none text-white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
          >
            {race.name}
          </h1>
          <p
            className="mt-1 text-sm text-white/90"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {race.location} · {race.country}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-5">
        <p className="text-base italic text-ink-muted">&ldquo;{race.tagline}&rdquo;</p>

        {/* Bouton wishlist + Site officiel — déplacés en position centrale haute */}
        <RaceActions raceId={race.id} officialUrl={race.officialUrl} />

        {/* Bandeau D+ + countdown compact (D+ central, date discrète) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 rounded-2xl border-2 border-peach/40 bg-gradient-to-br from-peach/15 via-bg-card to-bg p-4 flex items-center gap-3">
            <div className="text-5xl">⛰️</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-peach">
                Dénivelé positif
              </div>
              <div className="font-display text-3xl font-black text-peach leading-none mt-1">
                {race.elevation.toLocaleString("fr")}
                <span className="ml-1 text-base align-baseline">m D+</span>
              </div>
              <div className="text-[11px] font-mono text-ink-muted mt-1">
                {race.elevation >= 8000
                  ? "🏔️ Format extrême"
                  : race.elevation >= 5000
                    ? "🥾 Format alpin"
                    : race.elevation >= 2000
                      ? "🌲 Trail montagne"
                      : "🏞️ Trail roulant"}
              </div>
            </div>
          </div>
          {/* Encart date — discret, secondaire */}
          <div className="rounded-2xl border border-ink/15 bg-bg-card/60 p-3 text-center flex flex-col items-center justify-center">
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              J-
            </div>
            <div className="font-display text-2xl font-black text-ink leading-none mt-0.5">
              {daysUntil}
            </div>
            <div className="text-[9px] font-mono text-ink-dim mt-1">
              {new Date(race.date).toLocaleDateString("fr", {
                day: "numeric",
                month: "short",
                timeZone: "UTC",
              })}
            </div>
          </div>
        </div>

        {/* Formats proposés — l'utilisateur choisit sa distance */}
        {race.formats && race.formats.length > 1 && (
          <section className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
                {race.formats.length} formats au choix
              </div>
              <div className="text-[10px] font-mono text-ink-dim">
                choisis ta distance
              </div>
            </div>
            <div className="space-y-1.5">
              {race.formats.map((f) => {
                const isPrimary = f.distance === race.distance;
                return (
                  <div
                    key={f.name}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                      isPrimary
                        ? "border-lime/40 bg-lime/8"
                        : "border-ink/15 bg-bg-card/50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-black text-ink truncate">
                          {f.name}
                        </span>
                        {isPrimary && (
                          <span className="rounded bg-lime/20 px-1.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider text-lime">
                            principal
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-display text-base font-black text-lime leading-none">
                          {f.distance}
                        </div>
                        <div className="text-[9px] font-mono text-ink-dim">km</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-base font-black text-peach leading-none">
                          {f.elevation.toLocaleString("fr")}
                        </div>
                        <div className="text-[9px] font-mono text-ink-dim">m D+</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tuile ITRA standalone (les distance + D+ sont déjà bien valorisés au-dessus) */}
        <div className="grid grid-cols-1 gap-2">
          <div className="rounded-xl border border-violet/25 bg-violet/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                Points ITRA
              </div>
              <div className="text-xs text-ink-muted mt-0.5">
                Comptés pour l&apos;éligibilité ultra-trails
              </div>
            </div>
            <div className="font-display text-3xl font-black text-violet">
              {race.itraPoints}
            </div>
          </div>
        </div>

        {/* Eligibility — visible UNIQUEMENT pour utilisateurs loggés.
            Afficher "Pas éligible, il te manque X" à un visiteur sans compte
            était démoralisant et illogique (UTMB Index défaut 0). */}
        {race.utmbIndexRequired && isPreview && (
          <div className="rounded-2xl border-2 border-cyan/30 bg-gradient-to-br from-cyan/8 via-bg-card to-bg p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan/20 text-2xl">
                🎯
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan">
                  UTMB Index requis : {race.utmbIndexRequired}
                </div>
                <div className="font-display text-base font-black text-ink leading-tight">
                  Tu es éligible ?
                </div>
                <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
                  Connecte-toi pour voir où tu en es et comment passer le seuil.
                </p>
                <Link
                  href="/signup"
                  className="mt-2 inline-block rounded-md bg-cyan px-3 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-bg hover:scale-105 transition"
                >
                  Crée ton compte →
                </Link>
              </div>
            </div>
          </div>
        )}
        {race.utmbIndexRequired && !isPreview && (
          <div
            className={`rounded-2xl border p-4 ${
              eligible
                ? "border-lime/30 bg-lime/5"
                : "border-peach/30 bg-peach/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    eligible ? "text-lime" : "text-peach"
                  }`}
                >
                  Éligibilité
                </div>
                <div className="font-display text-lg font-black">
                  {eligible ? "Tu es éligible 🎯" : "Pas encore éligible"}
                </div>
                <div className="text-xs text-ink-muted">
                  Ton UTMB Index : {myUtmb} · Requis : {race.utmbIndexRequired}
                </div>
              </div>
              <div
                className={`font-display text-4xl font-black ${
                  eligible ? "text-lime" : "text-peach"
                }`}
              >
                {eligible ? "✓" : "—"}
              </div>
            </div>
            {!eligible && (
              <div className="mt-3 rounded-lg border border-ink/10 bg-bg-raised/50 p-3 text-xs text-ink-muted">
                💡 <span className="font-bold">Plan pour éligibilité :</span>{" "}
                prépare 2-3 courses catégorie {race.category === "XL" ? "L" : race.category === "L" ? "M" : "S"} dans les 6 prochains mois pour grimper ton Index.
              </div>
            )}
          </div>
        )}

        {/* Difficulté */}
        <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Niveau de difficulté</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-7 rounded-full ${
                    i <= race.difficulty ? "bg-peach" : "bg-ink/15"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {race.difficulty === 5
              ? "Épreuve d'expert. Expérience ultra-trail confirmée obligatoire."
              : race.difficulty === 4
              ? "Course technique et exigeante. Bonne condition physique requise."
              : race.difficulty === 3
              ? "Trail engagé. Entraînement solide recommandé."
              : race.difficulty === 2
              ? "Trail accessible avec préparation."
              : "Parfait pour une première course."}
          </p>
        </div>

        <DiscoveryBanner />

        {/* Partage WhatsApp */}
        <RaceShareButton
          raceId={race.id}
          raceName={race.name}
          tagline={race.tagline}
          variant="full"
        />

        {/* Actions */}
        <RaceActions raceId={race.id} />

        {/* Plan nutrition jour J — preview pour visiteurs non-loggés */}
        <RaceNutritionPlan
          raceName={race.name}
          distanceKm={race.distance}
          elevationM={race.elevation}
          raceStartIso={race.date}
          itraIndex={ME.connections.itra?.performanceIndex || 600}
          preview={isPreview}
        />

        {/* Quête préparation — câblé : redirige vers Coach IA pour loggés, signup pour visiteurs */}
        <div className="rounded-2xl border border-lime/20 bg-gradient-to-br from-lime/5 via-bg-card to-bg p-5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
            Quête de préparation
          </div>
          <h3 className="mt-1 font-display text-lg font-black">
            Plan d&apos;entraînement Esprit Trail
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            Active la quête et on génère un plan sur mesure : séances clés,
            sorties longues, semaines de décharge. Chaque séance validée = XP.
          </p>
          {isPreview ? (
            <Link
              href={`/signup?next=${encodeURIComponent(`/coach?race=${race.id}`)}`}
              className="mt-3 block w-full rounded-xl bg-lime py-3 text-center text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime hover:scale-[1.01] transition"
            >
              Crée ton compte pour activer →
            </Link>
          ) : (
            <Link
              href={`/coach?race=${race.id}`}
              className="mt-3 block w-full rounded-xl bg-lime py-3 text-center text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime hover:scale-[1.01] transition"
            >
              Activer la quête →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
