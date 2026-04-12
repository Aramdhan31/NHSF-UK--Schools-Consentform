import { submitConsentForEvent } from "@/app/events/[slug]/actions";
import { cn } from "@/lib/cn";

/**
 * Native form POST to the submission server action — no client-side fetch or router redirects.
 * Core field names come from {@link DynamicConsentFields} (`name={field.id}`).
 */
export function ConsentFormSection({
  slug,
  eventId,
  className,
  children,
}: {
  slug: string;
  /** Database event id when the listing is DB-backed; omit for static demo events. */
  eventId?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form className={cn(className)} action={submitConsentForEvent}>
      {eventId ? <input type="hidden" name="_eventId" value={eventId} /> : null}
      <input type="hidden" name="_eventSlug" value={slug} />
      {children}
    </form>
  );
}
