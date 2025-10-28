"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  try {
    let totalUsers = 0;
    let totalGroups = 0;
    let totalImages = 0;
    let totalLabelers = 0;
    let unlabeledImages = 0;
    let labeledImages = 0;
    let reviewedImages = 0;
    let averageUsersLikelihoodScore = 0;
    let result: { avg: number }[] | undefined;
    await prisma.$transaction(async (tx) => {
      totalUsers = await tx.user.count();
      totalGroups = await tx.group.count();
      totalImages = await tx.image.count();
      totalLabelers = await tx.user.count({ where: { admin: false } });
      unlabeledImages = await tx.image.count({ where: { status: "UNLABELED" } });
      labeledImages = await tx.image.count({ where: { status: "LABELED" } });
      reviewedImages = await tx.image.count({ where: { status: "REVIEWED" } });
      result = await tx.$queryRaw<{ avg: number }[]>`SELECT AVG("likelihoodScore") FROM public.user`;
      averageUsersLikelihoodScore = result ? result[0].avg : 0;
    });

    return {
      success: true,
      stats: {
        totalUsers,
        totalGroups,
        totalImages,
        totalLabelers,
        unlabeledImages,
        labeledImages,
        reviewedImages,
        averageUsersLikelihoodScore,
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
