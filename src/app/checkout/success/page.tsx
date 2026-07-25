import Link from "next/link";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { getPendingPayment, getMySubscriptionSummary } from "@/app/actions/billing";
import { CheckCircle2, Clock } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment: paymentId } = await searchParams;
  const summary = await getMySubscriptionSummary();
  const pending = paymentId ? await getPendingPayment(paymentId) : null;

  const active = Boolean(summary.subscription);
  const planName =
    summary.subscription?.plan.name ||
    pending?.payment?.planName ||
    "Alliance";

  const paymentStatus = pending?.payment?.status as string | undefined;
  const waitingWebhook =
    !active && (paymentStatus === "pending" || paymentStatus === "processing" || !paymentId);

  return (
    <CinematicLayout showFooter={false}>
      <div className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center space-y-6">
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            active ? "bg-emerald-500/15" : "bg-amber-500/15"
          }`}
        >
          {active ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          ) : (
            <Clock className="h-8 w-8 text-amber-600" />
          )}
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground">
          {active ? "Abonnement activé" : "Paiement reçu — activation en cours"}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {active ? (
            <>
              Votre offre <strong>{planName}</strong> est active pour 30 jours. Les quotas
              Alliance s&apos;appliquent à la messagerie et aux suggestions.
            </>
          ) : (
            <>
              Nous confirmons le paiement de <strong>{planName}</strong>
              {waitingWebhook
                ? ". L’activation peut prendre quelques secondes (notification Mobile Money). Rechargez cette page ou ouvrez Alliance."
                : "."}
            </>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={active ? "/compatibility" : "/billing"}
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            {active ? "Voir mes compatibilités" : "Vérifier mon offre"}
          </Link>
          <Link
            href="/messages"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-border text-sm font-semibold"
          >
            Messagerie
          </Link>
        </div>
      </div>
    </CinematicLayout>
  );
}
