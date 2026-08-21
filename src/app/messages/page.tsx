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
import { MessageCreditsCallout } from "@/components/engagement/MessageCreditsCallout"
import { getMessageCreditBalance } from "@/lib/billing/messageCredits"
import { createClient } from "@/utils/supabase/server"

export default async function MessagesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [result, usage, cms, credits] = await Promise.all([
    listConversations(),
    getUsageSnapshot(),
    loadPublicCms(),
    user ? getMessageCreditBalance(user.id) : Promise.resolve({ remaining: 0, nextExpiresAt: null }),
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
        <MessageCreditsCallout
          remaining={credits.remaining}
          expiresAt={credits.nextExpiresAt}
        />
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
