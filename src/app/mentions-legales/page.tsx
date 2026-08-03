import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";

/**
 * Mentions légales — éditeur au Togo (pas de SIREN français).
 * Compléter raison sociale / RCCM / NIF dès qu’ils existent.
 */
export default function MentionsLegalesPage() {
  return (
    <MainLayout maxWidth="3xl">
      <article className="py-10 space-y-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Documents légaux</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Mentions légales
        </h1>
        <p className="text-sm text-muted-foreground">
          Plateforme opérée depuis le Togo. Les champs d’immatriculation locale (RCCM / NIF)
          seront mis à jour dès formalisation de la structure.
        </p>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Éditeur</h2>
          <p>
            <strong>KELIAA</strong> — service de mise en relation pour célibataires chrétiens.
            <br />
            Pays d’édition : <strong>Togo</strong>
            <br />
            Forme / raison sociale : en cours de formalisation (soft launch)
            <br />
            RCCM / NIF (Togo) : à communiquer dès obtention
            <br />
            Contact :{" "}
            <a href="mailto:contact@KELIAA.net" className="text-primary underline">
              contact@KELIAA.net
            </a>
          </p>
          <p className="text-muted-foreground text-xs">
            Aucun SIREN français : l’éditeur n’est pas une société immatriculée en France.
          </p>
        </section>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Directeur de la publication</h2>
          <p>
            Le fondateur / responsable de la publication est joignable à l’adresse de contact
            ci-dessus.
          </p>
        </section>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Hébergement</h2>
          <p>
            Application web : <strong>Vercel Inc.</strong> (États-Unis / edge mondial).
            <br />
            Base de données, authentification et stockage : <strong>Supabase Inc.</strong>
            <br />
            Paiements Mobile Money ou carte (lorsqu’activés) : prestataires de paiement sécurisés
            (Wave, Orange Money, Moov, TMoney selon pays — au Togo notamment Moov Money et TMoney).
          </p>
        </section>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Propriété intellectuelle</h2>
          <p>
            Les contenus, marques et éléments graphiques de KELIAA sont protégés. Toute
            reproduction non autorisée est interdite.
          </p>
        </section>

        <p className="text-sm">
          Voir aussi{" "}
          <Link href="/cgu" className="text-primary underline underline-offset-2">
            CGU
          </Link>
          ,{" "}
          <Link href="/confidentialite" className="text-primary underline underline-offset-2">
            Confidentialité
          </Link>{" "}
          et{" "}
          <Link href="/charte" className="text-primary underline underline-offset-2">
            Charte
          </Link>
          .
        </p>
      </article>
    </MainLayout>
  );
}
