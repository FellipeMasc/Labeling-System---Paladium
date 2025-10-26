import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function verifySession(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionCookie) {
    return null;
  }

  const sessionToken = sessionCookie.split(".")[0];

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  return session;
}

export async function verifyUser(request: NextRequest) {
  const session = await verifySession(request);

  if (!session) {
    return null;
  }

  return session;
}

export async function verifyAdmin(request: NextRequest) {
  const session = await verifySession(request);

  if (!session || !session.user.admin) {
    return null;
  }

  return session;
}
