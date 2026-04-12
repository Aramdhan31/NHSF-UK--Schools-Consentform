import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Container } from "@/components/Container";
import { getMetadataBaseUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  /** Avoids Chrome “preloaded but not used” for .woff2 when CSS applies shortly after load (common with App Router + LAN dev). */
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const defaultDescription =
  "Parent and carer consent forms for NHSF (UK) Schools events. Complete the right form for each event your child will attend — secure, clear, and organised for schools.";

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: "NHSF (UK) Schools — event consent portal",
    template: "%s | NHSF (UK) Schools",
  },
  description: defaultDescription,
  applicationName: "NHSF (UK) Schools",
  keywords: [
    "NHSF",
    "NHSF UK",
    "National Hindu Students Forum",
    "schools",
    "consent form",
    "parent consent",
    "event registration",
    "UK schools",
  ],
  authors: [{ name: "National Hindu Students' Forum (UK)" }],
  creator: "National Hindu Students' Forum (UK)",
  publisher: "National Hindu Students' Forum (UK)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Tab / PWA icons: file-based `src/app/icon.png` and `apple-icon.png`.
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "NHSF (UK) Schools",
    title: "NHSF (UK) Schools — event consent portal",
    description: defaultDescription,
    images: [{ url: "/schools-logo.png", alt: "NHSF (UK) Schools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NHSF (UK) Schools — event consent portal",
    description: defaultDescription,
    images: ["/schools-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <SiteHeader />
        <div className="relative min-w-0 flex-1">
          {/*
            Outer pointer-events-none does not apply to descendants (they default to auto).
            Inner blur layer must also be none, or it steals clicks across the page.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-x-clip *:pointer-events-none"
          >
            <div className="absolute -top-56 left-1/2 h-[520px] w-[min(920px,200vw)] max-w-none -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-300/10 to-orange-500/10 blur-3xl dark:from-orange-500/12 dark:via-amber-300/10 dark:to-orange-500/12" />
          </div>
          <main className="relative z-[1] py-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
            <Container>{children}</Container>
          </main>
        </div>
        <footer className="border-t-[3px] border-zinc-300 bg-zinc-50/90 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-400 sm:py-16 sm:pb-[max(4rem,env(safe-area-inset-bottom))]">
          <Container className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="text-lg font-semibold leading-snug tracking-tight text-zinc-950 dark:text-zinc-50">
              National Hindu Students&apos; Forum (UK)
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Schools
            </p>
            <div
              className="my-6 h-px w-12 bg-zinc-300 dark:bg-zinc-600"
              aria-hidden
            />
            <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <span className="font-medium tabular-nums text-zinc-800 dark:text-zinc-300">
                © {new Date().getFullYear()}
              </span>
              {" "}
              National Hindu Students&apos; Forum (UK). All rights reserved.
            </p>
            <p className="mt-4 text-sm">
              <Link
                href="/privacy"
                className="font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                Privacy policy
              </Link>
            </p>
          </Container>
        </footer>
      </body>
    </html>
  );
}
