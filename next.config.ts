import type { NextConfig } from "next";

/**
 * Headers de sécurité (pattern Evoora).
 * Pas de CSP tant qu’on n’a pas de nonce App Router — HSTS / XFO / nosniff suffisent
 * pour coller au niveau béton côté edge CDN.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Micro/caméra pour Daily Prebuilt (sous-domaines *.daily.co) + self
    value:
      "camera=*, microphone=*, geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig = {
  serverActions: {
    bodySizeLimit: "6mb",
  },
  // Inclure les PDF du Coffre dans le bundle serveur (route download).
  outputFileTracingIncludes: {
    "/coffre-premium/download/[resourceId]": ["./docs/COFFRE PREMIUM/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
} as NextConfig;

export default nextConfig;
