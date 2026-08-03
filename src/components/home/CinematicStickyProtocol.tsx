"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ShieldCheck, Heart, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CinematicStickyProtocol() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);
  const card3Ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (!card1Ref.current || !card2Ref.current || !card3Ref.current) return;

      // Pinning and stacking sequence
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Card 1 transitions out as progress moves 0 -> 0.45
          if (progress < 0.45) {
            const p = progress / 0.45;
            gsap.set(card1Ref.current, {
              scale: 1 - p * 0.1, // scale to 0.9
              filter: `blur(${p * 20}px)`,
              opacity: 1 - p * 0.5,
            });
            gsap.set(card2Ref.current, {
              yPercent: 100 * (1 - p),
              opacity: p,
            });
          } else {
            gsap.set(card1Ref.current, { scale: 0.9, filter: "blur(20px)", opacity: 0.5 });
            gsap.set(card2Ref.current, { yPercent: 0, opacity: 1 });
          }

          // Card 2 transitions out as progress moves 0.45 -> 0.9
          if (progress >= 0.45 && progress < 0.9) {
            const p = (progress - 0.45) / 0.45;
            gsap.set(card2Ref.current, {
              scale: 1 - p * 0.1,
              filter: `blur(${p * 20}px)`,
              opacity: 1 - p * 0.5,
            });
            gsap.set(card3Ref.current, {
              yPercent: 100 * (1 - p),
              opacity: p,
            });
          } else if (progress >= 0.9) {
            gsap.set(card2Ref.current, { scale: 0.9, filter: "blur(20px)", opacity: 0.5 });
            gsap.set(card3Ref.current, { yPercent: 0, opacity: 1 });
          } else {
            gsap.set(card3Ref.current, { yPercent: 100, opacity: 0 });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-background overflow-hidden select-none border-b border-border/50">
      
      {/* CARD 1: COMPRÉHENSION DE SOI */}
      <div
        ref={card1Ref}
        className="absolute inset-0 z-10 flex flex-col justify-center items-center px-6 py-12 bg-background"
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <svg className="w-[600px] h-[600px] animate-[spin_40s_linear_infinite]" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="180" stroke="#722F37" strokeWidth="1" fill="none" strokeDasharray="8 8" />
            <circle cx="200" cy="200" r="140" stroke="#722F37" strokeWidth="1.5" fill="none" />
            <circle cx="200" cy="200" r="100" stroke="#722F37" strokeWidth="1" fill="none" strokeDasharray="4 12" />
            <polygon points="200,40 340,280 60,280" stroke="#722F37" strokeWidth="1" fill="none" />
            <polygon points="200,360 340,120 60,120" stroke="#722F37" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        </div>

        <div className="relative z-20 max-w-3xl text-center space-y-6">
          <span className="inline-block font-sans text-xs uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary text-primary font-semibold border border-border">
            01 / Compréhension de soi
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Au-delà des apparences, l&apos;exploration de l&apos;âme.
          </h2>
          <p className="font-sans text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Votre profil ne se limite pas à une photo. À travers 9 questionnaires spirituels et psychologiques, vous posez les fondations d&apos;une rencontre bâtie sur la vérité de votre identité en Christ.
          </p>
        </div>
      </div>

      {/* CARD 2: HARMONIE & VALEURS */}
      <div
        ref={card2Ref}
        className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6 py-12 bg-background translate-y-full opacity-0"
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-5">
          <div className="w-full h-full bg-[radial-gradient(#722F37_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Sweeping Laser Line */}
          <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[laserSweep_3s_ease-in-out_infinite] shadow-[0_0_10px_#722F37]" />
        </div>

        <div className="relative z-20 max-w-3xl text-center space-y-6">
          <span className="inline-block font-sans text-xs uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary text-primary font-semibold border border-border">
            02 / Harmonie & Valeurs
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Une compatibilité mesurée avec <span className="font-serif italic text-primary font-normal">précision sacrée</span>.
          </h2>
          <p className="font-sans text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Notre moteur d&apos;intelligence spirituelle EVA analyse vos valeurs familiales, votre gestion des conflits et vos aspirations pour vous présenter uniquement des profils à haute résonance.
          </p>
        </div>
      </div>

      {/* CARD 3: RENCONTRE SEREINE */}
      <div
        ref={card3Ref}
        className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6 py-12 bg-background translate-y-full opacity-0"
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <svg className="w-full max-w-5xl h-64" viewBox="0 0 1000 200">
            <path
              d="M 0 100 L 300 100 L 330 40 L 360 160 L 390 100 L 600 100 L 630 20 L 660 180 L 690 100 L 1000 100"
              fill="none"
              stroke="#722F37"
              strokeWidth="2.5"
              strokeDasharray="1200"
              className="animate-[dashOffset_4s_linear_infinite]"
            />
          </svg>
        </div>

        <div className="relative z-20 max-w-3xl text-center space-y-6">
          <span className="inline-block font-sans text-xs uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary text-primary font-semibold border border-border">
            03 / Rencontre Sereine
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Le temps du discernement, protégé dans le respect.
          </h2>
          <p className="font-sans text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Le floutage par défaut préserve la pudeur jusqu&apos;au déblocage mutuel. Le bouclier de courtoisie veille sur chaque mot échangé pour vous permettre de construire votre futur foyer en toute confiance.
          </p>
        </div>
      </div>

    </section>
  );
}
