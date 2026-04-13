import { prisma } from "@/lib/db";
import {
  defaultConsentFormFields,
  eventConsentFieldsForUse,
  type FormFieldDef,
} from "@/lib/form-template";
import { getSchoolEventOrFallback, SCHOOL_EVENTS } from "@/lib/school-events";

export type PublicEventView = {
  /** Present for DB-backed published events; submissions are persisted only when set. */
  eventId: string | null;
  slug: string;
  name: string;
  summary: string;
  dateLabel: string;
  location: string;
  closesLabel: string;
  statusLabel: string;
  formFields: FormFieldDef[];
  source: "database" | "static";
};

const PUBLISHED_STATUS = "published";

const isProduction = process.env.NODE_ENV === "production";

function staticFallbackView(slug: string): PublicEventView {
  const s = getSchoolEventOrFallback(slug);
  return {
    eventId: null,
    slug: s.slug,
    name: s.name,
    summary: s.summary,
    dateLabel: s.dateLabel,
    location: s.location,
    closesLabel: s.closesLabel,
    statusLabel: s.statusLabel,
    formFields: defaultConsentFormFields(),
    source: "static",
  };
}

function formatEventDate(d: Date | null | undefined): string {
  if (!d) return "TBC";
  return d.toLocaleDateString("en-GB", { dateStyle: "medium" });
}

function formatDateTime(d: Date | null | undefined): string {
  if (!d) return "TBC";
  return d.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function mapDbEvent(row: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  eventDate: Date | null;
  closesAt: Date | null;
  status: string;
  formFieldsJson: unknown | null;
  includeMediaConsent: boolean;
}): PublicEventView {
  return {
    eventId: row.id,
    slug: row.slug,
    name: row.title,
    summary: row.description?.trim() ? row.description : "",
    dateLabel: formatEventDate(row.eventDate),
    location: "TBC",
    closesLabel: formatDateTime(row.closesAt),
    statusLabel: row.status,
    formFields: eventConsentFieldsForUse(
      row.formFieldsJson,
      row.includeMediaConsent,
    ),
    source: "database",
  };
}

export async function getPublishedEventForSlug(
  slug: string,
): Promise<PublicEventView | null> {
  try {
    const row = await prisma.event.findFirst({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        eventDate: true,
        closesAt: true,
        status: true,
        formFieldsJson: true,
        includeMediaConsent: true,
      },
    });
    if (row) {
      if (row.status !== PUBLISHED_STATUS) {
        return null;
      }
      return mapDbEvent(row);
    }
  } catch (e) {
    console.error("[public-event] getPublishedEventForSlug DB error:", e);
    if (isProduction) {
      return null;
    }
    return staticFallbackView(slug);
  }

  if (isProduction) {
    return null;
  }

  return staticFallbackView(slug);
}

export async function listPublishedEvents(): Promise<PublicEventView[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { status: PUBLISHED_STATUS },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        eventDate: true,
        closesAt: true,
        status: true,
        formFieldsJson: true,
        includeMediaConsent: true,
      },
    });
    return rows.map((row) => mapDbEvent(row));
  } catch (e) {
    console.error("[public-event] listPublishedEvents DB error:", e);
    if (isProduction) {
      return [];
    }
  }

  return SCHOOL_EVENTS.map((s) => ({
    eventId: null,
    slug: s.slug,
    name: s.name,
    summary: s.summary,
    dateLabel: s.dateLabel,
    location: s.location,
    closesLabel: s.closesLabel,
    statusLabel: s.statusLabel,
    formFields: defaultConsentFormFields(),
    source: "static" as const,
  }));
}
