import Link from "next/link"
import { redirect } from "next/navigation"
import { MemberPage } from "@/components/layout/MemberPage"
import { getAllianceJourneyState } from "@/app/actions/allianceJourney"
import {
  AllianceWelcomeExperience,
  type ProfileGapSuggestion,
} from "@/components/alliance/AllianceWelcomeExperience"
import { createClient } from "@/utils/supabase/server"
import {
  ONBOARDING_GATE_SELECT,
  profileNeedsOnboarding,
} from "@/lib/auth/onboardingGate"
import type { AllianceCinemaMode } from "@/lib/alliance/journey"

export const dynamic = "force-dynamic"

export default async function AllianceBienvenuePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode: modeParam } = await searchParams
  const mode: AllianceCinemaMode =
    modeParam === "renew" ? "renewal" : "welcome"

  const state = await getAllianceJourneyState()
  if (!state) {
    redirect(
      `/login?next=${encodeURIComponent(
        mode === "renewal" ? "/alliance/bienvenue?mode=renew" : "/alliance/bienvenue"
      )}`
    )
  }
  if (!state.isPaid) {
    return (
      <MemberPage>
        <div className="max-w-lg mx-auto text-center py-12 space-y-4">
          <h1 className="font-serif text-3xl font-bold">Alliance</h1>
          <p className="text-sm text-muted-foreground">
            Cet accueil est réservé aux membres Alliance.
          </p>
          <Link
            href="/premium"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            Découvrir Alliance
          </Link>
        </div>
      </MemberPage>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profileGaps: ProfileGapSuggestion[] = []
  let loyaltyReward: {
    bonusMessages: number
    boosts: number
    vip?: boolean
  } | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        `${ONBOARDING_GATE_SELECT}, avatar_url, church_attended, biography, last_name`
      )
      .eq("user_id", user.id)
      .maybeSingle()

    if (mode === "renewal") {
      const { data: lastGrant } = await supabase
        .from("loyalty_grants")
        .select("bonus_messages, boosts, meta, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastGrant && Number(lastGrant.bonus_messages) > 0) {
        const created = lastGrant.created_at
          ? new Date(lastGrant.created_at as string).getTime()
          : 0
        // Afficher seulement si grant récent (< 48 h)
        if (Date.now() - created < 48 * 3600_000) {
          const meta =
            lastGrant.meta && typeof lastGrant.meta === "object"
              ? (lastGrant.meta as Record<string, unknown>)
              : {}
          loyaltyReward = {
            bonusMessages: Number(lastGrant.bonus_messages) || 0,
            boosts: Number(lastGrant.boosts) || 0,
            vip: Boolean(meta.vip_session),
          }
        }
      }
    }

    if (profileNeedsOnboarding(profile)) {
      // Essentiels vraiment manquants — suggestion, pas de re-saisie de l’existant
      if (!profile?.first_name?.trim()) {
        profileGaps.push({
          id: "name",
          label: "Ajouter votre prénom",
          href: "/onboarding",
        })
      }
      if (!profile?.gender) {
        profileGaps.push({
          id: "gender",
          label: "Indiquer votre sexe",
          href: "/onboarding",
        })
      }
      if (!profile?.birth_date) {
        profileGaps.push({
          id: "birth",
          label: "Ajouter votre date de naissance",
          href: "/onboarding",
        })
      }
      if (!profile?.city?.trim()) {
        profileGaps.push({
          id: "city",
          label: "Ajouter votre ville",
          href: "/onboarding",
        })
      }
    } else {
      // Profil essentiel OK — suggestions douces seulement
      if (!profile?.avatar_url) {
        profileGaps.push({
          id: "photo",
          label: "Ajouter une photo de profil",
          href: "/profile",
        })
      }
      if (!profile?.church_attended?.trim()) {
        profileGaps.push({
          id: "church",
          label: "Préciser votre église (optionnel)",
          href: "/profile",
        })
      }
    }
  }

  return (
    <MemberPage>
      <AllianceWelcomeExperience
        firstName={state.firstName}
        missions={state.missions}
        mode={mode}
        profileGaps={profileGaps.slice(0, 3)}
        loyaltyReward={loyaltyReward}
      />
    </MemberPage>
  )
}
