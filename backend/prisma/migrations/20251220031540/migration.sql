-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "district_id" INTEGER,
ADD COLUMN     "issue_type" TEXT,
ADD COLUMN     "region_id" INTEGER,
ADD COLUMN     "reporter_name" TEXT,
ADD COLUMN     "reporter_phone" TEXT;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
