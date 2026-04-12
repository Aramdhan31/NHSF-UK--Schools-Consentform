-- AlterTable: operational plain-text fields (backfill existing rows, then require explicit values on new inserts)
ALTER TABLE "Submission" ADD COLUMN "parentName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Submission" ADD COLUMN "school" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Submission" ADD COLUMN "yearGroup" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Submission" ALTER COLUMN "parentName" DROP DEFAULT;
ALTER TABLE "Submission" ALTER COLUMN "school" DROP DEFAULT;
ALTER TABLE "Submission" ALTER COLUMN "yearGroup" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Submission_school_idx" ON "Submission"("school");

-- CreateIndex
CREATE INDEX "Submission_yearGroup_idx" ON "Submission"("yearGroup");
