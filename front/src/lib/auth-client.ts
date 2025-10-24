import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signOut, signUp, useSession, forgetPassword, sendVerificationEmail, resetPassword, getSession } =
  authClient;
