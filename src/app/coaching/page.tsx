import { MemberPage } from "@/components/layout/MemberPage"
import { CoachingCheckoutPanel } from "@/components/coaching/CoachingCheckoutPanel"
import { CoachingWhyGrid } from "@/components/coaching/CoachingWhyGrid"
import { getCheckoutHints } from "@/app/actions/billing"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CoachingPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; moduleTitle?: string; cancel?: string }>
}) {
  const sp = await searchParams
  const [hints, supabase] = await Promise.all([getCheckoutHints(), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialFirstName = ""
  let initialLastName = ""
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle()
    initialFirstName = profile?.first_name ?? ""
    initialLastName = profile?.last_name ?? ""
  }

  return (
    <MemberPage>
      <div className="max-w-3xl mx-auto space-y-8 pb-10">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Coaching humain
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Coaching : 30 minutes ou 1 heure
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Accompagnement payant (hors Alliance) pour répondre à vos questions
            précises. Remplissez le brief, choisissez la formule, puis payez —
            sur une seule page.
          </p>
          {sp.moduleTitle ? (
            <p className="text-xs rounded-xl border border-border bg-secondary/40 px-3 py-2">
              Thème Académie : <strong>{sp.moduleTitle}</strong>
            </p>
          ) : null}
          {sp.cancel === "1" ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Paiement annulé. Vous pouvez reprendre ci-dessous — votre brief
              reste à remplir.
            </p>
          ) : null}
        </header>

        <CoachingWhyGrid />

        <CoachingCheckoutPanel
          suggestedMode={hints?.suggestedMode ?? "mobile_money"}
          moduleId={sp.module}
          moduleTitle={sp.moduleTitle}
          initialFirstName={initialFirstName}
          initialLastName={initialLastName}
        />

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/academie-mariage" className="text-primary underline font-semibold">
            Retour Académie
          </Link>
        </p>
      </div>
    </MemberPage>
  )
}
