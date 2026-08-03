import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://evoraa-net.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "KELLIA | Rencontres Chrétiennes",
    template: "%s | KELLIA",
  },
  description:
    "Plateforme de rencontres chrétiennes pour les célibataires qui souhaitent construire un mariage selon les standards bibliques. Matching fondé sur la foi, les valeurs et le projet de vie.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "KELLIA",
    title: "KELLIA | Rencontres Chrétiennes",
    description:
      "Rencontres chrétiennes fondées sur le discernement, pas sur le swipe. Créez gratuitement votre profil.",
    images: [
      {
        url: "/auth-bg-african.png",
        width: 1200,
        height: 630,
        alt: "KELLIA — rencontres chrétiennes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KELLIA | Rencontres Chrétiennes",
    description:
      "Rencontres chrétiennes fondées sur le discernement, pas sur le swipe.",
    images: ["/auth-bg-african.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen bg-background text-foreground">
        <AnalyticsScripts />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
