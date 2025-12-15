-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "source_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "submitted_by" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "water_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
