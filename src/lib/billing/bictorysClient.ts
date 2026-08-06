import { execFile } from "node:child_process"
import { promisify } from "node:util"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"

const execFileP = promisify(execFile)
const MAX_RETRIES_ON_WAF_403 = 3

export function bictorysApiUrl(apiKey: string) {
  return apiKey.startsWith("test_")
    ? "https://api.test.bictorys.com"
    : "https://api.bictorys.com"
}

export function parseRawHttpResponse(raw: string): { status: number; body: string } {
  const sep = raw.indexOf("\r\n\r\n")
  const head = sep >= 0 ? raw.slice(0, sep) : raw
  const body = sep >= 0 ? raw.slice(sep + 4) : ""
  const statusLine = head.split(/\r?\n/)[0] ?? ""
  const m = statusLine.match(/^HTTP\/[\d.]+\s+(\d+)/)
  return { status: m ? Number(m[1]) : 0, body }
}

async function bictorysCurl(
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string }
) {
  const args = ["-i", "-X", init.method]
  for (const [k, v] of Object.entries(init.headers)) args.push("-H", `${k}: ${v}`)
  if (init.body) args.push("-d", init.body)
  args.push(url)

  let lastError = ""
  for (let attempt = 0; attempt < MAX_RETRIES_ON_WAF_403; attempt++) {
    try {
      const { stdout } = await execFileP("curl", args, {
        timeout: 15000,
        maxBuffer: 4 * 1024 * 1024,
      })
      const { status, body } = parseRawHttpResponse(stdout)
      if (status === 403 && body.includes("Forbidden")) {
        lastError = `Bictorys WAF 403 (tentative ${attempt + 1}/${MAX_RETRIES_ON_WAF_403})`
        if (attempt < MAX_RETRIES_ON_WAF_403 - 1) {
          await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt))
          continue
        }
      }
      return { status, body }
    } catch (err) {
      lastError = (err as Error).message
      if (attempt < MAX_RETRIES_ON_WAF_403 - 1) {
        await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt))
      }
    }
  }
  return { status: 0, body: lastError }
}

export async function probeBictorysKey(apiKey: string) {
  const url = `${bictorysApiUrl(apiKey)}/pay/v1/transactions/izi_verify_probe_${Date.now()}/status?by_charge_id=true`
  const { status } = await bictorysCurl(url, {
    method: "GET",
    headers: { "X-Api-Key": apiKey, Accept: "application/json" },
  })
  if (status === 401 || status === 403) {
    return { ok: false as const, error: "Clé Bictorys invalide ou refusée." }
  }
  return {
    ok: true as const,
    sandbox: apiKey.startsWith("test_"),
    status,
  }
}

export async function bictorysCreateCharge(args: {
  apiKey: string
  paymentId: string
  amount: number
  description: string
  customerName: string
  customerEmail: string
  customerCity?: string
  paymentMode: BictorysPaymentMode
  appBaseUrl: string
  /** Chemin relatif après paiement (défaut : checkout/success) */
  successPath?: string
  cancelPath?: string
}) {
  const merchantCountry = process.env.BICTORYS_MERCHANT_COUNTRY || "TG"
  const notifyUrl = `${args.appBaseUrl}/api/payments/bictorys/notify`
  const successPath =
    args.successPath || `/checkout/success?payment=${args.paymentId}`
  const cancelPath =
    args.cancelPath || `/checkout/cancel?payment=${args.paymentId}`
  const returnUrl = successPath.startsWith("http")
    ? successPath
    : `${args.appBaseUrl}${successPath}`
  const cancelUrl = cancelPath.startsWith("http")
    ? cancelPath
    : `${args.appBaseUrl}${cancelPath}`

  if (returnUrl.includes("localhost") || cancelUrl.includes("localhost")) {
    return {
      ok: false as const,
      error:
        "Bictorys refuse localhost dans les URLs. Définissez NEXT_PUBLIC_APP_URL avec un domaine public (https://www.keliaa.org).",
    }
  }

  const defaultCity =
    merchantCountry === "TG"
      ? "Lome"
      : merchantCountry === "CI"
        ? "Abidjan"
        : "Dakar"

  const body = {
    amount: args.amount,
    currency: "XOF",
    country: merchantCountry,
    paymentReference: args.paymentId,
    successRedirectUrl: returnUrl,
    errorRedirectUrl: cancelUrl,
    ErrorRedirectUrl: cancelUrl,
    notifyUrl,
    customerObject: {
      name: args.customerName || "Customer",
      email: args.customerEmail,
      city: args.customerCity || defaultCity,
      country: merchantCountry,
      locale: "fr-FR",
    },
  }

  const { status, body: responseBody } = await bictorysCurl(
    `${bictorysApiUrl(args.apiKey)}/pay/v1/charges`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": args.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  if (status < 200 || status >= 300) {
    return {
      ok: false as const,
      error: `Bictorys ${status}: ${responseBody.slice(0, 180)}`,
    }
  }

  const payload = JSON.parse(responseBody) as {
    transactionId?: string
    chargeId?: string
    link?: string
    redirectUrl?: string
    data?: { transactionId?: string; chargeId?: string; link?: string; redirectUrl?: string }
  }
  const d = payload.data ?? payload
  const txId = d.transactionId || d.chargeId
  let checkoutUrl = d.link || d.redirectUrl
  if (!txId || !checkoutUrl) {
    return { ok: false as const, error: "Réponse Bictorys incomplète." }
  }

  try {
    const u = new URL(checkoutUrl)
    if (!u.searchParams.has("payment_category")) {
      u.searchParams.set("payment_category", args.paymentMode)
      checkoutUrl = u.toString()
    }
  } catch {
    // keep original URL
  }

  return {
    ok: true as const,
    txId,
    checkoutUrl,
    paymentMode: args.paymentMode,
    raw: payload,
  }
}
