// ====== /notifications — centre de notifs ======
// Placeholder propre en attendant le backend notifs.

import Link from "next/link";

export const metadata = {
  title: "Notifications",
  description: "Tout ce qui se passe sur ton Esprit Trail.",
};

type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  when: string;
  tone: "lime" | "gold" | "sky" | "mythic";
};

const SAMPLES: Notif[] = [
  {
    id: "welcome",
    icon: "🏁",
    title: "Bienvenue au Esprit Trail",
    body: "Ton compte est prêt. Fais une première sortie pour démarrer la collection de loot.",
    when: "à l'instant",
    tone: "lime",
  },
];

export default function NotificationsPage() {
  const notifs = SAMPLES;

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
        {notifs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-bg-card p-8 text-center">
            <div className="text-4xl">📭</div>
            <p className="mt-2 font-display text-lg font-black text-ink">
              Rien à signaler
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Quand tu auras des nouvelles quêtes, badges débloqués ou messages
              de ta team, ça s'affichera ici.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {notifs.map((n) => (
              <li
                key={n.id}
                className="flex gap-3 rounded-2xl border border-ink/10 bg-bg-card p-4"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${toneBg(n.tone)}`}>
                  {n.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-black text-ink">
                      {n.title}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                      {n.when}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-muted">
                    {n.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

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

function toneBg(tone: Notif["tone"]) {
  switch (tone) {
    case "lime":
      return "bg-lime/15 text-lime";
    case "gold":
      return "bg-gold/15 text-gold";
    case "sky":
      return "bg-sky/15 text-sky";
    case "mythic":
      return "bg-mythic/15 text-mythic";
  }
}
