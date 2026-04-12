import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getPublishedEventForSlug } from "@/lib/public-event";

function referenceFromSlug(slug: string) {
  const compact = slug.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase();
  return `NHSF (UK)-${new Date().getFullYear()}-${compact || "EVENT"}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventForSlug(slug);
  if (!event) {
    return { title: "Submission received", robots: { index: false, follow: false } };
  }
  return {
    title: `Form submitted — ${event.name}`,
    description: `Thank you — your consent form for ${event.name} was received.`,
    robots: { index: false, follow: false },
  };
}

export default async function SubmittedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublishedEventForSlug(slug);

  if (!event) {
    notFound();
  }

  const reference = referenceFromSlug(slug);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <PageHeader
        title="Submission received"
        description="Thank you — your consent form has been recorded for this event."
        actions={
          <ButtonLink href={`/events/${slug}`} variant="outline">
            Back to event
          </ButtonLink>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 p-6 sm:p-7">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
            aria-hidden
          >
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              You&apos;re all set
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              We&apos;ve received your consent for{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {event.name}
              </span>
              . Keep a note of your reference below in case you need to speak to
              your school or NHSF (UK) Schools.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 border-t border-zinc-100 p-6 dark:border-zinc-800 sm:p-7">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Reference
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {reference}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Event
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {event.name}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            If your school sends confirmation by email, it may take a short time
            to arrive. For changes to your submission, contact your school
            coordinator.
          </p>
          <p className="text-sm">
            <Link
              href="/events"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
            >
              View all events
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
