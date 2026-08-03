import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

export default function ProfileVerificationPage() {
  return (
    <MainLayout maxWidth="3xl">
      <div className="py-12 space-y-4">
        <h1 className="font-serif text-3xl font-bold">Profil vérifié</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La vérification renforcée des profils arrive bientôt pour renforcer la confiance sur
          KELLIA. En attendant, complétez votre profil et vos questionnaires — c&apos;est déjà ce
          qui améliore le matching.
        </p>
        <Link href="/assessments" className="text-accent underline text-sm">
          Aller aux questionnaires
        </Link>
      </div>
    </MainLayout>
  );
}
