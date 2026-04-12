export type SchoolEvent = {
  slug: string;
  name: string;
  summary: string;
  dateLabel: string;
  location: string;
  closesLabel: string;
  /** Shown on listings */
  statusLabel: string;
};

export const SCHOOL_EVENTS: SchoolEvent[] = [
  {
    slug: "summer-camp-2026",
    name: "Summer Camp 2026",
    summary:
      "Consent and emergency contact details for the NHSF (UK) Schools summer residential.",
    dateLabel: "1–5 August 2026",
    location: "Venue confirmed with your school",
    closesLabel: "15 July 2026, 11:59pm",
    statusLabel: "Open for submissions",
  },
  {
    slug: "sports-day-2026",
    name: "Sports Day 2026",
    summary:
      "Parental consent and medical information for participation in Sports Day activities.",
    dateLabel: "20 June 2026",
    location: "As advised by your school",
    closesLabel: "13 June 2026, 11:59pm",
    statusLabel: "Open for submissions",
  },
  {
    slug: "leadership-retreat-2026",
    name: "Leadership Retreat 2026",
    summary:
      "Consent form for the Schools Leadership Retreat, including travel and safeguarding declarations.",
    dateLabel: "10–12 October 2026",
    location: "TBC — details emailed after signup",
    closesLabel: "26 September 2026, 11:59pm",
    statusLabel: "Open for submissions",
  },
];

export function getSchoolEvent(slug: string): SchoolEvent | undefined {
  return SCHOOL_EVENTS.find((e) => e.slug === slug);
}

export function getSchoolEventOrFallback(slug: string): SchoolEvent {
  const found = getSchoolEvent(slug);
  if (found) return found;
  return {
    slug,
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    summary:
      "Complete the consent form for this NHSF (UK) Schools event. If you reached this page in error, contact your school coordinator.",
    dateLabel: "See your school notice",
    location: "As advised by your school",
    closesLabel: "See event information",
    statusLabel: "Check with your school",
  };
}
