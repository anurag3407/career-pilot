import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, Twitter, User } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Reusable ASCII box border ──────────────────────────────────── */
function AsciiBox({ label, children, className = '' }) {
  return (
    <div className={`font-mono ${className}`}>
      {/* top border */}
      <div className="flex items-center text-green-700 text-xs mb-0">
        <span>┌─</span>
        {label && (
          <>
            <span className="text-green-500 px-1">[ {label} ]</span>
            <span className="flex-1 border-t border-dashed border-green-900/50 mx-1" />
          </>
        )}
        <span>─┐</span>
      </div>
      {/* body */}
      <div className="border-l border-r border-green-900/50 px-4 py-3">{children}</div>
      {/* bottom border */}
      <div className="flex items-center text-green-700 text-xs">
        <span>└</span>
        <span className="flex-1 border-t border-dashed border-green-900/50 mx-1" />
        <span>┘</span>
      </div>
    </div>
  );
}

function TermLine({ prefix, value, prefixColor = 'text-green-500', valueColor = 'text-white' }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-mono leading-relaxed">
      <span className={`${prefixColor} select-none`}>{prefix}</span>
      <span className={valueColor}>{value}</span>
    </div>
  );
}

export default function About() {
  const data = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
  };

  return (
    <section
      id="about"
      ref={ref}
      className="bg-black py-20 px-4 border-t border-green-900/30"
      aria-label="About"
    >
      {/* scanlines subtle overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,65,0.008) 3px,rgba(0,255,65,0.008) 4px)' }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Section header command */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={0}
          className="font-mono"
        >
          <div className="text-green-500 text-sm flex items-center gap-2">
            <span className="text-green-700">user@portfolio:~$</span>
            <span className="text-white"> cat about.txt</span>
          </div>
          <div className="text-green-700 text-xs mt-1">
            {'# ── about.txt ─────────────────────────────────────────────'}
          </div>
        </motion.div>

        {/* Bio block */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={1}
        >
          <AsciiBox label="bio">
            <p className="text-green-300/80 text-xs leading-relaxed whitespace-pre-wrap">
              {data.personal.bio}
            </p>
          </AsciiBox>
        </motion.div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Identity */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={2}
          >
            <AsciiBox label="identity.json">
              <div className="space-y-2">
                <TermLine prefix="  &quot;name&quot;:" value={`"${data.personal.name}"`} valueColor="text-amber-400" />
                <TermLine prefix="  &quot;title&quot;:" value={`"${data.personal.title}"`} valueColor="text-cyan-300" />
                <TermLine
                  prefix="  &quot;location&quot;:"
                  value={`"${data.personal.location || 'Remote'}"`}
                  valueColor="text-green-300"
                />
                <TermLine
                  prefix="  &quot;status&quot;:"
                  value={'"open_to_opportunities"'}
                  valueColor="text-green-400"
                />
                {data.personal.tagline && (
                  <TermLine prefix="  &quot;tagline&quot;:" value={`"${data.personal.tagline}"`} valueColor="text-purple-400" />
                )}
              </div>
            </AsciiBox>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={3}
          >
            <AsciiBox label="contact.sh">
              <div className="space-y-2">
                {[
                  { icon: Mail, label: '--email', value: data.socials.email, href: `mailto:${data.socials.email}`, color: 'text-amber-400' },
                  { icon: Github, label: '--github', value: 'github.com', href: data.socials.github, color: 'text-white' },
                  { icon: Linkedin, label: '--linkedin', value: 'linkedin.com', href: data.socials.linkedin, color: 'text-cyan-400' },
                  { icon: Twitter, label: '--twitter', value: 'twitter.com', href: data.socials.twitter, color: 'text-sky-400' },
                ].map(({ icon: Icon, label, value, href, color }) => (
                  href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-mono group hover:bg-green-900/10 transition-colors rounded px-1 py-0.5"
                    >
                      <Icon size={12} className="text-green-700 group-hover:text-green-400 transition-colors flex-shrink-0" />
                      <span className="text-green-600">connect</span>
                      <span className="text-green-400">{label}</span>
                      <span className={`${color} underline underline-offset-2 truncate`}>{value}</span>
                    </a>
                  ) : null
                ))}
              </div>
            </AsciiBox>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={4}
          className="font-mono"
        >
          <div className="text-green-700 text-xs mb-2">
            {'# ── stats ──────────────────────────────────────────────────'}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'YEARS_EXPERIENCE', value: `${data.stats.yearsExperience}+`, color: 'text-green-400' },
              { label: 'PROJECTS_SHIPPED', value: String(data.stats.projectsCompleted), color: 'text-cyan-400' },
              { label: 'HAPPY_CLIENTS', value: String(data.stats.happyClients), color: 'text-amber-400' },
            ].map(stat => (
              <div
                key={stat.label}
                className="border border-green-900/50 bg-green-950/10 p-4 text-center hover:border-green-700/60 transition-colors"
              >
                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-green-800 text-[10px] tracking-widest mt-1 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing prompt */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={5}
          className="font-mono text-xs text-green-900"
        >
          {'# ── EOF ────────────────────────────────────────────────────'}
        </motion.div>
      </div>
    </section>
  );
}
