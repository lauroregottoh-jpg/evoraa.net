import { MemberPage } from "@/components/layout/MemberPage"
import { ConversationsList } from "@/components/messages/ConversationsList"
import { listConversations } from "@/app/actions/messaging"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { QuotaPill } from "@/components/billing/QuotaPill"
import { loadPublicCms } from "@/lib/admin/loadCms"
import { SponsoredAdBanner } from "@/components/ads/SponsoredAdBanner"
import {
  DEMO_MATCH_THREADS,
  shouldShowDemoMatches,
} from "@/lib/demo/sarahGandeSimulations"

export default async function MessagesPage() {
  const [result, usage, cms] = await Promise.all([
    listConversations(),
    getUsageSnapshot(),
    loadPublicCms(),
  ])

  const ads = cms.ads.filter((a) => a.active && a.slot === "messages")
  const realCount = (result.conversations ?? []).length
  const demoThreads = shouldShowDemoMatches({
    conversations: realCount,
    matches: realCount,
    compatibilities: realCount,
  })
    ? DEMO_MATCH_THREADS
    : []

  return (
    <MemberPage>
      <div className="space-y-6">
        {usage && <QuotaPill usage={usage} compact className="max-w-sm" />}
        {ads.map((ad) => (
          <SponsoredAdBanner key={ad.id} ad={ad} />
        ))}
        <ConversationsList
          conversations={result.conversations ?? []}
          error={result.error}
          demoThreads={demoThreads}
        />
      </div>
    </MemberPage>
  )
}
