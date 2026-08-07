import Link from "next/link";
import { redirect } from "next/navigation";
import { MemberPage } from "@/components/layout/MemberPage";
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
      <MemberPage>
        <div className="py-10 text-center space-y-4 max-w-lg mx-auto">
          <h1 className="font-serif text-3xl font-bold">Paiement manquant</h1>
          <Link href="/billing" className="text-accent underline text-sm">
            Retour à Alliance
          </Link>
        </div>
      </MemberPage>
    );
  }

  const result = await getPendingPayment(paymentId);

  if (result.error || !result.payment) {
    return (
      <MemberPage>
        <div className="py-10 text-center space-y-4 max-w-lg mx-auto">
          <h1 className="font-serif text-3xl font-bold">Paiement introuvable</h1>
          <p className="text-sm text-muted-foreground">{result.error}</p>
          <Link href="/billing" className="text-accent underline text-sm">
            Retour à Alliance
          </Link>
        </div>
      </MemberPage>
    );
  }

  if (result.payment.status === "completed") {
    const renew =
      result.payment.metadata &&
      (result.payment.metadata as { is_renewal?: boolean }).is_renewal
        ? "&renew=1"
        : ""
    redirect(`/checkout/success?payment=${paymentId}${renew}`)
  }

  return (
    <MemberPage>
      <div className="py-6 max-w-lg mx-auto">
        <DemoPaymentPanel
          paymentId={result.payment.id}
          amount={result.payment.amount}
          currency={result.payment.currency}
          planName={result.payment.planName}
          transactionReference={result.payment.transactionReference}
          isRenewal={Boolean(
            (result.payment.metadata as { is_renewal?: boolean } | null)?.is_renewal
          )}
        />
      </div>
    </MemberPage>
  );
}
