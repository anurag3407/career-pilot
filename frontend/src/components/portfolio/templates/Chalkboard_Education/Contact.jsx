import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Github, Linkedin, Mail, Twitter, ChevronRight } from "lucide-react";

export default function Contact() {
  const { portfolioData: data } = usePortfolio();
  const { personal, socials } = data;

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-24 bg-[#0a1930] text-white"
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(125,211,252,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="absolute left-1/2 bottom-0 h-[400px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl z-10 text-center">
        <span className="inline-flex items-center rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-teal-100 shadow-[0_0_20px_rgba(45,212,191,0.15)] mb-8">
          ✦ Office Hours ✦
        </span>
        
        <h2
          className="text-[#F8FFFC] font-bold mb-6"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "clamp(3.5rem, 6vw, 6rem)",
            lineHeight: 0.9,
            textShadow: "0 0 1px rgba(248,255,252,0.5), 0 14px 30px rgba(34, 211, 238, 0.15)",
          }}
        >
          Let's Build Together
        </h2>
        
        <p className="mx-auto max-w-2xl text-slate-300 text-lg leading-relaxed mb-12">
          Whether you want to discuss educational design, collaborate on a new AI integration, or just talk about the future of learning, my inbox is always open.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_18px_44px_rgba(34,211,238,0.25)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_22px_56px_rgba(34,211,238,0.35)]"
            >
              <Mail size={18} />
              <span>Send a Message</span>
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-8 md:p-12 backdrop-blur-md shadow-[0_20px_60px_rgba(6,17,40,0.4)] max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-6">Find me online</p>
          <div className="flex flex-wrap justify-center gap-4">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/5 px-6 py-3 text-sm font-medium text-cyan-50 transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/5 px-6 py-3 text-sm font-medium text-cyan-50 transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/5 px-6 py-3 text-sm font-medium text-cyan-50 transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {personal.name}. Designed for the AI-powered classroom.</p>
        </div>
      </div>
    </section>
  );
}
