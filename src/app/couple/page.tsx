import { CinematicLayout } from "@/components/layout/CinematicLayout"
import { CoupleLanding } from "@/components/couple/CoupleLanding"
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

export default function CoupleMarketingPage() {
  if (!isCoupleFeatureEnabled()) {
    return (
      <CinematicLayout>
        <p className="p-12 text-sm text-muted-foreground text-center">
          Service temporairement indisponible.
        </p>
      </CinematicLayout>
    )
  }

  return (
    <CinematicLayout>
      <CoupleLanding />
    </CinematicLayout>
  )
}
