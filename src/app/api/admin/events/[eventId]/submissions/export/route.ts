import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  buildSubmissionsExportCsv,
  sanitizeCsvFilenameSegment,
} from "@/lib/server/submissions-export-csv";

export async function GET(
  _request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { eventId } = await context.params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, slug: true },
  });

  if (!event) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const submissions = await prisma.submission.findMany({
    where: { eventId },
    orderBy: [{ checkedIn: "asc" }, { submittedAt: "desc" }],
  });

  const csv = buildSubmissionsExportCsv(submissions);
  const slugPart = sanitizeCsvFilenameSegment(event.slug);
  const datePart = new Date().toISOString().slice(0, 10);
  const filename = `submissions-${slugPart}-${datePart}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}
