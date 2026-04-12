import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, TD, TH, THead, TRow } from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { decryptSubmissionSensitiveColumns } from "@/lib/server/submission-sensitive";
import {
  toggleSubmissionCheckIn,
  updateSubmissionNotes,
} from "@/app/admin/events/[id]/submissions/actions";
import type { Prisma } from "@prisma/client";

const selectFieldClass =
  "h-10 w-full min-w-[7rem] rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function parseYesNo(
  raw: string | undefined,
): "yes" | "no" | null {
  const v = raw?.trim().toLowerCase();
  if (v === "yes" || v === "true" || v === "1") return "yes";
  if (v === "no" || v === "false" || v === "0") return "no";
  return null;
}

export default async function AdminSubmissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    q?: string;
    school?: string;
    yearGroup?: string;
    checkedIn?: string;
    consent?: string;
  }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const schoolParam = (sp.school ?? "").trim();
  const yearGroupParam = (sp.yearGroup ?? "").trim();
  const checkedInFilter = parseYesNo(sp.checkedIn);
  const consentFilter = parseYesNo(sp.consent);

  const hasActiveFilters =
    Boolean(q) ||
    Boolean(schoolParam) ||
    Boolean(yearGroupParam) ||
    checkedInFilter !== null ||
    consentFilter !== null;

  let eventTitle: string | null = null;
  let rows: Awaited<ReturnType<typeof prisma.submission.findMany>> = [];
  let schoolOptions: { school: string }[] = [];
  let yearOptions: { yearGroup: string }[] = [];

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { title: true },
    });
    if (!event) {
      notFound();
    }
    eventTitle = event.title;

    const where: Prisma.SubmissionWhereInput = {
      eventId: id,
      ...(q
        ? {
            OR: [
              { childName: { contains: q, mode: "insensitive" } },
              { parentName: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(schoolParam ? { school: schoolParam } : {}),
      ...(yearGroupParam ? { yearGroup: yearGroupParam } : {}),
      ...(checkedInFilter === "yes"
        ? { checkedIn: true }
        : checkedInFilter === "no"
          ? { checkedIn: false }
          : {}),
      ...(consentFilter === "yes"
        ? { consentStatus: true }
        : consentFilter === "no"
          ? { consentStatus: false }
          : {}),
    };

    const [list, schools, years] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: [{ checkedIn: "asc" }, { submittedAt: "desc" }],
      }),
      prisma.submission.groupBy({
        by: ["school"],
        where: { eventId: id },
        orderBy: { school: "asc" },
      }),
      prisma.submission.groupBy({
        by: ["yearGroup"],
        where: { eventId: id },
        orderBy: { yearGroup: "asc" },
      }),
    ]);

    rows = list;
    schoolOptions = schools;
    yearOptions = years;
  } catch {
    rows = [];
  }

  const total = rows.length;
  const checkedInCount = rows.filter((s) => s.checkedIn).length;
  const remainingCount = total - checkedInCount;

  const rowsWithSensitive = rows.map((row) => ({
    row,
    sensitive: decryptSubmissionSensitiveColumns(row),
  }));

  const basePath = `/admin/events/${id}/submissions`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={eventTitle ? `Check-in · ${eventTitle}` : `Submissions · Event`}
        description="Filter by school, year, check-in, or consent. Search still matches child or parent name. Sort: not checked in first, then newest."
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink
              href={`/api/admin/events/${id}/submissions/export`}
              variant="secondary"
            >
              Export CSV
            </ButtonLink>
            <ButtonLink href={`/admin/events/${id}`} variant="outline">
              Back to event
            </ButtonLink>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              In view
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
              {total}
            </p>
            {hasActiveFilters ? (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                With current filters
              </p>
            ) : null}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Checked in (in view)
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {checkedInCount}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Not yet (in view)
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
              {remainingCount}
            </p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Attendance
          </h2>
          <form method="get" className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-2">
              <label className="flex min-w-[10rem] flex-1 flex-col gap-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Search
                </span>
                <Input
                  name="q"
                  type="search"
                  placeholder="Child or parent…"
                  defaultValue={q}
                  aria-label="Search by child or parent name"
                  className="h-10"
                />
              </label>
              <label className="flex min-w-[8rem] flex-col gap-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  School
                </span>
                <select
                  name="school"
                  defaultValue={schoolParam}
                  className={selectFieldClass}
                  aria-label="Filter by school"
                >
                  <option value="">All</option>
                  {schoolOptions.map((s) => (
                    <option key={s.school} value={s.school}>
                      {s.school}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-[6rem] flex-col gap-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Year
                </span>
                <select
                  name="yearGroup"
                  defaultValue={yearGroupParam}
                  className={selectFieldClass}
                  aria-label="Filter by year group"
                >
                  <option value="">All</option>
                  {yearOptions.map((y) => (
                    <option key={y.yearGroup} value={y.yearGroup}>
                      {y.yearGroup}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-[7rem] flex-col gap-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Check-in
                </span>
                <select
                  name="checkedIn"
                  defaultValue={
                    checkedInFilter === "yes"
                      ? "yes"
                      : checkedInFilter === "no"
                        ? "no"
                        : ""
                  }
                  className={selectFieldClass}
                  aria-label="Filter by check-in status"
                >
                  <option value="">All</option>
                  <option value="no">Not yet</option>
                  <option value="yes">Present</option>
                </select>
              </label>
              <label className="flex min-w-[7rem] flex-col gap-1">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Consent
                </span>
                <select
                  name="consent"
                  defaultValue={
                    consentFilter === "yes"
                      ? "yes"
                      : consentFilter === "no"
                        ? "no"
                        : ""
                  }
                  className={selectFieldClass}
                  aria-label="Filter by consent"
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <div className="flex flex-wrap gap-2 pb-0.5">
                <Button type="submit" variant="secondary" size="md">
                  Apply
                </Button>
                {hasActiveFilters ? (
                  <Link
                    href={basePath}
                    className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                  >
                    Clear
                  </Link>
                ) : null}
              </div>
            </div>
          </form>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-4">
          {rows.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {hasActiveFilters
                ? "No submissions match these filters."
                : "No submissions yet for this event."}
            </p>
          ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>Child</TH>
                  <TH>Parent / carer</TH>
                  <TH>School</TH>
                  <TH>Year</TH>
                  <TH>Consent</TH>
                  <TH>Status</TH>
                  <TH className="min-w-[11rem] max-w-[13rem]">Notes</TH>
                  <TH className="w-[1%] whitespace-nowrap">Action</TH>
                </TRow>
              </THead>
              <tbody>
                {rowsWithSensitive.map(({ row }) => {
                  const toggle = toggleSubmissionCheckIn.bind(
                    null,
                    id,
                    row.id,
                    !row.checkedIn,
                  );
                  const saveNotes = updateSubmissionNotes.bind(
                    null,
                    id,
                    row.id,
                  );
                  return (
                    <TRow
                      key={row.id}
                      className={cn(
                        row.checkedIn &&
                          "bg-emerald-50/90 hover:bg-emerald-50 dark:bg-emerald-950/25 dark:hover:bg-emerald-950/35",
                      )}
                    >
                      <TD className="font-medium text-zinc-950 dark:text-zinc-50">
                        {row.childName}
                      </TD>
                      <TD className="max-w-[160px] text-sm">{row.parentName}</TD>
                      <TD className="max-w-[140px] text-sm">{row.school}</TD>
                      <TD className="text-sm">{row.yearGroup}</TD>
                      <TD className="text-sm">
                        {row.consentStatus ? (
                          <span className="text-emerald-700 dark:text-emerald-400">
                            Yes
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400">
                            No
                          </span>
                        )}
                      </TD>
                      <TD className="text-sm">
                        {row.checkedIn ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex w-fit rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white dark:bg-emerald-500">
                              Present
                            </span>
                            {row.checkedInAt ? (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {row.checkedInAt.toLocaleString("en-GB", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                                {row.checkedInBy ? (
                                  <>
                                    <br />
                                    <span className="break-all">
                                      by {row.checkedInBy}
                                    </span>
                                  </>
                                ) : null}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Expected
                          </span>
                        )}
                      </TD>
                      <TD className="max-w-[13rem] align-top">
                        <div className="space-y-1.5">
                          <p
                            className="line-clamp-2 min-h-[2.25rem] break-words text-xs leading-snug text-zinc-600 dark:text-zinc-400"
                            title={
                              row.notes?.trim()
                                ? row.notes
                                : undefined
                            }
                          >
                            {row.notes?.trim() ? row.notes : "—"}
                          </p>
                          <form
                            action={saveNotes}
                            className="flex flex-col gap-1"
                          >
                            <textarea
                              name="notes"
                              rows={2}
                              maxLength={2000}
                              defaultValue={row.notes ?? ""}
                              placeholder="Admin note…"
                              className="w-full resize-y rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                              aria-label={`Admin notes for ${row.childName}`}
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Save
                            </Button>
                          </form>
                        </div>
                      </TD>
                      <TD className="whitespace-nowrap">
                        <form action={toggle}>
                          <Button
                            type="submit"
                            variant={row.checkedIn ? "outline" : "primary"}
                            size="sm"
                            className={
                              row.checkedIn
                                ? undefined
                                : "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            }
                          >
                            {row.checkedIn ? "Undo" : "Mark present"}
                          </Button>
                        </form>
                      </TD>
                    </TRow>
                  );
                })}
              </tbody>
            </Table>
          )}

          {rows.length > 0 ? (
            <div className="mt-8 space-y-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Contact &amp; medical (same order as above)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Decrypted on the server for this page only.
              </p>
              <ul className="space-y-3">
                {rowsWithSensitive.map(({ row, sensitive: s }) => (
                  <li
                    key={`detail-${row.id}`}
                    className={cn(
                      "rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800",
                      row.checkedIn &&
                        "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
                    )}
                  >
                    <p className="font-medium text-zinc-950 dark:text-zinc-50">
                      {row.childName}
                      <span className="font-normal text-zinc-500 dark:text-zinc-400">
                        {" "}
                        · {row.parentName}
                      </span>
                    </p>
                    <dl className="mt-2 grid gap-1 text-xs text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                          Email
                        </dt>
                        <dd className="break-all">{s.parentEmail}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                          Phone
                        </dt>
                        <dd>{s.parentPhone}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                          Emergency
                        </dt>
                        <dd>{s.emergencyContact}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                          Medical notes
                        </dt>
                        <dd className="whitespace-pre-wrap">{s.medicalNotes}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
