// ====== CHARACTER AVATAR — style jeu vidéo / Super Mario ======
// Proportions chibi (grosse tête, corps trapu), outlines épaisses,
// couleurs saturées, gants cartoon blancs. Mobile-first, 100% SVG.

import {
  Character,
  SHOE_BRANDS,
  HAT_BRANDS,
  SKIN_TONES,
} from "@/lib/character";

const OUTLINE = "#0a0f1c";
const STROKE = 3.2;

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
  const hasHat = character.hatBrand !== "none";

  // Darker shade of shirt for tshirt shadow
  const shirt = character.shirtColor;
  const shirtShade = darken(shirt, 0.25);
  const hatShade = darken(character.hatColor, 0.25);
  const shoeShade = darken(character.shoeColor, 0.3);
  const shortsShade = darken(character.shortsColor, 0.3);

  return (
    <svg
      viewBox="0 0 200 280"
      width={size}
      height={(size * 280) / 200}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <filter id="char-drop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="1.5" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ============ GROUND SHADOW ============ */}
      {showGround && (
        <ellipse
          cx="100"
          cy="268"
          rx="62"
          ry="7"
          fill="#000"
          opacity="0.35"
        />
      )}

      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#char-drop)"
      >
        {/* ============ LEGS (trapues) ============ */}
        {/* Back leg (right) — derrière pour profondeur */}
        <path
          d="M 108 195 Q 108 192 113 192 L 126 192 Q 131 192 131 197 L 131 238 Q 131 244 125 244 L 114 244 Q 108 244 108 238 Z"
          fill={character.shortsColor}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />
        {/* Front leg (left) */}
        <path
          d="M 69 195 Q 69 192 74 192 L 87 192 Q 92 192 92 197 L 92 238 Q 92 244 86 244 L 75 244 Q 69 244 69 238 Z"
          fill={character.shortsColor}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />

        {/* ============ SHOES (grosses, bulbeuses type Mario) ============ */}
        {/* Back shoe */}
        <g>
          <ellipse
            cx="120"
            cy="252"
            rx="22"
            ry="11"
            fill={character.shoeColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          {/* Semelle */}
          <path
            d="M 100 255 Q 100 262 115 262 L 136 262 Q 142 262 142 255 Z"
            fill={shoeShade}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          {/* Highlight */}
          <ellipse
            cx="115"
            cy="247"
            rx="8"
            ry="2.5"
            fill="#ffffff"
            opacity="0.55"
          />
        </g>
        {/* Front shoe */}
        <g>
          <ellipse
            cx="82"
            cy="252"
            rx="22"
            ry="11"
            fill={character.shoeColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          <path
            d="M 62 255 Q 62 262 77 262 L 98 262 Q 104 262 104 255 Z"
            fill={shoeShade}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          <ellipse
            cx="78"
            cy="247"
            rx="9"
            ry="2.5"
            fill="#ffffff"
            opacity="0.7"
          />
          {/* Brand text visible sur chaussure avant */}
          <text
            x="82"
            y="254"
            fontSize="7"
            fontWeight="900"
            fontFamily="monospace"
            fill="#ffffff"
            textAnchor="middle"
            opacity="0.95"
          >
            {shoeBrand.short}
          </text>
        </g>

        {/* ============ SHORTS / SALOPETTE (trapu Mario-style) ============ */}
        <path
          d="M 62 165 Q 62 160 68 160 L 132 160 Q 138 160 138 165 L 140 200 Q 140 205 134 205 L 104 205 L 102 196 Q 100 194 98 196 L 96 205 L 66 205 Q 60 205 60 200 Z"
          fill={character.shortsColor}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />
        {/* Shorts shading */}
        <path
          d="M 66 195 L 134 195"
          stroke={shortsShade}
          strokeWidth="2"
          opacity="0.6"
        />
        {/* Drawcord du short trail */}
        <path
          d="M 92 168 Q 100 173 108 168"
          stroke={shortsShade}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="92" cy="169" r="1.8" fill={shortsShade} />
        <circle cx="108" cy="169" r="1.8" fill={shortsShade} />

        {/* ============ ARMS (avec manches + gants blancs Mario) ============ */}
        {/* Back arm (right) */}
        <g>
          {/* Upper sleeve */}
          <rect
            x="128"
            y="115"
            width="18"
            height="30"
            rx="7"
            fill={character.shirtColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          {/* Forearm skin */}
            <rect
            x="130"
            y="142"
            width="14"
            height="22"
            rx="6"
            fill={skin}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          {/* Glove cartoon blanc */}
          <circle
            cx="137"
            cy="170"
            r="10"
            fill="#ffffff"
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          {/* Glove thumb indent */}
          <path
            d="M 142 166 Q 145 168 145 172"
            stroke={OUTLINE}
            strokeWidth="1.8"
            fill="none"
          />
        </g>
        {/* Front arm (left) */}
        <g>
          <rect
            x="54"
            y="115"
            width="18"
            height="30"
            rx="7"
            fill={character.shirtColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          <rect
            x="56"
            y="142"
            width="14"
            height="22"
            rx="6"
            fill={skin}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          <circle
            cx="63"
            cy="170"
            r="10"
            fill="#ffffff"
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          <path
            d="M 58 166 Q 55 168 55 172"
            stroke={OUTLINE}
            strokeWidth="1.8"
            fill="none"
          />
        </g>

        {/* ============ TORSO / TSHIRT (trapu chibi) ============ */}
        <path
          d="M 62 115 Q 62 108 72 108 L 128 108 Q 138 108 138 115 L 140 168 Q 140 172 135 172 L 65 172 Q 60 172 60 168 Z"
          fill={character.shirtColor}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />
        {/* Tshirt shading bottom */}
        <path
          d="M 62 160 L 138 160 L 140 168 L 60 168 Z"
          fill={shirtShade}
          opacity="0.45"
        />
        {/* Brand chest text */}
        {character.shirtBrand && character.shirtBrand !== "none" && (
          <text
            x="100"
            y="143"
            fontSize="11"
            fontWeight="900"
            fontFamily="monospace"
            fill="#ffffff"
            textAnchor="middle"
            stroke={OUTLINE}
            strokeWidth="0.6"
            paintOrder="stroke"
          >
            {character.shirtBrand.toUpperCase()}
          </text>
        )}

        {/* ============ NECK ============ */}
        <rect
          x="88"
          y="96"
          width="24"
          height="18"
          fill={skin}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />

        {/* ============ HEAD (grosse, chibi, rond) ============ */}
        <circle
          cx="100"
          cy="64"
          r="38"
          fill={skin}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />
        {/* Ears */}
        <ellipse
          cx="64"
          cy="66"
          rx="5"
          ry="7"
          fill={skin}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />
        <ellipse
          cx="136"
          cy="66"
          rx="5"
          ry="7"
          fill={skin}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />

        {/* ============ HAIR ============ */}
        {!hasHat ? (
          // Full hair — volume cartoon
          <path
            d="M 66 50 Q 68 28 100 26 Q 132 28 134 50 Q 134 56 130 58 L 70 58 Q 66 56 66 50 Z"
            fill={character.hairColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
        ) : (
          // Mèches qui dépassent sous la casquette (côtés + nuque)
          <>
            <path
              d="M 64 62 Q 66 56 72 55 L 75 65 Z"
              fill={character.hairColor}
              stroke={OUTLINE}
              strokeWidth="2"
            />
            <path
              d="M 136 62 Q 134 56 128 55 L 125 65 Z"
              fill={character.hairColor}
              stroke={OUTLINE}
              strokeWidth="2"
            />
          </>
        )}

        {/* ============ CAP (style Mario, dôme + grosse visière) ============ */}
        {hasHat && (
          <g>
            {/* Dôme arrondi */}
            <path
              d="M 64 50 Q 64 22 100 22 Q 136 22 136 50 L 136 56 L 64 56 Z"
              fill={character.hatColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Bandeau du dôme (shade) */}
            <path
              d="M 66 50 L 134 50 L 134 56 L 66 56 Z"
              fill={hatShade}
              opacity="0.4"
            />
            {/* Visière large type Mario */}
            <path
              d="M 52 56 Q 52 50 62 50 L 138 50 Q 148 50 148 56 Q 148 62 138 62 L 62 62 Q 52 62 52 56 Z"
              fill={character.hatColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Visière shadow dessous */}
            <path
              d="M 54 58 L 146 58 L 146 62 L 54 62 Z"
              fill={OUTLINE}
              opacity="0.2"
            />
            {/* Badge rond type Mario "M" sur le front */}
            <circle
              cx="100"
              cy="40"
              r="12"
              fill="#ffffff"
              stroke={OUTLINE}
              strokeWidth="2.5"
            />
            <text
              x="100"
              y="45"
              fontSize="14"
              fontWeight="900"
              fontFamily="monospace"
              fill={hatBrand.textColor === "#ffffff" ? OUTLINE : hatBrand.textColor}
              textAnchor="middle"
            >
              {hatBrand.short ? hatBrand.short.charAt(0) : "R"}
            </text>
            {/* Mini texte marque sur la bande */}
            {hatBrand.short && hatBrand.short.length > 1 && (
              <text
                x="100"
                y="55"
                fontSize="5.5"
                fontWeight="900"
                fontFamily="monospace"
                fill={hatBrand.textColor}
                textAnchor="middle"
                opacity="0.9"
              >
                {hatBrand.short}
              </text>
            )}
          </g>
        )}

        {/* ============ FACE ============ */}
        {character.accessory !== "sunglasses" ? (
          <>
            {/* Gros yeux cartoon (blanc + pupille noire + highlight) */}
            <g>
              <ellipse
                cx="86"
                cy="68"
                rx="6"
                ry="8"
                fill="#ffffff"
                stroke={OUTLINE}
                strokeWidth="2.2"
              />
              <circle cx="87" cy="70" r="3.2" fill={OUTLINE} />
              <circle cx="88.2" cy="68.2" r="1.2" fill="#ffffff" />
            </g>
            <g>
              <ellipse
                cx="114"
                cy="68"
                rx="6"
                ry="8"
                fill="#ffffff"
                stroke={OUTLINE}
                strokeWidth="2.2"
              />
              <circle cx="115" cy="70" r="3.2" fill={OUTLINE} />
              <circle cx="116.2" cy="68.2" r="1.2" fill="#ffffff" />
            </g>
          </>
        ) : (
          <g>
            {/* Lunettes runner / sport */}
            <path
              d="M 72 64 Q 72 60 78 60 L 98 60 Q 102 60 102 64 L 100 74 Q 98 77 92 77 L 80 77 Q 74 77 72 74 Z"
              fill={OUTLINE}
              stroke={OUTLINE}
              strokeWidth="2"
            />
            <path
              d="M 98 64 Q 98 60 102 60 L 122 60 Q 128 60 128 64 L 126 74 Q 124 77 118 77 L 106 77 Q 102 77 100 74 Z"
              fill={OUTLINE}
              stroke={OUTLINE}
              strokeWidth="2"
            />
            {/* Pont */}
            <path
              d="M 98 66 L 102 66"
              stroke={OUTLINE}
              strokeWidth="2.5"
            />
            {/* Reflets cyan */}
            <path
              d="M 76 63 L 84 63"
              stroke="#22d3ee"
              strokeWidth="1.8"
              opacity="0.9"
            />
            <path
              d="M 104 63 L 112 63"
              stroke="#22d3ee"
              strokeWidth="1.8"
              opacity="0.9"
            />
          </g>
        )}

        {/* Petites joues blush */}
        <ellipse
          cx="74"
          cy="80"
          rx="5"
          ry="3"
          fill="#ff6680"
          opacity="0.45"
        />
        <ellipse
          cx="126"
          cy="80"
          rx="5"
          ry="3"
          fill="#ff6680"
          opacity="0.45"
        />

        {/* Bouche / sourire cartoon */}
        <path
          d="M 90 86 Q 100 94 110 86"
          stroke={OUTLINE}
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Dent qui dépasse — détail Mario */}
        <path
          d="M 97 88 L 97 91 L 100 91 L 100 88"
          fill="#ffffff"
          stroke={OUTLINE}
          strokeWidth="1.3"
        />

        {/* ============ HEADBAND (si pas de casquette) ============ */}
        {character.accessory === "headband" && !hasHat && (
          <g>
            <rect
              x="62"
              y="48"
              width="76"
              height="9"
              fill={character.hatColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            <circle
              cx="100"
              cy="52.5"
              r="3.5"
              fill="#ffffff"
              stroke={OUTLINE}
              strokeWidth="1.8"
            />
          </g>
        )}

        {/* ============ WATCH (on the front wrist / glove) ============ */}
        {character.accessory === "watch" && (
          <g>
            <rect
              x="53"
              y="160"
              width="20"
              height="14"
              rx="3"
              fill={OUTLINE}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            <rect x="56" y="163" width="14" height="8" rx="1" fill="#22d3ee" />
            <text
              x="63"
              y="170"
              fontSize="5"
              fontWeight="900"
              fontFamily="monospace"
              fill={OUTLINE}
              textAnchor="middle"
            >
              GPS
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

// ====== HELPERS ======

function darken(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const r = Math.max(0, ((num >> 16) & 255) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 255) * (1 - amount));
  const b = Math.max(0, (num & 255) * (1 - amount));
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(c).toString(16).padStart(2, "0"))
      .join("")
  );
}
