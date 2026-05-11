// ====== TQLogo — Logo Esprit Trail officiel (variante K) ======
// Direction K choisie le 2 mai 2026 : 3 pics étagés + sentier sinueux orange,
// soleil orange en arrière-plan. Pas de R en filigrane. Wordmark "ESPRIT TRAIL" en
// dessous pour le BrandLogoFull.

import Link from "next/link";

const COLORS = {
  ink: "#0B1D0E",
  forest: "#1B4332",
  sage: "#2D6A4F",
  cream: "#F0E6C8",
  orange: "#F77F00",
};

// ============================================================================
// SVG icône — single source of truth pour les pics + sentier (paths fidèles K)
// ============================================================================
function PicsTrailSvg({
  withBackground = true,
  size = 64,
}: {
  withBackground?: boolean;
  size?: number;
}) {
  const radius = withBackground ? Math.round(size * 0.176) : 0;
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {withBackground && (
        <rect width="1024" height="1024" rx={radius * (1024 / size)} fill={COLORS.forest} />
      )}
      {/* Soleil */}
      <circle cx="780" cy="280" r="90" fill={COLORS.orange} opacity="0.9" />
      {/* 3 pics étagés */}
      <g stroke={COLORS.ink} strokeWidth="7" strokeLinejoin="round">
        <path d="M 100 720 L 250 460 L 380 580 L 380 720 Z" fill={COLORS.sage} />
        <path
          d="M 280 720 L 540 250 L 720 480 L 800 380 L 920 720 Z"
          fill={withBackground ? COLORS.cream : COLORS.forest}
        />
        <path d="M 700 720 L 820 540 L 924 720 Z" fill={COLORS.sage} opacity="0.85" />
      </g>
      {/* Sentier sinueux orange */}
      <path
        d="M 80 820 Q 250 780 400 820 T 700 800 T 944 830"
        fill="none"
        stroke={COLORS.orange}
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Points de marche */}
      <g fill={COLORS.orange}>
        <circle cx="160" cy="800" r="6" />
        <circle cx="320" cy="810" r="6" />
        <circle cx="500" cy="810" r="6" />
        <circle cx="660" cy="800" r="6" />
        <circle cx="820" cy="820" r="6" />
      </g>
    </svg>
  );
}

// ============================================================================
// Icône seule — utile en favicon, badges, hors lockup
// ============================================================================
export function BrandLogoIcon({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block leading-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Esprit Trail"
    >
      <PicsTrailSvg withBackground size={size} />
    </span>
  );
}

// ============================================================================
// Header logo — icône à gauche + wordmark "Esprit Trail" à droite
// ============================================================================
export default function TQLogo({
  size = 36,
  showBaseline = false,
  asLink = true,
}: {
  size?: number;
  showBaseline?: boolean;
  asLink?: boolean;
}) {
  const Inner = (
    <>
      <BrandLogoIcon size={size} />
      <div className="leading-none">
        <span className="block font-display text-lg font-black tracking-tight text-ink">
          Esprit Trail
        </span>
        {showBaseline && (
          <span className="mt-0.5 block text-[9px] font-mono font-bold uppercase tracking-widest text-lime">
            Coach trail · Plans · Spots
          </span>
        )}
      </div>
    </>
  );

  if (asLink) {
    return (
      <Link
        href="/about"
        aria-label="À propos de Esprit Trail"
        className="group flex items-center gap-2 transition hover:scale-[1.02]"
      >
        {Inner}
      </Link>
    );
  }

  return <div className="flex items-center gap-2">{Inner}</div>;
}

// ============================================================================
// Grand logo plein — icône en haut + wordmark ESPRIT TRAIL + tagline en bas
// Pour /login, /signup, /about hero, splash.
// ============================================================================
export function BrandLogoFull({
  width = 220,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 ${className}`}
      style={{ width }}
    >
      <BrandLogoIcon size={width} />
      <div className="text-center leading-none">
        <span
          className="block font-display font-black tracking-tight text-ink"
          style={{ fontSize: Math.round(width * 0.18) }}
        >
          ESPRIT TRAIL
        </span>
        <span
          className="mt-1 block font-mono font-bold uppercase tracking-widest text-lime"
          style={{
            fontSize: Math.max(9, Math.round(width * 0.05)),
            letterSpacing: "0.18em",
          }}
        >
          Coach Trail · FR
        </span>
      </div>
    </div>
  );
}
