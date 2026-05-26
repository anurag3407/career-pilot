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

          {/* Additional Resources */}
          <section className="bg-muted/50 border border-border rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium mb-3">Learn More</h3>
            <p className="text-muted-foreground text-sm mb-3">
              For more information about your privacy rights and how we handle data:
            </p>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Read our Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Read our Terms of Service
                </Link>
              </li>

              <li>
                <a
                  href="https://allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Learn more about cookies (allaboutcookies.org)
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