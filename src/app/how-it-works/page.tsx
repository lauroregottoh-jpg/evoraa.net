"use client";

import * as React from "react";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { ExpertiseEncart } from "@/components/marketing/ExpertiseEncart";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  UserCheck,
  BookOpen,
  Award,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const steps = [
    {
      step: "01",
      title: "Créez votre compte",
      subtitle: "L'entrée dans la communauté",
      desc: "La création d'un compte ne prend que quelques minutes. Vous renseignez vos informations essentielles, confirmez votre adresse e-mail et acceptez la Charte de Respect et de Bienveillance de KELIA. Cette charte constitue le socle de notre communauté. Elle rappelle les comportements attendus et contribue à créer un environnement respectueux pour tous.",
      highlights: ["Inscription rapide en quelques minutes", "Confirmation par e-mail", "Acceptation de la Charte de Respect"],
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    },
    {
      step: "02",
      title: "Construisez un profil qui vous ressemble",
      subtitle: "Bien plus qu'une simple présentation",
      desc: "Votre profil est conçu pour permettre aux autres membres de mieux comprendre qui vous êtes. Vous pourrez notamment partager votre présentation, votre parcours de foi, votre situation personnelle, votre vision du mariage, vos centres d'intérêt, vos passions, vos projets de vie et vos attentes relationnelles. Vous choisissez les informations que vous souhaitez rendre visibles afin de préserver votre confidentialité.",
      highlights: ["Partage de votre parcours de foi", "Vision du mariage et projets", "Contrôle de votre confidentialité"],
      icon: <BookOpen className="h-6 w-6 text-accent" />,
    },
    {
      step: "03",
      title: "Répondez aux questionnaires",
      subtitle: "Une compatibilité évaluée en profondeur",
      desc: "Chez KELIA, nous pensons qu'une compatibilité ne peut pas être évaluée uniquement à partir d'une photo ou de quelques critères. C'est pourquoi nous vous invitons à compléter plusieurs questionnaires spécialement conçus pour mieux comprendre votre manière de fonctionner. Ils explorent notamment votre personnalité, votre façon de communiquer, votre manière de gérer les désaccords, vos valeurs, votre vision du couple et du mariage, votre maturité relationnelle, vos projets de vie et votre pratique de la foi.",
      highlights: ["Personnalité et communication", "Valeurs, couple et mariage", "Maturité relationnelle et foi"],
      icon: <Sparkles className="h-6 w-6 text-primary" />,
    },
    {
      step: "04",
      title: "Découvrez vos compatibilités",
      subtitle: "Des recommandations cohérentes",
      desc: "Une fois votre profil complété, KELIA vous propose progressivement des personnes qui présentent des compatibilités avec votre profil. Nos recommandations ne reposent pas uniquement sur des critères visibles. Elles prennent en compte l'ensemble des informations que vous avez choisies de partager afin de favoriser des rencontres plus cohérentes. Pour chaque profil recommandé, vous pourrez découvrir les principaux points de compatibilité qui vous rapprochent.",
      highlights: ["Recommandations progressives", "Au-delà des critères visibles", "Points de compatibilité détaillés"],
      icon: <Heart className="h-6 w-6 text-accent" />,
    },
    {
      step: "05",
      title: "Faites connaissance",
      subtitle: "Des échanges respectueux et authentiques",
      desc: "Lorsqu'une personne retient votre attention, vous pouvez commencer à échanger. Les conversations se déroulent dans un environnement conçu pour favoriser des échanges respectueux et authentiques. Notre objectif est de permettre à chacun de prendre le temps de découvrir l'autre, sans pression et dans un climat de confiance.",
      highlights: ["Environnement sécurisé", "Échanges sans pression", "Climat de confiance"],
      icon: <UserCheck className="h-6 w-6 text-primary" />,
    },
  ];

  const faqs = [
    {
      q: "Dois-je remplir tous les questionnaires dès le premier jour ?",
      a: "Non. Vous pouvez compléter votre profil progressivement. Toutefois, un profil plus complet permet d'obtenir des recommandations plus pertinentes.",
    },
    {
      q: "Puis-je modifier mes réponses plus tard ?",
      a: "Oui. Votre parcours évolue, votre profil aussi. Vous pouvez mettre à jour vos informations lorsque vous le souhaitez.",
    },
    {
      q: "Les autres membres voient-ils toutes mes réponses ?",
      a: "Non. Certaines informations servent uniquement à améliorer les recommandations et ne sont jamais affichées publiquement.",
    },
    {
      q: "Pourquoi KELIA demande-t-elle autant d'informations ?",
      a: "Parce qu'une relation appelée à durer mérite d'être construite sur une connaissance plus profonde qu'une simple photo ou quelques centres d'intérêt. Notre objectif est de vous proposer des rencontres de qualité, fondées sur une meilleure compréhension de chaque personne.",
    },
    {
      q: "Puis-je quitter KELIA à tout moment ?",
      a: "Oui. Vous pouvez suspendre ou supprimer votre compte lorsque vous le souhaitez, conformément à notre politique de confidentialité.",
    },
  ];

  return (
    <CinematicLayout>
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto text-center space-y-6">
        <span className="inline-block text-xs font-sans uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary text-primary font-semibold border border-border">
          Le Parcours KELIA
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Comment fonctionne <br />
          <span className="italic font-normal text-primary">KELIA ?</span>
        </h1>
        <p className="font-sans text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
          Trouver LA bonne personne commence par une meilleure compréhension de soi. Chez KELIA, nous croyons qu&apos;une rencontre qui peut conduire à un mariage mérite davantage qu&apos;un simple &quot;match&quot;.
        </p>
        <p className="font-sans text-sm text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
          C&apos;est pourquoi nous avons conçu une expérience qui place la foi, les valeurs, la personnalité et le projet de vie au cœur de chaque étape. Notre objectif n&apos;est pas de multiplier les rencontres, mais de vous aider à rencontrer LA personne avec laquelle vous pourrez construire une relation durable.
        </p>
      </section>

      <ExpertiseEncart
        className="max-w-7xl mx-auto mb-8"
        eyebrow="Parcours"
        title="Cinq étapes. Un seul objectif : une alliance digne."
        body="Du compte à la conversation, chaque étape renforce le discernement : profil, questionnaires, compatibilités, puis échanges respectueux."
        imageSrc="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1600&auto=format&fit=crop"
        imageAlt="Moment de partage spirituel"
      />

      {/* UNE EXPÉRIENCE PENSÉE POUR LES CÉLIBATAIRES CHRÉTIENS */}
      <section className="py-8 px-6 sm:px-12 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-lg bg-secondary/40 border border-border space-y-3">
          <h3 className="font-serif text-2xl font-bold text-foreground">Une expérience pensée pour les chrétiens</h3>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Que vous soyez inscrit depuis quelques minutes ou depuis plusieurs semaines, votre parcours suit une progression naturelle vers une meilleure connaissance de vous-même et des autres.
          </p>
        </div>
      </section>

      {/* 5 ÉTAPES DU PARCOURS */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-16">
        <div className="space-y-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-12 rounded-lg bg-white border border-border shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-5xl font-bold text-muted-foreground/30">{item.step}</span>
                  <div className="p-3 rounded-xl bg-secondary border border-border">
                    {item.icon}
                  </div>
                </div>
                <span className="inline-block text-xs font-sans uppercase tracking-widest text-primary font-semibold pt-2">
                  {item.subtitle}
                </span>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {item.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION EVA — ACCOMPAGNEMENT */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="p-10 sm:p-16 rounded-xl bg-primary text-primary-foreground border border-primary/20 shadow-elevated space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-sans font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> EVA vous accompagne
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">
              Un accompagnement tout au long de votre parcours
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base leading-relaxed">
              Tout au long de votre parcours, EVA est présente pour vous accompagner. EVA n&apos;a pas vocation à prendre des décisions à votre place. Son rôle est de vous accompagner et de vous apporter un regard complémentaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                title: "Comprendre vos compatibilités",
                desc: "EVA peut vous aider à mieux comprendre certaines compatibilités et à interpréter vos résultats.",
              },
              {
                title: "Informations et conseils",
                desc: "Retrouvez facilement des informations importantes et recevez des conseils adaptés à votre parcours.",
              },
              {
                title: "Questions et assistance",
                desc: "EVA répond à vos questions sur l'utilisation de la plateforme et vous propose des suggestions personnalisées.",
              },
            ].map((box, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-white/10 border border-white/10 space-y-3">
                <h4 className="font-sans font-semibold text-base text-accent">{box.title}</h4>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIANCE, SÉCURITÉ ET CONFIDENTIALITÉ */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">
            Confiance et sécurité
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Une plateforme pensée pour inspirer confiance
          </h2>
          <p className="text-muted-foreground text-base">
            Nous savons que la confiance est essentielle lorsqu&apos;il s&apos;agit de faire des rencontres. Notre ambition est que chacun puisse évoluer dans un environnement où il se sent respecté et en sécurité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Vérification des profils",
              desc: "Vérification progressive des profils, contrôle des photos publiées et détection des comportements inappropriés pour protéger la communauté.",
              icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            },
            {
              title: "Modération et signalement",
              desc: "Outils de signalement confidentiels et modération humaine lorsque cela est nécessaire, pour garantir un environnement respectueux.",
              icon: <Award className="h-6 w-6 text-accent" />,
            },
            {
              title: "Votre confidentialité entre vos mains",
              desc: "Vous gardez le contrôle sur vos informations. Vous choisissez les éléments que vous souhaitez partager et ceux que vous préférez conserver privés. Certaines informations sensibles ne sont jamais affichées publiquement.",
              icon: <Lock className="h-6 w-6 text-primary" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-lg bg-white border border-border shadow-card space-y-5 flex flex-col justify-between"
            >
              <div className="p-3.5 rounded-xl bg-secondary w-fit">{item.icon}</div>
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-lg text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UNE EXPÉRIENCE QUI ÉVOLUE AVEC VOUS */}
      <section className="py-12 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="p-10 rounded-lg bg-secondary/40 border border-border space-y-4 text-center">
          <h3 className="font-serif text-2xl font-bold text-foreground">Une expérience qui évolue avec vous</h3>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Votre profil n&apos;est jamais figé. Au fil du temps, vous pourrez le compléter, le mettre à jour et enrichir les informations que vous souhaitez partager. Cette évolution permet à KELIA d&apos;améliorer progressivement la pertinence de vos recommandations.
          </p>
        </div>
      </section>

      {/* FAQ FONCTIONNEMENT */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-lg bg-white border border-border overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-sans font-semibold text-base sm:text-lg text-foreground hover:text-primary transition-colors select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-primary shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4 animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 sm:px-12 text-center max-w-3xl mx-auto space-y-8">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Prêt à commencer votre parcours ?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Chaque belle histoire commence par une première étape. Et si aujourd&apos;hui était celle qui vous rapprochait de LA personne que vous recherchez ?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer gratuitement mon compte</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="/pricing" variant="outline" size="lg">
            <span>Découvrir nos offres</span>
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
