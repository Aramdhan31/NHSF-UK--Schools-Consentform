"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { sendConsentConfirmationEmail } from "@/lib/server/send-consent-confirmation-email";
import { encryptSubmissionPlaintext } from "@/lib/server/submission-field-crypto";
import { encryptSubmissionSensitiveFields } from "@/lib/server/submission-sensitive";
import {
  buildConsentSubmissionSchema,
  consentRawFromFormData,
  normalizeSchoolFieldsForStorage,
  splitConsentPayload,
} from "@/lib/consent-submission";
import {
  defaultConsentFormFields,
  eventConsentFieldsForUse,
} from "@/lib/form-template";

const PUBLISHED = "published";
const ENCRYPTION_ENV = "SUBMISSIONS_ENCRYPTION_KEY";

function formText(formData: FormData, key: string): string {
  const v = formData.get(key);
  if (v == null) return "";
  if (typeof v === "string") return v;
  return "";
}

/**
 * Public consent form submission. Reads `_eventId` and `_eventSlug` from the form.
 * When `_eventId` is set, persists an encrypted row in the database.
 * When omitted (static demo events), validates the default template server-side and redirects only.
 */
export async function submitConsentForEvent(formData: FormData): Promise<void> {
  const eventId = formText(formData, "_eventId").trim();
  const slugHint = formText(formData, "_eventSlug").trim();

  if (!eventId) {
    if (process.env.NODE_ENV === "production") {
      redirect("/events?error=unavailable");
    }
    if (!slugHint) {
      redirect("/events?error=invalid-form");
    }
    const fields = defaultConsentFormFields();
    const schema = buildConsentSubmissionSchema(fields);
    const raw = consentRawFromFormData(formData, fields);
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      redirect(`/events/${slugHint}?error=invalid-form`);
    }
    redirect(`/events/${slugHint}/submitted`);
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, status: PUBLISHED },
    select: {
      id: true,
      slug: true,
      title: true,
      formFieldsJson: true,
      includeMediaConsent: true,
    },
  });

  if (!event) {
    redirect(
      slugHint
        ? `/events/${slugHint}?error=event-not-found`
        : "/events?error=event-not-found",
    );
  }

  const fields = eventConsentFieldsForUse(
    event.formFieldsJson,
    event.includeMediaConsent,
  );
  const schema = buildConsentSubmissionSchema(fields);
  const raw = consentRawFromFormData(formData, fields);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    redirect(
      slugHint
        ? `/events/${slugHint}?error=invalid-form`
        : "/events?error=invalid-form",
    );
  }

  const split = splitConsentPayload(
    normalizeSchoolFieldsForStorage(
      parsed.data as Record<string, unknown>,
    ),
  );

  const extrasEncrypted =
    Object.keys(split.extras).length > 0
      ? encryptSubmissionPlaintext(JSON.stringify(split.extras))
      : null;

  try {
    const sensitive = encryptSubmissionSensitiveFields({
      parentEmail: split.parentEmail,
      parentPhone: split.parentPhone,
      emergencyContact: split.emergencyPhone,
      medicalNotes: split.medical,
    });

    await prisma.submission.create({
      data: {
        eventId: event.id,
        parentName: split.parentName,
        school: split.school,
        yearGroup: split.yearGroup,
        childName: split.childName,
        consentStatus: true,
        attendanceStatus: null,
        extrasEncrypted,
        ...sensitive,
      },
    });

    try {
      await sendConsentConfirmationEmail({
        to: split.parentEmail,
        eventTitle: event.title,
      });
    } catch (mailErr) {
      console.error("[email] Consent confirmation send failed:", mailErr);
    }
  } catch (e) {
    console.error("[submitConsentForEvent] persist failed:", e);
    const msg = e instanceof Error ? e.message : "";
    if (
      msg.includes(ENCRYPTION_ENV) ||
      msg.includes("decode to exactly") ||
      msg.includes("base64 or hex")
    ) {
      redirect(`/events/${event.slug}?error=config`);
    }
    redirect(`/events/${event.slug}?error=submit-failed`);
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}/submissions`);
  redirect(`/events/${event.slug}/submitted`);
}
