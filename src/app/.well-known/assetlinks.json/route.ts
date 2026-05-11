// ====== /.well-known/assetlinks.json ======
// Digital Asset Links pour la TWA (Trusted Web Activity) Android.
// Ce fichier doit être servi à la racine pour que Chrome cache la barre d'URL
// quand l'app TWA est lancée depuis le Play Store.
//
// Configuration via env vars Vercel :
//   TWA_PACKAGE_NAME       (ex: "app.ravito.twa")
//   TWA_SHA256_FINGERPRINT (récupéré via `keytool -list -v -keystore android.keystore`)
//
// Si les vars ne sont pas set, on retourne un tableau vide. Pas d'erreur 500
// pour ne pas casser le crawler de Google quand la config n'est pas encore là.

import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  const packageName = process.env.TWA_PACKAGE_NAME;
  const fingerprint = process.env.TWA_SHA256_FINGERPRINT;

  if (!packageName || !fingerprint) {
    return NextResponse.json([], {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  // Format Digital Asset Links
  // https://developers.google.com/digital-asset-links/v1/getting-started
  const payload = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: [fingerprint],
      },
    },
  ];

  return NextResponse.json(payload, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
