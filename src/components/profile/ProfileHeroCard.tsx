"use client";

// ====== ProfileHeroCard ======
// Carte hero du profil, style Panini moderne sans personnage trail :
// - Cover picture en bannière (uploadable, fallback dégradé palette)
// - Photo de profil ronde en avant-plan centrée, chevauchant la cover
// - Nom + pseudo + tagline en dessous
// - Mini stats clés (km/sem, prochaine course, etc.)

import AvatarUpload from "./AvatarUpload";
import CoverUpload from "./CoverUpload";

interface Props {
  displayName: string;
  username: string;
  fallbackEmoji?: string;
  tagline?: string;
  stats?: {
    label: string;
    value: string | number;
    color?: "lime" | "peach" | "cyan" | "violet";
  }[];
}

export default function ProfileHeroCard({
  displayName,
  username,
  fallbackEmoji = "🦊",
  tagline,
  stats = [],
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-ink/10 bg-bg-card shadow-lg">
      {/* COVER en bannière */}
      <CoverUpload height={180} />

      {/* AVATAR — superposé entre cover et contenu, centré */}
      <div className="relative -mt-14 flex justify-center z-10">
        <div className="rounded-full border-4 border-bg-card shadow-xl bg-bg-card">
          <AvatarUpload fallbackEmoji={fallbackEmoji} size={104} />
        </div>
      </div>

      {/* INFOS — nom, pseudo, tagline */}
      <div className="px-4 pb-4 pt-2 text-center">
        <div className="font-display text-2xl font-black text-ink leading-tight">
          {displayName}
        </div>
        <div className="text-[11px] font-mono text-ink-muted mt-0.5">
          @{username}
        </div>
        {tagline && (
          <div className="mt-2 text-xs italic text-ink leading-relaxed">
            « {tagline} »
          </div>
        )}
      </div>

      {/* STATS — petite barre en bas, style Panini */}
      {stats.length > 0 && (
        <div className="grid border-t-2 border-ink/5" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))` }}>
          {stats.map((s, i) => {
            const colorClass = {
              lime: "text-lime",
              peach: "text-peach",
              cyan: "text-cyan",
              violet: "text-violet",
            }[s.color || "lime"];
            return (
              <div
                key={i}
                className={`p-3 text-center ${i > 0 ? "border-l-2 border-ink/5" : ""}`}
              >
                <div className={`font-display text-xl font-black ${colorClass} leading-none`}>
                  {s.value}
                </div>
                <div className="mt-1 text-[9px] font-mono uppercase tracking-widest text-ink-muted">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
