"use server";
import prisma from "@/lib/prisma";

export const createAdmin = async (userId: string) => {
  console.log("createAdmin", userId);
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { admin: true },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create admin");
  }
};
