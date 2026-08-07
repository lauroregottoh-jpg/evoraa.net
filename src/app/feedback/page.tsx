import { redirect } from "next/navigation"

/** Avis fusionné dans /notifications?tab=avis */
export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ priority?: string }>
}) {
  const sp = await searchParams
  const q = new URLSearchParams({ tab: "avis" })
  if (sp.priority === "1") q.set("priority", "1")
  redirect(`/notifications?${q.toString()}`)
}
