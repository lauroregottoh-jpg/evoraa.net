/**
 * Applique une migration SQL via SUPABASE_DB_URL (.env.local).
 * Usage: node scripts/apply-sql-migration.mjs supabase/migrations/20240101000012_admin_ops_policies.sql
 *
 * Note: `supabase db query` n'accepte qu'une commande à la fois → on découpe sur `;`.
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

/** Découpe SQL en statements (ignore commentaires de ligne). */
function splitStatements(sql) {
  const withoutLineComments = sql
    .split("\n")
    .filter((l) => !l.trim().startsWith("--"))
    .join("\n")
  return withoutLineComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
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

const m = dbUrl.match(/^(postgres(?:ql)?:\/\/)([^:]+):(.+)@([^/]+)(\/.*)?$/)
if (m) {
  const [, scheme, user, password, hostPart, pathPart] = m
  dbUrl = `${scheme}${user}:${encodeURIComponent(password.trim())}@${hostPart}${pathPart || "/postgres"}`
}

const sqlPath = resolve(root, rel)
const sql = readFileSync(sqlPath, "utf8")
const statements = splitStatements(sql)
console.log("Applying:", rel, `(${statements.length} statements)`)

let failed = false
for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i] + ";"
  console.log(`\n--- [${i + 1}/${statements.length}] ---`)
  const r = spawnSync(
    "npx",
    ["--yes", "supabase", "db", "query", "--db-url", dbUrl],
    {
      cwd: root,
      encoding: "utf8",
      shell: true,
      input: stmt,
      maxBuffer: 10 * 1024 * 1024,
    }
  )
  if (r.stdout) process.stdout.write(r.stdout)
  if (r.stderr) process.stderr.write(r.stderr)
  if (r.status !== 0) {
    console.error(`Échec statement ${i + 1}`)
    failed = true
    break
  }
}

if (failed) {
  process.exit(1)
}

console.log("\nMigration OK")
