"use client";

import * as React from "react";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { CheckoutPlanButton } from "@/components/billing/CheckoutPlanButton";
import { PageHero } from "@/components/marketing/PageHero";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { PLANS, PUBLIC_PLAN_ORDER } from "@/lib/billing/plans";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const plans = PUBLIC_PLAN_ORDER.map((id) => PLANS[id]);

  const faqs = [
    {
      q: "Puis-je utiliser KELIAA gratuitement ?",
      a: "Oui. Découverte est gratuite pour toujours : profil, tests, suggestions limitées, et vous pouvez répondre aux messages reçus. Alliance accélère le matching.",
    },
    {
      q: "Pourquoi un seul plan payant ?",
      a: "Pour rester clair : Free pour commencer, Alliance pour accélérer. Moins d'hésitation, plus de clarté sur la valeur.",
    },
    {
      q: "Quels paiements acceptez-vous ?",
      a: "Mobile Money via CinetPay (selon les pays). Les montants sont affichés avant validation.",
    },
    {
      q: "L'abonnement se renouvelle-t-il tout seul ?",
      a: "Non. Renouvellement manuel, période de 30 jours. Vous êtes notifié avant expiration.",
    },
  ];

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Tarifs"
        title="Gratuit pour commencer."
        highlight="Alliance pour accélérer."
        subtitle="Deux chemins, une intention : rencontrer L'âme sœur grâce au matching à 3 piliers — pas au swipe."
        imageSrc="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Engagement"
      />

      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => {
            const isHero = plan.id === "premium_plus";
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative p-8 rounded-2xl border bg-white flex flex-col",
                  isHero ? "border-2 border-accent shadow-elevated" : "border-border"
                )}
              >
                {isHero && (
                  <span className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-3 py-1 rounded-full">
                    Recommandé
                  </span>
                )}
                <div className="space-y-2 mb-6">
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    {isHero && <Sparkles className="h-5 w-5 text-accent" />}
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-end gap-2 pt-2">
                    {plan.compareAtXof ? (
                      <span className="text-lg text-muted-foreground line-through">
                        {plan.compareAtXof.toLocaleString("fr-FR")}
                      </span>
                    ) : null}
                    <span className="font-serif text-4xl font-bold text-primary">
                      {plan.amountXof === 0 ? "0" : plan.amountXof.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">
                      {plan.amountXof === 0 ? "FCFA" : `FCFA ${plan.periodLabel}`}
                    </span>
                  </div>
                  {plan.amountXof === 0 ? (
                    <p className="text-xs text-muted-foreground">{plan.periodLabel}</p>
                  ) : plan.compareAtXof ? (
                    <p className="text-xs text-accent font-semibold">
                      Tarif de lancement · prix normal{" "}
                      {plan.compareAtXof.toLocaleString("fr-FR")} FCFA / mois
                    </p>
                  ) : null}
                </div>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4 shrink-0 mt-0.5",
                          isHero ? "text-accent" : "text-primary"
                        )}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.id === "free" ? (
                  <MagneticButton href="/register" variant="outline" className="w-full">
                    Commencer gratuitement
                  </MagneticButton>
                ) : (
                  <CheckoutPlanButton
                    planId={plan.id}
                    label={`Choisir ${plan.name}`}
                    popular
                    variant="primary"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 px-6 max-w-3xl mx-auto space-y-4">
        <h2 className="font-serif text-2xl font-bold text-center">Questions fréquentes</h2>
        {faqs.map((faq, i) => (
          <div key={faq.q} className="border border-border rounded-xl bg-white overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              {faq.q}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", openFaq === i && "rotate-180")}
              />
            </button>
            {openFaq === i && (
              <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </section>
    </CinematicLayout>
  );
}
