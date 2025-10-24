/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."admin" DROP CONSTRAINT "admin_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."admin";
