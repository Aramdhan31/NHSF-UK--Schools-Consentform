-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "checkedIn" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Submission" ADD COLUMN "checkedInAt" TIMESTAMP(3);
ALTER TABLE "Submission" ADD COLUMN "checkedInBy" TEXT;

-- CreateIndex
CREATE INDEX "Submission_checkedIn_idx" ON "Submission"("checkedIn");
