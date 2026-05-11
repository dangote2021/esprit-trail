import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import IOSInstallBanner from "@/components/pwa/IOSInstallBanner";
import StorageMigrationGate from "@/components/layout/StorageMigrationGate";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Esprit Trail · Coach Trail",
    template: "%s · Esprit Trail",
  },
  description:
    "Coach IA pour ton ultra. Plans nutrition, spots GPX, dossards à gagner.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "esprit trail",
    "trail",
    "trail running",
    "ultra trail",
    "UTMB",
    "CCC",
    "ITRA",
    "coach trail",
    "coach IA trail",
    "plan d'entraînement trail",
    "plan nutrition trail",
    "spots GPX",
    "GPX trail France",
    "strava",
    "off race",
    "FKT",
    "running",
    "MaxiRace",
    "SaintéLyon",
    "dossard trail",
  ],
  authors: [{ name: "Esprit Trail" }],
  creator: "Esprit Trail",
  publisher: "Esprit Trail",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Esprit Trail",
    title: "Esprit Trail · Coach Trail",
    description:
      "Coach IA pour ton ultra. Plans nutrition, spots GPX, dossards à gagner.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Esprit Trail · Coach Trail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Esprit Trail · Coach Trail",
    description:
      "Coach IA pour ton ultra. Plans nutrition, spots GPX, dossards à gagner.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "Esprit Trail",
  appleWebApp: {
    capable: true,
    title: "Esprit Trail",
    // black-translucent = barre de statut transparente, contenu sous le notch
    // → effet "vraie app" plein écran sur iPhone une fois ajouté à l'accueil
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    // Empêche iOS d'auto-linker téléphones / emails / dates dans le contenu
    telephone: false,
    email: false,
    address: false,
    date: false,
  },
  other: {
    // Android Chrome : équivalent de apple-mobile-web-app-capable
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  // Esprit Trail — Alpine Light : crème naturel
  themeColor: "#f0e6c8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className="min-h-screen bg-bg text-ink antialiased font-sans">
        <div className="relative min-h-screen pb-24">
          {/* Grid pattern background, subtil, effet "HUD" */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-grid-pattern bg-grid opacity-30"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-radial-glow"
          />
          <div className="relative z-10">{children}</div>
          <Footer />
        </div>
        <BottomNav />
        <CookieBanner />
        <IOSInstallBanner />
        <StorageMigrationGate />
      </body>
    </html>
  );
}
