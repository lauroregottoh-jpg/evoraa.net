import Link from "next/link";
import { redirect } from "next/navigation";
import { MemberPage } from "@/components/layout/MemberPage";
import { isPaidPlan } from "@/lib/billing/plans";
import { startCheckoutAction } from "@/app/actions/billing";

export default async function CheckoutPlanPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan } = await params;
  if (!isPaidPlan(plan)) {
    redirect("/billing");
  }

  const result = await startCheckoutAction(plan);
  if (result.checkoutPath) {
    redirect(result.checkoutPath);
  }

  return (
    <MemberPage>
      <div className="py-10 text-center space-y-4 max-w-lg mx-auto">
        <h1 className="font-serif text-3xl font-bold">Checkout indisponible</h1>
        <p className="text-sm text-muted-foreground">{result.error}</p>
        <Link href="/billing" className="text-accent underline text-sm">
          Retour à Alliance
        </Link>
      </div>
    </MemberPage>
  );
}
