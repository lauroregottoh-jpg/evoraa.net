"use client";

import * as React from "react";
import Image from "next/image";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { ExpertiseEncart } from "@/components/marketing/ExpertiseEncart";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Mail, MessageSquare, ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import { submitContactAction } from "@/app/actions/contact";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "question",
    message: "",
  });

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
      <section className="relative pt-36 pb-12 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto text-center space-y-6">
        <span className="inline-block text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-secondary text-primary border border-border font-semibold">
          Équipe & support
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Nous sommes là pour{" "}
          <span className="italic font-normal text-primary">vous écouter.</span>
        </h1>
        <p className="font-sans text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Question plateforme, conseil pastoral ou signalement : réponse sous 24&nbsp;h, avec bienveillance.
        </p>
      </section>

      <ExpertiseEncart
        className="max-w-7xl mx-auto mb-12"
        eyebrow="Présence humaine"
        title="Une équipe qui veille sur la dignité des échanges."
        body="Support, éthique et accompagnement pastoral travaillent ensemble pour que chaque membre se sente en sécurité sur KELIA."
        imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
        imageAlt="Communauté en conversation"
      />

      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-8 p-8 sm:p-10 rounded-lg border border-border bg-primary text-primary-foreground shadow-elevated">
            <h3 className="font-serif text-2xl font-bold">Canaux de contact</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Échanges humains et attentionnés — formulaire ou e-mail direct.
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-accent/20 text-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Support</h4>
                  <p className="text-sm mt-0.5 text-accent">contact@kelia.net</p>
                  <p className="text-[11px] text-primary-foreground/70 mt-1">Technique & abonnements</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-white/10 text-accent shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Conseil pastoral</h4>
                  <p className="text-sm mt-0.5 text-accent">pasteurs@kelia.net</p>
                  <p className="text-[11px] text-primary-foreground/70 mt-1">Discernement & mentorat</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-white/10 text-accent shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Éthique</h4>
                  <p className="text-sm mt-0.5 text-accent">ethique@kelia.net</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Tous les champs sont utiles pour vous répondre précisément.</p>
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
                    <option value="pastoral">Conseil pastoral</option>
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

      <section className="py-16 px-6 text-center space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Besoin d&apos;une réponse immédiate ?
        </h3>
        <div className="flex justify-center gap-4 flex-wrap">
          <MagneticButton href="/how-it-works" variant="secondary" size="md">
            FAQ Fonctionnement
          </MagneticButton>
          <MagneticButton href="/pricing" variant="secondary" size="md">
            FAQ Tarifs
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
