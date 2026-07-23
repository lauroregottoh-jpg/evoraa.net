"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CinematicFooter() {
  return (
    <footer className="relative mt-24 bg-secondary/30 text-foreground rounded-t-3xl border-t border-border px-6 py-16 sm:py-24 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl relative z-10 space-y-16">
        
        {/* Top Grid Area */}
        <div className="grid gap-12 lg:grid-cols-12 justify-between border-b border-border/60 pb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                KELIA
              </span>
            </Link>

            <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed italic">
              « Vous ne recherchez pas simplement une rencontre. Vous recherchez LA personne avec qui construire un mariage solide selon les standards divins. »
            </p>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/90">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">Comment ça fonctionne</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Tarifs & Offres</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Journal & Inspirations</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Nous contacter</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/90">
                La Plateforme
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary transition-colors flex items-center gap-1">Rejoindre KELIA <ArrowUpRight className="h-3 w-3" /></Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Espace Membre</Link></li>
                <li><Link href="/onboarding" className="hover:text-primary transition-colors">Questionnaires spirituels</Link></li>
                <li><Link href="/compatibility" className="hover:text-primary transition-colors">Rencontres dignes</Link></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/90">
                Éthique & Dignité
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary transition-colors">Charte des 4 piliers</Link></li>
                <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité & Pudeur</Link></li>
                <li><Link href="/moderation" className="hover:text-primary transition-colors">Sécurité & Modération</Link></li>
                <li><Link href="/admin" className="text-primary/80 hover:underline transition-colors text-xs flex items-center gap-1">Console Admin</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <p className="font-serif">
            © {new Date().getFullYear()} KELIA. Tous droits réservés. Conçu avec dignité pour les célibataires chrétiens.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/confidentialite" className="hover:text-foreground transition-colors">Protection des données</Link>
            <Link href="/cgu" className="hover:text-foreground transition-colors">Conditions générales</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
