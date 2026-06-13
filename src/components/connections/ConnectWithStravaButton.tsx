// ====== ConnectWithStravaButton ======
// Bouton officiel "Connect with Strava" — asset Strava livré tel quel
// (1.1 Connect with Strava Buttons, version orange). Conforme aux
// brand guidelines Strava : pas de recréation, pas de modification.
// Hauteur fixée à 48px @1x comme demandé par Strava.
//
// Au clic, ouvre le flow OAuth via notre route /api/oauth/strava qui
// redirige ensuite vers https://www.strava.com/oauth/authorize.

export default function ConnectWithStravaButton({
  from = "/settings/connections/strava",
}: {
  from?: string;
}) {
  return (
    <a
      href={`/api/oauth/strava?from=${encodeURIComponent(from)}`}
      aria-label="Connect with Strava"
      className="inline-block transition active:scale-[0.98] hover:opacity-95"
    >
      <img
        src="/btn-strava-connect-with.svg"
        alt="Connect with Strava"
        height={48}
        width={237}
        style={{ height: "48px", width: "auto", maxWidth: "100%" }}
      />
    </a>
  );
}
