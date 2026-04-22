export default function TQLogo({
  size = 32,
  showBaseline = false,
}: {
  size?: number;
  showBaseline?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-lg bg-lime"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          style={{ width: size * 0.7, height: size * 0.7 }}
          className="text-bg"
        >
          {/* Mountain range stylisée */}
          <path
            d="M4 24L10 14L14 20L20 10L28 24H4Z"
            fill="currentColor"
          />
          <circle cx="24" cy="8" r="2" fill="currentColor" />
        </svg>
      </div>
      <div className="leading-none">
        <span className="block font-display text-lg font-black tracking-tight">
          Esprit trail
        </span>
        {showBaseline && (
          <span className="mt-0.5 block text-[9px] font-mono font-bold uppercase tracking-widest text-lime">
            Le trail, il a changé
          </span>
        )}
      </div>
    </div>
  );
}
