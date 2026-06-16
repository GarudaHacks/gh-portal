import { eventName, organizationName } from "@/config";
import { Link } from "react-router-dom";

// ─── EDITABLE CONTENT ────────────────────────────────────────────────────────
const PRIVACY_CONTENT = {
  contactEmail: "heryan@garudahacks.com",
  lastUpdated: "June 2026",
  sections: [
    {
      title: "1. Information We Collect",
      body: `When you register for or participate in ${eventName} events organized by ${organizationName}, we may collect the following information:\n\n• Personal identifiers: name, email address, phone number, university/school name\n• Application information: resume, portfolio links, project descriptions\n• Account credentials: email and hashed password via Firebase Authentication\n• Usage data: pages visited, features used, login timestamps`,
    },
    {
      title: "2. How We Use Your Information",
      body: `We use the information we collect to:\n\n• Process your event registration and application\n• Communicate event updates, schedules, and announcements\n• Facilitate mentorship and team matching\n• Evaluate submissions and distribute prizes\n• Improve our platform and future events\n• Comply with legal obligations`,
    },
    {
      title: "3. Information Sharing",
      body: `We do not sell your personal data. We may share your information with:\n\n• Event sponsors and partners, to the extent you consent during registration\n• Service providers who help us operate our platform (e.g., Firebase, hosting providers)\n• Law enforcement or legal authorities when required by law\n\nSponsors may receive aggregated, anonymized data unless you explicitly opt in to sharing your profile.`,
    },
    {
      title: "4. Data Retention",
      body: `We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us at ${"{contactEmail}"}. Certain data may be retained for legal or operational purposes even after deletion.`,
    },
    {
      title: "5. Cookies & Tracking",
      body: `Our platform may use cookies and similar technologies to maintain sessions and improve your experience. You can control cookie behavior through your browser settings. Disabling cookies may affect some functionality of the portal.`,
    },
    {
      title: "6. Security",
      body: `We implement industry-standard security measures including encrypted data transmission (HTTPS), secure authentication via Firebase, and restricted access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: "7. Your Rights",
      body: `Depending on your jurisdiction, you may have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data\n• Withdraw consent where processing is based on consent\n• Lodge a complaint with a supervisory authority\n\nTo exercise these rights, contact us at ${"{contactEmail}"}.`,
    },
    {
      title: "8. Third-Party Services",
      body: `Our platform integrates with third-party services such as Firebase (Google) for authentication and data storage. These services have their own privacy policies. We encourage you to review them separately.`,
    },
    {
      title: "9. Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email or in-app notification. Continued use of the platform after changes are posted constitutes acceptance of the revised policy.`,
    },
    {
      title: "10. Contact Us",
      body: `If you have any questions or concerns about this Privacy Policy, please contact us at ${"{contactEmail}"}.`,
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

function interpolate(text: string, vars: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

function PrivacyPolicy() {
  const vars = {
    organizationName: organizationName,
    contactEmail: PRIVACY_CONTENT.contactEmail,
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

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {PRIVACY_CONTENT.lastUpdated}
        </p>

        <div className="space-y-8">
          {PRIVACY_CONTENT.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <p className="leading-relaxed whitespace-pre-line">
                {interpolate(section.body, vars)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t text-sm text-muted-foreground text-center">
          <p>
            Also read our{" "}
            <Link to="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
