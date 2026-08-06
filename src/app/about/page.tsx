import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
import { ExpertiseEncart } from "@/components/marketing/ExpertiseEncart";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function AboutPage() {
  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Notre histoire"
        title="KELIAA n'est pas née d'une idée marketing."
        highlight="Elle est née d'une fatigue."
        subtitle="Celle des célibataires chrétiens qui veulent se marier — et qui n'en peuvent plus des apps où l'on se vend avant de se connaître."
        imageSrc="/home/compare-couple.png"
        imageClassName="object-[center_35%] sm:object-center"
        imageAlt="Cheminer ensemble"
      />

      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          Après des années à accompagner des personnes qui aspirent à un mariage solide, un
          constat revient sans cesse : le problème n&apos;est pas le manque de désir. C&apos;est le
          manque de cadre. Trop d&apos;outils poussent la vitesse, l&apos;image et l&apos;ambiguïté.
        </p>
        <p>
          Nous avons construit KELIAA pour inverser la logique. D&apos;abord la vision. Ensuite la
          compatibilité. Puis le dialogue — dans un espace où le respect n&apos;est pas une option
          décorative, mais une règle du jeu.
        </p>
      </section>

      <ExpertiseEncart
        className="max-w-7xl mx-auto mb-16"
        eyebrow="Méthode"
        title="Discernement avant attraction."
        body="Questionnaires, charte de bienveillance, vérification et modération humaine : chaque étape renforce la confiance avant d'ouvrir un dialogue."
        imageSrc="/home/story-community.png"
        imageAlt="Moment de partage"
      />

      <div className="max-w-3xl mx-auto px-6 pb-24 text-center space-y-6">
        <MagneticButton href="/register" variant="primary" size="lg">
          Créer mon compte
        </MagneticButton>
        <MagneticButton href="/how-it-works" variant="outline" size="lg">
          Voir le fonctionnement
        </MagneticButton>
      </div>
    </CinematicLayout>
  );
}
