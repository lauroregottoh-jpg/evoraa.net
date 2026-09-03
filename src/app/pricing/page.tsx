"use client";

import * as React from "react";
import Link from "next/link";
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
  HeartHandshake,
  Home,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PLANS, PUBLIC_PLAN_ORDER } from "@/lib/billing/plans";
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel";
import { PricingLoyaltyTeaser } from "@/components/loyalty/LoyaltyProgramCard";
import { COUPLE_BRAND, COUPLE_TAGLINE } from "@/lib/couple/config";
import { COUPLE_OFFERS } from "@/lib/couple/offers";

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
    alliance: "Messages directs + Matching enrichi",
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
    decouverte: "Messages texte uniquement",
    alliance: "Messages + vocaux (dans KELIAA, max 60 s)",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const plans = PUBLIC_PLAN_ORDER.map((id) => PLANS[id]);
  const essential = COUPLE_OFFERS.couple_essential;
  const premium = COUPLE_OFFERS.couple_premium_plus;

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "celibataires" || hash === "couples" || hash === "offres") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const faqs = [
    {
      q: "KELIAA propose quoi exactement ?",
      a: "Deux portes : l’application pour célibataires (Découverte gratuite + Alliance) et KELYA Couple™, un bilan relationnel ponctuel pour couples déjà engagés.",
    },
    {
      q: "Pourquoi proposer une offre Alliance ?",
      a: "Parce que nous préférons investir dans la qualité des recommandations plutôt que dans la quantité des profils — Rapport vivant, Coffre Premium, Matching enrichi et fidélité.",
    },
    {
      q: "En quoi le Matching à 5 piliers est-il différent ?",
      a: "Il ne s'appuie pas uniquement sur vos préférences visibles. Il prend en compte personnalité, valeurs, foi, vision du mariage et projet de vie.",
    },
    {
      q: "KELYA Couple remplace-t-il Alliance ?",
      a: "Non. Alliance sert les célibataires. KELYA Couple est un bilan pour deux personnes déjà en couple — prix ponctuel, pas un abonnement mensuel.",
    },
    {
      q: "Qu’est-ce que le Programme Fidélité ?",
      a: "À chaque renouvellement Alliance : +15 messages bonus. Tous les 3 mois : +30 + Boost 24 h. À 12 mois : Session VIP.",
    },
  ];

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Tarifs"
        title="KELIAA propose aujourd’hui"
        highlight="deux portes d’entrée."
        subtitle="Pour les célibataires qui cherchent la bonne personne — Matching, Alliance, fidélité. Pour les couples déjà engagés — KELYA Couple™, un bilan relationnel à deux."
        imageSrc="/home/hero-african-wedding.png"
        imageClassName="object-[center_32%] sm:object-center"
        imageAlt="KELIAA"
      >
        <div className="pt-6 flex flex-wrap gap-3">
          <MagneticButton href="#celibataires" variant="primary" size="lg">
            Pour les célibataires
          </MagneticButton>
          <MagneticButton
            href="#couples"
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
          >
            Pour les couples
          </MagneticButton>
        </div>
      </PageHero>

      {/* Deux portes */}
      <section className="py-14 px-6 sm:px-12 lg:px-20 bg-[#F2EBE0]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-[#7F5557]">
              Choisissez votre parcours
            </h2>
            <p className="text-sm text-[#7F5557]/65 leading-relaxed">
              Cliquez pour aller directement à la section qui vous concerne.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="#celibataires"
              className="rounded-2xl border border-[#B8954A]/25 bg-white px-5 py-6 space-y-3 shadow-card hover:border-primary/40 transition-colors block"
            >
              <Users className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-xl font-bold text-[#7F5557]">
                Pour les célibataires
              </h3>
              <p className="text-sm text-[#7F5557]/70 leading-relaxed">
                Rencontrez la bonne personne : Matching à 5 piliers, Communauté,
                Rapport Alliance, Coffre Premium, programme Fidélité.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Voir cette section <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href="#couples"
              className="rounded-2xl border border-accent/35 bg-gradient-to-br from-white to-accent/10 px-5 py-6 space-y-3 shadow-card hover:border-accent/55 transition-colors block"
            >
              <HeartHandshake className="h-6 w-6 text-accent" />
              <h3 className="font-serif text-xl font-bold text-[#7F5557]">
                Pour les couples — {COUPLE_BRAND}
              </h3>
              <p className="text-sm text-[#7F5557]/70 leading-relaxed">
                {COUPLE_TAGLINE}. Bilan ponctuel pour fiancés, cheminants et
                mariés — pas un abonnement.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Voir cette section <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ——— CÉLIBATAIRES ——— */}
      <section
        id="celibataires"
        className="py-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-12 scroll-mt-28"
      >
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Application KELIAA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Pour les célibataires — rencontrer la bonne personne
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Les apps classiques vous proposent des profils selon l’âge ou
            l’apparence. Chez KELIAA, chaque recommandation repose sur un Matching
            à 5 piliers, conçu pour identifier les bases d’une relation durable.
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
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12 lg:px-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center">
            Découverte vs Alliance
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

      <section
        id="offres"
        className="py-16 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto scroll-mt-24"
      >
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-serif text-3xl font-bold">Offres célibataires</h2>
          <p className="text-sm text-muted-foreground">
            Commencez gratuitement. Passez Alliance quand vous êtes prêts.
          </p>
        </div>
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
                    {plan.amountXof === 0 ? (
                      <span className="font-serif text-4xl font-bold text-primary">
                        Gratuit
                      </span>
                    ) : (
                      <>
                        <span className="font-serif text-4xl font-bold text-primary">
                          {plan.amountXof.toLocaleString("fr-FR")}
                        </span>
                        <span className="text-sm text-muted-foreground mb-1">
                          FCFA {plan.periodLabel}
                        </span>
                      </>
                    )}
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

      {/* ——— COUPLES ——— */}
      <section
        id="couples"
        className="py-16 px-6 sm:px-12 lg:px-20 bg-secondary scroll-mt-28"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A5F28]">
              {COUPLE_BRAND}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              Pour les couples — bilan relationnel
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vous ne recevez pas juste un score : compréhension, priorités et
              plan d’action. Tarif de lancement pour vous deux.
            </p>
            <Link
              href="/couple"
              className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Lire la page de présentation complète →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#7F5557]/15 bg-[#F2EBE0] p-6 sm:p-8 flex flex-col gap-4">
              <h3 className="font-serif text-2xl font-bold">
                {essential.marketingName}
              </h3>
              <div>
                <p className="text-xs text-muted-foreground line-through">
                  {(essential.compareAtXof ?? 20_000).toLocaleString("fr-FR")}{" "}
                  FCFA
                </p>
                <p className="font-serif text-3xl font-bold text-primary">
                  {essential.amountXof.toLocaleString("fr-FR")}{" "}
                  <span className="text-base font-sans font-medium text-muted-foreground">
                    FCFA
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  soit{" "}
                  {Math.round(essential.amountXof / 2).toLocaleString("fr-FR")}{" "}
                  FCFA par personne — pour vous deux
                </p>
              </div>
              <ul className="space-y-2 text-sm flex-1">
                {essential.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <MagneticButton href="/couple/offre" variant="outline" className="w-full">
                Choisir Premium
              </MagneticButton>
            </article>

            <article className="rounded-2xl border-2 border-accent bg-[#F2EBE0] p-6 sm:p-8 flex flex-col gap-4 shadow-elevated relative">
              <span className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-3 py-1 rounded-full">
                Le plus choisi
              </span>
              <h3 className="font-serif text-2xl font-bold">
                {premium.marketingName}
              </h3>
              <div>
                <p className="text-xs text-muted-foreground line-through">
                  {(premium.compareAtXof ?? 50_000).toLocaleString("fr-FR")} FCFA
                </p>
                <p className="font-serif text-3xl font-bold text-primary">
                  {premium.amountXof.toLocaleString("fr-FR")}{" "}
                  <span className="text-base font-sans font-medium text-muted-foreground">
                    FCFA
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  soit{" "}
                  {Math.round(premium.amountXof / 2).toLocaleString("fr-FR")}{" "}
                  FCFA par personne — tarif de lancement
                </p>
              </div>
              <ul className="space-y-2 text-sm flex-1">
                {premium.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <MagneticButton href="/couple/offre" variant="primary" className="w-full">
                Choisir Premium Plus
              </MagneticButton>
            </article>
          </div>
        </div>
      </section>

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
        <div className="pt-6 text-center flex flex-wrap gap-3 justify-center">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer mon profil célibataire</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="/couple" variant="outline" size="lg">
            Découvrir {COUPLE_BRAND}
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
