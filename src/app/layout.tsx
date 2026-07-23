import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KELIA | Rencontres Chrétiennes",
  description: "Plateforme de rencontres chrétiennes pour les célibataires qui souhaitent construire un mariage selon les standards bibliques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
