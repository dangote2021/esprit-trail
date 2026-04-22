// ====== CHARACTER CUSTOMIZATION — mode SIMS ======
// Personnage stylisé avatar : casquette + t-shirt + short + chaussures.
// Marques réelles outdoor/trail, easter egg "Casquette Verte".

export type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";

export type ShoeBrand =
  | "hoka"
  | "salomon"
  | "lasportiva"
  | "on"
  | "nike"
  | "adidas"
  | "altra"
  | "scarpa"
  | "merrell"
  | "asics";

export type HatBrand =
  | "none"
  | "ciele"
  | "salomon"
  | "hoka"
  | "on"
  | "lasportiva"
  | "buff"
  | "casquette-verte" // easter egg — clin d'oeil
  | "ravito"; // easter egg — la maison

export interface HydrationPack {
  enabled: boolean;
  color: string; // hex — couleur du sac + straps
  leftFlaskColor?: string; // hex — soft flask gauche
  rightFlaskColor?: string; // hex — soft flask droite
}

export interface CompressionSocks {
  enabled: boolean;
  color: string; // hex
}

export interface RunningBelt {
  enabled: boolean;
  color: string; // hex
}

export interface Character {
  skinTone: SkinTone;
  hairColor: string; // hex
  hatBrand: HatBrand;
  hatColor: string; // hex
  shirtColor: string; // hex
  shirtBrand?: "none" | "hoka" | "salomon" | "on" | "ciele";
  shortsColor: string;
  shoeBrand: ShoeBrand;
  shoeColor: string;
  accessory?: "none" | "sunglasses" | "headband" | "watch";
  // Gear trail
  hydrationPack?: HydrationPack;
  compressionSocks?: CompressionSocks;
  runningBelt?: RunningBelt;
}

// ====== Palettes disponibles ======

export const SKIN_TONES: { id: SkinTone; color: string; label: string }[] = [
  { id: "light", color: "#f3d4be", label: "Clair" },
  { id: "medium-light", color: "#e3b394", label: "Moyen clair" },
  { id: "medium", color: "#c89176", label: "Moyen" },
  { id: "medium-dark", color: "#8d5a3d", label: "Moyen foncé" },
  { id: "dark", color: "#4e2e1f", label: "Foncé" },
];

export const HAIR_COLORS: { color: string; label: string }[] = [
  { color: "#1a1a1a", label: "Noir" },
  { color: "#5c3a21", label: "Brun" },
  { color: "#a66e3c", label: "Châtain" },
  { color: "#d4a037", label: "Blond" },
  { color: "#b72a1a", label: "Roux" },
  { color: "#e8e8e8", label: "Blanc" },
  { color: "#c2ff2e", label: "Lime (stylé)" },
];

export const SHIRT_COLORS: { color: string; label: string; easterEgg?: boolean }[] = [
  { color: "#ff3366", label: "Rose bouzin 💖", easterEgg: true },
  { color: "#c2ff2e", label: "Lime" },
  { color: "#ff7849", label: "Peach" },
  { color: "#22d3ee", label: "Cyan" },
  { color: "#a855f7", label: "Violet" },
  { color: "#fbbf24", label: "Or" },
  { color: "#ffffff", label: "Blanc" },
  { color: "#1a1a1a", label: "Noir" },
  { color: "#3b5a3b", label: "Forest" },
  { color: "#6c757d", label: "Gris" },
  { color: "#ff6ec7", label: "Fluo flashy" },
  { color: "#39ff14", label: "Vert radar" },
];

export const SHORTS_COLORS: { color: string; label: string }[] = [
  { color: "#1a1a1a", label: "Noir" },
  { color: "#6c757d", label: "Gris" },
  { color: "#0a3d2e", label: "Vert sapin" },
  { color: "#22223b", label: "Bleu nuit" },
  { color: "#ff7849", label: "Peach" },
  { color: "#7c2d12", label: "Bordeaux" },
  { color: "#ffffff", label: "Blanc" },
];

export const HAT_COLORS: { color: string; label: string }[] = [
  { color: "#c2ff2e", label: "Lime" },
  { color: "#ff7849", label: "Peach" },
  { color: "#22d3ee", label: "Cyan" },
  { color: "#a855f7", label: "Violet" },
  { color: "#ffffff", label: "Blanc" },
  { color: "#1a1a1a", label: "Noir" },
  { color: "#ff3366", label: "Fluo rose" },
  { color: "#fbbf24", label: "Moutarde" },
  { color: "#3b5a3b", label: "Kaki" },
  { color: "#6c757d", label: "Gris" },
];

export const SHOE_COLORS: { color: string; label: string }[] = [
  { color: "#c2ff2e", label: "Fluo lime" },
  { color: "#ff7849", label: "Fluo peach" },
  { color: "#22d3ee", label: "Fluo cyan" },
  { color: "#ff3366", label: "Fluo rose" },
  { color: "#fbbf24", label: "Fluo jaune" },
  { color: "#1a1a1a", label: "Noir" },
  { color: "#ffffff", label: "Blanc" },
  { color: "#6c757d", label: "Gris" },
  { color: "#a855f7", label: "Violet" },
];

// Couleurs pour le sac d'hydratation (camel back / running vest)
export const HYDRATION_PACK_COLORS: { color: string; label: string }[] = [
  { color: "#1a1a1a", label: "Noir" },
  { color: "#6c757d", label: "Gris" },
  { color: "#3b5a3b", label: "Kaki" },
  { color: "#c2ff2e", label: "Lime" },
  { color: "#ff3366", label: "Rose flashy" },
  { color: "#22d3ee", label: "Cyan" },
  { color: "#ff7849", label: "Peach" },
  { color: "#fbbf24", label: "Moutarde" },
  { color: "#a855f7", label: "Violet" },
  { color: "#ffffff", label: "Blanc" },
];

// Couleurs pour les chaussettes de compression
export const SOCK_COLORS: { color: string; label: string }[] = [
  { color: "#1a1a1a", label: "Noir" },
  { color: "#ffffff", label: "Blanc" },
  { color: "#ff3366", label: "Rose" },
  { color: "#22d3ee", label: "Cyan" },
  { color: "#c2ff2e", label: "Lime" },
  { color: "#ff7849", label: "Peach" },
  { color: "#fbbf24", label: "Jaune" },
  { color: "#6c757d", label: "Gris" },
  { color: "#3b5a3b", label: "Kaki" },
];

// Couleurs des soft flasks (bidons souples) dans les poches avant du sac
export const FLASK_COLORS: { color: string; label: string }[] = [
  { color: "#22d3ee", label: "Cyan" },
  { color: "#ff3366", label: "Rose" },
  { color: "#c2ff2e", label: "Lime" },
  { color: "#ff7849", label: "Peach" },
  { color: "#fbbf24", label: "Jaune" },
  { color: "#a855f7", label: "Violet" },
  { color: "#ffffff", label: "Blanc" },
  { color: "#1a1a1a", label: "Noir" },
];

// ====== Marques (avec identité visuelle simple — texte sur le produit) ======

export const SHOE_BRANDS: Record<ShoeBrand, { label: string; textColor: string; short: string }> = {
  hoka: { label: "Hoka", textColor: "#ffffff", short: "HOKA" },
  salomon: { label: "Salomon", textColor: "#ffffff", short: "S/LAB" },
  lasportiva: { label: "La Sportiva", textColor: "#ffffff", short: "LS" },
  on: { label: "On Running", textColor: "#ffffff", short: "ON" },
  nike: { label: "Nike Trail", textColor: "#ffffff", short: "NIKE" },
  adidas: { label: "Adidas Terrex", textColor: "#ffffff", short: "TERREX" },
  altra: { label: "Altra", textColor: "#ffffff", short: "ALTRA" },
  scarpa: { label: "Scarpa", textColor: "#ffffff", short: "SCARPA" },
  merrell: { label: "Merrell", textColor: "#ffffff", short: "MERRELL" },
  asics: { label: "Asics Trail", textColor: "#ffffff", short: "ASICS" },
};

export const HAT_BRANDS: Record<HatBrand, { label: string; textColor: string; short: string; easterEgg?: boolean }> = {
  none: { label: "Sans logo", textColor: "#ffffff", short: "" },
  ciele: { label: "Ciele Athletics", textColor: "#ffffff", short: "CIELE" },
  salomon: { label: "Salomon", textColor: "#ffffff", short: "SALOMON" },
  hoka: { label: "Hoka", textColor: "#ffffff", short: "HOKA" },
  on: { label: "On", textColor: "#ffffff", short: "ON" },
  lasportiva: { label: "La Sportiva", textColor: "#ffffff", short: "LS" },
  buff: { label: "Buff", textColor: "#ffffff", short: "BUFF" },
  "casquette-verte": {
    label: "Casquette Verte 🧢",
    textColor: "#0a0f1c",
    short: "CV",
    easterEgg: true,
  },
  ravito: {
    label: "Ravito 🏠",
    textColor: "#0a0f1c",
    short: "RAVITO",
    easterEgg: true,
  },
};

// ====== Character par défaut ======

export const DEFAULT_CHARACTER: Character = {
  skinTone: "medium-light",
  hairColor: "#5c3a21",
  hatBrand: "casquette-verte",
  hatColor: "#c2ff2e",
  shirtColor: "#22d3ee",
  shirtBrand: "none",
  shortsColor: "#1a1a1a",
  shoeBrand: "hoka",
  shoeColor: "#ff7849",
  accessory: "sunglasses",
  hydrationPack: {
    enabled: true,
    color: "#1a1a1a",
    leftFlaskColor: "#22d3ee",
    rightFlaskColor: "#ff3366",
  },
  compressionSocks: {
    enabled: true,
    color: "#ff3366",
  },
  runningBelt: {
    enabled: false,
    color: "#1a1a1a",
  },
};
