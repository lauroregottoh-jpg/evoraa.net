"use client"

import { MemberShell } from "@/components/layout/MemberShell"

/**
 * Cadre membre pour les pages Couple client.
 * Ne pas importer MemberPage (serveur / next/headers) dans un Client Component.
 */
export function CouplePageFrame({ children }: { children: React.ReactNode }) {
  return <MemberShell dense>{children}</MemberShell>
}
