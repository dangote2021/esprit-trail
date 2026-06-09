// ====== TrailerDefaultAvatar ======
// SVG vectoriel utilisé comme avatar par défaut au lieu de l'emoji renard 🦊.
// Silhouette stylisée d'un traileur avec casquette verte, écouteurs/lunettes
// et look "punk montagne". S'adapte à la taille en prop.
//
// Utilisé dans AvatarUpload (fallback hors upload utilisateur).

export default function TrailerDefaultAvatar({ size = 96 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar traileur avec casquette verte"
    >
      {/* Fond circulaire dégradé chaud (coucher de soleil derrière le runner) */}
      <defs>
        <radialGradient id="bg-trailer" cx="50%" cy="65%" r="65%">
          <stop offset="0%" stopColor="#FEFAE0" />
          <stop offset="55%" stopColor="#FFD89C" />
          <stop offset="100%" stopColor="#F77F00" />
        </radialGradient>
        <linearGradient id="cap-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FA86F" />
          <stop offset="100%" stopColor="#1B4332" />
        </linearGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1C9A5" />
          <stop offset="100%" stopColor="#D8A47F" />
        </linearGradient>
      </defs>

      {/* Cercle de fond */}
      <circle cx="60" cy="60" r="60" fill="url(#bg-trailer)" />

      {/* Silhouette de montagnes à l'arrière */}
      <path
        d="M 0 90 L 25 65 L 45 80 L 65 55 L 90 78 L 120 60 L 120 120 L 0 120 Z"
        fill="#1B4332"
        opacity="0.45"
      />
      <path
        d="M 0 100 Q 30 85 60 95 T 120 95 L 120 120 L 0 120 Z"
        fill="#0B1D0E"
        opacity="0.55"
      />

      {/* === LE TRAILEUR === */}
      {/* Cou / haut du t-shirt */}
      <path
        d="M 50 92 L 50 105 L 70 105 L 70 92 Z"
        fill="#2D6A4F"
      />
      {/* Encolure t-shirt */}
      <path d="M 53 92 Q 60 96 67 92" stroke="#0B1D0E" strokeWidth="1" fill="none" opacity="0.5" />

      {/* Visage (rond, légèrement bronzé) */}
      <circle cx="60" cy="76" r="18" fill="url(#skin)" />
      {/* Ombrage sous casquette */}
      <path
        d="M 42 76 Q 60 88 78 76 L 78 60 L 42 60 Z"
        fill="#0B1D0E"
        opacity="0.15"
      />

      {/* === CASQUETTE VERTE === */}
      {/* Visière */}
      <path
        d="M 36 68 Q 60 64 84 68 L 80 73 Q 60 70 40 73 Z"
        fill="#1B4332"
      />
      {/* Calot de la casquette */}
      <path
        d="M 38 68 Q 38 50 60 48 Q 82 50 82 68 Z"
        fill="url(#cap-green)"
      />
      {/* Bande blanche/logo */}
      <rect x="55" y="56" width="10" height="3" rx="1" fill="#FEFAE0" opacity="0.95" />
      {/* Surpiqûres */}
      <path
        d="M 60 48 L 60 68"
        stroke="#0B1D0E"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* === LUNETTES DE SOLEIL === */}
      <rect x="46" y="74" width="11" height="7" rx="2" fill="#0B1D0E" />
      <rect x="63" y="74" width="11" height="7" rx="2" fill="#0B1D0E" />
      <line x1="57" y1="76" x2="63" y2="76" stroke="#0B1D0E" strokeWidth="1.2" />
      {/* Reflet sur lunettes */}
      <rect x="48" y="75" width="3" height="2" rx="0.5" fill="#FFD89C" opacity="0.7" />
      <rect x="65" y="75" width="3" height="2" rx="0.5" fill="#FFD89C" opacity="0.7" />

      {/* Bouche détendue (légère expression) */}
      <path
        d="M 55 87 Q 60 90 65 87"
        stroke="#0B1D0E"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Petite barbe naissante (3 jours) */}
      <g opacity="0.25" fill="#0B1D0E">
        <circle cx="53" cy="86" r="0.5" />
        <circle cx="55" cy="88" r="0.5" />
        <circle cx="58" cy="89" r="0.5" />
        <circle cx="61" cy="89" r="0.5" />
        <circle cx="64" cy="88" r="0.5" />
        <circle cx="66" cy="86" r="0.5" />
      </g>

      {/* Cheveux qui dépassent sur les côtés (mulet discret) */}
      <path
        d="M 40 78 Q 38 84 41 90 L 44 88 Q 43 82 44 78 Z"
        fill="#5C3A21"
        opacity="0.85"
      />
      <path
        d="M 80 78 Q 82 84 79 90 L 76 88 Q 77 82 76 78 Z"
        fill="#5C3A21"
        opacity="0.85"
      />
    </svg>
  );
}
