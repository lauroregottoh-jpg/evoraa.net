"use client";

import { Share2, MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { INVITE_MESSAGE, buildPublicShareUrl } from "@/lib/growth/invite";
import { trackEvent } from "@/components/analytics/AnalyticsScripts";

export function ShareRecommendSection({
  inviteUrl,
}: {
  /** Optional member invite URL; falls back to public share with UTM */
  inviteUrl?: string;
}) {
  const openShare = (channel: "whatsapp" | "twitter" | "facebook" | "native") => {
    const url =
      inviteUrl ||
      buildPublicShareUrl("/", {
        utm_source: channel === "whatsapp" ? "whatsapp" : channel,
        utm_medium: "social",
        utm_campaign: "recommend_home",
      });
    const text = INVITE_MESSAGE + url;
    trackEvent("share_recommend", { channel });

    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (channel === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    if (channel === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    if (navigator.share) {
      void navigator.share({ title: "KELLIA", text: INVITE_MESSAGE, url });
    } else {
      void navigator.clipboard?.writeText(text);
      alert("Lien copié — collez-le sur Instagram ou vos réseaux.");
    }
  };

  return (
    <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
      <div className="encart-kelia p-8 sm:p-12 text-center space-y-6">
        <Share2 className="h-8 w-8 text-accent mx-auto" />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Recommandez Kellia
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Un ami cherche une rencontre digne, alignée sur les valeurs du Royaume ? Partagez la
          plateforme en un clic.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <MagneticButton
            type="button"
            variant="primary"
            size="md"
            onClick={() => openShare("whatsapp")}
          >
            <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
          </MagneticButton>
          <MagneticButton type="button" variant="outline" size="md" onClick={() => openShare("facebook")}>
            Facebook
          </MagneticButton>
          <MagneticButton type="button" variant="outline" size="md" onClick={() => openShare("twitter")}>
            X / Twitter
          </MagneticButton>
          <MagneticButton type="button" variant="secondary" size="md" onClick={() => openShare("native")}>
            Instagram & autres
          </MagneticButton>
        </div>
        <p className="text-xs text-muted-foreground">
          Instagram n&apos;offre pas de partage web direct : le bouton copie le message à coller en
          story ou DM.
        </p>
      </div>
    </section>
  );
}
