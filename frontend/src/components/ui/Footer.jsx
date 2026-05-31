import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, GitGraph, Twitter, Linkedin,Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;
    setStatus("loading");
    try {
      // Simulate API subscription delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Job Search", href: "/jobs" },
      { label: "Resume Builder", href: "/upload" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Support", href: "#" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
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

        {/* Newsletter */}
        <div className="mt-16 border border-border rounded-2xl bg-card p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm transition-colors duration-300">

          {/* Left text */}
          <div className="md:max-w-md">
            <h4 className="text-lg font-semibold text-foreground">
              Stay updated with career tips
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Get weekly job insights, resume tips, and new features.
            </p>
          </div>

          {/* Right input */}
          {status === "success" ? (
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 py-3 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm">
              🎉 Thanks for subscribing! Check your inbox soon.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full md:w-72 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />

              <button 
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-muted-foreground/80 hover:text-white transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

        </div>
        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} careerpilot. All rights reserved.
          </p>

          {/* Center (socials grouped properly) */}
          <div className="flex items-center gap-5">
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-muted-foreground hover:bg-muted transition text-muted-foreground hover:text-foreground duration-200">
              <GitGraph className="w-5 h-5" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-muted-foreground hover:bg-muted transition text-muted-foreground hover:text-foreground duration-200">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-muted-foreground hover:bg-muted transition text-muted-foreground hover:text-foreground duration-200">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-muted-foreground hover:bg-muted transition text-muted-foreground hover:text-foreground duration-200">
              <Instagram className="w-5 h-5" />
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
