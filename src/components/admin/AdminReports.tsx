"use client";

import * as React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Ban, UserCheck, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SafetyReport {
  id: string;
  reporterName: string;
  reportedName: string;
  reportedEmail: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  timestamp: string;
}

const INITIAL_REPORTS: SafetyReport[] = [
  {
    id: "rep-1",
    reporterName: "Laure Regottoh",
    reportedName: "Suspect Spam",
    reportedEmail: "suspect.spam@evoraa.net",
    reason: "Demande immédiate de numéro WhatsApp et propos familiers contraires à la Charte d'Evoraa.",
    status: "pending",
    timestamp: "Aujourd'hui à 14h20",
  },
];

export function AdminReports() {
  const [reports, setReports] = React.useState<SafetyReport[]>(INITIAL_REPORTS);

  const handleAction = (id: string, action: "resolved" | "dismissed") => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return { ...r, status: action };
      })
    );
  };

  return (
    <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" /> Signalements & Sécurité de la Plateforme
          </CardTitle>
          <Badge className="bg-destructive/15 text-destructive border-0">
            Tolérance Zéro (Cercle 3)
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Gérez les alertes confidentielles remontées par les membres via le bouton de signalement digne.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {reports.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground italic">
            Aucun signalement en cours. La plateforme est en parfaite sérénité.
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className={`p-5 rounded-2xl border transition-all ${report.status === "pending" ? "border-destructive/40 bg-destructive/5" : "border-border/60 bg-secondary/30"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-destructive/40 text-destructive bg-background/80">
                      Alerte Sécurité
                    </Badge>
                    <span className="text-xs text-muted-foreground font-sans">• {report.timestamp}</span>
                    {report.status !== "pending" && (
                      <Badge className="bg-secondary text-muted-foreground text-[10px]">
                        {report.status === "resolved" ? "✅ Membre suspendu & dossier clos" : "☑️ Classé sans suite"}
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-foreground">
                    Signalé par <span className="text-primary dark:text-accent">{report.reporterName}</span> envers <span className="text-destructive underline decoration-destructive/40">{report.reportedName}</span> ({report.reportedEmail})
                  </h4>

                  <div className="p-3.5 rounded-xl bg-background/90 border border-border/60 text-xs text-foreground/90 leading-relaxed font-sans italic">
                    « {report.reason} »
                  </div>
                </div>

                {report.status === "pending" && (
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      onClick={() => handleAction(report.id, "resolved")}
                      size="sm"
                      className="h-9 px-4 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      <span>Bannir le suspect & Clore</span>
                    </Button>

                    <Button
                      onClick={() => handleAction(report.id, "dismissed")}
                      size="sm"
                      variant="outline"
                      className="h-9 px-4 rounded-xl border-border/80 text-xs hover:bg-secondary"
                    >
                      Classer sans suite
                    </Button>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
