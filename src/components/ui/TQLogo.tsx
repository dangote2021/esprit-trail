// ====== TQLogo — Logo Esprit Trail officiel (runner-sunset) ======
// Logo V8 : silhouette runner noire + soleil orange brossé + montagnes
// enneigées noir/blanc/gris + éclaboussures. Style stencil / sérigraphie.
// Image PNG haute résolution servie depuis /icon-1024.png (Vercel cache CDN).

import Link from "next/link";
// eslint-disable-next-line @next/next/no-img-element
// On utilise <img> natif (pas next/image) pour éviter les configs domains et
// parce que l'icône est déjà optimisée + cachée sur le CDN Vercel.

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
      className={`inline-block leading-none overflow-hidden rounded-2xl ${className}`}
      style={{ width: size, height: size }}
      aria-label="Esprit Trail"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon-512.png"
        alt="Esprit Trail"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "cover" }}
        loading="eager"
      />
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
