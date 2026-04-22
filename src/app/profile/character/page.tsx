"use client";

import Link from "next/link";
import { useState } from "react";
import { CharacterAvatar } from "@/components/ui/CharacterAvatar";
import { ME } from "@/lib/data/me";
import {
  Character,
  DEFAULT_CHARACTER,
  SKIN_TONES,
  HAIR_COLORS,
  SHIRT_COLORS,
  SHORTS_COLORS,
  HAT_COLORS,
  SHOE_COLORS,
  SHOE_BRANDS,
  HAT_BRANDS,
  ShoeBrand,
  HatBrand,
  SkinTone,
} from "@/lib/character";

type Tab = "tete" | "corps" | "jambes" | "pieds";

export default function CharacterPage() {
  const [c, setC] = useState<Character>(ME.character ?? DEFAULT_CHARACTER);
  const [tab, setTab] = useState<Tab>("tete");

  function update(patch: Partial<Character>) {
    setC((prev) => ({ ...prev, ...patch }));
  }

  return (
    <main className="mx-auto max-w-lg pb-40">
      {/* Header */}
      <div className="safe-top sticky top-0 z-20 border-b border-ink/10 bg-bg/80 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted hover:text-lime transition"
          >
            ← Profil
          </Link>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Character
          </div>
          <button
            onClick={() => setC(DEFAULT_CHARACTER)}
            className="text-xs font-mono font-bold uppercase tracking-wider text-ink-dim hover:text-peach transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative mt-3 mx-4 overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-b from-bg-card via-bg-raised to-bg-card p-5">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: c.shirtColor, opacity: 0.25 }}
        />
        {/* Character */}
        <div className="relative flex items-center justify-center">
          <CharacterAvatar character={c} size={220} />
        </div>
        {/* Scanline vibe */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Tabs */}
      <div className="mt-4 grid grid-cols-4 gap-1 px-4">
        {(
          [
            { id: "tete", label: "Tête", emoji: "🧢" },
            { id: "corps", label: "Corps", emoji: "👕" },
            { id: "jambes", label: "Jambes", emoji: "🩳" },
            { id: "pieds", label: "Pieds", emoji: "👟" },
          ] as { id: Tab; label: string; emoji: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl border py-2 text-xs font-display font-black uppercase tracking-wider transition ${
              tab === t.id
                ? "border-lime bg-lime/10 text-lime"
                : "border-ink/15 bg-bg-card/60 text-ink-muted hover:border-lime/40"
            }`}
          >
            <div>{t.emoji}</div>
            <div className="mt-0.5 text-[10px]">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="mt-4 px-4 space-y-5">
        {tab === "tete" && (
          <>
            <Section title="Casquette — marque">
              <BrandGrid>
                {(Object.keys(HAT_BRANDS) as HatBrand[]).map((b) => (
                  <BrandChip
                    key={b}
                    active={c.hatBrand === b}
                    label={HAT_BRANDS[b].label}
                    easterEgg={HAT_BRANDS[b].easterEgg}
                    onClick={() => update({ hatBrand: b })}
                  />
                ))}
              </BrandGrid>
            </Section>

            {c.hatBrand !== "none" && (
              <Section title="Casquette — couleur">
                <ColorRow
                  colors={HAT_COLORS}
                  value={c.hatColor}
                  onChange={(color) => update({ hatColor: color })}
                />
              </Section>
            )}

            <Section title="Teint">
              <div className="grid grid-cols-5 gap-2">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ skinTone: s.id as SkinTone })}
                    className={`rounded-xl border p-2 transition ${
                      c.skinTone === s.id
                        ? "border-lime bg-lime/5"
                        : "border-ink/15 hover:border-lime/40"
                    }`}
                  >
                    <div
                      className="mx-auto h-10 w-10 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="mt-1 text-[9px] font-mono text-ink-muted">
                      {s.label}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Cheveux">
              <div className="grid grid-cols-7 gap-2">
                {HAIR_COLORS.map((h) => (
                  <button
                    key={h.color}
                    onClick={() => update({ hairColor: h.color })}
                    aria-label={h.label}
                    className={`h-10 w-10 rounded-full border-2 transition ${
                      c.hairColor === h.color
                        ? "border-lime scale-110"
                        : "border-ink/15 hover:border-lime/40"
                    }`}
                    style={{ backgroundColor: h.color }}
                  />
                ))}
              </div>
            </Section>

            <Section title="Accessoire">
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: "none", label: "Aucun", emoji: "—" },
                    { id: "sunglasses", label: "Lunettes", emoji: "🕶️" },
                    { id: "headband", label: "Bandeau", emoji: "🎽" },
                    { id: "watch", label: "Montre GPS", emoji: "⌚" },
                  ] as const
                ).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => update({ accessory: a.id })}
                    className={`rounded-xl border px-2 py-3 text-center transition ${
                      c.accessory === a.id
                        ? "border-lime bg-lime/10"
                        : "border-ink/15 bg-bg-card/60 hover:border-lime/40"
                    }`}
                  >
                    <div className="text-2xl">{a.emoji}</div>
                    <div className="mt-1 text-[10px] font-mono uppercase text-ink-muted">
                      {a.label}
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === "corps" && (
          <>
            <Section title="T-shirt — couleur">
              <ColorRow
                colors={SHIRT_COLORS}
                value={c.shirtColor}
                onChange={(color) => update({ shirtColor: color })}
              />
            </Section>
            <Section title="T-shirt — marque (optionnel)">
              <BrandGrid>
                {(["none", "hoka", "salomon", "on", "ciele"] as const).map(
                  (b) => (
                    <BrandChip
                      key={b}
                      active={(c.shirtBrand ?? "none") === b}
                      label={
                        b === "none"
                          ? "Sans logo"
                          : b.charAt(0).toUpperCase() + b.slice(1)
                      }
                      onClick={() => update({ shirtBrand: b })}
                    />
                  ),
                )}
              </BrandGrid>
            </Section>
          </>
        )}

        {tab === "jambes" && (
          <Section title="Short — couleur">
            <ColorRow
              colors={SHORTS_COLORS}
              value={c.shortsColor}
              onChange={(color) => update({ shortsColor: color })}
            />
          </Section>
        )}

        {tab === "pieds" && (
          <>
            <Section title="Chaussures — marque">
              <BrandGrid>
                {(Object.keys(SHOE_BRANDS) as ShoeBrand[]).map((b) => (
                  <BrandChip
                    key={b}
                    active={c.shoeBrand === b}
                    label={SHOE_BRANDS[b].label}
                    onClick={() => update({ shoeBrand: b })}
                  />
                ))}
              </BrandGrid>
            </Section>
            <Section title="Chaussures — couleur">
              <ColorRow
                colors={SHOE_COLORS}
                value={c.shoeColor}
                onChange={(color) => update({ shoeColor: color })}
              />
            </Section>
          </>
        )}
      </div>

      {/* Bottom save */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-lg px-4 py-3">
          <button
            onClick={() => {
              // Mock save — stocké en local state pour le MVP
              if (typeof window !== "undefined") {
                // pas de localStorage en env preview, on laisse juste l'état
                alert(
                  "Ton personnage est sauvegardé (local). On câble Supabase bientôt.",
                );
              }
            }}
            className="w-full rounded-xl bg-lime py-3 text-sm font-display font-black uppercase tracking-wider text-bg shadow-glow-lime transition hover:scale-[1.01]"
          >
            ✓ Valider le personnage
          </button>
        </div>
      </div>
    </main>
  );
}

// ====== Sub-components ======

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
        {title}
      </div>
      {children}
    </div>
  );
}

function ColorRow({
  colors,
  value,
  onChange,
}: {
  colors: { color: string; label: string; easterEgg?: boolean }[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <div key={c.color} className="flex flex-col items-center gap-1">
          <button
            onClick={() => onChange(c.color)}
            aria-label={c.label}
            title={c.label}
            className={`relative h-10 w-10 rounded-xl border-2 transition ${
              value === c.color
                ? "border-lime scale-110 shadow-glow-lime"
                : "border-ink/15 hover:border-lime/40"
            }`}
            style={{ backgroundColor: c.color }}
          >
            {c.easterEgg && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-peach text-[8px] font-mono font-black text-bg">
                ★
              </span>
            )}
          </button>
          {c.easterEgg && (
            <span className="text-[8px] font-mono font-bold uppercase text-peach leading-tight text-center max-w-[48px]">
              {c.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function BrandGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

function BrandChip({
  active,
  label,
  onClick,
  easterEgg,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  easterEgg?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${
        active
          ? "border-lime bg-lime/10 text-lime"
          : easterEgg
          ? "border-peach/40 bg-peach/5 text-peach hover:border-peach"
          : "border-ink/15 bg-bg-card/60 text-ink hover:border-lime/40"
      }`}
    >
      {easterEgg && (
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-peach px-1.5 py-0.5 text-[8px] font-mono font-black uppercase text-bg">
          ★ easter
        </span>
      )}
      {label}
    </button>
  );
}
