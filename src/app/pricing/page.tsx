"use client";

import * as React from "react";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const plans = [
    {
      name: "Découverte",
      price: "Gratuit",
      desc: "Idéal pour explorer la plateforme.",
      features: [
        "Jusqu'à 5 profils suggérés par jour",
        "10 likes par jour maximum",
        "5 messages par jour par conversation",
        "Synthèse des résultats de tests (3 phrases)",
        "Voir le nombre de likes reçus (flouté)",
        "Badge Profil vérifié"
      ],
      button: "Créer gratuitement mon compte",
      href: "/register",
      popular: false,
    },
    {
      name: "Premium",
      price: "2 500",
      currency: "FCFA",
      period: "/ mois",
      desc: "L'expérience complète pour trouver LA personne.",
      features: [
        "Jusqu'à 15 profils suggérés par jour",
        "30 likes par jour maximum",
        "Messagerie illimitée",
        "Voir qui vous a liké en clair",
        "Résultats de tests détaillés avec axes d'amélioration",
        "Badge Premium"
      ],
      button: "Choisir Premium",
      href: "/register?plan=premium",
      popular: true,
    },
    {
      name: "Premium+",
      price: "5 000",
      currency: "FCFA",
      period: "/ mois",
      desc: "L'expérience illimitée et accélérée.",
      features: [
        "Profils et likes illimités",
        "Messagerie illimitée",
        "Voir qui vous a liké + date/heure",
        "1 boost de profil gratuit par semaine (24h)",
        "Guide éditorial 'Bien choisir son partenaire'",
        "Badge Premium+"
      ],
      button: "Choisir Premium+",
      href: "/register?plan=premium-plus",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Qu'est-ce que le service de Coaching individuel ?",
      a: "Nous proposons un service d'accompagnement relationnel chrétien (1h en visio) à 15 000 FCFA la session. C'est idéal si vous souhaitez travailler sur vos axes d'amélioration révélés par les tests."
    },
    {
      q: "Quels sont les moyens de paiement acceptés ?",
      a: "Nous acceptons les paiements via Tmoney, Flooz et Wave, pour rendre la plateforme accessible à tous dans l'espace UEMOA, sans avoir besoin d'une carte bancaire."
    },
    {
      q: "Est-il vraiment possible d'utiliser KELIA gratuitement ?",
      a: "Oui. L'offre Découverte vous permet de créer votre profil, passer les tests et découvrir 5 profils par jour. Cependant, la messagerie est limitée à 5 messages par conversation."
    },
    {
      q: "Puis-je changer d'offre plus tard ?",
      a: "Oui, vous pouvez passer de Premium à Premium+ à tout moment depuis les paramètres de votre compte."
    },
    {
      q: "L'abonnement est-il renouvelé automatiquement ?",
      a: "Non. Le renouvellement est manuel. Vous recevrez un rappel 3 jours avant l'expiration pour choisir de renouveler, afin d'éviter toute mauvaise surprise."
    }
  ];

  return (
    <CinematicLayout>
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto text-center space-y-6">
        <span className="inline-block text-xs font-sans uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary text-primary font-semibold border border-border">
          Nos Offres
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Un investissement dans une <br />
          <span className="italic font-normal text-primary">rencontre sérieuse.</span>
        </h1>
        <p className="font-sans text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed pt-4">
          Trouver la bonne personne est l'une des décisions les plus importantes d'une vie. Choisissez le niveau d'accompagnement qui vous correspond.
        </p>
      </section>

      {/* PRICING CARDS */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                "relative p-8 rounded-lg border bg-white flex flex-col transition-all duration-300",
                plan.popular 
                  ? "border-primary shadow-elevated lg:-translate-y-4 z-10" 
                  : "border-border shadow-card"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    Le plus choisi
                  </span>
                </div>
              )}

              <div className="space-y-4 text-center pb-8 border-b border-border/60">
                <h3 className="font-serif text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1 min-h-[48px]">
                  {plan.currency ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm font-semibold text-muted-foreground mb-1">{plan.currency}</span>
                      <span className="text-sm text-muted-foreground mb-1">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed h-10">{plan.desc}</p>
              </div>

              <div className="pt-8 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-foreground/90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-auto">
                <MagneticButton 
                  href={plan.href} 
                  variant={plan.popular ? "primary" : "outline"} 
                  className="w-full"
                >
                  {plan.button}
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COACHING BANNER */}
      <section className="py-12 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 justify-between shadow-sm">
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-border shadow-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold text-foreground">Service d'accompagnement</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground">Coaching Individuel</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Vous avez des blocages ou souhaitez comprendre en profondeur vos résultats de tests ? Réservez une session en visio (1h) avec notre expert en accompagnement relationnel chrétien.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-3xl font-bold text-foreground block">15 000</span>
              <span className="text-sm font-semibold text-muted-foreground">FCFA / session</span>
            </div>
            <MagneticButton href="/coaching" variant="secondary">
              Réserver une session
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-sans font-semibold text-base sm:text-lg text-foreground hover:text-primary transition-colors"
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
          Bien plus qu'un abonnement.
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          En choisissant KELIA, vous rejoignez une communauté de célibataires chrétiens qui partagent une même aspiration : rencontrer LA personne avec laquelle construire un mariage solide.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer gratuitement mon compte</span>
          </MagneticButton>
          <MagneticButton href="/how-it-works" variant="outline" size="lg">
            <span>Découvrir le parcours KELIA</span>
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
