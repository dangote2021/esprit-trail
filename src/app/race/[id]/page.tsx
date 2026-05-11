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
      {/* Hero */}
      <div
        className="relative h-56 bg-gradient-to-b"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10,15,28,0.4) 0%, rgba(10,15,28,0.95) 100%), url(${race.heroImage}?w=800&auto=format&fit=crop)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="safe-top absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3">
          <Link
            href="/races"
            className="rounded-lg bg-black/50 backdrop-blur p-2 text-ink hover:text-lime transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <button className="rounded-lg bg-black/50 backdrop-blur p-2 text-ink hover:text-lime transition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 5.5-7 10-7 10z" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex gap-2">
            <span className="rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-bold">
              {race.category}
            </span>
            {race.isIconic && (
              <span className="rounded-md bg-gold/90 px-2 py-0.5 text-[10px] font-mono font-black text-bg">
                ⭐ ICONIC
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-4xl font-black leading-none">
            {race.name}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {race.location} · {race.country}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-5">
        <p className="text-base italic text-ink-muted">"{race.tagline}"</p>

        {/* Countdown */}
        <div className="rounded-2xl border border-peach/30 bg-gradient-to-r from-peach/10 to-bg-card p-5 text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-peach">
            Départ dans
          </div>
          <div className="mt-1 font-display text-5xl font-black text-peach">
            {daysUntil}
          </div>
          <div className="text-xs font-mono text-ink-muted">
            jours · {formatDate(race.date)}
          </div>
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-lime/20 bg-bg-card/60 p-3 text-center">
            <div className="text-[10px] font-mono text-ink-muted uppercase">
              Distance
            </div>
            <div className="mt-1 font-display text-2xl font-black text-lime">
              {race.distance}
            </div>
            <div className="text-[10px] font-mono text-ink-dim">km</div>
          </div>
          <div className="rounded-xl border border-peach/20 bg-bg-card/60 p-3 text-center">
            <div className="text-[10px] font-mono text-ink-muted uppercase">
              D+
            </div>
            <div className="mt-1 font-display text-2xl font-black text-peach">
              {race.elevation.toLocaleString("fr")}
            </div>
            <div className="text-[10px] font-mono text-ink-dim">mètres</div>
          </div>
          <div className="rounded-xl border border-violet/20 bg-bg-card/60 p-3 text-center">
            <div className="text-[10px] font-mono text-ink-muted uppercase">
              ITRA
            </div>
            <div className="mt-1 font-display text-2xl font-black text-violet">
              {race.itraPoints}
            </div>
            <div className="text-[10px] font-mono text-ink-dim">points</div>
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
