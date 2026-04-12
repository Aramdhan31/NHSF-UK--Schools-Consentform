import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { listPublishedEvents } from "@/lib/public-event";
import { getSiteUrl } from "@/lib/site-url";
import { HomePublishedEvents } from "@/components/home/HomePublishedEvents";
import {
  CalendarClock,
  ClipboardList,
  Link2,
  ListChecks,
  ShieldCheck,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/cn";

const displaySerif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const iconStroke = 1.75;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
  },
};

/** Marketing page stays light so colours match desktop even when the phone uses system dark mode. */
export default async function Home() {
  const publishedEvents = await listPublishedEvents();
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "NHSF (UK) Schools",
        url: siteUrl,
        description:
          "Parent and carer consent forms for NHSF (UK) Schools events — secure registration for schools.",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-GB",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "National Hindu Students' Forum (UK)",
        legalName: "National Hindu Students' Forum (UK)",
        url: siteUrl,
      },
    ],
  };

  return (
    <div
      className="overflow-x-clip bg-zinc-50 px-3 pb-14 pt-1 text-zinc-950 [color-scheme:light] sm:-mx-6 sm:px-6 sm:pb-16 sm:pt-2 lg:-mx-8 lg:px-8 lg:pb-20"
      data-theme="marketing-light"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    <div className="mx-auto flex min-w-0 w-full max-w-6xl flex-col">
      {/* Hero: one column on phones (clear stack); two columns from lg with illustration */}
      <section
        className="relative overflow-visible rounded-2xl border border-orange-100/90 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/50 p-6 shadow-[0_8px_30px_-12px_rgba(120,53,15,0.12)] sm:rounded-2xl sm:border-orange-200/50 sm:p-8 sm:shadow-md md:rounded-[2rem] md:border-orange-200/60 md:shadow-[0_24px_80px_-24px_rgba(234,88,12,0.2)] lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:overflow-hidden lg:p-14"
        aria-labelledby="hero-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-gradient-to-tr from-orange-300/25 to-amber-200/20 blur-3xl sm:-bottom-20 sm:-left-16 sm:h-64 sm:w-64"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2] sm:opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200/70 bg-white/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-950/85 shadow-sm backdrop-blur-sm sm:text-[11px] sm:tracking-[0.16em]">
            <Sparkles
              className="h-3.5 w-3.5 text-orange-700/80"
              strokeWidth={2}
              aria-hidden
            />
            NHSF (UK) Schools
          </span>
          {/* Hero: `NHSF Schools.png` — square asset, cream #FFF9F5 baked in; size bumps when you export a larger lockup */}
          <div className="hidden w-full max-w-[min(100%,32rem)] md:block lg:max-w-[36rem] xl:max-w-[40rem]">
            <div className="rounded-2xl bg-[#FFF9F5] p-4 shadow-sm shadow-orange-900/[0.07] sm:p-5 md:p-6">
              <BrandLogo
                src="/NHSF%20Schools.png"
                width={1024}
                height={1024}
                tone="onLight"
                scale="hero"
                className="block w-full text-center"
                imageClassName="mx-auto max-h-[7rem] w-auto max-w-full object-contain object-center sm:max-h-[8.5rem] md:max-h-40 lg:max-h-[11.5rem] xl:max-h-52"
                sizes="(max-width: 768px) 320px, (max-width: 1024px) 400px, (max-width: 1280px) 480px, 560px"
              />
            </div>
          </div>
          <h1
            id="hero-heading"
            className={cn(
              displaySerif.className,
              "max-w-2xl text-balance text-[1.5rem] font-semibold leading-[1.2] tracking-tight text-zinc-900 sm:text-3xl sm:leading-tight md:text-4xl md:leading-[1.1] lg:text-[2.5rem] xl:text-5xl",
            )}
          >
            Event consent and registration form for NHSF (UK) Schools
          </h1>
          <p className="max-w-xl text-pretty text-[0.9375rem] leading-[1.65] text-zinc-600 sm:text-base sm:leading-relaxed md:text-lg">
            Parents and carers complete forms in minutes. Schools teams see
            everything in one calm, organised place—ready for event day.
          </p>
          <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-xl sm:flex-row sm:flex-wrap sm:gap-4">
            <ButtonLink
              href="/events"
              size="xl"
              className="h-12 min-h-[48px] w-full touch-manipulation justify-center rounded-xl border-0 bg-zinc-900 px-6 text-base font-semibold text-white shadow-md transition-[transform,background-color,box-shadow] duration-200 hover:bg-zinc-800 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 active:scale-[0.99] sm:w-auto sm:min-w-[10.5rem] sm:px-8 lg:hover:scale-[1.01]"
            >
              View events
            </ButtonLink>
            <ButtonLink
              href="/admin/login"
              variant="outline"
              size="md"
              className="h-12 min-h-[48px] w-full touch-manipulation justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm hover:border-zinc-400 hover:bg-zinc-50 active:bg-zinc-100 sm:h-11 sm:w-auto sm:min-w-[9rem]"
            >
              Admin login
            </ButtonLink>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-600">
            <Link
              href="/events"
              className="touch-manipulation font-semibold text-orange-700 underline decoration-orange-400/70 underline-offset-[5px] transition-colors hover:text-orange-800 hover:decoration-orange-600 active:text-orange-900"
            >
              Browse open events
            </Link>{" "}
            <span className="text-zinc-500">
              — each event has its own consent form.
            </span>
          </p>
        </div>

        {/* Hero visual — single calm card (no tilt stack); lg+ only */}
        <div
          className="relative mx-auto hidden min-h-[300px] w-full max-w-[20rem] shrink-0 lg:flex lg:max-w-none lg:items-center lg:justify-end"
          aria-hidden
        >
          <div className="pointer-events-none absolute right-1/2 top-1/2 h-[min(100%,22rem)] w-[min(100%,22rem)] translate-x-1/4 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-200/45 via-orange-200/30 to-transparent blur-3xl" />
          <div className="relative w-full max-w-[19.5rem] rounded-3xl bg-white/90 p-6 shadow-[0_20px_50px_-18px_rgba(234,88,12,0.2)] ring-1 ring-orange-200/40 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Schools portal
              </span>
              <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                Open
              </span>
            </div>
            <p className="mt-5 text-lg font-semibold leading-snug tracking-tight text-zinc-900">
              Events and consent together
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              One link per event — clear deadlines, organised replies.
            </p>
            <div
              className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/12 to-orange-500/10 px-3.5 py-2.5"
            >
              <ListChecks
                className="h-4 w-4 shrink-0 text-orange-600"
                strokeWidth={2}
              />
              <span className="text-xs font-medium text-orange-950/90">
                Ready for event day
              </span>
            </div>
          </div>
        </div>
      </section>

      <HomePublishedEvents
        events={publishedEvents}
        headingFontClassName={displaySerif.className}
      />

      {/* Feature cards — bento */}
      <section
        className="mt-14 sm:mt-24 lg:mt-32"
        aria-labelledby="features-heading"
      >
        <div className="mb-8 max-w-2xl text-center sm:mb-12 sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-800/75 dark:!text-orange-900/90 sm:text-xs sm:tracking-[0.2em]">
            Why this portal
          </p>
          <h2
            id="features-heading"
            className={cn(
              displaySerif.className,
              "mt-2 text-[1.35rem] font-semibold leading-snug tracking-tight text-zinc-950 dark:!text-zinc-950 sm:mt-3 sm:text-3xl md:text-4xl",
            )}
          >
            More than a form—a proper home for your events.
          </h2>
          <div
            className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 shadow-sm shadow-orange-500/25 sm:mx-0 sm:mt-6 sm:w-16"
            aria-hidden
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 md:gap-7 lg:grid-cols-3">
          <FeatureCard
            icon={LayoutGrid}
            title="Centralised forms"
            description="One place for NHSF (UK) Schools events, all year round."
            className="lg:col-span-2 lg:row-span-1"
            variant="featured"
          />
          <FeatureCard
            icon={CalendarClock}
            title="Clear deadlines"
            description="Each event has its own submission window so you always know when forms close."
            variant="default"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Secure by design"
            description="Your data is handled safely and securely."
            className="sm:col-span-2 lg:col-span-1"
            variant="accent"
          />
        </div>
      </section>

      {/* How it works */}
      <section
        className="relative mt-14 overflow-x-clip rounded-xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/90 to-white py-10 sm:mt-28 sm:rounded-2xl sm:py-16 md:mt-32 md:rounded-[2rem] md:py-20 lg:mt-36"
        aria-labelledby="how-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-400/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-800/75 dark:!text-orange-900/90">
            Simple flow
          </p>
          <h2
            id="how-heading"
            className={cn(
              displaySerif.className,
              "mt-2 text-[1.35rem] font-semibold leading-snug tracking-tight text-zinc-950 dark:!text-zinc-950 sm:mt-3 sm:text-3xl md:text-4xl",
            )}
          >
            How it works
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-600 dark:!text-zinc-600">
            Three calm steps from link to confirmation.
          </p>
        </div>
        <ol className="relative mx-auto mt-12 grid max-w-5xl list-none grid-cols-1 gap-0 px-2 sm:mt-20 sm:grid-cols-3 sm:gap-8 sm:px-6 lg:gap-12">
          <div
            aria-hidden
            className="absolute left-[8%] right-[8%] top-[2.25rem] hidden h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent sm:block"
          />
          <StepCard
            step={1}
            icon={Link2}
            title="Open your event link"
            description="Use the link shared by your school or NHSF (UK)."
          />
          <StepCard
            step={2}
            icon={ClipboardList}
            title="Complete the consent form"
            description="Fill in the details at your own pace."
          />
          <StepCard
            step={3}
            icon={ListChecks}
            title="Submit and receive confirmation"
            description="You’ll know your response was received."
          />
        </ol>
      </section>

      {/* Trust */}
      <aside className="mt-12 sm:mt-20 md:mt-24">
        <div className="relative overflow-hidden rounded-xl border border-zinc-200/90 bg-white/80 px-4 py-7 text-center shadow-sm backdrop-blur-sm dark:!border-zinc-200/90 dark:!bg-white/90 sm:rounded-2xl sm:px-8 sm:py-10">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"
          />
          <p
            className={cn(
              displaySerif.className,
              "mx-auto max-w-lg text-base font-medium leading-relaxed text-zinc-800 dark:!text-zinc-800 sm:text-lg",
            )}
          >
            Built for NHSF (UK) Schools to run event consent with clarity and
            care.
          </p>
        </div>
      </aside>
    </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  variant = "default",
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "featured" | "accent";
}) {
  const isFeatured = variant === "featured";
  const isAccent = variant === "accent";

  /* Plain div (not ui/Card): avoids conflicting bg utilities with cn() merge. */
  const shell = {
    default: cn(
      "border-zinc-200/90 bg-white",
      "shadow-[0_16px_48px_-20px_rgba(24,24,27,0.12)]",
      "ring-1 ring-zinc-950/[0.04]",
      "sm:hover:border-orange-200/80 sm:hover:shadow-[0_24px_56px_-24px_rgba(234,88,12,0.14)]",
      "dark:border-zinc-200 dark:bg-white",
    ),
    featured: cn(
      "border-orange-200/70",
      "bg-gradient-to-br from-white via-amber-50/90 to-orange-100/70",
      "shadow-[0_20px_60px_-18px_rgba(234,88,12,0.22)]",
      "ring-1 ring-orange-400/25",
      "sm:min-h-[200px] sm:hover:shadow-[0_28px_70px_-20px_rgba(234,88,12,0.28)]",
      "dark:border-orange-200/70 dark:from-white dark:via-amber-50/90 dark:to-orange-100/70",
    ),
    accent: cn(
      /* < sm: same light shell as “Clear deadlines” */
      "border-zinc-200/90 bg-white",
      "shadow-[0_16px_48px_-20px_rgba(24,24,27,0.12)]",
      "ring-1 ring-zinc-950/[0.04]",
      "dark:border-zinc-200 dark:bg-white",
      /* sm+: dark accent card */
      "sm:border-zinc-800/90",
      "sm:bg-gradient-to-br sm:from-zinc-900 sm:via-zinc-900 sm:to-orange-950/50",
      "sm:text-zinc-50 sm:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.45)]",
      "sm:ring-1 sm:ring-white/10",
      "sm:hover:shadow-[0_28px_64px_-18px_rgba(251,191,36,0.12)]",
      "sm:dark:border-zinc-700 sm:dark:from-zinc-900 sm:dark:via-zinc-900 sm:dark:to-orange-950/50",
    ),
  };

  const iconShell = {
    default: cn(
      "rounded-2xl border border-orange-200/70",
      "bg-gradient-to-br from-amber-50 to-orange-100/90 text-orange-950",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      "transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md sm:group-hover:-rotate-3",
    ),
    featured: cn(
      "rounded-[1.125rem] border border-orange-300/50",
      "bg-white/95 text-orange-900",
      "shadow-[0_12px_32px_-8px_rgba(234,88,12,0.35)]",
      "ring-2 ring-orange-200/50",
      "transition-transform duration-300 group-hover:scale-105 sm:group-hover:-rotate-6",
    ),
    accent: cn(
      /* < sm: same icon tile as default */
      "rounded-2xl border border-orange-200/70",
      "bg-gradient-to-br from-amber-50 to-orange-100/90 text-orange-950",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
      "transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md max-sm:group-hover:-rotate-3",
      /* sm+: amber on dark */
      "sm:border-amber-400/35 sm:from-amber-400/25 sm:to-orange-600/20 sm:text-amber-100",
      "sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:group-hover:rotate-0",
      "sm:group-hover:border-amber-300/50 sm:group-hover:shadow-none",
    ),
  };

  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-[1.75rem] border transition-all duration-300 ease-out",
        "active:scale-[0.992] sm:hover:-translate-y-1",
        shell[variant],
        className,
      )}
    >
      {isFeatured ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-amber-300/50 to-orange-400/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-orange-200/40 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent"
          />
        </>
      ) : null}
      {variant === "default" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-5 left-0 w-[3px] rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600"
        />
      ) : null}
      {isAccent ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-5 left-0 w-[3px] rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 sm:hidden"
        />
      ) : null}
      {isAccent ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_90%_60%_at_100%_0%,rgba(251,191,36,0.14),transparent_55%)] sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent sm:block"
          />
        </>
      ) : null}

      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col gap-5 p-6 sm:gap-6 sm:p-8 md:p-9",
          isFeatured && "lg:flex-row lg:items-center lg:gap-12",
          (variant === "default" || isAccent) && "pl-7 sm:pl-8",
        )}
      >
        <div
          className={cn(
            "flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center sm:h-14 sm:w-14",
            isFeatured && "lg:h-16 lg:w-16",
            iconShell[variant],
          )}
          aria-hidden
        >
          <Icon
            className={cn(
              "h-7 w-7 sm:h-6 sm:w-6",
              isFeatured && "lg:h-7 lg:w-7",
            )}
            strokeWidth={iconStroke}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              displaySerif.className,
              "text-[1.25rem] font-semibold leading-snug tracking-tight sm:text-xl lg:text-[1.35rem]",
              isAccent
                ? "text-zinc-950 sm:text-white dark:text-zinc-950 sm:dark:text-white"
                : "text-zinc-950 dark:text-zinc-950",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "mt-3 max-w-prose text-base leading-relaxed sm:text-[0.9375rem]",
              isAccent
                ? "text-zinc-700 sm:text-zinc-200 dark:text-zinc-700 sm:dark:text-zinc-200"
                : "text-zinc-700 dark:text-zinc-700",
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <li className="relative flex flex-col items-center border-b border-zinc-200/70 pb-10 text-center last:border-b-0 last:pb-0 sm:border-b-0 sm:pb-0">
      <div className="relative z-10 flex w-full max-w-[18rem] flex-col items-center gap-5 sm:max-w-none">
        <span
          className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg font-bold tabular-nums tracking-tight text-white shadow-lg shadow-orange-500/35 ring-4 ring-orange-500/15"
          aria-hidden
        >
          {step}
        </span>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200/90 bg-white text-zinc-700 shadow-md"
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={iconStroke} />
        </div>
      </div>
      <h3 className="relative z-10 mx-auto mt-8 w-full max-w-[18rem] text-balance text-base font-semibold leading-snug text-zinc-950 dark:!text-zinc-950">
        {title}
      </h3>
      <p className="relative z-10 mx-auto mt-3 w-full max-w-[18rem] text-balance text-sm leading-relaxed text-zinc-600 dark:!text-zinc-600">
        {description}
      </p>
    </li>
  );
}
