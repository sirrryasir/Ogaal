-- CreateTable
CREATE TABLE "drought_predictions" (
    "id" SERIAL NOT NULL,
    "village" TEXT NOT NULL,
    "risk_level" TEXT NOT NULL,
    "ai_message" TEXT NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drought_predictions_pkey" PRIMARY KEY ("id")
);
