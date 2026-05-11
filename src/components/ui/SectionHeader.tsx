import Link from "next/link";

export default function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "Voir tout",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-1">
      <div>
        {eyebrow && (
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-lime">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-xl font-black leading-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-lime transition"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
