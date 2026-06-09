import { NextRequest, NextResponse } from "next/server";

// ====== COACH IA CLAUDE — GÉNÉRATION DE PLAN D'ENTRAÎNEMENT TRAIL ======
//
// Endpoint POST /api/coach/plan
// Si ANTHROPIC_API_KEY est présent → appel Claude pour plan sur mesure.
// Sinon → fallback générateur local déterministe (pour preview/dev).
//
// Body attendu :
// {
//   goal: "specific-trail" | "first-trail" | "improve-marathon" | "first-ultra" |
//         "utmb-qualif" | "lose-weight" | "rebuild" | "custom",
//   targetDate?: string,          // ISO date de la course objectif
//   currentLevel: {
//     weeklyKm: number,
//     longestRun: number,
//     weeklyElevation?: number,
//   },
//   constraints?: {
//     weeklyAvailability: number,
//     injuries?: string[],
//     terrain?: "flat" | "hilly" | "mountain",
//   },
//   freeText?: string,
// }

export const runtime = "nodejs";
export const maxDuration = 60;

type Goal =
  | "specific-trail"
  | "first-trail"
  | "improve-marathon"
  | "first-ultra"
  | "utmb-qualif"
  | "lose-weight"
  | "rebuild"
  | "custom";

const WEEKS_BY_GOAL: Record<Goal, number> = {
  "specific-trail": 16,
  "first-trail": 10,
  "improve-marathon": 12,
  "first-ultra": 16,
  "utmb-qualif": 24,
  "lose-weight": 12,
  rebuild: 8,
  custom: 12,
};

// Guidance contextuelle injectée dans le prompt Claude selon l'objectif
const GOAL_CONTEXT: Partial<Record<Goal, string>> = {
  "specific-trail": `OBJECTIF : Trail spécifique en conditions extrêmes (Marathon des Sables, trail dans la jungle, ultra en altitude, etc.).

Conseils SPÉCIFIQUES à intégrer dans le plan et les coachTips/nutritionTips :

Pour DÉSERT (Marathon des Sables, type Atacama, Sahara) :
- Acclimatation chaleur : sortie longue en heat suit, sauna 4×/semaine en peak (30 min à 90°C)
- Pieds : entraînement avec guêtres anti-sable, doubler la couche de tape préventif sur les zones de friction, NOK généreux
- Nutrition autonomie : porter sa bouffe à dos, 4500 kcal/jour, lyophilisés testés et re-testés
- Hydratation : 1L/h en course, électrolytes obligatoires (1g sel/L mini), pas plus de 600ml d'un coup pour pas saturer l'estomac
- Mental : étapes longues 6-12h sous 45°C, divisier en blocs de 10 km

Pour JUNGLE (type Jungle Marathon, Costa Rica) :
- Humidité 95% : préparation en hammam 3×/semaine, tee-shirts ultra-respirants techniques
- Boue/passages eau : chaussures avec drainage, double paire de chaussettes Injinji
- Insectes : DEET 50% + permethrine sur le matos, traitement antipaludéen anticipé
- Nutrition tropicale : prévoir bouffe ne dépendant pas de la chaîne du froid, électrolytes renforcés
- Visibilité courte : entraîner le mental sur sentiers en forêt dense, pas de GPS fiable

Pour ALTITUDE (type UTMB CCC réelle, Hardrock, runs ≥ 2500m) :
- Acclimatation 7-10 jours avant si possible
- Stages altitude en chambre hypoxique 2 mois avant (3000m simulé, 1h/jour)
- Cardio adapté : -10% allure en altitude, écouter la respiration

Le plan doit inclure :
- Phase foundation : 6 semaines volume + base aérobie en zone 2
- Phase build : 6 semaines spécifique aux conditions (heat training / humidité / hypoxie selon contexte)
- Phase peak : 2 semaines de simulation course (textile complet, ravito embarqué, conditions)
- Phase taper : 2 semaines affûtage + dernière acclimatation
- Demander dans freeText le type exact (désert/jungle/altitude) pour adapter; sinon couvrir les 3.`,
  "improve-marathon": `OBJECTIF : Battre son Record Personnel sur marathon (route, 42.195 km).
Le plan doit inclure une progression en allure spécifique marathon, des séances à allure tempo, des sorties longues avec blocs en allure cible, et un affûtage de 2-3 semaines avant le jour J.
Les coachTips doivent parler de stratégie de course (split négatif, sucre dès 30 min), de pacing, et de la gestion mentale du mur du 30e.`,
};

// Élargi suite au feedback user (variété + renfo systématique) :
// - tempo / seuil : couvre tempo + seuil + fartlek (notes le détaillent)
// - strength : renfo musculaire systématique 1×/semaine tous niveaux
// - interval reste pour fractionné court + pyramidal (notes le détaillent)
type SessionType = "easy" | "long" | "interval" | "hill" | "tempo" | "strength" | "rest" | "race";
type Phase = "foundation" | "build" | "peak" | "taper" | "race";

interface PlanSession {
  type: SessionType;
  title: string;
  duration: number;
  distance?: number;
  elevation?: number;
  intensity: "low" | "moderate" | "high";
  notes?: string;
}

interface PlanWeek {
  week: number;
  phase: Phase;
  label: string;
  focus: string;
  weeklyKm: number;
  weeklyElevation: number;
  sessions: PlanSession[];
  coachTip: string;
  nutritionTip?: string;
}

// ====== CLAUDE API — Coach IA sur mesure ======

const CLAUDE_SYSTEM_PROMPT = `Tu es un coach expert en trail running et ultra-trail. Tu as formé des centaines de traileurs, du premier 10K au finisher UTMB.

Ta spécialité : concevoir des plans d'entraînement personnalisés, progressifs, réalistes, qui tiennent compte du profil du coureur (volume actuel, dispo, terrain, contraintes).

RÈGLES DE PÉRIODISATION :
- Foundation (premiers 35%) : volume bas-modéré, intensité low, endurance fondamentale Z2
- Build (35-70%) : montée en charge progressive, introduction de fractionné/côtes
- Peak (70-90%) : grosses séances spécifiques — sortie longue simulant le Jour J
- Taper (90-98%) : affûtage, volume -40%, intensité maintenue courte
- Race (100%) : jour J, séance "course"

RÈGLES DE SÉCURITÉ :
- Progression max +10% de volume par semaine
- Semaine de décharge toutes les 3-4 semaines (-25 à -30%)
- 1 à 2 séances qualité / semaine, pas plus
- Toujours 1 jour de repos complet minimum

RÈGLES DE MAGNITUDE — IMPÉRATIVES, NE JAMAIS LES VIOLER :
- Vitesse plausible humaine : 6 à 14 km/h selon intensité. Donc :
  - Footing facile Z2 : 8-11 km/h → 60 min = 8-11 km MINIMUM. JAMAIS "footing 2 km en 45 min".
  - Sortie longue : 7-10 km/h → 2h = 14-20 km MINIMUM. JAMAIS "sortie longue 3 km en 2h".
  - Fractionné (effort + récup) : moyenne 9-12 km/h → 60 min = 9-12 km.
  - Côtes (montées + descentes) : moyenne 6-9 km/h → 60 min = 6-9 km + 300-500 m D+.
  - Tempo / seuil : 11-14 km/h → 45 min = 8-10 km.
- Cohérence hebdo : la somme des distances des sessions de la semaine ≈ weeklyKm (±15%). Si tu écris weeklyKm=50, tu DOIS avoir ~50 km de sessions cumulés.
- Cohérence ultra : si l'objectif est first-ultra ou utmb-qualif, weeklyKm en peak DOIT atteindre 60-90 km/semaine. Un ultra ne se prépare pas avec 25 km/semaine.
- Sortie longue : représente 30-45% du volume hebdo. Pour 50 km/sem → SL de 18-22 km. Pour 80 km/sem → SL de 28-32 km.
- Pour duration : exprime en MINUTES TOTALES (incluant récup pour fractionné). Footing 1h = 60. Sortie longue 2h30 = 150. JAMAIS de fractions absurdes.

VARIÉTÉ DES SÉANCES — OBLIGATOIRE DÈS LA SEMAINE 1 :
Tu disposes de 8 types : easy, long, interval, hill, tempo, strength, rest, race.
- "tempo" : tempo (allure soutenue 15-30min Z3), seuil (Z3-Z4 20-40min), fartlek (Z2/Z4 alterné en libre), progressif (allure montante)
- "interval" : VMA courte (30/30, 400m), VMA longue (1000m, 2000m), pyramidal (200-400-600-800-600-400-200), 30/15 court
- "hill" : côtes courtes (30s-1min), côtes longues (3-5min), côtes en descente technique
- "strength" : renforcement musculaire — OBLIGATOIRE 1×/SEMAINE TOUS NIVEAUX
  - débutant : 30-45 min poids du corps (squat, gainage, fentes, talons-fesses, mollets)
  - confirmé : 45-60 min, ajout d'haltères modérés (squat goblet, soulevé de terre roumain, presses), pliométrie légère
  - ultra : 60-75 min, charges + spécifique trail (squat barre, fentes lourdes, pliométrie, gainage long, travail cheville/pied)
- Varie les types de séance dès la semaine 1. Ne répète JAMAIS la même séance trois semaines de suite. En foundation tu fais déjà du tempo court et des côtes courtes — pas que du Z2.

EXEMPLES DE COHÉRENCE (à respecter) :
- Plan "first-ultra" S1 (foundation, débutant) : easy 8 km/55 min + strength 45 min + hill 6 km/45 min + long 16 km/2h. Total = 30 km. weeklyKm = 30.
- Plan "first-ultra" S8 (peak, confirmé) : easy 10 km/60 min + tempo 12 km/65 min + strength 60 min + long 32 km/4h. Total = 54 km. weeklyKm = 54.
- Plan "first-trail" S1 (foundation, débutant) : easy 6 km/45 min + strength 35 min + long 12 km/1h45. Total = 18 km. weeklyKm = 18.

RÈGLES NUTRITION & GUT TRAINING :
- Sur 1 trail < 1h : pas de glucides, hydratation libre.
- Sur 1-2h : 30-60 g glucides/h, 400-600 ml eau/h, 200-500 mg sodium/h.
- Sur 2-3h : 60-75 g glucides/h, 500-700 ml eau/h, 300-600 mg sodium/h.
- Sur 3-4h : 70-85 g glucides/h, alterner gels + solides.
- Sur 4h+ (ultra) : 70-90 g glucides/h, vraie nourriture obligatoire (sandwich, riz, baby pots), 500-800 mg sodium/h.
- Le gut training s'apprend en 6-8 semaines : commencer à 30 g/h en sortie longue, monter +15g toutes les 2 semaines pour atteindre 80-90 g/h le jour de course.
- Toujours s'entraîner avec les produits exacts qu'on prendra le jour J.
- Sur les sorties longues, ajouter une consigne nutrition explicite : "Test 60g/h aujourd'hui avec X gels".

TON STYLE :
- Direct, terre-à-terre, motivant sans être gnangnan
- Le tutoiement, jamais le vouvoiement
- Les conseils sont concrets, actionnables
- Tu cites des détails terrain (ravito, textile, altitude, dénivelé)

Tu réponds UNIQUEMENT avec du JSON valide, aucun texte avant ou après. Pas de backticks. Pas de \\\`\\\`\\\`json.`;

function buildUserPrompt(opts: {
  goal: Goal;
  targetDate?: string;
  weeklyKm: number;
  longestRun: number;
  weeklyElevation?: number;
  weeklyAvailability: number;
  injuries?: string[];
  terrain?: string;
  freeText?: string;
  totalWeeks: number;
}): string {
  const {
    goal,
    targetDate,
    weeklyKm,
    longestRun,
    weeklyElevation,
    weeklyAvailability,
    injuries,
    terrain,
    freeText,
    totalWeeks,
  } = opts;

  const contextBlock = GOAL_CONTEXT[goal] ? `\n${GOAL_CONTEXT[goal]}\n` : "";

  return `${contextBlock}PROFIL DU COUREUR :
- Objectif : ${goal}
${targetDate ? `- Date cible : ${targetDate}` : ""}
- Volume actuel : ${weeklyKm} km/semaine
- Sortie la plus longue récente : ${longestRun} km
${weeklyElevation ? `- D+ hebdo actuel : ${weeklyElevation} m` : ""}
- Disponibilité : ${weeklyAvailability} sorties/semaine
${terrain ? `- Terrain dispo : ${terrain}` : ""}
${injuries && injuries.length ? `- Blessures à gérer : ${injuries.join(", ")}` : ""}
${freeText ? `- Précisions : ${freeText}` : ""}

Génère un plan d'entraînement de ${totalWeeks} semaines. Retourne STRICTEMENT ce JSON (aucun texte autour) :

{
  "summary": "Résumé en 2-3 phrases du plan et de la stratégie",
  "plan": [
    {
      "week": 1,
      "phase": "foundation|build|peak|taper|race",
      "label": "Semaine X ou Semaine décharge",
      "focus": "Focus de la semaine en 1 phrase",
      "weeklyKm": 30,
      "weeklyElevation": 800,
      "sessions": [
        {
          "type": "easy|long|interval|hill|tempo|strength|rest|race",
          "title": "Titre court percutant (ex : 'Pyramidal 200-400-600', 'Tempo 25min Z3', 'Renfo trail 45min')",
          "duration": 45,
          "distance": 10,
          "elevation": 200,
          "intensity": "low|moderate|high",
          "notes": "Consigne précise et actionnable"
        }
      ],
      "coachTip": "Conseil du coach pour cette semaine, ton direct et terre-à-terre",
      "nutritionTip": "Consigne nutrition / gut training spécifique de cette semaine (ex : 'Test 45g de glucides/h sur ta sortie longue, 1 gel toutes les 30 min')"
    }
  ]
}

Contraintes :
- Exactement ${totalWeeks} semaines
- Chaque semaine a entre 4 et 6 sessions
- Au moins 1 session "rest" par semaine
- TOUJOURS 1 session "strength" par semaine (renfo, charge calibrée par niveau) — sauf race/taper extrême
- Varie les types interval / hill / tempo entre les semaines (pas la même séance copiée-collée)
- "duration" en minutes ENTIÈRES, "distance" en km (peut être décimal), "elevation" en mètres entiers
- Pour "rest" et "strength" : "distance" et "elevation" = 0, pas de course
- Pour "race" : "distance" et "elevation" = celle de la course (extrait du contexte)
- weeklyKm = somme des distances des sessions (à ±15%)
- weeklyElevation = somme des elevations des sessions (à ±15%)
- VALIDATION INTERNE AVANT DE RENDRE LE JSON : pour chaque session non-rest/strength, vérifie que distance/duration*60 donne une vitesse entre 6 et 14 km/h. Si non, recalcule.
- "nutritionTip" : progression progressive de la quantité de glucides/h sur la durée du plan, en cohérence avec le gut training. Démarre à 30g/h en foundation, monte par paliers, atteint 80g/h en peak. Sur les sessions "easy" courtes, mentionne juste l'hydratation.`;
}

interface ClaudeResponse {
  summary?: string;
  plan?: PlanWeek[];
}

// ====== SANITIZER — Validation/normalisation des valeurs Claude ======
// L'IA peut renvoyer des conneries du type "footing 2 km en 45 min" qui
// ruinent la crédibilité du plan. On valide chaque séance et on corrige les
// magnitudes incohérentes avant d'envoyer au client. Si TROP de violations
// (> 30 % des séances), on retombe sur le générateur déterministe.

const VITESSE_PAR_TYPE: Record<SessionType, { min: number; max: number; defaut: number }> = {
  // En km/h
  easy:     { min: 7,  max: 11, defaut: 9 },
  long:     { min: 6,  max: 10, defaut: 8 },
  interval: { min: 9,  max: 13, defaut: 11 },
  hill:     { min: 5,  max: 9,  defaut: 7 },
  tempo:    { min: 10, max: 14, defaut: 12 },
  strength: { min: 0,  max: 0,  defaut: 0 },
  rest:     { min: 0,  max: 0,  defaut: 0 },
  race:     { min: 6,  max: 12, defaut: 9 },
};

/** Sanitize une session : retourne {session, fixed: boolean}. */
function sanitizeSession(s: PlanSession): { session: PlanSession; fixed: boolean } {
  const type = s.type;
  let fixed = false;
  const out: PlanSession = { ...s };

  // Bornes duration : min 15min (sauf race), max 12h
  if (typeof out.duration !== "number" || out.duration < 15) {
    if (type !== "race") {
      out.duration = 30;
      fixed = true;
    }
  }
  if (out.duration > 720) {
    out.duration = 720;
    fixed = true;
  }

  // Sessions sans course : distance/elevation = 0
  if (type === "rest" || type === "strength") {
    if (out.distance && out.distance > 0) {
      out.distance = 0;
      fixed = true;
    }
    if (out.elevation && out.elevation > 0) {
      out.elevation = 0;
      fixed = true;
    }
    return { session: out, fixed };
  }

  // Sessions de course : validation vitesse vs duration
  const { min, max, defaut } = VITESSE_PAR_TYPE[type];
  const hours = out.duration / 60;
  const distance = out.distance ?? 0;
  if (hours > 0 && distance > 0) {
    const vitesse = distance / hours;
    if (vitesse < min || vitesse > max) {
      // Distance hors-zone : on recalcule avec la vitesse par défaut
      out.distance = Math.round(defaut * hours * 10) / 10;
      fixed = true;
    }
  } else if (hours > 0 && distance === 0 && type !== "race") {
    // Distance manquante : on infère
    out.distance = Math.round(defaut * hours * 10) / 10;
    fixed = true;
  }

  // Elevation : sanity check pour hill (50-200 m D+ par km)
  if (type === "hill" && out.distance && (!out.elevation || out.elevation < out.distance * 30)) {
    out.elevation = Math.round(out.distance * 60);
    fixed = true;
  }
  // Cap elevation absurde : > 200 m D+/km c'est de l'alpinisme
  if (out.elevation && out.distance && out.elevation > out.distance * 200) {
    out.elevation = Math.round(out.distance * 150);
    fixed = true;
  }

  return { session: out, fixed };
}

/**
 * Sanitize toute la réponse Claude. Si plus de 30 % des séances sont buggées,
 * on retourne null et le caller fallback sur le générateur déterministe.
 */
function sanitizePlan(plan: PlanWeek[]): PlanWeek[] | null {
  let totalSessions = 0;
  let totalFixed = 0;
  const fixed: PlanWeek[] = [];

  for (const week of plan) {
    const sessions: PlanSession[] = [];
    for (const s of week.sessions ?? []) {
      const { session, fixed: wasFixed } = sanitizeSession(s);
      totalSessions++;
      if (wasFixed) totalFixed++;
      sessions.push(session);
    }

    // Recalcule weeklyKm / weeklyElevation depuis la somme des sessions
    // (Claude se trompe souvent sur la totalisation hebdo).
    const computedKm =
      Math.round(
        sessions.reduce((sum, s) => sum + (s.distance ?? 0), 0) * 10,
      ) / 10;
    const computedD = sessions.reduce(
      (sum, s) => sum + (s.elevation ?? 0),
      0,
    );

    // Si l'écart avec ce que Claude a annoncé est < 15 %, on garde la valeur
    // Claude (plus jolie). Sinon on prend notre recalcul.
    const claimedKm = week.weeklyKm ?? 0;
    const claimedD = week.weeklyElevation ?? 0;
    const weeklyKm =
      claimedKm > 0 && Math.abs(claimedKm - computedKm) / Math.max(claimedKm, 1) < 0.15
        ? claimedKm
        : computedKm;
    const weeklyElevation =
      claimedD > 0 && Math.abs(claimedD - computedD) / Math.max(claimedD, 1) < 0.15
        ? claimedD
        : computedD;

    fixed.push({
      ...week,
      sessions,
      weeklyKm,
      weeklyElevation,
    });
  }

  // Trop d'erreurs : on jette le plan Claude.
  if (totalSessions > 0 && totalFixed / totalSessions > 0.3) {
    console.warn(
      `[Coach IA] Plan Claude rejeté : ${totalFixed}/${totalSessions} séances corrigées (>30%). Fallback local.`,
    );
    return null;
  }

  return fixed;
}

async function callClaude(prompt: string): Promise<ClaudeResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        system: CLAUDE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const text: string = data?.content?.[0]?.text ?? "";

    // Parse le JSON renvoyé par Claude
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as ClaudeResponse;
  } catch (err) {
    console.error("Claude call failed:", err);
    return null;
  }
}

// ====== FALLBACK LOCAL — Générateur déterministe ======

function phaseForWeek(week: number, totalWeeks: number): Phase {
  const pct = week / totalWeeks;
  if (pct <= 0.35) return "foundation";
  if (pct <= 0.7) return "build";
  if (pct <= 0.9) return "peak";
  if (pct < 1) return "taper";
  return "race";
}

function generatePlan(opts: {
  goal: Goal;
  weeklyKm: number;
  weeklyAvailability: number;
}): PlanWeek[] {
  const { goal, weeklyKm, weeklyAvailability } = opts;
  const totalWeeks = WEEKS_BY_GOAL[goal];
  const weeks: PlanWeek[] = [];

  for (let w = 1; w <= totalWeeks; w++) {
    const phase = phaseForWeek(w, totalWeeks);
    const isDeload = w % 4 === 0 && phase !== "taper" && phase !== "race";
    const progressFactor = isDeload ? 0.7 : 1 + (w - 1) * 0.08;
    const cappedFactor =
      phase === "taper" ? 0.6 - (w - totalWeeks + 2) * 0.2 : progressFactor;

    const targetKm = Math.round(weeklyKm * Math.max(0.5, cappedFactor));
    const targetD = Math.round(targetKm * (goal === "first-ultra" ? 35 : 25));

    const sessions: PlanSession[] = [];
    const avail = Math.min(5, Math.max(2, weeklyAvailability));

    // Sortie facile Z2 — toujours en S1, distance cohérente avec durée
    // (45 min ≈ 7 km à 9.3 km/h, magnitude réaliste, plus de "2 km en 45 min")
    const easyDist = Math.max(5, Math.round(targetKm * 0.25));
    sessions.push({
      type: "easy",
      title: "Footing souple Z2",
      duration: Math.round((easyDist / 9) * 60),
      distance: easyDist,
      intensity: "low",
      notes: "Zone 2 — tu peux parler sans forcer",
    });

    // VARIÉTÉ : on alterne interval / tempo / fartlek selon la semaine
    // Plus la même séance copiée-collée sur 5 semaines.
    if (avail >= 3 && phase !== "race") {
      const qualityRot = w % 3;
      if (phase === "foundation") {
        // Foundation : tempo court ou fartlek (pas de VMA hard)
        if (qualityRot === 0) {
          const dist = Math.max(6, Math.round(targetKm * 0.2));
          sessions.push({
            type: "tempo",
            title: "Tempo Z3 progressif",
            duration: Math.round((dist / 11) * 60),
            distance: dist,
            intensity: "moderate",
            notes: "10min échauffement + 20min en Z3 + 10min retour calme",
          });
        } else if (qualityRot === 1) {
          const dist = Math.max(7, Math.round(targetKm * 0.22));
          sessions.push({
            type: "tempo",
            title: "Fartlek libre",
            duration: Math.round((dist / 10.5) * 60),
            distance: dist,
            intensity: "moderate",
            notes: "Alterne 2min Z4 / 2min Z2 selon les sensations, 5-6 fois",
          });
        } else {
          const dist = Math.max(6, Math.round(targetKm * 0.2));
          sessions.push({
            type: "hill",
            title: "Côtes courtes Z3",
            duration: Math.round((dist / 7) * 60),
            distance: dist,
            elevation: Math.round(dist * 50),
            intensity: "moderate",
            notes: "6×côte 45s allure soutenue, descente récup. Pas la mort.",
          });
        }
      } else if (phase === "build" || phase === "peak") {
        // Build/peak : VMA + côtes + pyramidal alternés
        if (qualityRot === 0) {
          const dist = Math.max(8, Math.round(targetKm * 0.22));
          sessions.push({
            type: "interval",
            title: "VMA 1000m",
            duration: Math.round((dist / 11) * 60),
            distance: dist,
            intensity: "high",
            notes: "5×1000m Z4 récup 2min trot. Allure 5'/km cible.",
          });
        } else if (qualityRot === 1) {
          const dist = Math.max(8, Math.round(targetKm * 0.22));
          sessions.push({
            type: "interval",
            title: "Pyramidal 200-400-600-800-600-400-200",
            duration: Math.round((dist / 11) * 60),
            distance: dist,
            intensity: "high",
            notes: "Récup = durée de l'effort en trot Z1",
          });
        } else {
          const dist = Math.max(7, Math.round(targetKm * 0.2));
          sessions.push({
            type: "hill",
            title: "Côtes longues 3min",
            duration: Math.round((dist / 7.5) * 60),
            distance: dist,
            elevation: Math.round(dist * 70),
            intensity: "high",
            notes: "5×3min côte Z4 — descente technique en récup active",
          });
        }
      }
    }

    // SORTIE LONGUE : 35-45% du volume hebdo, vitesse 7-9 km/h
    const longDist = Math.max(10, Math.round(targetKm * 0.4));
    sessions.push({
      type: "long",
      title: phase === "peak" ? "Sortie longue terrain" : "Sortie longue",
      duration: Math.round((longDist / (phase === "peak" ? 7.5 : 8.5)) * 60),
      distance: longDist,
      elevation: Math.round(targetD * 0.6),
      intensity: "moderate",
      notes:
        phase === "peak"
          ? "Simule les conditions de course — ravito, textile, allure"
          : "Allure aisance — endurance fondamentale",
    });

    // RENFO MUSCULAIRE — OBLIGATOIRE tous les niveaux (feedback user)
    // Charge calibrée : débutant = poids du corps, confirmé = haltères modérés,
    // ultra = barres + pliométrie. Pas en taper extrême ni race.
    if (phase !== "race" && !(phase === "taper" && w === totalWeeks - 1)) {
      const strengthMin =
        goal === "utmb-qualif" || goal === "first-ultra"
          ? 60
          : goal === "first-trail" || goal === "improve-marathon"
            ? 45
            : 35;
      sessions.push({
        type: "strength",
        title: "Renfo trail",
        duration: strengthMin,
        intensity: "moderate",
        notes:
          goal === "utmb-qualif" || goal === "first-ultra"
            ? "Squat barre, fentes lourdes, pliométrie, gainage 5min, travail cheville/pied. 4 séries."
            : goal === "improve-marathon"
              ? "Squat goblet, soulevé de terre roumain, presses, gainage 3min. 3-4 séries."
              : "Poids du corps : squats, fentes, gainage 2min, talons-fesses, mollets. 3 séries.",
      });
    }

    if (phase === "race") {
      sessions.push({
        type: "race",
        title: "🏁 COURSE OBJECTIF",
        duration: 0,
        intensity: "high",
        notes: "Tu y es. Kiffe.",
      });
    }

    sessions.push({
      type: "rest",
      title: "Repos ou récup active",
      duration: 30,
      intensity: "low",
      notes: "Étirements, mobilité, marche",
    });

    weeks.push({
      week: w,
      phase,
      label: isDeload ? "Semaine décharge" : `Semaine ${w}`,
      focus:
        phase === "foundation"
          ? "Poser les bases — endurance fondamentale"
          : phase === "build"
          ? "Montée en charge progressive"
          : phase === "peak"
          ? "Dernières grosses séances spécifiques"
          : phase === "taper"
          ? "Affûtage — on relâche, on garde le feu"
          : "Jour J",
      weeklyKm: targetKm,
      weeklyElevation: targetD,
      sessions,
      coachTip: coachTipForPhase(phase, w, goal),
      nutritionTip: nutritionTipForPhase(phase, w),
    });
  }

  return weeks;
}

// Gut training progressif : 30 g/h en foundation → 90 g/h en peak.
// Sur taper/race, on rappelle juste ce qui doit déjà être maîtrisé.
function nutritionTipForPhase(phase: Phase, week: number): string {
  const cycle = (week - 1) % 3;
  const target = {
    foundation: [30, 35, 40],
    build:      [45, 55, 60],
    peak:       [70, 80, 85],
    taper:      [60, 70, 80],
    race:       [80],
  }[phase][cycle] || 60;

  const phaseTips: Record<Phase, string[]> = {
    foundation: [
      `Sur la sortie longue, vise ${target} g de glucides/h. 1 gel toutes les 30-40 min ou 1 barre/h. Hydratation libre.`,
      `Routine ${target} g/h sur sortie longue. Note ce que tu digères bien — c'est ton arsenal de course.`,
      `Pousse à ${target} g/h en sortie longue, ajoute ta première pastille de sel à mi-séance.`,
    ],
    build: [
      `Monte à ${target} g/h en sortie longue. Ajoute 300 mg sodium/h. Les coups de moins bien doivent disparaître.`,
      `Test ${target} g/h sur ta sortie longue, à l'allure visée pour la course. Si ça ballonne, retombe à -10g.`,
      `${target} g/h en sortie longue + 500 ml eau/h + sel. Tu rodes ton plan exact de course.`,
    ],
    peak: [
      `${target} g/h, gels alternés avec solides (banane, pâte de fruit). Sur 4h+, intègre vraie nourriture salée.`,
      `Cible jour J : ${target} g/h. Ta sortie longue de cette semaine simule la course exactement (mêmes produits, même timing).`,
      `Dernière vraie sortie longue. ${target} g/h, ton plan est verrouillé. Aucune nouveauté à partir de maintenant.`,
    ],
    taper: [
      `Affûtage : tu maintiens ${target} g/h sur la sortie longue, mais les volumes baissent. Stocke du glycogène les 3 derniers jours.`,
      `J-7 : repas à dominante glucides complexes. Pas de nouveau produit, pas de nouveau test.`,
      `Pas d'expérimentation. Tu as ce qu'il faut. Concentre-toi sur l'hydratation.`,
    ],
    race: [
      `Jour J : ${target} g/h, 600-800 ml eau/h, 500-700 mg sodium/h. Premier gel à 30 min, puis routine fixe.`,
    ],
  };

  return phaseTips[phase][cycle] || phaseTips[phase][0];
}

function coachTipForPhase(phase: Phase, week: number, goal: Goal): string {
  const tips: Record<Phase, string[]> = {
    foundation: [
      "On démarre tranquille. L'endurance se construit sur le temps long.",
      "Zone 2 c'est ennuyeux mais c'est le moteur de ta progression.",
      "Ne saute pas les sorties faciles. Elles sont le 80%.",
    ],
    build: [
      "Les séances piquent ? Parfait, c'est qu'on progresse.",
      "Hydrate-toi la veille des séances dures — pas seulement pendant.",
      "Si tu galères après 2 séances dures d'affilée, ajoute 1 jour de repos.",
    ],
    peak: [
      "Tu testes maintenant ce que tu vivras le jour J. Textile, ravito, allure.",
      "La sortie longue simule la course — même heure de départ si possible.",
      "Si tu ressens une gêne, stoppe. On ne se blesse pas à 2 semaines du Jour J.",
    ],
    taper: [
      "Moins de volume = plus de fraîcheur. N'en fais pas plus.",
      "Garde 1 séance vive courte pour rester aiguisé.",
      "Sommeil + nutrition > kilomètres cette semaine.",
    ],
    race: [
      "Tout est fait. Respire. Mange bien. Dors. Et kiffe.",
      goal === "first-ultra"
        ? "80% mental, 20% physique. Divise la course en sections."
        : "Pars 15\"/km plus lent que ton allure cible. Remonte sur la deuxième moitié.",
    ],
  };
  const pool = tips[phase];
  return pool[week % pool.length];
}

// ====== HANDLERS ======

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const goal = (body.goal as Goal) || "first-ultra";
    const weeklyKm = body.currentLevel?.weeklyKm ?? 30;
    const longestRun = body.currentLevel?.longestRun ?? weeklyKm / 2;
    const weeklyElevation = body.currentLevel?.weeklyElevation;
    const weeklyAvailability = body.constraints?.weeklyAvailability ?? 4;
    const injuries = body.constraints?.injuries;
    const terrain = body.constraints?.terrain;
    const freeText = body.freeText;
    const targetDate = body.targetDate;
    // Si l'utilisateur vient de /race/[id]?raceId=, on passe explicitement
    // le nombre de semaines de prépa restant (clampé 4-24 côté client). On
    // override sinon le default WEEKS_BY_GOAL — sinon une course dans 6
    // semaines reçoit un plan de 16 semaines, et le taper ne tombe pas.
    const explicitWeeks =
      typeof body.constraints?.totalWeeks === "number"
        ? Math.max(4, Math.min(24, body.constraints.totalWeeks))
        : null;
    const totalWeeks = explicitWeeks ?? WEEKS_BY_GOAL[goal];

    // 1. Tentative Claude IA
    const prompt = buildUserPrompt({
      goal,
      targetDate,
      weeklyKm,
      longestRun,
      weeklyElevation,
      weeklyAvailability,
      injuries,
      terrain,
      freeText,
      totalWeeks,
    });

    const claudeResult = await callClaude(prompt);

    if (claudeResult?.plan && Array.isArray(claudeResult.plan)) {
      // Filet de sécurité : on valide/normalise chaque séance avant de
      // renvoyer au client. Cf. feedback user "footing 2 km en 45 min".
      const sanitized = sanitizePlan(claudeResult.plan);
      if (sanitized) {
        return NextResponse.json({
          ok: true,
          goal,
          totalWeeks: sanitized.length,
          generatedAt: new Date().toISOString(),
          source: "claude-sonnet-4.6",
          summary: claudeResult.summary,
          plan: sanitized,
        });
      }
      // Si plus de 30 % des séances ont été corrigées, on rejette
      // complètement le plan Claude et on retombe sur le générateur local.
    }

    // 2. Fallback local déterministe
    const plan = generatePlan({ goal, weeklyKm, weeklyAvailability });

    return NextResponse.json({
      ok: true,
      goal,
      totalWeeks: plan.length,
      generatedAt: new Date().toISOString(),
      source: process.env.ANTHROPIC_API_KEY ? "local-fallback" : "local-no-key",
      plan,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

export async function GET() {
  const plan = generatePlan({
    goal: "first-ultra",
    weeklyKm: 40,
    weeklyAvailability: 4,
  });
  return NextResponse.json({
    ok: true,
    goal: "first-ultra",
    totalWeeks: plan.length,
    generatedAt: new Date().toISOString(),
    source: "local-demo",
    plan,
  });
}
