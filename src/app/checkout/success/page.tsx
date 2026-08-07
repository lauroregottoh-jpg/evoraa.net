import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { getPendingPayment, getMySubscriptionSummary } from "@/app/actions/billing"
import { CheckCircle2, Clock } from "lucide-react"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; renew?: string }>
}) {
  const { payment: paymentId, renew } = await searchParams
  const summary = await getMySubscriptionSummary()
  const pending = paymentId ? await getPendingPayment(paymentId) : null

  const active = Boolean(summary.subscription)
  const planName =
    summary.subscription?.plan.name ||
    pending?.payment?.planName ||
    "Alliance"

  const paymentStatus = pending?.payment?.status as string | undefined
  const waitingWebhook =
    !active &&
    (paymentStatus === "pending" || paymentStatus === "processing" || !paymentId)

  const isRenewal =
    renew === "1" ||
    renew === "true" ||
    Boolean(
      (pending?.payment?.metadata as { is_renewal?: boolean } | null | undefined)
        ?.is_renewal
    )

  /** Toujours le cinéma Alliance — premier accès ou renouvellement. */
  const primaryHref = active
    ? isRenewal
      ? "/alliance/bienvenue?mode=renew"
      : "/alliance/bienvenue"
    : "/billing"
  const primaryLabel = active
    ? isRenewal
      ? "Voir mon renouvellement"
      : "Entrer dans Alliance"
    : "Vérifier mon offre"

  return (
    <MemberPage>
      <div className="py-10 max-w-lg mx-auto text-center space-y-6">
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            active ? "bg-accent/20" : "bg-amber-500/15"
          }`}
        >
          {active ? (
            <CheckCircle2 className="h-8 w-8 text-accent" />
          ) : (
            <Clock className="h-8 w-8 text-amber-600" />
          )}
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground">
          {active
            ? isRenewal
              ? "Alliance renouvelée"
              : "Bienvenue dans Alliance"
            : "Paiement reçu — activation en cours"}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {active ? (
            <>
              Votre offre <strong>{planName}</strong> est active.
              {isRenewal
                ? " Une célébration de renouvellement vous attend."
                : " Une expérience guidée vous attend — vous avez payé, voici Alliance."}
            </>
          ) : (
            <>
              Nous confirmons le paiement de <strong>{planName}</strong>
              {waitingWebhook
                ? ". L’activation peut prendre quelques secondes. Rechargez cette page."
                : "."}
            </>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            {primaryLabel}
          </Link>
          {active ? (
            <Link
              href="/alliance/parcours"
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-border text-sm font-semibold"
            >
              Voir mon parcours
            </Link>
          ) : (
            <Link
              href="/premium"
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-border text-sm font-semibold"
            >
              Alliance
            </Link>
          )}
        </div>
      </div>
    </MemberPage>
  )
}
