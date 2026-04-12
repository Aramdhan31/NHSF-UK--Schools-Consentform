import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-600 sm:mt-1 sm:leading-6 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="w-full shrink-0 sm:w-auto">{actions}</div>
      ) : null}
    </div>
  );
}

