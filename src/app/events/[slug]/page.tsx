import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsentFormSection } from "@/components/ConsentFormSection";
import { DynamicConsentFields } from "@/components/DynamicConsentFields";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getPublishedEventForSlug } from "@/lib/public-event";

function submissionErrorBanner(error: string | undefined): {
  title: string;
  body: string;
} | null {
  switch (error) {
    case "config":
      return {
        title: "This site can’t save submissions yet",
        body: `The server is missing or misconfigured SUBMISSIONS_ENCRYPTION_KEY (see .env.example). Generate one with: openssl rand -base64 32 — add it to .env.local, then restart the dev server.`,
      };
    case "submit-failed":
      return {
        title: "We couldn’t save your form",
        body: "Something went wrong while saving. Try again, or contact your school coordinator if this keeps happening.",
      };
    case "invalid-form":
      return {
        title: "Please check the form",
        body: "Some required fields are missing or invalid. Review the highlighted items and submit again.",
      };
    case "event-not-found":
      return {
        title: "Event unavailable",
        body: "This event could not be loaded. Return to the events list and open the link again.",
      };
    default:
      return null;
  }
}

function clampMetaDescription(text: string, max = 160): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventForSlug(slug);
  if (!event) {
    return { title: "Event" };
  }
  const raw =
    event.summary?.trim() ||
    `Parent and carer consent form for ${event.name}. Complete this form for NHSF (UK) Schools.`;
  const description = clampMetaDescription(raw);
  const path = `/events/${slug}`;
  const title = `${event.name} — consent form`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const event = await getPublishedEventForSlug(slug);

  if (!event) {
    notFound();
  }

  const submitActionDefined = event.eventId !== null;
  const errBanner = submissionErrorBanner(sp.error);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      {errBanner ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-50"
        >
          <p className="font-semibold">{errBanner.title}</p>
          <p className="mt-1 text-red-900/90 dark:text-red-100/90">
            {errBanner.body}
          </p>
        </div>
      ) : null}

      <nav
        className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400"
        aria-label="Breadcrumb"
      >
        <Link
          href="/events"
          className="font-medium text-zinc-700 touch-manipulation hover:underline dark:text-zinc-300"
        >
          All events
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
          /
        </span>
        <span className="min-w-0 break-words text-zinc-900 dark:text-zinc-100">
          {event.name}
        </span>
      </nav>

      {process.env.NODE_ENV === "development" ? (
        <div
          role="status"
          aria-label="Development debug: event data source"
          className="rounded-xl border border-dashed border-amber-500/60 bg-amber-50 px-4 py-3 text-xs text-amber-950 shadow-sm dark:border-amber-400/50 dark:bg-amber-950/50 dark:text-amber-50"
        >
          <p className="font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
            Dev only — not shown in production
          </p>
          <dl className="mt-2 grid gap-1.5 font-mono sm:grid-cols-2">
            <div className="flex flex-wrap gap-x-2 sm:col-span-2">
              <dt className="text-amber-800/80 dark:text-amber-200/80">
                eventId
              </dt>
              <dd className="break-all">
                {event.eventId ?? "null (static fallback)"}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-amber-800/80 dark:text-amber-200/80">slug</dt>
              <dd>{event.slug}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-amber-800/80 dark:text-amber-200/80">
                status
              </dt>
              <dd>{event.statusLabel}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 sm:col-span-2">
              <dt className="text-amber-800/80 dark:text-amber-200/80">
                submitAction defined
              </dt>
              <dd>
                {submitActionDefined
                  ? "yes (DB persist via _eventId)"
                  : "no (static: validate + redirect only)"}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2 sm:col-span-2">
              <dt className="text-amber-800/80 dark:text-amber-200/80">
                SUBMISSIONS_ENCRYPTION_KEY
              </dt>
              <dd>
                {process.env.SUBMISSIONS_ENCRYPTION_KEY?.trim()
                  ? "set (submissions can encrypt)"
                  : "MISSING — saves will fail until set in .env.local"}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <PageHeader
        title={event.name}
        description={event.summary}
        actions={
          <div className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm sm:w-auto sm:text-right dark:border-zinc-800 dark:bg-zinc-950">
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {event.statusLabel}
            </p>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              Closes {event.closesLabel}
            </p>
          </div>
        }
      />

      <dl className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Dates
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {event.dateLabel}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Location
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {event.location}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Submissions close
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {event.closesLabel}
          </dd>
        </div>
      </dl>

      <Card>
        <CardHeader className="border-b border-zinc-100 p-6 dark:border-zinc-800 sm:p-7">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Consent form
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Complete this form for each child attending. Fields marked with * are
            required.
          </p>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <ConsentFormSection
            slug={slug}
            eventId={event.eventId}
            className="space-y-6 p-6 sm:p-7"
          >
            <DynamicConsentFields fields={event.formFields} />
            <div className="flex flex-col gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Need help? Contact your school coordinator or NHSF (UK) Schools.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="h-12 w-full touch-manipulation sm:h-11 sm:w-auto sm:min-w-[11rem]"
              >
                Submit consent
              </Button>
            </div>
          </ConsentFormSection>
        </CardContent>
      </Card>
    </div>
  );
}
