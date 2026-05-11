// ====== PAGE INSTALL — Comment installer Esprit Trail ======
// Page publique (pas de login) qui explique :
// - iOS : ajouter à l'écran d'accueil via Safari (PWA)
// - Android : télécharger sur Google Play Store
// Utile pour le marketing, la com des stores, et le partage.

import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogoFull } from "@/components/ui/TQLogo";

export const metadata: Metadata = {
  title: "Installer Esprit Trail",
  description:
    "Installer Esprit Trail sur iPhone (PWA Safari) ou Android (Google Play). Plein écran, comme une vraie app, en 30 secondes.",
};

export default function InstallPage() {
  return (
    <main className="mx-auto max-w-lg px-5 py-8 space-y-8">
      {/* Header */}
      <header className="text-center">
        <Link href="/" className="inline-block">
          <BrandLogoFull width={180} />
        </Link>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          Esprit Trail
        </p>
      </header>

      <section className="text-center space-y-2">
        <h1 className="font-display text-3xl font-black text-ink">
          Installer Esprit Trail
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Plein écran, comme une vraie app, sans la barre Safari.
          30 secondes chrono, sur ton tel ou sur ton ordi.
        </p>
      </section>

      {/* iOS — Safari Add to Home Screen */}
      <section className="rounded-3xl border-2 border-ink/10 bg-bg-card/80 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-bg-card text-lg">

          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              iPhone & iPad
            </div>
            <h2 className="font-display text-xl font-black text-ink">
              Ajouter à l&apos;écran d&apos;accueil
            </h2>
          </div>
        </div>

        <ol className="space-y-3">
          <Step n={1}>
            Ouvre <strong>esprit-trail.vercel.app</strong> dans{" "}
            <strong>Safari</strong> (pas Chrome).
          </Step>
          <Step n={2}>
            Tape sur l&apos;icône <strong>Partager</strong>{" "}
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-ink/10 text-[12px]">
              ⬆
            </span>{" "}
            en bas de l&apos;écran.
          </Step>
          <Step n={3}>
            Fais défiler le menu, choisis{" "}
            <strong>« Sur l&apos;écran d&apos;accueil »</strong>.
          </Step>
          <Step n={4}>
            Tape <strong>Ajouter</strong> en haut à droite. Esprit Trail
            apparaît comme une app.
          </Step>
        </ol>

        <div className="rounded-xl bg-lime/10 p-3 text-xs text-ink-muted leading-relaxed">
          💡 <strong>Astuce :</strong> au prochain lancement depuis l&apos;icône,
          Esprit Trail s&apos;ouvre plein écran, sans la barre du navigateur.
        </div>
      </section>

      {/* Android — Google Play */}
      <section className="rounded-3xl border-2 border-ink/10 bg-bg-card/80 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-bg-card text-lg">
            ▶
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Android
            </div>
            <h2 className="font-display text-xl font-black text-ink">
              Télécharger sur Google Play
            </h2>
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">
          La version Android arrive sur le Play Store. En attendant, tu peux
          déjà utiliser Esprit Trail directement depuis Chrome — c&apos;est aussi
          une PWA installable :
        </p>

        <ol className="space-y-3">
          <Step n={1}>
            Ouvre <strong>esprit-trail.vercel.app</strong> dans <strong>Chrome</strong>.
          </Step>
          <Step n={2}>
            Tape sur le menu <strong>⋮</strong> en haut à droite.
          </Step>
          <Step n={3}>
            Choisis <strong>« Installer l&apos;application »</strong> (ou{" "}
            <em>« Ajouter à l&apos;écran d&apos;accueil »</em>).
          </Step>
          <Step n={4}>
            Confirme. Esprit Trail devient une app comme les autres.
          </Step>
        </ol>

        <div className="rounded-xl bg-amber/10 border border-amber/20 p-3 text-xs text-ink-muted leading-relaxed">
          🚀 <strong>Bientôt :</strong> Esprit Trail sera dispo sur le Google Play
          Store. On t&apos;avertit dès que c&apos;est en ligne.
        </div>
      </section>

      {/* Desktop — Chrome / Edge */}
      <section className="rounded-3xl border-2 border-ink/10 bg-bg-card/80 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/15 text-lg">
            🖥
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Mac & PC
            </div>
            <h2 className="font-display text-xl font-black text-ink">
              Sur ton ordi
            </h2>
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">
          Avec Chrome ou Edge, tu peux installer Esprit Trail comme une app desktop
          (icône dans le dock / barre des tâches). Cherche l&apos;icône{" "}
          <strong>📥 Installer</strong> dans la barre d&apos;adresse, ou via
          le menu ⋮ → <em>Installer Esprit Trail</em>.
        </p>
      </section>

      {/* CTA retour */}
      <Link
        href="/"
        className="block rounded-2xl bg-lime py-4 text-center font-display font-black uppercase tracking-wider text-bg-card shadow-glow-lime"
      >
        ← Retour à Esprit Trail
      </Link>

      <p className="text-center text-[10px] text-ink-dim">
        Une question ?{" "}
        <Link href="/contact" className="underline hover:text-ink">
          Contacte-nous
        </Link>
      </p>
    </main>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime/15 font-display text-sm font-black text-lime">
        {n}
      </div>
      <div className="pt-0.5 text-sm text-ink leading-relaxed">{children}</div>
    </li>
  );
}
