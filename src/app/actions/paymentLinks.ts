"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/utils/supabase/admin"
import {
  ADMIN_PAYMENT_LINK_PRODUCT,
  generatePaymentLinkSlug,
  paymentLinkAbsoluteUrl,
  paymentLinkPublicPath,
} from "@/lib/billing/adminPaymentLinks"
import {
  parseBictorysPaymentMode,
  resolveBictorysPaymentMode,
} from "@/lib/billing/bictorys"
import { bictorysCreateCharge } from "@/lib/billing/bictorysClient"
import { monerooInitializePayment } from "@/lib/billing/monerooClient"
import { logPaymentEvent } from "@/lib/billing/paymentAudit"
import { isDemoPaymentsEnv, resolveLiveProvider } from "@/lib/billing/provider"
import { assertPaymentsNotPaused } from "@/lib/platform/killSwitches"
import { createClient } from "@/utils/supabase/server"
import {
  canFullAdminOps,
  OPS_CONSOLE_PATH,
  resolveAuthEmail,
} from "@/lib/admin/consolePath"

function appBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return ""
}

async function requireFullAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Non authentifié." as const, user: null, role: null }

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle()
  const role = (profile?.role as string) || null
  const email = resolveAuthEmail(user)

  if (!canFullAdminOps({ role, email })) {
    return { error: "Accès réservé à l'administrateur principal." as const, user: null, role }
  }

  return { error: null, user, role }
}

export type AdminPaymentLinkRow = {
  id: string
  slug: string
  amount: number
  currency: string
  label: string | null
  status: string
  paymentId: string | null
  createdAt: string | null
  paidAt: string | null
  url: string
}

export async function adminCreatePaymentLink(input: {
  amount: number
  label?: string | null
  paymentMode?: string | null
}): Promise<{ error?: string; link?: AdminPaymentLinkRow }> {
  const gate = await requireFullAdminUser()
  if (gate.error || !gate.user) return { error: gate.error || "Accès refusé." }

  const gatePay = await assertPaymentsNotPaused()
  if (!gatePay.ok) return { error: gatePay.error }

  const amount = Math.round(Number(input.amount))
  if (!Number.isFinite(amount) || amount < 100) {
    return { error: "Montant minimum : 100 FCFA." }
  }
  if (amount > 5_000_000) {
    return { error: "Montant maximum : 5 000 000 FCFA." }
  }

  const baseUrl = appBaseUrl()
  if (!baseUrl || baseUrl.includes("localhost")) {
    return {
      error: "NEXT_PUBLIC_APP_URL requis (domaine public) pour créer un lien de paiement.",
    }
  }

  const liveProvider = resolveLiveProvider()
  if (isDemoPaymentsEnv()) {
    return { error: "Configurez Bictorys ou Moneroo (PAYMENTS_DEMO_MODE doit être false)." }
  }

  const label = (input.label || "").trim().slice(0, 120) || null
  const slug = generatePaymentLinkSlug()
  const admin = createAdminClient()

  const { data: subscription, error: subError } = await admin
    .from("subscriptions")
    .insert({
      user_id: gate.user.id,
      plan: "admin_payment_link",
      status: "pending",
      starts_at: null,
      ends_at: null,
    })
    .select("id")
    .single()

  if (subError || !subscription) {
    return { error: subError?.message || "Impossible de préparer le paiement." }
  }

  const paymentMode =
    liveProvider === "bictorys"
      ? resolveBictorysPaymentMode(
          null,
          parseBictorysPaymentMode(input.paymentMode) ?? input.paymentMode
        )
      : null

  const metadata = {
    product: ADMIN_PAYMENT_LINK_PRODUCT,
    slug,
    label,
    amount_xof: amount,
    provider: liveProvider,
    payment_mode: paymentMode,
    created_by: gate.user.id,
  }

  const { data: payment, error: payError } = await admin
    .from("payments")
    .insert({
      subscription_id: subscription.id,
      provider: liveProvider,
      amount,
      currency: "XOF",
      status: "pending",
      transaction_reference: `LINK-${slug}`,
      metadata,
    })
    .select("id")
    .single()

  if (payError || !payment) {
    return { error: payError?.message || "Impossible d'enregistrer le paiement." }
  }

  const { data: link, error: linkError } = await admin
    .from("admin_payment_links")
    .insert({
      slug,
      amount,
      currency: "XOF",
      label,
      payment_id: payment.id,
      created_by: gate.user.id,
      status: "pending",
    })
    .select("id, slug, amount, currency, label, status, payment_id, created_at, paid_at")
    .single()

  if (linkError || !link) {
    return { error: linkError?.message || "Impossible de créer le lien." }
  }

  revalidatePath(`${OPS_CONSOLE_PATH}/liens-paiement`)
  revalidatePath(OPS_CONSOLE_PATH)

  return {
    link: {
      id: String(link.id),
      slug: String(link.slug),
      amount: Number(link.amount),
      currency: String(link.currency),
      label: (link.label as string) || null,
      status: String(link.status),
      paymentId: (link.payment_id as string) || null,
      createdAt: (link.created_at as string) || null,
      paidAt: (link.paid_at as string) || null,
      url: paymentLinkAbsoluteUrl(slug, baseUrl),
    },
  }
}

export async function adminListPaymentLinks(limit = 30): Promise<{
  error?: string
  links: AdminPaymentLinkRow[]
}> {
  const gate = await requireFullAdminUser()
  if (gate.error) return { error: gate.error, links: [] }

  const baseUrl = appBaseUrl()
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("admin_payment_links")
    .select("id, slug, amount, currency, label, status, payment_id, created_at, paid_at")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 100))

  if (error) return { error: error.message, links: [] }

  return {
    links: (data || []).map((row) => ({
      id: String(row.id),
      slug: String(row.slug),
      amount: Number(row.amount),
      currency: String(row.currency),
      label: (row.label as string) || null,
      status: String(row.status),
      paymentId: (row.payment_id as string) || null,
      createdAt: (row.created_at as string) || null,
      paidAt: (row.paid_at as string) || null,
      url: baseUrl ? paymentLinkAbsoluteUrl(String(row.slug), baseUrl) : paymentLinkPublicPath(String(row.slug)),
    })),
  }
}

export async function getPaymentLinkPublic(slug: string): Promise<{
  error?: string
  link?: {
    slug: string
    amount: number
    currency: string
    label: string | null
    status: string
    paidAt: string | null
  }
}> {
  const safe = slug.trim().toLowerCase()
  if (!safe || safe.length > 24) return { error: "Lien invalide." }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("admin_payment_links")
    .select("slug, amount, currency, label, status, paid_at")
    .eq("slug", safe)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "Lien introuvable ou expiré." }

  return {
    link: {
      slug: String(data.slug),
      amount: Number(data.amount),
      currency: String(data.currency),
      label: (data.label as string) || null,
      status: String(data.status),
      paidAt: (data.paid_at as string) || null,
    },
  }
}

export async function startPaymentLinkCheckout(input: {
  slug: string
  paymentMode?: string | null
  customerEmail?: string | null
  customerName?: string | null
}): Promise<{ error?: string; checkoutUrl?: string }> {
  const gatePay = await assertPaymentsNotPaused()
  if (!gatePay.ok) return { error: gatePay.error }

  const safe = input.slug.trim().toLowerCase()
  if (!safe) return { error: "Lien invalide." }

  const admin = createAdminClient()
  const { data: link } = await admin
    .from("admin_payment_links")
    .select("id, slug, amount, currency, label, status, payment_id")
    .eq("slug", safe)
    .maybeSingle()

  if (!link) return { error: "Lien introuvable." }
  if (link.status === "completed") return { error: "Ce paiement a déjà été effectué." }

  const paymentId = link.payment_id as string
  if (!paymentId) return { error: "Paiement non configuré." }

  const { data: payment } = await admin
    .from("payments")
    .select("id, status, amount, metadata, provider, transaction_reference")
    .eq("id", paymentId)
    .maybeSingle()

  if (!payment) return { error: "Paiement introuvable." }
  if (payment.status === "completed") {
    await admin
      .from("admin_payment_links")
      .update({ status: "completed", paid_at: new Date().toISOString() })
      .eq("id", link.id)
    return { error: "Ce paiement a déjà été effectué." }
  }

  const baseUrl = appBaseUrl()
  if (!baseUrl || baseUrl.includes("localhost")) {
    return { error: "Paiement indisponible (configuration serveur)." }
  }

  const amount = Math.round(Number(payment.amount))
  const label = (link.label as string) || "Paiement"
  const provider = String(payment.provider || resolveLiveProvider())
  const returnPath = `${paymentLinkPublicPath(safe)}?paid=1`
  const cancelPath = `${paymentLinkPublicPath(safe)}?cancel=1`

  if (provider === "bictorys") {
    const apiKey = process.env.BICTORYS_API_KEY
    if (!apiKey) return { error: "Bictorys non configuré." }

    const paymentMode = resolveBictorysPaymentMode(
      null,
      parseBictorysPaymentMode(input.paymentMode) ?? input.paymentMode
    )

    const result = await bictorysCreateCharge({
      apiKey,
      paymentId: payment.id,
      amount,
      description: label.slice(0, 80),
      customerName: (input.customerName || "Client").slice(0, 80),
      customerEmail: (input.customerEmail || "client@keliaa.org").slice(0, 120),
      paymentMode,
      appBaseUrl: baseUrl,
      successPath: returnPath,
      cancelPath,
    })

    if (!result.ok) return { error: result.error }

    await admin
      .from("payments")
      .update({
        transaction_reference: result.txId,
        metadata: {
          ...(typeof payment.metadata === "object" && payment.metadata
            ? (payment.metadata as object)
            : {}),
          payment_mode: paymentMode,
          bictorys: result.raw,
        },
      })
      .eq("id", payment.id)

    await logPaymentEvent({
      paymentId: payment.id,
      provider: "bictorys",
      eventType: "admin_link_checkout",
      status: "pending",
      message: `${amount} XOF — ${safe}`,
      payload: { checkoutUrl: result.checkoutUrl },
    })

    return { checkoutUrl: result.checkoutUrl }
  }

  if (provider === "moneroo") {
    const secret = process.env.MONEROO_SECRET_KEY
    if (!secret) return { error: "Moneroo non configuré." }

    const name = (input.customerName || "Client").trim().split(/\s+/, 2)
    const result = await monerooInitializePayment({
      secretKey: secret,
      amountXof: amount,
      description: label.slice(0, 120),
      returnUrl: `${baseUrl}${returnPath}`,
      customerEmail: (input.customerEmail || "client@keliaa.org").slice(0, 120),
      customerFirstName: name[0] || "Client",
      customerLastName: name[1] || "KELIAA",
      metadata: {
        keliaa_payment_id: payment.id,
        admin_link_slug: safe,
        product: ADMIN_PAYMENT_LINK_PRODUCT,
      },
    })

    if (!result.ok) return { error: result.error }

    await admin
      .from("payments")
      .update({
        transaction_reference: result.txId,
        metadata: {
          ...(typeof payment.metadata === "object" && payment.metadata
            ? (payment.metadata as object)
            : {}),
          moneroo: result.raw,
        },
      })
      .eq("id", payment.id)

    return { checkoutUrl: result.checkoutUrl }
  }

  return { error: `Provider non supporté : ${provider}` }
}
