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
        // ==== Esprit Trail · Charte ALPINE LIGHT ====
        // Inspiration : Patagonia, Trail Runner Mag, cartes IGN papier
        // Crème naturel + vert forêt + orange coucher + terre dorée
        bg: {
          DEFAULT: "#f0e6c8", // crème naturel — fond principal
          raised: "#e8dcb6",  // crème ombrée — surfaces en relief
          card: "#fff9ea",    // crème très clair — cards
        },
        ink: {
          DEFAULT: "#1b4332", // vert forêt — texte principal
          muted: "#52796f",   // vert-gris — texte secondaire
          dim: "#84a98c",     // vert doux — texte tertiaire
        },
        // Les noms lime/peach/cyan/violet/gold sont conservés (compat composants)
        // mais remappés à la palette Alpine Light.
        lime: {
          DEFAULT: "#2d6a4f", // vert aventure — brand accent principal
          glow: "#52b788",    // vert frais
          dark: "#1b4332",    // vert forêt profond
        },
        peach: {
          DEFAULT: "#f77f00", // orange coucher de soleil — CTA / énergie
          glow: "#fb9c3d",    // orange chaud clair
        },
        cyan: {
          DEFAULT: "#0077b6", // ocean deep — data points, secondaires
          glow: "#00b4d8",
        },
        violet: {
          DEFAULT: "#7b2cbf", // violet montagne
          glow: "#c77dff",
        },
        gold: {
          DEFAULT: "#dda15e", // terre dorée — iconique, premium
          glow: "#e8b87a",
        },
        // Badge rarity — palette terre/roche/minerai
        common: "#84a98c",       // vert doux
        rare: "#0077b6",         // ocean
        epic: "#7b2cbf",         // violet
        legendary: "#dda15e",    // terre dorée
        mythic: "#bc4749",       // rouge terre cuite
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Glows adaptés à un fond clair — plus doux, plus halo naturel
        "glow-lime": "0 0 28px rgba(45, 106, 79, 0.35)",
        "glow-peach": "0 0 28px rgba(247, 127, 0, 0.35)",
        "glow-cyan": "0 0 28px rgba(0, 119, 182, 0.3)",
        "glow-violet": "0 0 28px rgba(123, 44, 191, 0.3)",
        "glow-gold": "0 0 32px rgba(221, 161, 94, 0.45)",
        "glow-mythic": "0 0 36px rgba(188, 71, 73, 0.5)",
        "inner-glow": "inset 0 0 20px rgba(45, 106, 79, 0.12)",
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
          to: { filter: "brightness(1.1) drop-shadow(0 0 10px currentColor)" },
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
        // Grille subtile couleur vert forêt sur fond crème
        "grid-pattern":
          "linear-gradient(to right, rgba(27,67,50,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,67,50,0.05) 1px, transparent 1px)",
        // Halo chaud en haut de page — soleil qui se lève
        "radial-glow":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247,127,0,0.12), transparent)",
        // Papier kraft subtil pour un touch magazine outdoor
        "paper-grain":
          "radial-gradient(rgba(27,67,50,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
        "paper-grain": "3px 3px",
      },
    },
  },
  plugins: [],
};

export default config;
