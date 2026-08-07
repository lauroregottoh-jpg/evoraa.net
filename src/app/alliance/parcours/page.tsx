import Link from "next/link"
import { redirect } from "next/navigation"
import { MemberPage } from "@/components/layout/MemberPage"
import { getAllianceJourneyState } from "@/app/actions/allianceJourney"
import { AllianceMemberCard } from "@/components/alliance/AllianceMemberCard"
import { AllianceParcoursView } from "@/components/alliance/AllianceParcoursView"
import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs"

export const dynamic = "force-dynamic"

export default async function AllianceParcoursPage() {
  const state = await getAllianceJourneyState()
  if (!state) redirect("/login?next=/alliance/parcours")

  if (!state.isPaid) {
    return (
      <MemberPage>
        <div className="max-w-lg mx-auto text-center py-12 space-y-4">
          <h1 className="font-serif text-3xl font-bold">Mon parcours Alliance</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Activez Alliance pour entrer dans un parcours guidé de préparation au
            mariage — pas seulement des quotas.
          </p>
          <Link
            href="/premium"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            Entrer dans Alliance
          </Link>
        </div>
      </MemberPage>
    )
  }

  return (
    <MemberPage>
      <div className="relative space-y-6 pb-8">
        <AmbientSnowOrbs density="soft" className="opacity-45" />
        <div className="relative z-10 space-y-6">
          <AllianceMemberCard
            firstName={state.firstName}
            memberSinceLabel={state.memberSinceLabel}
          />
          <AllianceParcoursView
            firstName={state.firstName}
            missions={state.missions}
            missionPercent={state.missionProgress.percent}
            level={state.level}
            achievements={state.achievements}
            assessmentsDone={state.assessmentsDone}
            hasMatchSignal={state.achievements.conversation}
          />
        </div>
      </div>
    </MemberPage>
  )
}
