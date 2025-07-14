import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['placehold.co'],
    unoptimized: true,
  },
  // 关闭错误提示toast
  onError: () => {},
  devIndicators: {
    buildActivity: false,
  },
  // 抑制水合警告
  suppressHydrationWarnings: true,
};

export default nextConfig;
