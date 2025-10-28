-- CreateTable
CREATE TABLE "image_context" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "context" JSONB NOT NULL,

    CONSTRAINT "image_context_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_context_imageId_idx" ON "image_context"("imageId");
