import { z } from "zod";
import type { FormFieldDef } from "@/lib/form-template";

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
  return z.object(shape);
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
