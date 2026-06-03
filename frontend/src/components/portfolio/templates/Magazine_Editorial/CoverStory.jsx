import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const { personal, stats, socials } = data;

/* ─── Animation variants ───────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, ease: 'easeOut', delay },
  }),
};

const drawLine = {
  hidden: { scaleX: 0 },
  visible: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ─── Story Highlights data ────────────────────────────────────────────────── */
const HIGHLIGHTS = [
  { num: '01', title: 'Creative Direction', desc: 'Turning vision into visual narrative through intentional design thinking.' },
  { num: '02', title: 'UI/UX Excellence',   desc: 'Crafting interfaces that feel effortless and deeply human-centered.'       },
  { num: '03', title: 'Product Innovation', desc: 'Engineering scalable solutions that balance beauty and performance.'      },
  { num: '04', title: 'Visual Storytelling', desc: 'Using code as a medium to express ideas that resonate and inspire.'     },
];

/* ─── Magazine metadata ────────────────────────────────────────────────────── */
const now         = new Date();
const ISSUE_DATE  = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const ISSUE_NO    = `No. ${String(now.getMonth() + 1).padStart(2, '0')}`;

/* ─── Social link atom ─────────────────────────────────────────────────────── */
function SocialPill({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#C41E3A] transition-colors duration-300"
    >
      <Icon size={15} strokeWidth={1.8} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] border-b border-transparent group-hover:border-[#C41E3A] transition-all duration-300 pb-px">
        {label}
      </span>
    </a>
  );
}

/* ─── Section label atom ───────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p className="text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#C41E3A]">
      {children}
    </p>
  );
}

/* ─── Thin rule atom ───────────────────────────────────────────────────────── */
function Rule({ className = '' }) {
  return <div className={`h-px bg-[#1a1a1a]/15 ${className}`} />;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CoverStory() {
  const rootRef    = useRef(null);
  const isInView   = useInView(rootRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={rootRef}
      id="cover-story"
      aria-label="Cover Story"
      className="bg-[#f5f0e8] text-[#1a1a1a] overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* ── 1. MASTHEAD ────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        custom={0}
        className="border-b border-[#1a1a1a]/15 px-6 md:px-16 py-3 flex items-center justify-between gap-4 flex-wrap"
      >
        <span className="text-[0.55rem] font-bold uppercase tracking-[0.32em] text-[#1a1a1a]">
          The Portfolio Review
        </span>
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-[#1a1a1a]/20" />
          <span className="text-[0.55rem] uppercase tracking-[0.22em] text-[#1a1a1a]/50 font-medium">
            {ISSUE_DATE}
          </span>
          <div className="h-px w-12 bg-[#1a1a1a]/20" />
        </div>
        <span className="text-[0.55rem] uppercase tracking-[0.22em] text-[#1a1a1a]/50 font-medium">
          {ISSUE_NO} · Vol. {now.getFullYear()}
        </span>
      </motion.div>

      {/* ── 2. EDITORIAL LABEL ─────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 pt-10 pb-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
          className="flex items-center gap-4"
        >
          <SectionLabel>Cover Story</SectionLabel>
          <motion.div
            variants={drawLine}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.3}
            className="flex-1 h-px bg-[#1a1a1a]/15 origin-left"
          />
          <span
            className="text-[0.55rem] font-bold uppercase tracking-[0.28em] text-[#1a1a1a]/40 border border-[#1a1a1a]/20 px-2.5 py-1"
          >
            Featured
          </span>
        </motion.div>
      </div>

      {/* ── 3. MAIN HERO SPLIT ─────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-0 border border-[#1a1a1a]/12">

          {/* ── LEFT: Typography panel ─────────────────────────────────────── */}
          <div className="relative flex flex-col justify-between p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/12 overflow-hidden">

            {/* Ghost watermark letter */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-4 -left-2 text-[#1a1a1a]/[0.035] leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(10rem, 20vw, 16rem)' }}
            >
              {personal.name.charAt(0)}
            </div>

            <div className="relative z-10">
              {/* FEATURED · STORY badge */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.15}
                className="flex items-baseline gap-3 mb-6"
              >
                <span
                  className="text-[0.55rem] font-bold uppercase tracking-[0.38em] text-[#1a1a1a]/40"
                >
                  Featured Story
                </span>
                <div className="h-px w-8 bg-[#C41E3A]" />
              </motion.div>

              {/* HEADLINE */}
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.22}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(3.2rem, 8vw, 7rem)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#1a1a1a',
                  marginBottom: '1.25rem',
                }}
              >
                {personal.name.split(' ')[0]}
                <br />
                <span className="text-[#C41E3A] not-italic">
                  {personal.name.split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>

              {/* Animated rule */}
              <motion.div
                variants={drawLine}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.45}
                className="h-px bg-[#1a1a1a] origin-left mb-5"
              />

              {/* Standfirst — title */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.5}
                className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a] mb-6"
              >
                {personal.title}
              </motion.p>

              {/* Pull quote */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.6}
                className="relative border-l-[3px] border-[#C41E3A] pl-5 mb-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-5 left-3 text-[4.5rem] leading-none text-[#C41E3A]/15 select-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  "
                </span>
                <p
                  className="text-[#1a1a1a] leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                >
                  {personal.tagline}
                </p>
              </motion.div>

              {/* Bio */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.68}
                className="text-[0.85rem] text-[#1a1a1a]/60 leading-[1.8] mb-8 max-w-md"
              >
                {personal.bio.substring(0, 210)}…
              </motion.p>

              {/* Read More CTA */}
              <motion.a
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.75}
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group"
              >
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 group-hover:border-[#C41E3A] group-hover:text-[#C41E3A] transition-colors duration-300">
                  Read Full Story
                </span>
                <span className="w-7 h-7 rounded-full border border-[#1a1a1a] flex items-center justify-center group-hover:bg-[#C41E3A] group-hover:border-[#C41E3A] transition-all duration-300">
                  <ArrowRight size={12} className="text-[#1a1a1a] group-hover:text-white transition-colors duration-300" />
                </span>
              </motion.a>
            </div>

            {/* Cover lines at bottom */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.82}
              className="relative z-10 mt-10 pt-6 border-t border-[#1a1a1a]/12"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { tag: 'EXCLUSIVE',  line: 'Full-Stack Architecture'  },
                  { tag: 'FEATURE',    line: 'From Concept to Launch'   },
                  { tag: 'SPOTLIGHT',  line: 'Open Source Contributor'  },
                  { tag: 'INSIDE',     line: 'Clean Code Philosophy'    },
                ].map((cl) => (
                  <div key={cl.tag} className="flex items-baseline gap-2">
                    <span className="text-[0.45rem] font-black uppercase tracking-[0.3em] text-[#C41E3A] shrink-0 mt-0.5">
                      {cl.tag}
                    </span>
                    <span className="text-[0.68rem] text-[#1a1a1a]/70 leading-tight font-medium">
                      {cl.line}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Portrait panel ──────────────────────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.3}
            className="relative min-h-[480px] lg:min-h-0 overflow-hidden bg-[#1a1a1a] flex flex-col"
          >
            {/* Geometric colour block */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a1a]" />

            {/* Red accent diagonal */}
            <div
              className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-bl from-[#C41E3A] to-[#8b0000]"
              style={{ clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0% 100%)' }}
            />

            {/* Avatar image — with zoom on hover */}
            {personal.avatar && (
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-full h-full object-cover object-top"
                  style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/40 via-transparent to-transparent" />
              </div>
            )}

            {/* Column grid lines */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              {[25, 50, 75].map((p) => (
                <div key={p} className="absolute top-0 bottom-0 w-px bg-white/[0.04]" style={{ left: `${p}%` }} />
              ))}
              {[33, 66].map((p) => (
                <div key={p} className="absolute left-0 right-0 h-px bg-white/[0.04]" style={{ top: `${p}%` }} />
              ))}
            </div>

            {/* Top label */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.28em] text-white/50">
                The Portfolio Review
              </span>
            </div>

            {/* Vol badge */}
            <div className="absolute top-4 right-4 z-10 border border-[#C41E3A]/60 px-2.5 py-1">
              <span className="text-[0.48rem] font-bold uppercase tracking-[0.2em] text-[#C41E3A]">
                Vol. {now.getFullYear()}
              </span>
            </div>

            {/* Ghost watermark */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 leading-none text-white/[0.04] select-none pointer-events-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(8rem, 16vw, 13rem)' }}
            >
              {personal.name.split(' ').pop()?.charAt(0)}
            </div>

            {/* Bottom overlay content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
              <div className="w-8 h-0.5 bg-[#C41E3A] mb-3" />
              <p
                className="text-white font-bold italic leading-snug mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)' }}
              >
                "{personal.tagline}"
              </p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin size={10} className="text-[#C41E3A]" />
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/50">
                  {personal.location}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 4. MAGAZINE METADATA STRIP ─────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        custom={0.5}
        className="mx-6 md:mx-16 border-x border-b border-[#1a1a1a]/12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1a1a1a]/12">
          {[
            { label: 'Issue No.',         value: ISSUE_NO                },
            { label: 'Category',          value: 'Tech & Design'        },
            { label: 'Reading Time',      value: '8 min read'           },
            { label: 'Published',         value: ISSUE_DATE             },
          ].map((m, i) => (
            <div key={i} className="px-6 py-5">
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-1">
                {m.label}
              </p>
              <p
                className="font-bold text-[#1a1a1a] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', fontStyle: 'italic' }}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 5. STATS BAND ──────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        custom={0.6}
        className="mx-6 md:mx-16 border-x border-b border-[#1a1a1a]/12 bg-[#1a1a1a]"
      >
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {[
            { value: stats.yearsExperience,   suffix: '+', label: 'Years Experience'  },
            { value: stats.projectsCompleted, suffix: '+', label: 'Projects Shipped'  },
            { value: stats.happyClients,      suffix: '+', label: 'Happy Clients'     },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 text-center">
              <p
                className="font-black text-white leading-none mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}
              >
                {s.value}<span className="text-[#C41E3A]">{s.suffix}</span>
              </p>
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.26em] text-white/40">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 6. EDITORIAL QUOTE BLOCK ───────────────────────────────────────── */}
      <div className="mx-6 md:mx-16 border-x border-b border-[#1a1a1a]/12 px-8 md:px-16 py-16 relative overflow-hidden">
        {/* Decorative large quote mark */}
        <div
          aria-hidden="true"
          className="absolute -top-6 left-8 leading-none text-[#1a1a1a]/[0.05] select-none pointer-events-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: 'clamp(8rem, 15vw, 12rem)' }}
        >
          "
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.55}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <SectionLabel>Editorial Quote</SectionLabel>
          <div className="w-8 h-0.5 bg-[#C41E3A] mx-auto my-5" />

          <blockquote
            className="text-[#1a1a1a] leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            "Design is not just what it looks like.
            <br className="hidden md:block" />
            Design is how it works."
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#1a1a1a]/20" />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[#1a1a1a]/50">
              {personal.name} · {personal.title}
            </span>
            <div className="h-px w-10 bg-[#1a1a1a]/20" />
          </div>
        </motion.div>
      </div>

      {/* ── 7. STORY HIGHLIGHTS ────────────────────────────────────────────── */}
      <div className="mx-6 md:mx-16 border-x border-b border-[#1a1a1a]/12">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.6}
          className="px-8 md:px-12 pt-12 pb-8 flex items-center gap-4"
        >
          <SectionLabel>Story Highlights</SectionLabel>
          <div className="flex-1 h-px bg-[#1a1a1a]/12" />
        </motion.div>

        {/* Highlight cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x border-t border-[#1a1a1a]/12">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.num}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.65 + i * 0.08}
              className="group px-8 md:px-10 py-10 border-[#1a1a1a]/12 hover:bg-[#1a1a1a] transition-colors duration-400 cursor-default"
            >
              {/* Large number */}
              <p
                className="font-black text-[#1a1a1a]/10 group-hover:text-white/10 leading-none mb-4 transition-colors duration-400"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.05em' }}
              >
                {h.num}
              </p>

              <div className="w-6 h-0.5 bg-[#C41E3A] mb-4" />

              <h3
                className="font-bold text-[#1a1a1a] group-hover:text-white mb-3 transition-colors duration-400 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}
              >
                {h.title}
              </h3>

              <p className="text-[0.78rem] text-[#1a1a1a]/55 group-hover:text-white/55 leading-[1.7] transition-colors duration-400">
                {h.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 8. SOCIAL BYLINE ───────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        custom={0.8}
        className="mx-6 md:mx-16 border-x border-b border-[#1a1a1a]/12 px-8 py-5 flex items-center justify-between flex-wrap gap-4"
      >
        <span className="text-[0.52rem] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/35">
          Connect
        </span>
        <div className="flex items-center gap-6 flex-wrap">
          {socials.github   && <SocialPill href={socials.github}                 icon={Github}   label="GitHub"   />}
          {socials.linkedin && <SocialPill href={socials.linkedin}               icon={Linkedin} label="LinkedIn" />}
          {socials.twitter  && <SocialPill href={socials.twitter}                icon={Twitter}  label="Twitter"  />}
          {socials.email    && <SocialPill href={`mailto:${socials.email}`}      icon={Mail}     label="Email"    />}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-px bg-[#1a1a1a]/20" />
          <span
            className="text-[0.65rem] text-[#1a1a1a]/35 italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            est. {now.getFullYear()}
          </span>
        </div>
      </motion.div>

      {/* ── 9. BOTTOM TICKER ───────────────────────────────────────────────── */}
      <div className="mx-6 md:mx-16 border-x border-b border-[#1a1a1a]/12 bg-[#1a1a1a] overflow-hidden">
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            className="flex whitespace-nowrap py-3"
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-4 px-4 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-white/35">
                <span>{personal.name}</span>
                <span className="text-[#C41E3A]">◆</span>
                <span>{personal.title}</span>
                <span className="text-[#C41E3A]">◆</span>
                <span>{personal.location}</span>
                <span className="text-[#C41E3A]">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
