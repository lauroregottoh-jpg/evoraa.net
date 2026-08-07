import { MemberPage } from "@/components/layout/MemberPage"
import { ConversationsList } from "@/components/messages/ConversationsList"
import { listConversations } from "@/app/actions/messaging"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { QuotaPill } from "@/components/billing/QuotaPill"
import { loadPublicCms } from "@/lib/admin/loadCms"
import { SponsoredAdBanner } from "@/components/ads/SponsoredAdBanner"
import { createClient } from "@/utils/supabase/server"
import {
  isSarahGande,
  SARAH_GANDE_DEMO_THREADS,
} from "@/lib/demo/sarahGandeSimulations"

export default async function MessagesPage() {
  const [result, usage, cms] = await Promise.all([
    listConversations(),
    getUsageSnapshot(),
    loadPublicCms(),
  ])

  const ads = cms.ads.filter((a) => a.active && a.slot === "messages")

  let demoThreads = [] as typeof SARAH_GANDE_DEMO_THREADS
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", user.id)
        .maybeSingle()
      if (isSarahGande(profile?.first_name, profile?.last_name)) {
        demoThreads = SARAH_GANDE_DEMO_THREADS
      }
    }
  } catch {
    /* ignore — inbox still works without demo */
  }

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
