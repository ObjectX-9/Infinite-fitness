import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['placehold.co'],
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
