import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const env = fs.readFileSync(path.join(root, ".env.local"), "utf8")
const get = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, "m"))
  return m?.[1]?.trim().replace(/^["']|["']$/g, "")
}
const url = get("NEXT_PUBLIC_SUPABASE_URL")
const key = get("SUPABASE_SERVICE_ROLE_KEY")
if (!url || !key) {
  console.error("missing supabase env")
  process.exit(1)
}

const email = "lauroregottoh@gmail.com"
const password = `Kel#${crypto.randomBytes(5).toString("hex")}!${crypto.randomInt(10, 99)}`

const sb = createClient(url, key, { auth: { persistSession: false } })
const { data: listed, error: le } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 })
if (le) {
  console.error(le.message)
  process.exit(1)
}
const user = (listed?.users || []).find((u) => (u.email || "").toLowerCase() === email)
if (!user) {
  console.error("USER_NOT_FOUND")
  process.exit(2)
}

const { error: ue } = await sb.auth.admin.updateUserById(user.id, {
  password,
  email_confirm: true,
})
if (ue) {
  console.error(ue.message)
  process.exit(3)
}

const { data: profile, error: pe } = await sb
  .from("profiles")
  .update({ role: "admin", first_name: "Laurore" })
  .eq("user_id", user.id)
  .select("id, role, first_name")
  .maybeSingle()

if (pe) console.error("profile", pe.message)

console.log(
  JSON.stringify(
    {
      email,
      password,
      role: profile?.role || "admin",
      opsPath: "/ops-keliaa-hx7",
      loginUrl: "https://keliaa.org/login",
      consoleUrl: "https://keliaa.org/ops-keliaa-hx7",
    },
    null,
    2
  )
)
