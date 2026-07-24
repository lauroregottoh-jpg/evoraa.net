import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <MainLayout maxWidth="3xl">
      <article className="py-10 space-y-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Documents légaux</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Mentions légales
        </h1>
        <p className="text-sm text-muted-foreground">
          Brouillon opérationnel — à compléter avec les informations juridiques de l&apos;éditeur
          (raison sociale, SIREN, siège, hébergeur).
        </p>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Éditeur</h2>
          <p>
            Plateforme KELIAA — service de mise en relation pour célibataires chrétiens.
            <br />
            Raison sociale : <em>[À compléter]</em>
            <br />
            SIREN / RCS : <em>[À compléter]</em>
            <br />
            Siège social : <em>[À compléter]</em>
            <br />
            Contact :{" "}
            <a href="mailto:contact@keliaa.net" className="text-primary underline">
              contact@keliaa.net
            </a>
          </p>
        </section>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Hébergement</h2>
          <p>
            Application : Vercel Inc. — Base de données / auth : Supabase Inc.
            <br />
            Détails d&apos;hébergement : <em>[À compléter selon compte]</em>
          </p>
        </section>

        <section className="space-y-2 text-sm text-foreground/90 leading-relaxed">
          <h2 className="font-serif text-xl font-semibold">Propriété intellectuelle</h2>
          <p>
            Les contenus, marques et éléments graphiques de KELIAA sont protégés. Toute reproduction
            non autorisée est interdite.
          </p>
        </section>

        <p className="text-sm">
          Voir aussi{" "}
          <Link href="/cgu" className="text-primary underline underline-offset-2">
            CGU
          </Link>{" "}
          et{" "}
          <Link href="/confidentialite" className="text-primary underline underline-offset-2">
            Confidentialité
          </Link>
          .
        </p>
      </article>
    </MainLayout>
  );
}
