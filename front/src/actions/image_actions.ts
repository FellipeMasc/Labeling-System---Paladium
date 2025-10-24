"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteImage(imageId: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      select: { groupId: true },
    });

    await prisma.image.delete({
      where: { id: imageId },
    });

    if (image) {
      revalidatePath("/admin/groups");
      revalidatePath(`/admin/groups/${image.groupId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

export async function updateImageStatus(imageId: string, status: "UNLABELED" | "LABELED" | "REVIEWED") {
  try {
    const image = await prisma.image.update({
      where: { id: imageId },
      data: { status },
      select: { groupId: true },
    });

    revalidatePath(`/admin/groups/${image.groupId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating image status:", error);
    return { success: false, error: "Failed to update image status" };
  }
}
