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

type SessionType = "easy" | "long" | "interval" | "hill" | "rest" | "race";
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
          "type": "easy|long|interval|hill|rest|race",
          "title": "Titre court percutant",
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
- Chaque semaine a entre 3 et 5 sessions
- Au moins 1 session "rest" par semaine
- "duration" en minutes, "distance" en km, "elevation" en mètres
- Si pas de distance/elevation pertinente, mets 0
- "nutritionTip" : progression progressive de la quantité de glucides/h sur la durée du plan, en cohérence avec le gut training. Démarre à 30g/h en foundation, monte par paliers, atteint 80g/h en peak. Sur les sessions "easy" courtes, mentionne juste l'hydratation.`;
}

interface ClaudeResponse {
  summary?: string;
  plan?: PlanWeek[];
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

    sessions.push({
      type: "easy",
      title: "Footing souple Z2",
      duration: 45,
      distance: Math.round(targetKm * 0.25),
      intensity: "low",
      notes: "Zone 2 — tu peux parler sans forcer",
    });

    if ((phase === "build" || phase === "peak") && avail >= 3) {
      sessions.push({
        type: "interval",
        title: "Fractionné court",
        duration: 55,
        distance: Math.round(targetKm * 0.2),
        intensity: "high",
        notes: "6x3min Z4 récup 2min Z1",
      });
    }

    if (
      (goal === "first-trail" ||
        goal === "first-ultra" ||
        goal === "utmb-qualif") &&
      phase !== "taper" &&
      avail >= 3
    ) {
      sessions.push({
        type: "hill",
        title: "Répétitions de côtes",
        duration: 65,
        distance: Math.round(targetKm * 0.2),
        elevation: Math.round(targetD * 0.35),
        intensity: "high",
        notes: "6x côte 1min en Z4 — descente en récup",
      });
    }

    sessions.push({
      type: "long",
      title: phase === "peak" ? "Sortie longue terrain" : "Sortie longue",
      duration: phase === "peak" ? 180 : 120,
      distance: Math.round(targetKm * 0.45),
      elevation: Math.round(targetD * 0.6),
      intensity: "moderate",
      notes:
        phase === "peak"
          ? "Simule les conditions de course — ravito, textile, allure"
          : "Allure aisance — endurance fondamentale",
    });

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
    const totalWeeks = WEEKS_BY_GOAL[goal];

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
      return NextResponse.json({
        ok: true,
        goal,
        totalWeeks: claudeResult.plan.length,
        generatedAt: new Date().toISOString(),
        source: "claude-sonnet-4.6",
        summary: claudeResult.summary,
        plan: claudeResult.plan,
      });
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
