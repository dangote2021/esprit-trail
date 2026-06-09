// ====== OG IMAGE DYNAMIQUE PAR COURSE ======
// Générée à la demande pour /race/[id]. Affiche : nom de la course, lieu,
// distance, D+, date, et le logo Esprit Trail.

import { ImageResponse } from "next/og";
import { RACES } from "@/lib/data/races";

export const runtime = "edge";
export const alt = "Course Esprit Trail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function OgImage({ params }: { params: { id: string } }) {
  const race = RACES.find((r) => r.id === params.id);

  // Fallback si course inconnue → image générique
  if (!race) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#FEFAE0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 96,
            fontWeight: 900,
            color: "#1B4332",
          }}
        >
          ESPRIT TRAIL
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FEFAE0",
          display: "flex",
          flexDirection: "column",
          padding: 64,
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

        {/* Header — brand + iconic badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: "#1B4332",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 1024 1024">
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
              </svg>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0B1D0E",
              }}
            >
              ESPRIT TRAIL
            </div>
          </div>
          {race.isIconic && (
            <div
              style={{
                background: "#F77F00",
                color: "#0B1D0E",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              ⭐ ICONIC
            </div>
          )}
        </div>

        {/* Centre — nom, lieu, tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            zIndex: 1,
            paddingTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#F77F00",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 800,
              marginBottom: 16,
              display: "flex",
            }}
          >
            {race.location} · {race.country}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#1B4332",
              display: "flex",
            }}
          >
            {race.name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              color: "#52796f",
              fontStyle: "italic",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            « {race.tagline} »
          </div>
        </div>

        {/* Footer — stats clés + brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="Distance" value={`${race.distance} km`} color="#1B4332" />
            <Stat
              label="D+"
              value={`${race.elevation.toLocaleString("fr")} m`}
              color="#F77F00"
            />
            <Stat
              label="ITRA"
              value={`${race.itraPoints} pts`}
              color="#2D6A4F"
            />
            <Stat label="Catégorie" value={race.category} color="#0B1D0E" />
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#1B4332",
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            📅 {formatDate(race.date)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "rgba(27,67,50,0.05)",
        padding: "12px 20px",
        borderRadius: 12,
        border: `2px solid ${color}33`,
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: "#52796f",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 700,
          display: "flex",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          color,
          marginTop: 2,
          display: "flex",
        }}
      >
        {value}
      </div>
    </div>
  );
}
