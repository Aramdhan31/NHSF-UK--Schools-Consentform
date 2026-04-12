import Link from "next/link";
import { Container } from "@/components/Container";
import { BrandLogo } from "@/components/BrandLogo";
import { HeaderNav } from "@/components/HeaderNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 isolate z-[1060] overflow-visible border-b border-white/10 bg-zinc-950/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl pointer-events-auto">
      <div
        aria-hidden
        className="h-0.5 w-full bg-gradient-to-r from-[color:var(--color-accent)] via-[color:var(--color-accent-2)] to-[color:var(--color-accent)]"
      />
      <Container className="flex items-center justify-between gap-2 py-3.5 md:h-[68px] md:gap-3 md:py-0">
        <div className="min-w-0 flex-1 overflow-hidden pr-1">
          <Link
            href="/"
            className="inline-flex min-w-0 max-w-full items-center rounded-xl py-1 touch-manipulation md:px-1"
          >
            <BrandLogo priority tone="onDark" className="min-w-0 max-w-full" />
            <span className="sr-only">NHSF (UK) Schools</span>
          </Link>
        </div>

        <div className="relative z-[1070] flex shrink-0 items-center pl-1 md:pl-0 md:pr-0">
          <HeaderNav />
        </div>
      </Container>
    </header>
  );
}
