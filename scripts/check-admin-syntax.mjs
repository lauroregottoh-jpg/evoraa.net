import fs from "node:fs"
const lines = fs.readFileSync("src/app/actions/admin.ts", "utf8").split(/\r?\n/)
let n = 0
for (let i = 1; i < lines.length; i++) {
  if (lines[i - 1].trim() === "}" && /^\s+[a-zA-Z_][\w?]*:/.test(lines[i])) {
    const next = lines.slice(i, i + 6).join("\n")
    if (next.includes(") {") || next.includes("}) {")) {
      n++
      console.log("BROKEN", i + 1)
    }
  }
}
console.log("broken_count", n)
