"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/utils/cn";
import { Menu, X } from "lucide-react";

export function CinematicNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Fonctionnement", href: "/how-it-works" },
    { name: "KELYA Couple", href: "/couple" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-6 sm:gap-10 px-6 py-3.5 rounded-2xl transition-all duration-500 ease-out border",
            scrolled || pathname !== "/"
              ? "bg-background/85 backdrop-blur-2xl border-border/40 shadow-premium text-foreground py-3"
              : "bg-black/25 backdrop-blur-md text-white border-white/20 py-4"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span
              className={cn(
                "font-serif text-2xl sm:text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-105",
                scrolled || pathname !== "/" ? "text-primary" : "text-white"
              )}
            >
              KELIAA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-xs sm:text-sm font-medium transition-colors duration-300 select-none",
                    scrolled || pathname !== "/"
                      ? active
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                      : active
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white"
                  )}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "text-xs font-medium transition-colors px-3 py-2",
                scrolled || pathname !== "/"
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/85 hover:text-white"
              )}
            >
              Connexion
            </Link>
            <MagneticButton href="/register" variant="primary" size="sm">
              <span className="font-semibold text-xs">Créer mon compte</span>
            </MagneticButton>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-full transition-colors",
              scrolled || pathname !== "/"
                ? "text-foreground/80 hover:text-foreground hover:bg-secondary/40"
                : "text-white hover:bg-white/10"
            )}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col justify-center items-center gap-8 px-6 py-12 md:hidden animate-in fade-in zoom-in-95 duration-300">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="font-serif text-4xl font-bold tracking-tight text-primary mb-4"
          >
            KELIAA
          </Link>

          <div className="flex flex-col items-center gap-6 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-xl font-serif tracking-wide transition-colors",
                  pathname === link.href ? "text-primary font-bold" : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col w-full max-w-xs gap-3 pt-6 border-t border-border/30">
            <MagneticButton href="/register" variant="primary" size="md" className="w-full">
              <span>Créer mon compte</span>
            </MagneticButton>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 rounded-lg border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
