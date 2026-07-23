"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <MainLayout maxWidth="3xl">
      <div className="space-y-6 py-6">
        <div className="space-y-2">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Sprint 6 : Mon Espace Personnel
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Édition de votre Profil Sacré
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Consultez et enrichissez votre témoignage de foi et votre vision conjugale pour maximiser votre harmonie.
          </p>
        </div>

        <ProfileEditor />
      </div>
    </MainLayout>
  );
}
