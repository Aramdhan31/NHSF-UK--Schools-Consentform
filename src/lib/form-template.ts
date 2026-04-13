import { z } from "zod";
import {
  defaultParticipantSchoolOptions,
  PARTICIPANT_SCHOOL_OTHER_VALUE,
} from "@/lib/participant-schools";

export const formFieldTypes = [
  "text",
  "email",
  "tel",
  "textarea",
  "checkbox",
  "select",
] as const;

export const formFieldOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const formFieldDefSchema = z
  .object({
    id: z.string().min(1),
    group: z.string().optional(),
    groupTitle: z.string().optional(),
    label: z.string().min(1),
    type: z.enum(formFieldTypes),
    required: z.boolean(),
    placeholder: z.string().optional(),
    autoComplete: z.string().optional(),
    rows: z.number().int().positive().max(24).optional(),
    options: z.array(formFieldOptionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "select") {
      if (!data.options?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select fields need at least one option",
          path: ["options"],
        });
      }
    } else if (data.options != null && data.options.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only select fields may have options",
        path: ["options"],
      });
    }
  });

export type FormFieldDef = z.infer<typeof formFieldDefSchema>;

export const formFieldsArraySchema = z.array(formFieldDefSchema).min(1);

/** Default consent template — same structure as the original hard-coded form. */
export function defaultConsentFormFields(): FormFieldDef[] {
  return [
    {
      id: "parentName",
      group: "parent",
      groupTitle: "Parent or carer",
      label: "Full name",
      type: "text",
      required: true,
      autoComplete: "name",
    },
    {
      id: "parentEmail",
      group: "parent",
      label: "Email",
      type: "email",
      required: true,
      autoComplete: "email",
    },
    {
      id: "parentPhone",
      group: "parent",
      label: "Phone",
      type: "tel",
      required: false,
      autoComplete: "tel",
    },
    {
      id: "childName",
      group: "participant",
      groupTitle: "Participant",
      label: "Child's full name",
      type: "text",
      required: true,
    },
    {
      id: "school",
      group: "participant",
      label: "School",
      type: "select",
      required: true,
      options: defaultParticipantSchoolOptions(),
    },
    {
      id: "schoolOther",
      group: "participant",
      label: "School name (only if you chose Other above)",
      type: "text",
      required: false,
      placeholder: "Type the full name of your school",
    },
    {
      id: "yearGroup",
      group: "participant",
      label: "Year group",
      type: "text",
      required: true,
    },
    {
      id: "emergencyPhone",
      group: "medical",
      groupTitle: "Medical & emergency",
      label: "Emergency contact number",
      type: "tel",
      required: true,
      autoComplete: "tel",
    },
    {
      id: "medical",
      group: "medical",
      label: "Medical conditions or allergies we should know about",
      type: "textarea",
      required: false,
      rows: 4,
    },
    {
      id: "declaration",
      group: "declaration",
      label:
        "I confirm I have parental responsibility and consent to my child taking part in this NHSF (UK) Schools event, and that the information above is accurate.",
      type: "checkbox",
      required: true,
    },
  ];
}

export const MEDIA_CONSENT_FIELD_ID = "mediaConsent" as const;

/** Optional checkbox — injected when `Event.includeMediaConsent` is true (before declaration). */
export function mediaConsentFieldDef(): FormFieldDef {
  return {
    id: MEDIA_CONSENT_FIELD_ID,
    group: "media",
    groupTitle: "Photos and video",
    label:
      "I give permission for NHSF (UK) Schools to use my child's photograph and other media such as film and quotations, on NHSF (UK) Schools promotional material and publications. (Optional — you can still take part if you do not tick this.)",
    type: "checkbox",
    required: false,
  };
}

/** Remove media consent from stored JSON so it is only controlled by the event flag. */
export function stripMediaConsentFromFields(
  fields: FormFieldDef[],
): FormFieldDef[] {
  return fields.filter((f) => f.id !== MEDIA_CONSENT_FIELD_ID);
}

export function mergeMediaConsentForEvent(
  fields: FormFieldDef[],
  include: boolean,
): FormFieldDef[] {
  const base = stripMediaConsentFromFields(fields);
  if (!include) {
    return base;
  }
  const declIdx = base.findIndex((f) => f.id === "declaration");
  const insertAt = declIdx >= 0 ? declIdx : base.length;
  const next = [...base];
  next.splice(insertAt, 0, mediaConsentFieldDef());
  return next;
}

/** Form fields as parents see them (published form, submit validation, exports). */
export function eventConsentFieldsForUse(
  formFieldsJson: unknown | null,
  includeMediaConsent: boolean,
): FormFieldDef[] {
  const parsed = parseFormFieldsJson(formFieldsJson);
  return mergeMediaConsentForEvent(parsed, includeMediaConsent);
}

export function parseFormFieldsJson(raw: unknown): FormFieldDef[] {
  const parsed = formFieldsArraySchema.safeParse(raw);
  if (!parsed.success) {
    return defaultConsentFormFields();
  }
  return parsed.data;
}

export function safeParseFormFieldsJsonString(json: string): FormFieldDef[] | null {
  try {
    const data = JSON.parse(json) as unknown;
    const parsed = formFieldsArraySchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Core ids + types must match so submissions map to DB columns. */
const CORE_FIELD_SPECS: Record<
  string,
  { type: FormFieldDef["type"]; required: boolean }
> = {
  parentName: { type: "text", required: true },
  parentEmail: { type: "email", required: true },
  parentPhone: { type: "tel", required: false },
  childName: { type: "text", required: true },
  yearGroup: { type: "text", required: true },
  emergencyPhone: { type: "tel", required: true },
  medical: { type: "textarea", required: false },
  declaration: { type: "checkbox", required: true },
};

function validateSchoolCorePair(
  byId: Map<string, FormFieldDef>,
): { ok: true } | { ok: false; message: string } {
  const school = byId.get("school");
  if (!school) {
    return { ok: false, message: `Missing required field id "school".` };
  }
  if (school.type === "text") {
    if (school.required !== true) {
      return {
        ok: false,
        message: `Field "school" must have required=true for legacy text type.`,
      };
    }
    if (byId.has("schoolOther")) {
      return {
        ok: false,
        message:
          'Remove field id "schoolOther" when "school" is a plain text field, or switch school to type "select".',
      };
    }
    return { ok: true };
  }
  if (school.type === "select") {
    if (school.required !== true) {
      return {
        ok: false,
        message: `Field "school" (select) must have required=true.`,
      };
    }
    if (
      !school.options?.some((o) => o.value === PARTICIPANT_SCHOOL_OTHER_VALUE)
    ) {
      return {
        ok: false,
        message: `Field "school" (select) must include an "Other" option with value "${PARTICIPANT_SCHOOL_OTHER_VALUE}".`,
      };
    }
    const other = byId.get("schoolOther");
    if (!other) {
      return {
        ok: false,
        message: `Missing required field id "schoolOther" when "school" is a select (optional text for Other).`,
      };
    }
    if (other.type !== "text" || other.required !== false) {
      return {
        ok: false,
        message: `Field "schoolOther" must be type "text" with required=false.`,
      };
    }
    return { ok: true };
  }
  return {
    ok: false,
    message: `Field "school" must be type "text" (legacy) or "select" (got "${school.type}").`,
  };
}

export function validateConsentFormFieldsForPersistence(
  fields: FormFieldDef[],
): { ok: true } | { ok: false; message: string } {
  const byId = new Map(fields.map((f) => [f.id, f]));
  const schoolCheck = validateSchoolCorePair(byId);
  if (!schoolCheck.ok) {
    return schoolCheck;
  }
  for (const [id, spec] of Object.entries(CORE_FIELD_SPECS)) {
    const f = byId.get(id);
    if (!f) {
      return { ok: false, message: `Missing required field id "${id}".` };
    }
    if (f.type !== spec.type) {
      return {
        ok: false,
        message: `Field "${id}" must be type "${spec.type}" (got "${f.type}").`,
      };
    }
    if (f.required !== spec.required) {
      return {
        ok: false,
        message: `Field "${id}" must have required=${String(spec.required)}.`,
      };
    }
  }
  return { ok: true };
}
