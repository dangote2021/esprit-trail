// ====== /.well-known/assetlinks.json ======
// Digital Asset Links pour la TWA (Trusted Web Activity) Android.
// Ce fichier doit être servi à la racine pour que Chrome cache la barre d'URL
// (et la croix de fermeture) quand l'app TWA est lancée depuis le Play Store.
//
// Configuration via env vars Vercel (toutes optionnelles — defaults hardcodés
// ci-dessous, qui sont publics anyway car servis dans la réponse JSON) :
//   TWA_PACKAGE_NAME              ex: "app.ravito" (override le default)
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

import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Defaults hardcodés (les fingerprints SHA-256 sont publics — ils sont servis
// à tout internet via /.well-known/assetlinks.json). Cela évite d'avoir à
// configurer manuellement des env vars sur Vercel pour faire marcher la TWA.
const DEFAULT_FP_UPLOAD =
  "F8:D0:B3:E8:2B:C7:AA:9B:85:9B:45:1F:AA:5D:FD:F9:11:3A:74:4B:BB:00:01:DB:55:FC:F8:03:57:4B:EC:13";
const DEFAULT_FP_PLAY =
  "04:AA:75:D6:1B:2C:37:D7:20:7C:45:40:D8:70:4D:4E:A3:42:81:DE:92:08:DE:F0:91:F5:53:52:3C:B0:17:28";

function normalizeFingerprint(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toUpperCase();
  // Accepte avec ou sans `:` séparateurs, espaces…
  if (!trimmed) return null;
  return trimmed;
}

export function GET() {
  const packageName = process.env.TWA_PACKAGE_NAME?.trim();
  const fpUpload =
    normalizeFingerprint(process.env.TWA_SHA256_FINGERPRINT) ||
    DEFAULT_FP_UPLOAD;
  const fpPlay =
    normalizeFingerprint(process.env.TWA_SHA256_FINGERPRINT_PLAY) ||
    DEFAULT_FP_PLAY;

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
