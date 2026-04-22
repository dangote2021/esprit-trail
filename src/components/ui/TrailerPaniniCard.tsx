// ====== TRAILER PANINI CARD — carte collector style FIFA / Panini ======
// Héros du profil : avatar hero + note globale + classe + radar + form arrow.

import { CharacterAvatar } from "./CharacterAvatar";
import { StatRadar, overallRating, statsToRadar } from "./StatRadar";
import { FormArrow, type FormTrend } from "./FormArrow";
import { TRAILER_CLASSES } from "@/lib/trailer-class";
import type { User } from "@/lib/types";

type Accent = "lime" | "peach" | "cyan" | "violet" | "gold";

const CLASS_ACCENT: Record<string, {
  accent: Accent;
  fromBg: string;
  text: string;
  glow: string;
  short: string;
}> = {
  sprinter:   { accent: "lime",   fromBg: "from-lime/30",   text: "text-lime",   glow: "shadow-glow-lime",   short: "SPR" },
  ultra:      { accent: "peach",  fromBg: "from-peach/30",  text: "text-peach",  glow: "shadow-glow-peach",  short: "ULT" },
  alpiniste:  { accent: "cyan",   fromBg: "from-cyan/30",   text: "text-cyan",   glow: "shadow-glow-cyan",   short: "ALP" },
  technicien: { accent: "violet", fromBg: "from-violet/30", text: "text-violet", glow: "shadow-glow-violet", short: "TEC" },
  "flâneur":  { accent: "gold",   fromBg: "from-gold/30",   text: "text-gold",   glow: "shadow-glow-gold",   short: "FLA" },
};

/** Couleur tier selon rating : or 85+, argent 70+, bronze sinon */
function tierFromRating(r: number) {
  if (r >= 85) return { bg: "bg-gold", text: "text-bg", label: "OR" };
  if (r >= 70) return { bg: "bg-[#c0c0c0]", text: "text-bg", label: "ARGENT" };
  return { bg: "bg-[#cd7f32]", text: "text-bg", label: "BRONZE" };
}

export function TrailerPaniniCard({
  user,
  formTrend = "stable",
  className = "",
}: {
  user: User;
  formTrend?: FormTrend;
  className?: string;
}) {
  if (!user.profile || !user.character) return null;

  const classDef = TRAILER_CLASSES.find((c) => c.id === user.profile!.trailerClass)!;
  const accent = CLASS_ACCENT[user.profile.trailerClass] || CLASS_ACCENT.alpiniste;
  const stats = user.profile.stats;
  const rating = overallRating(stats);
  const tier = tierFromRating(rating);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b ${accent.fromBg} via-bg-card to-bg p-5 card-chunky card-shine ${accent.glow} ${className}`}
    >
      {/* Holographic diagonal overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "repeating-linear-gradient(125deg, rgba(255,255,255,0.06) 0 6px, transparent 6px 14px)",
        }}
        aria-hidden
      />

      {/* Top row: rating + form arrow */}
      <div className="relative flex items-start justify-between">
        {/* Overall rating (style FIFA) */}
        <div className={`flex flex-col items-center rounded-2xl ${tier.bg} px-3 py-2 card-chunky`}>
          <div className={`font-display text-3xl font-black leading-none ${tier.text}`}>
            {rating}
          </div>
          <div className={`mt-0.5 text-[10px] font-black uppercase tracking-wider ${tier.text}`}>
            {accent.short}
          </div>
        </div>

        {/* Étoiles expérience + form */}
        <div className="flex flex-col items-end gap-2">
          <FormArrow trend={formTrend} />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < Math.min(5, Math.ceil(user.profile!.yearsExperience / 2))
                    ? "text-gold"
                    : "text-ink-dim/30"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero avatar (centré, gros) */}
      <div className="relative mt-2 flex items-center justify-center">
        <div className={`absolute inset-0 -z-0 rounded-full ${accent.fromBg.replace("from-", "bg-").replace("/30", "/20")} blur-2xl`} />
        <div className="relative">
          <CharacterAvatar
            character={user.character}
            size={170}
            showGround={false}
          />
        </div>
      </div>

      {/* Name banner */}
      <div className="relative mt-1 text-center">
        <div className={`text-[11px] font-black uppercase tracking-widest ${accent.text}`}>
          {classDef.emoji} {classDef.name}
        </div>
        <div className="font-display text-2xl font-black leading-tight">
          {user.displayName}
        </div>
        <div className="text-[11px] text-ink-muted">
          @{user.username} · Lv {user.level}
        </div>
      </div>

      {/* Bottom: radar + infos terrain */}
      <div className="relative mt-3 grid grid-cols-5 items-center gap-2 rounded-2xl bg-bg/50 p-3 card-chunky">
        <div className="col-span-2 flex justify-center">
          <StatRadar stats={stats} size={140} accent={accent.accent} />
        </div>
        <div className="col-span-3 space-y-1.5 text-right">
          <MiniStat label="UTMB" value={user.connections.utmb?.runnerIndex || "—"} color="text-cyan" />
          <MiniStat label="ITRA" value={user.connections.itra.performanceIndex} color="text-violet" />
          <MiniStat label="KM TOTAL" value={user.stats.totalDistance.toLocaleString("fr")} color="text-lime" />
          <MiniStat label="D+ TOTAL" value={user.stats.totalElevation.toLocaleString("fr")} color="text-peach" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[9px] font-black uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <span className={`font-display text-sm font-black ${color}`}>
        {value}
      </span>
    </div>
  );
}
