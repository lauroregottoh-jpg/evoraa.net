import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { RegisterServiceWorker } from "@/components/pwa/RegisterServiceWorker";
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
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://keliaa.org";

export const viewport: Viewport = {
  themeColor: "#2D1020",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "KELIAA | Rencontres Chrétiennes",
    template: "%s | KELIAA",
  },
  description:
    "Plateforme de rencontres chrétiennes pour les célibataires qui souhaitent construire un mariage selon les standards bibliques. Matching fondé sur la foi, les valeurs et le projet de vie.",
  applicationName: "KELIAA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KELIAA",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "KELIAA",
    title: "KELIAA | Rencontres Chrétiennes",
    description:
      "Rencontres chrétiennes fondées sur le discernement, pas sur le swipe. Créez gratuitement votre profil.",
    images: [
      {
        url: "/auth-bg-african.png",
        width: 1200,
        height: 630,
        alt: "KELIAA — rencontres chrétiennes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KELIAA | Rencontres Chrétiennes",
    description:
      "Rencontres chrétiennes fondées sur le discernement, pas sur le swipe.",
    images: ["/auth-bg-african.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "JNfGd1Y3c4gE2RVDCobRq3rJu0-nIq6yE3I8Ez2eSFc",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
        <Script id="auth-oauth-handoff" strategy="beforeInteractive">{`
(function () {
  try {
    var path = window.location.pathname || "/";
    var p = new URLSearchParams(window.location.search);
    var code = p.get("code");
    var err = p.get("error_description") || p.get("error");
    // Uniquement le retour OAuth (code), ou une erreur Auth sur la home —
    // jamais sur /login (sinon boucle error=auth_callback).
    if (code) {
      var next = p.get("next");
      if (!next || next.charAt(0) !== "/") next = "/onboarding";
      var qs = new URLSearchParams();
      qs.set("code", code);
      qs.set("next", next);
      // Échange PKCE serveur (cookies @supabase/ssr)
      window.location.replace("/auth/callback?" + qs.toString());
      return;
    }
    if (err && (path === "/" || path === "")) {
      var next2 = p.get("next");
      if (!next2 || next2.charAt(0) !== "/") next2 = "/onboarding";
      var qs2 = new URLSearchParams();
      qs2.set("error", err);
      qs2.set("next", next2);
      window.location.replace("/auth/callback?" + qs2.toString());
    }
  } catch (e) {}
})();
        `}</Script>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AnalyticsScripts />
          <RegisterServiceWorker />
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
