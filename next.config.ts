import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // docker 설정 시 필요
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
