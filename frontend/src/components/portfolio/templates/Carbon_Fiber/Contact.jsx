import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Linkedin, Github, Twitter } from 'lucide-react';

function HexBolt({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" className={`text-slate-600/70 ${className}`} fill="none">
      <polygon points="9,1 16,4.5 16,13.5 9,17 2,13.5 2,4.5" stroke="currentColor" strokeWidth="1" fill="rgba(148,163,184,0.04)" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export default function Contact({ data }) {
  const socials = data?.socials || {};

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative mt-16 rounded-xl border border-slate-600/50 bg-[#0c0c0c]/98 p-8 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
      <HexBolt className="absolute left-4 top-4" />
      <HexBolt className="absolute right-4 top-4" />
      <HexBolt className="absolute bottom-4 left-4" />
      <HexBolt className="absolute bottom-4 right-4" />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Contact</p>
          <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-gray-100 via-slate-200 to-gray-100 bg-clip-text text-transparent sm:text-4xl">
            Let's build the next high-performance experience.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-500 leading-7">
            Ready to collaborate on a new product, performance upgrade, or technical design system? Reach out and let's talk through the next sprint.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              {
                href: socials.email ? `mailto:${socials.email}` : null,
                icon: Mail,
                label: 'Email',
                sub: socials.email,
              },
              {
                href: socials.linkedin,
                icon: Linkedin,
                label: 'LinkedIn',
                sub: 'Connect professionally',
              },
              {
                href: socials.github,
                icon: Github,
                label: 'GitHub',
                sub: 'View source and projects',
              },
              {
                href: socials.twitter,
                icon: Twitter,
                label: 'Twitter',
                sub: 'Follow updates',
              },
            ]
              .filter((item) => item.href)
              .map(({ href, icon: Icon, label, sub }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group relative rounded-sm border border-slate-700/50 bg-[#0a0a0a] px-5 py-4 transition hover:border-slate-400/50 hover:bg-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/50 via-slate-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
                    <span className="text-sm font-bold bg-gradient-to-r from-gray-200 to-slate-100 bg-clip-text text-transparent">
                      {label}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 group-hover:text-slate-500 transition-colors">
                    {sub}
                  </p>
                </a>
              ))}
          </div>
        </div>

        <div className="relative rounded-sm border border-slate-600/50 bg-[#0a0a0a] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/50 via-slate-500/20 to-transparent" />

          <div className="inline-flex items-center gap-2 rounded-none border border-slate-700/50 bg-[#111] px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Quick Note
          </div>

          <h3 className="mt-4 text-xl font-bold bg-gradient-to-r from-gray-100 to-slate-200 bg-clip-text text-transparent tracking-tight">
            Send a fast email
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            I'm available for freelance contracts, full-time work, and product collaborations. Expect a quick response from a teammate who values clarity and quality.
          </p>

          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300/70 bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-900 transition hover:from-gray-200 hover:via-slate-100 hover:to-gray-200 hover:shadow-[0_6px_20px_rgba(192,192,192,0.4)] shadow-[0_2px_12px_rgba(192,192,192,0.2),inset_0_1px_0_rgba(255,255,255,0.8)]"
            >
              <Send className="h-3.5 w-3.5" />
              Email me
            </a>
          )}
        </div>
      </div>
    </motion.section>
  );
}
