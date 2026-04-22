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
          {/* Gobelet ravito + goutte — l'arrêt au ravitaillement */}
          <path
            d="M8 10 L24 10 L22 26 Q22 28 20 28 L12 28 Q10 28 10 26 Z"
            fill="currentColor"
          />
          <path
            d="M10 10 L22 10 L22 13 L10 13 Z"
            fill="currentColor"
            opacity="0.55"
          />
          {/* Goutte d'eau au-dessus */}
          <path
            d="M16 2 Q12 7 12 9 Q12 11 16 11 Q20 11 20 9 Q20 7 16 2 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="leading-none">
        <span className="block font-display text-lg font-black tracking-tight">
          Ravito
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
