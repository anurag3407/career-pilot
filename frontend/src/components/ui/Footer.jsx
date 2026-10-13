import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { FEATURES } from "../../data/featuresConfig";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: FEATURES.map(f => ({ label: f.name, href: `/${f.slug}` })),
    resources: [
      { label: "Community", href: "https://discord.gg/dpDMVywS" },
      { label: "GitHub", href: "https://github.com/jarvis-labs/career-pilot" },
    ],
    company: [
      { label: "About", href: "/about" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  };

  return (


    <footer className="border-t border-border bg-background text-muted-foreground transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/speed.png" alt="" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">careerpilot</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered job search platform for the modern professional.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border border-border rounded-2xl bg-card p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm transition-colors duration-300">
          <div className="md:max-w-md">
            <h4 className="text-lg font-semibold text-foreground">Stay connected</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Join the community for product updates, career tips, and launch news.
            </p>
          </div>
          <a
            href="https://discord.gg/dpDMVywS"
            className="inline-flex items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            Join the community
          </a>
        </div>
        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} careerpilot. All rights reserved.
          </p>

          {/* Socials */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/jarvis-labs/career-pilot"
            aria-label="CareerPilot on GitHub"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-muted-foreground hover:bg-muted transition text-muted-foreground hover:text-foreground duration-200"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

          {/* Right */}
          <p className="text-xs text-muted-foreground">
            Version 1.0.0
          </p>


        </div>
      </div>
    </footer>
  );
}
