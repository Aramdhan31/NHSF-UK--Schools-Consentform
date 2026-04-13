/**
 * Fixed list for the participant “School” dropdown on consent forms.
 * Value stored in DB is the label for listed schools, or free text when Other is chosen.
 */
export const PARTICIPANT_SCHOOL_OTHER_VALUE = "__other__";

export type ParticipantSchoolOption = { value: string; label: string };

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
