import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex touch-manipulation items-center justify-center gap-2 font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950";

const variants: Record<Variant, string> = {
  primary:
    "rounded-xl bg-zinc-900 text-white shadow-md hover:bg-zinc-800 hover:shadow-lg dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:hover:shadow-lg",
  secondary:
    "rounded-xl bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200 hover:shadow-md dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
  outline:
    "rounded-xl border border-zinc-300 bg-white text-zinc-700 shadow-sm hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
  ghost:
    "rounded-xl bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  xl: "h-12 min-h-[3rem] px-8 text-base shadow-md hover:shadow-lg",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

