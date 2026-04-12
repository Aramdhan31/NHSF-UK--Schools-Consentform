-- AlterTable
ALTER TABLE "Event" ADD COLUMN "formFieldsJson" JSONB;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "extrasEncrypted" TEXT;
