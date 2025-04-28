import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `.ufs.sh`,
        pathname: "/f/*",
      },
    ],
    domains: ["utfs.io"],
  },
};

export default nextConfig;
