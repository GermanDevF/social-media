import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  transpilePackages: ["@radix-ui/react-icons", "lucide-react"],
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
  rewrites: async () => [
    {
      source: "/h/:tag",
      destination: "/search?q=%23:tag",
    },
  ],
};

export default nextConfig;
