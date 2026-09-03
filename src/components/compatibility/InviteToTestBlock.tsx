"use client"

import * as React from "react"
import Link from "next/link"
import { inviteToAssessmentAction } from "@/app/actions/assessmentInvites"
import { assessmentTitle } from "@/lib/matching/testCoverage"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import { Button } from "@/components/ui/button"

export function InviteToTestBlock({
  partnerName,
  partnerUserId,
  missingOnPartner,
  viewerTestsCount,
}: {
  partnerName: string
  partnerUserId: string
  missingOnPartner: AssessmentSlug[]
  viewerTestsCount?: number
}) {
  const [busy, setBusy] = React.useState<string | null>(null)
  const [note, setNote] = React.useState("")

  if (!partnerUserId || missingOnPartner.length === 0) return null

  const send = async (slug: AssessmentSlug) => {
    setBusy(slug)
    setNote("")
    try {
      const res = await inviteToAssessmentAction({
        inviteeUserId: partnerUserId,
        testSlug: slug,
      })
      if (res.error) {
        setNote(res.error)
        return
      }
      setNote(
        res.already
          ? "Demande déjà envoyée pour ce test."
          : `${partnerName} verra la proposition dans ses tests. +5 messages à l’envoi, +5 de plus si le test est complété.`
      )
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="rounded-2xl border border-[#B8954A]/40 bg-[#F7F0E0]/50 p-5 space-y-3">
      <p className="font-serif text-lg font-bold text-foreground">
        Proposer un test · {partnerName}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {partnerName} fait partie de vos étoiles. Proposez un questionnaire de
        compatibilité : la demande apparaît dans ses tests, avec votre nom.
        Vous gagnez des messages supplémentaires (+5 à l&apos;envoi, +5 si le
        test est complété).
      </p>
      {viewerTestsCount === 0 ? (
        <p className="text-xs text-muted-foreground">
          Commencez par un test de votre côté pour un matching plus juste.{" "}
          <Link href="/assessments" className="font-semibold underline">
            Faire un test
          </Link>
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {missingOnPartner.map((slug) => (
          <Button
            key={slug}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            disabled={busy === slug}
            onClick={() => void send(slug)}
          >
            {busy === slug ? "…" : `Proposer · ${assessmentTitle(slug)}`}
          </Button>
        ))}
      </div>
      {note ? <p className="text-xs text-foreground">{note}</p> : null}
    </div>
  )
}
