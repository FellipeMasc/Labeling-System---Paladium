-- CreateTable
CREATE TABLE "labeler_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labeler_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "labeler_usage_userId_idx" ON "labeler_usage"("userId");

-- CreateIndex
CREATE INDEX "labeler_usage_imageId_idx" ON "labeler_usage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "labeler_usage_userId_imageId_key" ON "labeler_usage"("userId", "imageId");

-- AddForeignKey
ALTER TABLE "labeler_usage" ADD CONSTRAINT "labeler_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labeler_usage" ADD CONSTRAINT "labeler_usage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
