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
import { enforceRateLimit, RL } from "@/lib/security/rateLimit"
import {
  firstZodError,
  loginSchema,
  registerSchema,
  resendConfirmationSchema,
} from "@/lib/security/schemas"

/**
 * Soft launch: confirm email via service role when Supabase Auth mail
 * (SMTP) is not delivering / rate-limited, then open a session with password.
 * Enabled by default; set ALLOW_SOFT_EMAIL_CONFIRM=false to require real email confirm.
 */
async function confirmEmailAndSignIn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  password: string,
  userId?: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  if (!softEmailConfirmEnabled()) {
    return {
      ok: false,
      error:
        "Confirmez votre email via le lien reçu, puis reconnectez-vous.",
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

function isAuthEmailRateLimited(message: string): boolean {
  const msg = message.toLowerCase()
  return (
    msg.includes("email rate limit") ||
    msg.includes("rate limit exceeded") ||
    msg.includes("over_email_send_rate_limit") ||
    msg.includes("429")
  )
}

function softEmailConfirmEnabled(): boolean {
  // Soft-launch par défaut : inscriptions opérationnelles sans SMTP Auth Supabase.
  // Désactiver explicitement avec ALLOW_SOFT_EMAIL_CONFIRM=false.
  const v = process.env.ALLOW_SOFT_EMAIL_CONFIRM
  return v !== "false" && v !== "0"
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    nextRaw: String(formData.get("next") ?? "").trim(),
  })
  if (!parsed.success) {
    return { error: firstZodError(parsed.error) }
  }
  const { email, password, nextRaw } = parsed.data

  const rl = await enforceRateLimit({ ...RL.login, subject: email })
  if (!rl.ok) return { error: rl.error }

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
          email,
          nextRaw,
        })
        revalidatePath("/", "layout")
        redirect(nextPath)
      } else {
        return {
          error:
            unlocked.error ||
            "Votre email n’est pas encore confirmé. Utilisez « Mot de passe oublié » puis reconnectez-vous.",
        }
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
    return { error: "Connexion impossible pour le moment." }
  }

  if (!data.user) {
    return { error: "Impossible de démarrer la session." }
  }

  const nextPath = await resolveLoginDestination({
    userId: data.user.id,
    email: resolveAuthEmail(data.user) || email,
    nextRaw,
  })
  revalidatePath("/", "layout")
  redirect(nextPath)
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    firstName: String(formData.get("first_name") ?? ""),
    lastName: String(formData.get("last_name") ?? ""),
    city: String(formData.get("city") ?? ""),
    address: String(formData.get("address") ?? ""),
    charterAccepted: formData.get("charter_accepted") === "true",
    referredByCode: String(formData.get("ref") ?? ""),
    utmSource: String(formData.get("utm_source") ?? ""),
    utmMedium: String(formData.get("utm_medium") ?? ""),
    utmCampaign: String(formData.get("utm_campaign") ?? ""),
  })
  if (!parsed.success) {
    return { error: firstZodError(parsed.error) }
  }
  const {
    email,
    password,
    firstName,
    lastName,
    city,
    address,
    referredByCode,
    utmSource,
    utmMedium,
    utmCampaign,
  } = parsed.data

  const rl = await enforceRateLimit({ ...RL.register, subject: email })
  if (!rl.ok) return { error: rl.error }

  const supabase = await createClient()
  const appUrl = await resolveAppUrl()
  const userMeta = {
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
  }

  const alreadyExistsMessage =
    "Un compte existe déjà avec cet email. Connectez-vous, ou utilisez « Mot de passe oublié » si vous ne retrouvez pas le mot de passe."

  /**
   * Chemin principal : Admin createUser (email déjà confirmé).
   * Évite complètement le SMTP Auth Supabase → plus de "email rate limit exceeded".
   * Bienvenue envoyée via Resend.
   */
  let userId: string | null = null
  let usedAdminPath = false

  if (softEmailConfirmEnabled()) {
    try {
      const admin = createAdminClient()
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userMeta,
      })

      if (createErr) {
        const msg = createErr.message.toLowerCase()
        if (
          msg.includes("already") ||
          msg.includes("registered") ||
          msg.includes("exists") ||
          msg.includes("duplicate")
        ) {
          return { error: alreadyExistsMessage }
        }
        console.error("[register] admin.createUser", createErr.message)
      } else if (created.user?.id) {
        userId = created.user.id
        usedAdminPath = true
      }
    } catch (e) {
      console.error("[register] admin path", e)
    }
  }

  // Fallback : signUp classique (si soft-confirm off ou admin indisponible)
  if (!userId) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/finish`,
        data: userMeta,
      },
    })

    if (error) {
      const msg = error.message.toLowerCase()
      if (
        msg.includes("already") ||
        msg.includes("registered") ||
        msg.includes("exists")
      ) {
        return { error: alreadyExistsMessage }
      }
      if (isAuthEmailRateLimited(error.message)) {
        // Dernier recours : créer via admin même hors soft-confirm flag
        try {
          const admin = createAdminClient()
          const { data: created, error: createErr } =
            await admin.auth.admin.createUser({
              email,
              password,
              email_confirm: softEmailConfirmEnabled(),
              user_metadata: userMeta,
            })
          if (createErr) {
            const cmsg = createErr.message.toLowerCase()
            if (
              cmsg.includes("already") ||
              cmsg.includes("registered") ||
              cmsg.includes("exists")
            ) {
              return { error: alreadyExistsMessage }
            }
            return {
              error:
                "Trop d’inscriptions email pour le moment. Réessayez dans 10–15 minutes, ou utilisez « Mot de passe oublié » si le compte existe déjà.",
            }
          }
          if (created.user?.id) {
            userId = created.user.id
            usedAdminPath = true
          }
        } catch {
          return {
            error:
              "Trop d’inscriptions email pour le moment. Réessayez dans 10–15 minutes.",
          }
        }
      } else {
        return { error: "Impossible de créer le compte pour le moment." }
      }
    } else if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return { error: alreadyExistsMessage }
    } else if (data.user) {
      userId = data.user.id
      // Session déjà ouverte (confirmations désactivées côté projet)
      if (data.session) {
        await finalizeNewProfile({
          userId: data.user.id,
          email,
          firstName,
          lastName,
          city,
          referredByCode,
          utmSource,
          utmMedium,
          utmCampaign,
          emailVerified: Boolean(data.user.email_confirmed_at),
          appUrl,
        })
        revalidatePath("/", "layout")
        redirect("/onboarding")
      }
    }
  }

  if (!userId) {
    return { error: "Impossible de créer le compte pour le moment." }
  }

  await finalizeNewProfile({
    userId,
    email,
    firstName,
    lastName,
    city,
    referredByCode,
    utmSource,
    utmMedium,
    utmCampaign,
    emailVerified: usedAdminPath || softEmailConfirmEnabled(),
    appUrl,
  })

  // Ouvrir la session immédiatement
  if (usedAdminPath || softEmailConfirmEnabled()) {
    const unlocked = await confirmEmailAndSignIn(
      supabase,
      email,
      password,
      userId
    )
    if (unlocked.ok) {
      revalidatePath("/", "layout")
      redirect("/onboarding")
    }
    // Compte créé mais session échouée : l’utilisateur peut se connecter
    return {
      error: null,
      needsEmailConfirmation: false,
      message:
        "Compte créé. Connectez-vous avec le même email et mot de passe pour accéder à votre espace.",
    }
  }

  return {
    error: null,
    needsEmailConfirmation: true,
    message:
      "Compte créé. Si vous n’avez pas reçu d’email, reconnectez-vous avec le même mot de passe.",
  }
}

async function finalizeNewProfile(input: {
  userId: string
  email: string
  firstName: string
  lastName: string
  city: string
  referredByCode?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  emailVerified: boolean
  appUrl: string
}) {
  const referralCode = input.userId.replace(/-/g, "").slice(0, 8)
  const profilePatch: Record<string, unknown> = {
    first_name: input.firstName,
    last_name: input.lastName || null,
    city: input.city || null,
    onboarding_status: "step1_account",
    completion_percentage: 10,
    email_verified: input.emailVerified,
    referral_code: referralCode,
  }
  if (input.referredByCode) profilePatch.referred_by_code = input.referredByCode
  if (input.utmSource) profilePatch.utm_source = input.utmSource
  if (input.utmMedium) profilePatch.utm_medium = input.utmMedium
  if (input.utmCampaign) profilePatch.utm_campaign = input.utmCampaign

  try {
    const admin = createAdminClient()
    await admin.from("profiles").update(profilePatch).eq("user_id", input.userId)
  } catch (e) {
    console.error("[register] profile", e)
  }

  try {
    const { sendResendEmail } = await import("@/lib/email/send")
    await sendResendEmail({
      to: input.email,
      subject: "Bienvenue sur Keliaa — votre espace vous attend",
      html: welcomeEmailHtml({
        firstName: input.firstName,
        appUrl: input.appUrl,
      }),
    })
  } catch {
    /* optional */
  }
}

export async function resendConfirmationAction(formData: FormData) {
  const parsed = resendConfirmationSchema.safeParse({
    email: String(formData.get("email") ?? ""),
  })
  if (!parsed.success) {
    return { error: firstZodError(parsed.error) }
  }
  const { email } = parsed.data

  const rl = await enforceRateLimit({
    action: "resend_confirm",
    limit: 3,
    windowSeconds: 60 * 60,
    subject: email,
    failClosed: true,
  })
  if (!rl.ok) return { error: rl.error }

  const appUrl = await resolveAppUrl()

  // Soft-launch : confirmer via admin sans renvoyer le mail Auth Supabase
  // (évite "email rate limit exceeded").
  if (softEmailConfirmEnabled()) {
    try {
      const admin = createAdminClient()
      for (let page = 1; page <= 10; page += 1) {
        const { data: listed } = await admin.auth.admin.listUsers({
          page,
          perPage: 200,
        })
        const match = listed?.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        )
        if (match?.id) {
          if (!match.email_confirmed_at) {
            await admin.auth.admin.updateUserById(match.id, {
              email_confirm: true,
            })
            await admin
              .from("profiles")
              .update({ email_verified: true })
              .eq("user_id", match.id)
          }
          return {
            error: null,
            message:
              "Compte activé. Connectez-vous avec votre email et mot de passe pour accéder à votre espace.",
          }
        }
        if (!listed || listed.users.length < 200) break
      }
      return {
        error: null,
        message:
          "Si un compte existe, il est prêt. Connectez-vous avec votre mot de passe.",
      }
    } catch (e) {
      console.error("[resend-confirm] soft", e)
    }
  }

  // Production : lien magic via Admin + Resend (pas le SMTP Auth Supabase)
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${appUrl}/auth/finish` },
    })
    if (!error) {
      const actionLink = data.properties?.action_link
      if (actionLink) {
        const { sendResendEmail } = await import("@/lib/email/send")
        const { brandedEmailShell } = await import("@/lib/email/templates")
        await sendResendEmail({
          to: email,
          subject: "Accédez à votre espace — KELIAA",
          html: brandedEmailShell({
            title: "Ouvrez votre espace Keliaa",
            preheader: "Un clic sécurisé pour accéder à votre compte.",
            bodyHtml:
              "<p>Cliquez sur le bouton ci-dessous pour ouvrir votre espace membre Keliaa. Vous pourrez ensuite définir ou utiliser votre mot de passe habituel.</p>",
            ctaLabel: "Accéder à mon espace",
            ctaHref: actionLink,
          }),
        })
      }
    } else if (isAuthEmailRateLimited(error.message)) {
      return {
        error:
          "Trop d’emails envoyés pour le moment. Attendez 15 minutes, puis connectez-vous — l’accès peut s’ouvrir sans le lien.",
      }
    }
  } catch (e) {
    console.error("[resend-confirm]", e)
    const supabase = await createClient()
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${appUrl}/auth/finish` },
    })
    if (error && isAuthEmailRateLimited(error.message)) {
      return {
        error:
          "Trop d’emails envoyés pour le moment. Réessayez plus tard ou connectez-vous directement.",
      }
    }
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
