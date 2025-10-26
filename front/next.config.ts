import type { NextConfig } from "next";

const awsRegion = process.env.AWS_REGION || "";
const awsBucketName = process.env.AWS_BUCKET_NAME || "";
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
const aiApiUrl = process.env.AI_API_URL || "http://localhost:8080";

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
    AI_API_URL: aiApiUrl,
    DATABASE_URL: databaseUrl,
    AWS_REGION: awsRegion,
    AWS_BUCKET_NAME: awsBucketName,
  },
};

export default nextConfig;
