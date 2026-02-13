-- CreateEnum
CREATE TYPE "SavingType" AS ENUM ('GOAL', 'EMERGENCY', 'INVESTMENT');

-- AlterTable
ALTER TABLE "Saving" ADD COLUMN     "type" "SavingType" NOT NULL DEFAULT 'GOAL';
