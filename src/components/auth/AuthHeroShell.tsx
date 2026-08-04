"use client"

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

/** Fond auth partagé (inscription, aide inscription). */
export function AuthHeroShell({
  children,
  footer,
}: {
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/auth-bg-african.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1412]/55 via-[#5C1F28]/45 to-[#1C1412]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(184,149,74,0.18),_transparent_55%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="mb-6 font-serif text-3xl sm:text-4xl tracking-wide text-white drop-shadow-md hover:opacity-90 transition-opacity"
        >
          KELIAA
        </Link>
        {children}
        {footer ?? (
          <p className="mt-8 max-w-md text-center text-xs text-white/70 leading-relaxed">
            En créant un compte, vous rejoignez une communauté fondée sur le
            respect et le discernement.
          </p>
        )}
      </div>
    </div>
  )
}
