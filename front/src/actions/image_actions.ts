"use server";

import { apiCallBackground } from "@/lib/api-call";
import { prisma } from "@/lib/prisma";
import { S3Lib } from "@/lib/s3-lib";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function deleteImage(imageId: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      select: { groupId: true, filename: true },
    });

    await prisma.image.delete({
      where: { id: imageId },
    });

    if (image) {
      const s3 = S3Lib.getInstance();
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${image.groupId}/${image.filename}`,
      });
      await s3.send(command);
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
      select: { id: true, originalName: true, filename: true, url: true, status: true, tags: true, groupId: true },
    });
    return { success: true, image };
  } catch (error) {
    console.error("Error getting image by ID:", error);
    return { success: false, error: "Failed to get image by ID" };
  }
}

export async function getImageTagsByIdForAdmin(imageId: string) {
  try {
    const queryResult = await prisma.$queryRaw<
      {
        imageId: string;
        filename: string;
        originalName: string;
        url: string;
        groupId: string;
        tags: {
          tagId: string;
          name: string;
          value: string;
          source: "USER" | "AI" | "ADMIN";
          createdAt: Date;
          updatedAt: Date;
          likelihoodScore: number;
        }[];
      }[]
    >`
                with tags_and_users as (
                  select t."imageId" , i.filename, i."originalName", i.url, i."groupId",  u."name", t.value, t."source", t."createdAt", t."updatedAt", t.id as "tagId", t."likelihoodScore"
                  from public.user u
                  inner join public.tag t on t."createdById" = u.id 
                  inner join public.image i on i.id = t."imageId" 
                  where t."imageId" = ${imageId}
                )
                select tau."imageId", tau.filename, tau."originalName", tau.url, tau."groupId", jsonb_agg(jsonb_build_object(
                'tagId', tau."tagId",
                'name', tau."name",
                'value', tau.value,
                'source', tau.source,
                'createdAt', tau."createdAt", 
                'uptadeAt', tau."updatedAt",
                'likelihoodScore', tau."likelihoodScore"
                )) as tags
                from tags_and_users tau
                group by tau."imageId", tau.filename, tau."originalName", tau.url, tau."groupId"
    `;
    const queryDict = queryResult[0];
    if (!queryDict) {
      return { success: false, error: "Image not found" };
    }
    const result = {
      imageId: queryDict.imageId,
      filename: queryDict.filename,
      originalName: queryDict.originalName,
      url: queryDict.url,
      groupId: queryDict.groupId,
      tags: queryDict.tags,
    };
    return { success: true, result };
  } catch (error) {
    console.error("Error getting image by ID:", error);
    return { success: false, error: "Failed to get image by ID" };
  }
}

export async function addTagToImage(
  imageId: string,
  value: string,
  userId: string,
  source: "USER" | "AI" | "ADMIN",
  token: string
) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      select: { groupId: true },
    });
    const tag = await prisma.tag.create({
      data: { value, source, createdById: userId, imageId },
      select: { id: true, value: true, source: true, createdById: true, imageId: true, createdAt: true },
    });
    apiCallBackground(`${process.env.AI_API_URL}/users/update-likelihood-score`, token, {
      method: "POST",
      body: JSON.stringify({ tag_id: tag.id, label: value }),
    });
    console.log("image", image);
    await prisma.image.update({
      where: { id: imageId },
      data: { status: "LABELED" },
    });
    if (image) {
      revalidatePath(`/admin/groups/${image.groupId}`);
      revalidatePath(`/annotate/${imageId}`);
    }
    return { success: true, tag };
  } catch (error) {
    console.error("Error adding tag to image:", error);
    return { success: false, error: "Failed to add tag to image" };
  }
}

export async function removeTagFromImage(tagId: string) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { imageId: true },
    });
    if (!tag) {
      return { success: false, error: "Tag not found" };
    }
    await prisma.tag.delete({
      where: { id: tagId },
    });
    const image = await prisma.image.findUnique({
      where: { id: tag.imageId },
      select: { groupId: true },
    });
    if (image) {
      revalidatePath(`/admin/groups/${image.groupId}`);
      revalidatePath(`/annotate/${tagId}`);
    }
    revalidatePath(`/annotate/${tagId}`);
    const countTags = await prisma.tag.count({
      where: { imageId: tag.imageId },
    });
    if (countTags === 0) {
      await prisma.image.update({
        where: { id: tag.imageId },
        data: { status: "UNLABELED" },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error removing tag from image:", error);
    return { success: false, error: "Failed to remove tag from image" };
  }
}

export async function updateTag(tagId: string, value: string, token: string, source: "USER" | "AI" | "ADMIN" = "USER") {
  try {
    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: { value, source },
      select: { id: true, value: true, source: true, createdById: true, imageId: true, createdAt: true },
    });
    if (source === "ADMIN") {
      apiCallBackground(`${process.env.AI_API_URL}/admins/update-likelihood-score`, token, {
        method: "POST",
        body: JSON.stringify({ tag_id: tagId, label: value }),
      });
    }
    if (source === "USER") {
      apiCallBackground(`${process.env.AI_API_URL}/users/update-likelihood-score`, token, {
        method: "POST",
        body: JSON.stringify({ tag_id: tagId, label: value }),
      });
    }
    revalidatePath(`/admin/annotate?imageId=${tag.imageId}`);
    revalidatePath(`/annotate?imageId=${tag.imageId}`);
    return { success: true, tag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}
