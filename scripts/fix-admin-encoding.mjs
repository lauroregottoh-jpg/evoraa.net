import { readFileSync, writeFileSync } from "fs"

const path = "c:/Users/WINDOWS 11/Documents/GitHub/evoraa.net/src/app/actions/admin.ts"
const buf = readFileSync(path)

const bad = []
for (let i = 0; i < buf.length; i++) {
  const b = buf[i]
  if (b < 0x80) continue
  let len = 0
  if ((b & 0xe0) === 0xc0) len = 1
  else if ((b & 0xf0) === 0xe0) len = 2
  else if ((b & 0xf8) === 0xf0) len = 3
  else {
    bad.push(i)
    continue
  }
  let ok = true
  for (let j = 1; j <= len; j++) {
    if (i + j >= buf.length || (buf[i + j] & 0xc0) !== 0x80) {
      ok = false
      break
    }
  }
  if (!ok) bad.push(i)
  else i += len
}

console.log("bad count", bad.length)
for (const i of bad.slice(0, 10)) {
  console.log(i, buf[i].toString(16), JSON.stringify(buf.slice(Math.max(0, i - 40), i + 40).toString("latin1")))
}

// Rewrite as clean UTF-8: map latin1 high bytes / replace ? corruption
let text = buf.toString("latin1")

const map = [
  ["Non authentifi?.", "Non authentifie."],
  ["Acc?s admin requis.", "Acces admin requis."],
  ["R?serv? aux administrateurs (pas mod?rateurs).", "Reserve aux administrateurs (pas moderateurs)."],
  ["Acc?s refus?.", "Acces refuse."],
  ["Vous ne pouvez pas retirer votre propre r?le admin.", "Vous ne pouvez pas retirer votre propre role admin."],
  ["Cl? non autoris?e.", "Cle non autorisee."],
  ["sans exposer la cl?.", "sans exposer la cle."],
  ["Email, pr?nom et mot de passe (? 8) requis.", "Email, prenom et mot de passe (>= 8) requis."],
  ["Cr?ation compte impossible.", "Creation compte impossible."],
  ["Erreur cr?ation membre.", "Erreur creation membre."],
  ["Auto-mod?ration d?sactiv?e. Activez-la dans Param?tres.", "Auto-moderation desactivee. Activez-la dans Parametres."],
  ["Discernement automatique (r?gles) ? analyse", "Discernement automatique (regles) - analyse"],
  ["Pas un LLM factur? (V2 possible plus tard).", "Pas un LLM facture (V2 possible plus tard)."],
  ["Non renseign?", "Non renseigne"],
  ["Sanction ${action} ? ${sanctionStatus}", "Sanction ${action} -> ${sanctionStatus}"],
  ["Impossible de cr?er l'abonnement test.", "Impossible de creer l'abonnement test."],
  ["Impossible de cr?er le paiement test.", "Impossible de creer le paiement test."],
  ["KELLIA sandbox test ? ${amount} XOF", "KELLIA sandbox test - ${amount} XOF"],
]

for (const [from, to] of map) {
  text = text.split(from).join(to)
}

// Replace remaining high bytes (latin1 leftovers) with ASCII ?
text = text.replace(/[\u0080-\u00ff]/g, "?")

writeFileSync(path, text, "utf8")
console.log("rewrote as clean utf8, length", text.length)
