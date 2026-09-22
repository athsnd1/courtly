import { Link } from "react-router-dom";
import { GiScales } from "react-icons/gi";
import { useEffect } from "react";

export default function TermsPage() {
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
            <h1 className="text-3xl font-sora font-semibold text-navy mb-2">Terms of Service</h1>
            <p className="text-sm font-sora text-sec-text mb-8">Last updated: September 2026</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Acceptance of Terms</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  By accessing or using Courtly, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. These terms constitute a legally binding agreement between you and [LEGAL ENTITY NAME].
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Using Courtly</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  Courtly is a software platform designed to help lawyers and law firms manage their legal work. Our service allows you to:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li>Manage case information and client details</li>
                  <li>Schedule and track court hearings</li>
                  <li>Create and manage tasks and deadlines</li>
                  <li>Store and organize documents</li>
                  <li>Manage organization members and permissions</li>
                </ul>
                <p className="text-sm font-sora text-sec-text leading-relaxed mt-3">
                  <strong>Important:</strong> Courtly does not provide legal advice or legal representation. We are a software service, not a law firm. Always consult with qualified legal professionals for legal advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Accounts and Organizations</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  To use Courtly, you must create an account and agree to maintain the security of your account credentials. You are responsible for all activities that occur under your account.
                </p>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  Courtly uses Clerk for authentication and organization management. You may be invited to join existing organizations or create your own. Organization administrators have control over member access and permissions within their organization.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">User Responsibilities</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  As a Courtly user, you agree to:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your account credentials secure</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Use the service only for its intended purposes</li>
                  <li>Respect the rights and privacy of others</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">User Content</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  You retain ownership of the content you upload to Courtly, including case information, documents, notes, and other materials. By using our service, you grant us the license to store, process, and display your content solely to provide the service.
                </p>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  You represent and warrant that you have the right to upload all content to Courtly and that such content does not violate any laws or third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Acceptable Use</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed mb-3">
                  You may not use Courtly to:
                </p>
                <ul className="list-disc list-inside text-sm font-sora text-sec-text leading-relaxed space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Upload malicious content or software</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the operation of the service</li>
                  <li>Use the service for fraudulent or deceptive purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Intellectual Property</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  Courtly, including its design, features, and branding, is owned by [LEGAL ENTITY NAME] and protected by intellectual property laws. You may not copy, modify, or distribute our proprietary materials without permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Service Availability</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We strive to maintain high service availability but do not guarantee uninterrupted access. Courtly is hosted on Vercel (frontend) and Render (backend), and we may experience downtime for maintenance, updates, or technical issues beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Account Suspension/Termination</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in harmful activity. We may also discontinue the service with reasonable notice to users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Disclaimer</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  Courtly is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be error-free, secure, or uninterrupted. Courtly is not responsible for any losses resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Limitation of Liability</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  To the maximum extent permitted by law, [LEGAL ENTITY NAME] shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of Courtly, including loss of data, revenue, or business opportunities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Changes to Terms</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  We may modify these Terms of Service at any time. We will notify users of significant changes by posting the updated terms on our website. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-sora font-semibold text-navy mb-3">Contact</h2>
                <p className="text-sm font-sora text-sec-text leading-relaxed">
                  If you have questions about these Terms of Service, please contact us at:
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
