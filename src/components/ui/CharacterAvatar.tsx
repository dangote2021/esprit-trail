// ====== CHARACTER AVATAR — style jeu vidéo / Super Mario ======
// Proportions chibi (grosse tête, corps trapu), outlines épaisses,
// couleurs saturées, gants cartoon blancs. Mobile-first, 100% SVG.

import {
  Character,
  SHOE_BRANDS,
  HAT_BRANDS,
  SKIN_TONES,
} from "@/lib/character";

// Silhouette féminine — indices subtils (pas de caricature) :
// - legère courbe poitrine sur le tshirt
// - taille un peu plus marquée
// - cils sur les yeux
// - lèvres légèrement colorées
// Pas de genre imposé : c'est une morphologie qu'on peut choisir.

// Alpine Light : contour "noir forêt" — quasi noir à l'œil mais harmonisé palette
const OUTLINE = "#0a1f15";
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
  const isFeminine = character.silhouette === "feminine";
  const hairstyle = character.hairstyle ?? "short";
  const hairShade = darken(character.hairColor, 0.35);

  // Darker shade of shirt for tshirt shadow
  const shirt = character.shirtColor;
  const shirtShade = darken(shirt, 0.25);
  const hatShade = darken(character.hatColor, 0.25);
  const shoeShade = darken(character.shoeColor, 0.3);
  const shortsShade = darken(character.shortsColor, 0.3);
  const pack = character.hydrationPack?.enabled ? character.hydrationPack.color : null;
  const packShade = pack ? darken(pack, 0.3) : "#000000";
  const leftFlask = character.hydrationPack?.leftFlaskColor ?? "#22d3ee";
  const rightFlask = character.hydrationPack?.rightFlaskColor ?? "#ff3366";
  const socks = character.compressionSocks?.enabled
    ? character.compressionSocks.color
    : null;
  const socksShade = socks ? darken(socks, 0.35) : "#000000";
  const belt = character.runningBelt?.enabled ? character.runningBelt.color : null;
  const beltShade = belt ? darken(belt, 0.3) : "#000000";

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
        {/* ============ BACK HAIR (long, ponytail, bun) ============ */}
        {/* Rendu en premier pour passer DERRIÈRE le corps et la nuque */}
        {hairstyle === "long" && (
          <path
            d="M 60 62 Q 58 100 64 145 Q 72 152 82 148 Q 86 110 88 80 Q 82 60 60 62 Z
               M 140 62 Q 142 100 136 145 Q 128 152 118 148 Q 114 110 112 80 Q 118 60 140 62 Z"
            fill={character.hairColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
        )}
        {hairstyle === "medium" && (
          <path
            d="M 62 60 Q 60 88 66 108 Q 76 115 88 110 Q 90 88 88 72 Q 80 58 62 60 Z
               M 138 60 Q 140 88 134 108 Q 124 115 112 110 Q 110 88 112 72 Q 120 58 138 60 Z"
            fill={character.hairColor}
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
        )}
        {hairstyle === "ponytail" && (
          <g>
            {/* La queue-de-cheval qui sort par l'arrière */}
            <path
              d="M 140 58 Q 158 70 162 105 Q 164 140 154 172 Q 148 180 142 172 Q 144 144 140 114 Q 132 86 130 70 Z"
              fill={character.hairColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Élastique rose */}
            <ellipse
              cx="145"
              cy="68"
              rx="5"
              ry="3"
              fill="#ff3366"
              stroke={OUTLINE}
              strokeWidth="1.5"
            />
          </g>
        )}
        {hairstyle === "bun" && (
          <g>
            {/* Chignon sphérique à l'arrière du crâne (visible au-dessus de la tête) */}
            <circle
              cx="100"
              cy="22"
              r="18"
              fill={character.hairColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Swirl du chignon */}
            <path
              d="M 95 15 Q 100 10 108 14 Q 110 22 103 28 Q 92 26 95 15 Z"
              fill={hairShade}
              stroke={OUTLINE}
              strokeWidth="1.5"
              opacity="0.7"
            />
          </g>
        )}
        {hairstyle === "mulet" && (
          <g>
            {/* Cape arrière du mulet : large à la nuque, qui s'effile vers le bas
                "Business in the front, party in the back" — easter egg trail vintage */}
            <path
              d="M 70 60 Q 64 90 72 130 Q 80 148 92 152 L 100 144 L 108 152 Q 120 148 128 130 Q 136 90 130 60 Q 110 64 100 64 Q 90 64 70 60 Z"
              fill={character.hairColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Mèches qui marquent le tombé du mulet */}
            <path
              d="M 84 80 Q 82 110 88 138"
              stroke={hairShade}
              strokeWidth="1.6"
              fill="none"
              opacity="0.55"
            />
            <path
              d="M 116 80 Q 118 110 112 138"
              stroke={hairShade}
              strokeWidth="1.6"
              fill="none"
              opacity="0.55"
            />
            <path
              d="M 100 78 Q 100 110 100 144"
              stroke={hairShade}
              strokeWidth="1.4"
              fill="none"
              opacity="0.45"
            />
          </g>
        )}

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

        {/* ============ COMPRESSION SOCKS ============ */}
        {socks && (
          <g>
            {/* Back (right) compression sock */}
            <path
              d="M 108 210 Q 108 207 112 207 L 128 207 Q 131 207 131 210 L 131 240 Q 131 243 128 243 L 111 243 Q 108 243 108 240 Z"
              fill={socks}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Top band */}
            <path
              d="M 109 212 L 131 212"
              stroke={socksShade}
              strokeWidth="2.5"
              opacity="0.9"
            />
            <path
              d="M 109 216 L 131 216"
              stroke={socksShade}
              strokeWidth="1.2"
              opacity="0.6"
            />
            {/* Pattern stripes */}
            <line
              x1="110"
              y1="225"
              x2="130"
              y2="225"
              stroke={socksShade}
              strokeWidth="1.2"
              opacity="0.55"
            />
            <line
              x1="110"
              y1="232"
              x2="130"
              y2="232"
              stroke={socksShade}
              strokeWidth="1.2"
              opacity="0.55"
            />

            {/* Front (left) compression sock */}
            <path
              d="M 69 210 Q 69 207 73 207 L 89 207 Q 92 207 92 210 L 92 240 Q 92 243 89 243 L 72 243 Q 69 243 69 240 Z"
              fill={socks}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            <path
              d="M 70 212 L 92 212"
              stroke={socksShade}
              strokeWidth="2.5"
              opacity="0.9"
            />
            <path
              d="M 70 216 L 92 216"
              stroke={socksShade}
              strokeWidth="1.2"
              opacity="0.6"
            />
            <line
              x1="71"
              y1="225"
              x2="91"
              y2="225"
              stroke={socksShade}
              strokeWidth="1.2"
              opacity="0.55"
            />
            <line
              x1="71"
              y1="232"
              x2="91"
              y2="232"
              stroke={socksShade}
              strokeWidth="1.2"
              opacity="0.55"
            />
          </g>
        )}

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

        {/* ============ RUNNING BELT (ceinture trail, optionnelle) ============ */}
        {belt && (
          <g>
            <rect
              x="60"
              y="158"
              width="80"
              height="10"
              rx="3"
              fill={belt}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            <rect x="60" y="158" width="80" height="3" fill={beltShade} opacity="0.8" />
            {/* Buckle */}
            <rect
              x="96"
              y="160"
              width="8"
              height="6"
              rx="1"
              fill="#ffffff"
              stroke={OUTLINE}
              strokeWidth="1.5"
            />
            <rect x="98" y="162" width="4" height="2" fill={OUTLINE} />
          </g>
        )}

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
        {/* Silhouette féminine : légère courbe buste + taille marquée */}
        <path
          d={
            isFeminine
              ? // Taille rentrée légèrement au milieu, poitrine légèrement bombée
                "M 62 115 Q 62 108 72 108 L 128 108 Q 138 108 138 115 Q 142 130 140 142 Q 136 150 142 160 L 140 168 Q 140 172 135 172 L 65 172 Q 60 172 60 168 L 58 160 Q 64 150 60 142 Q 58 130 62 115 Z"
              : "M 62 115 Q 62 108 72 108 L 128 108 Q 138 108 138 115 L 140 168 Q 140 172 135 172 L 65 172 Q 60 172 60 168 Z"
          }
          fill={character.shirtColor}
          stroke={OUTLINE}
          strokeWidth={STROKE}
        />
        {/* Légère courbe buste féminine — deux arrondis subtils */}
        {isFeminine && !pack && (
          <path
            d="M 78 128 Q 86 136 94 128 M 106 128 Q 114 136 122 128"
            stroke={shirtShade}
            strokeWidth="1.8"
            fill="none"
            opacity="0.55"
          />
        )}
        {/* Tshirt shading bottom */}
        <path
          d="M 62 160 L 138 160 L 140 168 L 60 168 Z"
          fill={shirtShade}
          opacity="0.45"
        />
        {/* Brand chest text — version "bouzin" en plus gros + petit cœur en dessous */}
        {character.shirtBrand && character.shirtBrand !== "none" && (
          <g>
            <text
              x="100"
              y={character.shirtBrand === "bouzin" ? "140" : "143"}
              fontSize={character.shirtBrand === "bouzin" ? "14" : "11"}
              fontWeight="900"
              fontFamily="monospace"
              fill="#ffffff"
              textAnchor="middle"
              stroke={OUTLINE}
              strokeWidth="0.7"
              paintOrder="stroke"
              letterSpacing={character.shirtBrand === "bouzin" ? "1" : "0"}
            >
              {character.shirtBrand.toUpperCase()}
            </text>
            {character.shirtBrand === "bouzin" && (
              // Petit cœur sous le mot — symbole de l'easter egg
              <path
                d="M 100 148 l -3 -2.6 a 1.6 1.6 0 0 1 3 -2.2 a 1.6 1.6 0 0 1 3 2.2 z"
                fill="#ffffff"
                stroke={OUTLINE}
                strokeWidth="0.7"
              />
            )}
          </g>
        )}

        {/* ============ HYDRATION PACK / RUNNING VEST ============ */}
        {pack && (
          <g>
            {/* Top back strip visible above shoulders (peek de la partie dorsale) */}
            <path
              d="M 66 104 Q 66 99 72 99 L 128 99 Q 134 99 134 104 L 134 114 L 66 114 Z"
              fill={pack}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            <path
              d="M 66 108 L 134 108"
              stroke={packShade}
              strokeWidth="1.8"
              opacity="0.7"
            />

            {/* Left shoulder strap */}
            <path
              d="M 72 108 Q 72 108 74 108 L 94 108 Q 96 108 96 112 L 96 162 Q 96 166 92 166 L 76 166 Q 72 166 72 162 Z"
              fill={pack}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Right shoulder strap */}
            <path
              d="M 104 108 Q 104 108 106 108 L 126 108 Q 128 108 128 112 L 128 162 Q 128 166 124 166 L 108 166 Q 104 166 104 162 Z"
              fill={pack}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />

            {/* LEFT SOFT FLASK (upper pocket) */}
            <rect
              x="75"
              y="119"
              width="18"
              height="20"
              rx="3"
              fill={leftFlask}
              stroke={OUTLINE}
              strokeWidth="2"
            />
            {/* Flask cap */}
            <rect
              x="80"
              y="117"
              width="8"
              height="4"
              rx="1"
              fill={packShade}
              stroke={OUTLINE}
              strokeWidth="1.5"
            />
            {/* Flask highlight */}
            <rect
              x="77"
              y="122"
              width="3.5"
              height="12"
              rx="1"
              fill="#ffffff"
              opacity="0.45"
            />

            {/* RIGHT SOFT FLASK */}
            <rect
              x="107"
              y="119"
              width="18"
              height="20"
              rx="3"
              fill={rightFlask}
              stroke={OUTLINE}
              strokeWidth="2"
            />
            <rect
              x="112"
              y="117"
              width="8"
              height="4"
              rx="1"
              fill={packShade}
              stroke={OUTLINE}
              strokeWidth="1.5"
            />
            <rect
              x="109"
              y="122"
              width="3.5"
              height="12"
              rx="1"
              fill="#ffffff"
              opacity="0.45"
            />

            {/* Chest strap horizontal */}
            <rect
              x="72"
              y="146"
              width="56"
              height="4"
              rx="1"
              fill={packShade}
              stroke={OUTLINE}
              strokeWidth="1.5"
            />
            {/* Chest clip buckle */}
            <rect
              x="97"
              y="144"
              width="6"
              height="8"
              rx="1"
              fill="#ffffff"
              stroke={OUTLINE}
              strokeWidth="1.5"
            />

            {/* Pocket seam lines on lower straps */}
            <path
              d="M 74 154 L 94 154"
              stroke={packShade}
              strokeWidth="1.3"
              opacity="0.6"
            />
            <path
              d="M 106 154 L 126 154"
              stroke={packShade}
              strokeWidth="1.3"
              opacity="0.6"
            />

            {/* HYDRATION TUBE — from back over left shoulder to chest strap */}
            <path
              d="M 68 101 Q 60 106 60 118 Q 60 130 72 136 Q 80 140 84 148"
              stroke={OUTLINE}
              strokeWidth="4.8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 68 101 Q 60 106 60 118 Q 60 130 72 136 Q 80 140 84 148"
              stroke="#22d3ee"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Bite valve clipped on strap */}
            <rect
              x="81"
              y="146"
              width="7"
              height="5.5"
              rx="1.5"
              fill={OUTLINE}
              stroke={OUTLINE}
              strokeWidth="1"
            />
            <circle cx="84.5" cy="148.8" r="1.1" fill="#22d3ee" />
          </g>
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

        {/* ============ FRONT HAIR (crâne + mèches) ============ */}
        {!hasHat ? (
          <>
            {/* Couverture crâne — commune à tous les hairstyles sans casquette */}
            <path
              d={
                hairstyle === "short" || hairstyle === "mulet"
                  ? // Court devant — le mulet a la même calotte courte sur le dessus
                    "M 66 50 Q 68 28 100 26 Q 132 28 134 50 Q 134 56 130 58 L 70 58 Q 66 56 66 50 Z"
                  : // Coiffure plus volumineuse pour medium/long/ponytail/bun
                    "M 62 52 Q 62 22 100 20 Q 138 22 138 52 Q 138 60 132 62 L 68 62 Q 62 60 62 52 Z"
              }
              fill={character.hairColor}
              stroke={OUTLINE}
              strokeWidth={STROKE}
            />
            {/* Frange / détail sur le front */}
            {(hairstyle === "medium" || hairstyle === "long" || hairstyle === "bun") && (
              <path
                d="M 78 40 Q 90 50 104 44 Q 118 50 128 42 L 128 56 L 78 56 Z"
                fill={hairShade}
                opacity="0.55"
                stroke={OUTLINE}
                strokeWidth="1.2"
              />
            )}
            {/* Pour ponytail : deux petites mèches qui encadrent le visage */}
            {hairstyle === "ponytail" && (
              <>
                <path
                  d="M 62 52 Q 58 70 64 90 L 70 88 Q 68 70 70 54 Z"
                  fill={character.hairColor}
                  stroke={OUTLINE}
                  strokeWidth="2"
                />
                <path
                  d="M 138 52 Q 142 70 136 90 L 130 88 Q 132 70 130 54 Z"
                  fill={character.hairColor}
                  stroke={OUTLINE}
                  strokeWidth="2"
                />
              </>
            )}
          </>
        ) : (
          // Mèches qui dépassent sous la casquette
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
            {/* Avec casquette + coiffure longue : on voit les mèches plus longues */}
            {(hairstyle === "medium" || hairstyle === "long" || hairstyle === "ponytail") && (
              <>
                <path
                  d="M 60 62 Q 56 82 62 100 L 70 98 Q 68 80 68 64 Z"
                  fill={character.hairColor}
                  stroke={OUTLINE}
                  strokeWidth="2"
                />
                <path
                  d="M 140 62 Q 144 82 138 100 L 130 98 Q 132 80 132 64 Z"
                  fill={character.hairColor}
                  stroke={OUTLINE}
                  strokeWidth="2"
                />
              </>
            )}
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
              {/* Cils féminins */}
              {isFeminine && (
                <g stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" fill="none">
                  <path d="M 80 61 L 79 58" />
                  <path d="M 84 59.5 L 83.5 56.5" />
                  <path d="M 88 59.3 L 88 56" />
                  <path d="M 92 60 L 92.5 57" />
                </g>
              )}
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
              {isFeminine && (
                <g stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" fill="none">
                  <path d="M 108 60 L 107.5 57" />
                  <path d="M 112 59.3 L 112 56" />
                  <path d="M 116 59.5 L 116.5 56.5" />
                  <path d="M 120 61 L 121 58" />
                </g>
              )}
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
        {isFeminine ? (
          <>
            {/* Sourire féminin — lèvres légèrement colorées */}
            <path
              d="M 88 86 Q 100 94 112 86"
              stroke={OUTLINE}
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 90 88 Q 100 92 110 88"
              stroke="#ff4466"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </>
        ) : (
          <>
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
          </>
        )}

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
