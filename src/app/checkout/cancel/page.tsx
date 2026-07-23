import Link from "next/link";
import { CinematicLayout } from "@/components/layout/CinematicLayout";

export default async function CheckoutCancelPage() {
  return (
    <CinematicLayout showFooter={false}>
      <div className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center space-y-6">
        <h1 className="font-serif text-4xl font-bold text-foreground">Paiement annulé</h1>
        <p className="text-muted-foreground text-sm">
          Aucun débit n&apos;a été effectué. Vous pouvez reprendre quand vous le souhaitez.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Retour aux offres
        </Link>
      </div>
    </CinematicLayout>
  );
}
