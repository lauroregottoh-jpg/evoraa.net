import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <MainLayout maxWidth="3xl">
      <article className="prose prose-neutral dark:prose-invert max-w-none py-10 space-y-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Documents légaux</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground !mb-2">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-muted-foreground !mt-0">
          Dernière mise à jour : 23 juillet 2026 — Plateforme KELIA
        </p>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">1. Responsable du traitement</h2>
          <p>
            Les données personnelles collectées via KELIA sont traitées pour permettre l&apos;inscription,
            le matching, la messagerie, la facturation et la modération.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">2. Données collectées</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identifiants de compte (email, mot de passe hashé via le prestataire d&apos;auth)</li>
            <li>Profil (prénom, ville, témoignage, préférences, photos)</li>
            <li>Messages échangés sur la plateforme</li>
            <li>Données de paiement (références transactionnelles, pas de carte stockée chez KELIA)</li>
            <li>Signalements et logs de sécurité</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">3. Finalités</h2>
          <p>
            Fournir le service de rencontre, assurer la sécurité, améliorer le matching, gérer les
            abonnements, et répondre aux obligations légales.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">4. Base légale</h2>
          <p>
            Exécution du contrat (CGU), intérêt légitime (modération, prévention des abus), et
            consentement lorsque requis (ex. cookies non essentiels).
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">5. Destinataires &amp; sous-traitants</h2>
          <p>
            Hébergement et base de données (ex. Supabase), paiements (ex. CinetPay), emails
            transactionnels (ex. Resend), et équipes de modération internes.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">6. Durée de conservation</h2>
          <p>
            Compte actif : durée de la relation + délais légaux. Compte supprimé : effacement ou
            anonymisation sous un délai raisonnable, sauf obligations de conservation.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">7. Vos droits</h2>
          <p>
            Accès, rectification, effacement, opposition, portabilité — via{" "}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              Contact
            </Link>
            . Vous pouvez aussi ajuster vos préférences dans{" "}
            <Link href="/settings" className="text-primary underline underline-offset-2">
              Paramètres
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">8. Sécurité</h2>
          <p>
            Contrôle d&apos;accès, chiffrement en transit (HTTPS), politiques RLS, et signalements
            persistés pour la modération. Aucune sécurité n&apos;est absolue : signalez tout incident.
          </p>
        </section>

        <p className="text-sm">
          Voir aussi les{" "}
          <Link href="/cgu" className="text-primary underline underline-offset-2">
            Conditions Générales d&apos;Utilisation
          </Link>
          .
        </p>
      </article>
    </MainLayout>
  );
}
