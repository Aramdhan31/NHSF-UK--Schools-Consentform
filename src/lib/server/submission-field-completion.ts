import "server-only";
import type { Submission } from "@prisma/client";
import type { FormFieldDef } from "@/lib/form-template";
import { tryDecryptSubmissionCiphertext } from "@/lib/server/submission-field-crypto";
import { decryptSubmissionSensitiveForExport } from "@/lib/server/submission-sensitive";
import type { SubmissionPlaintextSensitive } from "@/lib/server/submission-sensitive";

export function parseExtrasFromEncrypted(
  extrasEncrypted: string | null | undefined,
): Record<string, string | boolean> {
  if (extrasEncrypted == null || extrasEncrypted === "") {
    return {};
  }
  const raw = tryDecryptSubmissionCiphertext(extrasEncrypted);
  if (raw == null || raw === "") {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const out: Record<string, string | boolean> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "boolean") {
        out[k] = v;
      } else if (typeof v === "string") {
        out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function buildSubmissionFieldValues(
  row: Submission,
  sensitive: SubmissionPlaintextSensitive,
  extras: Record<string, string | boolean>,
): Record<string, string | boolean> {
  return {
    parentName: row.parentName,
    parentEmail: sensitive.parentEmail,
    parentPhone: sensitive.parentPhone,
    childName: row.childName,
    school: row.school,
    yearGroup: row.yearGroup,
    emergencyPhone: sensitive.emergencyContact,
    medical: sensitive.medicalNotes,
    declaration: row.consentStatus,
    ...extras,
  };
}

function isOptionalValueEmpty(f: FormFieldDef, raw: unknown): boolean {
  if (raw === undefined || raw === null) {
    return true;
  }
  if (f.type === "checkbox") {
    return raw !== true;
  }
  return String(raw).trim() === "";
}

/** Human-readable labels for optional template fields left blank on submit. */
export function optionalFieldGapLabels(
  fields: FormFieldDef[],
  values: Record<string, string | boolean>,
): string[] {
  const out: string[] = [];
  for (const f of fields) {
    if (f.required) {
      continue;
    }
    // Only relevant when "Other" is selected; stored submissions never keep the sentinel.
    if (f.id === "schoolOther") {
      continue;
    }
    if (isOptionalValueEmpty(f, values[f.id])) {
      out.push(f.label);
    }
  }
  return out;
}

/** Whether the core medical textarea was filled (only if that field exists). */
export function medicalDetailsProvided(
  fields: FormFieldDef[],
  values: Record<string, string | boolean>,
): "yes" | "no" | "n/a" {
  const medical = fields.find((f) => f.id === "medical");
  if (!medical) {
    return "n/a";
  }
  return isOptionalValueEmpty(medical, values.medical) ? "no" : "yes";
}

export function optionalFieldGapLabelsForSubmission(
  row: Submission,
  fields: FormFieldDef[],
): string[] {
  const sensitive = decryptSubmissionSensitiveForExport(row);
  const extras = parseExtrasFromEncrypted(row.extrasEncrypted);
  const values = buildSubmissionFieldValues(row, sensitive, extras);
  return optionalFieldGapLabels(fields, values);
}
