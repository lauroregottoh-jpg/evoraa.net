import Link from "next/link";
import { MemberPage } from "@/components/layout/MemberPage";

export default async function CheckoutCancelPage() {
  return (
    <MemberPage>
      <div className="py-10 max-w-lg mx-auto text-center space-y-6">
        <h1 className="font-serif text-4xl font-bold text-foreground">Paiement annulé</h1>
        <p className="text-muted-foreground text-sm">
          Aucun débit n&apos;a été effectué. Vous pouvez reprendre quand vous le souhaitez.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/billing"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            Retour à Alliance
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-border text-sm font-semibold"
          >
            Accueil
          </Link>
        </div>
      </div>
    </MemberPage>
  );
}
