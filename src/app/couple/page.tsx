import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleLanding } from "@/components/couple/CoupleLanding"
import {
  CoupleAccessDashboardCard,
  CoupleShell,
} from "@/components/couple/CoupleShell"
import {
  COUPLE_BRAND,
  COUPLE_TAGLINE,
  COUPLE_PROMISE,
  isCoupleFeatureEnabled,
} from "@/lib/couple/config"

export const metadata = {
  title: `${COUPLE_BRAND} | Bilan de couple | KELIAA`,
  description: `${COUPLE_TAGLINE}. ${COUPLE_PROMISE}`,
}

export const dynamic = "force-dynamic"

/** Présentation / vente Couple — sans barre d’onglets client. */
export default function CoupleMarketingPage() {
  if (!isCoupleFeatureEnabled()) {
    return (
      <MemberPage dense>
        <p className="p-8 text-sm text-muted-foreground text-center">
          Service temporairement indisponible.
        </p>
      </MemberPage>
    )
  }

  return (
    <MemberPage dense contentWidth="wide">
      <CoupleShell variant="sales" showWelcome={false}>
        <CoupleAccessDashboardCard />
        <CoupleLanding />
        <CoupleAccessDashboardCard className="mt-2" />
      </CoupleShell>
    </MemberPage>
  )
}
