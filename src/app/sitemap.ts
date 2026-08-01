import type { MetadataRoute } from "next"

const BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://evoraa-net.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const paths = [
    "/",
    "/how-it-works",
    "/pricing",
    "/blog",
    "/contact",
    "/register",
    "/login",
    "/premium",
    "/charte",
    "/cgu",
    "/confidentialite",
    "/mentions-legales",
    "/about",
    "/help",
    "/blog/comment-reconnaitre-la-bonne-personne-selon-la-bible",
    "/blog/pourquoi-le-floutage-des-photos-transforme-les-rencontres",
    "/blog/le-role-de-la-prieres-dans-le-parcours-de-celibat",
    "/blog/temoignage-sarah-et-david-une-connexion-fondee-sur-la-vision",
    "/blog/gerer-les-finances-dans-le-couple-chretien",
    "/blog/l-importance-du-conseil-avant-le-mariage",
  ]

  return paths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/blog/") ? 0.6 : 0.8,
  }))
}
