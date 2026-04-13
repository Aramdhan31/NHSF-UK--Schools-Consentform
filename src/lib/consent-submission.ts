import { z } from "zod";
import type { FormFieldDef } from "@/lib/form-template";
import { PARTICIPANT_SCHOOL_OTHER_VALUE } from "@/lib/participant-schools";

/** Stored in structured DB columns + encrypted sensitive block. */
export const CONSENT_CORE_FIELD_IDS = [
  "parentName",
  "parentEmail",
  "parentPhone",
  "childName",
  "school",
  "yearGroup",
  "emergencyPhone",
  "medical",
  "declaration",
] as const;

export type ConsentCoreFieldId = (typeof CONSENT_CORE_FIELD_IDS)[number];

const CORE_SET = new Set<string>(CONSENT_CORE_FIELD_IDS);

function formText(formData: FormData, key: string): string {
  const v = formData.get(key);
  if (v == null) return "";
  if (typeof v === "string") return v;
  return "";
}

export function consentRawFromFormData(
  formData: FormData,
  fields: FormFieldDef[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "checkbox") {
      out[f.id] = formData.get(f.id) === "on";
    } else {
      out[f.id] = formText(formData, f.id);
    }
  }
  return out;
}

function fieldZod(f: FormFieldDef): z.ZodTypeAny {
  if (f.type === "checkbox") {
    return f.required ? z.literal(true) : z.boolean();
  }
  if (f.type === "select") {
    const allowed = new Set((f.options ?? []).map((o) => o.value));
    const oneOf = z
      .string()
      .trim()
      .refine((v) => allowed.has(v), "Choose an option");
    return f.required ? oneOf : z.union([z.literal(""), oneOf]);
  }
  if (f.type === "email") {
    const e = z.string().trim().email().max(320);
    return f.required ? e : z.union([e, z.literal("")]);
  }
  if (f.type === "tel") {
    return f.required
      ? z.string().trim().min(1).max(80)
      : z.string().trim().max(80);
  }
  if (f.type === "textarea") {
    return f.required
      ? z.string().trim().min(1).max(10_000)
      : z.string().trim().max(10_000);
  }
  const maxLen = f.id === "childName" ? 500 : 200;
  return f.required
    ? z.string().trim().min(1).max(maxLen)
    : z.string().trim().max(maxLen);
}

export function buildConsentSubmissionSchema(fields: FormFieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    shape[f.id] = fieldZod(f);
  }
  const base = z.object(shape);
  const hasSchoolSelect = fields.some(
    (f) => f.id === "school" && f.type === "select",
  );
  if (!hasSchoolSelect) {
    return base;
  }
  return base.superRefine((data, ctx) => {
    if (data.school !== PARTICIPANT_SCHOOL_OTHER_VALUE) {
      return;
    }
    const o = String(
      (data as Record<string, unknown>).schoolOther ?? "",
    ).trim();
    if (o.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter your school name when you choose Other",
        path: ["schoolOther"],
      });
    }
  });
}

/** Merge "Other" free text into `school` and drop `schoolOther` before split / DB. */
export function normalizeSchoolFieldsForStorage(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const schoolRaw = String(data.school ?? "").trim();
  const other = String(data.schoolOther ?? "").trim();
  const school =
    schoolRaw === PARTICIPANT_SCHOOL_OTHER_VALUE ? other : schoolRaw;
  const { schoolOther: _drop, ...rest } = data;
  return { ...rest, school };
}

export type ParsedConsentPayload = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  school: string;
  yearGroup: string;
  emergencyPhone: string;
  medical: string;
  declaration: boolean;
  extras: Record<string, string | boolean>;
};

export function splitConsentPayload(
  parsed: Record<string, unknown>,
): ParsedConsentPayload {
  const extras: Record<string, string | boolean> = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (!CORE_SET.has(k)) {
      if (typeof v === "boolean") extras[k] = v;
      else if (typeof v === "string") extras[k] = v;
    }
  }

  return {
    parentName: String(parsed.parentName ?? ""),
    parentEmail: String(parsed.parentEmail ?? ""),
    parentPhone: String(parsed.parentPhone ?? ""),
    childName: String(parsed.childName ?? ""),
    school: String(parsed.school ?? ""),
    yearGroup: String(parsed.yearGroup ?? ""),
    emergencyPhone: String(parsed.emergencyPhone ?? ""),
    medical: String(parsed.medical ?? ""),
    declaration: parsed.declaration === true,
    extras,
  };
}
