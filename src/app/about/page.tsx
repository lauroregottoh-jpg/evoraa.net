import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { ExpertiseEncart } from "@/components/marketing/ExpertiseEncart";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function AboutPage() {
  return (
    <CinematicLayout>
      <section className="pt-36 pb-16 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Notre mission
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground leading-tight">
          KELIA existe pour les alliances,{" "}
          <span className="italic font-normal text-primary">pas pour les swipes.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Nous aidons les célibataires chrétiens à discerner une compatibilité réelle —
          foi, vision du foyer, maturité relationnelle — dans un cadre digne et sécurisé.
        </p>
      </section>

      <ExpertiseEncart
        className="max-w-7xl mx-auto mb-16"
        eyebrow="Méthode"
        title="Discernement avant attraction."
        body="Questionnaires, charte de bienveillance et modération humaine : chaque étape renforce la confiance avant d’ouvrir un dialogue."
        imageSrc="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop"
        imageAlt="Couple marchant ensemble"
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
