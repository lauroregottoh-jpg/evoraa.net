import { redirect } from "next/navigation";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { isPaidPlan } from "@/lib/billing/plans";
import { startCheckoutAction } from "@/app/actions/billing";
import Link from "next/link";

export default async function CheckoutPlanPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan } = await params;
  if (!isPaidPlan(plan)) {
    redirect("/pricing");
  }

  const result = await startCheckoutAction(plan);
  if (result.checkoutPath) {
    redirect(result.checkoutPath);
  }

  return (
    <CinematicLayout showFooter={false}>
      <div className="pt-32 pb-20 px-6 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold">Checkout indisponible</h1>
        <p className="text-sm text-muted-foreground">{result.error}</p>
        <Link href="/pricing" className="text-accent underline text-sm">
          Retour aux offres
        </Link>
      </div>
    </CinematicLayout>
  );
}
