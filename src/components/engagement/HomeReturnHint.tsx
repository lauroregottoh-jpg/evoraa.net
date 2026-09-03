"use client"

/**
 * Rappel discret — uniquement sur l’accueil.
 * Ne pas réutiliser sur les autres pages.
 */
export function HomeReturnHint() {
  return (
    <p className="text-center text-xs sm:text-sm text-muted-foreground leading-relaxed">
      Connectez-vous régulièrement : les bons profils n’attendent pas.
    </p>
  )
}
