import { MemberPage } from "@/components/layout/MemberPage"
import { CoachingSessionClient } from "@/components/coaching/CoachingSessionClient"

export const dynamic = "force-dynamic"

export default function CoachingSessionPage() {
  return (
    <MemberPage>
      <CoachingSessionClient />
    </MemberPage>
  )
}
