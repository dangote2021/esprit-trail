import { NextRequest, NextResponse } from "next/server";

// ====== COACH IA — GÉNÉRATION DE PLAN ======
//
// Endpoint POST /api/coach/plan
// Génère un plan d'entraînement personnalisé.
//
// Body attendu :
// {
//   goal: "first-10k" | "first-trail" | "improve-marathon" | "first-ultra" |
//         "utmb-qualif" | "lose-weight" | "rebuild" | "custom",
//   targetDate?: string,       // ISO date de la course objectif
//   currentLevel: {
//     weeklyKm: number,         // km actuels par semaine
//     longestRun: number,       // km de la sortie la + longue récente
//     weeklyElevation?: number, // D+ par semaine
//   },
//   constraints?: {
//     weeklyAvailability: number,  // sorties dispo/semaine
//     injuries?: string[],
//     terrain?: "flat" | "hilly" | "mountain",
//   },
//   freeText?: string,          // description libre (pour goal=custom)
// }
//
// Pour le MVP, on retourne un plan mocké déterministe calqué sur le cas "first-ultra".
// Plus tard, on enverra ce payload à l'API Claude pour une vraie génération.

type Goal =
  | "first-10k"
  | "first-trail"
  | "improve-marathon"
  | "first-ultra"
  | "utmb-qualif"
  | "lose-weight"
  | "rebuild"
  | "custom";

const WEEKS_BY_GOAL: Record<Goal, number> = {
  "first-10k": 8,
  "first-trail": 10,
  "improve-marathon": 12,
  "first-ultra": 16,
  "utmb-qualif": 24,
  "lose-weight": 12,
  rebuild: 8,
  custom: 12,
};

type SessionType = "easy" | "long" | "interval" | "hill" | "rest" | "race";
type Phase = "foundation" | "build" | "peak" | "taper" | "race";

interface PlanSession {
  type: SessionType;
  title: string;
  duration: number; // minutes
  distance?: number; // km
  elevation?: number; // m
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
}

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

  // Progression linéaire simple : +10%/sem sauf semaine de décharge (toutes les 4 sem)
  // Puis taper sur les 2-3 dernières semaines
  for (let w = 1; w <= totalWeeks; w++) {
    const phase = phaseForWeek(w, totalWeeks);
    const isDeload = w % 4 === 0 && phase !== "taper" && phase !== "race";
    const progressFactor = isDeload ? 0.7 : 1 + (w - 1) * 0.08;
    const cappedFactor = phase === "taper" ? 0.6 - (w - totalWeeks + 2) * 0.2 : progressFactor;

    const targetKm = Math.round(weeklyKm * Math.max(0.5, cappedFactor));
    const targetD = Math.round(targetKm * (goal === "first-ultra" ? 35 : 25));

    const sessions: PlanSession[] = [];
    const avail = Math.min(5, Math.max(2, weeklyAvailability));

    // Easy run
    sessions.push({
      type: "easy",
      title: "Footing souple Z2",
      duration: 45,
      distance: Math.round(targetKm * 0.25),
      intensity: "low",
      notes: "Zone 2 — tu peux parler sans forcer",
    });

    // Interval / quality session (phase build/peak)
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

    // Hill repeats (trail goals)
    if (
      (goal === "first-trail" || goal === "first-ultra" || goal === "utmb-qualif") &&
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

    // Long run
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

    // Race week
    if (phase === "race") {
      sessions.push({
        type: "race",
        title: "🏁 COURSE OBJECTIF",
        duration: 0,
        intensity: "high",
        notes: "Tu y es. Kiffe.",
      });
    }

    // Rest
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
    });
  }

  return weeks;
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const goal = (body.goal as Goal) || "first-ultra";
    const weeklyKm = body.currentLevel?.weeklyKm ?? 30;
    const weeklyAvailability = body.constraints?.weeklyAvailability ?? 4;

    const plan = generatePlan({ goal, weeklyKm, weeklyAvailability });

    return NextResponse.json({
      ok: true,
      goal,
      totalWeeks: plan.length,
      generatedAt: new Date().toISOString(),
      source: "mock-mvp",
      plan,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

// GET = endpoint de démo — renvoie un plan "first-ultra" par défaut
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
    source: "mock-mvp-demo",
    plan,
  });
}
