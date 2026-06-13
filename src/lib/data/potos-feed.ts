// ====== potos-feed.ts ======
// Feed d'activité des potos affiché en home (item 5 P1 panel test).
// Mock data — 10 derniers événements de la communauté. À terme :
//   - Supabase activities table + abonnements Realtime
//   - filtré par les amis suivis (user_follows)
// Pour le MVP : on dérive les timestamps relatifs à `now` au render,
// pas au build, pour éviter "il y a 38 jours" dans 38 jours.

export type PotosActivityKind =
  | "run" // sortie terminée
  | "badge" // badge débloqué
  | "challenge" // défi rejoint
  | "race" // dossard décroché / inscription course
  | "best"; // record personnel battu

export type PotosActivity = {
  id: string;
  user: {
    id: string;
    name: string; // prénom affiché — pas le pseudo
    handle: string; // pseudo sans @
    avatar: string; // emoji
    totem?: string; // animal totem (cf. profil)
  };
  kind: PotosActivityKind;
  /** Minutes écoulées depuis "now". On stocke un offset pour rendre la
   *  démo crédible peu importe quand on ouvre l'app. */
  agoMinutes: number;
  payload: {
    runDistanceKm?: number;
    runElevation?: number;
    runTitle?: string;
    badgeName?: string;
    badgeEmoji?: string;
    challengeName?: string;
    raceName?: string;
    raceDate?: string; // ISO
    bestKind?: "10k" | "21k" | "42k" | "vitesse" | "D+";
    bestValue?: string;
  };
};

export const POTOS_FEED: PotosActivity[] = [
  {
    id: "act-mat-1",
    user: { id: "u-mathilde", name: "Mathilde", handle: "mat_trail", avatar: "🦊", totem: "🐺" },
    kind: "run",
    agoMinutes: 35,
    payload: {
      runTitle: "Pieds boueux dans le Vercors",
      runDistanceKm: 18.4,
      runElevation: 920,
    },
  },
  {
    id: "act-thomas-1",
    user: { id: "u-thomas", name: "Thomas", handle: "tom.runner", avatar: "🦅", totem: "🦅" },
    kind: "best",
    agoMinutes: 120,
    payload: {
      bestKind: "21k",
      bestValue: "1h38'42",
    },
  },
  {
    id: "act-sarah-1",
    user: { id: "u-sarah", name: "Sarah", handle: "sarahmtn", avatar: "🐐", totem: "🐐" },
    kind: "race",
    agoMinutes: 240,
    payload: {
      raceName: "MaXi-Race Annecy",
      raceDate: "2026-05-30T05:00:00.000Z",
    },
  },
  {
    id: "act-lucas-1",
    user: { id: "u-lucas", name: "Lucas", handle: "luclu_ultra", avatar: "🐻", totem: "🐻" },
    kind: "run",
    agoMinutes: 560,
    payload: {
      runTitle: "Aventure de zinzin",
      runDistanceKm: 42.7,
      runElevation: 2850,
    },
  },
  {
    id: "act-clem-1",
    user: { id: "u-clem", name: "Clem", handle: "clementinaa", avatar: "🦌", totem: "🦌" },
    kind: "badge",
    agoMinutes: 1020,
    payload: { badgeName: "10 sorties en mai", badgeEmoji: "🏅" },
  },
  {
    id: "act-mat-2",
    user: { id: "u-mathilde", name: "Mathilde", handle: "mat_trail", avatar: "🦊", totem: "🐺" },
    kind: "challenge",
    agoMinutes: 1440,
    payload: { challengeName: "5000 D+ en mai" },
  },
  {
    id: "act-tom-2",
    user: { id: "u-thomas", name: "Thomas", handle: "tom.runner", avatar: "🦅", totem: "🦅" },
    kind: "run",
    agoMinutes: 1800,
    payload: {
      runTitle: "Belle séance — fractions en côte",
      runDistanceKm: 11.2,
      runElevation: 320,
    },
  },
  {
    id: "act-sarah-2",
    user: { id: "u-sarah", name: "Sarah", handle: "sarahmtn", avatar: "🐐", totem: "🐐" },
    kind: "badge",
    agoMinutes: 2880,
    payload: { badgeName: "Première sortie de nuit", badgeEmoji: "🌙" },
  },
  {
    id: "act-louise-1",
    user: { id: "u-louise", name: "Louise", handle: "louise.run", avatar: "🦊", totem: "🦊" },
    kind: "best",
    agoMinutes: 4320,
    payload: { bestKind: "D+", bestValue: "+1240m en 2h" },
  },
  {
    id: "act-marc-1",
    user: { id: "u-marc", name: "Marc", handle: "marcoulons", avatar: "🦌", totem: "🦌" },
    kind: "race",
    agoMinutes: 5760,
    payload: { raceName: "Trail du Vercors", raceDate: "2026-06-12T06:00:00.000Z" },
  },
];

/** Format "il y a Xh", "il y a Xj" — heuristique humanisée. */
export function formatAgo(minutes: number): string {
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${Math.floor(minutes)} min`;
  const h = minutes / 60;
  if (h < 24) return `il y a ${Math.floor(h)}h`;
  const d = h / 24;
  if (d < 7) return `il y a ${Math.floor(d)}j`;
  const w = d / 7;
  return `il y a ${Math.floor(w)} sem`;
}

/** Sentence pour résumer l'activité — utilisé dans la card. */
export function activitySentence(a: PotosActivity): string {
  switch (a.kind) {
    case "run":
      return `${a.payload.runDistanceKm?.toFixed(1)} km · +${a.payload.runElevation} D+`;
    case "best":
      return `Record ${a.payload.bestKind} · ${a.payload.bestValue}`;
    case "badge":
      return `Badge "${a.payload.badgeName}"`;
    case "challenge":
      return `A rejoint le défi "${a.payload.challengeName}"`;
    case "race":
      return `Inscrit·e à ${a.payload.raceName}`;
  }
}

/** Ligne d'accroche du dessus (ce qui apparaît en plus gros). */
export function activityHook(a: PotosActivity): string {
  switch (a.kind) {
    case "run":
      return a.payload.runTitle ?? "Sortie";
    case "best":
      return "Record perso battu";
    case "badge":
      return `${a.payload.badgeEmoji ?? "🏅"} Nouveau badge`;
    case "challenge":
      return "Nouveau défi";
    case "race":
      return "Course en vue";
  }
}
