import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";

export default function CguPage() {
  return (
    <MainLayout maxWidth="3xl">
      <article className="prose prose-neutral dark:prose-invert max-w-none py-10 space-y-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Documents légaux</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground !mb-2">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="text-sm text-muted-foreground !mt-0">
          Dernière mise à jour : 23 juillet 2026 — Plateforme KELIA
        </p>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">1. Objet</h2>
          <p>
            KELIA est une plateforme de rencontres destinée aux célibataires chrétiens souhaitant
            construire une relation fondée sur la dignité, la compatibilité et le respect. Les présentes
            CGU régissent l&apos;accès et l&apos;usage du service.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">2. Inscription &amp; éligibilité</h2>
          <p>
            L&apos;utilisateur doit être majeur, célibataire (ou libre de s&apos;engager), et fournir des
            informations sincères. La signature de la Charte de bienveillance est un prérequis.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">3. Comportement attendu</h2>
          <p>
            Sont interdits : le harcèlement, les propos déplacés, les sollicitations financières, les
            profils faux ou usurpés, et toute pression pour quitter la plateforme de façon précipitée.
            KELIA peut suspendre un compte sans préavis en cas de manquement.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">4. Abonnements &amp; paiements</h2>
          <p>
            Certains services (messages étendus, options) sont payants. Les paiements sont traités via
            des prestataires tiers (ex. CinetPay). Les tarifs sont affichés avant validation.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">5. Contenu &amp; modération</h2>
          <p>
            Les photos et textes peuvent être modérés. L&apos;utilisateur conserve ses droits sur ses
            contenus et concède à KELIA une licence d&apos;affichage limitée au fonctionnement du service.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">6. Limitation de responsabilité</h2>
          <p>
            KELIA facilite la mise en relation mais n&apos;est pas responsable des interactions hors
            plateforme ni du succès d&apos;une relation. Le service est fourni « en l&apos;état ».
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">7. Contact</h2>
          <p>
            Pour toute question :{" "}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              page Contact
            </Link>
            . Voir aussi la{" "}
            <Link href="/confidentialite" className="text-primary underline underline-offset-2">
              Politique de confidentialité
            </Link>
            .
          </p>
        </section>
      </article>
    </MainLayout>
  );
}
