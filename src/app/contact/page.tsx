"use client";

import * as React from "react";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Mail, MessageSquare, ShieldCheck, Send, CheckCircle2, HelpCircle, Phone, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";

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
      {/* HERO CONTACT */}
      <section className="relative pt-36 pb-16 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto text-center space-y-6">
        <span className="inline-block text-xs font-mono uppercase tracking-widest px-4 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-semibold">
          Équipe Pastorale & Support
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
          Nous sommes là pour <br />
          <span className="italic font-normal text-accent">vous écouter.</span>
        </h1>
        <p className="font-sans text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Une question sur la plateforme, un conseil pastoral, ou un retour d&apos;expérience ? Notre équipe vous répond avec bienveillance sous 24 heures.
        </p>
      </section>

      {/* FORM & INFO GRID */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-8 p-8 sm:p-10 rounded-[3rem] bg-[#12121A] border border-border/40 shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-white">Canaux de communication dignes</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Nous privilégions des échanges humains et attentionnés. Vous pouvez nous écrire via le formulaire ou directement par email.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-accent/15 border border-accent/30 text-accent shrink-0 mt-1">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">Email Support 24/7</h4>
                  <p className="text-sm font-sans text-primary mt-0.5">contact@kelia.net</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Assistance technique & abonnements</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0 mt-1">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">Conseil Pastoral</h4>
                  <p className="text-sm font-mono text-purple-300 mt-0.5">pasteurs@kelia.net</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Discernement spirituel & mentorat</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-1">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">Modération & Éthique</h4>
                  <p className="text-sm font-mono text-emerald-300 mt-0.5">ethique@kelia.net</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Signalement confidentiel</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/30 text-xs text-muted-foreground italic">
              « Que votre parole soit toujours accompagnée de grâce, assaisonnée de sel... » (Colossiens 4:6)
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-[3.5rem] bg-[#14141E] border border-border/50 shadow-2xl relative">
            {submitted ? (
              <div className="py-16 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white">Message envoyé avec grâce !</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Merci de nous avoir écrit. Notre équipe de support ou nos conseillers pastoraux reviendront vers vous très rapidement sur votre adresse email.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "question", message: "" });
                    }}
                    className="px-6 py-3 rounded-full bg-secondary/60 text-xs font-semibold text-white hover:bg-secondary transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-white">Écrivez-nous</h3>
                  <p className="text-xs text-muted-foreground">Remplissez les champs ci-dessous pour joindre notre équipe.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/90">Nom / Prénom</label>
                    <input
                      required
                      type="text"
                      placeholder="Votre nom complet"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#1A1A28] border border-border/60 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/90">Adresse email</label>
                    <input
                      required
                      type="email"
                      placeholder="vous@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#1A1A28] border border-border/60 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90">Sujet de votre message</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#1A1A28] border border-border/60 text-white focus:outline-none focus:border-accent text-sm"
                  >
                    <option value="question" className="bg-[#12121A]">Question sur le fonctionnement</option>
                    <option value="pastoral" className="bg-[#12121A]">Demande de conseil pastoral / spirituel</option>
                    <option value="billing" className="bg-[#12121A]">Question sur les abonnements / tarifs</option>
                    <option value="report" className="bg-[#12121A]">Signalement ou question éthique</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90">Votre message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Détaillez votre question ou votre témoignage ici..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#1A1A28] border border-border/60 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent text-sm resize-none"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  {error && (
                    <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-xl p-3">
                      {error}{" "}
                      <a href="mailto:contact@kelia.net" className="underline">
                        contact@kelia.net
                      </a>
                    </p>
                  )}
                  <MagneticButton type="submit" variant="primary" size="lg" className="w-full" disabled={sending}>
                    <span>{sending ? "Envoi…" : "Envoyer mon message"}</span>
                    <Send className="h-4 w-4 ml-1" />
                  </MagneticButton>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* FAQ RAPIDE */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto space-y-8 text-center">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Vous cherchez une réponse immédiate ?
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Consultez notre foire aux questions détaillée sur la page Fonctionnement ou Tarifs pour obtenir des réponses instantanées.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <MagneticButton href="/how-it-works" variant="secondary" size="md">
            <span>FAQ Fonctionnement</span>
          </MagneticButton>
          <MagneticButton href="/pricing" variant="secondary" size="md">
            <span>FAQ Tarifs</span>
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
