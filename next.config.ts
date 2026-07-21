import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase.viabilidade.vettrus.com.br",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
