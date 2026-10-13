import { useState, useEffect, useMemo } from "react";
import { Menu, X, Shield } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

export function NavBar() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};
  const skills = portfolioData?.skills || [];
  const experience = portfolioData?.experience || [];
  const projects = portfolioData?.projects || [];
  const testimonials = portfolioData?.testimonials || [];
  const socials = portfolioData?.socials || {};

  const NAV_LINKS = useMemo(() => {
    const links = [];
    if (personal && Object.keys(personal).length) links.push({ label: "PROFILE", href: "#profile" });
    if (Array.isArray(skills) && skills.length) links.push({ label: "ARSENAL", href: "#arsenal" });
    if (Array.isArray(experience) && experience.length) links.push({ label: "TIMELINE", href: "#timeline" });
    if (Array.isArray(projects) && projects.length) links.push({ label: "OPERATIONS", href: "#operations" });
    if (Array.isArray(testimonials) && testimonials.length) links.push({ label: "TESTIMONIALS", href: "#testimonials" });
    // Contact always available as fallback if socials or personal data exists
    if ((socials && Object.keys(socials).length) || (personal && Object.keys(personal).length)) links.push({ label: "CONTACT", href: "#contact" });

    if (links.length === 0) {
      return [
        { label: "PROFILE", href: "#profile" },
        { label: "ARSENAL", href: "#arsenal" },
        { label: "TIMELINE", href: "#timeline" },
        { label: "OPERATIONS", href: "#operations" },
        { label: "TESTIMONIALS", href: "#testimonials" },
        { label: "CONTACT", href: "#contact" },
      ];
    }

    return links;
  }, [personal, skills, experience, projects, testimonials, socials]);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["hero", ...NAV_LINKS.map((l) => l.href.slice(1))];
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [NAV_LINKS]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,5,5,0.92)" : "linear-gradient(180deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0) 100%)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "blur(4px)",
        padding: scrolled ? "0.75rem 0" : "1.25rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} className="flex items-center gap-3 group">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2B2B] opacity-40 group-hover:opacity-70 transition-opacity" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2B2B]" style={{ boxShadow: "0 0 8px rgba(255,43,43,0.8)" }} />
          </div>
          <span className="text-[#F5F5F5] tracking-[0.3em] font-mono text-[0.7rem] font-bold group-hover:text-[#FF2B2B] transition-colors">RTOC</span>
        </a>

        {/* Desktop nav — pill */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <div
            className="flex items-center p-1.5 border"
            style={{ background: "rgba(11,11,11,0.75)", borderColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-5 py-2 text-[0.6rem] tracking-[0.2em] transition-all duration-300 ${
                    isActive ? "text-[#FF2B2B] font-bold" : "text-[#888] hover:text-[#D4D4D4]"
                  }`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 border border-[#FF2B2B]/40 z-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,43,43,0.12) 0%, rgba(255,43,43,0.02) 100%)",
                        boxShadow: "0 0 20px rgba(255,43,43,0.15) inset",
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          className="hidden md:flex relative group items-center gap-2 px-6 py-2.5 border border-[#1A1A1A] bg-[#050505] hover:border-[#FF2B2B]/40 hover:shadow-[0_0_15px_rgba(255,43,43,0.15)] transition-all duration-300"
        >
          <div className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t-2 border-l-2 border-[#FF2B2B] opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b-2 border-r-2 border-[#FF2B2B] opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <Shield size={12} className="text-[#555] group-hover:text-[#FF2B2B] transition-colors" />
          <span className="text-[#9A9A9A] group-hover:text-[#F5F5F5] tracking-[0.2em] transition-colors font-mono text-[0.65rem] font-bold">
            HIRE_ME
          </span>
          <span className="text-[#FF2B2B] opacity-0 group-hover:opacity-100 animate-pulse font-bold">_</span>
        </a>

        <button type="button" className="lg:hidden text-[#9A9A9A] hover:text-[#FF2B2B] transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden absolute top-full left-0 w-full border-t border-[#1A1A1A] px-6 py-6 flex flex-col gap-5 shadow-2xl"
          style={{ background: "rgba(5,5,5,0.97)", backdropFilter: "blur(16px)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`tracking-[0.2em] transition-colors ${activeSection === link.href.slice(1) ? "text-[#FF2B2B]" : "text-[#9A9A9A] hover:text-[#F5F5F5]"}`}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "0.8rem" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
