import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/rules", destination: "/#rules", permanent: false },
      { source: "/portfolio", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
