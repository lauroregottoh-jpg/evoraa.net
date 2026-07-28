import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const path = resolve(root, "src/app/actions/admin.ts")

let s = readFileSync(path, "binary")

s = s.replace(/Acc\xe8s refus\xe9\.\./g, "Acc\u00e8s refus\u00e9.")
s = s.replace(/Acc\xe8s refus\xe9\./g, "Acc\u00e8s refus\u00e9.")
s = s.replace(/Acc\?s admin/g, "Acc\u00e8s admin")
s = s.replace(
  /Sanction \$\{action\} \? \$\{sanctionStatus\}/g,
  "Sanction ${action} \u2192 ${sanctionStatus}"
)

writeFileSync(path, s, "utf8")
console.log("admin.ts encoding fixed")
