import { useState, useEffect } from "react";
import { Shield, Github, Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

export function Footer() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};
  const socials = portfolioData?.socials || {};

  const LINKS = [
    socials.github && {
      label: "GITHUB",
      href: socials.github,
      icon: Github,
    },
    socials.linkedin && {
      label: "LINKEDIN",
      href: socials.linkedin,
      icon: Linkedin,
    },
    socials.email && {
      label: "EMAIL",
      href: `mailto:${socials.email}`,
      icon: Mail,
    },
  ].filter(Boolean);

  const year = new Date().getFullYear();
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursor((p) => !p), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <footer className="relative py-16 overflow-hidden border-t border-[#1A1A1A] bg-[#050505]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(255,43,43,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF2B2B] to-transparent opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-14">
          {/* Brand */}
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 border border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-center transition-all duration-500 group-hover:border-[#FF2B2B]/40 group-hover:bg-[#FF2B2B]/5">
              <Shield size={16} className="text-[#555] group-hover:text-[#FF2B2B] transition-colors duration-500" />
            </div>
            <div>
              <h3 className="text-[#F5F5F5] leading-none mb-1.5 tracking-[0.05em]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.4rem" }}>
                {personal.name?.toUpperCase() || "PORTFOLIO"}
              </h3>
              <p className="text-[#888] tracking-[0.15em] font-mono text-[0.6rem]">{personal.title || "RED TEAM OPERATIONS CENTER"}</p>
            </div>
          </div>

          {/* Terminal prompt */}
          <div className="flex items-center gap-3 px-5 py-2.5 border border-[#1A1A1A] bg-[#0A0A0A]">
            <Shield size={12} className="text-[#FF2B2B]" />
            <div className="font-mono text-[0.65rem] tracking-[0.05em]">
              <span className="text-[#FF2B2B]">operator</span>
              <span className="text-[#555]">@</span>
              <span className="text-[#888]">rtoc</span>
              <span className="text-[#555] mr-2">:~$</span>
              <span className="text-[#F5F5F5]">exit</span>
              <span className="ml-1 text-[#FF2B2B]" style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}>█</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            {LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[#777] hover:text-[#F5F5F5] transition-colors duration-300"
              >
                <Icon size={14} className="group-hover:text-[#FF2B2B] group-hover:-translate-y-0.5 transition-all duration-300" />
                <span className="tracking-[0.15em] font-mono text-[0.65rem]">{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-[#1A1A1A] bg-[#0A0A0A]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" style={{ boxShadow: "0 0 8px #4ADE80" }} />
            <span className="text-[#4ADE80] tracking-[0.15em] font-mono text-[0.55rem]">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-right">
            <span className="text-[#555] tracking-[0.1em] font-mono text-[0.55rem]">
              © {year} {personal.name?.toUpperCase() || "PORTFOLIO"}. ALL RIGHTS RESERVED.
            </span>
            <span className="text-[#333] tracking-[0.08em] font-mono text-[0.55rem]">
              AUTHORIZED SECURITY TESTING ONLY.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
