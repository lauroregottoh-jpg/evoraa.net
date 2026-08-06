import { MemberPage } from "@/components/layout/MemberPage"
import { CoachingCheckoutPanel } from "@/components/coaching/CoachingCheckoutPanel"
import { getCheckoutHints } from "@/app/actions/billing"
import { COACHING_SESSION_MINUTES } from "@/lib/billing/coachingOffers"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CoachingPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; moduleTitle?: string; cancel?: string }>
}) {
  const sp = await searchParams
  const hints = await getCheckoutHints()

  return (
    <MemberPage>
      <div className="max-w-2xl mx-auto space-y-6 pb-10">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Coaching humain
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Séances de {COACHING_SESSION_MINUTES} minutes
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Accompagnement payant (hors Alliance) : préparation au mariage, discernement,
            communication. Visio ou téléphone. Grille de 1 à 12 séances.
          </p>
          {sp.moduleTitle ? (
            <p className="text-xs rounded-xl border border-border bg-secondary/40 px-3 py-2">
              Thème Académie : <strong>{sp.moduleTitle}</strong>
            </p>
          ) : null}
          {sp.cancel === "1" ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Paiement annulé. Vous pouvez réessayer ci-dessous.
            </p>
          ) : null}
        </header>

        <CoachingCheckoutPanel
          suggestedMode={hints?.suggestedMode ?? "mobile_money"}
          moduleId={sp.module}
          moduleTitle={sp.moduleTitle}
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
