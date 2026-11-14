import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Ruler, DraftingCompass, Building2, Mail, MapPin, Phone,
  ArrowUpRight, Github, Linkedin, Twitter, Box, PencilRuler, Globe
} from 'lucide-react';

/**
 * Architect Studio Portfolio Template
 * Category: Professional / Industry
 * Description: Architecture firm portfolio with blueprint grid accents, project renders in clean frames, technical drawing style borders, monospace labels.
 */

const PAPER = '#f4f2ec';
const CARD = '#fbfaf6';
const INK = '#191917';
const NAVY = '#1d3f6e';        // blueprint navy
const NAVY_DEEP = '#142d50';
const STONE = '#5f5c54';
const LINE = 'rgba(25,25,23,0.16)';
const BLUE_LINE = 'rgba(29,63,110,0.14)';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'AS';
};

const paperGrid = {
  backgroundColor: PAPER,
  backgroundImage: `linear-gradient(${BLUE_LINE} 1px, transparent 1px), linear-gradient(90deg, ${BLUE_LINE} 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
};

const navyGrid = {
  backgroundColor: NAVY_DEEP,
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

// Technical corner crop marks (like drawing sheet registration marks)
const CropMarks = ({ color = INK }) => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    <span className="absolute top-0 left-0 w-3.5 h-3.5" style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
    <span className="absolute top-0 right-0 w-3.5 h-3.5" style={{ borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    <span className="absolute bottom-0 left-0 w-3.5 h-3.5" style={{ borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
    <span className="absolute bottom-0 right-0 w-3.5 h-3.5" style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
  </div>
);

// Dimension line with end ticks and centered mono label
const DimLine = ({ label, bg = PAPER }) => (
  <div className="relative h-3.5 flex items-center mt-2" aria-hidden>
    <span className="absolute left-0 top-0 h-full w-px" style={{ background: INK }} />
    <span className="absolute right-0 top-0 h-full w-px" style={{ background: INK }} />
    <span className="absolute left-0 right-0 top-1/2 h-px" style={{ background: LINE }} />
    <span className="relative mx-auto font-mono text-[9px] px-2 uppercase tracking-widest"
      style={{ background: bg, color: NAVY }}>{label}</span>
  </div>
);

// Mono section label: "01 / SECTION NAME"
const SectionTag = ({ index, title, dark = false }) => (
  <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
    <span className="font-mono text-[10px] px-2 py-1"
      style={{ letterSpacing: '0.2em', color: dark ? NAVY_DEEP : '#fff', background: dark ? NAVY : 'transparent', border: `1px solid ${dark ? NAVY : 'rgba(255,255,255,0.35)'}` }}>
      {index}
    </span>
    <span className="font-mono text-[11px] uppercase" style={{ letterSpacing: '0.35em', color: dark ? 'rgba(255,255,255,0.75)' : NAVY }}>
      {title}
    </span>
    <span className="h-px flex-1" style={{ background: dark ? 'rgba(255,255,255,0.25)' : LINE }} />
  </motion.div>
);

// Hero — drawing sheet title page
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center overflow-hidden"
    style={paperGrid}>
    <div className="max-w-6xl mx-auto w-full px-6 pt-24 pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.p variants={fadeUp} className="font-mono text-[11px] uppercase mb-5 flex items-center gap-2"
          style={{ letterSpacing: '0.4em', color: NAVY }}>
          <DraftingCompass size={14} /> Studio Portfolio &mdash; Est. {new Date().getFullYear()}
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-sans font-bold leading-[0.95] tracking-tight text-5xl md:text-7xl uppercase mb-5"
          style={{ color: INK }}>
          {data.personal?.name || 'Untitled Studio'}
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="font-mono text-xs md:text-sm uppercase mb-5 px-3 py-2 inline-block"
            style={{ letterSpacing: '0.3em', color: '#fff', background: NAVY }}>
            {data.personal.title}
          </motion.p>
        )}
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-lg mb-6" style={{ color: STONE }}>
            {data.personal.tagline}
          </motion.p>
        )}
        {data.personal?.location && (
          <motion.p variants={fadeUp} className="font-mono text-[11px] uppercase mb-8 flex items-center gap-2"
            style={{ letterSpacing: '0.25em', color: STONE }}>
            <MapPin size={12} style={{ color: NAVY }} /> Site: {data.personal.location}
          </motion.p>
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a href="#about" className="px-7 py-3 font-mono text-xs uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
            style={{ background: INK }}>
            Drawings &rarr; Profile
          </a>
          <a href="#projects" className="px-7 py-3 font-mono text-xs uppercase tracking-widest border transition-colors hover:bg-[#1d3f6e] hover:text-white hover:border-[#1d3f6e]"
            style={{ borderColor: INK, color: INK }}>
            Selected works
          </a>
          <a href="#contact" className="px-7 py-3 font-mono text-xs uppercase tracking-widest border transition-colors hover:bg-[#1d3f6e] hover:text-white hover:border-[#1d3f6e]"
            style={{ borderColor: NAVY, color: NAVY }}>
            Commissions
          </a>
        </motion.div>
      </motion.div>

      {/* blueprint elevation panel */}
      <motion.div variants={fadeUp} className="hidden lg:block relative" initial="hidden" animate="visible">
        <div className="relative p-4" style={navyGrid}>
          <CropMarks color="rgba(255,255,255,0.5)" />
          <svg viewBox="0 0 360 300" className="w-full" aria-hidden>
            <g stroke="#dfe8f5" strokeWidth="1.1" fill="none" opacity="0.9">
              <rect x="40" y="60" width="90" height="190" />
              <rect x="130" y="110" width="110" height="140" />
              <rect x="240" y="140" width="80" height="110" />
              {/* windows */}
              {[86, 116, 146, 176].map((y, i) => <line key={i} x1="52" y1={y} x2="118" y2={y} />)}
              {[86, 116, 146, 176].map((y, i) => <line key={`v${i}`} x1={52 + (i * 22)} y1="86" x2={52 + (i * 22)} y2="206" />)}
              <line x1="142" y1="140" x2="228" y2="140" />
              <line x1="142" y1="180" x2="228" y2="180" />
              <line x1="142" y1="220" x2="228" y2="220" />
              <line x1="185" y1="110" x2="185" y2="250" />
              {/* roof diagonal */}
              <line x1="40" y1="60" x2="90" y2="20" />
              <line x1="90" y1="20" x2="130" y2="60" />
            </g>
            {/* dimension line */}
            <g stroke="#9fc0ea" strokeWidth="1">
              <line x1="40" y1="272" x2="320" y2="272" />
              <line x1="40" y1="266" x2="40" y2="278" />
              <line x1="320" y1="266" x2="320" y2="278" />
            </g>
            <text x="180" y="290" fill="#9fc0ea" fontSize="10" fontFamily="monospace" textAnchor="middle">OVERALL 36.00 M</text>
          </svg>
          <p className="font-mono text-[9px] uppercase tracking-widest mt-2" style={{ color: 'rgba(223,232,245,0.6)' }}>
            Fig. 01 &mdash; Elevation, north face
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

// 01 Profile (About)
const Profile = ({ data }) => {
  const name = data.personal?.name || 'The Principal';
  const stats = [
    { label: 'Years in practice', value: data.stats?.yearsExperience },
    { label: 'Built works', value: data.stats?.projectsCompleted },
    { label: 'Satisfied clients', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="py-24 px-6" style={{ background: CARD, borderTop: `1px solid ${LINE}` }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionTag index="01" title="Profile" />
          <motion.h2 variants={fadeUp} className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-10" style={{ color: INK }}>
            The practice
          </motion.h2>
          <div className="grid md:grid-cols-[auto_1fr] gap-12 items-start">
            <motion.div variants={fadeUp} className="mx-auto md:mx-0">
              <div className="relative p-2" style={{ border: `1px solid ${LINE}` }}>
                <CropMarks />
                {data.personal?.avatar ? (
                  <img src={data.personal.avatar} alt={name} className="w-56 h-64 object-cover" style={{ filter: 'grayscale(0.4) contrast(1.02)' }} />
                ) : (
                  <div className="w-56 h-64 flex flex-col items-center justify-center gap-4" style={{ background: paperGrid }}>
                    <Box size={28} style={{ color: NAVY }} />
                    <span className="font-mono text-5xl font-bold tracking-widest" style={{ color: INK }}>{initialsOf(name)}</span>
                  </div>
                )}
              </div>
              <DimLine label="Portrait — ref. P-01" bg={CARD} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-[15px] leading-[1.9] mb-8" style={{ color: '#3c3a34' }}>
                {data.personal?.bio || `${name} keeps this sheet reserved for a practice profile and statement.`}
              </p>
              {stats.length > 0 && (
                <div style={{ border: `1px solid ${LINE}` }}>
                  <div className="font-mono text-[10px] uppercase px-4 py-2 flex items-center gap-2"
                    style={{ letterSpacing: '0.25em', color: '#fff', background: NAVY }}>
                    <Ruler size={11} /> Site survey data
                  </div>
                  {stats.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3"
                      style={{ borderTop: i === 0 ? 'none' : `1px solid ${LINE}` }}>
                      <span className="font-mono text-[11px] uppercase" style={{ letterSpacing: '0.18em', color: STONE }}>{s.label}</span>
                      <span className="font-mono text-lg font-bold" style={{ color: NAVY }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 02 Capabilities (Skills)
const Capabilities = ({ data }) => (
  <section id="skills" className="py-24 px-6" style={paperGrid}>
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionTag index="02" title="Capabilities" />
        <motion.h2 variants={fadeUp} className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-10" style={{ color: INK }}>
          Technical specifications
        </motion.h2>
        <div className="space-y-7">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px]" style={{ color: NAVY }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans font-semibold text-lg" style={{ color: INK }}>{skill.name}</span>
                  {skill.category && (
                    <span className="font-mono text-[10px] uppercase hidden sm:inline" style={{ letterSpacing: '0.2em', color: STONE }}>
                      / {skill.category}
                    </span>
                  )}
                </div>
                <span className="font-mono text-sm" style={{ color: NAVY }}>{skill.level}%</span>
              </div>
              <div className="h-[6px] relative" style={{ background: 'rgba(25,25,23,0.08)' }}>
                <motion.div className="h-full" style={{ background: NAVY }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: (i % 2) * 0.12 }} viewport={{ once: true }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// 03 Selected Works (Projects)
const Works = ({ data }) => (
  <section id="projects" className="py-24 px-6" style={{ background: CARD }}>
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <SectionTag index="03" title="Selected Works" />
        <motion.h2 variants={fadeUp} className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-12" style={{ color: INK }}>
          Built &amp; in progress
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-10">
          {data.projects.map((project, i) => (
            <motion.figure key={i} variants={fadeUp} className="group">
              <div className="relative p-2.5" style={{ border: `1px solid ${LINE}`, background: CARD }}>
                <CropMarks />
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-56 object-cover"
                    style={{ filter: 'grayscale(0.35)' }} />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center" style={paperGrid}>
                    <Building2 size={44} style={{ color: 'rgba(29,63,110,0.4)' }} />
                  </div>
                )}
              </div>
              <figcaption className="mt-4">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-mono text-[10px]" style={{ color: NAVY }}>{`P-${String(i + 1).padStart(2, '0')}`}</span>
                  <h3 className="font-sans text-xl font-bold tracking-tight" style={{ color: INK }}>{project.title}</h3>
                </div>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-3.5" style={{ color: STONE }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <p className="font-mono text-[10px] uppercase mb-4" style={{ letterSpacing: '0.16em', color: NAVY }}>
                    {project.techStack.join(' / ')}
                  </p>
                )}
                <div className="flex gap-5 font-mono text-[11px] uppercase tracking-wider">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 transition-colors hover:text-[#1d3f6e]" style={{ color: INK }}>
                      View <ArrowUpRight size={12} />
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-[#1d3f6e]" style={{ color: STONE }}>
                      <Github size={13} /> Repo
                    </a>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// 04 Timeline (Experience)
const Timeline = ({ data }) => (
  <section id="experience" className="py-24 px-6" style={paperGrid}>
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionTag index="04" title="Chronology" />
        <motion.h2 variants={fadeUp} className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-12" style={{ color: INK }}>
          Construction sequence
        </motion.h2>
        <div className="relative border-l pl-8 md:pl-12 space-y-10" style={{ borderColor: LINE }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[36px] md:-left-[50px] top-1 w-2.5 h-2.5 rotate-45"
                style={{ background: NAVY }} />
              {exp.period && (
                <span className="font-mono text-[10px] uppercase px-2.5 py-1 inline-block mb-2"
                  style={{ letterSpacing: '0.2em', color: '#fff', background: NAVY }}>
                  {exp.period}
                </span>
              )}
              <h3 className="font-sans text-xl md:text-2xl font-bold tracking-tight" style={{ color: INK }}>{exp.role}</h3>
              {exp.company && (
                <p className="font-mono text-[11px] uppercase mt-1 mb-2 flex items-center gap-1.5"
                  style={{ letterSpacing: '0.2em', color: NAVY }}>
                  <Building2 size={12} /> {exp.company}
                </p>
              )}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: STONE }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// 05 Client Notes (Testimonials)
const Notes = ({ data }) => (
  <section id="testimonials" className="py-24 px-6" style={{ background: CARD }}>
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionTag index="05" title="Client Notes" />
        <motion.h2 variants={fadeUp} className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-12" style={{ color: INK }}>
          Handover inspections
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="relative p-7" style={{ border: `1px solid ${LINE}` }}>
              <CropMarks color="rgba(29,63,110,0.5)" />
              <p className="font-mono text-[10px] uppercase mb-3" style={{ letterSpacing: '0.25em', color: NAVY }}>
                Note — Ref. N-{String(i + 1).padStart(2, '0')}
              </p>
              <blockquote className="text-[15px] leading-relaxed mb-5" style={{ color: '#3c3a34' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 object-cover" style={{ filter: 'grayscale(0.5)' }} />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center font-mono text-xs font-bold"
                    style={{ background: NAVY, color: '#fff' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-sans font-semibold text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="font-mono text-[10px] uppercase" style={{ letterSpacing: '0.16em', color: STONE }}>{t.role}</div>}
                </div>
                <PencilRuler size={13} className="ml-auto" style={{ color: 'rgba(29,63,110,0.45)' }} />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// 06 Commissions (Contact) + drawing title block footer
const Commissions = ({ data }) => {
  const socials = [
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden" style={navyGrid}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.p variants={fadeUp} className="font-mono text-[11px] uppercase mb-4 flex items-center gap-2"
            style={{ letterSpacing: '0.35em', color: 'rgba(223,232,245,0.75)' }}>
            <DraftingCompass size={14} /> 06 / Commissions
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Let's draft something
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm leading-relaxed mb-10 max-w-xl" style={{ color: 'rgba(223,232,245,0.7)' }}>
            New sites, built works, collaborations and consultations are welcome on the drawing board.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
            {data.personal?.email && (
              <a href={`mailto:${data.personal.email}`}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 font-mono text-xs uppercase tracking-widest bg-white transition-transform hover:-translate-y-0.5"
                style={{ color: NAVY_DEEP }}>
                <Mail size={15} /> {data.personal.email}
              </a>
            )}
            {data.personal?.phone && (
              <span className="inline-flex items-center gap-2.5 px-7 py-3.5 font-mono text-xs uppercase tracking-widest border"
                style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#dfe8f5' }}>
                <Phone size={14} /> {data.personal.phone}
              </span>
            )}
          </motion.div>
          <motion.div variants={fadeUp} className="flex gap-3 mb-14">
            {socials.map(({ key, icon: Icon, label }) => (
              <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                className="inline-flex items-center justify-center w-11 h-11 border transition-colors hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#dfe8f5' }}>
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
          {/* drawing sheet title block */}
          <motion.div variants={fadeUp} className="border" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { k: 'Project', v: data.personal?.name || 'Untitled' },
                { k: 'Sheet', v: 'A-01 · Portfolio' },
                { k: 'Date', v: String(new Date().getFullYear()) },
                { k: 'Scale', v: '1 : 1' },
              ].map((cell, i) => (
                <div key={i} className="p-3.5"
                  style={{
                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.25)'
                  }}>
                  <p className="font-mono text-[9px] uppercase" style={{ letterSpacing: '0.25em', color: 'rgba(223,232,245,0.55)' }}>{cell.k}</p>
                  <p className="font-mono text-xs mt-1 truncate" style={{ color: '#fff' }}>{cell.v}</p>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase px-4 py-3 flex items-center gap-2"
              style={{ letterSpacing: '0.22em', color: 'rgba(223,232,245,0.55)' }}>
              <Globe size={11} /> &copy; {new Date().getFullYear()} {data.personal?.name || 'The Studio'} · All drawings remain property of the studio
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function ArchitectStudio() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: 'Profile', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Capabilities', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Works', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Chronology', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Notes', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Commissions', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: PAPER, color: INK }}>
      {/* title block header */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-sm"
        style={{ background: 'rgba(244,242,236,0.93)', borderColor: LINE }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center gap-5">
          <a href="#hero" className="font-mono text-xs font-bold uppercase whitespace-nowrap flex items-center gap-2"
            style={{ letterSpacing: '0.18em', color: INK }}>
            <DraftingCompass size={15} style={{ color: NAVY }} />
            {data.personal?.name || 'Studio'}
          </a>
          <span className="hidden md:inline font-mono text-[9px] uppercase px-2 py-0.5"
            style={{ letterSpacing: '0.2em', color: '#fff', background: NAVY }}>
            DWG A-01
          </span>
          <div className="flex gap-4 md:gap-6 overflow-x-auto ml-auto">
            {navItems.map(item => (
              <a key={item.href} href={item.href}
                className="whitespace-nowrap font-mono text-[10px] uppercase transition-colors hover:text-[#1d3f6e]"
                style={{ letterSpacing: '0.2em', color: STONE }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <Profile data={data} />}
      {data.skills?.length > 0 && <Capabilities data={data} />}
      {data.projects?.length > 0 && <Works data={data} />}
      {data.experience?.length > 0 && <Timeline data={data} />}
      {data.testimonials?.length > 0 && <Notes data={data} />}
      <Commissions data={data} />
    </div>
  );
}
