import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

export default function PastoralEndorsementPage() {
  return (
    <MainLayout maxWidth="3xl">
      <div className="py-12 space-y-4">
        <h1 className="font-serif text-3xl font-bold">Endorsement pastoral</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La validation pastorale sera bientôt disponible pour renforcer la confiance
          sur KELIAA. En attendant, complétez votre profil et vos questionnaires.
        </p>
        <Link href="/assessments" className="text-accent underline text-sm">
          Aller aux questionnaires
        </Link>
      </div>
    </MainLayout>
  );
}
