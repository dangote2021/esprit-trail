export default function StatTile({
  label,
  value,
  unit,
  accent = "lime",
  sub,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: "lime" | "peach" | "cyan" | "violet" | "gold";
  sub?: string;
}) {
  const accents = {
    lime: "text-lime",
    peach: "text-peach",
    cyan: "text-cyan",
    violet: "text-violet",
    gold: "text-gold",
  };

  return (
    <div className="rounded-2xl bg-bg-card p-3 card-chunky">
      <div className="text-[10px] font-black uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-display text-2xl font-black leading-none ${accents[accent]}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-bold text-ink-muted">{unit}</span>
        )}
      </div>
      {sub && <div className="mt-1 text-[11px] text-ink-dim">{sub}</div>}
    </div>
  );
}
