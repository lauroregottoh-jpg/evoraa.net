"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { CinematicNavbar } from "@/components/layout/CinematicNavbar";
import { CinematicFooter } from "@/components/layout/CinematicFooter";
import { HeroBackground3D } from "@/components/home/HeroBackground3D";
import { HomeHeroCarousel } from "@/components/home/HomeHeroCarousel";
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel";
import { ShareRecommendSection } from "@/components/marketing/ShareRecommendSection";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
  UserCheck,
  BookOpen,
  Lock,
  ClipboardCheck,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="hero-cta-main">
        <MagneticButton
          href="/register"
          variant="primary"
          size="lg"
          className="px-8 py-7 text-lg bg-primary hover:bg-primary/90 text-white shadow-elevated border-none"
        >
          <span className="flex items-center gap-2">
            Commencer gratuitement <ArrowRight className="h-5 w-5" />
          </span>
        </MagneticButton>
      </div>
      <MagneticButton
        href="/how-it-works"
        variant="outline"
        size="lg"
        className="px-8 py-7 text-lg bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
      >
        Voir comment ça marche
      </MagneticButton>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background selection:bg-primary/20 overflow-hidden">
      <CinematicNavbar />

      {/* One living background + rotating copy (no static photo slab on top) */}
      <div className="relative">
        <HeroBackground3D />
        <HomeHeroCarousel cta={heroCta} />
      </div>

      <section className="story-container py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="story-text space-y-8">
            <div className="space-y-4">
              <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
                Pourquoi on existe
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
                Parce que trop de plateformes traitent l&apos;amour comme un flux.
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Si vous êtes célibataire et que vous voulez vraiment vous marier, vous le savez déjà :
                la plupart des apps ne sont pas faites pour vous. Elles poussent le swipe, l&apos;image,
                la conversation rapide — et souvent, ce qui suit n&apos;a plus grand-chose à voir avec
                vos convictions.
              </p>
              <p>
                KELIAA est née d&apos;un constat simple, vécu auprès de centaines de célibataires
                chrétiens : on peut vouloir une rencontre sérieuse sans se mettre en vitrine. On peut
                parler foi, vision du foyer et maturité avant de parler photos. On peut chercher{" "}
                <strong className="text-foreground font-serif italic">L&apos;âme sœur</strong> sans
                renoncer à sa dignité.
              </p>
              <p>
                Notre travail, ce n&apos;est pas de multiplier les likes. C&apos;est de créer un espace
                où le discernement a sa place — sécurisé, confidentiel, et porté par une méthode de
                matching qui s&apos;appuie sur autre chose que l&apos;attirance du moment.
              </p>
            </div>
            <MagneticButton href="/about" variant="outline" className="mt-2">
              Notre histoire
            </MagneticButton>
          </div>
          <div className="story-image relative h-[520px] sm:h-[600px] rounded-2xl overflow-hidden shadow-elevated">
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop"
              alt="Moment de partage"
              fill
              className="object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-8 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="encart-kelia p-8 sm:p-10 gsap-fade-up">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Ce qui change concrètement
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Un matching qui respecte votre réalité
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Questionnaires, lecture de compatibilité, vérification de profils, règles claires sur
                la vie privée. Ce n&apos;est pas du marketing : c&apos;est le cœur du produit. Sans ça,
                on retombe dans le hasard — et le hasard fatigue.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <ClipboardCheck className="h-5 w-5" />, label: "Tests structurés" },
                { icon: <Heart className="h-5 w-5" />, label: "Compatibilité réelle" },
                { icon: <ShieldCheck className="h-5 w-5" />, label: "Profils vérifiés" },
                { icon: <Lock className="h-5 w-5" />, label: "Vie privée respectée" },
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

      <section className="py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
            Le parcours
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Quatre étapes. Zéro théâtre.
          </h2>
          <p className="text-muted-foreground text-lg">
            Vous avancez à votre rythme. On vous donne de la clarté — pas de la pression.
          </p>
        </div>

        <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <UserCheck />,
              title: "1. Un profil qui vous ressemble",
              desc: "Foi, projet de vie, attentes relationnelles. Assez pour être compris — sans vous exposer inutilement.",
            },
            {
              icon: <ClipboardCheck />,
              title: "2. Des tests utiles",
              desc: "Pas un quiz gadget : des questions qui éclairent la façon dont vous aimez, communiquez et construisez.",
            },
            {
              icon: <ShieldCheck />,
              title: "3. Des échanges cadrés",
              desc: "Profils vérifiés, règles de respect, confidentialité. Vous pouvez parler vrai sans vous sentir en danger.",
            },
            {
              icon: <BookOpen />,
              title: "4. Du discernement vers L'âme sœur",
              desc: "On ne force rien. On vous aide à avancer avec lucidité vers quelqu'un avec qui bâtir, pas juste chatter.",
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
      </section>

      <section className="compare-container relative py-28 px-6 sm:px-12 lg:px-20 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1511285560929-80b456fe3b4f?q=80&w=2000&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
            aria-hidden
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Soyons clairs
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white">
              Ce que vous fuyez. Ce que vous trouvez ici.
            </h2>
            <p className="text-lg text-white/85">
              Deux logiques. Deux résultats. Choisissez celle qui respecte votre saison.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="compare-card p-8 sm:p-10 rounded-lg border border-white/15 bg-black/35 backdrop-blur-md">
              <h3 className="text-xl font-sans font-semibold text-white/55 mb-8 uppercase tracking-wide">
                Apps classiques
              </h3>
              <ul className="space-y-5">
                {[
                  "Le visage décide avant la conversation",
                  "Le swipe remplace le discernement",
                  "Les échanges glissent vite hors sujet",
                  "Peu de filtre sur les intentions",
                  "Confidentialité souvent secondaire",
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
                  "La vision du mariage avant le spectacle",
                  "Matching fondé sur des tests réels",
                  "Profils vérifiés, process sérieux",
                  "Cadre digne pour parler vrai",
                  "Vie privée traitée comme un engagement",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-foreground text-base sm:text-lg font-medium"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <MagneticButton href="/register" variant="primary" className="w-full sm:w-auto">
                  Créer mon compte
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />
      <ShareRecommendSection />

      <section className="py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
            Ce que vous construisez
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Pas une série de rendez-vous. Une direction.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group shadow-card gsap-fade-up">
            <Image
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop"
              alt="Cheminer ensemble"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-white font-serif text-3xl font-bold mb-2">Marcher dans la même direction</h3>
              <p className="text-white/80">Foi, valeurs, projet de foyer — avant le décor.</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden relative group shadow-card gsap-fade-up">
            <Image
              src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop"
              alt="Prendre le temps"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-white font-serif text-xl font-bold">Prendre le temps</h3>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden relative group shadow-card gsap-fade-up">
            <Image
              src="https://images.unsplash.com/photo-1596484552993-277579177196?q=80&w=1000&auto=format&fit=crop"
              alt="S'engager"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-white font-serif text-xl font-bold">S&apos;engager pour de vrai</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 sm:px-12 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8 gsap-fade-up">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Si vous en avez assez de chercher au hasard
          </h2>
          <p className="text-white/90 text-lg sm:text-xl max-w-xl mx-auto">
            Rejoignez KELIAA. Créez votre espace, complétez votre profil, et avancez avec une méthode
            qui respecte ce que vous croyez.
          </p>
          <MagneticButton
            href="/register"
            variant="outline"
            size="lg"
            className="px-10 py-6 text-lg bg-white text-primary border-none hover:bg-white/90 shadow-elevated"
          >
            Créer mon espace
          </MagneticButton>
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
}
