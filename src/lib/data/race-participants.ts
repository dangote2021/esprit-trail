// ====== race-participants.ts ======
// Mock data des traileurs de la communauté qui sont inscrits à une course.
// Pour le MVP : on a 4-8 personas par course iconique. À terme :
//   - table race_participations Supabase
//   - join avec profiles pour récupérer avatar/handle
//   - real-time via channel "race:{id}"
//
// Pour les courses non iconiques, on retombe sur une liste générique
// (DEFAULT_PARTICIPANTS) pour ne jamais avoir une page vide.

export type RaceParticipant = {
  id: string;
  name: string;
  handle: string;
  avatar: string; // emoji ou totem
  /** Format choisi (si la course a plusieurs distances). */
  format?: string;
  /** Petite phrase libre du traileur (motivation, objectif, etc.) */
  vibe?: string;
};

// Pool de personas connus de l'app (cohérent avec leaderboard + potos feed)
const PERSONAS: Record<string, Omit<RaceParticipant, "format" | "vibe">> = {
  mathilde: { id: "u-mathilde", name: "Mathilde", handle: "mat_trail", avatar: "🐺" },
  thomas: { id: "u-thomas", name: "Thomas", handle: "tom.runner", avatar: "🦅" },
  sarah: { id: "u-sarah", name: "Sarah", handle: "sarahmtn", avatar: "🐐" },
  lucas: { id: "u-lucas", name: "Lucas", handle: "luclu_ultra", avatar: "🐻" },
  clem: { id: "u-clem", name: "Clem", handle: "clementinaa", avatar: "🦌" },
  louise: { id: "u-louise", name: "Louise", handle: "louise.run", avatar: "🦊" },
  marc: { id: "u-marc", name: "Marc", handle: "marcoulons", avatar: "🦌" },
};

const PARTICIPATIONS: Record<string, RaceParticipant[]> = {
  "utmb-2026": [
    { ...PERSONAS.lucas, format: "UTMB", vibe: "Premier 170, on verra ce que ça donne" },
    { ...PERSONAS.mathilde, format: "CCC" },
    { ...PERSONAS.thomas, format: "OCC", vibe: "Objectif sub-7h" },
    { ...PERSONAS.sarah, format: "MCC" },
  ],
  "ccc-2026": [
    { ...PERSONAS.mathilde, vibe: "On la prépare en duo avec Thomas" },
    { ...PERSONAS.thomas },
    { ...PERSONAS.clem, vibe: "Première grosse course en Italie" },
  ],
  "diag-des-fous-2026": [
    { ...PERSONAS.lucas, format: "Diagonale des Fous" },
    { ...PERSONAS.marc, format: "Trail de Bourbon" },
  ],
  "hardrock-2026": [
    { ...PERSONAS.lucas, vibe: "Si je gagne au tirage au sort 🤞" },
  ],
  "6000d-2026": [
    { ...PERSONAS.sarah, format: "6000D — La Plagne", vibe: "Le D+ me parle" },
    { ...PERSONAS.thomas, format: "3000D — La Plagne" },
    { ...PERSONAS.clem, format: "1000D — La Plagne" },
  ],
  "maxirace-annecy-2026": [
    { ...PERSONAS.mathilde, format: "MaXi-Race", vibe: "Tour du lac en mode panoramique" },
    { ...PERSONAS.louise, format: "Maxi-Trail" },
    { ...PERSONAS.clem, format: "Marathon Race" },
    { ...PERSONAS.marc, format: "Short Race" },
  ],
  "ecotrail-paris-2026": [
    { ...PERSONAS.thomas, format: "45 km" },
    { ...PERSONAS.clem, format: "30 km", vibe: "Hâte de finir sous la Tour Eiffel" },
    { ...PERSONAS.louise, format: "18 km" },
  ],
  "saintelyon-2026": [
    { ...PERSONAS.mathilde, format: "SaintéLyon (78 km)" },
    { ...PERSONAS.lucas, vibe: "Le froid de nuit, c'est mon délire" },
    { ...PERSONAS.marc, format: "SaintExpress (44 km)" },
  ],
  "trail-cote-opale-2026": [
    { ...PERSONAS.louise, vibe: "Première course longue distance" },
    { ...PERSONAS.sarah, format: "Grand Trail" },
  ],
  "grand-raid-2026": [
    { ...PERSONAS.lucas, format: "Ultra-Tour 160" },
    { ...PERSONAS.mathilde, format: "Tour des Cirques (120 km)" },
  ],
  "trail-vercors-2026": [
    { ...PERSONAS.louise },
    { ...PERSONAS.clem, format: "Trail des Hauts-Plateaux" },
    { ...PERSONAS.thomas, format: "Trail des Crêtes" },
  ],
  "transju-trail-2026": [
    { ...PERSONAS.sarah, format: "TransJuTrail 76" },
    { ...PERSONAS.marc, format: "TransJuTrail 38" },
  ],
};

// Fallback générique — utilisé pour les courses sans data dédiée.
const DEFAULT_PARTICIPANTS: RaceParticipant[] = [
  { ...PERSONAS.thomas },
  { ...PERSONAS.louise },
];

export function participantsForRace(raceId: string): RaceParticipant[] {
  return PARTICIPATIONS[raceId] ?? DEFAULT_PARTICIPANTS;
}
