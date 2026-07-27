"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction, getFavoriteStatusAction } from "@/app/actions/social";
import { cn } from "@/utils/cn";

type Props = {
  targetProfileId: string;
};

export function FavoriteButton({ targetProfileId }: Props) {
  const [favorited, setFavorited] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getFavoriteStatusAction(targetProfileId).then((r) => setFavorited(r.favorited));
  }, [targetProfileId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await toggleFavoriteAction(targetProfileId);
      if (result.success) setFavorited(Boolean(result.favorited));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={loading}
      onClick={handleToggle}
      className={cn(
        "text-xs",
        favorited && "border-accent text-accent bg-accent/10"
      )}
    >
      <Heart className={cn("mr-1.5 h-3.5 w-3.5", favorited && "fill-accent")} />
      {favorited ? "En favori" : "Ajouter aux favoris"}
    </Button>
  );
}
