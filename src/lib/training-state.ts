// ====== training-state.ts ======
// État global d'entraînement de l'utilisateur (localStorage).
// "active"  : entraînement normal, on affiche les conseils / alertes Forme & Récup.
// "block"   : utilisateur en bloc d'entraînement (charge volontairement lourde) —
//             on tempère les alertes "fatigue" pour ne pas créer d'anxiété (panel Manon).
// "pause"   : blessure ou pause volontaire — on désactive les CTA prépa,
//             on adoucit le copy, on n'envoie plus de notifs (panel Camille).

export type TrainingState = "active" | "block" | "pause";

export type TrainingStateInfo = {
  state: TrainingState;
  /** ISO date à laquelle cet état a été décrété — utile pour le copy
   *  "tu es en pause depuis X jours". */
  since: string;
  /** Raison optionnelle (saisie libre par l'utilisateur). */
  reason?: string;
};

const KEY = "esprit_training_state";

export function loadTrainingState(): TrainingStateInfo {
  if (typeof window === "undefined") return { state: "active", since: new Date().toISOString() };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { state: "active", since: new Date().toISOString() };
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      (parsed.state === "active" || parsed.state === "block" || parsed.state === "pause")
    ) {
      return parsed as TrainingStateInfo;
    }
  } catch {/* ignore */}
  return { state: "active", since: new Date().toISOString() };
}

export function setTrainingState(state: TrainingState, reason?: string) {
  if (typeof window === "undefined") return;
  const info: TrainingStateInfo = {
    state,
    since: new Date().toISOString(),
    reason: reason?.trim() || undefined,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(info));
    window.dispatchEvent(new CustomEvent("esprit:trainingstate", { detail: info }));
  } catch {/* ignore */}
}

export function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}
