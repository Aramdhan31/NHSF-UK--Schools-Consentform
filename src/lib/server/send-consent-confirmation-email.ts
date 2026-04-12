import "server-only";
import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ConsentConfirmationEmailParams = {
  to: string;
  eventTitle: string;
};

/**
 * Sends a confirmation after a consent submission is persisted. Call only after a
 * successful DB write. No-ops when Resend is not configured (logs a warning).
 */
export async function sendConsentConfirmationEmail(
  params: ConsentConfirmationEmailParams,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const support = process.env.SUPPORT_CONTACT_EMAIL?.trim();

  if (!apiKey || !from) {
    console.warn(
      "[email] RESEND_API_KEY or EMAIL_FROM missing; skipping consent confirmation email.",
    );
    return;
  }

  const fallbackContact =
    "the contact given on the event page or your school coordinator.";

  const titleSafe = escapeHtml(params.eventTitle);
  const mailtoHref = support
    ? `mailto:${encodeURIComponent(support)}`
    : null;
  const supportDisplay = support ? escapeHtml(support) : null;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #18181b;">
  <p>Hello,</p>
  <p>Thank you — we have received your consent form for <strong>${titleSafe}</strong>.</p>
  <p>This email confirms that your submission was saved successfully.</p>
  <p>If you have questions or concerns, please contact
    ${mailtoHref && supportDisplay ? `<a href="${mailtoHref}">${supportDisplay}</a>` : fallbackContact}
  </p>
  <p style="margin-top: 2rem; font-size: 0.875rem; color: #71717a;">NHSF (UK) Schools</p>
</body>
</html>
`.trim();

  const text = [
    "Hello,",
    "",
    `Thank you — we have received your consent form for "${params.eventTitle}".`,
    "",
    "This email confirms that your submission was saved successfully.",
    "",
    support
      ? `If you have questions or concerns, please contact: ${support}`
      : `If you have questions or concerns, please contact ${fallbackContact}`,
    "",
    "NHSF (UK) Schools",
  ].join("\n");

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    ...(support ? { replyTo: support } : {}),
    subject: `Consent form received: ${params.eventTitle}`,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}
