import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trail gaming palette — dark mode first, néon accents
        bg: {
          DEFAULT: "#0a0f1c", // nuit en forêt, bleu nuit profond
          raised: "#121a2e",
          card: "#1a2340",
        },
        ink: {
          DEFAULT: "#f1f5f9",
          muted: "#94a3b8",
          dim: "#64748b",
        },
        // Couleurs trail / jeu vidéo
        lime: {
          DEFAULT: "#c2ff2e", // Casquette Verte signature
          glow: "#d4ff5c",
          dark: "#8fbf1f",
        },
        peach: {
          DEFAULT: "#ff7849", // orange énergie Clem qui court
          glow: "#ffa07a",
        },
        cyan: {
          DEFAULT: "#22d3ee",
          glow: "#67e8f9",
        },
        violet: {
          DEFAULT: "#a855f7",
          glow: "#c084fc",
        },
        gold: {
          DEFAULT: "#fbbf24",
          glow: "#fcd34d",
        },
        // Badge rarity
        common: "#94a3b8",
        rare: "#22d3ee",
        epic: "#a855f7",
        legendary: "#fbbf24",
        mythic: "#ff3366",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-lime": "0 0 30px rgba(194, 255, 46, 0.35)",
        "glow-peach": "0 0 30px rgba(255, 120, 73, 0.35)",
        "glow-cyan": "0 0 30px rgba(34, 211, 238, 0.35)",
        "glow-violet": "0 0 30px rgba(168, 85, 247, 0.35)",
        "glow-gold": "0 0 30px rgba(251, 191, 36, 0.45)",
        "glow-mythic": "0 0 40px rgba(255, 51, 102, 0.55)",
        "inner-glow": "inset 0 0 20px rgba(194, 255, 46, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2.5s infinite",
        "shine": "shine 2.5s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "pop-in": "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          from: { filter: "brightness(1) drop-shadow(0 0 4px currentColor)" },
          to: { filter: "brightness(1.2) drop-shadow(0 0 12px currentColor)" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(194,255,46,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(194,255,46,0.04) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(194,255,46,0.15), transparent)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
