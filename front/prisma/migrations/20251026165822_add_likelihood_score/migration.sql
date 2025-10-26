-- AlterTable
ALTER TABLE "tag" ADD COLUMN     "likelihoodScore" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "likelihoodScore" DOUBLE PRECISION DEFAULT 0;
