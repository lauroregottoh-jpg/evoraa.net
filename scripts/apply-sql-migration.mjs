/**
 * Applique une migration SQL via SUPABASE_DB_URL (.env.local).
 * Usage: node scripts/apply-sql-migration.mjs supabase/migrations/20240101000012_admin_ops_policies.sql
 */
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { spawnSync } from "child_process"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

function loadEnv() {
  const text = readFileSync(resolve(root, ".env.local"), "utf8")
  const env = {}
  for (const line of text.split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i === -1) continue
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "")
  }
  return env
}

const rel = process.argv[2]
if (!rel) {
  console.error("Usage: node scripts/apply-sql-migration.mjs <path-to.sql>")
  process.exit(1)
}

const env = loadEnv()
let dbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL
if (!dbUrl) {
  console.error("SUPABASE_DB_URL manquant dans .env.local")
  process.exit(1)
}

// Encode password special chars if present
const m = dbUrl.match(/^(postgres(?:ql)?:\/\/)([^:]+):(.+)@([^/]+)(\/.*)?$/)
if (m) {
  const [, scheme, user, password, hostPart, pathPart] = m
  dbUrl = `${scheme}${user}:${encodeURIComponent(password.trim())}@${hostPart}${pathPart || "/postgres"}`
}

const sqlPath = resolve(root, rel)
const sql = readFileSync(sqlPath, "utf8")
console.log("Applying:", rel)

const r = spawnSync(
  "npx",
  ["--yes", "supabase", "db", "query", "--db-url", dbUrl, sql],
  { cwd: root, encoding: "utf8", shell: true, maxBuffer: 10 * 1024 * 1024 }
)

if (r.stdout) process.stdout.write(r.stdout)
if (r.stderr) process.stderr.write(r.stderr)

if (r.status !== 0) {
  // Fallback: psql if available
  console.log("Retry via psql...")
  const r2 = spawnSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-c", sql], {
    cwd: root,
    encoding: "utf8",
    shell: true,
  })
  if (r2.stdout) process.stdout.write(r2.stdout)
  if (r2.stderr) process.stderr.write(r2.stderr)
  if (r2.status !== 0) {
    console.error("Échec application migration")
    process.exit(r2.status || 1)
  }
}

console.log("Migration OK")
