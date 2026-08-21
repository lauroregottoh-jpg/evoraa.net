export function coupleAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "https://www.keliaa.org"
}

export function coupleSpacePath() {
  return "/couple/espace"
}

export function couplePartnerJoinPath(inviteCode: string) {
  const code = inviteCode.trim().toUpperCase()
  return `/couple/rejoindre?code=${encodeURIComponent(code)}`
}

export function coupleAbsoluteUrl(path: string, baseUrl: string) {
  const base = baseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}


export function couplePartnerJoinPath(inviteCode: string) {
  const code = inviteCode.trim().toUpperCase()
  return `/couple/rejoindre?code=${encodeURIComponent(code)}`
}

export function coupleAbsoluteUrl(path: string, baseUrl: string) {
  const base = baseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}
