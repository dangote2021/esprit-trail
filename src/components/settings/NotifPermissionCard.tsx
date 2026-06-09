"use client";

// ====== NotifPermissionCard ======
// Active les rappels quotidiens : demande la permission, enregistre le
// service worker, s'abonne au push avec la cle VAPID, et envoie la
// subscription au backend (/api/push/subscribe) pour persistance
// Supabase. Le Vercel Cron envoie ensuite un rappel quotidien a 17h UTC
// (~18-19h Paris) via web-push.

import { useEffect, useState } from "react";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/vapid";

type PermState = "default" | "granted" | "denied" | "unsupported" | "loading";

export default function NotifPermissionCard() {
  const [perm, setPerm] = useState<PermState>("loading");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission as PermState);
    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(!!sub);
      } catch {
        /* SW indispo, on s'en sort */
      }
    })();
  }, []);

  async function handleEnable() {
    setBusy(true);
    setFeedback(null);
    try {
      const result = await Notification.requestPermission();
      setPerm(result as PermState);
      if (result !== "granted") {
        setBusy(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;

      // Tente la subscription Push (PWA installee + navigateur compatible)
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource,
        });
      }

      // Sauve la subscription cote backend (lie a l'user auth Supabase)
      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
          userAgent: navigator.userAgent,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`save failed (${res.status}) ${txt.slice(0, 80)}`);
      }

      setSubscribed(true);
      try {
        window.localStorage.setItem("esprit_push_enabled", "1");
      } catch {
        /* ignore */
      }
      // Notif de confirmation locale
      try {
        new Notification("🔥 Rappels actives", {
          body: "Tu recevras un rappel quotidien.",
          icon: "/icon-192.png",
        });
      } catch {
        /* ignore */
      }
      setFeedback("Rappels prets — un test arrive chaque jour vers 18h.");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Activation echouee");
    } finally {
      setBusy(false);
    }
  }

  function handleTest() {
    try {
      new Notification("🏃 Test Esprit Trail", {
        body: "Ta seance du jour : 8 km Z2 endurance. C'est l'heure des pieds boueux.",
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
          Ton navigateur ne supporte pas les push notifs. Sur iOS, installe
          d&apos;abord Esprit Trail comme app (Partager → Sur l&apos;ecran d&apos;accueil)
          puis reviens ici.
        </p>
      </section>
    );
  }

  if (perm === "denied") {
    return (
      <section className="rounded-2xl border border-mythic/30 bg-mythic/5 p-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-mythic">
          Rappels bloques
        </div>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Tu as refuse les notifications. Pour les reactiver : icone cadenas
          dans la barre d&apos;adresse → Notifications → Autoriser.
        </p>
      </section>
    );
  }

  if (perm === "granted" && subscribed) {
    return (
      <section className="rounded-2xl border-2 border-lime/40 bg-lime/5 p-4 space-y-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Rappels actifs 🔥
          </div>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            Tu recevras un rappel quotidien (~18h) avec ta seance du jour.
            Desactivable depuis les parametres de ton navigateur.
          </p>
        </div>
        {feedback && (
          <div className="rounded-md bg-lime/10 px-3 py-2 text-[11px] font-mono text-lime">
            {feedback}
          </div>
        )}
        <button
          onClick={handleTest}
          className="w-full rounded-lg border border-lime/40 bg-lime/10 py-2 font-mono text-xs font-bold uppercase tracking-wider text-lime hover:bg-lime/20"
        >
          🏃 Tester une notif locale
        </button>
      </section>
    );
  }

  // permission granted mais pas encore subscribed (re-trigger), OR default
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
          On te ping une fois par jour pour ta seance ou ta quete. Pas de
          spam, pas de pub. Desactivable en 2 clics.
        </p>
      </div>
      {feedback && (
        <div className="rounded-md bg-mythic/10 px-3 py-2 text-[11px] font-mono text-mythic">
          {feedback}
        </div>
      )}
      <button
        onClick={handleEnable}
        disabled={busy}
        className="w-full rounded-xl bg-cyan py-3 font-display text-sm font-black uppercase tracking-wider text-bg shadow-md disabled:opacity-60"
      >
        {busy ? "Activation…" : "🔔 Activer les rappels"}
      </button>
    </section>
  );
}
