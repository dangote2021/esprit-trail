// ====== /quests — Redirect ======
// L'onglet "Quêtes" a été renommé "Spots" (cf. /src/app/spots/page.tsx).
// Les quêtes périodisées (blocs spécifiques, daily/weekly/seasonal/epic)
// sont désormais gérées par le Coach IA (cf. /src/app/coach/page.tsx).
// Cette route reste pour ne pas casser les liens / bookmarks externes,
// elle redirige vers /coach.

import { redirect } from "next/navigation";

export default function QuestsRedirect() {
  redirect("/coach");
}
