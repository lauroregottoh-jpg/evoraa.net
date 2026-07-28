import { AdminConsole } from "@/components/admin/AdminConsole"
import { getAdminDashboardData } from "@/app/actions/admin"
import Link from "next/link"

export default async function AdminPage() {
  const data = await getAdminDashboardData()

  if (data.error || !data.stats || !data.retention || !data.ops || !data.breakdowns) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F6F5]">
        <div className="max-w-md text-center space-y-3 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold">Accès admin requis</h1>
          <p className="text-sm text-muted-foreground">{data.error}</p>
          <p className="text-xs text-muted-foreground">
            Compte avec <code>profiles.role = admin</code> requis.
          </p>
          <Link href="/login" className="text-primary underline text-sm inline-block mr-3">
            Se connecter
          </Link>
          <Link href="/dashboard" className="text-primary underline text-sm inline-block">
            Espace membre
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AdminConsole
      stats={data.stats}
      retention={data.retention}
      breakdowns={data.breakdowns}
      ops={data.ops}
      viewerRole={data.viewerRole}
      settings={data.settings}
      users={data.users}
      reports={data.reports}
      payments={data.payments}
      paymentEvents={data.paymentEvents}
      photos={data.photos}
      subscriptions={data.subscriptions}
      conversations={data.conversations}
      matches={data.matches}
      recommendations={data.recommendations}
      moderationEvents={data.moderationEvents}
    />
  )
}
