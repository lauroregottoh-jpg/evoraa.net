import Link from "next/link";
import { redirect } from "next/navigation";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { DemoPaymentPanel } from "@/components/billing/DemoPaymentPanel";
import { getPendingPayment } from "@/app/actions/billing";

export default async function CheckoutPayPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment: paymentId } = await searchParams;

  if (!paymentId) {
    return (
      <CinematicLayout showFooter={false}>
        <div className="pt-32 pb-20 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold">Paiement manquant</h1>
          <Link href="/pricing" className="text-accent underline text-sm">
            Retour aux offres
          </Link>
        </div>
      </CinematicLayout>
    );
  }

  const result = await getPendingPayment(paymentId);

  if (result.error || !result.payment) {
    return (
      <CinematicLayout showFooter={false}>
        <div className="pt-32 pb-20 px-6 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold">Paiement introuvable</h1>
          <p className="text-sm text-muted-foreground">{result.error}</p>
          <Link href="/pricing" className="text-accent underline text-sm">
            Retour aux offres
          </Link>
        </div>
      </CinematicLayout>
    );
  }

  if (result.payment.status === "completed") {
    redirect(`/checkout/success?payment=${paymentId}`);
  }

  return (
    <CinematicLayout showFooter={false}>
      <div className="pt-28 pb-20 px-6">
        <DemoPaymentPanel
          paymentId={result.payment.id}
          amount={result.payment.amount}
          currency={result.payment.currency}
          planName={result.payment.planName}
          transactionReference={result.payment.transactionReference}
        />
      </div>
    </CinematicLayout>
  );
}
