import Link from "next/link"
import { Crown, Lock } from "lucide-react"
import { MemberPage } from "@/components/layout/MemberPage"

/** Mur d’accès — Rapport Personnalisé réservé Alliance. */
export function AllianceRapportGate({
  nextPath = "/rapport",
}: {
  nextPath?: string
}) {
  return (
    <MemberPage>
      <div className="max-w-lg mx-auto py-12 space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8954A]/15 text-[#B8954A]">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold">
          Rapport Personnalisé Alliance™
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Le rapport complet et le rapport en cours sont réservés aux membres
          Alliance. Ils se mettent à jour automatiquement à chaque évaluation
          réalisée.
        </p>
        <Link
          href={`/premium?next=${encodeURIComponent(nextPath)}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#B8954A] px-5 text-sm font-bold text-[#7F5557]"
        >
          <Crown className="h-4 w-4" />
          Rejoindre Alliance
        </Link>
        <p className="text-xs text-muted-foreground">
          <Link href="/assessments" className="underline">
            Continuer mes tests Découverte
          </Link>
        </p>
      </div>
    </MemberPage>
  )
}
