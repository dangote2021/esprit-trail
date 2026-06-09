"use client";

// ====== COOKIE BANNER RGPD ======
// Esprit Trail n'utilise que des cookies techniques essentiels (session, auth) — pas
// de tracking publicitaire. On affiche quand même une notice discrète pour la
// transparence RGPD, avec bouton "ok" qui stocke le choix dans un cookie
// first-party (pas de localStorage — éviter les blocages en privacy mode).

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_NAME = "esprit_cookie_notice_ok";

function hasAck(): boolean {
  if (typeof document === "undefined") return true;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=1`));
}

function setAck() {
  if (typeof document === "undefined") return;
  // 365 jours
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!hasAck());
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Notice cookies"
      className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-md rounded-2xl border-2 border-ink/20 bg-bg-card/98 p-4 shadow-[0_8px_0_rgba(27,67,50,0.12)] backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">🍪</div>
        <div className="flex-1">
          <p className="text-sm font-bold leading-snug text-ink">
            On utilise juste les cookies qu'il faut.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Session, auth, préférences. Pas de tracking pub, pas de revente.{" "}
            <Link
              href="/legal/privacy"
              className="underline decoration-ink/30 underline-offset-2 hover:text-ink"
            >
              En savoir plus
            </Link>
            .
          </p>
          <button
            onClick={() => {
              setAck();
              setShow(false);
            }}
            className="mt-3 inline-flex items-center gap-1 rounded-lg border-2 border-ink bg-lime px-3 py-1.5 text-xs font-black uppercase tracking-wider text-bg-card shadow-[0_3px_0_#1b4332] transition active:translate-y-[2px] active:shadow-[0_1px_0_#1b4332]"
          >
            Ok, compris
          </button>
        </div>
      </div>
    </div>
  );
}
