import { MainLayout } from "@/components/layout/MainLayout"
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/server"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const needsCharter = user?.user_metadata?.charter_accepted !== true

  return (
    <MainLayout maxWidth="2xl" showFooter={false}>
      <div className="space-y-8 py-6 sm:py-10">
        <div className="space-y-3 max-w-xl">
          <Badge
            variant="outline"
            className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
          >
            Bienvenue
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground leading-tight">
            Complétez votre profil, pas à pas
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Charte, puis l’essentiel (nom, prénom, sexe, pays). Le reste vient
            ensuite — EVA guide la suite.
          </p>
        </div>

        <OnboardingWizard needsCharter={needsCharter} />
      </div>
    </MainLayout>
  )
}
