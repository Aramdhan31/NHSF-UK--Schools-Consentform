import { z } from "zod";

export const formFieldTypes = ["text", "email", "tel", "textarea", "checkbox"] as const;

export const formFieldDefSchema = z.object({
  id: z.string().min(1),
  group: z.string().optional(),
  groupTitle: z.string().optional(),
  label: z.string().min(1),
  type: z.enum(formFieldTypes),
  required: z.boolean(),
  placeholder: z.string().optional(),
  autoComplete: z.string().optional(),
  rows: z.number().int().positive().max(24).optional(),
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
      type: "text",
      required: true,
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
  school: { type: "text", required: true },
  yearGroup: { type: "text", required: true },
  emergencyPhone: { type: "tel", required: true },
  medical: { type: "textarea", required: false },
  declaration: { type: "checkbox", required: true },
};

export function validateConsentFormFieldsForPersistence(
  fields: FormFieldDef[],
): { ok: true } | { ok: false; message: string } {
  const byId = new Map(fields.map((f) => [f.id, f]));
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
