"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Toggle on-site check-in for a submission. Scoped to `eventId` so IDs cannot be
 * reused across events. Writes an audit log entry.
 */
export async function toggleSubmissionCheckIn(
  eventId: string,
  submissionId: string,
  nextCheckedIn: boolean,
): Promise<void> {
  const user = await requireAdminUser();

  await prisma.$transaction(async (tx) => {
    const updated = await tx.submission.updateMany({
      where: { id: submissionId, eventId },
      data: {
        checkedIn: nextCheckedIn,
        checkedInAt: nextCheckedIn ? new Date() : null,
        checkedInBy: nextCheckedIn ? (user.email ?? user.id) : null,
      },
    });

    if (updated.count === 0) {
      throw new Error("Submission not found");
    }

    await tx.auditLog.create({
      data: {
        adminId: user.id,
        action: nextCheckedIn
          ? "CHECKED_IN_SUBMISSION"
          : "UNCHECKED_IN_SUBMISSION",
        targetType: "Submission",
        targetId: submissionId,
      },
    });
  });

  revalidatePath(`/admin/events/${eventId}/submissions`);
}

function formText(formData: FormData, key: string): string {
  const v = formData.get(key);
  if (v == null) return "";
  if (typeof v === "string") return v;
  return "";
}

const NOTES_MAX = 2000;

/**
 * Update admin notes for a submission (plain text, server-only). Scoped to event.
 */
export async function updateSubmissionNotes(
  eventId: string,
  submissionId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireAdminUser();

  const raw = formText(formData, "notes");
  const trimmed = raw.trim();
  const notes = trimmed === "" ? null : trimmed.slice(0, NOTES_MAX);

  await prisma.$transaction(async (tx) => {
    const updated = await tx.submission.updateMany({
      where: { id: submissionId, eventId },
      data: { notes },
    });

    if (updated.count === 0) {
      throw new Error("Submission not found");
    }

    await tx.auditLog.create({
      data: {
        adminId: user.id,
        action: "UPDATED_SUBMISSION_NOTES",
        targetType: "Submission",
        targetId: submissionId,
      },
    });
  });

  revalidatePath(`/admin/events/${eventId}/submissions`);
}
