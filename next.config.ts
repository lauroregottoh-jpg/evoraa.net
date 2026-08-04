import type { NextConfig } from "next";

const nextConfig = {
  serverActions: {
    bodySizeLimit: "6mb",
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
} as NextConfig;

export default nextConfig;
