// ====== i18n server helpers ======
// Lecture de la langue depuis le cookie côté server components.

import { cookies, headers } from "next/headers";
import { translate, type Lang, DEFAULT_LANG, LANGS } from "./dict";

const COOKIE_NAME = "esprit_lang";

export function getServerLang(): Lang {
  // 1. Cookie explicite
  try {
    const cookieStore = cookies();
    const c = cookieStore.get(COOKIE_NAME)?.value;
    if (c === "fr" || c === "en") return c;
  } catch {
    // headers/cookies pas dispos dans le contexte → fallback
  }

  // 2. Accept-Language navigateur
  try {
    const h = headers();
    const al = h.get("accept-language") ?? "";
    // Prend la première langue préférée
    const first = al.split(",")[0]?.split("-")[0]?.toLowerCase();
    const found = LANGS.find((l) => l.code === first);
    if (found) return found.code;
  } catch {
    // ignore
  }

  return DEFAULT_LANG;
}

export function t(key: string, lang?: Lang): string {
  return translate(key, lang ?? getServerLang());
}

export { COOKIE_NAME as LANG_COOKIE_NAME };
