"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { COUPLE_BRAND } from "@/lib/couple/config"

export default function CoupleConfirmationClient() {
  const search = useSearchParams()
  const inviteToken = search.get("inviteToken")
  const invitePath = inviteToken
    ? `/couple/join?token=${inviteToken}`
    : null

  return (
    <MemberPage>
      <CoupleShell>
        <div className="max-w-xl mx-auto space-y-6 py-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Merci — votre bilan est ouvert
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vous venez d’acheter quelque chose d’important pour votre couple.
            L’étape suivante : inviter votre partenaire, puis répondre chacun de
            votre côté. {COUPLE_BRAND} vous accompagne jusqu’au rapport.
          </p>
          <ol className="space-y-2 text-sm list-decimal pl-5 text-foreground/90">
            <li>Invitez votre partenaire (lien ou code)</li>
            <li>Chacun remplit le questionnaire</li>
            <li>Quand les deux ont terminé, le rapport se prépare</li>
            <li>Consultez résultats, exercices et plan d’action</li>
          </ol>
          {invitePath && (
            <p className="text-xs rounded-xl border border-border bg-white/70 px-3 py-2 break-all">
              Lien d’invitation (à partager) :{" "}
              <span className="font-mono">{invitePath}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/couple/onboarding"
              className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
            >
              Continuer l’onboarding
            </Link>
            <Link
              href="/couple/inviter"
              className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold"
            >
              Inviter mon partenaire
            </Link>
          </div>
        </div>
      </CoupleShell>
    </MemberPage>
  )
}
