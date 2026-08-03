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
          Dernière mise à jour : 24 juillet 2026 — Plateforme KELLIA
        </p>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles collectées via KELLIA est
            l&apos;éditeur de la plateforme. Pour exercer vos droits ou poser une question :{" "}
            <a href="mailto:contact@KELLIA.net" className="text-primary underline underline-offset-2">
              contact@KELLIA.net
            </a>{" "}
            ou via la{" "}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              page Contact
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">2. Données collectées</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identifiants de compte (email ; mot de passe géré/hashé par le prestataire d&apos;authentification)</li>
            <li>Profil (prénom, nom, ville, adresse le cas échéant, biographie, préférences, photos)</li>
            <li>Réponses aux questionnaires de compatibilité et scores associés</li>
            <li>Messages échangés sur la plateforme</li>
            <li>Données de paiement (références transactionnelles ; pas de numéro de carte stocké Chez Kellia)</li>
            <li>Signalements, logs techniques et données de sécurité</li>
            <li>Données de navigation (cookies / équivalents, selon configuration)</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">3. Finalités du traitement</h2>
          <p>
            Fournir le service de rencontre et de matching ; assurer la sécurité et la modération ;
            gérer les abonnements et la facturation ; améliorer l&apos;expérience et les
            recommandations ; répondre aux demandes d&apos;assistance ; respecter les obligations
            légales.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">4. Bases légales</h2>
          <p>
            Exécution du contrat (CGU et fourniture du service) ; intérêt légitime (sécurité,
            prévention des abus, amélioration du service) ; consentement lorsque requis (par ex.
            cookies non essentiels ou communications marketing, le cas échéant) ; obligations légales.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">5. Destinataires et sous-traitants</h2>
          <p>
            Hébergement et base de données (ex. Supabase), paiements (Bictorys ou CinetPay), emails
            transactionnels (ex. Resend), outils d&apos;analyse éventuels, et équipes internes
            (support, coachs/conseillers, modération). Aucune vente de données personnelles à des
            tiers à des fins publicitaires.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">6. Transferts hors UE</h2>
          <p>
            Certains sous-traitants peuvent être situés hors de l&apos;Espace économique européen. Dans
            ce cas, des garanties appropriées (clauses contractuelles types ou mécanismes équivalents)
            sont mises en œuvre lorsque la réglementation l&apos;exige.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">7. Durée de conservation</h2>
          <p>
            Compte actif : durée de la relation contractuelle. Après suppression du compte :
            effacement ou anonymisation sous un délai raisonnable, sous réserve des obligations de
            conservation (comptabilité, litiges, sécurité). Les logs de sécurité peuvent être
            conservés plus longtemps pour la prévention des abus.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">8. Vos droits</h2>
          <p>
            Conformément à la réglementation applicable (dont le RGPD le cas échéant), vous disposez
            des droits d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition
            et de portabilité, ainsi que du droit de retirer votre consentement. Vous pouvez aussi
            introduire une réclamation auprès de l&apos;autorité de contrôle compétente. Exercez vos
            droits via Contact ou depuis{" "}
            <Link href="/settings" className="text-primary underline underline-offset-2">
              Paramètres
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">9. Sécurité</h2>
          <p>
            Mesures techniques et organisationnelles : HTTPS, contrôle d&apos;accès, politiques RLS
            côté base de données, procédures de signalement. Aucune mesure n&apos;est absolue :
            signalez tout incident suspect à ethique@KELLIA.net.
          </p>
        </section>

        <section className="space-y-3 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">10. Mineurs</h2>
          <p>
            Le service n&apos;est pas destiné aux mineurs. Tout compte suspecté d&apos;appartenir à un
            mineur pourra être suspendu.
          </p>
        </section>

        <p className="text-sm">
          Voir aussi les{" "}
          <Link href="/cgu" className="text-primary underline underline-offset-2">
            CGU
          </Link>{" "}
          et{" "}
          <Link href="/charte" className="text-primary underline underline-offset-2">
            Notre charte
          </Link>
          .
        </p>
      </article>
    </MainLayout>
  );
}
