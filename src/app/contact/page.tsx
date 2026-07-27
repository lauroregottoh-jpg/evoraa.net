"use client";

import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
import { EvaSpiritualAdvisor } from "@/components/spiritual/EvaSpiritualAdvisor";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Mail, MessageSquare, ShieldCheck, Send, CheckCircle2, Headphones } from "lucide-react";
import { submitContactAction } from "@/app/actions/contact";

export default function ContactPage() {
  return (
    <Suspense fallback={<CinematicLayout><div className="pt-32 text-center text-sm text-muted-foreground">Chargement…</div></CinematicLayout>}>
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

  return (
    <CinematicLayout>
      {/* 1. Réponse immédiate — tout en haut */}
      <section className="relative z-10 pt-28 pb-8 px-6 text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Besoin d&apos;une réponse rapide ?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Les FAQ répondent souvent en deux minutes. Sinon, écrivez-nous : nos coachs et
            conseillers reviennent vers vous sous 24&nbsp;h.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <MagneticButton href="/how-it-works" variant="secondary" size="md">
              FAQ Fonctionnement
            </MagneticButton>
            <MagneticButton href="/pricing" variant="secondary" size="md">
              FAQ Tarifs
            </MagneticButton>
          </div>
        </section>

      {/* 2. Header */}
      <PageHero
        eyebrow="Contact"
        title="Nous sommes là pour"
        highlight="vous écouter."
        subtitle="Question plateforme, conseil relationnel ou signalement : une équipe humaine et bienveillante."
        imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Équipe à l'écoute"
      />

      {/* 3. Encart contact + formulaire */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-8 p-8 sm:p-10 rounded-lg border border-border bg-primary text-primary-foreground shadow-elevated">
            <h3 className="font-serif text-2xl font-bold">Canaux de contact</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Échanges humains avec nos coachs et conseillers — formulaire ou e-mail direct.
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-accent/20 text-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Support</h4>
                  <p className="text-sm mt-0.5 text-accent">contact@keliaa.net</p>
                  <p className="text-[11px] text-primary-foreground/70 mt-1">Technique & abonnements</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-white/10 text-accent shrink-0">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Coachs & conseillers</h4>
                  <p className="text-sm mt-0.5 text-accent">conseil@keliaa.net</p>
                  <p className="text-[11px] text-primary-foreground/70 mt-1">
                    Accompagnement relationnel & discernement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-white/10 text-accent shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Éthique</h4>
                  <p className="text-sm mt-0.5 text-accent">ethique@keliaa.net</p>
                  <p className="text-[11px] text-primary-foreground/70 mt-1">Signalement confidentiel</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-10 rounded-lg border border-border bg-white shadow-card relative overflow-hidden">
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Tous les champs sont utiles pour vous répondre précisément.
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
                <MagneticButton type="submit" variant="primary" size="lg" className="w-full" disabled={sending}>
                  <span>{sending ? "Envoi…" : "Envoyer mon message"}</span>
                  <Send className="h-4 w-4 ml-1" />
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. EVA */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">EVA</span>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Conseils & réponses rapides
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Pour une orientation immédiate sur le discernement et la vie de couple chrétien.
          </p>
        </div>
        <EvaSpiritualAdvisor />
      </section>

      {/* 5. Rappel contact humain */}
      <section className="py-16 px-6 text-center space-y-4 max-w-2xl mx-auto">
        <MessageSquare className="h-8 w-8 text-accent mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-foreground">
          Préférez un échange humain ?
        </h3>
        <p className="text-sm text-muted-foreground">
          Utilisez le formulaire ci-dessus : notre équipe de coachs et de conseillers vous répond
          personnellement, avec bienveillance et discrétion.
        </p>
      </section>
    </CinematicLayout>
  );
}
