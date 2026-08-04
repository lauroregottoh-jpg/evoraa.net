import { MemberPage } from "@/components/layout/MemberPage"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"
import { createClient } from "@/utils/supabase/server"

export default async function FeedbackPage() {
  const supabase = await createClient()
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
      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Avis & améliorations
          </p>
          <h1 className="font-serif text-3xl font-bold">Votre voix compte</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bugs d’inscription, plaintes, idées pour l’onboarding, les tests ou
            le matching — écrivez-nous. Chaque retour alimente directement
            l’équipe (plaintes, suggestions, UX) pour améliorer Keliaa.
          </p>
        </div>
        <FeedbackForm
          defaultName={defaultName}
          defaultEmail={defaultEmail}
          defaultCategory="suggestion"
          pagePath="/feedback"
        />
      </div>
    </MemberPage>
  )
}
