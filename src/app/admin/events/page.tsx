import Link from "next/link";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  deleteEventAction,
  duplicateEventAction,
} from "@/app/admin/events/actions";
import { Card, CardHeader } from "@/components/ui/Card";
import { prisma } from "@/lib/db";

export default async function AdminEventsPage() {
  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  try {
    events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    events = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit · Duplicate · Submissions · Delete"
        description="Each card is one consent programme — use the buttons to edit, duplicate, review submissions, or delete. Create event adds another. Published programmes appear on the site."
        actions={
          <ButtonLink href="/admin/events/new" variant="primary">
            Create event
          </ButtonLink>
        }
      />

      {events.length === 0 ? (
        <Card>
          <CardHeader>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No events in the database yet. Create one, or run{" "}
              <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
                npx prisma migrate dev
              </code>{" "}
              if you have not applied migrations.
            </p>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {e.title}
                  </h2>
                  {e.status === "published" ? (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                      Published
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {e.status}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Slug: <span className="font-mono">{e.slug}</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href={`/admin/events/${e.id}`} variant="outline" size="sm">
                    Edit
                  </ButtonLink>
                  <form action={duplicateEventAction.bind(null, e.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      Duplicate
                    </Button>
                  </form>
                  <ButtonLink
                    href={`/admin/events/${e.id}/submissions`}
                    variant="secondary"
                    size="sm"
                  >
                    Submissions
                  </ButtonLink>
                  <Link
                    href={`/events/${e.slug}`}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    View public
                  </Link>
                  <ButtonLink
                    href={`#delete-programme-${e.id}`}
                    variant="outline"
                    size="sm"
                    scroll
                    className="border-red-200 text-red-800 hover:bg-red-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    Delete
                  </ButtonLink>
                </div>

                <div
                  id={`delete-programme-${e.id}`}
                  className="scroll-mt-24 border-t border-red-200/80 pt-4 dark:border-red-900/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-800 dark:text-red-300">
                    Delete programme
                  </p>
                  <p className="mt-1 text-xs text-red-900/80 dark:text-red-200/80">
                    Removes this event, its public page, and every submission.
                    Cannot be undone.
                  </p>
                  <form
                    action={deleteEventAction.bind(null, e.id)}
                    className="mt-3 flex flex-col gap-3"
                  >
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-red-200/60 bg-red-50/60 p-2.5 text-sm text-red-950 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-100">
                      <input
                        type="checkbox"
                        name="confirmDelete"
                        value="on"
                        required
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-red-400 text-red-700 focus:ring-red-600 dark:border-red-700 dark:bg-red-950"
                      />
                      <span>
                        I understand I am deleting{" "}
                        <span className="font-semibold">{e.title}</span> and all
                        of its submissions.
                      </span>
                    </label>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="h-10 w-full justify-center gap-2 border-2 border-red-300 bg-red-50/80 text-red-900 hover:bg-red-100 dark:border-red-700 dark:bg-red-950/50 dark:text-red-100 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                      Delete permanently
                    </Button>
                  </form>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
