import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | NHSF (UK) Schools" },
  description:
    "How National Hindu Students' Forum (UK) handles personal data for the NHSF (UK) Schools consent and events portal.",
  alternates: { canonical: "/privacy" },
};

const section = "mt-10";
const h2 = "mt-10 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50";
const p = "mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400";
const ul = "mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400";
const link =
  "font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <nav className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className={`${link} text-zinc-700 dark:text-zinc-300`}>
          Home
        </Link>
        <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-zinc-900 dark:text-zinc-100">Privacy policy</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Privacy policy
        </h1>
        <p className="mt-2 text-base font-medium text-zinc-700 dark:text-zinc-300">
          NHSF (UK) Schools — event consent &amp; schools portal
        </p>
        <p className={p}>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Last updated:
          </span>{" "}
          April 2026
        </p>

        <h2 className={h2}>Who we are</h2>
        <p className={p}>
          National Hindu Students&apos; Forum (UK) (&quot;NHSF (UK)&quot;,
          &quot;we&quot;, &quot;us&quot;) is the data controller for personal
          information processed through this website — the NHSF (UK) Schools
          portal used to publish event information and collect consent and
          related forms from parents, carers, and schools.
        </p>
        <p className={p}>
          This means we decide how and why your personal data is used, in line
          with UK data protection law, including the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
        <p className={p}>
          This privacy policy describes how we handle personal data in connection
          with this portal. For NHSF (UK)&apos;s wider privacy information, see{" "}
          <a
            href="https://www.nhsf.org.uk/privacy-policy-2/"
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            our general privacy policy on nhsf.org.uk
          </a>
          .
        </p>

        <h2 className={h2}>What personal data we collect</h2>
        <p className={p}>Depending on how you use the portal, we may collect:</p>
        <ul className={ul}>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Identity &amp; contact details:
            </span>{" "}
            names, email addresses, telephone numbers, and relationship to the
            participant (e.g. parent or carer), as entered on consent or
            registration forms.
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Participant &amp; school information:
            </span>{" "}
            child or participant name, school name, year group or similar, and
            other details you or your school provide for a specific event.
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Health &amp; safeguarding-related information:
            </span>{" "}
            only where the form asks for it (for example emergency contacts or
            medical information needed to run an event safely). This may be
            special category data under UK GDPR; we only process it where the
            law allows and where it is necessary for the stated purpose.
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Consent &amp; declarations:
            </span>{" "}
            confirmations you give on the form (for example agreement to
            participation or accuracy of information).
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Administrative &amp; technical data:
            </span>{" "}
            records needed to operate the service, and limited technical
            information such as IP address, browser type, device type, and
            security or diagnostic logs, where our hosting or platform
            providers process this on our instructions.
          </li>
        </ul>
        <p className={p}>
          If you access the portal via a link from your school or from NHSF (UK),
          the categories above depend on the fields enabled for each event.
        </p>

        <h2 className={h2}>Why we use your personal data</h2>
        <p className={p}>We use personal data to:</p>
        <ul className={ul}>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Run events safely and lawfully:
            </span>{" "}
            process consent forms, manage attendance and participation, and meet
            safeguarding and duty-of-care expectations where applicable.
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Communicate with you:
            </span>{" "}
            respond to queries, send essential information about the event or
            form you submitted, and coordinate with schools as needed.
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Operate and improve the portal:
            </span>{" "}
            maintain the site, fix issues, and understand aggregate usage to
            improve the service (we do not sell your data for marketing).
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Legal obligations:
            </span>{" "}
            comply with law, regulation, or lawful requests, and protect the
            rights and safety of individuals.
          </li>
        </ul>
        <p className={p}>
          We rely on appropriate lawful bases under UK GDPR (which may include
          consent, legitimate interests, legal obligation, or — for special
          category data — the conditions that apply to health, safeguarding, or
          similar processing), depending on the activity.
        </p>
        <p className={p}>
          We do not sell your personal data. We do not share it with third
          parties for their own marketing. If we work with partners for a
          specific event, we will tell you when that means your data must be
          shared, where required.
        </p>

        <h2 className={h2}>Sharing your personal data</h2>
        <p className={p}>
          We may share information with trusted processors who help us run this
          portal or our events (for example IT hosting, email, or form
          technology), strictly under contract and only on our instructions.
        </p>
        <p className={p}>We may also share information:</p>
        <ul className={ul}>
          <li>
            With schools or coordinators involved in the event you signed up for,
            where that is necessary to administer the event.
          </li>
          <li>
            With venues or partners involved in delivery, where necessary for
            logistics, safeguarding, or health and safety.
          </li>
          <li>
            With regulators, law enforcement, or professional advisers if the law
            requires it or to protect rights and safety.
          </li>
        </ul>

        <h2 className={h2}>How long we keep your data</h2>
        <p className={p}>
          We keep personal data only for as long as needed for the purposes
          above, including:
        </p>
        <ul className={ul}>
          <li>the active period of the relevant event and reasonable follow-up;</li>
          <li>any period we need to resolve queries or disputes;</li>
          <li>
            longer retention where the law, insurance, or safeguarding practice
            requires it;
          </li>
          <li>
            aggregated or anonymised information that no longer identifies you,
            where we use it for reporting or improvement.
          </li>
        </ul>

        <h2 className={h2}>Your rights</h2>
        <p className={p}>
          Under UK data protection law you may have rights including: access to
          your data; rectification; erasure in certain circumstances;
          restriction of processing; objection where we rely on legitimate
          interests; and data portability where applicable. You may also have
          the right to complain to the Information Commissioner&apos;s Office
          (ICO) in the UK.
        </p>
        <p className={p}>
          To exercise your rights or ask questions about this portal, contact us
          using the details below. We may need to verify your identity before
          responding. We aim to respond without undue delay and within one month
          for most requests (extensions may apply for complex cases).
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          For rights requests, queries, or complaints about personal data in
          relation to NHSF (UK) Schools and this portal:
        </p>
        <p className={p}>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Email:
          </span>{" "}
          <a
            href="mailto:info@nhsf.org.uk?subject=Schools%20Portal%20Privacy"
            className={link}
          >
            info@nhsf.org.uk
          </a>
        </p>
        <p className={p}>
          Please include <strong className="text-zinc-800 dark:text-zinc-200">Schools Portal Privacy</strong>{" "}
          in the subject line so we can direct your message quickly.
        </p>

        <h2 className={h2}>Changes to this policy</h2>
        <p className={p}>
          We may update this policy from time to time. The current version will
          always be on this page with an updated &quot;Last updated&quot; date.
          Please check back periodically.
        </p>
        <p className={`${p} ${section}`}>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Version 1.0
          </span>{" "}
          — NHSF (UK) Schools portal — April 2026
        </p>
      </article>
    </div>
  );
}
