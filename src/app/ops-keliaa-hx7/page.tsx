import { AdminConsole } from "@/components/admin/AdminConsole"
import { getAdminDashboardData } from "@/app/actions/admin"
import { logoutAction } from "@/app/actions/auth"
import Link from "next/link"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"

export default async function OpsConsolePage() {
  const data = await getAdminDashboardData()

  if (
    data.error ||
    !data.stats ||
    !data.retention ||
    !data.ops ||
    !data.breakdowns ||
    !data.matchingIntelligence
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F6F5]">
        <div className="max-w-md text-center space-y-3 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold">Accès réservé</h1>
          <p className="text-sm text-muted-foreground">
            {data.error || "Connectez-vous avec un compte habilité."}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Console : {OPS_CONSOLE_PATH}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/login?next=${encodeURIComponent(OPS_CONSOLE_PATH)}`}
              className="text-primary underline text-sm"
            >
              Se connecter
            </Link>
            <Link href="/dashboard" className="text-primary underline text-sm">
              Espace membre
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-primary underline text-sm">
                Se déconnecter
              </button>
            </form>
          </div>
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
      matchingIntelligence={data.matchingIntelligence!}
    />
  )
}
