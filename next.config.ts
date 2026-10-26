import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: { root: process.cwd() },
  async redirects() {
    return [{ source: "/demo1", destination: "/", permanent: true }];
  },
};

export default nextConfig;
