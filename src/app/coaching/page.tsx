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
        <header className="relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-[#5C1F28] via-[#4A1820] to-[#3D2A14] px-5 py-8 sm:px-8 sm:py-10 text-[#F8F4EE] shadow-elevated">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(184,149,74,0.45), transparent 70%)",
            }}
          />
          <div className="relative space-y-3 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
              Coaching relationnel
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Une oreille formée pour débloquer un vrai point
            </h1>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
              Séances de 30 minutes ou 1 heure (hors Alliance). Remplissez votre
              brief, choisissez la formule, puis payez — trois étapes distinctes,
              une seule page.
            </p>
          </div>
        </header>

        {sp.moduleTitle ? (
          <p className="text-xs rounded-xl border border-border bg-secondary/40 px-3 py-2">
            Thème Académie : <strong>{sp.moduleTitle}</strong>
          </p>
        ) : null}
        {sp.cancel === "1" ? (
          <p className="text-sm text-amber-800 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            Paiement annulé. Vous pouvez reprendre ci-dessous — votre brief reste
            à remplir.
          </p>
        ) : null}

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
