// ====== /.well-known/assetlinks.json ======
// Digital Asset Links pour la TWA (Trusted Web Activity) Android.
// Ce fichier doit être servi à la racine pour que Chrome cache la barre d'URL
// (et la croix de fermeture) quand l'app TWA est lancée depuis le Play Store.
//
// Configuration via env vars Vercel :
//   TWA_PACKAGE_NAME              ex: "app.ravito"
//   TWA_SHA256_FINGERPRINT        SHA-256 d'upload (locale, keytool)
//   TWA_SHA256_FINGERPRINT_PLAY   SHA-256 Play App Signing (Google-managed)
//                                 → Play Console > App integrity > App signing key
//
// IMPORTANT — Pourquoi 2 fingerprints :
// Quand Google distribue l'app via Play Store, il RE-SIGNE le bundle avec sa
// propre clé (Play App Signing). La SHA-256 que voit Android sur le téléphone
// est celle de Google, pas la tienne. Si on ne déclare que la tienne, la TWA
// n'est pas vérifiée → fallback Custom Tab avec X en haut à gauche.
// Solution : on déclare les DEUX fingerprints (locale + Play). Comme ça :
//   - installation depuis Play Store → match fingerprint Play → TWA fullscreen
//   - install local (adb / Bubblewrap test) → match fingerprint upload → idem
//
// Si une des variables n'est pas set, on l'ignore proprement (pas de 500).

import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function normalizeFingerprint(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toUpperCase();
  // Accepte avec ou sans `:` séparateurs, espaces…
  if (!trimmed) return null;
  return trimmed;
}

export function GET() {
  const packageName = process.env.TWA_PACKAGE_NAME?.trim();
  const fpUpload = normalizeFingerprint(process.env.TWA_SHA256_FINGERPRINT);
  const fpPlay = normalizeFingerprint(process.env.TWA_SHA256_FINGERPRINT_PLAY);

  // On accepte aussi une liste séparée par virgule dans TWA_SHA256_FINGERPRINT
  // pour les setups qui préfèrent une seule variable.
  const extras = (process.env.TWA_SHA256_FINGERPRINT || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 30 && s !== fpUpload);

  const allFingerprints = [fpUpload, fpPlay, ...extras].filter(
    (v): v is string => !!v,
  );

  if (!packageName || allFingerprints.length === 0) {
    return NextResponse.json([], {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  // Dedupe au cas où
  const unique = Array.from(new Set(allFingerprints));

  const payload = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: unique,
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
