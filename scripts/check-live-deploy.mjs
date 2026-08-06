import https from "node:https"

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = []
        res.on("data", (c) => chunks.push(c))
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          })
        )
      })
      .on("error", reject)
  })
}

const needles = [
  "Eva · Questionnaires",
  "Eva vous rappelle",
  "Se déconnecter",
  "Compte",
  "Questionnaires",
]

for (const url of [
  "https://www.keliaa.org/cgu",
  "https://www.keliaa.org/login",
  "https://www.keliaa.org/onboarding",
]) {
  const page = await get(url)
  const html = page.body
  console.log("\n===", url, "status", page.status)
  console.log("html_has_Se_deconnecter", /Se d.connecter/.test(html))
  console.log("html_has_Compte", html.includes("Compte"))
  console.log("html_has_Eva_Q", html.includes("Questionnaires"))
  const chunkPaths = [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/[^"']+\.js/g)].map((m) => m[0])
    ),
  ].slice(0, 60)
  const bm = html.match(/\/_next\/static\/([A-Za-z0-9_-]+)\/_buildManifest\.js/)
  console.log("buildId", bm?.[1] || "unknown", "chunks", chunkPaths.length)
  const found = {}
  for (const path of chunkPaths) {
    const js = (await get("https://www.keliaa.org" + path)).body
    for (const n of needles) {
      if (js.includes(n)) {
        found[n] = found[n] || []
        if (found[n].length < 3) found[n].push(path)
      }
    }
  }
  console.log(JSON.stringify(found, null, 2))
}
