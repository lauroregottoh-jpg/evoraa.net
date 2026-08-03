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
  console.error("MISSING_ENV")
  process.exit(1)
}

const email = "lauroregottoh@gmail.com"
const sb = createClient(url, key, { auth: { persistSession: false } })

const { data: listed, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 })
if (error) {
  console.error("LIST_ERR", error.message)
  process.exit(1)
}

const user = (listed?.users || []).find((u) => (u.email || "").toLowerCase() === email)
if (!user) {
  console.error("USER_NOT_FOUND")
  process.exit(2)
}

const { data: before } = await sb
  .from("profiles")
  .select("id, role, first_name, user_id")
  .eq("user_id", user.id)
  .maybeSingle()

console.log("BEFORE_ROLE", before?.role ?? "null")
console.log("PROFILE_EXISTS", Boolean(before))

if (!before) {
  const { data: created, error: ce } = await sb
    .from("profiles")
    .insert({
      user_id: user.id,
      email,
      role: "admin",
      first_name: "Laurore",
      completion_percentage: 100,
      onboarding_status: "completed",
    })
    .select("role")
    .maybeSingle()
  if (ce) {
    console.error("INSERT_ERR", ce.message)
    process.exit(3)
  }
  console.log("AFTER_ROLE", created?.role ?? "null")
} else {
  const { data: after, error: ue } = await sb
    .from("profiles")
    .update({ role: "admin" })
    .eq("user_id", user.id)
    .select("role")
    .maybeSingle()
  if (ue) {
    console.error("UPDATE_ERR", ue.message)
    process.exit(3)
  }
  console.log("AFTER_ROLE", after?.role ?? "null")
}

console.log("DONE", "https://keliaa.org/ops-keliaa-hx7")
