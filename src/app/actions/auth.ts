"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { resolveAppUrl } from "@/lib/auth/appUrl"
import {
  canAccessOpsConsole,
  OPS_CONSOLE_PATH,
  resolveAuthEmail,
  sanitizeNextPath,
} from "@/lib/admin/consolePath"
import { welcomeEmailHtml } from "@/lib/email/templates"

/**
 * Soft launch: confirm email via service role when Supabase Auth mail
 * (SMTP) is not delivering, then open a session with password.
 * Opt-in only: set ALLOW_SOFT_EMAIL_CONFIRM=true on Vercel.
 */
async function confirmEmailAndSignIn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  password: string,
  userId?: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  if (process.env.ALLOW_SOFT_EMAIL_CONFIRM !== "true") {
    return {
      ok: false,
      error:
        "Confirmez votre email via le lien reçu (ou activez ALLOW_SOFT_EMAIL_CONFIRM pour le soft-launch).",
    }
  }
  try {
    const admin = createAdminClient()
    let id = userId

    if (!id) {
      for (let page = 1; page <= 20; page += 1) {
        const { data: listed, error: listError } = await admin.auth.admin.listUsers({
          page,
          perPage: 200,
        })
        if (listError) {
          return { ok: false, error: listError.message }
        }
        const match = listed.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        )
        if (match?.id) {
          id = match.id
          break
        }
        if (listed.users.length < 200) break
      }
    }

    if (!id) {
      return { ok: false, error: "Compte introuvable pour cette adresse email." }
    }

    const { error: confirmError } = await admin.auth.admin.updateUserById(id, {
      email_confirm: true,
    })
    if (confirmError) {
      return { ok: false, error: confirmError.message }
    }

    await admin
      .from("profiles")
      .update({ email_verified: true })
      .eq("user_id", id)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error || !data.user) {
      return {
        ok: false,
        error: error?.message || "Connexion impossible après confirmation.",
      }
    }

    return { ok: true, userId: data.user.id }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Confirmation automatique impossible.",
    }
  }
}

async function resolveLoginDestination(input: {
  userId: string
  email: string | null
  nextRaw?: string | null
}): Promise<string> {
  const next = sanitizeNextPath(input.nextRaw)

  // Service role : rôle sûr + auto-admin pour emails allowlist
  try {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from("profiles")
      .select("role, completion_percentage, onboarding_status")
      .eq("user_id", input.userId)
      .maybeSingle()

    if (isOpsAdminEmailSafe(input.email) && profile?.role !== "admin") {
      await admin.from("profiles").update({ role: "admin" }).eq("user_id", input.userId)
    }

    const role =
      isOpsAdminEmailSafe(input.email) ? "admin" : profile?.role || null

    if (canAccessOpsConsole({ role, email: input.email })) {
      if (next?.startsWith(OPS_CONSOLE_PATH) || !next) {
        return OPS_CONSOLE_PATH
      }
      // Staff peut aussi aller sur un deep-link membre s’il le demande
      return next
    }

    if (next && !next.startsWith(OPS_CONSOLE_PATH)) {
      return next
    }

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
  } catch {
    if (isOpsAdminEmailSafe(input.email)) return OPS_CONSOLE_PATH
    return "/dashboard"
  }
}

function isOpsAdminEmailSafe(email: string | null) {
  return canAccessOpsConsole({ role: null, email })
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const nextRaw = String(formData.get("next") ?? "").trim()

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
      const unlocked = await confirmEmailAndSignIn(supabase, email, password)
      if (unlocked.ok) {
        const nextPath = await resolveLoginDestination({
          userId: unlocked.userId,
          email: email.toLowerCase(),
          nextRaw,
        })
        revalidatePath("/", "layout")
        redirect(nextPath)
      }
      return {
        error:
          unlocked.error ||
          "Votre email n’est pas encore confirmé. Utilisez « Mot de passe oublié » puis reconnectez-vous.",
      }
    }
    if (
      msg.includes("invalid login credentials") ||
      msg.includes("invalid_credentials")
    ) {
      return {
        error:
          "Email ou mot de passe incorrect. Si vous venez de vous réinscrire avec le même email, le compte existait déjà : utilisez « Mot de passe oublié » pour en créer un nouveau.",
      }
    }
    return { error: error.message }
  }

  if (!data.user) {
    return { error: "Impossible de démarrer la session." }
  }

  const nextPath = await resolveLoginDestination({
    userId: data.user.id,
    email: resolveAuthEmail(data.user) || email.toLowerCase(),
    nextRaw,
  })
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
  const appUrl = await resolveAppUrl()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/finish`,
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
    const msg = error.message.toLowerCase()
    if (
      msg.includes("already") ||
      msg.includes("registered") ||
      msg.includes("exists")
    ) {
      return {
        error:
          "Un compte existe déjà avec cet email. Connectez-vous, ou utilisez « Mot de passe oublié » si vous ne retrouvez pas le mot de passe.",
      }
    }
    return { error: error.message }
  }

  // Email déjà pris : Supabase renvoie un user sans identities (sans vraie création)
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return {
      error:
        "Un compte existe déjà avec cet email. Connectez-vous, ou utilisez « Mot de passe oublié » pour créer un nouveau mot de passe.",
    }
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

    try {
      const { sendResendEmail } = await import("@/lib/email/send")
      await sendResendEmail({
        to: email,
        subject: "Bienvenue sur Keliaa — votre espace vous attend",
        html: welcomeEmailHtml({ firstName, appUrl }),
      })
    } catch {
      /* optional */
    }
  }

  // Email de confirmation Supabase souvent non livré (SMTP non branché) :
  // activer le compte et ouvrir l’espace membre immédiatement.
  if (data.user && !data.session) {
    const unlocked = await confirmEmailAndSignIn(
      supabase,
      email,
      password,
      data.user.id
    )
    if (unlocked.ok) {
      revalidatePath("/", "layout")
      redirect("/onboarding")
    }
    return {
      error: null,
      needsEmailConfirmation: true,
      message:
        unlocked.error ||
        "Compte créé. Si vous n’avez pas reçu d’email, reconnectez-vous avec le même mot de passe : l’accès s’ouvre automatiquement.",
    }
  }

  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function resendConfirmationAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) {
    return { error: "Indiquez votre email." }
  }

  const supabase = await createClient()
  const appUrl = await resolveAppUrl()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${appUrl}/auth/finish` },
  })

  if (error) {
    return { error: error.message }
  }

  return {
    error: null,
    message:
      "Email renvoyé si un compte existe. Vérifiez boîte de réception et spams. Sinon, connectez-vous : l’accès peut s’ouvrir sans le lien.",
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
