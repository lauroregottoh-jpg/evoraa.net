import { Suspense } from "react"
import { MemberPage } from "@/components/layout/MemberPage"
import { listMyNotifications } from "@/app/actions/notifications"
import { AlertsAndFeedbackHub } from "@/components/notifications/AlertsAndFeedbackHub"
import { createClient } from "@/utils/supabase/server"

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; priority?: string; demo?: string }>
}) {
  const sp = await searchParams
  const [{ notifications, error }, supabase] = await Promise.all([
    listMyNotifications(),
    createClient(),
  ])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let defaultName = ""
  let defaultEmail = user?.email ?? ""
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle()
    defaultName = [data?.first_name, data?.last_name].filter(Boolean).join(" ")
  }

  return (
    <MemberPage>
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground py-8">Chargement…</p>
        }
      >
        <AlertsAndFeedbackHub
          notifications={notifications as never}
          error={error}
          defaultName={defaultName}
          defaultEmail={defaultEmail}
          priority={sp.priority === "1"}
        />
      </Suspense>
    </MemberPage>
  )
}
