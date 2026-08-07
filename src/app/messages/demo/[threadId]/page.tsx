import { notFound } from "next/navigation"
import { MemberPage } from "@/components/layout/MemberPage"
import { DemoMessageRoom } from "@/components/messages/DemoMessageRoom"
import { getDemoThread } from "@/lib/demo/sarahGandeSimulations"

export default async function DemoMessagePage({
  params,
}: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await params
  const thread = getDemoThread(threadId)
  if (!thread) notFound()

  return (
    <MemberPage>
      <div className="py-4">
        <DemoMessageRoom thread={thread} />
      </div>
    </MemberPage>
  )
}
