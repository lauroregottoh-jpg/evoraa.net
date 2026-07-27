import { MemberPage } from "@/components/layout/MemberPage";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { listConversations } from "@/app/actions/messaging";
import { getUsageSnapshot } from "@/lib/billing/usage";
import { QuotaPill } from "@/components/billing/QuotaPill";

export default async function MessagesPage() {
  const [result, usage] = await Promise.all([listConversations(), getUsageSnapshot()]);

  return (
    <MemberPage>
      <div className="space-y-6">
        {usage && <QuotaPill usage={usage} compact className="max-w-sm" />}
        <ConversationsList conversations={result.conversations ?? []} error={result.error} />
      </div>
    </MemberPage>
  );
}
