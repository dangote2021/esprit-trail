"use client";

// ====== /run/track — Tracking GPS natif Esprit Trail ======
// Chrono + géolocalisation watchPosition. Quand le user arrête, on sauve
// dans localStorage (esprit_manual_runs) et on redirige vers le détail.
//
// Pas de carte live pour l'instant (Leaflet en mode mobile pose des
// problèmes de perf sur PWA). On affiche le live de distance + dénivelé.
// La trace GPS complète est gardée en mémoire — utilisable plus tard pour
// la carte de récap.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveManualRun, guessTerrain } from "@/lib/manual-runs";

type Point = {
  lat: number;
  lng: number;
  ele: number | null;
  t: number;
};

function haversineKm(a: Point, b: Point): number {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function RunTrackPage() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "active" | "paused" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [error, setError] = useState<string>("");

  const startTime = useRef<number>(0);
  const pauseAt = useRef<number>(0);
  const accumPaused = useRef<number>(0);
  const points = useRef<Point[]>([]);
  const watchId = useRef<number | null>(null);
  const tickInterval = useRef<number | null>(null);
  // Wake lock pour éviter que l'écran s'éteigne pendant la sortie — retour
  // panel Sam : "le chrono se gèle quand l'écran s'éteint sur Pixel 7".
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wakeLockRef = useRef<any>(null);

  // Wake lock : on garde l'écran allumé tant que la sortie est active.
  // Re-acquisition automatique au retour de visibilité (iOS perd le lock
  // quand on switche d'app).
  useEffect(() => {
    let cancelled = false;

    async function acquire() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wl = (navigator as any).wakeLock;
      if (!wl?.request) return; // pas supporté (Safari iOS < 16.4)
      try {
        const lock = await wl.request("screen");
        if (cancelled) {
          lock.release?.();
          return;
        }
        wakeLockRef.current = lock;
      } catch {
        /* ignore, on continue sans wake lock */
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible" && state === "active") {
        acquire();
      }
    }

    if (state === "active") {
      acquire();
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release?.();
        } catch {
          /* ignore */
        }
        wakeLockRef.current = null;
      }
    };
  }, [state]);

  // Chrono tick — utilise Date.now() (pas un compteur incrémenté), donc
  // même si la tab est mise en veille et que l'interval saute, on
  // récupère le temps correct au prochain tick.
  useEffect(() => {
    if (state === "active") {
      tickInterval.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.current - accumPaused.current) / 1000));
      }, 1000);
    }
    return () => {
      if (tickInterval.current) {
        clearInterval(tickInterval.current);
        tickInterval.current = null;
      }
    };
  }, [state]);

  // GPS watch
  useEffect(() => {
    if (state !== "active") return;
    if (!("geolocation" in navigator)) {
      setError("Pas de GPS dispo sur ce device. Bascule en saisie manuelle.");
      return;
    }
    let firstTimeout: number | null = null;
    let hasFirstFix = false;

    // Message pédago si pas de fix au bout de 8s (probablement en intérieur)
    firstTimeout = window.setTimeout(() => {
      if (!hasFirstFix) {
        setError(
          "Pas encore de signal GPS — tu es à l'intérieur ? Sors ou place-toi près d'une fenêtre, ça va venir.",
        );
      }
    }, 8000);

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        hasFirstFix = true;
        if (firstTimeout) {
          window.clearTimeout(firstTimeout);
          firstTimeout = null;
        }
        // Clear l'éventuel message pédago dès qu'on a un fix
        setError("");
        setPermission("granted");
        const pt: Point = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          ele: pos.coords.altitude,
          t: Date.now(),
        };
        if (points.current.length > 0) {
          const prev = points.current[points.current.length - 1];
          const d = haversineKm(prev, pt);
          // Anti-jitter : on ignore les sauts < 5m (bruit GPS) et > 200m/s (téléport)
          const dt = (pt.t - prev.t) / 1000;
          if (d * 1000 > 5 && d * 1000 < 200 * dt) {
            setDistance((cur) => cur + d);
            if (pt.ele != null && prev.ele != null) {
              const dh = pt.ele - prev.ele;
              if (dh > 0 && dh < 50) setElevation((cur) => cur + dh);
            }
          }
        }
        points.current.push(pt);
      },
      (err) => {
        if (firstTimeout) {
          window.clearTimeout(firstTimeout);
          firstTimeout = null;
        }
        setPermission(err.code === err.PERMISSION_DENIED ? "denied" : "unknown");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "T'as bloqué la géoloc — sans GPS on peut pas tracker. Active-la dans les réglages du navigateur."
            : "Le GPS n'arrive pas à se caler. Vérifie que tu es à l'extérieur, puis réessaie.",
        );
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 },
    );
    return () => {
      if (firstTimeout) {
        window.clearTimeout(firstTimeout);
        firstTimeout = null;
      }
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [state]);

  function start() {
    startTime.current = Date.now();
    accumPaused.current = 0;
    points.current = [];
    setElapsed(0);
    setDistance(0);
    setElevation(0);
    setError("");
    setState("active");
  }

  function pause() {
    if (state !== "active") return;
    pauseAt.current = Date.now();
    setState("paused");
  }

  function resume() {
    if (state !== "paused") return;
    accumPaused.current += Date.now() - pauseAt.current;
    setState("active");
  }

  function stop() {
    if (state === "idle") return;
    setState("done");
  }

  function save() {
    const id = `r-${Date.now()}`;
    const km = Math.round(distance * 100) / 100;
    saveManualRun({
      id,
      date: new Date(startTime.current).toISOString(),
      title: titleFromDuration(elapsed),
      distance: km,
      elevation: Math.round(elevation),
      duration: elapsed,
      terrain: guessTerrain(km, elevation),
      source: "tracker",
      notes: `Trace GPS · ${points.current.length} points`,
    });
    router.push(`/profile`);
  }

  function discard() {
    if (!confirm("On jette cette sortie ? Pas de retour arrière.")) return;
    setState("idle");
    setElapsed(0);
    setDistance(0);
    setElevation(0);
    points.current = [];
  }

  const pace =
    distance > 0 ? fmtTime(elapsed / distance) + "/km" : "—";

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 safe-top safe-bottom">
      <header className="flex items-center gap-3 pt-4 pb-3">
        <Link
          href="/run/new"
          className="rounded-lg border border-ink/10 bg-bg-card/60 p-2 text-ink-muted"
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime">
            Tracking · GPS natif
          </div>
          <h1 className="font-display text-xl font-black leading-none">
            {state === "idle" && "Prêt à lâcher les chevaux ?"}
            {state === "active" && "En course"}
            {state === "paused" && "En pause"}
            {state === "done" && "Sortie terminée"}
          </h1>
        </div>
      </header>

      {/* Affichage live */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-8">
        {/* Big timer */}
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
            Temps
          </div>
          <div
            className={`font-display font-black tabular-nums leading-none ${
              state === "active" ? "text-lime" : "text-ink"
            }`}
            style={{ fontSize: "clamp(56px, 18vw, 96px)" }}
          >
            {fmtTime(elapsed)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid w-full grid-cols-3 gap-3">
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="text-[9px] font-mono uppercase text-ink-muted">Distance</div>
            <div className="font-display text-2xl font-black text-peach">
              {distance.toFixed(2)}
            </div>
            <div className="text-[10px] font-mono text-ink-dim">km</div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="text-[9px] font-mono uppercase text-ink-muted">D+</div>
            <div className="font-display text-2xl font-black text-cyan">
              {Math.round(elevation)}
            </div>
            <div className="text-[10px] font-mono text-ink-dim">m</div>
          </div>
          <div className="rounded-xl border border-ink/10 bg-bg-card/60 p-3 text-center">
            <div className="text-[9px] font-mono uppercase text-ink-muted">Allure</div>
            <div className="font-display text-2xl font-black text-violet">
              {pace.split("/")[0]}
            </div>
            <div className="text-[10px] font-mono text-ink-dim">/km</div>
          </div>
        </div>

        {/* GPS status */}
        {state === "active" && (
          <div className="text-[11px] font-mono text-ink-muted text-center">
            {permission === "granted"
              ? `🛰️ GPS bon · ${points.current.length} points capturés`
              : permission === "denied"
              ? "❌ GPS bloqué"
              : "📡 GPS en cours d'accroche…"}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-mythic/10 border border-mythic/30 p-3 text-[12px] text-mythic text-center max-w-sm">
            {error}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="pb-6 space-y-2">
        {state === "idle" && (
          <button
            onClick={start}
            className="w-full rounded-2xl bg-lime py-5 font-display text-lg font-black uppercase tracking-wider text-bg shadow-glow-lime active:scale-[0.98] transition"
          >
            🚀 Lance la sortie
          </button>
        )}
        {state === "active" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={pause}
              className="rounded-2xl border-2 border-peach/40 bg-peach/10 py-4 font-display text-sm font-black uppercase tracking-wider text-peach"
            >
              ⏸ Pause
            </button>
            <button
              onClick={stop}
              className="rounded-2xl bg-mythic py-4 font-display text-sm font-black uppercase tracking-wider text-white"
            >
              ⏹ Stop
            </button>
          </div>
        )}
        {state === "paused" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={resume}
              className="rounded-2xl bg-lime py-4 font-display text-sm font-black uppercase tracking-wider text-bg shadow-glow-lime"
            >
              ▶ Reprendre
            </button>
            <button
              onClick={stop}
              className="rounded-2xl bg-mythic py-4 font-display text-sm font-black uppercase tracking-wider text-white"
            >
              ⏹ Stop
            </button>
          </div>
        )}
        {state === "done" && (
          <div className="space-y-2">
            <button
              onClick={save}
              className="w-full rounded-2xl bg-lime py-4 font-display text-base font-black uppercase tracking-wider text-bg shadow-glow-lime"
            >
              ✓ Sauver dans mon historique
            </button>
            <button
              onClick={discard}
              className="w-full rounded-2xl border border-ink/15 py-3 font-mono text-xs font-bold uppercase text-ink-muted"
            >
              Jeter et recommencer
            </button>
          </div>
        )}

        {state === "idle" && (
          <p className="text-center text-[11px] font-mono text-ink-dim mt-3">
            Sortie GPS basique — distance, D+, allure. Pas d&apos;envoi auto vers
            Strava (tu peux quand même brancher Strava dans les paramètres).
          </p>
        )}
      </div>
    </main>
  );
}

function titleFromDuration(seconds: number): string {
  const h = seconds / 3600;
  // Pas de dévalo — chaque sortie compte, débutant ou pas (retour Inès panel)
  if (h > 8) return "Aventure de zinzin";
  if (h > 4) return "Sortie longue";
  if (h > 2) return "Belle sortie";
  if (h > 1) return "Bonne séance";
  if (h > 0.5) return "Belle séance"; // anciennement "petite sortie"
  return "Footing du jour";
}
