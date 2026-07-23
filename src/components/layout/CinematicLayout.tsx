"use client";

import * as React from "react";
import { CinematicNavbar } from "@/components/layout/CinematicNavbar";
import { CinematicFooter } from "@/components/layout/CinematicFooter";
import { DevSessionSwitcher } from "@/components/dev/DevSessionSwitcher";

interface CinematicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function CinematicLayout({ children, showFooter = true }: CinematicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <CinematicNavbar />
      <main className="flex-1 w-full">{children}</main>
      {process.env.NODE_ENV === "development" && <DevSessionSwitcher />}
      {showFooter && <CinematicFooter />}
    </div>
  );
}
