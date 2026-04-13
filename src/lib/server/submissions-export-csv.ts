import "server-only";
import type { Submission } from "@prisma/client";
import type { FormFieldDef } from "@/lib/form-template";
import { decryptSubmissionSensitiveForExport } from "@/lib/server/submission-sensitive";
import { tryDecryptSubmissionCiphertext } from "@/lib/server/submission-field-crypto";
import {
  buildSubmissionFieldValues,
  medicalDetailsProvided,
  optionalFieldGapLabels,
  parseExtrasFromEncrypted,
} from "@/lib/server/submission-field-completion";

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

/** One column per template field, using labels as headers (unique, Excel-safe). */
function uniqueFormFieldHeaders(fields: FormFieldDef[]): string[] {
  const counts = new Map<string, number>();
  return fields.map((f) => {
    const base = (f.label?.trim() || f.id).replace(/\s+/g, " ");
    const n = (counts.get(base) ?? 0) + 1;
    counts.set(base, n);
    return n > 1 ? `${base} (${f.id})` : base;
  });
}

function formatFormFieldCsvValue(f: FormFieldDef, raw: unknown): string {
  if (raw === undefined || raw === null) {
    return "";
  }
  if (f.type === "checkbox") {
    return raw === true ? "yes" : "no";
  }
  return String(raw).trim();
}

const FIXED_COLUMNS = [
  "submissionId",
  "submittedAt",
  "childName",
  "parentName",
  "school",
  "yearGroup",
  "consentStatus",
  "attendanceStatus",
  "checkedIn",
  "checkedInAt",
  "checkedInBy",
  "adminNotes",
  "medicalDetailsProvided",
  "optionalFieldsNotProvided",
] as const;

/**
 * UTF-8 CSV with BOM for Excel; decrypts sensitive columns on the server only.
 * `formFields` must match the event template so optional-field gaps match the live form.
 */
export function buildSubmissionsExportCsv(
  rows: Submission[],
  formFields: FormFieldDef[],
): string {
  const formHeaders = uniqueFormFieldHeaders(formFields);
  const header = [
    ...FIXED_COLUMNS.map((h) => escapeCsvCell(h)),
    ...formHeaders.map((h) => escapeCsvCell(h)),
    escapeCsvCell("extrasJson"),
  ].join(",");
  const lines = [header];

  for (const row of rows) {
    const d = decryptSubmissionSensitiveForExport(row);
    const extrasObj = parseExtrasFromEncrypted(row.extrasEncrypted);
    const extrasJson =
      row.extrasEncrypted != null && row.extrasEncrypted !== ""
        ? tryDecryptSubmissionCiphertext(row.extrasEncrypted) ?? ""
        : "";
    const values = buildSubmissionFieldValues(row, d, extrasObj);
    const gapLabels = optionalFieldGapLabels(formFields, values);
    const medicalProv = medicalDetailsProvided(formFields, values);

    const formCells = formFields.map((f) =>
      escapeCsvCell(formatFormFieldCsvValue(f, values[f.id])),
    );

    lines.push(
      [
        escapeCsvCell(row.id),
        escapeCsvCell(row.submittedAt),
        escapeCsvCell(row.childName),
        escapeCsvCell(row.parentName),
        escapeCsvCell(row.school),
        escapeCsvCell(row.yearGroup),
        escapeCsvCell(row.consentStatus),
        escapeCsvCell(row.attendanceStatus),
        escapeCsvCell(row.checkedIn),
        escapeCsvCell(row.checkedInAt),
        escapeCsvCell(row.checkedInBy),
        escapeCsvCell(row.notes),
        escapeCsvCell(medicalProv),
        escapeCsvCell(
          gapLabels.length > 0 ? gapLabels.join("; ") : "",
        ),
        ...formCells,
        escapeCsvCell(extrasJson),
      ].join(","),
    );
  }

  return `\uFEFF${lines.join("\r\n")}`;
}

export function sanitizeCsvFilenameSegment(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_|_$/g, "");
  return s.slice(0, 80) || "event";
}
