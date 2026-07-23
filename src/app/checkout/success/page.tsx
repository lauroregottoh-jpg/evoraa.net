import Link from "next/link";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { getPendingPayment, getMySubscriptionSummary } from "@/app/actions/billing";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment: paymentId } = await searchParams;
  const summary = await getMySubscriptionSummary();
  const pending = paymentId ? await getPendingPayment(paymentId) : null;

  const planName =
    summary.subscription?.plan.name ||
    pending?.payment?.planName ||
    "Premium";

  return (
    <CinematicLayout showFooter={false}>
      <div className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground">Abonnement activé</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Votre offre <strong>{planName}</strong> est active pour 30 jours.
          Les limites Premium s&apos;appliquent immédiatement à la messagerie et aux suggestions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/compatibility"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            Voir mes compatibilités
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
