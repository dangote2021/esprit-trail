// ====== OFF RACES — courses punk hors circuit ======
// Data partagée entre /races (onglet OFF) et /races/off (page dédiée).
// FKT, courses confidentielles, pirates, crew runs, GR projects.

export type OffCategory =
  | "fkt"
  | "confidential"
  | "pirate"
  | "crew"
  | "gr-project";

export type OffRace = {
  id: string;
  name: string;
  tagline: string;
  location: string;
  country: string;
  distance: number;
  elevation: number;
  category: OffCategory;
  vibe: string;
  date?: string;
  recordHolder?: string;
  recordTime?: string;
  participants?: number;
  entryFee?: string;
  cover: string;
  soul: string;
};

export const OFF_RACES: OffRace[] = [
  {
    id: "fkt-gr20",
    name: "GR20 FKT",
    tagline: "Traverser la Corse en moins de 32h",
    location: "Corse",
    country: "🇫🇷",
    distance: 180,
    elevation: 10000,
    category: "fkt",
    vibe: "Record du monde · pure souffrance",
    recordHolder: "François D'Haene",
    recordTime: "31h06",
    cover: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    soul: "Pas de dossard. Pas de ravito. Juste toi, la carte IGN et le monstre.",
  },
  {
    id: "pirate-chamonix",
    name: "Pirate Chamonix Loop",
    tagline: "Le tour du Mont-Blanc version clandestine",
    location: "Chamonix",
    country: "🇫🇷",
    distance: 170,
    elevation: 10000,
    category: "pirate",
    vibe: "Zéro organisation · max liberté",
    participants: 40,
    entryFee: "0€ (apporte ta bière)",
    date: "2026-08-15",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    soul: "Départ collectif à 2h du mat sous le pont. Finish à la Moskito. Temps ? On s'en fout.",
  },
  {
    id: "confidential-cevennes",
    name: "Grande Traversée des Cévennes",
    tagline: "260 km non-stop · 100 coureurs max",
    location: "Cévennes",
    country: "🇫🇷",
    distance: 260,
    elevation: 12000,
    category: "confidential",
    vibe: "Course confidentielle · liste d'attente",
    date: "2026-09-20",
    entryFee: "80€",
    participants: 100,
    cover: "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
    soul: "Pas sur ITRA, pas sur UTMB Index. Juste une bande de dingues qui s'auto-organise depuis 15 ans.",
  },
  {
    id: "crew-puy-de-dome",
    name: "Crew Puy-de-Dôme Sunrise",
    tagline: "Sommet au lever du soleil avec le crew",
    location: "Auvergne",
    country: "🇫🇷",
    distance: 18,
    elevation: 900,
    category: "crew",
    vibe: "Entre potes · tous les dimanches",
    cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    soul: "6h du mat, RDV au parking. On monte, on regarde, on redescend au café.",
  },
  {
    id: "fkt-mercantour",
    name: "Mercantour FKT 100k",
    tagline: "L'itinéraire secret du parc national",
    location: "Mercantour",
    country: "🇫🇷",
    distance: 100,
    elevation: 6500,
    category: "fkt",
    vibe: "Tracé confidentiel · demande au locaux",
    recordHolder: "Rémi Bonnet",
    recordTime: "14h48",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    soul: "Personne ne te filera le GPX. Faut le mériter, faut le trouver.",
  },
  {
    id: "gr-project-ty",
    name: "GR Tour du Pays Basque",
    tagline: "Projet perso de 5 jours",
    location: "Pays Basque",
    country: "🇫🇷",
    distance: 220,
    elevation: 11000,
    category: "gr-project",
    vibe: "Autonomie totale · bivouac sauvage",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    soul: "Pas une course. Un projet. Ton sac, tes nuits, tes ravitos au bistrot.",
  },
  {
    id: "pirate-ardennes",
    name: "Ardennes Pirate Run",
    tagline: "L'anti-UTMB des forêts belges",
    location: "Ardennes",
    country: "🇧🇪",
    distance: 80,
    elevation: 2500,
    category: "pirate",
    vibe: "Ambiance punk · finish au bar du village",
    date: "2026-06-14",
    participants: 200,
    entryFee: "15€ (pour la bière)",
    cover: "https://images.unsplash.com/photo-1444464666168-49d633b86797",
    soul: "Ils ont créé ça parce que l'UTMB les faisait chier. Résultat : meilleure ambiance d'Europe.",
  },
  {
    id: "fkt-tmb",
    name: "Tour du Mont-Blanc FKT",
    tagline: "Le mythe en solitaire",
    location: "Mont-Blanc",
    country: "🇫🇷🇮🇹🇨🇭",
    distance: 170,
    elevation: 10000,
    category: "fkt",
    vibe: "Le tour des légendes",
    recordHolder: "Kilian Jornet",
    recordTime: "20h08",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    soul: "Quand tu te sens prêt, tu pars. Pas de dossard, pas de public, pas de podium. Juste ton chrono.",
  },
];

export const OFF_CAT_META: Record<
  OffCategory,
  { label: string; emoji: string; color: string; desc: string }
> = {
  fkt: {
    label: "FKT",
    emoji: "⚡",
    color: "text-mythic border-mythic/40 bg-mythic/10",
    desc: "Fastest Known Time — record en solo",
  },
  confidential: {
    label: "Confidentielle",
    emoji: "🤫",
    color: "text-violet border-violet/40 bg-violet/10",
    desc: "Courses hors circuit officiel",
  },
  pirate: {
    label: "Pirate",
    emoji: "🏴‍☠️",
    color: "text-peach border-peach/40 bg-peach/10",
    desc: "Ambiance punk, sans dossard",
  },
  crew: {
    label: "Crew",
    emoji: "👥",
    color: "text-cyan border-cyan/40 bg-cyan/10",
    desc: "Entre potes, rituel local",
  },
  "gr-project": {
    label: "GR Project",
    emoji: "🎒",
    color: "text-lime border-lime/40 bg-lime/10",
    desc: "Projet perso en autonomie",
  },
};
