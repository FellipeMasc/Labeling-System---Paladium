import type { NextConfig } from "next";

const awsRegion = process.env.AWS_REGION || "";
const awsBucketName = process.env.AWS_BUCKET_NAME || "";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    //domains: ["localhost", `s3.${awsRegion}.amazonaws.com`, `${awsBucketName}.s3.${awsRegion}.amazonaws.com`],
    remotePatterns: [
      {
        protocol: "https",
        hostname: `s3.${awsRegion}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `${awsBucketName}.s3.${awsRegion}.amazonaws.com`,
      },
    ],
  },
  env: {
    AI_API_URL: process.env.AI_API_URL,
  },
};

export default nextConfig;
