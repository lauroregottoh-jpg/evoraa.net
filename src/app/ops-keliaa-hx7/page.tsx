import { AdminConsole } from "@/components/admin/AdminConsole"
import { getAdminDashboardData } from "@/app/actions/admin"
import { logoutAction } from "@/app/actions/auth"
import Link from "next/link"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"
import type { MatchingIntelligence } from "@/lib/admin/matchingIntelligence"

export const dynamic = "force-dynamic"

export default async function OpsConsolePage() {
  let data: Awaited<ReturnType<typeof getAdminDashboardData>>
  try {
    data = await getAdminDashboardData()
  } catch (e) {
    console.error("[ops] dashboard fatal", e)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F6F5]">
        <div className="max-w-md text-center space-y-3 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold">Console indisponible</h1>
          <p className="text-sm text-muted-foreground">
            Erreur temporaire de chargement. Reconnectez-vous puis réessayez.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/login?next=${encodeURIComponent(OPS_CONSOLE_PATH)}`}
              className="text-primary underline text-sm"
            >
              Se reconnecter
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

  // Accès refusé uniquement si auth/rôle KO — pas si un KPI partiel manque.
  if (data.error || !data.viewerRole) {
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

  const emptyRetention = {
    newMembers30d: 0,
    profilesComplete70: 0,
    assessmentsDoneAll: 0,
    activeFreeEstimate: 0,
    activeAlliance: 0,
    activeLegacyPremium: 0,
    expiredSubs30d: 0,
    cancelledSubs30d: 0,
    conversations30d: 0,
    conversionPaidPct: 0,
    menCount: 0,
    womenCount: 0,
    renewalsDue7d: 0,
    matches30d: 0,
    views30d: 0,
    favoritesTotal: 0,
    pendingProfiles: 0,
  }

  const emptyOps = {
    paymentsDemoMode: true,
    hasMoneroo: false,
    hasBictorys: false,
    paymentProvider: "demo",
    bictorysSandbox: false,
    hasResend: false,
    hasCronSecret: false,
    hasServiceRole: false,
    appUrl: "",
    hasStripe: false,
    hasOpenAI: false,
    hasYoutube: false,
  }

  const emptyBreakdowns = {
    byCity: [] as Array<{ name: string; count: number }>,
    byCountry: [] as Array<{ name: string; count: number }>,
    byAge: [] as Array<{ name: string; count: number }>,
    byDenomination: [] as Array<{ name: string; count: number }>,
    signups14d: [] as Array<{ name: string; count: number }>,
    matchingRatePct: 0,
    avgTrust: 0,
    sanctioned: 0,
    pendingRecos: 0,
  }

  const emptyMatching: MatchingIntelligence = {
    assessmentsDoneAll: 0,
    assessmentsPartial: 0,
    assessmentsNone: 0,
    avgPillars: [],
    pillarCompletionDist: [],
    weakThemes: [],
    profileTypes: [],
    practiceDist: [],
    communicationDist: [],
    scoreBuckets: [],
    matchesByDay: [],
    avgMatchScore: null,
    highScoreMatches: 0,
    members: [],
  }

  return (
    <AdminConsole
      stats={
        data.stats || {
          users: 0,
          activeSubscriptions: 0,
          openReports: 0,
          pendingPhotos: 0,
          revenueXof: 0,
        }
      }
      retention={data.retention || emptyRetention}
      breakdowns={data.breakdowns || emptyBreakdowns}
      ops={data.ops || emptyOps}
      viewerRole={data.viewerRole}
      settings={data.settings || []}
      users={data.users || []}
      reports={data.reports || []}
      payments={data.payments || []}
      paymentEvents={data.paymentEvents || []}
      photos={data.photos || []}
      subscriptions={data.subscriptions || []}
      conversations={data.conversations || []}
      matches={data.matches || []}
      recommendations={data.recommendations || []}
      moderationEvents={data.moderationEvents || []}
      feedbackItems={data.feedbackItems ?? []}
      matchingIntelligence={data.matchingIntelligence ?? emptyMatching}
    />
  )
}
