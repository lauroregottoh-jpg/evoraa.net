/**
 * Apply a single SQL migration file using SUPABASE_DB_URL from .env.local
 * Usage: node scripts/apply-sql-file.mjs supabase/migrations/20240101000021_user_feedback.sql
 */
import fs from "node:fs"
import path from "node:path"
import pg from "pg"

const fileArg = process.argv[2]
if (!fileArg) {
  console.error("Usage: node scripts/apply-sql-file.mjs <path-to.sql>")
  process.exit(1)
}

const envPath = path.resolve(".env.local")
const envText = fs.readFileSync(envPath, "utf8")
let dbUrl = ""
for (const line of envText.split(/\r?\n/)) {
  if (line.startsWith("SUPABASE_DB_URL=")) {
    dbUrl = line.slice("SUPABASE_DB_URL=".length).trim().replace(/^["']|["']$/g, "")
    break
  }
}
if (!dbUrl) {
  console.error("SUPABASE_DB_URL missing in .env.local")
  process.exit(1)
}

const m = dbUrl.match(/^(postgres(?:ql)?:\/\/)([^:]+):(.+)@([^/]+)(\/.*)?$/)
if (m) {
  const [, scheme, user, password, hostPart, pathPart] = m
  dbUrl = `${scheme}${user}:${encodeURIComponent(password.trim())}@${hostPart}${pathPart || "/postgres"}`
}

const sqlPath = path.resolve(fileArg)
const sql = fs.readFileSync(sqlPath, "utf8")
const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
try {
  await client.query(sql)
  console.log("Applied:", path.basename(sqlPath))
} finally {
  await client.end()
}
