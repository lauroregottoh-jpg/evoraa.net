import { MemberPage } from "@/components/layout/MemberPage"
import { EvaCompanion } from "@/components/evoraa/EvaCompanion"
import { Badge } from "@/components/ui/badge"
import { SettingsForm } from "@/components/settings/SettingsForm"
import { getMySettings } from "@/app/actions/settings"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { logoutAction } from "@/app/actions/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const [{ data, error }, usage] = await Promise.all([
    getMySettings(),
    getUsageSnapshot(),
  ])
  const isAlliance = Boolean(usage?.isPaid)

  return (
    <MemberPage>
      <div className="space-y-8 py-2 max-w-3xl mx-auto">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
          >
            Réglages & discrétion
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Préférences de votre compte
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Critères de recherche, pause intimité, et accès à votre compte.
          </p>
        </div>

        <EvaCompanion
          title="Vos critères, votre rythme"
          variant="reflection"
          message="Affinez qui peut vous être proposé. Si vous avez besoin de silence, activez la pause : votre profil est masqué sans perdre vos conversations."
        />

        {error || !data ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              {error || "Impossible de charger les réglages."}
            </p>
            <Link href="/login">
              <Button variant="outline" className="rounded-xl">
                Se connecter
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <SettingsForm initial={data} isAlliance={isAlliance} />
            <form action={logoutAction} className="pt-4 border-t border-border">
              <Button
                type="submit"
                variant="outline"
                className="rounded-xl text-destructive border-destructive/30"
              >
                Se déconnecter
              </Button>
            </form>
          </>
        )}
      </div>
    </MemberPage>
  )
}
