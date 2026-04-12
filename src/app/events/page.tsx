import type { Metadata } from "next";
import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { listPublishedEvents } from "@/lib/public-event";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse NHSF (UK) Schools events and open the parent or carer consent form for each one.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | NHSF (UK) Schools",
    description:
      "Choose an event to open its consent form. Use the link from your school if you have one.",
    url: "/events",
  },
};

export default async function EventsPage() {
  const events = await listPublishedEvents();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <PageHeader
        title="Upcoming events"
        description="Choose an event to open its consent form. If you were sent a direct link, you can use that instead."
        className="sm:items-start"
      />

      {events.length === 0 ? (
        <Card>
          <CardHeader className="p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              There are no published events yet. NHSF (UK) Schools staff can add
              events from the admin area.
            </p>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Link key={e.slug} href={`/events/${e.slug}`} className="group block">
            <Card
              className={cn(
                "h-full transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md",
              )}
            >
              <CardHeader className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="break-words text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {e.name}
                  </h2>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                    {e.statusLabel}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {e.summary}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <CalendarRange className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{e.dateLabel}</span>
                </div>
                <span className="text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                  Open consent form →
                </span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
