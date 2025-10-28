/*
  Warnings:

  - The `context` column on the `image_context` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "image_context" DROP COLUMN "context",
ADD COLUMN     "context" DOUBLE PRECISION[];
