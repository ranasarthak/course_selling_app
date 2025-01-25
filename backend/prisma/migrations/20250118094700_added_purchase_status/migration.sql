-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING';
