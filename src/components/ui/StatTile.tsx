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
    lime: "text-lime border-lime/20",
    peach: "text-peach border-peach/20",
    cyan: "text-cyan border-cyan/20",
    violet: "text-violet border-violet/20",
    gold: "text-gold border-gold/20",
  };

  return (
    <div
      className={`rounded-xl border bg-bg-card/60 p-3 ${accents[accent]}`}
    >
      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-display text-2xl font-black leading-none ${accents[accent].split(" ")[0]}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-ink-muted">{unit}</span>
        )}
      </div>
      {sub && <div className="mt-1 text-[11px] text-ink-dim">{sub}</div>}
    </div>
  );
}
