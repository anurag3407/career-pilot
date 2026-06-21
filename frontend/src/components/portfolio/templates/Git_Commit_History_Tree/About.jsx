import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Code line component ─────────────────────────────────────── */
function CodeLine({ lineNo, content, color = 'text-white', indent = 0 }) {
  return (
    <div className="flex gap-4 font-mono text-sm leading-6 hover:bg-[#1C2128] group transition-colors">
      <span className="select-none text-[#484F58] w-8 text-right shrink-0 group-hover:text-[#8B949E] transition-colors">
        {lineNo}
      </span>
      <span className={color} style={{ paddingLeft: indent * 16 }}>
        {content}
      </span>
    </div>
  );
}

/* ─── About Section ───────────────────────────────────────────── */
export default function About() {
  const { portfolioData } = usePortfolio();
  const { personal, socials } = portfolioData;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const SOCIAL_ITEMS = [
    { key: 'github',   icon: Github,   label: 'github',   href: socials.github,           color: '#8B949E' },
    { key: 'linkedin', icon: Linkedin, label: 'linkedin', href: socials.linkedin,          color: '#58A6FF' },
    { key: 'twitter',  icon: Twitter,  label: 'twitter',  href: socials.twitter,           color: '#58A6FF' },
    { key: 'email',    icon: Mail,     label: 'email',    href: `mailto:${socials.email}`, color: '#3FB950' },
  ].filter(s => s.href);

  // Build code lines dynamically from data
  const profileLines = [
    { content: '# git show profile.md', color: 'text-[#8B949E]' },
    { content: '' },
    { content: `commit ${Math.abs(personal.name?.charCodeAt(0) ?? 65).toString(16)}a3f9b2 (HEAD → main)`, color: 'text-[#F0883E]' },
    { content: `Author: ${personal.name} <${socials.email || 'dev@example.com'}>`, color: 'text-white' },
    { content: `Date:   ${new Date().toDateString()}`, color: 'text-white' },
    { content: '' },
    { content: `    docs: add profile.md`, color: 'text-white', indent: 1 },
    { content: '' },
    { content: `diff --git a/profile.md b/profile.md`, color: 'text-[#8B949E]' },
    { content: `+++ b/profile.md`, color: 'text-[#3FB950]' },
    { content: '' },
    { content: `+ ## ${personal.name || 'Developer'}`, color: 'text-[#3FB950]' },
    { content: '' },
    ...(personal.bio || '').split('. ').filter(Boolean).map(sentence => ({
      content: `+ ${sentence.trim()}.`,
      color: 'text-[#3FB950]',
    })),
    { content: '' },
    ...(personal.location ? [{ content: `+ 📍 Location  : ${personal.location}`, color: 'text-[#3FB950]' }] : []),
    ...(socials.email    ? [{ content: `+ ✉️  Email     : ${socials.email}`,      color: 'text-[#3FB950]' }] : []),
    ...(socials.github   ? [{ content: `+ 🐙 GitHub    : ${socials.github}`,      color: 'text-[#3FB950]' }] : []),
    ...(socials.linkedin ? [{ content: `+ 💼 LinkedIn  : ${socials.linkedin}`,    color: 'text-[#3FB950]' }] : []),
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="bg-[#0D1117] py-24 px-4 border-t border-[#30363D]"
      aria-label="About"
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <FileText size={20} className="text-[#58A6FF]" />
          <h2 className="text-white font-semibold text-xl">
            <span className="text-[#8B949E] font-mono">$ </span>git show profile.md
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code diff card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden"
          >
            {/* Editor toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0D1117] border-b border-[#30363D]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-xs text-[#8B949E]">profile.md — git diff</span>
              <span className="ml-auto font-mono text-xs text-[#3FB950]">+{profileLines.filter(l => l.color === 'text-[#3FB950]').length} additions</span>
            </div>

            {/* Code lines */}
            <div className="p-3 overflow-x-auto">
              {profileLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.025, duration: 0.3 }}
                >
                  {line.content === '' ? (
                    <div className="flex gap-4 h-5">
                      <span className="text-[#484F58] w-8 text-right shrink-0 font-mono text-sm">{i + 1}</span>
                    </div>
                  ) : (
                    <CodeLine
                      lineNo={i + 1}
                      content={line.content}
                      color={line.color}
                      indent={line.indent || 0}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            {/* Avatar card */}
            {personal.avatar && (
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 flex flex-col items-center gap-3">
                <img
                  src={personal.avatar}
                  alt={personal.name || "Profile Avatar"}
                  className="w-24 h-24 rounded-full border-2 border-[#3FB950]/40 object-cover"
                  loading="lazy"
                />
                <div className="text-center">
                  <div className="text-white font-semibold">{personal.name}</div>
                  <div className="text-[#8B949E] text-sm font-mono">
                    {personal.name?.toLowerCase().replace(/\s+/g, '-')}
                  </div>
                </div>
                {personal.tagline && (
                  <p className="text-[#8B949E] text-xs text-center leading-relaxed border-t border-[#30363D] pt-3 w-full">
                    {personal.tagline}
                  </p>
                )}
              </div>
            )}

            {/* Location card */}
            {personal.location && (
              <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#8B949E] text-sm">
                  <MapPin size={14} className="text-[#F0883E]" />
                  <span>{personal.location}</span>
                </div>
              </div>
            )}

            {/* Socials */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-3">
              <div className="text-[#8B949E] text-xs font-mono mb-3 border-b border-[#30363D] pb-2">
                # remote connections
              </div>
              {SOCIAL_ITEMS.map(({ key, icon: Icon, label, href, color }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  id={`about-social-${key}`}
                  aria-label={`Visit ${label}`}
                  className="flex items-center gap-3 text-sm text-[#8B949E] hover:text-white transition-colors group"
                >
                  <Icon size={14} style={{ color }} />
                  <span className="font-mono text-xs flex-1 truncate" style={{ color }}>{href}</span>
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
