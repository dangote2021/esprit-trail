import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ravito — Le trail, il a changé",
  description:
    "Ravito — Le trail, il a changé. L'app trail tout-en-un : UTMB Index, ITRA, Strava, Garmin, Coros, Suunto, coach IA, guildes, défis.",
  metadataBase: new URL("https://ravito.vercel.app"),
  openGraph: {
    title: "Ravito — Le trail, il a changé",
    description:
      "Le trail, il a changé. Cumule de l'XP, rejoins une guilde, suis ton plan coach IA. L'app trail pensée par des traileurs pour des traileurs.",
    type: "website",
  },
  applicationName: "Ravito",
  appleWebApp: {
    capable: true,
    title: "Ravito",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  // Ravito — Alpine Light : crème naturel
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
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
