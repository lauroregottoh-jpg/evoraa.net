"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/evoraa/ThemeToggle";
import { cn } from "@/utils/cn";

import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";

interface MainLayoutProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  className?: string;
  showFooter?: boolean;
}

export function MainLayout({
  children,
  maxWidth = "7xl",
  className,
  showFooter = true,
}: MainLayoutProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case "sm": return "max-w-sm";
      case "md": return "max-w-md";
      case "lg": return "max-w-lg";
      case "xl": return "max-w-xl";
      case "2xl": return "max-w-2xl";
      case "3xl": return "max-w-3xl";
      case "4xl": return "max-w-4xl";
      case "5xl": return "max-w-5xl";
      case "6xl": return "max-w-6xl";
      case "full": return "max-w-full";
      default: return "max-w-7xl";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-gradient">
                KELIAA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {process.env.NODE_ENV === "development" && (
              <Link
                href="/design-system"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
              >
                Design system
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area - Responsive Container */}
      <main
        className={cn(
          "flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
          getMaxWidthClass(),
          className
        )}
      >
        {children}
      </main>

      {false && process.env.NODE_ENV === "development" && <DevSessionSwitcher />}

      {showFooter && (
        <footer className="w-full border-t border-border/40 bg-background py-8 text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-serif">
              © {new Date().getFullYear()} KELIAA. Rencontres chrétiennes fondées sur le respect et la compatibilité.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/cgu" className="hover:underline">CGU</Link>
              <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
              <Link href="/moderation" className="hover:underline">Sécurité</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

