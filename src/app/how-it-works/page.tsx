"use client";

import * as React from "react";
import Image from "next/image";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
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
  Flag,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const steps = [
    {
      step: "01",
      title: "Entrez dans une communauté qui partage vos valeurs.",
      desc: "Créer votre compte ne prend que quelques minutes. Vous rejoignez une communauté de célibataires chrétiens engagés dans une démarche sérieuse vers le mariage.",
      highlights: ["Inscription en quelques minutes", "Célibataires chrétiens engagés", "Démarche sérieuse vers le mariage"],
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop",
    },
    {
      step: "02",
      title: "Faites découvrir la personne que vous êtes réellement.",
      desc: "Au-delà d'une photo, racontez votre parcours de foi, votre vision du mariage, vos aspirations et ce qui est essentiel pour vous.",
      highlights: ["Parcours de foi", "Vision du mariage", "Ce qui est essentiel pour vous"],
      icon: <BookOpen className="h-6 w-6 text-accent" />,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
    },
    {
      step: "03",
      title: "Découvrez ce qui favorise une relation durable.",
      desc: "Nos questionnaires explorent votre manière de communiquer, votre personnalité, votre maturité relationnelle, votre pratique de la foi et votre vision du couple afin de proposer des compatibilités plus pertinentes.",
      highlights: ["Communication et personnalité", "Maturité relationnelle", "Pratique de la foi et vision du couple"],
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    },
    {
      step: "04",
      title: "Laissez notre système de matching faire le travail pour vous.",
      desc: "Vous recevez progressivement des profils dont les valeurs, les objectifs et le projet de vie sont proches des vôtres.",
      highlights: ["Profils proposés progressivement", "Valeurs et objectifs proches", "Projet de vie aligné"],
      icon: <Heart className="h-6 w-6 text-accent" />,
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop",
    },
    {
      step: "05",
      title: "Commencez une conversation qui a du sens.",
      desc: "Échangez dans un environnement pensé pour favoriser des discussions sincères, respectueuses et orientées vers une véritable construction.",
      highlights: ["Discussions sincères", "Cadre respectueux", "Construction relationnelle"],
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const faqs = [
    {
      q: "Dois-je compléter mon profil dès l'inscription ?",
      a: "Non. Vous pouvez avancer à votre rythme. Cependant, un profil plus complet améliore la qualité des recommandations.",
    },
    {
      q: "Comment les compatibilités sont-elles calculées ?",
      a: "Elles prennent en compte vos questionnaires, vos valeurs, votre vision du mariage, votre personnalité et les informations que vous choisissez de partager.",
    },
    {
      q: "Puis-je contrôler mes informations personnelles ?",
      a: "Oui. Vous décidez des informations visibles sur votre profil.",
    },
    {
      q: "Les profils sont-ils vérifiés ?",
      a: "Oui. Nous mettons progressivement en place des procédures de vérification afin de garantir un environnement de confiance.",
    },
  ];

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Parcours"
        title="Le parcours qui vous connecte à"
        highlight="votre âme sœur"
        subtitle="Ici, chaque étape est pensée pour vous aider à rencontrer LA personne compatible avec votre foi, vos valeurs et votre projet de mariage — sans hasard et sans perdre votre temps."
        imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=85&w=2000&auto=format&fit=crop"
        imageAlt="Communauté de personnes réunies dans un cadre chaleureux"
        imageClassName="object-center"
        overlayClassName="from-black/75 via-black/40 to-black/20"
      >
        <div className="space-y-5 pt-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <MagneticButton
              href="/register"
              variant="primary"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-elevated border-none"
            >
              <span className="flex items-center gap-2">
                Créer gratuitement mon profil
                <ArrowRight className="h-4 w-4" />
              </span>
            </MagneticButton>
            <MagneticButton
              href="/pricing"
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
            >
              Découvrir les offres
            </MagneticButton>
          </div>
          <p className="text-sm text-white/85 leading-relaxed drop-shadow-md">
            ✓ Compatibilité avant l&apos;apparence · ✓ Profils vérifiés · ✓ Respect de votre
            confidentialité
          </p>
        </div>
      </PageHero>

      {/* 5 ÉTAPES DU PARCOURS */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-16">
        <div className="space-y-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-12 rounded-lg bg-white border border-border shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-4 space-y-4">
                <div className="relative h-40 w-full rounded-xl overflow-hidden border border-border">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="320px" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-5xl font-bold text-muted-foreground/30">{item.step}</span>
                  <div className="p-3 rounded-xl bg-secondary border border-border">
                    {item.icon}
                  </div>
                </div>
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
              <Sparkles className="h-3.5 w-3.5" /> EVA
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold">
              Votre conseillère, tout au long de votre parcours
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base leading-relaxed">
              EVA est votre assistante intelligente. Elle vous aide à mieux comprendre vos résultats,
              répond à vos questions et vous accompagne dans l&apos;utilisation de la plateforme, sans
              jamais prendre de décisions à votre place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                title: "Comprendre vos compatibilités",
                desc: "Mieux interpréter vos résultats et les points qui vous rapprochent.",
              },
              {
                title: "Obtenir des conseils personnalisés",
                desc: "Des suggestions adaptées à votre parcours et à vos questions.",
              },
              {
                title: "Recevoir une assistance à tout moment",
                desc: "Une aide disponible pour naviguer sur la plateforme quand vous en avez besoin.",
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
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Votre sécurité est une priorité.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Profils vérifiés",
              desc: "Nous mettons progressivement en place des procédures de vérification afin de garantir un environnement de confiance.",
              icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            },
            {
              title: "Confidentialité",
              desc: "Vous décidez des informations visibles sur votre profil et choisissez ce que vous souhaitez partager.",
              icon: <Lock className="h-6 w-6 text-primary" />,
            },
            {
              title: "Signalement simplifié",
              desc: "Des outils de signalement confidentiels et une modération humaine lorsque cela est nécessaire.",
              icon: <Flag className="h-6 w-6 text-accent" />,
            },
            {
              title: "Une communauté respectueuse",
              desc: "Chaque membre accepte la Charte KELIAA, socle de notre communauté et garantie d'un environnement respectueux.",
              icon: <Users className="h-6 w-6 text-primary" />,
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
          Une seule rencontre peut changer toute une vie.
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Vous n&apos;avez pas besoin de rencontrer des centaines de personnes. Vous avez besoin de
          rencontrer celle avec qui construire un foyer. Commencez aujourd&apos;hui votre parcours sur
          KELIAA et avancez avec une méthode pensée pour les célibataires chrétiens qui désirent un
          mariage durable.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer gratuitement mon profil</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="/pricing" variant="outline" size="lg">
            <span>Découvrir les offres</span>
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
