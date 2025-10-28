"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createAdmin = async (userId: string) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { admin: true },
    });
    return { success: true, message: "Admin created successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create admin" };
  }
};
