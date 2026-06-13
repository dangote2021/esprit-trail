// ====== /quests — Toutes les quêtes ======
// Page listant l'ensemble des quêtes périodisées (daily / weekly / seasonal /
// epic). Auparavant cette route redirigeait vers /coach, ce qui créait un
// cul-de-sac : la home met en avant "Quête du jour" / "Toutes les quêtes →"
// qui atterrissaient sur le Coach IA (zéro quête visible). On rend désormais
// une vraie page quêtes, alimentée par la même source que la home.

import Link from "next/link";
import QuestCard from "@/components/ui/QuestCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { questsForPeriod } from "@/lib/data/quests";

export const metadata = {
  title: "Quêtes",
  description:
    "Tes quêtes trail : défis quotidiens, hebdo, saisonniers et épiques. Cours, valide, progresse.",
};

const SECTIONS: {
  period: "daily" | "weekly" | "seasonal" | "epic";
  eyebrow: string;
  title: string;
}[] = [
  { period: "daily", eyebrow: "Daily", title: "Tes quêtes du jour" },
  { period: "weekly", eyebrow: "Weekly", title: "Cette semaine" },
  { period: "seasonal", eyebrow: "Saison", title: "Défis de la saison" },
  { period: "epic", eyebrow: "Épique", title: "Quêtes épiques" },
];

export default function QuestsPage() {
  const sections = SECTIONS.map((s) => ({
    ...s,
    quests: questsForPeriod(s.period),
  })).filter((s) => s.quests.length > 0);

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-lime transition"
        >
          ← Accueil
        </Link>
        <div className="text-right">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
            Quêtes
          </div>
          <h1 className="font-display text-2xl font-black leading-tight">
            Tous tes défis
          </h1>
        </div>
      </header>

      <p className="text-sm text-ink-muted px-1">
        Tes quêtes se valident automatiquement à partir de tes sorties
        enregistrées (tracker GPS ou saisie manuelle). Pas de XP fictif : tu
        avances pour de vrai.
      </p>

      {sections.map((s) => (
        <section key={s.period} className="space-y-3">
          <SectionHeader eyebrow={s.eyebrow} title={s.title} />
          <div className="grid gap-3">
            {s.quests.map((q) => (
              <QuestCard key={q.id} quest={q} />
            ))}
          </div>
        </section>
      ))}

      <Link
        href="/coach"
        className="block rounded-2xl border border-lime/30 bg-lime/5 p-4 text-center transition hover:scale-[1.01]"
      >
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
          Coach IA
        </div>
        <div className="font-display text-lg font-black">
          Besoin d'un vrai plan de prépa ? 🧠
        </div>
        <div className="text-xs text-ink-muted mt-1">
          Les blocs spécifiques (charge, affûtage, tapering) sont générés sur
          mesure par le Coach IA selon ton objectif.
        </div>
      </Link>
    </main>
  );
}
