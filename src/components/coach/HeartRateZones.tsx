"use client";

// ====== HeartRateZones ======
// Saisie FC max + FC repos → calcul des 5 zones FC personnalisées (Karvonen).
// Panel test Karim : "Z3 c'est bien, mais Z3 = quelle FC pour MOI ?".
// Affiché dans /coach/plan ; les plages BPM s'affichent aussi sur chaque
// séance du plan une fois la FC renseignée.

import { useEffect, useState } from "react";
import {
  loadHr,
  saveHr,
  clearHr,
  computeZones,
  type HrData,
} from "@/lib/hr-zones";

const ZONE_COLOR: Record<number, string> = {
  1: "#8cc8eb",
  2: "#2d6a4f",
  3: "#d4a017",
  4: "#d85a30",
  5: "#c1654a",
};

export default function HeartRateZones() {
  const [hr, setHr] = useState<HrData | null>(null);
  const [maxInput, setMaxInput] = useState("");
  const [restInput, setRestInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = loadHr();
    setHr(stored);
    if (stored) {
      setMaxInput(String(stored.max));
      setRestInput(String(stored.rest));
    } else {
      setEditing(true);
    }
  }, []);

  function handleSave() {
    const max = parseInt(maxInput, 10);
    const rest = parseInt(restInput, 10);
    if (!max || !rest) {
      setError("Renseigne les deux valeurs.");
      return;
    }
    if (max <= rest) {
      setError("La FC max doit être supérieure à la FC de repos.");
      return;
    }
    if (max > 230 || max < 140) {
      setError("FC max plausible : entre 140 et 230 bpm.");
      return;
    }
    if (rest < 25 || rest > 100) {
      setError("FC repos plausible : entre 25 et 100 bpm.");
      return;
    }
    const data = { max, rest };
    saveHr(data);
    setHr(data);
    setEditing(false);
    setError("");
  }

  const zones = hr ? computeZones(hr) : null;

  return (
    <section className="space-y-2">
      <div className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan">
        Tes zones de fréquence cardiaque
      </div>
      <div className="rounded-2xl border border-cyan/25 bg-bg-card/60 p-4 space-y-3">
        {editing ? (
          <>
            <p className="text-[11px] text-ink-muted leading-snug">
              Renseigne ta FC pour que le plan affiche les vraies plages BPM
              à côté de chaque zone. Calcul par la méthode Karvonen (FC de
              réserve).
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                  FC max (bpm)
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={maxInput}
                  onChange={(e) => setMaxInput(e.target.value)}
                  placeholder="ex : 188"
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card px-3 py-2 text-base font-display font-black text-ink placeholder:text-ink-dim focus:border-cyan focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                  FC repos (bpm)
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={restInput}
                  onChange={(e) => setRestInput(e.target.value)}
                  placeholder="ex : 48"
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-bg-card px-3 py-2 text-base font-display font-black text-ink placeholder:text-ink-dim focus:border-cyan focus:outline-none"
                />
              </label>
            </div>
            <p className="text-[10px] font-mono text-ink-dim leading-snug">
              FC max : ta valeur réelle si tu la connais (test, course max),
              sinon estime à 220 − ton âge. FC repos : prends-la au réveil,
              allongé, avant de te lever.
            </p>
            {error && (
              <div className="rounded-lg bg-mythic/10 px-3 py-2 text-[11px] text-mythic">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-cyan py-2.5 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-cyan hover:scale-[1.01] transition"
            >
              Calculer mes zones
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono text-ink-muted">
                FC max <strong className="text-ink">{hr?.max}</strong> · FC repos{" "}
                <strong className="text-ink">{hr?.rest}</strong> bpm
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-[11px] font-mono font-bold text-cyan hover:underline"
              >
                Modifier
              </button>
            </div>
            <div className="space-y-1">
              {zones?.map((z) => (
                <div
                  key={z.zone}
                  className="flex items-center gap-2.5 rounded-lg bg-white/60 border border-ink/8 px-2.5 py-1.5"
                >
                  <span
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md font-display text-xs font-black text-white"
                    style={{ background: ZONE_COLOR[z.zone] }}
                  >
                    Z{z.zone}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-ink leading-tight">
                      {z.label.split(" · ")[1]}
                    </div>
                    <div className="text-[10px] text-ink-muted leading-tight truncate">
                      {z.usage}
                    </div>
                  </div>
                  <div
                    className="shrink-0 font-mono text-[12px] font-black"
                    style={{ color: ZONE_COLOR[z.zone] }}
                  >
                    {z.minBpm}–{z.maxBpm}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                clearHr();
                setHr(null);
                setMaxInput("");
                setRestInput("");
                setEditing(true);
              }}
              className="text-[10px] font-mono text-ink-dim hover:text-mythic"
            >
              Effacer
            </button>
          </>
        )}
      </div>
    </section>
  );
}
