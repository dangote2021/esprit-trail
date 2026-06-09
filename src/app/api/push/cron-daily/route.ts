import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { VAPID_PUBLIC_KEY } from "@/lib/vapid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Pas de maxDuration explicite : 10s par defaut sur Hobby plan Vercel,
// suffisant pour envoyer quelques dizaines de notifs en parallele.

// GET /api/push/cron-daily
// Endpoint declenche par Vercel Cron tous les jours a 17h UTC (18h-19h Paris).
// Recupere toutes les push subscriptions et envoie une notif "Ta seance du
// jour t'attend" via web-push (VAPID).
//
// Protection : header Authorization: Bearer <CRON_SECRET>. Vercel Cron passe
// automatiquement le secret defini dans les env vars du projet.

const MESSAGES = [
  {
    title: "🏃 Ta seance du jour",
    body: "Ouvre Esprit Trail pour voir ta seance et la cocher.",
  },
  {
    title: "🎯 Quete du jour",
    body: "Couvre quelques bornes aujourd'hui. La streak compte sur toi.",
  },
  {
    title: "🔥 Garde la flamme",
    body: "Une sortie courte, c'est mieux qu'aucune. Lance la quete.",
  },
  {
    title: "⛰️ Le sentier t'attend",
    body: "Pieds boueux, ca se merite. Ta seance du jour est dans l'app.",
  },
];

export async function GET(req: NextRequest) {
  // Auth via header Vercel Cron
  const authHeader = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET || "";
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const vapidPrivate = process.env.VAPID_PRIVATE_KEY || "";
  const vapidSubject = process.env.VAPID_SUBJECT || "mailto:guillaumecoulon1@gmail.com";
  if (!vapidPrivate) {
    return NextResponse.json(
      { ok: false, error: "VAPID_PRIVATE_KEY missing" },
      { status: 500 },
    );
  }

  webpush.setVapidDetails(vapidSubject, VAPID_PUBLIC_KEY, vapidPrivate);

  // Lecture directe via service-role (cron tourne sans contexte user)
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supaService = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supaUrl || !supaService) {
    return NextResponse.json(
      { ok: false, error: "Supabase service role not configured" },
      { status: 500 },
    );
  }
  const supabase = createClient(supaUrl, supaService);

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth");
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Rotation simple par jour de l'annee pour varier
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const msg = MESSAGES[dayOfYear % MESSAGES.length];

  const payload = JSON.stringify({
    title: msg.title,
    body: msg.body,
    url: "/",
    tag: "esprit-daily",
  });

  // Envoi en parallele pour tenir dans 10s
  const results = await Promise.all(
    (subs || []).map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        );
        return { id: sub.id, ok: true as const };
      } catch (e: unknown) {
        const status = (e as { statusCode?: number })?.statusCode;
        return { id: sub.id, ok: false as const, status };
      }
    }),
  );

  const sent = results.filter((r) => r.ok).length;
  const failed = results.length - sent;
  // 404 / 410 = subscription expired ou inconnue → on supprime
  const dead = results
    .filter((r) => !r.ok && (r.status === 404 || r.status === 410))
    .map((r) => r.id);

  if (dead.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", dead);
  }

  return NextResponse.json({
    ok: true,
    total: (subs || []).length,
    sent,
    failed,
    cleaned: dead.length,
  });
}
