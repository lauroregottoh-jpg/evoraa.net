"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

async function resolvePostAuthPath(
  userId: string
): Promise<"/onboarding" | "/dashboard"> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("completion_percentage, onboarding_status")
    .eq("user_id", userId)
    .maybeSingle()

  const completion = profile?.completion_percentage ?? 0
  const status = profile?.onboarding_status

  if (
    completion < 70 ||
    !status ||
    status === "step1_account" ||
    status === "step2_profile"
  ) {
    return "/onboarding"
  }

  return "/dashboard"
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: "Impossible de démarrer la session." }
  }

  const nextPath = await resolvePostAuthPath(data.user.id)
  revalidatePath("/", "layout")
  redirect(nextPath)
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const firstName = String(formData.get("first_name") ?? "").trim()
  const lastName = String(formData.get("last_name") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()
  const charterAccepted = formData.get("charter_accepted") === "true"
  const referredByCode = String(formData.get("ref") ?? "").trim().slice(0, 32)
  const utmSource = String(formData.get("utm_source") ?? "").trim().slice(0, 64)
  const utmMedium = String(formData.get("utm_medium") ?? "").trim().slice(0, 64)
  const utmCampaign = String(formData.get("utm_campaign") ?? "").trim().slice(0, 64)

  if (!email || !password || !firstName) {
    return { error: "Prénom, email et mot de passe sont requis." }
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." }
  }

  if (!charterAccepted) {
    return {
      error:
        "Vous devez accepter la Charte de Bienveillance avant de créer votre espace.",
    }
  }

  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName || null,
        city: city || null,
        address: address || null,
        charter_accepted: true,
        charter_accepted_at: new Date().toISOString(),
        referred_by_code: referredByCode || null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const referralCode = data.user.id.replace(/-/g, "").slice(0, 8)
    const profilePatch: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastName || null,
      city: city || null,
      onboarding_status: "step1_account",
      completion_percentage: 10,
      email_verified: Boolean(data.user.email_confirmed_at),
      referral_code: referralCode,
    }
    if (referredByCode) profilePatch.referred_by_code = referredByCode
    if (utmSource) profilePatch.utm_source = utmSource
    if (utmMedium) profilePatch.utm_medium = utmMedium
    if (utmCampaign) profilePatch.utm_campaign = utmCampaign

    await supabase.from("profiles").update(profilePatch).eq("user_id", data.user.id)

    // Best-effort welcome email when Resend is configured
    try {
      const { sendEmailNotificationStub } = await import("@/app/actions/notifications")
      await sendEmailNotificationStub({
        to: email,
        subject: "Bienvenue sur KELIAA",
        html: `<p>Bonjour ${firstName},</p>
<p>Bienvenue dans la communauté KELIAA. Prochaine étape : compléter votre profil et vos questionnaires pour recevoir des suggestions pertinentes.</p>
<p><a href="${appUrl}/onboarding">Continuer mon inscription</a></p>
<p>L'équipe KELIAA</p>`,
      })
    } catch {
      /* optional */
    }
  }

  // Confirmation email activée : pas de session immédiate
  if (data.user && !data.session) {
    return {
      error: null,
      needsEmailConfirmation: true,
      message:
        "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse avant de vous connecter.",
    }
  }

  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
