/**
 * Crée ou promeut un compte admin KELLIA (usage local uniquement).
 * Usage: node scripts/create-admin.mjs [email]
 */
import { readFileSync } from "fs"
import { randomBytes } from "crypto"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

function loadEnv() {
  const envPath = resolve(root, ".env.local")
  const text = readFileSync(envPath, "utf8")
  const env = {}
  for (const line of text.split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i === -1) continue
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return env
}

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
const email = (process.argv[2] || "admin@keliaa.net").trim().toLowerCase()
const firstName = process.argv[3] || "Laurore"

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local")
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
  "Content-Type": "application/json",
}

async function listUsers() {
  const res = await fetch(`${url}/auth/v1/admin/users?per_page=50`, { headers })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data.users ?? []
}

async function createUser(password) {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

async function promoteProfile(userId) {
  const res = await fetch(
    `${url}/rest/v1/profiles?user_id=eq.${userId}`,
    {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({
        role: "admin",
        first_name: firstName,
        email_verified: true,
        is_verified: true,
        identity_verified: true,
        onboarding_status: "active",
        completion_percentage: 95,
        moderation_status: "approved",
        updated_at: new Date().toISOString(),
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data[0]
}

async function main() {
  console.log(`Projet: ${url}`)
  console.log(`Email cible: ${email}`)

  const users = await listUsers()
  let user = users.find((u) => u.email?.toLowerCase() === email)

  let password = null
  if (!user) {
    password = `Keliaa-${randomBytes(4).toString("hex")}!`
    console.log("Création du compte...")
    user = await createUser(password)
    console.log("Compte créé:", user.id)
  } else {
    console.log("Compte existant:", user.id)
  }

  const profile = await promoteProfile(user.id)
  console.log("Profil admin OK — role:", profile.role)

  console.log("\n=== IDENTIFIANTS ADMIN ===")
  console.log("URL login:", (env.NEXT_PUBLIC_APP_URL || "https://evoraa-net.vercel.app") + "/login")
  console.log("Email:", email)
  if (password) {
    console.log("Mot de passe (à noter maintenant):", password)
    console.log("(Changez-le après la 1re connexion dans Paramètres)")
  } else {
    console.log("Mot de passe: utilisez celui déjà défini pour ce compte")
  }
  console.log("Admin:", (env.NEXT_PUBLIC_APP_URL || "https://evoraa-net.vercel.app") + "/admin")
}

main().catch((e) => {
  console.error("ERREUR:", e.message)
  process.exit(1)
})
