// ====== CHARACTER AVATAR — SVG paramétré (mode SIMS) ======
// Rendu d'un petit traileur stylisé avec casquette + tshirt + short + chaussures.
// 100% SVG, zéro dépendance. Scale via `size`.

import {
  Character,
  SHOE_BRANDS,
  HAT_BRANDS,
  SKIN_TONES,
} from "@/lib/character";

export function CharacterAvatar({
  character,
  size = 120,
  className = "",
  showGround = true,
}: {
  character: Character;
  size?: number;
  className?: string;
  showGround?: boolean;
}) {
  const skin = SKIN_TONES.find((s) => s.id === character.skinTone)!.color;
  const shoeBrand = SHOE_BRANDS[character.shoeBrand];
  const hatBrand = HAT_BRANDS[character.hatBrand];

  return (
    <svg
      viewBox="0 0 200 280"
      width={size}
      height={(size * 280) / 200}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground shadow */}
      {showGround && (
        <ellipse
          cx="100"
          cy="265"
          rx="55"
          ry="7"
          fill="#000"
          opacity="0.25"
        />
      )}

      {/* ====== JAMBES ====== */}
      {/* Left leg */}
      <rect x="78" y="185" width="18" height="55" rx="6" fill={skin} />
      {/* Right leg */}
      <rect x="104" y="185" width="18" height="55" rx="6" fill={skin} />

      {/* ====== CHAUSSURES ====== */}
      {/* Left shoe */}
      <g>
        <path
          d={`M 70 245 Q 70 238 78 235 L 100 235 Q 108 240 108 252 L 108 258 Q 108 262 104 262 L 74 262 Q 70 262 70 258 Z`}
          fill={character.shoeColor}
        />
        {/* Sole */}
        <rect
          x="70"
          y="258"
          width="38"
          height="4"
          rx="2"
          fill="#ffffff"
          opacity="0.9"
        />
        {/* Brand text on shoe */}
        <text
          x="89"
          y="253"
          fontSize="7"
          fontWeight="900"
          fontFamily="monospace"
          fill={shoeBrand.textColor}
          textAnchor="middle"
        >
          {shoeBrand.short}
        </text>
      </g>

      {/* Right shoe */}
      <g>
        <path
          d={`M 92 245 Q 92 238 100 235 L 122 235 Q 130 240 130 252 L 130 258 Q 130 262 126 262 L 96 262 Q 92 262 92 258 Z`}
          fill={character.shoeColor}
        />
        <rect
          x="92"
          y="258"
          width="38"
          height="4"
          rx="2"
          fill="#ffffff"
          opacity="0.9"
        />
        <text
          x="111"
          y="253"
          fontSize="7"
          fontWeight="900"
          fontFamily="monospace"
          fill={shoeBrand.textColor}
          textAnchor="middle"
        >
          {shoeBrand.short}
        </text>
      </g>

      {/* ====== SHORT ====== */}
      <path
        d={`M 70 160 L 130 160 L 132 195 L 105 195 L 103 185 L 97 185 L 95 195 L 68 195 Z`}
        fill={character.shortsColor}
      />
      {/* Short accent stripe */}
      <path
        d={`M 72 163 L 128 163`}
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* ====== TORSE / TSHIRT ====== */}
      {/* Arms */}
      <rect x="54" y="100" width="16" height="58" rx="8" fill={skin} />
      <rect x="130" y="100" width="16" height="58" rx="8" fill={skin} />

      {/* Tshirt body */}
      <path
        d={`M 62 95 L 138 95 L 142 165 L 58 165 Z`}
        fill={character.shirtColor}
      />
      {/* Tshirt short sleeves */}
      <path
        d={`M 54 95 L 70 95 L 70 115 L 52 115 Z`}
        fill={character.shirtColor}
      />
      <path
        d={`M 130 95 L 146 95 L 148 115 L 130 115 Z`}
        fill={character.shirtColor}
      />
      {/* Neck hole */}
      <ellipse cx="100" cy="97" rx="10" ry="5" fill={skin} />
      {/* Tshirt optional brand chest text */}
      {character.shirtBrand && character.shirtBrand !== "none" && (
        <text
          x="100"
          y="130"
          fontSize="9"
          fontWeight="900"
          fontFamily="monospace"
          fill="#ffffff"
          textAnchor="middle"
          opacity="0.85"
        >
          {character.shirtBrand.toUpperCase()}
        </text>
      )}

      {/* ====== COU ====== */}
      <rect x="92" y="78" width="16" height="18" fill={skin} />

      {/* ====== TÊTE ====== */}
      {/* Neck shadow */}
      <ellipse cx="100" cy="96" rx="10" ry="3" fill="#000" opacity="0.15" />
      {/* Head */}
      <circle cx="100" cy="62" r="26" fill={skin} />
      {/* Ears */}
      <circle cx="76" cy="62" r="4" fill={skin} />
      <circle cx="124" cy="62" r="4" fill={skin} />

      {/* ====== CHEVEUX (visible si pas de casquette OU sous casquette) ====== */}
      {character.hatBrand === "none" ? (
        // Full hair
        <path
          d={`M 75 50 Q 75 34 100 34 Q 125 34 125 50 Q 125 55 123 58 L 77 58 Q 75 55 75 50 Z`}
          fill={character.hairColor}
        />
      ) : (
        // Hair peeking out from under cap (sides + back)
        <>
          <path
            d={`M 74 60 Q 75 52 80 50 L 82 60 Z`}
            fill={character.hairColor}
          />
          <path
            d={`M 126 60 Q 125 52 120 50 L 118 60 Z`}
            fill={character.hairColor}
          />
        </>
      )}

      {/* ====== CASQUETTE ====== */}
      {character.hatBrand !== "none" && (
        <g>
          {/* Crown */}
          <path
            d={`M 72 48 Q 72 30 100 30 Q 128 30 128 48 L 128 56 L 72 56 Z`}
            fill={character.hatColor}
          />
          {/* Visor */}
          <path
            d={`M 68 54 Q 68 58 75 58 L 138 58 Q 142 58 140 54 L 128 50 L 72 50 Z`}
            fill={character.hatColor}
          />
          {/* Visor underside shadow */}
          <path
            d={`M 68 54 L 140 54 L 140 58 L 68 58 Z`}
            fill="#000"
            opacity="0.18"
          />
          {/* Brand text on cap front */}
          {hatBrand.short && (
            <text
              x="100"
              y="48"
              fontSize="9"
              fontWeight="900"
              fontFamily="monospace"
              fill={hatBrand.textColor}
              textAnchor="middle"
            >
              {hatBrand.short}
            </text>
          )}
        </g>
      )}

      {/* ====== VISAGE ====== */}
      {/* Eyes — hidden if sunglasses accessory */}
      {character.accessory !== "sunglasses" ? (
        <>
          <circle cx="91" cy="66" r="1.8" fill="#1a1a1a" />
          <circle cx="109" cy="66" r="1.8" fill="#1a1a1a" />
        </>
      ) : (
        <g>
          {/* Sunglasses */}
          <rect x="82" y="62" width="15" height="8" rx="2" fill="#1a1a1a" />
          <rect x="103" y="62" width="15" height="8" rx="2" fill="#1a1a1a" />
          <rect x="97" y="65" width="6" height="1.5" fill="#1a1a1a" />
          {/* Highlight on lenses */}
          <rect x="84" y="64" width="3" height="2" fill="#22d3ee" opacity="0.7" />
          <rect x="105" y="64" width="3" height="2" fill="#22d3ee" opacity="0.7" />
        </g>
      )}

      {/* Mouth — slight smile */}
      <path
        d={`M 95 76 Q 100 79 105 76`}
        stroke="#1a1a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ====== HEADBAND accessory ====== */}
      {character.accessory === "headband" && character.hatBrand === "none" && (
        <rect
          x="75"
          y="50"
          width="50"
          height="6"
          fill={character.hatColor}
        />
      )}

      {/* ====== WATCH accessory (left wrist) ====== */}
      {character.accessory === "watch" && (
        <g>
          <rect x="51" y="150" width="22" height="14" rx="3" fill="#1a1a1a" />
          <rect x="54" y="153" width="16" height="8" rx="1" fill="#22d3ee" />
          <text
            x="62"
            y="160"
            fontSize="5"
            fontWeight="900"
            fontFamily="monospace"
            fill="#0a0f1c"
            textAnchor="middle"
          >
            GPS
          </text>
        </g>
      )}
    </svg>
  );
}
