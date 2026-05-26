import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/ui/Footer';

export default function CookiePolicy() {
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
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: <span className="font-medium text-foreground">{lastUpdated}</span>
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. Cookies allow websites to recognize your device and store information about your preferences and browsing behavior. CareerPilot uses cookies to enhance your user experience, analyze platform usage, and provide personalized content.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Essential/Strictly Necessary Cookies
                </h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are essential for the website to function properly and cannot be disabled. They enable basic functionality such as:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Maintaining your login session</li>
                  <li>Remembering your authentication state</li>
                  <li>Protecting against CSRF attacks</li>
                  <li>Loading the website correctly</li>
                  <li>Processing form submissions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Analytical/Performance Cookies
                </h3>
                <p className="text-muted-foreground mb-2">
                  These cookies help us understand how users interact with our platform. They collect anonymous information about:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Pages visited and time spent on each page</li>
                  <li>Links clicked and search queries used</li>
                  <li>Device type and browser information</li>
                  <li>Geographic location</li>
                  <li>Traffic sources and referrers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Functional/Preference Cookies
                </h3>
                <p className="text-muted-foreground mb-2">
                  These cookies remember your preferences and settings to provide a more personalized experience:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Dark mode/light mode preference</li>
                  <li>Language preference</li>
                  <li>Sidebar collapse state</li>
                  <li>Notification preferences</li>
                  <li>Previously viewed resumes or job postings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Marketing/Targeting Cookies
                </h3>
                <p className="text-muted-foreground mb-2">
                  These cookies track your behavior to deliver targeted advertising and marketing content (can be disabled):
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Tracking conversion events</li>
                  <li>Building user interest profiles</li>
                  <li>Remarketing on other websites</li>
                  <li>Measuring campaign effectiveness</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Purposes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">3. Specific Cookies & Technologies</h2>
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Session Cookies</h4>
                <p className="text-sm text-muted-foreground">Temporary cookies that expire when you close your browser. Used for maintaining your login session and security.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Persistent Cookies</h4>
                <p className="text-sm text-muted-foreground">Cookies stored on your device for extended periods (up to 2 years). Used for remembering preferences and tracking analytics.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Firebase Analytics</h4>
                <p className="text-sm text-muted-foreground">Google's analytics service that uses cookies to collect anonymous usage data and identify unique users.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Socket.IO Cookies</h4>
                <p className="text-sm text-muted-foreground">Cookies used for real-time communication in our community and messaging features.</p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may use third-party services that set their own cookies:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><span className="font-medium text-foreground">Google Gemini/Analytics:</span> Cookies for API integration and analytics</p>
              <p><span className="font-medium text-foreground">Firebase:</span> Authentication and real-time database cookies</p>
              <p><span className="font-medium text-foreground">RapidAPI:</span> Cookies for job data integration</p>
              <p><span className="font-medium text-foreground">Razorpay:</span> Payment processing cookies</p>
              <p><span className="font-medium text-foreground">Social Media:</span> LinkedIn and GitHub integration cookies</p>
            </div>
            <p className="text-muted-foreground mt-3">
              These third parties have their own privacy and cookie policies. We recommend reviewing them on their respective websites.
            </p>
          </section>

          {/* Cookie Consent */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">5. Cookie Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you first visit CareerPilot, you'll see a cookie consent banner. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
              <li><span className="font-medium text-foreground">Accept All:</span> Allow all cookies including marketing cookies</li>
              <li><span className="font-medium text-foreground">Accept Essential:</span> Only essential cookies required for site functionality</li>
              <li><span className="font-medium text-foreground">Customize:</span> Choose which types of cookies to accept</li>
              <li><span className="font-medium text-foreground">Reject Non-Essential:</span> Decline marketing and analytics cookies</li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">6. How to Manage Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Update Your Preferences</h3>
                <p className="text-muted-foreground">
                  You can update your cookie preferences at any time through Settings → Privacy & Cookies on our platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Browser Settings</h3>
                <p className="text-muted-foreground mb-2">
                  Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-foreground">Chrome:</span> Settings → Privacy and security → Cookies and other site data</li>
                  <li><span className="font-medium text-foreground">Firefox:</span> Preferences → Privacy & Security → Cookies and Site Data</li>
                  <li><span className="font-medium text-foreground">Safari:</span> Preferences → Privacy → Cookies and website data</li>
                  <li><span className="font-medium text-foreground">Edge:</span> Settings → Privacy, search, and services → Clear browsing data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Do Not Track (DNT)</h3>
                <p className="text-muted-foreground">
                  If you enable DNT in your browser settings, we will respect your preference and limit tracking cookies. However, some site functionality may be affected.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Opt-Out Services</h3>
                <p className="text-muted-foreground">
                  You can opt out of marketing cookies through industry opt-out tools like the Network Advertising Initiative (NAI) or Digital Advertising Alliance (DAA).
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Impact */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Disabling cookies may affect your experience on CareerPilot:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><span className="font-medium text-foreground">Essential Cookies:</span> Disabling these will prevent login and core functionality</li>
              <li><span className="font-medium text-foreground">Preference Cookies:</span> You'll lose saved preferences like theme and language</li>
              <li><span className="font-medium text-foreground">Analytics Cookies:</span> We won't be able to improve the platform based on usage patterns</li>
              <li><span className="font-medium text-foreground">Marketing Cookies:</span> You may see less relevant recommendations and ads</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">8. Cookie Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use secure protocols to transmit cookies. Essential cookies contain encrypted information, and all data is transmitted over HTTPS. However, no method of transmission is 100% secure. For more details on how we protect your data, please see our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">9. Cookie Duration</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium text-foreground">Cookie Type</th>
                    <th className="text-left py-2 px-2 font-medium text-foreground">Duration</th>
                    <th className="text-left py-2 px-2 font-medium text-foreground">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-2 px-2">Session Token</td>
                    <td className="py-2 px-2">Until logout</td>
                    <td className="py-2 px-2">Authentication</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-2 px-2">Remember Me</td>
                    <td className="py-2 px-2">30 days</td>
                    <td className="py-2 px-2">Auto-login preference</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-2 px-2">Analytics</td>
                    <td className="py-2 px-2">2 years</td>
                    <td className="py-2 px-2">Usage tracking</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-2 px-2">User Preferences</td>
                    <td className="py-2 px-2">1 year</td>
                    <td className="py-2 px-2">Theme, language settings</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-2 px-2">Marketing</td>
                    <td className="py-2 px-2">90 days</td>
                    <td className="py-2 px-2">Campaign tracking</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">10. Changes to This Cookie Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any significant changes by updating the "Last Updated" date and posting the new policy on our website. Your continued use of CareerPilot following such changes constitutes your acceptance of the updated Cookie Policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you have questions about this Cookie Policy or would like to discuss our cookie practices, please contact us:
            </p>
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-foreground font-medium">CareerPilot Support Team</p>
              <p className="text-muted-foreground">Email: support@careerpilot.com</p>
              <p className="text-muted-foreground">Privacy Email: privacy@careerpilot.com</p>
              <p className="text-muted-foreground">Website: careerpilot.com</p>
            </div>
          </section>

          {/* Additional Resources */}
          <section className="bg-muted/50 border border-border rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium mb-3">Learn More</h3>
            <p className="text-muted-foreground text-sm mb-3">
              For more information about your privacy rights and how we handle data:
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="text-primary hover:underline flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4" /> Read our Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary hover:underline flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4" /> Read our Terms of Service
                </Link>
              </li>
              <li>
                <a href="https://allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4" /> Learn more about cookies (allaboutcookies.org)
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
