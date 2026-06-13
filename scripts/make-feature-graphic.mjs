// Génère feature-graphic-1024x500.png pour Google Play Store
// usage : node scripts/make-feature-graphic.mjs

import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "feature-graphic-1024x500.png");

const W = 1024;
const H = 500;

// SVG du feature graphic
// - Background dégradé crème → vert forêt
// - Bidon + éclair géant à gauche
// - Wordmark RAVITO + tagline à droite
// - Petite trace de trail en bas
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0e6c8"/>
      <stop offset="55%" stop-color="#e8e0bd"/>
      <stop offset="100%" stop-color="#dad08c"/>
    </linearGradient>
    <linearGradient id="bidon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2d6a4f"/>
      <stop offset="100%" stop-color="#1b4332"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="4" result="off"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Mountains silhouette dans le fond -->
  <g opacity="0.18">
    <path d="M0 380 L120 280 L220 350 L340 220 L460 320 L560 240 L700 340 L820 260 L1024 320 L1024 500 L0 500 Z" fill="#1b4332"/>
  </g>

  <!-- Trace de trail pointillée au sol -->
  <path d="M40 470 Q 240 440 460 460 T 980 440"
    stroke="#1b4332" stroke-width="4" fill="none"
    stroke-linecap="round" stroke-dasharray="2 14" opacity="0.45"/>

  <!-- BIDON + ÉCLAIR à gauche -->
  <g transform="translate(120 250) scale(2.2)" filter="url(#shadow)">
    <!-- Bouchon -->
    <rect x="-22" y="-72" width="44" height="14" rx="3" fill="#1b4332"/>
    <!-- Corps du bidon -->
    <rect x="-40" y="-58" width="80" height="100" rx="10" fill="url(#bidon)"/>
    <!-- Éclair -->
    <path d="M5 -40 L-12 -10 L0 -10 L-8 18 L20 -20 L8 -20 L14 -40 Z"
      fill="#f77f00" stroke="#1b4332" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Petit reflet -->
    <rect x="-32" y="-50" width="6" height="60" rx="3" fill="white" opacity="0.18"/>
  </g>

  <!-- WORDMARK + TAGLINE à droite -->
  <g transform="translate(420 145)">
    <!-- L'esprit trail (kicker) -->
    <text x="0" y="0"
      font-family="-apple-system, system-ui, 'Helvetica Neue', sans-serif"
      font-size="22" font-weight="800" fill="#2d6a4f"
      letter-spacing="6">L&apos;ESPRIT TRAIL</text>

    <!-- RAVITO (wordmark géant) -->
    <text x="0" y="105"
      font-family="-apple-system, system-ui, 'Helvetica Neue', sans-serif"
      font-size="135" font-weight="900" fill="#1b4332"
      letter-spacing="-4">RAVITO</text>

    <!-- Underline orange chunky -->
    <rect x="0" y="120" width="100" height="6" rx="2" fill="#f77f00"/>

    <!-- Tagline -->
    <text x="0" y="170"
      font-family="-apple-system, system-ui, 'Helvetica Neue', sans-serif"
      font-size="22" font-weight="700" fill="#1b4332" opacity="0.85">
      Le plan, le ton, la team — pour ton prochain trail.
    </text>

    <!-- Pills features -->
    <g transform="translate(0 200)">
      <g>
        <rect x="0" y="0" width="170" height="36" rx="18" fill="#1b4332"/>
        <text x="85" y="23" text-anchor="middle"
          font-family="-apple-system, system-ui, sans-serif"
          font-size="14" font-weight="800" fill="#f0e6c8">⚡ COACH IA</text>
      </g>
      <g transform="translate(185 0)">
        <rect x="0" y="0" width="170" height="36" rx="18" fill="#1b4332"/>
        <text x="85" y="23" text-anchor="middle"
          font-family="-apple-system, system-ui, sans-serif"
          font-size="14" font-weight="800" fill="#f0e6c8">🏴 OFF RACES</text>
      </g>
      <g transform="translate(370 0)">
        <rect x="0" y="0" width="170" height="36" rx="18" fill="#f77f00"/>
        <text x="85" y="23" text-anchor="middle"
          font-family="-apple-system, system-ui, sans-serif"
          font-size="14" font-weight="800" fill="#1b4332">🎯 KILL-CAM</text>
      </g>
    </g>
  </g>
</svg>
`;

const buf = await sharp(Buffer.from(svg)).png({ quality: 95 }).toBuffer();
writeFileSync(OUT, buf);
console.log("✓ Feature graphic written :", OUT, `(${buf.length} bytes)`);
