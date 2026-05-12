// ====== BibIcon — Dossard épinglé sur t-shirt rose (style Clem qui court) ======
// SVG d'un t-shirt rose technique avec un dossard de course épinglé dessus +
// numéro. Utilisé sur la home pour la feature "Dossards en jeu".

export default function BibIcon({
  size = 48,
  number = "001",
  shirtColor = "#FF6FB8", // rose Clem
  shirtShadow = "#C84B92",
  bibColor = "#FEFAE0", // blanc cassé / dossard officiel
  numberColor = "#0B1D0E",
  pinColor = "#2D6A4F",
  borderColor = "#0B1D0E",
  className = "",
}: {
  size?: number;
  number?: string;
  shirtColor?: string;
  shirtShadow?: string;
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
      aria-label="Dossard épinglé sur t-shirt rose"
    >
      <defs>
        <linearGradient id="shirt-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shirtColor} />
          <stop offset="100%" stopColor={shirtShadow} />
        </linearGradient>
      </defs>

      {/* === T-SHIRT ROSE TECHNIQUE === */}
      {/* Manches courtes (épaules qui dépassent) */}
      <path
        d="M 4 18 L 12 14 L 18 22 L 12 26 Z"
        fill="url(#shirt-grad)"
        stroke={borderColor}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M 60 18 L 52 14 L 46 22 L 52 26 Z"
        fill="url(#shirt-grad)"
        stroke={borderColor}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Corps du t-shirt (forme légèrement évasée comme un running shirt) */}
      <path
        d="M 14 16
           L 22 12
           Q 26 11 32 11
           Q 38 11 42 12
           L 50 16
           L 50 58
           L 14 58
           Z"
        fill="url(#shirt-grad)"
        stroke={borderColor}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Encolure ronde */}
      <path
        d="M 26 12 Q 32 16 38 12"
        stroke={borderColor}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Trim de l'encolure (col blanc subtil) */}
      <path
        d="M 26.5 13.5 Q 32 17 37.5 13.5"
        stroke={bibColor}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />

      {/* Petits plis sous les manches (détail technique) */}
      <path
        d="M 16 22 L 18 28"
        stroke={shirtShadow}
        strokeWidth="0.6"
        opacity="0.5"
      />
      <path
        d="M 48 22 L 46 28"
        stroke={shirtShadow}
        strokeWidth="0.6"
        opacity="0.5"
      />

      {/* === DOSSARD ÉPINGLÉ AU CENTRE === */}
      {/* Dossard corps */}
      <rect
        x="18"
        y="24"
        width="28"
        height="26"
        rx="1.5"
        fill={bibColor}
        stroke={borderColor}
        strokeWidth="1.4"
      />

      {/* Bande supérieure verte (style sponsor / fédération) */}
      <rect
        x="18"
        y="24"
        width="28"
        height="5"
        fill={pinColor}
        opacity="0.9"
      />

      {/* "BOUZIN" en gros au-dessus du numéro, sur le dossard */}
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="4.5"
        fontWeight="900"
        fill={numberColor}
        letterSpacing="0.12em"
        opacity="0.95"
      >
        BOUZIN
      </text>

      {/* Numéro central */}
      <text
        x="32"
        y="48"
        textAnchor="middle"
        fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        fontSize="10"
        fontWeight="900"
        fill={numberColor}
        letterSpacing="0.04em"
      >
        {number}
      </text>

      {/* 4 épingles aux coins du dossard */}
      <g>
        <circle cx="21" cy="27" r="1.6" fill={borderColor} />
        <circle cx="21" cy="27" r="0.6" fill={bibColor} />
        <circle cx="43" cy="27" r="1.6" fill={borderColor} />
        <circle cx="43" cy="27" r="0.6" fill={bibColor} />
        <circle cx="21" cy="47" r="1.6" fill={borderColor} />
        <circle cx="21" cy="47" r="0.6" fill={bibColor} />
        <circle cx="43" cy="47" r="1.6" fill={borderColor} />
        <circle cx="43" cy="47" r="0.6" fill={bibColor} />
      </g>

      {/* Petit effet brillant sur le tissu du t-shirt en bas */}
      <path
        d="M 16 54 Q 20 56 24 54"
        stroke={shirtShadow}
        strokeWidth="0.5"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}
