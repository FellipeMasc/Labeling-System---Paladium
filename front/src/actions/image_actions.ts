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

export async function getImageById(imageId: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      select: { id: true, originalName: true, filename: true, url: true, status: true, tags: true },
    });
    return { success: true, image };
  } catch (error) {
    console.error("Error getting image by ID:", error);
    return { success: false, error: "Failed to get image by ID" };
  }
}

export async function addTagToImage(imageId: string, value: string, userId: string, source: "USER" | "AI" | "ADMIN") {
  try {
    const tag = await prisma.tag.create({
      data: { value, source, createdById: userId, imageId },
      select: { id: true, value: true, source: true, createdById: true, imageId: true, createdAt: true },
    });
    return { success: true, tag };
  } catch (error) {
    console.error("Error adding tag to image:", error);
    return { success: false, error: "Failed to add tag to image" };
  }
}
