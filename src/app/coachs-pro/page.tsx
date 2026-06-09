// Désactivé — V2 post-launch. Voir /src/app/coachs/page.tsx pour le contexte.
import { redirect } from "next/navigation";

export default function CoachsProDisabled() {
  redirect("/");
}
