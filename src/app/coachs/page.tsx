// Cette page est mise en pause — feature "Marketplace Coachs Pro" reportée
// au post-launch (V2, après les 100 premiers téléchargements Play Store).
// On garde le code dans l'historique git, on désactive juste la route.

import { redirect } from "next/navigation";

export default function CoachsListPage() {
  redirect("/");
}
