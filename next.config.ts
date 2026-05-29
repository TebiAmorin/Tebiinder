import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Discord avatars (user profiles)
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      // R6 rank icons CDN
      {
        protocol: "https",
        hostname: "r6data.com",
        pathname: "/assets/**",
      },
      // Operator icon SVGs
      {
        protocol: "https",
        hostname: "r6operators.marcopixel.eu",
        pathname: "/icons/**",
      },
      // Legacy tracker CDN (can remove later)
      {
        protocol: "https",
        hostname: "trackercdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
