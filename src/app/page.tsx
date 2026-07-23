"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CinematicNavbar } from "@/components/layout/CinematicNavbar";
import { CinematicFooter } from "@/components/layout/CinematicFooter";
import { HeroBackground3D } from "@/components/home/HeroBackground3D";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight, Heart, ShieldCheck, Sparkles, UserCheck, BookOpen } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/utils/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Animations (Staggered Fade Up)
    gsap.from(".hero-element", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });

    // Breathing effect for main CTA
    gsap.to(".hero-cta-main", {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)", // Golden glow
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 2. Scroll Animations - Fade Up
    const fadeUpElements = gsap.utils.toArray<HTMLElement>(".gsap-fade-up");
    fadeUpElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    });

    // 3. Scroll Animations - Stagger (How it works)
    gsap.from(".step-card", {
      scrollTrigger: {
        trigger: ".steps-container",
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    });

    // 4. Scroll Animations - Fade Left/Right (Storytelling)
    gsap.from(".story-text", {
      scrollTrigger: {
        trigger: ".story-container",
        start: "top 75%",
      },
      x: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
    gsap.from(".story-image", {
      scrollTrigger: {
        trigger: ".story-container",
        start: "top 75%",
      },
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });

    // 5. Scroll Animations - Bento Grid Parallax
    const bentoImages = gsap.utils.toArray<HTMLElement>(".bento-image");
    bentoImages.forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // 6. Flip/Scale for Comparator
    gsap.from(".compare-card", {
      scrollTrigger: {
        trigger: ".compare-container",
        start: "top 75%",
      },
      scale: 0.95,
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: "back.out(1.5)",
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-background selection:bg-primary/20 overflow-hidden">
      <CinematicNavbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
        <HeroBackground3D />
        
        <div className="relative z-30 max-w-4xl mx-auto text-center space-y-8 mt-12">
          
          <div className="hero-element inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase">
              La plateforme Premium des Célibataires Chrétiens
            </span>
          </div>

          <h1 className="hero-element font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-2xl">
            Construisez un mariage <br className="hidden sm:block" />
            <span className="italic font-normal text-accent/90">selon Ses standards.</span>
          </h1>

          <p className="hero-element font-sans text-lg sm:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Une expérience élégante, bienveillante et sécurisée pour rencontrer la personne avec qui partager votre foi et votre vie.
          </p>

          <div className="hero-element flex flex-wrap items-center justify-center gap-6 pt-6">
            <div className="hero-cta-main">
              <MagneticButton href="/register" variant="primary" size="lg" className="px-8 py-7 text-lg bg-primary hover:bg-primary/90 text-white shadow-elevated border-none">
                <span className="flex items-center gap-2">
                  Commencer l'expérience <ArrowRight className="h-5 w-5" />
                </span>
              </MagneticButton>
            </div>
            <MagneticButton href="/how-it-works" variant="outline" size="lg" className="px-8 py-7 text-lg bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md">
              Découvrir KELIA
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 hero-element">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Faire défiler</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>

      {/* --- HOW IT WORKS (4 STEPS) --- */}
      <section className="py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">Le Parcours</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Comment fonctionne KELIA ?
          </h2>
        </div>

        <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <UserCheck />, title: "1. Créez votre profil", desc: "Présentez votre parcours, votre foi et vos aspirations profondes avec élégance." },
            { icon: <Heart />, title: "2. Découvrez des profils", desc: "Un matching intelligent basé sur vos valeurs spirituelles et votre projet de vie." },
            { icon: <ShieldCheck />, title: "3. Échangez en sécurité", desc: "Des outils conçus pour favoriser des conversations respectueuses et privées." },
            { icon: <BookOpen />, title: "4. Construisez", desc: "Avancez sereinement vers une relation durable et un projet de mariage chrétien." },
          ].map((step, i) => (
            <div key={i} className="step-card group relative p-8 rounded-2xl bg-white border border-border shadow-card hover:shadow-elevated hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 rounded-xl bg-secondary border border-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-sm group-hover:drop-shadow-glow">
                {React.cloneElement(step.icon as React.ReactElement, { className: "w-6 h-6" })}
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/50 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* --- SEPARATOR --- */}
      <div className="w-full flex justify-center py-8">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-accent/40 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-accent/40" />
        </div>
      </div>

      {/* --- STORYTELLING (POURQUOI KELIA) --- */}
      <section className="story-container py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden bg-gradient-to-br from-secondary/30 to-transparent rounded-[3rem]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="story-text space-y-8">
            <div className="space-y-4">
              <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">Notre Vision</span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
                Au-delà d'une simple application.
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Les applications classiques sont souvent conçues pour la consommation rapide (swipe) et l'incertitude. Pour les chrétiens souhaitant se marier, cela crée frustration et compromis.
              </p>
              <p>
                C'est pourquoi nous avons créé <strong className="text-foreground font-serif italic">KELIA</strong>. Une plateforme où la compatibilité spirituelle est le fondement. Où l'élégance rencontre la foi.
              </p>
              <p>
                Ici, chaque membre partage une ambition noble : rencontrer la personne que Dieu a préparée, dans un cadre sécurisé, bienveillant et accompagné.
              </p>
            </div>

            <MagneticButton href="/about" variant="outline" className="mt-4">
              Découvrir notre histoire
            </MagneticButton>
          </div>

          <div className="story-image relative h-[600px] rounded-2xl overflow-hidden shadow-elevated">
            <Image 
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop" 
              alt="Couple partageant un moment spirituel"
              fill
              className="object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* --- COMPARATOR (IMMERSIVE) --- */}
      <section className="compare-container py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 gsap-fade-up">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Sentez la différence.
          </h2>
          <p className="text-xl text-muted-foreground">Une expérience pensée pour votre projet de mariage.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Classic Apps */}
          <div className="compare-card p-10 rounded-3xl border border-gray-200 bg-gray-50/50 backdrop-blur-sm shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h3 className="text-2xl font-sans font-bold text-gray-400 mb-8 relative z-10">Applications Classiques</h3>
            <ul className="space-y-6 relative z-10">
              {[
                "Recherche basée sur l'apparence",
                "Consommation rapide (Swipe)",
                "Valeurs et objectifs incertains",
                "Interactions superficielles",
                "Aucun accompagnement"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KELIA */}
          <div className="compare-card p-10 rounded-3xl border border-accent/30 bg-white shadow-elevated relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(114,47,55,0.1)] transition-all duration-700 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors duration-700" />
            
            <h3 className="text-3xl font-serif font-bold text-primary mb-8 relative z-10 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-accent" /> KELIA
            </h3>
            <ul className="space-y-6 relative z-10">
              {[
                "Projet clair de mariage chrétien",
                "Recherche par compatibilité spirituelle",
                "Profils vérifiés et sérieux",
                "Confidentialité et pudeur respectées",
                "Accompagnement et ressources (EVA)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- SEPARATOR --- */}
      <div className="w-full flex justify-center py-8">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-accent/40 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-accent/40" />
        </div>
      </div>

      {/* --- BENTO GRID (GALERIE ÉMOTIONNELLE) --- */}
      <section className="py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20 gsap-fade-up">
          <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">Moments de vie</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            L'espérance d'une alliance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Card 1: Large */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group shadow-card hover:shadow-elevated transition-shadow duration-500 gsap-fade-up">
            <div className="absolute inset-[-10%] z-0">
              <Image 
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop" 
                alt="Marche au coucher du soleil" 
                fill 
                className="object-cover bento-image"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white font-serif text-3xl font-bold mb-2">Cheminer ensemble</h3>
              <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Une même direction, une même foi.</p>
            </div>
          </div>

          {/* Card 2: Small Top Right */}
          <div className="rounded-3xl overflow-hidden relative group shadow-card hover:shadow-elevated transition-shadow duration-500 gsap-fade-up" style={{transitionDelay: "100ms"}}>
            <div className="absolute inset-[-10%] z-0">
              <Image 
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop" 
                alt="Lecture de la parole" 
                fill 
                className="object-cover bento-image"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white font-serif text-xl font-bold mb-1">Méditer</h3>
              <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">La parole au centre du foyer.</p>
            </div>
          </div>

          {/* Card 3: Small Bottom Right */}
          <div className="rounded-3xl overflow-hidden relative group shadow-card hover:shadow-elevated transition-shadow duration-500 gsap-fade-up" style={{transitionDelay: "200ms"}}>
            <div className="absolute inset-[-10%] z-0 bg-primary">
               {/* Unsplash ring/proposal */}
               <Image 
                src="https://images.unsplash.com/photo-1596484552993-277579177196?q=80&w=1000&auto=format&fit=crop" 
                alt="Alliance et engagement" 
                fill 
                className="object-cover opacity-80 bento-image mix-blend-luminosity"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary/40 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white font-serif text-xl font-bold mb-1">S'engager</h3>
              <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">L'alliance du mariage.</p>
            </div>
          </div>

        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-6 sm:px-12 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8 gsap-fade-up">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold leading-tight drop-shadow-lg">
            Prêt à écrire votre histoire ?
          </h2>
          <p className="text-white/90 text-lg sm:text-xl max-w-xl mx-auto font-sans font-light">
            Rejoignez KELIA aujourd'hui et prenez le temps de rencontrer la personne avec qui bâtir selon Ses plans.
          </p>
          <div className="pt-8">
            <MagneticButton href="/register" variant="outline" size="lg" className="px-10 py-6 text-lg bg-white text-primary border-none hover:bg-white/90 shadow-elevated">
              Créer mon espace
            </MagneticButton>
          </div>
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
}
