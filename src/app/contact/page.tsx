"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
import { EvaSpiritualAdvisor } from "@/components/spiritual/EvaSpiritualAdvisor";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { submitContactAction } from "@/app/actions/contact";

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <CinematicLayout>
          <div className="pt-32 text-center text-sm text-muted-foreground">Chargement…</div>
        </CinematicLayout>
      }
    >
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "question",
    message: "",
  });

  React.useEffect(() => {
    const subject = searchParams.get("subject");
    const moduleTitle = searchParams.get("moduleTitle");
    const moduleId = searchParams.get("module");
    if (subject === "coaching" || moduleTitle) {
      setFormData((prev) => ({
        ...prev,
        subject: "coaching",
        message: moduleTitle
          ? `Bonjour,\n\nJe souhaite un coaching sur le thème : ${moduleTitle}${
              moduleId ? ` (${moduleId})` : ""
            }.\n\nDisponibilités / WhatsApp :\n`
          : prev.message,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const result = await submitContactAction(formData);
    setSending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Contact"
        title="Vous n'êtes jamais seul"
        highlight="dans votre parcours."
        subtitle="Que vous ayez une question sur Keliaa, besoin d'un conseil ou souhaitiez signaler une situation, notre équipe est là pour vous accompagner avec bienveillance, confidentialité et respect."
        imageSrc="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=85&w=2000&auto=format&fit=crop"
        imageAlt="Conseillère KELIAA disponible pour accompagner les membres"
        imageClassName="object-center"
      >
        <div className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton href="/how-it-works" variant="primary" size="lg">
              Consulter la FAQ
            </MagneticButton>
            <MagneticButton
              type="button"
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md"
              onClick={scrollToForm}
            >
              Nous écrire
            </MagneticButton>
          </div>
          <p className="text-sm text-white/85">
            ✓ Réponse sous 24 h · ✓ Équipe humaine · ✓ Confidentialité garantie
          </p>
        </div>
      </PageHero>

      {/* Contact humain : coordonnées + formulaire */}
      <section id="form" className="py-20 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto scroll-mt-24">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-stretch">
          <div className="rounded-3xl bg-primary p-8 sm:p-10 text-white shadow-elevated flex flex-col">
            <div className="h-12 w-12 rounded-2xl bg-white/12 flex items-center justify-center">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="mt-7 font-serif text-3xl font-bold">Besoin d&apos;un échange humain ?</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Écrivez-nous simplement. Votre demande sera lue par une personne de notre équipe et
              la réponse vous sera envoyée par e-mail.
            </p>

            <div className="mt-8 space-y-5">
              <div className="border-t border-white/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Question générale</p>
                <a href="mailto:contact@KELIAA.net" className="mt-1 inline-block font-semibold hover:text-accent">
                  contact@KELIAA.net
                </a>
              </div>
              <div className="border-t border-white/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Conseil &amp; parcours</p>
                <a href="mailto:conseil@KELIAA.net" className="mt-1 inline-block font-semibold hover:text-accent">
                  conseil@KELIAA.net
                </a>
              </div>
              <div className="border-t border-white/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">Éthique &amp; signalement</p>
                <a href="mailto:ethique@KELIAA.net" className="mt-1 inline-block font-semibold hover:text-accent">
                  ethique@KELIAA.net
                </a>
              </div>
            </div>

            <div className="mt-auto pt-10 flex items-center gap-2 text-xs text-white/70">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Réponse sous 24 h · Échange confidentiel
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl border border-border bg-white shadow-card">
          {submitted ? (
            <div className="py-12 text-center space-y-4 relative z-10">
              <div className="h-14 w-14 rounded-full bg-accent/15 text-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-foreground">Message envoyé</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Nous vous répondrons rapidement à l&apos;adresse indiquée.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "question", message: "" });
                }}
                className="text-xs font-semibold text-primary underline"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Formulaire de contact</span>
                <h3 className="mt-2 font-serif text-3xl font-bold text-foreground">Comment pouvons-nous vous aider ?</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Remplissez ces quelques champs. Nous vous répondrons directement par e-mail.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Nom / Prénom</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sujet</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="question">Fonctionnement</option>
                  <option value="coaching">Conseil / coaching</option>
                  <option value="billing">Abonnements</option>
                  <option value="report">Éthique / signalement</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {error && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
                  {error}
                </p>
              )}
              <MagneticButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={sending}
              >
                <span>{sending ? "Envoi…" : "Envoyer mon message"}</span>
                <Send className="h-4 w-4 ml-1" />
              </MagneticButton>
            </form>
          )}
          </div>
        </div>
      </section>

      {/* EVA : réponse immédiate */}
      <section id="eva" className="py-16 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto space-y-6 scroll-mt-24">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-4 w-4" /> EVA
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Besoin d&apos;une réponse immédiate ?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Posez votre question à EVA, notre assistant guidé. Elle propose des réponses préparées
            sur le fonctionnement de Keliaa et le discernement — sans remplacer un conseiller
            humain.
          </p>
        </div>
        <EvaSpiritualAdvisor showQuota={false} topicsLabel="Suggestions de questions" />
      </section>

      {/* 5. Closing */}
      <section className="py-16 px-6 text-center space-y-6 max-w-2xl mx-auto border-t border-border">
        <MessageSquare className="h-8 w-8 text-accent mx-auto" />
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Derrière Keliaa, il y a des personnes qui vous écoutent.
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Même si EVA peut répondre à de nombreuses questions, certaines situations méritent une
          attention particulière. Notre équipe prend le temps de lire chaque message afin de vous
          apporter une réponse adaptée, dans le respect de votre confidentialité.
        </p>
        <MagneticButton type="button" variant="primary" size="md" onClick={scrollToForm}>
          Nous écrire
        </MagneticButton>
      </section>
    </CinematicLayout>
  );
}
