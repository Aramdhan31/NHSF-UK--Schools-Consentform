import Image from "next/image";
import { cn } from "@/lib/cn";

/** Default NHSF Schools lockup dimensions (public/schools-logo.png) */
const LOGO_WIDTH = 995;
const LOGO_HEIGHT = 289;

export function BrandLogo({
  className,
  src = "/schools-logo.png",
  width = LOGO_WIDTH,
  height = LOGO_HEIGHT,
  sizes = "(max-width: 640px) 85vw, 460px",
  priority,
  tone = "onDark",
  scale = "default",
  /** When set, replaces default `scale` height caps (e.g. square hero asset) */
  imageClassName,
}: {
  className?: string;
  /** Swap for a hero-only asset (e.g. `schools-logo-hero.png`) without changing the header logo */
  src?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  tone?: "onDark" | "onLight";
  /** Larger mark for marketing hero sections */
  scale?: "default" | "hero";
  imageClassName?: string;
}) {
  const heightCap =
    scale === "hero"
      ? "max-h-[4.25rem] sm:max-h-20 md:max-h-[5.25rem] lg:max-h-24"
      : "max-h-9 sm:max-h-10 md:max-h-11";

  return (
    <span className={cn("inline-block max-w-full align-middle", className)}>
      <Image
        src={src}
        alt="National Hindu Students’ Forum (UK) — Schools"
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn(
          "h-auto w-full max-w-full object-contain object-left",
          imageClassName ?? heightCap,
          tone === "onDark"
            ? "drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]"
            : "drop-shadow-[0_0_1px_rgba(0,0,0,0.08),0_2px_10px_rgba(0,0,0,0.12)]",
        )}
      />
    </span>
  );
}
