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
  viewerTestsCount: number
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
          ? "Invitation déjà envoyée pour ce test."
          : `Invitation envoyée. ${partnerName} verra : vous l’invitez à faire « ${assessmentTitle(slug)} ». +5 messages (20 jours).`
      )
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="rounded-2xl border border-[#B8954A]/40 bg-[#F7F0E0]/50 p-5 space-y-3">
      <p className="font-serif text-lg font-bold text-foreground">
        Inviter {partnerName} à un test
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {partnerName} n’a pas encore rempli ces questionnaires. L’invitation
        s’affiche chez lui/elle : « vous recommande / vous invite à faire ce
        test afin de tester votre compatibilité ». +5 messages à l’envoi, +5
        de plus s’il/elle le fait (20 jours).
      </p>
      {viewerTestsCount === 0 ? (
        <p className="text-xs text-muted-foreground">
          Faites au moins un test de votre côté pour un matching plus juste.{" "}
          <Link href="/assessments" className="font-semibold underline">
            Mes tests
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
            {busy === slug ? "…" : `Inviter : ${assessmentTitle(slug)}`}
          </Button>
        ))}
      </div>
      {note ? <p className="text-xs text-foreground">{note}</p> : null}
    </div>
  )
}
