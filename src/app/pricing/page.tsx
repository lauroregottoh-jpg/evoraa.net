"use client";

import * as React from "react";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { CheckoutPlanButton } from "@/components/billing/CheckoutPlanButton";
import { ExpertiseEncart } from "@/components/marketing/ExpertiseEncart";
import { PageHero } from "@/components/marketing/PageHero";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { PLANS, type PlanId } from "@/lib/billing/plans";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const planOrder: PlanId[] = ["free", "premium", "premium_plus"];
  const plans = planOrder.map((id) => {
    const plan = PLANS[id];
    return {
      id: plan.id,
      name: plan.name,
      price: plan.amountXof === 0 ? "Gratuit" : plan.amountXof.toLocaleString("fr-FR"),
      currency: plan.amountXof === 0 ? undefined : "FCFA",
      period: plan.periodLabel,
      desc: plan.description,
      features: plan.features,
      button:
        plan.id === "free"
          ? "Créer gratuitement mon compte"
          : `Choisir ${plan.name}`,
      popular: Boolean(plan.popular),
    };
  });

  const faqs = [
    {
      q: "Qu'est-ce que le service de Coaching individuel ?",
      a: "Nous proposons un service d'accompagnement relationnel chrétien (1h en visio) à 15 000 FCFA la session. C'est idéal si vous souhaitez travailler sur vos axes d'amélioration révélés par les tests."
    },
    {
      q: "Quels sont les moyens de paiement acceptés ?",
      a: "Mobile Money via CinetPay (Tmoney, Flooz, Wave selon les pays). Les tarifs sont affichés clairement avant validation."
    },
    {
      q: "Est-il vraiment possible d'utiliser KELIAA gratuitement ?",
      a: "Oui. L'offre Découverte permet de créer votre profil, compléter l'accueil et recevoir 3 suggestions / jour, avec 5 messages par conversation."
    },
    {
      q: "Puis-je changer d'offre plus tard ?",
      a: "Oui, vous pouvez passer de Premium à Premium+ à tout moment depuis la page des offres."
    },
    {
      q: "L'abonnement est-il renouvelé automatiquement ?",
      a: "Non. Le renouvellement est manuel. Chaque période dure 30 jours."
    }
  ];

  return (
    <CinematicLayout>
      <PageHero
          eyebrow="Tarifs"
          title="Investir dans une"
          highlight="rencontre sérieuse."
          subtitle="Choisir KELIAA, c'est choisir du temps, de la clarté et un accompagnement adapté — pas une consommation d'attention."
          imageSrc="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2000&auto=format&fit=crop"
          imageAlt="Engagement et alliance"
        />

      <section className="py-10 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop",
          ].map((src) => (
            <div key={src} className="relative h-36 rounded-xl overflow-hidden border border-border">
              <Image src={src} alt="" fill className="object-cover" sizes="400px" />
            </div>
          ))}
        </div>
      </section>

      <ExpertiseEncart
        className="max-w-7xl mx-auto mb-8"
        eyebrow="Investissement relationnel"
        title="Moins de hasard. Plus de discernement."
        body="Chaque offre débloque davantage de suggestions, de messages et d’outils pour approfondir une relation digne — jusqu’à l’accompagnement Premium+."
        imageSrc="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop"
        imageAlt="Alliance et engagement"
      />

      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
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
                <CheckoutPlanButton
                  planId={plan.id}
                  label={plan.button}
                  popular={plan.popular}
                  variant={plan.popular ? "primary" : "outline"}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 justify-between shadow-sm">
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-border shadow-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold text-foreground">Service d&apos;accompagnement</span>
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
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background h-11 px-6 text-sm font-semibold"
            >
              Réserver une session
            </a>
          </div>
        </div>
      </section>

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

      <section className="py-24 px-6 sm:px-12 text-center max-w-3xl mx-auto space-y-8">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Bien plus qu&apos;un abonnement.
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          En choisissant KELIAA, vous rejoignez des célibataires chrétiens qui veulent construire un mariage solide — pas accumuler des matches.
        </p>
        <MagneticButton href="/register" variant="primary" size="lg">
          Créer mon compte gratuit
        </MagneticButton>
      </section>
    </CinematicLayout>
  );
}
