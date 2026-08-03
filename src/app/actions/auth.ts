"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { resolveAppUrl, resolvePostAuthPath } from "@/lib/auth/appUrl"
import { welcomeEmailHtml } from "@/lib/email/templates"

/**
 * Soft launch: confirm email via service role when Supabase Auth mail
 * (SMTP) is not delivering, then open a session with password.
 */
async function confirmEmailAndSignIn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  password: string,
  userId?: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
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
    const msg = error.message.toLowerCase()
    if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
      const unlocked = await confirmEmailAndSignIn(supabase, email, password)
      if (unlocked.ok) {
        const nextPath = await resolvePostAuthPath(unlocked.userId)
        revalidatePath("/", "layout")
        redirect(nextPath)
      }
      return {
        error:
          unlocked.error ||
          "Votre email n’est pas encore confirmé. Réessayez dans un instant, ou contactez le support.",
      }
    }
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

    try {
      const { sendEmailNotificationStub } = await import("@/app/actions/notifications")
      await sendEmailNotificationStub({
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
