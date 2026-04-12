import "server-only";
import type { Submission } from "@prisma/client";
import { decryptSubmissionSensitiveColumns } from "@/lib/server/submission-sensitive";
import { tryDecryptSubmissionCiphertext } from "@/lib/server/submission-field-crypto";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const s =
    value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const COLUMNS = [
  "childName",
  "parentName",
  "school",
  "yearGroup",
  "checkedIn",
  "checkedInAt",
  "adminNotes",
  "parentEmail",
  "parentPhone",
  "emergencyContact",
  "medicalNotes",
  "extrasJson",
] as const;

/**
 * UTF-8 CSV with BOM for Excel; decrypts sensitive columns on the server only.
 */
export function buildSubmissionsExportCsv(rows: Submission[]): string {
  const header = COLUMNS.map((h) => escapeCsvCell(h)).join(",");
  const lines = [header];

  for (const row of rows) {
    const d = decryptSubmissionSensitiveColumns(row);
    const extras =
      row.extrasEncrypted != null && row.extrasEncrypted !== ""
        ? tryDecryptSubmissionCiphertext(row.extrasEncrypted) ?? ""
        : "";
    lines.push(
      [
        escapeCsvCell(row.childName),
        escapeCsvCell(row.parentName),
        escapeCsvCell(row.school),
        escapeCsvCell(row.yearGroup),
        escapeCsvCell(row.checkedIn),
        escapeCsvCell(row.checkedInAt),
        escapeCsvCell(row.notes),
        escapeCsvCell(d.parentEmail),
        escapeCsvCell(d.parentPhone),
        escapeCsvCell(d.emergencyContact),
        escapeCsvCell(d.medicalNotes),
        escapeCsvCell(extras),
      ].join(","),
    );
  }

  return `\uFEFF${lines.join("\r\n")}`;
}

export function sanitizeCsvFilenameSegment(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_|_$/g, "");
  return s.slice(0, 80) || "event";
}
