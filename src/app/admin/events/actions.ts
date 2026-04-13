"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  defaultConsentFormFields,
  safeParseFormFieldsJsonString,
  stripMediaConsentFromFields,
  validateConsentFormFieldsForPersistence,
  type FormFieldDef,
} from "@/lib/form-template";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolves a URL-safe slug that does not exist on any event yet. */
async function allocateUniqueEventSlug(baseInput: string): Promise<string> {
  let base = slugify(baseInput);
  if (!base) base = "event";

  for (let i = 0; i < 200; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const taken = await prisma.event.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function parseOptionalDateTime(raw: FormDataEntryValue | null): Date | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function readFormFieldsFromFormData(formData: FormData): FormFieldDef[] {
  const raw = formData.get("formFieldsJson");
  if (typeof raw !== "string") return defaultConsentFormFields();
  return (
    stripMediaConsentFromFields(
      safeParseFormFieldsJsonString(raw) ?? defaultConsentFormFields(),
    )
  );
}

function readIncludeMediaConsent(formData: FormData): boolean {
  return formData.get("includeMediaConsent") === "on";
}

function persistableFormFieldsJson(
  fields: FormFieldDef[],
): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(fields)) as Prisma.InputJsonValue;
}

export async function createEventAction(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "published").trim() || "published";
  const eventDate = parseOptionalDateTime(formData.get("eventDate"));
  const opensAt = parseOptionalDateTime(formData.get("opensAt"));
  const closesAt = parseOptionalDateTime(formData.get("closesAt"));

  if (!title) {
    redirect("/admin/events/new?error=missing-title");
  }
  if (!slug) slug = slugify(title);
  else slug = slugify(slug);

  const formFields = readFormFieldsFromFormData(formData);
  const formCheck = validateConsentFormFieldsForPersistence(formFields);
  if (!formCheck.ok) {
    redirect("/admin/events/new?error=bad-form-template");
  }

  const includeMediaConsent = readIncludeMediaConsent(formData);

  try {
    await prisma.event.create({
      data: {
        title,
        slug,
        description: description || null,
        eventDate,
        opensAt,
        closesAt,
        status,
        includeMediaConsent,
        formFieldsJson: persistableFormFieldsJson(formFields),
      },
    });
  } catch {
    redirect("/admin/events/new?error=slug-taken");
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${slug}`);
  redirect("/admin/events");
}

/**
 * Clone core event fields into a new draft. Does not copy submissions.
 * Assigns a fresh slug and redirects to the new event’s admin edit page.
 */
export async function duplicateEventAction(sourceEventId: string) {
  await requireAdmin();

  const source = await prisma.event.findUnique({
    where: { id: sourceEventId },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      eventDate: true,
      opensAt: true,
      closesAt: true,
      formFieldsJson: true,
      includeMediaConsent: true,
    },
  });

  if (!source) {
    redirect("/admin/events?error=not-found");
  }

  const title = `${source.title} (copy)`;
  const slug = await allocateUniqueEventSlug(`${source.slug}-copy`);

  let newEvent;
  try {
    newEvent = await prisma.event.create({
      data: {
        title,
        slug,
        description: source.description,
        eventDate: source.eventDate,
        opensAt: source.opensAt,
        closesAt: source.closesAt,
        status: "draft",
        includeMediaConsent: source.includeMediaConsent,
        formFieldsJson:
          source.formFieldsJson === null || source.formFieldsJson === undefined
            ? undefined
            : (JSON.parse(
                JSON.stringify(source.formFieldsJson),
              ) as Prisma.InputJsonValue),
      },
    });
  } catch {
    redirect(`/admin/events/${sourceEventId}?error=duplicate-failed`);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${slug}`);

  redirect(`/admin/events/${newEvent.id}`);
}

export async function updateEventAction(eventId: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft").trim() || "draft";
  const eventDate = parseOptionalDateTime(formData.get("eventDate"));
  const opensAt = parseOptionalDateTime(formData.get("opensAt"));
  const closesAt = parseOptionalDateTime(formData.get("closesAt"));

  if (!title) {
    redirect(`/admin/events/${eventId}?error=missing-title`);
  }
  slug = slugify(slug || title);

  const formFields = readFormFieldsFromFormData(formData);
  const formCheck = validateConsentFormFieldsForPersistence(formFields);
  if (!formCheck.ok) {
    redirect(`/admin/events/${eventId}?error=bad-form-template`);
  }

  const includeMediaConsent = readIncludeMediaConsent(formData);

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        slug,
        description: description || null,
        eventDate,
        opensAt,
        closesAt,
        status,
        includeMediaConsent,
        formFieldsJson: persistableFormFieldsJson(formFields),
      },
    });
  } catch {
    redirect(`/admin/events/${eventId}?error=save-failed`);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${slug}`);
  redirect("/admin/events");
}

/**
 * Permanently removes the event and all submissions (DB cascade).
 * Requires checkbox `confirmDelete=on` in the posted form.
 */
export async function deleteEventAction(
  eventId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  if (formData.get("confirmDelete") !== "on") {
    redirect(`/admin/events/${eventId}?error=delete-not-confirmed`);
  }

  const existing = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, slug: true },
  });

  if (!existing) {
    redirect("/admin/events?error=not-found");
  }

  try {
    await prisma.event.delete({ where: { id: eventId } });
  } catch {
    redirect(`/admin/events/${eventId}?error=delete-failed`);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${existing.slug}`);
  revalidatePath(`/admin/events/${eventId}/submissions`);
  redirect("/admin/events");
}
