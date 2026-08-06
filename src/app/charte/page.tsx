import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Heart, Shield, Eye, Handshake } from "lucide-react";

const PILLARS = [
  {
    icon: Heart,
    title: "Foi & projet de mariage",
    body: "Nous cherchons L'âme sœur pour bâtir une alliance, pas une distraction. La vision du foyer guide chaque étape.",
  },
  {
    icon: Eye,
    title: "Respect & pudeur",
    body: "Les échanges restent respectueux. Pas de vente par l'apparence seule : la personne avant la photo.",
  },
  {
    icon: Shield,
    title: "Sécurité & confidentialité",
    body: "Profils vérifiés, signalements pris au sérieux, données protégées. Votre vie privée est non négociable.",
  },
  {
    icon: Handshake,
    title: "Bienveillance communautaire",
    body: "Chaque membre s'engage à la sincérité, à l'écoute et au refus du harcèlement ou de la manipulation.",
  },
];

export default function ChartePage() {
  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Éthique"
        title="Notre charte"
        highlight="KELIAA"
        subtitle="Les piliers, valeurs et engagements qui fondent notre communauté de célibataires chrétiens."
        imageSrc="/home/hero-african-wedding.png"
        imageClassName="object-[center_32%] sm:object-center"
        imageAlt="Communauté en prière"
      />

      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Pourquoi une charte ?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            KELIAA n&apos;est pas une application de swipe. C&apos;est un espace de discernement. Cette
            charte rappelle ce que nous croyons, ce que nous exigeons, et ce à quoi chaque membre
            s&apos;engage en rejoignant la plateforme.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="p-8 rounded-2xl border border-border bg-white shadow-card space-y-4"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="encart-kelia p-8 sm:p-10 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-foreground">Engagements des membres</h3>
          <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            <li>Fournir des informations sincères et des photos récentes qui me représentent.</li>
            <li>Respecter chaque personne dans les messages et les intentions.</li>
            <li>Ne pas utiliser la plateforme pour du harcèlement, du spam ou des sollicitations financières.</li>
            <li>Honorer la confidentialité des échanges et des données des autres membres.</li>
            <li>Signaler tout comportement contraire à cette charte à contact@keliaa.org.</li>
          </ul>
        </div>

        <div className="text-center space-y-6">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            L&apos;acceptation de cette charte est requise à l&apos;inscription. KELIAA peut suspendre
            tout compte qui la viole.
          </p>
          <MagneticButton href="/register" variant="primary" size="lg">
            Rejoindre KELIAA
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
