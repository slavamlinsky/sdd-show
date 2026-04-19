import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow HMR / dev assets when opening the site from another host (e.g. phone on LAN).
  allowedDevOrigins: ["192.168.1.119"],
  async redirects() {
    return [{ source: "/sign-up", destination: "/sign-in", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
