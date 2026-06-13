// ====== LangToggle (masqué) ======
// La traduction EN n'est pas encore câblée sur l'ensemble de l'app : seuls
// quelques composants consomment le dictionnaire i18n. Exposer un toggle FR/EN
// donnerait un mode "EN" qui laisse tout le contenu en français → impression
// d'app cassée. On masque donc le bouton tant que les traductions EN ne sont
// pas complètes. L'infra i18n (dict.ts, LangProvider, useT) reste en place.
//
// Pour réactiver : restaurer l'implémentation depuis l'historique git
// (commit précédent) une fois le dictionnaire EN rempli.

export default function LangToggle(_props: {
  className?: string;
  size?: "sm" | "md";
}) {
  return null;
}
