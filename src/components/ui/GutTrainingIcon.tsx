// ====== GutTrainingIcon ======
// Illustration SVG : gourde de compote (style Pom'Potes) + barre chocolatée.
// Utilisée sur l'encart "Gut Training" de la home pour identifier visuellement
// la feature de préparation digestive.

export default function GutTrainingIcon({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Compote en gourde et barre chocolatée"
    >
      <defs>
        {/* Compote — couleurs pomme rouge / verte */}
        <linearGradient id="gut-compote" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F77F00" />
          <stop offset="60%" stopColor="#E63946" />
          <stop offset="100%" stopColor="#B02828" />
        </linearGradient>
        {/* Barre chocolatée — marron */}
        <linearGradient id="gut-choco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B3410" />
          <stop offset="100%" stopColor="#3D1E08" />
        </linearGradient>
        <linearGradient id="gut-wrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDA15E" />
          <stop offset="100%" stopColor="#B8853D" />
        </linearGradient>
      </defs>

      {/* === BARRE CHOCOLATÉE (à gauche, en arrière-plan, légèrement inclinée) === */}
      <g transform="translate(8 44) rotate(-12)">
        {/* Emballage doré déchiré au bout */}
        <rect
          x="0"
          y="0"
          width="38"
          height="14"
          rx="2"
          fill="url(#gut-wrap)"
          stroke="#3D1E08"
          strokeWidth="1.2"
        />
        {/* Choco apparent au bout droit */}
        <rect
          x="24"
          y="2"
          width="14"
          height="10"
          rx="1"
          fill="url(#gut-choco)"
          stroke="#1A0B03"
          strokeWidth="0.8"
        />
        {/* Carrés de chocolat (effet tablette) */}
        <line
          x1="28"
          y1="2"
          x2="28"
          y2="12"
          stroke="#1A0B03"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <line
          x1="32"
          y1="2"
          x2="32"
          y2="12"
          stroke="#1A0B03"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <line
          x1="36"
          y1="2"
          x2="36"
          y2="12"
          stroke="#1A0B03"
          strokeWidth="0.6"
          opacity="0.6"
        />
        {/* Étiquette centrée sur l'emballage */}
        <text
          x="10"
          y="9"
          fontFamily="ui-monospace, monospace"
          fontSize="5"
          fontWeight="900"
          fill="#3D1E08"
          letterSpacing="0.5"
        >
          ENERGY
        </text>
      </g>

      {/* === GOURDE COMPOTE (au premier plan) === */}
      <g transform="translate(34 12)">
        {/* Bouchon */}
        <rect
          x="14"
          y="0"
          width="10"
          height="9"
          rx="1.5"
          fill="#FEFAE0"
          stroke="#0B1D0E"
          strokeWidth="1.4"
        />
        {/* Cou bouchon */}
        <rect
          x="16"
          y="6"
          width="6"
          height="4"
          fill="#FEFAE0"
          stroke="#0B1D0E"
          strokeWidth="1.4"
        />
        {/* Corps gourde (forme bombée style Pom'Potes) */}
        <path
          d="M 4 14 Q 4 10 12 10 L 26 10 Q 34 10 34 14 L 34 50 Q 34 60 19 60 Q 4 60 4 50 Z"
          fill="url(#gut-compote)"
          stroke="#0B1D0E"
          strokeWidth="1.6"
        />
        {/* Reflet brillant */}
        <path
          d="M 8 18 Q 8 14 14 14 L 14 35 Q 10 38 8 36 Z"
          fill="#FEFAE0"
          opacity="0.25"
        />
        {/* Étiquette "POM" centrée */}
        <rect
          x="9"
          y="26"
          width="20"
          height="14"
          rx="2"
          fill="#FEFAE0"
          stroke="#0B1D0E"
          strokeWidth="1.2"
        />
        {/* Pomme stylisée sur l'étiquette */}
        <circle cx="14" cy="33" r="2.5" fill="#2D6A4F" />
        <path
          d="M 14 30.5 Q 14.8 29.5 15.5 30"
          stroke="#0B1D0E"
          strokeWidth="0.8"
          fill="none"
        />
        {/* Texte "POM" à droite de la pomme */}
        <text
          x="18"
          y="35.5"
          fontFamily="ui-sans-serif, system-ui"
          fontSize="6"
          fontWeight="900"
          fill="#0B1D0E"
          letterSpacing="0.3"
        >
          POM
        </text>
        {/* Indication g de glucides en bas */}
        <text
          x="19"
          y="53"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="5"
          fontWeight="800"
          fill="#FEFAE0"
          opacity="0.95"
          letterSpacing="0.4"
        >
          25g · 100kcal
        </text>
      </g>

      {/* Quelques petites particules d'énergie autour pour le dynamisme */}
      <g fill="#F77F00" opacity="0.7">
        <circle cx="68" cy="20" r="1.4" />
        <circle cx="72" cy="34" r="1" />
        <circle cx="10" cy="28" r="1.2" />
      </g>
    </svg>
  );
}
