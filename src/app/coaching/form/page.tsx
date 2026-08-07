import { MemberPage } from "@/components/layout/MemberPage"
import { CoachingBriefForm } from "@/components/coaching/CoachingBriefForm"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CoachingFormPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const { payment } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialName = ""
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle()
    initialName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ")
  }

  if (!payment) {
    return (
      <MemberPage>
        <div className="max-w-lg mx-auto py-10 space-y-3 text-center">
          <h1 className="font-serif text-2xl font-bold">Formulaire coaching</h1>
          <p className="text-sm text-muted-foreground">
            Lien invalide. Repassez par la page coaching après paiement.
          </p>
          <Link href="/coaching" className="text-primary underline text-sm font-semibold">
            Voir les packs
          </Link>
        </div>
      </MemberPage>
    )
  }

  return (
    <MemberPage>
      <div className="max-w-lg mx-auto space-y-5 pb-10">
        <header className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Confirmation
          </p>
          <h1 className="font-serif text-3xl font-bold">Merci pour votre paiement</h1>
          <p className="text-sm text-muted-foreground">
            Votre brief a déjà été enregistré avec la commande. Si besoin, vous
            pouvez compléter ou vérifier les informations ci-dessous.
          </p>
        </header>
        <CoachingBriefForm paymentId={payment} initialName={initialName} />
      </div>
    </MemberPage>
  )
}
