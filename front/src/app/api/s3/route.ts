import { S3Lib } from "@/lib/s3-lib";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiCallBackground } from "@/lib/api-call";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const userAdmin = await verifyAdmin(request);
    if (!userAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const groupId = formData.get("groupId") as string;
    const files = formData.getAll("files") as File[];
    const autoUsersAssigning = formData.get("autoUsersAssigning") === "true" ? true : false;

    if (!groupId) {
      return NextResponse.json({ success: false, error: "Group ID is required" }, { status: 400 });
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    console.log(`Uploading ${files.length} file(s) to group ${groupId}`);

    const s3 = S3Lib.getInstance();
    const uploadedImages = [];

    // Process each file
    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const key = `images/${groupId}/${filename}`;

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      await s3.send(command);

      // Construct S3 URL
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // Save to database
      const image = await prisma.image.create({
        data: {
          filename,
          originalName: file.name,
          url,
          groupId,
          status: "UNLABELED",
        },
      });

      uploadedImages.push(image);
      console.log(`✓ Uploaded: ${file.name} -> ${filename}`);
    }

    // leverage available pool and automatically assign users to this group (background process)
    if (autoUsersAssigning) {
      apiCallBackground(`${process.env.AI_API_URL}/admins/auto-users-assign`, userAdmin.token || "", {
        method: "POST",
        body: JSON.stringify({ group_id: groupId }),
      });
    }
    revalidatePath("/admin/groups");
    revalidatePath(`/admin/groups/${groupId}`);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload images",
      },
      { status: 500 }
    );
  }
}
