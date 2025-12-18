/*
  Warnings:

  - The `status` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('WORKING', 'BROKEN', 'DRY', 'LOW_WATER', 'CONTAMINATION');

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus";
