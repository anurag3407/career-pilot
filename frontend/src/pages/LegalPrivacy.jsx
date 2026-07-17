import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

export default function LegalPrivacy() {
  const lastUpdated = "May 2026";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-32 md:pb-16">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: <span className="font-medium text-foreground">{lastUpdated}</span>
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              CareerPilot ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process personal information in connection with our website, mobile applications, and related services (collectively, the "Services").
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><span className="font-medium text-foreground">Account Registration:</span> Name, email, password, phone number, location, and job preferences.</li>
                  <li><span className="font-medium text-foreground">Resume Data:</span> Resume content, work history, education, skills, and certifications.</li>
                  <li><span className="font-medium text-foreground">Profile Information:</span> Professional photo, bio, LinkedIn profile, GitHub profile, and portfolio links.</li>
                  <li><span className="font-medium text-foreground">Communications:</span> Messages, support requests, feedback, and inquiries.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Information Automatically Collected</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><span className="font-medium text-foreground">Device Information:</span> IP address, browser type, operating system, and device identifiers.</li>
                  <li><span className="font-medium text-foreground">Usage Data:</span> Pages visited, time spent on pages, links clicked, and search queries.</li>
                  <li><span className="font-medium text-foreground">Cookies and Tracking:</span> We use cookies, web beacons, and similar technologies for analytics and personalization.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Third-Party Data</h3>
                <p className="text-muted-foreground">
                  We may receive information from third-party services including LinkedIn, GitHub, Firebase authentication, and job data providers via RapidAPI.
                </p>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">3. How We Use Your Information</h2>
            <div className="space-y-2 text-muted-foreground list-disc list-inside">
              <p>• Providing and improving our Services</p>
              <p>• Processing job searches and applications</p>
              <p>• Sending job alerts and recommendations</p>
              <p>• Personalizing your experience with AI-powered features</p>
              <p>• Communicating with you about your account and updates</p>
              <p>• Analytics and performance monitoring</p>
              <p>• Detecting fraud and ensuring platform security</p>
              <p>• Complying with legal obligations</p>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">4. Data Protection & Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Encryption of data in transit (HTTPS)</li>
              <li>Secure password hashing with bcryptjs</li>
              <li>Firebase security for authentication</li>
              <li>Regular security audits and updates</li>
              <li>Two-factor authentication (2FA) support</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">5. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell your personal information. However, we may share data with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><span className="font-medium text-foreground">Service Providers:</span> Google Gemini, OpenAI, Groq for AI features; Firebase for authentication</li>
              <li><span className="font-medium text-foreground">Job Data Providers:</span> RapidAPI for job listings</li>
              <li><span className="font-medium text-foreground">Community Features:</span> When you use community features, certain profile information may be visible to other users</li>
              <li><span className="font-medium text-foreground">Legal Requirements:</span> When required by law enforcement or legal process</li>
              <li><span className="font-medium text-foreground">Business Transfers:</span> In case of merger, acquisition, or asset sale</li>
            </ul>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">6. Your Rights & Choices</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><span className="font-medium text-foreground">Access:</span> You can access and download your personal data through your account settings.</p>
              <p><span className="font-medium text-foreground">Correction:</span> You can update or correct your profile information at any time.</p>
              <p><span className="font-medium text-foreground">Deletion:</span> You can request deletion of your account and associated data by contacting support@careerpilot.com</p>
              <p><span className="font-medium text-foreground">Opt-Out:</span> You can opt out of marketing communications by clicking "unsubscribe" in our emails.</p>
              <p><span className="font-medium text-foreground">Cookie Control:</span> Most browsers allow you to refuse cookies or alert you when cookies are being sent.</p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">7. Cookies & Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><span className="font-medium text-foreground">Essential:</span> Maintain session, security, and basic site functionality</li>
              <li><span className="font-medium text-foreground">Analytics:</span> Understand how users interact with our platform</li>
              <li><span className="font-medium text-foreground">Personalization:</span> Deliver customized content and recommendations</li>
              <li><span className="font-medium text-foreground">Marketing:</span> Track campaign effectiveness (can be disabled in preferences)</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              For more details, see our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              CareerPilot is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will promptly delete such information and terminate the child's access to our Services.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">9. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. You can request deletion at any time. Some information may be retained for legal or compliance purposes even after account deletion.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your country. By using our Services, you consent to the transfer of your information to countries outside your country of residence.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our Services following the posting of updates constitutes your acceptance of those updates.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <p className="text-foreground font-medium">CareerPilot Privacy Team</p>
              <p className="text-muted-foreground">Email: privacy@careerpilot.com</p>
              <p className="text-muted-foreground">Website: careerpilot.com</p>
            </div>
          </section>

          {/* Compliance Notice */}
          <section className="bg-muted/50 border border-border rounded-lg p-6 mt-8">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy complies with GDPR, CCPA, and other applicable privacy regulations. If you are a resident of the EU, California, or other regulated jurisdictions, you have specific rights regarding your personal data. Please contact our Privacy Team for more information.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
