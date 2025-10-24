import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "credentials",
    },
  });

  return NextResponse.json({ emailVerified: user.emailVerified, accountVerified: !!account }, { status: 200 });
}
