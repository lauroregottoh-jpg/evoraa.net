"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { getOpsEntryAction } from "@/app/actions/admin"

/** Bandeau visible uniquement pour les comptes staff — bridge membre → console ops. */
export function OpsAdminEntryBanner() {
  const [entry, setEntry] = React.useState<{ href: string; label: string } | null>(null)

  React.useEffect(() => {
    getOpsEntryAction().then((r) => {
      if (r.show) setEntry({ href: r.href, label: r.label })
    })
  }, [])

  if (!entry) return null

  return (
    <div className="rounded-2xl border border-[#C4A35A]/50 bg-[#0F1F1A] text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
      <div className="flex items-start gap-2.5 min-w-0">
        <ShieldCheck className="h-5 w-5 text-[#C4A35A] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold">Vous êtes admin KELIAA</p>
          <p className="text-[11px] text-white/65 leading-relaxed">
            L&apos;espace membre ci-dessous n&apos;est pas la console. Ouvrez la console ops pour
            gérer membres, modération et Alliance.
          </p>
        </div>
      </div>
      <Link
        href={entry.href}
        className="inline-flex items-center justify-center rounded-xl bg-[#C4A35A] text-[#0F1F1A] text-sm font-bold px-4 py-2.5 shrink-0 hover:brightness-110"
      >
        {entry.label}
      </Link>
    </div>
  )
}
