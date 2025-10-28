"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGroup(name: string, description?: string) {
  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
      },
    });
    revalidatePath("/admin/groups");
    revalidatePath("/admin");
    return { success: true, group };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: "Failed to create group" };
  }
}

export async function getGroups() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            members: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, groups };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return { success: false, error: "Failed to fetch groups" };
  }
}

export async function getGroupById(groupId: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        images: {
          include: {
            tags: {
              include: {
                createdBy: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return { success: true, group };
  } catch (error) {
    console.error("Error fetching group:", error);
    return { success: false, error: "Failed to fetch group" };
  }
}

export async function updateGroup(groupId: string, name: string, description?: string) {
  try {
    const group = await prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/admin/groups");
    revalidatePath("/admin/groups/group-detail");
    return { success: true, group };
  } catch (error) {
    console.error("Error updating group:", error);
    return { success: false, error: "Failed to update group" };
  }
}

export async function deleteGroup(groupId: string) {
  try {
    await prisma.group.delete({
      where: { id: groupId },
    });
    revalidatePath("/admin/groups");
    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { success: false, error: "Failed to delete group" };
  }
}

export async function assignUserToGroup(userId: string, groupId: string) {
  try {
    const member = await prisma.groupMember.create({
      data: {
        userId,
        groupId,
      },
    });
    revalidatePath("/admin/groups");
    revalidatePath("/admin/groups/group-detail");
    return { success: true, member };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "User already assigned to this group" };
    }
    console.error("Error assigning user to group:", error);
    return { success: false, error: "Failed to assign user to group" };
  }
}

export async function assignMultipleUsersToGroup(userIds: string[], groupId: string) {
  try {
    const members = await prisma.groupMember.createMany({
      data: userIds.map((userId) => ({
        userId,
        groupId,
      })),
      skipDuplicates: true,
    });
    revalidatePath("/admin/groups");
    revalidatePath("/admin/groups/group-detail");
    return { success: true, count: members.count };
  } catch (error) {
    console.error("Error assigning users to group:", error);
    return { success: false, error: "Failed to assign users to group" };
  }
}

export async function removeUserFromGroup(userId: string, groupId: string) {
  try {
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
    revalidatePath("/admin/groups");
    revalidatePath("/admin/groups/group-detail");
    return { success: true };
  } catch (error) {
    console.error("Error removing user from group:", error);
    return { success: false, error: "Failed to remove user from group" };
  }
}

export async function getAvailableLabelers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        admin: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching labelers:", error);
    return { success: false, error: "Failed to fetch labelers" };
  }
}

export async function getUserGroups(userId: string) {
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            members: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, groups };
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return { success: false, error: "Failed to fetch user groups" };
  }
}
