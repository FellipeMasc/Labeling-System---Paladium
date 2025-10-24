import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  basePath: "/api/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  cors: {
    origin: [process.env.NEXT_PUBLIC_URL],
    credentials: true,
  },
  emailAndPassword: {
    enabled: true,
  },
});
