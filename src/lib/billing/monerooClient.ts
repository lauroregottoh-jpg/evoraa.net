/**
 * Client Moneroo (Standard checkout) — sans SDK npm pour limiter les deps.
 * Docs : https://docs.moneroo.io/payments/standard-integration
 */

const MONEROO_API = "https://api.moneroo.io/v1"

export async function monerooInitializePayment(args: {
  secretKey: string
  amountXof: number
  description: string
  returnUrl: string
  customerEmail: string
  customerFirstName: string
  customerLastName?: string
  metadata: Record<string, string>
}) {
  if (args.returnUrl.includes("localhost")) {
    return {
      ok: false as const,
      error:
        "Moneroo refuse localhost dans return_url. Définissez NEXT_PUBLIC_APP_URL (https://www.keliaa.org).",
    }
  }

  try {
    const res = await fetch(`${MONEROO_API}/payments/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(args.amountXof),
        currency: "XOF",
        description: args.description,
        return_url: args.returnUrl,
        customer: {
          email: args.customerEmail,
          first_name: args.customerFirstName || "Membre",
          last_name: args.customerLastName || "KELIAA",
        },
        metadata: args.metadata,
      }),
    })

    const payload = (await res.json().catch(() => ({}))) as {
      message?: string
      data?: { id?: string; checkout_url?: string }
      errors?: unknown
    }

    const id = payload?.data?.id
    const checkoutUrl = payload?.data?.checkout_url
    if (!res.ok || !id || !checkoutUrl) {
      return {
        ok: false as const,
        error:
          payload?.message ||
          `Moneroo initialize échoué (HTTP ${res.status})`,
        raw: payload,
      }
    }

    return {
      ok: true as const,
      txId: id,
      checkoutUrl,
      raw: payload,
    }
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "moneroo_init_failed",
    }
  }
}

export async function monerooVerifyPayment(args: {
  secretKey: string
  paymentId: string
}) {
  try {
    const res = await fetch(
      `${MONEROO_API}/payments/${encodeURIComponent(args.paymentId)}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${args.secretKey}`,
          Accept: "application/json",
        },
      }
    )
    const payload = (await res.json().catch(() => ({}))) as {
      data?: {
        id?: string
        status?: string
        amount?: number
        currency?: { code?: string } | string
        metadata?: Record<string, string>
      }
      message?: string
    }
    if (!res.ok || !payload?.data) {
      return {
        ok: false as const,
        error: payload?.message || `verify HTTP ${res.status}`,
      }
    }
    const status = String(payload.data.status || "").toLowerCase()
    const currency =
      typeof payload.data.currency === "string"
        ? payload.data.currency
        : payload.data.currency?.code || ""
    return {
      ok: true as const,
      status,
      amount: Number(payload.data.amount ?? 0),
      currency,
      metadata: payload.data.metadata || {},
      raw: payload.data,
    }
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "moneroo_verify_failed",
    }
  }
}
