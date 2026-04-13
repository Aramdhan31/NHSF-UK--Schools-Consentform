/**
 * Fixed list for the participant “School” dropdown on consent forms.
 * Value stored in DB is the label for listed schools, or free text when Other is chosen.
 */
export const PARTICIPANT_SCHOOL_OTHER_VALUE = "__other__";

export type ParticipantSchoolOption = { value: string; label: string };

/** Text shown in admin: one school name per line (no pipes; "Other" is not listed). */
export function schoolOptionsToAdminLines(
  options: ParticipantSchoolOption[] | undefined,
): string {
  if (!options?.length) {
    return "";
  }
  return options
    .filter((o) => o.value !== PARTICIPANT_SCHOOL_OTHER_VALUE)
    .map((o) => o.label.trim())
    .filter(Boolean)
    .join("\n");
}

/** Build dropdown options from admin textarea; always ends with Other → __other__. */
export function adminLinesToSchoolOptions(
  text: string,
): ParticipantSchoolOption[] {
  const seen = new Set<string>();
  const schools: ParticipantSchoolOption[] = [];
  for (const line of text.split("\n")) {
    const name = line.trim();
    if (!name || name === PARTICIPANT_SCHOOL_OTHER_VALUE) {
      continue;
    }
    const key = name.toLowerCase();
    if (key === "other") {
      continue;
    }
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    schools.push({ value: name, label: name });
  }
  schools.push({
    value: PARTICIPANT_SCHOOL_OTHER_VALUE,
    label: "Other",
  });
  return schools;
}

export function defaultParticipantSchoolOptions(): ParticipantSchoolOption[] {
  return [
    { value: "Dr Challoners", label: "Dr Challoners" },
    { value: "Altrincham Boys", label: "Altrincham Boys" },
    { value: "Altrincham Girls", label: "Altrincham Girls" },
    { value: "Sale Grammar", label: "Sale Grammar" },
    { value: "Upton Court", label: "Upton Court" },
    { value: "Alperton", label: "Alperton" },
    { value: "Nonsuch", label: "Nonsuch" },
    { value: "St Olaves", label: "St Olaves" },
    { value: "Wallington Boys", label: "Wallington Boys" },
    { value: "Wallington Girls", label: "Wallington Girls" },
    { value: "Sutton Grammar", label: "Sutton Grammar" },
    { value: "Wilsons", label: "Wilsons" },
    { value: PARTICIPANT_SCHOOL_OTHER_VALUE, label: "Other" },
  ];
}
