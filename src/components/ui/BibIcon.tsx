// ====== BibIcon — Dossard de course stylisé ======
// SVG d'un dossard de course classique avec 4 épingles aux coins + numéro.
// Utilisé sur la home pour la feature "Dossards en jeu".

export default function BibIcon({
  size = 48,
  number = "001",
  bibColor = "#FFFFFF",
  numberColor = "#0B1D0E",
  pinColor = "#2D6A4F",
  borderColor = "#0B1D0E",
  className = "",
}: {
  size?: number;
  number?: string;
  bibColor?: string;
  numberColor?: string;
  pinColor?: string;
  borderColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Dossard de course"
    >
      {/* Dossard corps (rectangle blanc avec coins légèrement arrondis) */}
      <rect
        x="6"
        y="10"
        width="52"
        height="44"
        rx="3"
        fill={bibColor}
        stroke={borderColor}
        strokeWidth="2"
      />

      {/* Bande horizontale haute (style F.F.A. / sponsor) */}
      <rect
        x="6"
        y="10"
        width="52"
        height="9"
        fill={pinColor}
        opacity="0.85"
      />

      {/* Numéro central */}
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        fontSize="20"
        fontWeight="900"
        fill={numberColor}
        letterSpacing="0.04em"
      >
        {number}
      </text>

      {/* 4 épingles aux coins (cercles noirs avec point clair) */}
      <g>
        <circle cx="13" cy="17" r="2.5" fill={borderColor} />
        <circle cx="13" cy="17" r="0.9" fill={bibColor} />
        <circle cx="51" cy="17" r="2.5" fill={borderColor} />
        <circle cx="51" cy="17" r="0.9" fill={bibColor} />
        <circle cx="13" cy="47" r="2.5" fill={borderColor} />
        <circle cx="13" cy="47" r="0.9" fill={bibColor} />
        <circle cx="51" cy="47" r="2.5" fill={borderColor} />
        <circle cx="51" cy="47" r="0.9" fill={bibColor} />
      </g>

      {/* Ligne décorative bas pour rappel logo course */}
      <line
        x1="14"
        y1="50"
        x2="50"
        y2="50"
        stroke={borderColor}
        strokeWidth="1"
        strokeDasharray="2 1.5"
        opacity="0.4"
      />
    </svg>
  );
}
