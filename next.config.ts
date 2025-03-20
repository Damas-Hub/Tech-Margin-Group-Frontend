import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.pexels.com","cdn.vectorstock.com", "tinyurl.com"],
  },
};

export default nextConfig;
