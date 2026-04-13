import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  deleteEventAction,
  duplicateEventAction,
  updateEventAction,
} from "@/app/admin/events/actions";
import { EventConsentTemplateSection } from "@/components/admin/EventConsentTemplateSection";
import { prisma } from "@/lib/db";
import {
  parseFormFieldsJson,
  stripMediaConsentFromFields,
} from "@/lib/form-template";

function toDatetimeLocalValue(d: Date | null | undefined): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default async function AdminEditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  let event: Awaited<ReturnType<typeof prisma.event.findUnique>> = null;
  try {
    event = await prisma.event.findUnique({ where: { id } });
  } catch {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-medium">Database unavailable</p>
        <p className="mt-2 text-amber-800 dark:text-amber-200">
          Check that <code className="font-mono">DATABASE_URL</code> is set and
          migrations have been applied (
          <code className="font-mono">npx prisma migrate dev</code>).
        </p>
      </div>
    );
  }

  if (!event) notFound();

  const boundUpdate = updateEventAction.bind(null, event.id);
  const boundDelete = deleteEventAction.bind(null, event.id);
  const initialFormFields = stripMediaConsentFromFields(
    parseFormFieldsJson(event.formFieldsJson),
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={`Edit · ${event.title}`}
        description="Update event details and the parent-facing consent form. Apply a programme template to reset fields, then edit labels or add questions before publishing."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <form action={duplicateEventAction.bind(null, event.id)}>
              <Button type="submit" variant="secondary">
                Duplicate
              </Button>
            </form>
            <ButtonLink
              href={`/admin/events/${event.id}/submissions`}
              variant="outline"
            >
              Submissions
            </ButtonLink>
            <ButtonLink
              href="#delete-event"
              variant="outline"
              className="border-red-200 text-red-800 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
            >
              Delete event
            </ButtonLink>
          </div>
        }
      />

      {sp.error === "bad-form-template" ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          Consent form is missing a required core field or has the wrong field
          type. Keep the standard ids (parentName, declaration, etc.) — apply a
          template and try again.
        </p>
      ) : null}
      {sp.error === "delete-not-confirmed" ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          To delete this event, tick the confirmation box and try again.
        </p>
      ) : null}
      {sp.error === "delete-failed" ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          Could not delete this event. Try again or remove it from the database
          directly if the problem continues.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Event
          </h2>
        </CardHeader>
        <CardContent>
          <form action={boundUpdate} className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Title *
                </span>
                <Input name="title" required defaultValue={event.title} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Slug (URL) *
                </span>
                <Input
                  name="slug"
                  required
                  defaultValue={event.slug}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </span>
              <Textarea
                name="description"
                rows={3}
                defaultValue={event.description ?? ""}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Event date
                </span>
                <Input
                  name="eventDate"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(event.eventDate)}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Opens at
                </span>
                <Input
                  name="opensAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(event.opensAt)}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Closes at
                </span>
                <Input
                  name="closesAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(event.closesAt)}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Status
                </span>
                <select
                  name="status"
                  defaultValue={event.status}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-5">
              <input
                type="checkbox"
                name="includeMediaConsent"
                value="on"
                defaultChecked={event.includeMediaConsent}
                className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Include photos &amp; video consent
                </span>
                <span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-400">
                  Adds an optional checkbox (just before the main declaration) so
                  parents can give formal permission for NHSF (UK) Schools to use
                  their child&apos;s photo, film, or quotations on promotional
                  material and publications. Leave off if this event does not need
                  it.
                </span>
              </span>
            </label>

            <EventConsentTemplateSection initialFields={initialFormFields} />

            <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <ButtonLink href="/admin/events" variant="outline">
                Cancel
              </ButtonLink>
              <Button type="submit" variant="primary">
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card
        id="delete-event"
        tabIndex={-1}
        className="scroll-mt-24 border-red-200/80 dark:border-red-900/50"
      >
        <CardHeader>
          <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
            Delete event
          </h2>
          <p className="mt-1 text-sm text-red-800/90 dark:text-red-200/80">
            Permanently removes this programme and{" "}
            <strong>all consent submissions</strong>. Works the same for drafts
            and <strong>live</strong> events: if this form is published, the
            public page, home listing, and direct links stop working straight
            away. This cannot be undone.
          </p>
          {event.status === "published" ? (
            <p className="mt-2 rounded-lg border border-red-300/60 bg-red-100/50 px-3 py-2 text-sm font-medium text-red-950 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100">
              This event is live right now — deleting it removes the active form
              parents may be using.
            </p>
          ) : null}
        </CardHeader>
        <CardContent>
          <form action={boundDelete} className="flex flex-col gap-4">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-200/60 bg-red-50/50 p-3 dark:border-red-900/40 dark:bg-red-950/20">
              <input
                type="checkbox"
                name="confirmDelete"
                value="on"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-red-300 text-red-700 focus:ring-red-600 dark:border-red-800 dark:bg-red-950"
              />
              <span className="text-sm text-red-950 dark:text-red-100">
                I understand this will delete this programme
                {event.status === "published"
                  ? " (including the live public form)"
                  : ""}{" "}
                and every submission permanently.
              </span>
            </label>
            <Button
              type="submit"
              variant="outline"
              className="w-fit border-red-300 text-red-800 hover:bg-red-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-950/50"
            >
              Delete event permanently
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
