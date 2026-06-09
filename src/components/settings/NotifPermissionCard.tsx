"use client";

// ====== NotifPermissionCard ======
// Active les rappels quotidiens via Notification API + Service Worker.
// V1 : on enregistre le SW + on demande la permission. Au prochain
// déploiement on branche le push backend (Vercel Cron + VAPID) pour
// envoyer un rappel à 18h chaque jour ("Ta séance du jour t'attend").
//
// En attendant le backend, l'opt-in se fait quand même : on stocke
// l'intention de l'user (esprit_push_enabled) — le moment où on
// branchera l'envoi, ses notifs marcheront direct.

import { useEffect, useState } from "react";

type PermState = "default" | "granted" | "denied" | "unsupported" | "loading";

export default function NotifPermissionCard() {
  const [perm, setPerm] = useState<PermState>("loading");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission as PermState);
    // Enregistre le service worker au passage (idempotent)
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ignore — on ne casse pas l'app si le SW echoue */
    });
  }, []);

  async function handleEnable() {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPerm(result as PermState);
    if (result === "granted") {
      try {
        window.localStorage.setItem("esprit_push_enabled", "1");
      } catch {
        /* ignore */
      }
      // Notif de confirmation immédiate
      try {
        new Notification("🔥 Rappels activés", {
          body: "Tu recevras un rappel quotidien pour ta séance.",
          icon: "/icon-192.png",
        });
      } catch {
        /* ignore */
      }
    }
  }

  function handleTest() {
    try {
      new Notification("🏃 Test Esprit Trail", {
        body: "Ta séance du jour : 8 km Z2 endurance. C'est l'heure des pieds boueux.",
        icon: "/icon-192.png",
      });
    } catch {
      /* ignore */
    }
  }

  if (perm === "loading") {
    return (
      <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4 animate-pulse min-h-[120px]" />
    );
  }

  if (perm === "unsupported") {
    return (
      <section className="rounded-2xl border border-ink/10 bg-bg-card/40 p-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
          Rappels
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          Ton navigateur ne supporte pas les notifications. Sur iOS, installe
          d&apos;abord Esprit Trail comme app (Partager → Sur l&apos;écran d&apos;accueil)
          puis reviens ici.
        </p>
      </section>
    );
  }

  if (perm === "denied") {
    return (
      <section className="rounded-2xl border border-mythic/30 bg-mythic/5 p-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-mythic">
          Rappels bloqués
        </div>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Tu as refusé les notifications. Pour les réactiver : icône cadenas
          dans la barre d&apos;adresse → Notifications → Autoriser.
        </p>
      </section>
    );
  }

  if (perm === "granted") {
    return (
      <section className="rounded-2xl border-2 border-lime/40 bg-lime/5 p-4 space-y-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Rappels actifs 🔥
          </div>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Tu recevras un rappel quotidien pour ta séance ou ta quête du
            jour. Tu peux désactiver depuis les paramètres de ton navigateur.
          </p>
        </div>
        <button
          onClick={handleTest}
          className="w-full rounded-lg border border-lime/40 bg-lime/10 py-2 font-mono text-xs font-bold uppercase tracking-wider text-lime hover:bg-lime/20"
        >
          🏃 Tester une notif
        </button>
      </section>
    );
  }

  // default
  return (
    <section className="rounded-2xl border-2 border-cyan/40 bg-cyan/5 p-4 space-y-3">
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan">
          Active les rappels
        </div>
        <h3 className="mt-1 font-display text-base font-black text-ink leading-tight">
          Un coup de coude quotidien
        </h3>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          On te ping une fois par jour pour ta séance ou ta quête. Pas de
          spam, pas de pub. Tu désactives en 2 clics.
        </p>
      </div>
      <button
        onClick={handleEnable}
        className="w-full rounded-xl bg-cyan py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-md"
      >
        🔔 Activer les rappels
      </button>
    </section>
  );
}
