import { createClient } from "@supabase/supabase-js"
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
const sb = createClient(url, key, { auth: { persistSession: false } })
const email = "lauroregottoh@gmail.com"

const { data: listed, error: le } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 })
if (le) {
  console.error("listUsers", le.message)
  process.exit(1)
}
const user = (listed?.users || []).find((u) => (u.email || "").toLowerCase() === email)
if (!user) {
  console.error("USER_NOT_FOUND", email)
  process.exit(2)
}
console.log("auth_user", user.id, user.email)

const meta = user.user_metadata || {}
const firstName = String(meta.first_name || meta.firstName || "Laurore").trim()

const { data: before, error: be } = await sb
  .from("profiles")
  .select("id,user_id,role,first_name")
  .eq("user_id", user.id)
  .maybeSingle()
if (be) console.error("select_err", be.message)
console.log("profile_before", before)

if (!before) {
  const row = {
    user_id: user.id,
    role: "admin",
    first_name: firstName,
    onboarding_status: "active",
  }
  const { data: created, error: ce } = await sb.from("profiles").insert(row).select("id,user_id,role,first_name").maybeSingle()
  if (ce) {
    console.error("insert_err", ce.message)
    process.exit(3)
  }
  console.log("profile_created", created)
} else {
  const { data: after, error: ue } = await sb
    .from("profiles")
    .update({ role: "admin" })
    .eq("user_id", user.id)
    .select("id,user_id,role,first_name")
    .maybeSingle()
  if (ue) {
    console.error("update_err", ue.message)
    process.exit(3)
  }
  console.log("profile_after", after)
}
