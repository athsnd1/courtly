import { Link } from "react-router-dom";
import { GiScales } from "react-icons/gi";
import { useEffect } from "react";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-bgcol">
      {/* Navigation */}
      <nav className="w-full h-[60px] bg-cards border-b-1 border-border flex items-center justify-between px-6 fixed top-0 left-0 z-50">
        <Link to="/" className="flex items-center gap-1">
          <GiScales className="text-xl text-logo"/>
          <span className="text-lg font-sora text-navy pt-1">Courtly</span>
        </Link>
        <Link 
          to="/sign-in" 
          className="bg-navy text-cards px-4 py-2 rounded-md text-sm font-sora hover:bg-sec-navy hover:opacity-80 transition-all"
        >
          Sign In
        </Link>
      </nav>

      {/* Content */}
      <div className="pt-[80px] min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cards border-1 border-border rounded-lg p-8 mt-8">
            <h1 className="text-3xl font-sora font-semibold text-navy mb-2">Privacy Policy</h1>
            <p className="text-sm font-sora text-sec-text mb-8">Last updated: September 2026</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Introduction</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  Courtly is a legal case management platform designed for lawyers and law firms. This Privacy Policy explains how we collect, use, and protect your information when you use our service. Courtly is developed in Nigeria and is subject to applicable Nigerian data protection laws, including the Nigeria Data Protection Act 2023.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Information We Collect</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  To provide our services, we collect the following types of information:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li><strong>Account Information:</strong> Your name, email address, and other details you provide when creating your account</li>
                  <li><strong>Organization Information:</strong> Details about your law firm or legal organization</li>
                  <li><strong>Case Information:</strong> Case details, client information, case status, and related metadata</li>
                  <li><strong>Hearings:</strong> Court hearing schedules, dates, and related information</li>
                  <li><strong>Tasks:</strong> Task descriptions, deadlines, assignments, and completion status</li>
                  <li><strong>Notes:</strong> Case notes, memos, and other text-based content you create</li>
                  <li><strong>Documents:</strong> Legal documents, files, and attachments you upload to the platform</li>
                  <li><strong>Technical Information:</strong> IP address, device information, browser type, and usage data necessary to operate and secure the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">How We Use Information</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li>Provide, maintain, and improve the Courtly service</li>
                  <li>Process and manage your cases, hearings, tasks, and documents</li>
                  <li>Authenticate users and secure your account</li>
                  <li>Communicate with you about service updates and support</li>
                  <li>Analyze usage patterns to improve our platform</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">How We Share Information</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
                  <li><strong>Service Providers:</strong> With third-party services that help us operate Courtly, including Clerk for authentication, Vercel for hosting, Render for backend services, and PostgreSQL for database management</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Data Security</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We implement reasonable security measures to protect your information, including encryption, secure authentication, and regular security assessments. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Data Retention</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information unless we are required to retain it for legal or legitimate business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">User Rights</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  Under applicable data protection laws, you have the right to:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Data portability, where applicable</li>
                </ul>
                <p className="text-sm font-sora text-sec-text leading-relaxed mt-3">
                  To exercise these rights, please contact us at [CONTACT EMAIL].
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Cookies</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We use cookies and similar technologies to improve your experience, analyze usage, and for authentication purposes. You can manage your cookie preferences through your browser settings, though this may affect functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Third-Party Services</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  Courtly integrates with third-party services to provide our functionality:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li><strong>Clerk:</strong> Handles user authentication and organization management</li>
                  <li><strong>Vercel:</strong> Hosts our frontend application</li>
                  <li><strong>Render:</strong> Hosts our backend services</li>
                  <li><strong>PostgreSQL:</strong> Stores our database information</li>
                </ul>
                <p className="text-sm font-sora text-sec-text leading-relaxed mt-3">
                  These services have their own privacy policies and data handling practices. We encourage you to review their policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Changes to This Policy</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Contact</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-bgcol rounded-md">
                  <p className="text-sm font-sora text-navy"><strong>Email:</strong> [CONTACT EMAIL]</p>
                  <p className="text-sm font-sora text-navy"><strong>Address:</strong> [BUSINESS ADDRESS]</p>
                  <p className="text-sm font-sora text-navy"><strong>Website:</strong> [WEBSITE]</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-cards border-t-1 border-border py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <GiScales className="text-xl text-logo"/>
            <span className="text-lg font-sora text-navy pt-1">Courtly</span>
          </div>
          <p className="text-sm font-sora text-sec-text">
            © 2024 Courtly. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm font-sora text-sec-text hover:text-navy transition-all">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm font-sora text-sec-text hover:text-navy transition-all">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
