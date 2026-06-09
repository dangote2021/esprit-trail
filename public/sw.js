// Service worker minimal pour les push notifs Esprit Trail.
// V1 : gere les events push + clic. Le backend send (Vercel Cron + VAPID)
// sera branche en v2.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    /* ignore */
  }
  const title = data.title || "Esprit Trail";
  const options = {
    body: data.body || "Ta seance du jour t'attend.",
    icon: "/icon-192.png",
    badge: "/favicon-32.png",
    data: { url: data.url || "/" },
    tag: data.tag || "esprit-daily",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ("focus" in c) {
          c.focus();
          try { c.navigate(url); } catch (_) { /* ignore */ }
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }),
  );
});
