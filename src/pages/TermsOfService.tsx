import { eventName, organizationName } from "@/config";
import { Link } from "react-router-dom";

// ─── EDITABLE CONTENT ────────────────────────────────────────────────────────
const TERMS_CONTENT = {
  contactEmail: "heryan@garudahacks.com",
  lastUpdated: "June 2026",
  sections: [
    {
      title: "1. Acceptance of Terms",
      body: `By registering for or participating in ${"{eventName}"}, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not register for or attend the event.`,
    },
    {
      title: "2. Eligibility",
      body: `Participation in ${"{eventName}"} is open to students currently enrolled in a university or college. Participants must be at least 18 years old, or have parental/guardian consent if under 18. ${"{organizationName}"} reserves the right to verify eligibility at any time.`,
    },
    {
      title: "3. Code of Conduct",
      body: `All participants are expected to behave in a professional and respectful manner. Harassment, discrimination, or any form of misconduct will not be tolerated. Violations may result in immediate disqualification and removal from the event without refund. Please refer to our full Code of Conduct for detailed guidelines.`,
    },
    {
      title: "4. Intellectual Property",
      body: `Participants retain ownership of all intellectual property they create during ${"{eventName}"}. By submitting a project, you grant ${"{organizationName}"} a non-exclusive, royalty-free license to showcase your project in promotional materials, social media, and event recaps.`,
    },
    {
      title: "5. Prizes & Judging",
      body: `Prize decisions made by judges are final. ${"{organizationName}"} reserves the right to disqualify any submission that violates these Terms, the Code of Conduct, or the event rules. Prizes are non-transferable and cannot be exchanged for cash unless otherwise stated.`,
    },
    {
      title: "6. Limitation of Liability",
      body: `${"{organizationName}"} is not liable for any direct, indirect, incidental, or consequential damages arising from your participation in ${"{eventName}"}. This includes but is not limited to personal injury, property damage, or loss of data.`,
    },
    {
      title: "7. Media Release",
      body: `By attending ${"{eventName}"}, you grant ${"{organizationName}"} the right to photograph, record, and use your likeness in event-related media without compensation.`,
    },
    {
      title: "8. Changes to Terms",
      body: `${"{organizationName}"} reserves the right to update these Terms at any time. Continued participation after changes are posted constitutes your acceptance of the revised Terms.`,
    },
    {
      title: "9. Contact",
      body: `For questions about these Terms, please reach out to us at ${"{contactEmail}"}.`,
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

function interpolate(text: string, vars: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

function TermsOfService() {
  const vars = {
    organizationName: organizationName,
    eventName: eventName,
    contactEmail: TERMS_CONTENT.contactEmail,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            to="/auth"
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            ← Back to login
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {TERMS_CONTENT.lastUpdated}
        </p>

        <div className="space-y-8">
          {TERMS_CONTENT.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <p className="leading-relaxed">
                {interpolate(section.body, vars)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t text-sm text-muted-foreground text-center">
          <p>
            Also read our{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
