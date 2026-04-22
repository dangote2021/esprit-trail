import Link from "next/link";
import QuestCard from "@/components/ui/QuestCard";
import { QUESTS, questsForPeriod } from "@/lib/data/quests";

export default function QuestsPage() {
  const daily = questsForPeriod("daily");
  const weekly = questsForPeriod("weekly");
  const seasonal = questsForPeriod("seasonal");
  const epic = questsForPeriod("epic");

  const totalXp = QUESTS.reduce((acc, q) => acc + q.xpReward, 0);
  const earnedXp = QUESTS.filter((q) => q.progress >= q.target).reduce(
    (acc, q) => acc + q.xpReward,
    0,
  );

  return (
    <main className="mx-auto max-w-lg px-4 safe-top pb-6 space-y-6">
      <header className="flex items-center justify-between pt-4">
        <Link
          href="/"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted hover:text-lime transition"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Quêtes
          </div>
          <h1 className="font-display text-lg font-black leading-none">Log de quêtes</h1>
        </div>
        <div className="w-9" />
      </header>

      {/* XP Overview */}
      <div className="rounded-2xl border border-lime/20 bg-gradient-to-br from-lime/10 via-bg-card to-bg p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
              XP disponibles cette période
            </div>
            <div className="mt-1 font-display text-3xl font-black">
              {totalXp.toLocaleString("fr")}{" "}
              <span className="text-sm text-ink-muted">XP à gagner</span>
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              Déjà gagnés : {earnedXp.toLocaleString("fr")} XP
            </div>
          </div>
          <div className="text-5xl">📜</div>
        </div>
      </div>

      {/* Daily */}
      <section className="space-y-3">
        <SectionTitle
          icon="⚡"
          period="DAILY"
          title="Aujourd'hui"
          count={daily.length}
          hint="Reset à minuit"
          accent="cyan"
        />
        <div className="grid gap-3">
          {daily.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Weekly */}
      <section className="space-y-3">
        <SectionTitle
          icon="📅"
          period="WEEKLY"
          title="Cette semaine"
          count={weekly.length}
          hint="Reset dimanche 23:59"
          accent="violet"
        />
        <div className="grid gap-3">
          {weekly.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Seasonal */}
      <section className="space-y-3">
        <SectionTitle
          icon="🌱"
          period="SAISON"
          title="Saison de printemps"
          count={seasonal.length}
          hint="Jusqu'au 21 juin"
          accent="peach"
        />
        <div className="grid gap-3">
          {seasonal.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>

      {/* Epic */}
      <section className="space-y-3">
        <SectionTitle
          icon="👑"
          period="ÉPIQUE"
          title="Quêtes légendaires"
          count={epic.length}
          hint="Pas de limite de temps"
          accent="gold"
        />
        <div className="grid gap-3">
          {epic.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionTitle({
  icon,
  period,
  title,
  count,
  hint,
  accent,
}: {
  icon: string;
  period: string;
  title: string;
  count: number;
  hint: string;
  accent: "cyan" | "violet" | "peach" | "gold";
}) {
  const accentMap = {
    cyan: "text-cyan border-cyan/30 bg-cyan/5",
    violet: "text-violet border-violet/30 bg-violet/5",
    peach: "text-peach border-peach/30 bg-peach/5",
    gold: "text-gold border-gold/30 bg-gold/5",
  };
  return (
    <div className={`rounded-lg border p-3 ${accentMap[accent]}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest">
              {period}
            </div>
            <div className="font-display text-base font-black leading-tight text-ink">
              {title}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-mono font-bold">{count} quête{count > 1 ? "s" : ""}</div>
          <div className="text-[10px] font-mono text-ink-dim">{hint}</div>
        </div>
      </div>
    </div>
  );
}
