"use client";

import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
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
  Headphones,
  HelpCircle,
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
        subtitle="Que vous ayez une question sur KELIAA, besoin d'un conseil ou souhaitiez signaler une situation, notre équipe est là pour vous accompagner avec bienveillance, confidentialité et respect."
        imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Équipe à l'écoute"
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

      {/* 1. Trouvez rapidement votre réponse */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Trouvez rapidement votre réponse
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl border border-border bg-white shadow-card space-y-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">FAQ</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consultez les réponses aux questions les plus fréquentes.
            </p>
            <MagneticButton href="/how-it-works" variant="outline" size="md">
              Voir la FAQ
            </MagneticButton>
          </div>
          <div className="p-8 rounded-2xl border border-accent/30 bg-accent/5 shadow-card space-y-4">
            <div className="h-11 w-11 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">EVA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Obtenez une réponse immédiate grâce à notre assistante intelligente.
            </p>
            <MagneticButton href="#eva" variant="primary" size="md">
              Discuter avec EVA
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 2. Besoin d'un échange humain ? */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Besoin d&apos;un échange humain ?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Certaines questions méritent une écoute attentive. Notre équipe de coachs, de
            conseillers et de support est disponible pour vous répondre avec discrétion et
            bienveillance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-white shadow-card space-y-3">
            <div className="p-3 rounded-md bg-primary/10 text-primary w-fit">
              <Mail className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Support</h4>
            <p className="text-sm text-muted-foreground">
              Questions liées à votre compte, votre abonnement ou au fonctionnement de KELIAA.
            </p>
            <a href="mailto:contact@keliaa.net" className="text-sm text-primary font-semibold">
              contact@keliaa.net
            </a>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-white shadow-card space-y-3">
            <div className="p-3 rounded-md bg-accent/15 text-accent w-fit">
              <Headphones className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Coachs &amp; conseillers
            </h4>
            <p className="text-sm text-muted-foreground">
              Des questions concernant votre parcours, le discernement ou votre expérience sur la
              plateforme.
            </p>
            <a href="mailto:conseil@keliaa.net" className="text-sm text-primary font-semibold">
              conseil@keliaa.net
            </a>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-white shadow-card space-y-3">
            <div className="p-3 rounded-md bg-primary/10 text-primary w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Éthique &amp; signalement
            </h4>
            <p className="text-sm text-muted-foreground">
              Signalez un comportement inapproprié ou une situation qui vous préoccupe.
            </p>
            <a href="mailto:ethique@keliaa.net" className="text-sm text-primary font-semibold">
              ethique@keliaa.net
            </a>
          </div>
        </div>
      </section>

      {/* 3. Formulaire */}
      <section id="form" className="py-16 px-6 sm:px-12 lg:px-20 max-w-3xl mx-auto scroll-mt-24">
        <div className="p-8 sm:p-10 rounded-lg border border-border bg-white shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover"
              aria-hidden
            />
          </div>
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
                <h3 className="font-serif text-2xl font-bold text-foreground">Écrivez-nous</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Expliquez-nous votre demande. Nous reviendrons vers vous dans les meilleurs
                  délais.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Plus votre message est précis, plus notre réponse pourra être adaptée.
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
      </section>

      {/* 4. EVA — framing adouci */}
      <section id="eva" className="py-12 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto space-y-6 scroll-mt-24">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">EVA</span>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Besoin d&apos;une réponse immédiate ?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Posez votre question à EVA. Elle peut vous aider à comprendre le fonctionnement de
            KELIAA, répondre à vos questions sur le discernement chrétien et vous orienter vers les
            bonnes ressources.
          </p>
        </div>
        <EvaSpiritualAdvisor showQuota={false} topicsLabel="Suggestions de questions" />
      </section>

      {/* 5. Closing */}
      <section className="py-16 px-6 text-center space-y-6 max-w-2xl mx-auto border-t border-border">
        <MessageSquare className="h-8 w-8 text-accent mx-auto" />
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Derrière KELIAA, il y a des personnes qui vous écoutent.
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
