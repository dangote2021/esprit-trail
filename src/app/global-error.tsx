"use client";

// ====== ERROR BOUNDARY ULTIME (racine) ======
// Déclenché quand le layout root lui-même plante. Pas de styling Tailwind
// accessible ici — tout est inline pour garantir l'affichage.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f0e6c8",
          color: "#1b4332",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#52796f",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Crash total
          </p>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              margin: "12px 0 8px 0",
              lineHeight: 1.1,
            }}
          >
            Là c'est le bonk.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#52796f",
              maxWidth: 380,
              margin: "8px 0 24px 0",
            }}
          >
            L'app a ramassé grave. Recharge la page — si ça continue, on
            s'en occupe.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#2d6a4f",
              color: "#fff9ea",
              border: "2px solid #1b4332",
              boxShadow: "0 4px 0 #1b4332",
              padding: "12px 22px",
              borderRadius: 12,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Retenter
          </button>
        </div>
      </body>
    </html>
  );
}
