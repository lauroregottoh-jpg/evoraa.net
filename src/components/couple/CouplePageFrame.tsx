"use client"

import { MemberShell } from "@/components/layout/MemberShell"

/**
 * Cadre membre pour les pages Couple client.
 * Ne pas importer MemberPage (serveur / next/headers) dans un Client Component.
 */
export function CouplePageFrame({
  children,
  contentWidth = "default",
}: {
  children: React.ReactNode
  contentWidth?: "default" | "wide" | "full"
}) {
  return (
    <MemberShell dense contentWidth={contentWidth}>
      {children}
    </MemberShell>
  )
}
