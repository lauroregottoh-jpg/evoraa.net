import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paiement",
  description: "Page de paiement sécurisée.",
  robots: { index: false, follow: false },
  applicationName: "Paiement",
  openGraph: {
    title: "Paiement",
    description: "Page de paiement sécurisée.",
  },
}

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return children
}
