"use client";

import * as React from "react";
import { Image as ImageIcon, CheckCircle2, XCircle, ShieldAlert, Sparkles, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PendingPhoto {
  id: string;
  userName: string;
  userEmail: string;
  photoUrl: string;
  isPrimary: boolean;
  uploadedAt: string;
}

const INITIAL_QUEUE: PendingPhoto[] = [
  {
    id: "photo-1",
    userName: "Suspect Spam",
    userEmail: "suspect.spam@kellia.org",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop",
    isPrimary: true,
    uploadedAt: "Il y a 12 minutes",
  },
  {
    id: "photo-2",
    userName: "Thomas Bernard",
    userEmail: "thomas.bernard@kellia.org",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop",
    isPrimary: false,
    uploadedAt: "Il y a 2 heures",
  },
];

export function AdminPhotoQueue() {
  const [queue, setQueue] = React.useState<PendingPhoto[]>(INITIAL_QUEUE);
  const [rejectingId, setRejectingId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState<string>("Photo trop sombre ou visage non reconnaissable.");

  const handleApprove = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    setRejectingId(null);
  };

  return (
    <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-amber-500" /> File d&apos;Attente des Photos ({queue.length})
          </CardTitle>
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0">
            Validation manuelle (Respect V1)
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Chaque photo soumise par un membre doit être vérifiée pour garantir le sérieux et la clarté de la plateforme.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {queue.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground">File d&apos;attente vide</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Toutes les photos des profils actifs ont été vérifiées et approuvées par l&apos;équipe de modération.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {queue.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/60 bg-secondary/30 overflow-hidden flex flex-col justify-between">
                
                <div className="relative aspect-4/3 w-full bg-secondary overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photoUrl}
                    alt={item.userName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.isPrimary && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] shadow-sm border-0">
                      Photo Principale
                    </Badge>
                  )}
                  <span className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-muted-foreground">
                    {item.uploadedAt}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{item.userName}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.userEmail}</p>
                  </div>

                  {rejectingId === item.id ? (
                    <div className="space-y-2.5 pt-2 border-t border-border/40">
                      <label className="text-[10px] font-semibold text-destructive block uppercase tracking-wider">
                        Motif du rejet (notifié au membre)
                      </label>
                      <select
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full text-xs h-8 px-2 rounded-lg bg-background border border-border text-foreground"
                      >
                        <option value="Photo trop sombre ou visage non reconnaissable.">Visage flou ou non visible</option>
                        <option value="Présence d'autres personnes ou enfants sur la photo.">Présence de tiers/enfants</option>
                        <option value="Contenu inapproprié ou contraire à la dignité d'Kellia.">Contenu inapproprié</option>
                      </select>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReject(item.id)}
                          size="sm"
                          className="flex-1 h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-medium rounded-lg"
                        >
                          Confirmer le rejet
                        </Button>
                        <Button
                          onClick={() => setRejectingId(null)}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                      <Button
                        onClick={() => handleApprove(item.id)}
                        size="sm"
                        className="flex-1 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approuver</span>
                      </Button>

                      <Button
                        onClick={() => setRejectingId(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-medium"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Rejeter</span>
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
