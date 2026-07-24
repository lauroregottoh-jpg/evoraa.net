"use client";

import * as React from "react";
import Link from "next/link";

export function CinematicFooter() {
  return (
    <footer className="relative mt-24 bg-secondary/30 text-foreground rounded-t-3xl border-t border-border px-6 py-16 sm:py-24 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl relative z-10 space-y-16">
        <div className="grid gap-12 lg:grid-cols-12 justify-between border-b border-border/60 pb-16">
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                KELIAA
              </span>
            </Link>
            <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed italic">
              « Vous ne recherchez pas simplement une rencontre. Vous recherchez L&apos;âme sœur
              avec qui construire un mariage solide selon les standards divins. »
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/90">
                Plateforme
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-primary transition-colors">
                    Comment ça fonctionne
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Journal d&apos;inspiration
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Nous contacter
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/90">
                Rejoindre
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-primary transition-colors">
                    Espace membre
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/90">
                Éthique
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                <li>
                  <Link href="/confidentialite" className="hover:text-primary transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cgu" className="hover:text-primary transition-colors">
                    Conditions Générales d&apos;Utilisation (CGU)
                  </Link>
                </li>
                <li>
                  <Link href="/charte" className="hover:text-primary transition-colors">
                    Notre charte
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p className="font-serif">
            © 2026 KELIAA. Tous droits réservés. Conçu avec amour pour les célibataires chrétiens.
          </p>
        </div>
      </div>
    </footer>
  );
}
