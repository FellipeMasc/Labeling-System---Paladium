import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "s3.us-east-1.amazonaws.com", "paladium-case.s3.us-east-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "paladium-case.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
