"use client";

// ====== trail-indices ======
// Index UTMB & ITRA saisis manuellement par l'utilisateur. Pas de mock :
// un profil neuf n'a rien, et chacun renseigne ses vrais index (depuis
// son compte UTMB / ITRA officiel). Stockage localStorage.

export type UtmbCategory = "XS" | "S" | "M" | "L" | "XL";

export type TrailIndices = {
  /** UTMB Runner Index global (0-1000) */
  utmb: number | null;
  /** ITRA Performance Index (0-1000) */
  itra: number | null;
  /** Détail UTMB par catégorie de distance */
  cat: Record<UtmbCategory, number | null>;
};

const KEY = "esprit_trail_indices";
export const INDICES_EVENT = "esprit:indices";

export const EMPTY_INDICES: TrailIndices = {
  utmb: null,
  itra: null,
  cat: { XS: null, S: null, M: null, L: null, XL: null },
};

export function loadIndices(): TrailIndices {
  if (typeof window === "undefined") return { ...EMPTY_INDICES, cat: { ...EMPTY_INDICES.cat } };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY_INDICES, cat: { ...EMPTY_INDICES.cat } };
    const parsed = JSON.parse(raw);
    return {
      utmb: typeof parsed.utmb === "number" ? parsed.utmb : null,
      itra: typeof parsed.itra === "number" ? parsed.itra : null,
      cat: {
        XS: numOrNull(parsed.cat?.XS),
        S: numOrNull(parsed.cat?.S),
        M: numOrNull(parsed.cat?.M),
        L: numOrNull(parsed.cat?.L),
        XL: numOrNull(parsed.cat?.XL),
      },
    };
  } catch {
    return { ...EMPTY_INDICES, cat: { ...EMPTY_INDICES.cat } };
  }
}

export function saveIndices(indices: TrailIndices) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(indices));
    window.dispatchEvent(new Event(INDICES_EVENT));
  } catch {
    /* ignore */
  }
}

/** true si l'utilisateur a renseigné au moins un index */
export function hasAnyIndex(i: TrailIndices): boolean {
  return (
    i.utmb != null ||
    i.itra != null ||
    Object.values(i.cat).some((v) => v != null)
  );
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && !Number.isNaN(v) ? v : null;
}
