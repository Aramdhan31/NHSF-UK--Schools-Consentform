-- Optional per-event photos/video consent block (admin toggle).
ALTER TABLE "Event" ADD COLUMN "includeMediaConsent" BOOLEAN NOT NULL DEFAULT false;
