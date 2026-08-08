"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { CinematicNavbar } from "@/components/layout/CinematicNavbar";
import { CinematicFooter } from "@/components/layout/CinematicFooter";
import { HeroBackground3D } from "@/components/home/HeroBackground3D";
import { HomeHeroCarousel } from "@/components/home/HomeHeroCarousel";
import { StoryJourneyCard } from "@/components/home/StoryJourneyCard";
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel";
import { ShareRecommendSection } from "@/components/marketing/ShareRecommendSection";
import { MatchingPillarsShowcase } from "@/components/home/MatchingPillarsShowcase";
import { PwaInstallHomeSection } from "@/components/pwa/PwaInstallHomeSection";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AuthHashCatcher } from "@/components/auth/AuthHashCatcher";
import {
  ArrowRight,
  Check,
  Heart,
  ShieldCheck,
  Sparkles,
  UserCheck,
  BookOpen,
  Lock,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Copy source: software-architecture/KELIA - Page d'accueil.docx — orienté inscription. */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".hero-cta-main", {
        scale: 1.02,
        boxShadow: "0 0 18px rgba(212, 175, 55, 0.28)",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const fadeUpElements = gsap.utils.toArray<HTMLElement>(".gsap-fade-up");
      fadeUpElements.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          y: 28,
          duration: 0.9,
          ease: "power2.out",
        });
      });

      gsap.from(".step-card", {
        scrollTrigger: { trigger: ".steps-container", start: "top 80%", once: true },
        y: 24,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      });

      gsap.from(".story-text", {
        scrollTrigger: { trigger: ".story-container", start: "top 75%", once: true },
        x: -36,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".story-image", {
        scrollTrigger: { trigger: ".story-container", start: "top 75%", once: true },
        x: 36,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".compare-card", {
        scrollTrigger: { trigger: ".compare-container", start: "top 80%", once: true },
        y: 24,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const heroCta = (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="hero-cta-main">
          <MagneticButton
            href="/register"
            variant="primary"
            size="lg"
            className="px-8 py-7 text-lg bg-primary hover:bg-primary/90 text-white shadow-elevated border-none"
          >
            <span className="flex items-center gap-2">
              Créer gratuitement mon profil <ArrowRight className="h-5 w-5" />
            </span>
          </MagneticButton>
        </div>
        <MagneticButton
          href="/how-it-works"
          variant="outline"
          size="lg"
          className="px-8 py-7 text-lg bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
        >
          Découvrir notre méthode
        </MagneticButton>
      </div>
      <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed drop-shadow-md">
        Déjà des centaines de célibataires chrétiens ont choisi une approche plus sérieuse pour
        construire leur avenir. Pourquoi pas vous ?
      </p>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background selection:bg-primary/20 overflow-hidden">
      <AuthHashCatcher />
      <CinematicNavbar />

      <div className="relative">
        <HeroBackground3D />
        <HomeHeroCarousel cta={heroCta} />
      </div>

      {/* Pourquoi KELIAA existe */}
      <section className="story-container relative py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="story-text space-y-8">
            <div className="space-y-4">
              <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
                Pourquoi KELIAA existe
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
                Vous méritez mieux que des rencontres sans lendemain.
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Si vous êtes célibataire et que vous souhaitez réellement vous marier, vous avez
                probablement déjà ressenti cette frustration.
              </p>
              <ul className="space-y-3 text-base sm:text-lg">
                {[
                  "Des conversations qui s'arrêtent du jour au lendemain.",
                  "Des personnes qui ne partagent pas vos convictions.",
                  "Des échanges centrés sur l'apparence plutôt que sur les valeurs.",
                  "Le sentiment de perdre du temps alors que vous cherchez simplement quelqu'un avec qui construire un foyer.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p>
                KELIAA est née pour répondre à cette réalité. Nous avons imaginé un espace où les
                célibataires chrétiens peuvent se rencontrer autrement : avec respect, discernement
                et une véritable recherche de compatibilité.
              </p>
              <p className="text-foreground font-medium">
                Parce qu&apos;une rencontre qui peut changer une vie mérite davantage qu&apos;un
                simple swipe.
              </p>
            </div>
            <MagneticButton href="/register" variant="primary" className="mt-2">
              Créer gratuitement mon profil
            </MagneticButton>
          </div>
          <div className="story-image relative h-[520px] sm:h-[600px] rounded-2xl overflow-hidden shadow-elevated">
            <Image
              src="/home/story-community.png"
              alt="Moment de partage"
              fill
              className="object-cover object-[center_30%] sm:object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Ce qui change concrètement */}
      <section className="relative py-8 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="encart-kelia p-8 sm:p-10 gsap-fade-up">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Ce qui change concrètement
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Une méthode pensée pour construire des relations durables.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous avons remplacé les mécanismes qui favorisent les rencontres éphémères par une
                approche qui aide à discerner une personne réellement compatible.
              </p>
              <MagneticButton href="/register" variant="outline" className="mt-2">
                Créer gratuitement mon profil
              </MagneticButton>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: <Heart className="h-5 w-5" />, label: "Compatibilité avant attirance" },
                { icon: <ShieldCheck className="h-5 w-5" />, label: "Profils vérifiés" },
                { icon: <Lock className="h-5 w-5" />, label: "Confidentialité renforcée" },
                { icon: <Sparkles className="h-5 w-5" />, label: "Communauté engagée vers le mariage" },
                { icon: <MessageCircle className="h-5 w-5" />, label: "Échanges plus profonds dès le début" },
                { icon: <BookOpen className="h-5 w-5" />, label: "Une démarche qui respecte votre foi" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm font-medium text-foreground"
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <MatchingPillarsShowcase />

      {/* Parcours */}
      <section className="relative py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
            Le parcours
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Votre parcours vers une rencontre qui a du sens
          </h2>
        </div>

        <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <UserCheck />,
              title: "1. Présentez qui vous êtes",
              desc: "Votre foi, vos valeurs, votre vision du mariage et du foyer.",
            },
            {
              icon: <ClipboardCheck />,
              title: "2. Découvrez votre compatibilité",
              desc: "Notre méthode identifie les bases d'une relation durable.",
            },
            {
              icon: <ShieldCheck />,
              title: "3. Échangez en confiance",
              desc: "Avec des profils vérifiés dans un cadre respectueux.",
            },
            {
              icon: <Heart />,
              title: "4. Discernement",
              desc: "Prenez le temps de connaître la bonne personne avant de construire votre avenir.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="step-card group relative p-8 rounded-2xl bg-white border border-border shadow-card hover:shadow-elevated hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary border border-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500 [&>svg]:w-6 [&>svg]:h-6">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-10 max-w-xl mx-auto gsap-fade-up">
          Destination : commencez une histoire qui a du sens.
        </p>
        <div className="flex justify-center mt-6 gsap-fade-up">
          <MagneticButton href="/register" variant="primary">
            Créer gratuitement mon profil
          </MagneticButton>
        </div>
      </section>

      {/* Comparatif */}
      <section className="compare-container relative py-28 px-6 sm:px-12 lg:px-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/home/compare-couple.png"
            alt=""
            fill
            className="object-cover object-[center_35%] md:object-center"
            aria-hidden
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Soyons clairs
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white">
              Pourquoi nos membres ne reviennent plus aux applications classiques
            </h2>
            <p className="text-lg text-white/85">
              Les applications de rencontre ont été conçues pour créer toujours plus
              d&apos;interactions. KELIAA a été conçue pour favoriser une rencontre qui peut durer
              toute une vie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="compare-card p-8 sm:p-10 rounded-lg border border-white/15 bg-black/35 backdrop-blur-md">
              <h3 className="text-xl font-sans font-semibold text-white/55 mb-8 uppercase tracking-wide">
                Applications classiques
              </h3>
              <ul className="space-y-5">
                {[
                  "Le premier jugement se fait sur une photo",
                  "Des centaines de profils à faire défiler",
                  "Des intentions souvent floues",
                  "Peu de vérification des profils",
                  "Des conversations superficielles",
                  "On cherche à attirer l'attention",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-base sm:text-lg">
                    <span className="mt-2 h-2 w-2 rounded-full bg-white/30 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="compare-card p-8 sm:p-10 rounded-lg border-2 border-accent bg-white text-foreground shadow-elevated">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-8 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-accent" /> KELIAA
              </h3>
              <ul className="space-y-5">
                {[
                  "La compatibilité passe avant l'apparence",
                  "Une sélection fondée sur vos valeurs et votre projet de vie",
                  "Une communauté orientée vers le mariage",
                  "Des profils vérifiés et un cadre sécurisé",
                  "Des échanges qui parlent de foi, de vision et d'avenir",
                  "On apprend à discerner la bonne personne",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-foreground text-base sm:text-lg font-medium"
                  >
                    <Check className="mt-1 h-5 w-5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                Parce que votre futur mariage mérite mieux qu&apos;une rencontre laissée au hasard.
              </p>
              <div className="mt-8">
                <MagneticButton href="/register" variant="primary" className="w-full sm:w-auto">
                  Créer gratuitement mon profil
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      {/* Imaginez votre histoire */}
      <section className="py-28 px-6 sm:px-12 relative overflow-hidden bg-[#1C1412] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 20%, rgba(184,149,74,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(92,31,40,0.35), transparent 40%)",
          }}
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6 gsap-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Votre histoire peut commencer ici
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Imaginez votre histoire dans quelques mois…
            </h2>
            <p className="text-base leading-relaxed text-white/75 sm:text-lg">
              Une compatibilité vous est proposée. Les échanges parlent de foi, de famille et de
              projet de vie. Vous prenez le temps de prier, de vous connaître et de discerner.
            </p>
            <p className="font-serif text-xl italic leading-snug text-accent sm:text-2xl">
              Puis un jour, cette rencontre pourrait devenir celle que vous attendiez depuis
              longtemps.
            </p>
            <MagneticButton
              href="/register"
              variant="outline"
              size="lg"
              className="bg-white px-8 py-6 text-base text-primary border-none hover:bg-white/90 shadow-elevated"
            >
              Découvrir mes compatibilités
            </MagneticButton>
          </div>
          <div className="gsap-fade-up">
            <StoryJourneyCard />
          </div>
        </div>
      </section>

      <ShareRecommendSection />

      <PwaInstallHomeSection />

      {/* CTA final */}
      <section className="py-28 px-6 sm:px-12 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('/home/hero-african-wedding.png')] opacity-10 bg-cover bg-[center_35%] md:bg-center mix-blend-overlay" />
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8 gsap-fade-up">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Vous ne cherchez probablement qu&apos;une seule personne.
          </h2>
          <p className="text-white/90 text-lg sm:text-xl max-w-xl mx-auto">
            Alors prenez le temps de la rencontrer dans le bon cadre. Rejoignez une communauté de
            célibataires chrétiens qui souhaitent construire un mariage fondé sur la foi, des
            valeurs communes et une véritable compatibilité.
          </p>
          <MagneticButton
            href="/register"
            variant="outline"
            size="lg"
            className="px-10 py-6 text-lg bg-white text-primary border-none hover:bg-white/90 shadow-elevated"
          >
            Créer gratuitement mon profil
          </MagneticButton>
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
}
