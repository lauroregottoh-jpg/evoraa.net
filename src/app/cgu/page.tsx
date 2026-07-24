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
          Dernière mise à jour : 24 juillet 2026 — Plateforme KELIAA
        </p>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">1. Objet et éditeur</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et
            l&apos;utilisation de la plateforme KELIAA, service de mise en relation destiné aux
            célibataires chrétiens souhaitant construire une relation fondée sur la foi, la dignité,
            la compatibilité et le respect. En créant un compte ou en utilisant le service, vous
            acceptez sans réserve les présentes CGU ainsi que la{" "}
            <Link href="/charte" className="text-primary underline underline-offset-2">
              Charte KELIAA
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">2. Inscription et éligibilité</h2>
          <p>
            L&apos;utilisateur doit être majeur selon la législation applicable, être libre de
            s&apos;engager (célibataire, veuf/veuve ou en situation équivalente), et fournir des
            informations exactes et à jour. Un seul compte par personne est autorisé. L&apos;acceptation
            de la Charte de bienveillance est un prérequis à l&apos;inscription.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">3. Description du service</h2>
          <p>
            KELIAA propose notamment : création de profil, questionnaires de compatibilité,
            suggestions de profils, messagerie, outils d&apos;accompagnement (dont l&apos;assistant
            EVA), et offres d&apos;abonnement. Le service vise le discernement et le projet de
            mariage ; il ne constitue ni un cabinet de conseil spirituel institutionnel, ni un conseil juridique ou médical.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">4. Comportement attendu</h2>
          <p>
            Sont notamment interdits : le harcèlement, les propos déplacés ou discriminatoires, les
            sollicitations financières, les profils faux ou usurpés, le partage de contenus illicites,
            et toute pression inappropriée. KELIAA peut suspendre ou résilier un compte sans préavis
            en cas de manquement, sans remboursement au prorata sauf obligation légale contraire.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">5. Abonnements et paiements</h2>
          <p>
            Certaines fonctionnalités sont payantes. Les tarifs sont affichés avant validation. Les
            paiements sont traités par des prestataires tiers (ex. CinetPay). Sauf mention contraire,
            les périodes d&apos;abonnement ne sont pas renouvelées automatiquement. Les réclamations
            relatives au paiement doivent être adressées via la page Contact dans un délai raisonnable.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">6. Contenu et propriété intellectuelle</h2>
          <p>
            Les photos, textes et autres contenus publiés par l&apos;utilisateur restent sa propriété.
            L&apos;utilisateur concède à KELIAA une licence non exclusive, mondiale et gratuite
            d&apos;affichage, reproduction et adaptation technique strictement nécessaire au
            fonctionnement du service. Les éléments de la plateforme (marque KELIAA, design, logiciels)
            sont protégés et ne peuvent être reproduits sans autorisation.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">7. Modération</h2>
          <p>
            KELIAA se réserve le droit de modérer profils, photos et messages, et de retirer tout
            contenu contraire aux CGU ou à la Charte. Les signalements sont traités confidentiellement
            dans la mesure du possible.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">8. Limitation de responsabilité</h2>
          <p>
            KELIAA facilite la mise en relation mais n&apos;est pas responsable des interactions hors
            plateforme, ni du succès d&apos;une relation, ni des décisions prises par les utilisateurs.
            Le service est fourni « en l&apos;état ». Dans les limites autorisées par la loi, la
            responsabilité de KELIAA est limitée aux dommages directs et prévisibles.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">9. Résiliation</h2>
          <p>
            L&apos;utilisateur peut supprimer son compte à tout moment depuis les paramètres ou via
            Contact. KELIAA peut résilier l&apos;accès en cas de violation des présentes CGU.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">10. Droit applicable</h2>
          <p>
            Les présentes CGU sont régies par le droit applicable au siège de l&apos;éditeur, sous
            réserve des dispositions impératives de protection du consommateur.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">11. Contact</h2>
          <p>
            Questions :{" "}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              page Contact
            </Link>
            . Voir aussi la{" "}
            <Link href="/confidentialite" className="text-primary underline underline-offset-2">
              Politique de confidentialité
            </Link>{" "}
            et{" "}
            <Link href="/charte" className="text-primary underline underline-offset-2">
              Notre charte
            </Link>
            .
          </p>
        </section>
      </article>
    </MainLayout>
  );
}
