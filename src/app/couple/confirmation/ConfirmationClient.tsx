"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleUnlockReveal } from "@/components/couple/CoupleUnlockReveal"
import { COUPLE_BRAND } from "@/lib/couple/config"

export default function CoupleConfirmationClient() {
  const search = useSearchParams()
  const inviteToken = search.get("inviteToken")
  const invitePath = inviteToken
    ? `/couple/join?token=${inviteToken}`
    : null

  return (
    <CouplePageFrame>
      <div className="max-w-2xl mx-auto space-y-8 py-6 px-1">
        <CoupleUnlockReveal onContinueHref="/couple/onboarding" />

        <div className="space-y-4 rounded-2xl border border-[#1C1412]/10 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-[#1C1412]">
            Prochaines étapes — {COUPLE_BRAND}
          </h2>
          <ol className="space-y-2 text-sm list-decimal pl-5 text-[#1C1412]/85">
            <li>Invitez votre partenaire (lien ou code)</li>
            <li>Chacun remplit le questionnaire individuellement</li>
            <li>Quand les deux ont terminé, le rapport se prépare</li>
            <li>Consultez résultats, exercices et plan d’action</li>
          </ol>
          {invitePath && (
            <p className="text-xs rounded-xl border border-[#1C1412]/10 bg-[#F8F4EE] px-3 py-2 break-all">
              Lien d’invitation :{" "}
              <span className="font-mono">{invitePath}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/couple/onboarding"
              className="inline-flex h-11 items-center rounded-xl bg-[#5C1F28] text-white px-5 text-sm font-semibold"
            >
              Continuer l’onboarding
            </Link>
            <Link
              href="/couple/espace"
              className="inline-flex h-11 items-center rounded-xl border border-[#1C1412]/15 px-5 text-sm font-semibold"
            >
              Mon espace couple
            </Link>
          </div>
        </div>
      </div>
    </CouplePageFrame>
  )
}
