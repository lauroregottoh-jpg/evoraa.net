"use client"

import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs"

/** Neige / orbes brand — toutes les pages (marketing + membre). */
export function SiteAmbientSnow() {
  return (
    <AmbientSnowOrbs
      density="normal"
      variant="light"
      className="fixed inset-0 z-[2] opacity-[0.55] mix-blend-multiply"
    />
  )
}
