// ====== /notifications — centre de notifs ======
// Hardening 05/09/26 : rapport de test panel — la page n'affichait qu'un
// message de bienvenue figé (`SAMPLES`), jamais mis à jour, quel que soit
// le compte. Le rendu réel (messages non lus, badges débloqués) vit
// maintenant dans <NotificationsFeed />, un composant client — ce fichier
// reste un Server Component pour garder les metadata statiques.

import Link from "next/link";
import NotificationsFeed from "@/components/notifications/NotificationsFeed";

export const metadata = {
  title: "Notifications",
  description: "Tout ce qui se passe sur ton Esprit Trail.",
};

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-bg px-4 pb-24 pt-6">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Ton centre
            </p>
            <h1 className="mt-0.5 font-display text-2xl font-black text-ink">
              Notifications
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-ink/15 bg-bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:bg-bg-raised"
          >
            ← Retour
          </Link>
        </div>

        {/* List */}
        <NotificationsFeed />

        {/* Settings */}
        <div className="mt-6 rounded-2xl border border-ink/10 bg-bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            Tu veux régler le volume ?
          </p>
          <p className="mt-1 text-[13px] text-ink-muted">
            Active ou coupe tes notifs depuis les{" "}
            <Link
              href="/profile/settings"
              className="font-semibold text-lime underline-offset-2 hover:underline"
            >
              paramètres
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
