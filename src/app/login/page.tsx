// ====== LOGIN — magic link email + OAuth Google ======
// Page server component qui mount un petit client form.

import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { BrandLogoFull } from "@/components/ui/TQLogo";

export const metadata = {
  title: "Connexion",
};

export default function LoginPage() {
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
          On se retrouve au prochain refuge
        </h1>
        <p className="mb-6 text-sm text-ink-muted leading-relaxed">
          Entre ton email, on t&apos;envoie un lien sécurisé. Tu cliques,
          tu es connecté — sans mot de passe à retenir.
        </p>

        <Suspense>
          <LoginForm mode="login" />
        </Suspense>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Première fois par ici ?{" "}
          <Link href="/signup" className="font-semibold text-lime underline-offset-2 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
