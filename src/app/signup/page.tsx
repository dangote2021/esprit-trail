// ====== SIGNUP — magic link email + OAuth Google ======

import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "../login/LoginForm";
import { BrandLogoFull } from "@/components/ui/TQLogo";

export const metadata = {
  title: "Créer un compte",
};

export default function SignupPage() {
  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 pb-24">
      <div className="w-full rounded-3xl border-2 border-ink/15 bg-bg-card/90 p-6 shadow-[0_6px_0_rgba(27,67,50,0.10)] backdrop-blur-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex flex-col items-center">
            <BrandLogoFull width={180} className="mb-2" />
          </Link>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
            Esprit Trail
          </p>
        </div>

        <h1 className="mb-1 font-display text-2xl font-black text-ink">
          Bienvenue sur Esprit Trail.
        </h1>
        <p className="mb-6 text-sm text-ink-muted leading-relaxed">
          Que ton premier trail soit un 5km de découverte ou un ultra de 150km,
          Esprit Trail te file le plan, la team, et le ton qui va bien. 30 secondes chrono :
          email, lien magique, et c&apos;est parti.
        </p>

        <Suspense>
          <LoginForm mode="signup" />
        </Suspense>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-lime underline-offset-2 hover:underline">
            Se connecter
          </Link>
        </p>

        <p className="mt-4 text-center text-[10px] text-ink-dim leading-relaxed">
          En créant un compte, tu acceptes nos{" "}
          <Link href="/legal/cgu" className="underline hover:text-ink">CGU</Link>
          {" "}et notre{" "}
          <Link href="/legal/privacy" className="underline hover:text-ink">
            politique de confidentialité
          </Link>.
        </p>
      </div>
    </main>
  );
}
