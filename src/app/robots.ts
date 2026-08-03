import type { MetadataRoute } from "next"

const BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://keliaa.org"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/ops-keliaa-hx7",
          "/dashboard",
          "/messages",
          "/compatibility",
          "/profile",
          "/settings",
          "/billing",
          "/checkout",
          "/onboarding",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
