import type { FormFieldDef } from "@/lib/form-template";
import { defaultConsentFormFields } from "@/lib/form-template";

/** Keys match programme Word templates in `public/` (Dharmafest, JCD, CED, Yatra). JCD = July Committee Day. */
export const CONSENT_FORM_PRESET_KEYS = [
  "default",
  "dharmafest-2026",
  "jcd-2025",
  "ced-2025",
  "yatra-2025",
] as const;

export type ConsentFormPresetKey = (typeof CONSENT_FORM_PRESET_KEYS)[number];

export type ConsentProgramPresetKey = Exclude<ConsentFormPresetKey, "default">;

/** Programme Word templates only — `default` is the “from scratch” base in the UI. */
export const CONSENT_FORM_PROGRAM_PRESET_KEYS = [
  "dharmafest-2026",
  "jcd-2025",
  "ced-2025",
  "yatra-2025",
] as const satisfies readonly ConsentFormPresetKey[];

export const CONSENT_FORM_PRESET_LABELS: Record<ConsentFormPresetKey, string> =
  {
    default: "Standard NHSF Schools",
    "dharmafest-2026": "Dharmafest (template)",
    "jcd-2025": "JCD — July Committee Day (template)",
    "ced-2025": "CED (template)",
    "yatra-2025": "Yatra (template)",
  };

/** Short name for “Use … template” lines (no “(template)” suffix). */
export const CONSENT_FORM_PRESET_USE_TITLE: Record<ConsentProgramPresetKey, string> =
  {
    "dharmafest-2026": "Dharmafest",
    "jcd-2025": "July Committee Day (JCD)",
    "ced-2025": "CED",
    "yatra-2025": "Yatra",
  };

function cloneFields(fields: FormFieldDef[]): FormFieldDef[] {
  return fields.map((f) => ({ ...f }));
}

function withDeclaration(
  fields: FormFieldDef[],
  declarationLabel: string,
): FormFieldDef[] {
  return fields.map((f) =>
    f.id === "declaration" ? { ...f, label: declarationLabel } : f,
  );
}

/** Programme-specific wording on top of the same core field ids (admins can still edit). */
export function getConsentFormPreset(key: string): FormFieldDef[] {
  const base = cloneFields(defaultConsentFormFields());

  switch (key as ConsentFormPresetKey) {
    case "dharmafest-2026":
      return withDeclaration(
        base,
        "I confirm I have parental responsibility and consent to my child taking part in this Dharmafest / NHSF (UK) Schools activity, and that the information above is accurate.",
      );
    case "jcd-2025":
      return withDeclaration(
        base,
        "I confirm I have parental responsibility and consent to my child taking part in this JCD (July Committee Day) / NHSF (UK) Schools event, and that the information above is accurate.",
      );
    case "ced-2025":
      return withDeclaration(
        base,
        "I confirm I have parental responsibility and consent to my child taking part in this CED (Cultural Event Day) / NHSF (UK) Schools programme, and that the information above is accurate.",
      );
    case "yatra-2025":
      return [
        ...base
          .filter((f) => f.id !== "declaration")
          .map((f) =>
            f.id === "medical"
              ? {
                  ...f,
                  label:
                    "Medical conditions, allergies, or travel considerations we should know about",
                }
              : f,
          ),
        {
          id: "yatraTravelAck",
          group: "declaration",
          groupTitle: "Declaration",
          label:
            "I understand my child may be travelling as part of this Yatra / NHSF (UK) Schools programme and I consent to the arrangements described by the school or NHSF (UK).",
          type: "checkbox",
          required: true,
        },
        {
          id: "declaration",
          group: "declaration",
          label:
            "I confirm I have parental responsibility and consent to my child taking part in this Yatra / NHSF (UK) Schools event, and that the information above is accurate.",
          type: "checkbox",
          required: true,
        },
      ];
    case "default":
    default:
      return base;
  }
}

export function isConsentFormPresetKey(
  raw: string,
): raw is ConsentFormPresetKey {
  return (CONSENT_FORM_PRESET_KEYS as readonly string[]).includes(raw);
}
