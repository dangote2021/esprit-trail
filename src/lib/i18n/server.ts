// ====== i18n server helpers ======
// Lecture de la langue depuis le cookie côté server components.

import { translate, type Lang, DEFAULT_LANG } from "./dict";

const COOKIE_NAME = "esprit_lang";

export function getServerLang(): Lang {
  // La traduction EN n'est pas encore câblée sur l'ensemble de l'app (seuls
  // quelques composants consomment le dictionnaire). On force donc le français
  // pour éviter d'avoir <html lang="en"> sur un contenu FR (mismatch a11y/SEO)
  // et un mode EN partiel qui paraît cassé. Réactiver la détection
  // cookie + Accept-Language quand le dictionnaire EN sera complet.
  return DEFAULT_LANG;
}

export function t(key: string, lang?: Lang): string {
  return translate(key, lang ?? getServerLang());
}

export { COOKIE_NAME as LANG_COOKIE_NAME };
