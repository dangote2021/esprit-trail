// ====== IMAGE OG PAR DÉFAUT ======
// Générée au build par Next.js. 1200x630 — crème + bidon + éclair Esprit Trail.

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Esprit Trail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FEFAE0",
          display: "flex",
          flexDirection: "row",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#0B1D0E",
          position: "relative",
        }}
      >
        {/* Grid pattern subtil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(27,67,50,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(27,67,50,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* Colonne gauche — Texte */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 1,
            flex: 1,
            paddingRight: 40,
          }}
        >
          {/* Header marque */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0B1D0E",
              }}
            >
              ESPRIT TRAIL
            </div>
            <div
              style={{
                fontSize: 16,
                color: "#F77F00",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 800,
                marginTop: 12,
              }}
            >
              · Esprit Trail
            </div>
          </div>

          {/* Hero text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "#1B4332",
                maxWidth: 640,
              }}
            >
              Progresse sans te blesser. Cours off circuit. Gagne des dossards.
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 22,
                color: "#52796f",
                letterSpacing: "-0.01em",
                maxWidth: 640,
              }}
            >
              L'app trail qui te récompense pour tes km parcourus.
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: "#52796f",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              fait avec les pieds boueux
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#2D6A4F",
                color: "#FEFAE0",
                padding: "14px 22px",
                borderRadius: 14,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "3px solid #1B4332",
              }}
            >
              esprit-trail.app
            </div>
          </div>
        </div>

        {/* Colonne droite — Logo K (3 pics + sentier sur fond vert forêt) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 420,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 400,
              height: 400,
              background: "#1B4332",
              borderRadius: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 48px rgba(11,29,14,0.18)",
            }}
          >
            <svg width="320" height="320" viewBox="0 0 1024 1024">
              <circle cx="780" cy="280" r="90" fill="#F77F00" opacity="0.9" />
              <g stroke="#0B1D0E" strokeWidth="7" strokeLinejoin="round">
                <path d="M 100 720 L 250 460 L 380 580 L 380 720 Z" fill="#2D6A4F" />
                <path d="M 280 720 L 540 250 L 720 480 L 800 380 L 920 720 Z" fill="#F0E6C8" />
                <path d="M 700 720 L 820 540 L 924 720 Z" fill="#2D6A4F" opacity="0.85" />
              </g>
              <path
                d="M 80 820 Q 250 780 400 820 T 700 800 T 944 830"
                fill="none"
                stroke="#F77F00"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <g fill="#F77F00">
                <circle cx="160" cy="800" r="6" />
                <circle cx="320" cy="810" r="6" />
                <circle cx="500" cy="810" r="6" />
                <circle cx="660" cy="800" r="6" />
                <circle cx="820" cy="820" r="6" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
