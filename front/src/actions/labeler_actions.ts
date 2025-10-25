"use server";
import prisma from "@/lib/prisma";

export async function getLabelerUsage(userId: string, imageId: string) {
  try {
    const labelerUsage = await prisma.labelerUsage.findUnique({
      where: { userId_imageId: { userId, imageId } },
    });
    return { success: true, labelerUsage: labelerUsage ? true : false };
  } catch (error) {
    console.error("Error getting labeler usage:", error);
    return { success: false, error: "Failed to get labeler usage" };
  }
}

export async function addLabelerUsage(userId: string, imageId: string) {
  try {
    const labelerUsage = await prisma.labelerUsage.create({
      data: { userId, imageId },
    });
    return { success: true, labelerUsage };
  } catch (error) {
    console.error("Error adding labeler usage:", error);
    return { success: false, error: "Failed to add labeler usage" };
  }
}
