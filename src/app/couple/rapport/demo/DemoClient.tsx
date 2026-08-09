"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CoupleReportView } from "@/components/couple/CoupleReportView"
import {
  buildDemoCoupleReport,
  DEMO_COUPLE_META,
  isCoupleDemoOfferParam,
} from "@/lib/couple/demoReport"
import type { CoupleOfferId } from "@/lib/couple/offers"
import { cn } from "@/utils/cn"

export default function CoupleRapportDemoClient() {
  const search = useSearchParams()
  const initial = isCoupleDemoOfferParam(search.get("offer"))
  const [offerId, setOfferId] = React.useState<CoupleOfferId>(initial)

  React.useEffect(() => {
    setOfferId(isCoupleDemoOfferParam(search.get("offer")))
  }, [search])

  const doc = React.useMemo(() => buildDemoCoupleReport(offerId), [offerId])

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      <div className="sticky top-0 z-30 border-b border-[#1C1412]/10 bg-[#FBF9F6]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C1F28]">
              Aperçu démo · moteur décision
            </p>
            <p className="text-sm font-medium text-[#1C1412]">
              {DEMO_COUPLE_META.label}
            </p>
          </div>
          <div className="flex rounded-xl border border-[#1C1412]/15 bg-white p-1">
            <button
              type="button"
              onClick={() => setOfferId("couple_essential")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                offerId === "couple_essential"
                  ? "bg-[#5C1F28] text-white"
                  : "text-[#1C1412]/70 hover:bg-[#F8F4EE]"
              )}
            >
              Essentiel
            </button>
            <button
              type="button"
              onClick={() => setOfferId("couple_premium_plus")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                offerId === "couple_premium_plus"
                  ? "bg-[#5C1F28] text-white"
                  : "text-[#1C1412]/70 hover:bg-[#F8F4EE]"
              )}
            >
              Premium Plus
            </button>
          </div>
          <Link
            href="/couple/dossier/demo"
            className="text-xs font-semibold text-[#5C1F28] underline underline-offset-2"
          >
            Dossier démo
          </Link>
          <Link
            href="/couple"
            className="text-xs font-semibold text-[#5C1F28] underline underline-offset-2"
          >
            Landing Couple
          </Link>
        </div>
        <p className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 text-xs text-[#1C1412]/55">
          {DEMO_COUPLE_META.status} — {DEMO_COUPLE_META.note}
        </p>
      </div>

      <div className="px-3 sm:px-6 py-6 sm:py-8">
        <CoupleReportView
          doc={doc}
          demoLabel={
            offerId === "couple_premium_plus"
              ? "Démo Premium Plus"
              : "Démo Essentiel"
          }
        />
      </div>
    </div>
  )
}
