import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Github, Linkedin, Twitter, Mail, Award, Sparkles, ArrowRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ── High Fashion palette ──────────────────────────────────────────── */
const F = {
  bg:      '#faf9f7',
  surface: '#f2efe9',
  dark:    '#0a0a0a',
  charcoal:'#1a1a1a',
  muted:   '#6b6b6b',
  subtle:  '#b0b0b0',
  gold:    '#c9a84c',
  goldLight:'#e8c96e',
  cream:   '#f7f3ed',
  border:  '#e0dbd4',
};

/* ── Stat counter ──────────────────────────────────────────────────── */
function StatPill({ value, label, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center">
      <motion.span
        className="text-3xl md:text-4xl font-black tracking-tight"
        style={{ color: accent || F.dark }}>
        {value}
      </motion.span>
      <span className="text-xs uppercase tracking-widest mt-1" style={{ color: F.muted }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ── Marquee strip ─────────────────────────────────────────────────── */
function MarqueeStrip() {
  const tags = ['Creative Technologist', 'Full Stack', 'Open Source', 'Problem Solver',
    'React Expert', 'Node.js', 'Design Systems', 'TypeScript', 'Cloud Architecture'];
  return (
    <div className="overflow-hidden w-full py-3 border-y" style={{ borderColor: F.border }}>
      <motion.div className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
        {[...tags, ...tags].map((tag, i) => (
          <span key={i} className="text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
            style={{ color: i % 3 === 0 ? F.gold : F.muted }}>
            {i % 3 === 0 && <span style={{ color: F.gold }}>✦</span>}
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Social link ───────────────────────────────────────────────────── */
function SocialLink({ icon: Icon, href, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold px-4 py-2.5 transition-all"
      style={{
        color: hovered ? F.bg : F.charcoal,
        background: hovered ? F.charcoal : 'transparent',
        border: `1px solid ${F.charcoal}`,
      }}
      title={label}>
      <Icon size={12} />
      <span>{label}</span>
    </motion.a>
  );
}

/* ── Skill tag ─────────────────────────────────────────────────────── */
function SkillTag({ name, category, index }) {
  const [hovered, setHovered] = useState(false);
  const catColors = { Frontend: F.gold, Backend: '#2d5a8e', DevOps: '#5a3a8e', Design: '#8e3a5a' };
  const c = catColors[category] || F.dark;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider cursor-default select-none transition-all"
      style={{
        color: hovered ? F.bg : c,
        background: hovered ? c : 'transparent',
        border: `1px solid ${c}`,
        letterSpacing: '0.08em',
      }}>
      {name}
    </motion.span>
  );
}

/* ── Award / highlight card ────────────────────────────────────────── */
function HighlightCard({ icon: Icon, title, body, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="p-5 flex gap-4"
      style={{ background: F.cream, border: `1px solid ${F.border}` }}>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
        style={{ background: F.dark, color: F.gold }}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: F.charcoal }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: F.muted }}>{body}</p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ABOUT SECTION
═══════════════════════════════════════════════════════════════════════ */
export default function About() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const skillsByCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s); return acc;
  }, {});

  return (
    <section ref={sectionRef} className="w-full" style={{ background: F.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Section label ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: `1px solid ${F.border}` }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: F.muted }}>About</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.subtle }}>
          § 01
        </span>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-2 gap-0">

        {/* Left — portrait + identity */}
        <div className="relative" style={{ borderBottom: `1px solid ${F.border}` }}>
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
            style={{ height: 'clamp(280px, 50vw, 520px)' }}>
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="w-full h-full object-cover object-top"
              style={{ filter: 'contrast(1.05) saturate(0.85)' }}
            />
            {/* Diagonal gold overlay in corner */}
            <div className="absolute bottom-0 left-0 right-0 h-32"
              style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.7), transparent)' }} />

            {/* Name overlay on photo */}
            <div className="absolute bottom-6 left-6 right-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-1"
                style={{ color: F.bg }}>
                {data.personal.name}
              </motion.h1>
              <motion.div
                initial={{ width: 0 }} animate={inView ? { width: 48 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ height: 2, background: F.gold, marginBottom: '6px' }} />
              <motion.p
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.55 }}
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: F.goldLight }}>
                {data.personal.title}
              </motion.p>
            </div>

            {/* Gold corner accent */}
            <div className="absolute top-6 right-6 w-14 h-14"
              style={{ border: `2px solid ${F.gold}`, borderLeft: 'none', borderBottom: 'none', opacity: 0.6 }} />
            <div className="absolute top-6 left-6 w-8 h-8"
              style={{ border: `2px solid rgba(255,255,255,0.3)`, borderRight: 'none', borderBottom: 'none' }} />
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3" style={{ borderTop: `1px solid ${F.border}` }}>
            {[
              { value: `${data.stats.yearsExperience}+`, label: 'Years', accent: F.gold },
              { value: `${data.stats.projectsCompleted}+`, label: 'Projects', accent: F.charcoal },
              { value: `${data.stats.happyClients}+`, label: 'Clients', accent: F.charcoal },
            ].map(({ value, label, accent }, i) => (
              <div key={label} className="px-4 py-4 flex flex-col items-center"
                style={{ borderRight: i < 2 ? `1px solid ${F.border}` : 'none' }}>
                <StatPill value={value} label={label} accent={accent} />
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="px-8 py-4 flex items-center gap-2"
            style={{ borderTop: `1px solid ${F.border}`, background: F.surface }}>
            <MapPin size={12} style={{ color: F.gold }} />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: F.muted }}>
              {data.personal.location}
            </span>
          </div>
        </div>

        {/* Right — bio + skills + socials */}
        <div>
          {/* Section header */}
          <div className="px-5 md:px-12 pt-8 md:pt-12 pb-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center gap-3 mb-6">
              <Sparkles size={14} style={{ color: F.gold }} />
              <span className="text-xs uppercase tracking-widest font-black" style={{ color: F.gold }}>
                The Story
              </span>
            </motion.div>

            {/* Display heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-1"
                style={{ color: F.charcoal }}>
                Crafting
              </h2>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-1"
                style={{ color: F.charcoal, fontStyle: 'italic' }}>
                Exceptional
              </h2>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6"
                style={{
                  background: `linear-gradient(135deg, ${F.gold}, ${F.goldLight})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                Experiences
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-sm leading-relaxed mb-8"
              style={{ color: F.muted, maxWidth: '480px' }}>
              {data.personal.bio}
            </motion.p>

            {/* Highlight cards */}
            <div className="space-y-3 mb-8">
              <HighlightCard icon={Award}    delay={0.45} title="Top Performance"
                body={`${data.stats.projectsCompleted}+ projects shipped with measurable impact across industries.`} />
              <HighlightCard icon={Sparkles} delay={0.55} title="Creative Excellence"
                body="Recognised for combining engineering rigour with aesthetic sensibility in every build." />
            </div>
          </div>

          {/* Marquee divider */}
          <MarqueeStrip />

          {/* Skills */}
          <div className="px-5 md:px-12 py-8">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs uppercase tracking-widest font-black" style={{ color: F.charcoal }}>
                Expertise
              </span>
              <span className="text-xs" style={{ color: F.subtle }}>{data.skills.length} disciplines</span>
            </div>

            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([cat, skills]) => (
                <div key={cat}>
                  <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: F.subtle }}>{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => <SkillTag key={s.name} name={s.name} category={s.category} index={i} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="px-5 md:px-12 py-6" style={{ borderTop: `1px solid ${F.border}` }}>
            <p className="text-xs uppercase tracking-widest font-black mb-4" style={{ color: F.charcoal }}>Connect</p>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <SocialLink icon={Github}   href={data.socials.github}              label="GitHub" />
              <SocialLink icon={Linkedin} href={data.socials.linkedin}            label="LinkedIn" />
              <SocialLink icon={Twitter}  href={data.socials.twitter}             label="Twitter" />
              <SocialLink icon={Mail}     href={`mailto:${data.socials.email}`}   label="Email" />
            </div>
          </div>

          {/* CTA */}
          <motion.a
            href={`mailto:${data.socials.email}`}
            whileHover={{ backgroundColor: F.charcoal }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-5 md:px-12 py-5 group"
            style={{ borderTop: `1px solid ${F.border}`, background: F.dark, color: F.bg }}>
            <div>
              <p className="text-xs uppercase tracking-widest font-black mb-0.5" style={{ color: F.goldLight }}>
                Open to Opportunities
              </p>
              <p className="text-sm font-semibold">{data.socials.email}</p>
            </div>
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <ArrowRight size={20} style={{ color: F.gold }} />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
