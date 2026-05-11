// ====== APPLE TOUCH ICON 180×180 — Logo K ======
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1B4332",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32,
        }}
      >
        <svg width="150" height="150" viewBox="0 0 1024 1024">
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
    ),
    { ...size },
  );
}
