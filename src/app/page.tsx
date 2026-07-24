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
        boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)",
        duration: 2,
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
            Créer mon compte gratuit <ArrowRight className="h-5 w-5" />
          </span>
        </MagneticButton>
      </div>
      <MagneticButton
        href="/how-it-works"
        variant="outline"
        size="lg"
        className="px-8 py-7 text-lg bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
      >
        Comment ça marche
      </MagneticButton>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background selection:bg-primary/20 overflow-hidden">
      <CinematicNavbar />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-10 opacity-40">
          <HeroBackground3D />
        </div>
        <HomeHeroCarousel cta={heroCta} />
      </div>

      {/* VISION */}
      <section className="story-container py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="story-text space-y-8">
            <div className="space-y-4">
              <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
                Notre vision
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
                Pourquoi KELIAA existe
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Au-delà de présenter une application, KELIAA porte une vision : permettre aux
                chrétiens de se rencontrer dans un cadre qui respecte leurs valeurs — la foi, la
                pudeur, le projet de mariage et la dignité de chaque personne.
              </p>
              <p>
                La majorité des applications de rencontre du marché ne prennent pas en compte les
                valeurs chrétiennes. Elles reposent sur le swipe et l&apos;attirance physique avant
                toute chose. On se vend à travers des photos, les échanges dérivent facilement, et
                les critères de sélection ne sont pas alignés avec les valeurs du Royaume.
              </p>
              <p>
                Nous avons voulu créer une plateforme différente, avec un véritable projet derrière.
                Une plateforme où chacun partage une ambition noble : rencontrer{" "}
                <strong className="text-foreground font-serif italic">L&apos;âme sœur</strong>, la
                personne que Dieu a préparée, dans un cadre sécurisé et bienveillant.
              </p>
            </div>
            <MagneticButton href="/about" variant="outline" className="mt-2">
              Découvrir notre histoire
            </MagneticButton>
          </div>
          <div className="story-image relative h-[520px] sm:h-[600px] rounded-2xl overflow-hidden shadow-elevated">
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop"
              alt="Couple partageant un moment de foi"
              fill
              className="object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* MATCHING EXPERTISE */}
      <section className="py-8 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="encart-kelia p-8 sm:p-10 gsap-fade-up">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Ce qui nous différencie
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Un matching éprouvé, un processus sérieux
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Notre système repose sur des tests, une étude de compatibilité, des profils
                vérifiés, et le respect strict de la confidentialité et de la vie privée. Ce n&apos;est
                pas le hasard du swipe — c&apos;est du discernement.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <ClipboardCheck className="h-5 w-5" />, label: "Tests & questionnaires" },
                { icon: <Heart className="h-5 w-5" />, label: "Étude de compatibilité" },
                { icon: <ShieldCheck className="h-5 w-5" />, label: "Profils vérifiés" },
                { icon: <Lock className="h-5 w-5" />, label: "Confidentialité garantie" },
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

      {/* STEPS */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
            Le parcours
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Comment fonctionne KELIAA ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Quatre étapes conçues pour la rencontre sérieuse — pas pour la consommation rapide.
          </p>
        </div>

        <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <UserCheck />,
              title: "1. Profil authentique",
              desc: "Foi, vision du foyer et aspirations — pas seulement des photos. Vous présentez qui vous êtes vraiment.",
            },
            {
              icon: <ClipboardCheck />,
              title: "2. Tests & matching",
              desc: "Questionnaires éprouvés et étude de compatibilité pour des suggestions alignées sur vos valeurs.",
            },
            {
              icon: <ShieldCheck />,
              title: "3. Échanges dignes",
              desc: "Cadre sécurisé, profils vérifiés, confidentialité : des conversations qui respectent le Royaume.",
            },
            {
              icon: <BookOpen />,
              title: "4. Vers L'âme sœur",
              desc: "Avancez avec discernement vers la personne que Dieu a préparée — pour bâtir un mariage solide.",
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

      {/* COMPARISON */}
      <section className="compare-container relative py-28 px-6 sm:px-12 lg:px-20 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
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
              Le contraste
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white">
              Apps classiques vs KELIAA
            </h2>
            <p className="text-lg text-white/85">
              Swipe et apparence d&apos;un côté — discernement et valeurs du Royaume de l&apos;autre.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="compare-card p-8 sm:p-10 rounded-lg border border-white/15 bg-black/35 backdrop-blur-md">
              <h3 className="text-xl font-sans font-semibold text-white/55 mb-8 uppercase tracking-wide">
                Applications classiques
              </h3>
              <ul className="space-y-5">
                {[
                  "Swipe et attirance physique avant tout",
                  "On se vend à travers des photos",
                  "Échanges qui dérivent facilement",
                  "Critères hors des valeurs du Royaume",
                  "Peu de sérieux, peu de confidentialité",
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
                  "Ambition noble : rencontrer L'âme sœur",
                  "Matching éprouvé (tests & compatibilité)",
                  "Profils vérifiés, processus sérieux",
                  "Confidentialité et vie privée respectées",
                  "Cadre bienveillant aligné sur la foi",
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
                  Rejoindre KELIAA
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />
      <ShareRecommendSection />

      {/* BENTO */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
            Moments de vie
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            L&apos;espérance d&apos;une alliance.
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
              <h3 className="text-white font-serif text-3xl font-bold mb-2">Cheminer ensemble</h3>
              <p className="text-white/80">Une même direction, une même foi.</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden relative group shadow-card gsap-fade-up">
            <Image
              src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop"
              alt="Méditer"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-white font-serif text-xl font-bold">Méditer</h3>
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
              <h3 className="text-white font-serif text-xl font-bold">S&apos;engager</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 sm:px-12 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8 gsap-fade-up">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Prêt à rencontrer L&apos;âme sœur ?
          </h2>
          <p className="text-white/90 text-lg sm:text-xl max-w-xl mx-auto">
            Rejoignez KELIAA et avancez dans un cadre digne, sécurisé et aligné sur vos valeurs.
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
