import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

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
    autoSignIn: false,
  },
});
