import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

export default function TermsOfService() {
  const lastUpdated = "May 2026";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last Updated: <span className="font-medium text-foreground">{lastUpdated}</span>
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the CareerPilot website, mobile applications, and related services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms and conditions, you may not use the Services. We reserve the right to modify these Terms at any time. Your continued use of the Services following the posting of updated Terms constitutes your acceptance of the changes.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We grant you a limited, non-exclusive, non-transferable license to use the Services for your personal, non-commercial job search and career development purposes. This license does not include the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Modify or reproduce the Services</li>
              <li>Distribute or transmit the Services</li>
              <li>Perform any public or commercial use of the Services</li>
              <li>Attempt to reverse engineer, decompile, or discover any source code or algorithms</li>
              <li>Remove or obscure any copyright, trademark, or proprietary notices</li>
              <li>Transfer the Services to another person or "mirror" the Services</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              As a user of CareerPilot, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide accurate, complete, and current information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in any conduct that restricts or inhibits anyone's use of the Services</li>
              <li>Not post or transmit obscene, profane, abusive, defamatory, or threatening content</li>
              <li>Not attempt to gain unauthorized access to the Services or related systems</li>
              <li>Not collect or track personal information of others without consent</li>
              <li>Not use the Services for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          {/* Content Ownership */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">4. Content & Intellectual Property Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Our Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All content on CareerPilot, including text, graphics, logos, templates, images, software, and other materials ("Our Content"), is owned or licensed by CareerPilot and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or transmit Our Content without our prior written permission.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain all rights to any content you upload or create on CareerPilot, including resumes, profiles, and messages ("Your Content"). By uploading Your Content, you grant CareerPilot a worldwide, royalty-free, non-exclusive license to use, reproduce, modify, and distribute Your Content solely for providing and improving the Services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Third-Party Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  CareerPilot may display job listings and other content from third-party providers. Such content is owned by the respective third parties and is subject to their terms and conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">5. Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Harassing, threatening, or abusing other users</li>
              <li>Posting spam, unsolicited advertisements, or promotional content</li>
              <li>Attempting to manipulate job searches or application processes</li>
              <li>Uploading files containing malware or malicious code</li>
              <li>Scraping, crawling, or accessing data in an unauthorized manner</li>
              <li>Creating multiple accounts for fraudulent purposes</li>
              <li>Impersonating another person or misrepresenting your identity</li>
              <li>Offering or seeking illegal goods or services</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Account Termination */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">6. Account Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for violating these Terms or engaging in prohibited activities. Upon termination, your right to access the Services will immediately cease. We may delete your account and associated data in accordance with our retention policies.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">7. Disclaimers</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">AS IS BASIS:</span> CareerPilot and all content, materials, and Services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">NO WARRANTY:</span> We do not warrant that the Services will be uninterrupted, error-free, or meet your specific requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">JOB DATA:</span> While we strive to provide accurate job listings, we do not guarantee the accuracy, completeness, or timeliness of job data from third-party providers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">AI FEATURES:</span> AI-powered features such as resume enhancement and job recommendations are tools to assist you. We do not guarantee that AI suggestions will result in job interviews or offers.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              TO THE FULLEST EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>CareerPilot shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the fees paid by you in the past 12 months</li>
              <li>This limitation applies even if we have been advised of the possibility of such damages</li>
              <li>Some jurisdictions do not allow limitation of liability, so this may not apply to you</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless CareerPilot and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Services, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">10. Third-Party Services & Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              CareerPilot may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of these third-party services. Your use of third-party services is governed by their respective terms and policies. We recommend reviewing their terms before using their services.
            </p>
          </section>

          {/* Payment & Subscription */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">11. Payment & Subscription Terms</h2>
            <div className="space-y-3 text-muted-foreground">
              <p><span className="font-medium text-foreground">Pricing:</span> Subscription fees are as described on our pricing page and are subject to change with 30 days notice.</p>
              <p><span className="font-medium text-foreground">Billing:</span> We use Razorpay for secure payment processing. Billing occurs automatically on your subscription renewal date.</p>
              <p><span className="font-medium text-foreground">Cancellation:</span> You can cancel your subscription at any time through your account settings. Cancellation is effective at the end of your current billing cycle.</p>
              <p><span className="font-medium text-foreground">Refunds:</span> Refunds are issued within 5-7 business days to your original payment method, subject to our refund policy.</p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">12. Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Any disputes arising from or relating to these Terms or the Services shall be governed by and construed in accordance with the laws of the jurisdiction where CareerPilot is incorporated, without regard to its conflict of law principles.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You agree to attempt to resolve any dispute informally by contacting us at support@careerpilot.com before pursuing formal legal action. If informal resolution is unsuccessful, disputes shall be resolved through binding arbitration or litigation in the appropriate courts.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">13. Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">14. Entire Agreement</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and CareerPilot regarding the Services and supersede all prior agreements and understandings.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">15. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-foreground font-medium">CareerPilot Legal Team</p>
              <p className="text-muted-foreground">Email: legal@careerpilot.com</p>
              <p className="text-muted-foreground">Website: careerpilot.com</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
