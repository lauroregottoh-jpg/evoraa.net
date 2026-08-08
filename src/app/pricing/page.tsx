"use client";

import * as React from "react";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { CheckoutPlanButton } from "@/components/billing/CheckoutPlanButton";
import { PageHero } from "@/components/marketing/PageHero";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Heart,
  Home,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PLANS, PUBLIC_PLAN_ORDER } from "@/lib/billing/plans";
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel";
import { PricingLoyaltyTeaser } from "@/components/loyalty/LoyaltyProgramCard";

/** Copy source: software-architecture/KELIA - Page d'accueil.docx — PAGE TARIFS */
const PLAN_DESCRIPTIONS: Record<string, string> = {
  free: "Gratuit pour commencer : profil, communauté, premiers matchs.",
  premium_plus:
    "Rapport vivant, Coffre Premium, fidélité, Matching complet et messages enrichis.",
};

const PILLARS = [
  {
    icon: Heart,
    title: "Compatibilité relationnelle",
    desc: "Communication, émotions, conflits, confiance.",
  },
  {
    icon: Sparkles,
    title: "Compatibilité spirituelle",
    desc: "Parcours de foi, convictions, pratique, vision chrétienne.",
  },
  {
    icon: Home,
    title: "Compatibilité des projets de vie",
    desc: "Mariage, famille, enfants, avenir.",
  },
  {
    icon: Leaf,
    title: "Compatibilité des valeurs",
    desc: "Principes, stewardship, priorités de vie.",
  },
  {
    icon: Users,
    title: "Compatibilité des personnalités",
    desc: "Personnalité, rythme, ouverture, fiabilité.",
  },
];

const ALLIANCE_COMPARE_ROWS = [
  {
    decouverte: "Aperçu du rapport (2–3 axes)",
    alliance: "Rapport Personnalisé Alliance™ (vivant)",
  },
  {
    decouverte: "Communauté : liker les membres",
    alliance: "Likes mutuels → messages + Matching enrichi",
  },
  {
    decouverte: "Compatibilité simplifiée",
    alliance: "5 piliers + score détaillé expliqué",
  },
  {
    decouverte: "Pas de Coffre Premium",
    alliance: "Coffre Premium · vignettes exclusives",
  },
  {
    decouverte: "Pas de programme fidélité",
    alliance: "Fidélité : +15 msgs, Boosts, Session VIP",
  },
  {
    decouverte: "Découverte de la plateforme",
    alliance: "Expérience complète orientée mariage",
  },
];

const NOUVEAUTES = [
  {
    title: "Communauté KELIAA",
    desc: "Découvrez les membres, likez avec intention. Un like mutuel débloque la conversation.",
  },
  {
    title: "Coffre Premium",
    desc: "Guides, journaux et prières en vignettes exclusives — 3 au choix, puis +2 chaque mois.",
  },
  {
    title: "Programme Fidélité Alliance",
    desc: "+15 messages à chaque renouvellement, paliers +30 + Boost, Session VIP à 12 mois.",
  },
  {
    title: "Matching à 5 piliers",
    desc: "Personnalité, foi, valeurs, projet de vie et relation — des compatibilités expliquées.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const plans = PUBLIC_PLAN_ORDER.map((id) => PLANS[id]);

  const faqs = [
    {
      q: "Pourquoi proposer une offre Alliance ?",
      a: "Parce que nous préférons investir dans la qualité des recommandations plutôt que dans la quantité des profils — Rapport vivant, Coffre Premium, Matching enrichi et fidélité.",
    },
    {
      q: "En quoi le Matching à 5 piliers est-il différent ?",
      a: "Il ne s'appuie pas uniquement sur vos préférences visibles. Il prend en compte votre personnalité, vos valeurs, votre foi, votre vision du mariage et votre projet de vie afin de proposer des compatibilités plus pertinentes.",
    },
    {
      q: "Comment fonctionne la Communauté ?",
      a: "Vous pouvez liker des membres. Un like mutuel débloque les messages. En Alliance, l’amitié même sexe peut être activée dans les paramètres.",
    },
    {
      q: "Qu’est-ce que le Programme Fidélité ?",
      a: "À chaque renouvellement Alliance : +15 messages bonus. Tous les 3 mois : +30 + Boost 24 h. À 12 mois : Session VIP. Les bonus restent même si vous revenez en Découverte (inactifs jusqu’à réactivation).",
    },
    {
      q: "Puis-je revenir à l'offre gratuite ?",
      a: "Bien sûr. Votre profil reste actif et vous pouvez changer d'offre à tout moment. Vos bonus fidélité sont conservés.",
    },
  ];

  const scrollToOffers = () => {
    document.getElementById("offres")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Tarifs"
        title="Trouver la bonne personne"
        highlight="vaut bien plus qu'un abonnement."
        subtitle="Alliance ouvre le Rapport Personnalisé Alliance™ et toute la puissance du Matching KELIAA™ à 5 piliers : une méthode unique qui va bien au-delà des photos et des critères superficiels pour vous proposer des personnes réellement compatibles avec votre foi, vos valeurs et votre projet de mariage."
        imageSrc="/home/hero-african-wedding.png"
        imageClassName="object-[center_32%] sm:object-center"
        imageAlt="Engagement"
      >
        <div className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton href="/register" variant="primary" size="lg">
              Créer gratuitement mon profil
            </MagneticButton>
            <MagneticButton
              type="button"
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
              onClick={scrollToOffers}
            >
              Découvrir Alliance
            </MagneticButton>
          </div>
          <p className="text-sm text-white/85">
            ✓ Rapport · ✓ Communauté · ✓ Coffre Premium · ✓ Fidélité Alliance · ✓ 5 piliers
          </p>
        </div>
      </PageHero>

      {/* Nouveautés produit */}
      <section className="py-14 px-6 sm:px-12 lg:px-20 bg-[#F8F4EE]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8B6914]">
              Jour 0 · Offre actuelle
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1C1412]">
              Tout ce que KELIAA propose aujourd&apos;hui
            </h2>
            <p className="text-sm text-[#1C1412]/65 leading-relaxed">
              Découverte pour commencer ; Alliance pour préparer sérieusement votre
              projet de mariage — avec les nouveautés déjà en production.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {NOUVEAUTES.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#B8954A]/25 bg-white px-5 py-5 space-y-2 shadow-card"
              >
                <h3 className="font-serif text-xl font-bold text-[#5C1F28]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#1C1412]/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi notre Matching est différent */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-12">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Notre différence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Pourquoi notre Matching est différent
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Les applications classiques vous proposent des profils principalement selon votre âge,
            votre localisation ou vos préférences visibles. Chez Keliaa, chaque recommandation
            repose sur notre Matching à 5 piliers, conçu pour identifier les bases d&apos;une
            relation durable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-secondary/40">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Applications classiques
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Critères visibles : âge, localisation, apparence",
                "Des centaines de profils à faire défiler",
                "Peu d'explication sur la compatibilité réelle",
                "Conversations souvent superficielles",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-accent bg-white shadow-elevated">
            <h3 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              KELIAA
            </h3>
            <ul className="space-y-3 text-sm text-foreground">
              {[
                "Matching à 5 piliers + Rapport Personnalisé",
                "Compatibilités expliquées, pas seulement un score",
                "Profils vérifiés dans un cadre respectueux",
                "Rencontres orientées vers le mariage",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-center text-foreground">
            Les 5 piliers du Matching KELIAA™
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className="p-5 rounded-xl border border-border bg-white shadow-card space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-accent font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <pillar.icon className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-serif font-bold text-foreground">{pillar.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-foreground font-medium italic font-serif">
            Parce qu&apos;une relation durable ne repose jamais sur un seul critère.
          </p>
        </div>
      </section>

      {/* Ce que vous obtenez avec Alliance */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center">
            Ce que vous obtenez avec Alliance
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/15">
            <div className="grid grid-cols-2 bg-black/20 text-xs font-semibold uppercase tracking-wide">
              <div className="px-4 py-3 border-r border-white/10">Découverte</div>
              <div className="px-4 py-3 text-accent">Alliance</div>
            </div>
            {ALLIANCE_COMPARE_ROWS.map((row) => (
              <div
                key={row.decouverte}
                className="grid grid-cols-2 border-t border-white/10 text-sm"
              >
                <div className="px-4 py-4 border-r border-white/10 text-white/75">
                  {row.decouverte}
                </div>
                <div className="px-4 py-4 font-medium">{row.alliance}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section id="offres" className="py-16 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => {
            const isHero = plan.id === "premium_plus";
            const description = PLAN_DESCRIPTIONS[plan.id] ?? plan.description;
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
                  <p className="text-sm text-muted-foreground">{description}</p>
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
                    Créer gratuitement mon profil
                  </MagneticButton>
                ) : (
                  <CheckoutPlanButton
                    planId={plan.id}
                    label="Choisir Alliance"
                    popular
                    variant="primary"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="px-6 max-w-3xl mx-auto -mt-4 mb-4">
        <PricingLoyaltyTeaser />
      </div>

      <TestimonialsCarousel />

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
        <div className="pt-6 text-center">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer gratuitement mon profil</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
