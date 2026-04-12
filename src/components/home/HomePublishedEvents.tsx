import Link from "next/link";
import { CalendarRange } from "lucide-react";
import type { PublicEventView } from "@/lib/public-event";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function HomePublishedEvents({
  events,
  headingFontClassName,
}: {
  events: PublicEventView[];
  headingFontClassName: string;
}) {
  if (events.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="home-events-heading">
      <div className="mb-6 max-w-2xl text-center sm:mb-8 sm:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-800/75 sm:text-xs sm:tracking-[0.2em]">
          Consent forms
        </p>
        <h2
          id="home-events-heading"
          className={cn(
            headingFontClassName,
            "mt-2 text-[1.35rem] font-semibold leading-snug tracking-tight text-zinc-900 sm:text-2xl md:text-3xl",
          )}
        >
          Open events you can sign up to
        </h2>
        <p className="mt-2 text-pretty text-sm text-zinc-600 sm:text-base">
          Every event has its own consent form. Complete the form for each event
          your child will attend—open the right one below.
        </p>
        <div
          className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 shadow-sm shadow-orange-500/25 sm:mx-0 sm:mt-5 sm:w-16"
          aria-hidden
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {events.map((e) => (
          <Link key={e.slug} href={`/events/${e.slug}`} className="group block">
            <Card
              className={cn(
                "h-full border-orange-100/80 bg-white/90 shadow-[0_8px_30px_-12px_rgba(120,53,15,0.08)] transition-all duration-200 dark:border-zinc-200 dark:bg-white",
                "hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md",
              )}
            >
              <CardHeader className="flex h-full flex-col gap-3 p-5 sm:gap-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="break-words text-base font-semibold text-zinc-950">
                    {e.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    Open
                  </span>
                </div>
                {e.summary ? (
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">
                    {e.summary}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center gap-2 text-sm text-zinc-500">
                  <CalendarRange className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{e.dateLabel}</span>
                </div>
                <span className="text-sm font-semibold text-orange-700 group-hover:underline">
                  Open consent form →
                </span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-zinc-600 sm:text-left">
        <Link
          href="/events"
          className="font-semibold text-orange-700 underline decoration-orange-400/70 underline-offset-4 transition-colors hover:text-orange-800"
        >
          Full events list
        </Link>
      </p>
    </section>
  );
}
