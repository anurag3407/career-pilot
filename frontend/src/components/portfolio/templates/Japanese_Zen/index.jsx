import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, Twitter, ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * Japanese Zen Portfolio Template
 * Category: Minimal / Clean
 * Description: Japanese minimalism with generous whitespace, subtle ink brush stroke accents, wabi-sabi imperfection aesthetic. Soft neutral palette with one accent color.
 */

/* ------------------------------------------------------------------ */
/* Palette — rice paper, charcoal ink, one vermillion accent           */
/* ------------------------------------------------------------------ */
const PAPER = '#f6f1e7';
const PAPER_DEEP = '#efe8da';
const INK = '#26231e';
const INK_SOFT = '#6f6a5e';
const HAIRLINE = 'rgba(38,35,30,0.14)';
const VERMILION = '#bc3a2b';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/* Ink brush stroke — irregular layered SVG path that draws itself     */
/* ------------------------------------------------------------------ */
const InkStroke = ({ width = 220, tone = INK, flip = false }) => (
  <svg viewBox="0 0 220 16" width={width} height="16" fill="none" aria-hidden="true"
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
    <motion.path
      d="M3,10 C28,4 52,13 80,9 C110,5 138,12 168,8 C190,5 205,11 217,8"
      stroke={tone} strokeWidth="2.4" strokeLinecap="round" opacity="0.85"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    />
    <motion.path
      d="M6,12 C34,8 60,15 92,11 C124,7 150,14 182,10 C200,8 210,12 214,10"
      stroke={tone} strokeWidth="1.1" strokeLinecap="round" opacity="0.35"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay: 0.15, ease: 'easeOut' }}
    />
  </svg>
);

/* Ensō — the single imperfect brush circle */
const Enso = ({ size = 300, className = '', tone = 'rgba(38,35,30,0.10)' }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} className={className} fill="none" aria-hidden="true">
    <motion.path
      d="M118,14 A84,86 0 1 0 148,26 C144,22 136,19 131,17"
      stroke={tone} strokeWidth="9" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
    />
  </svg>
);

/* Vermillion seal (hanko) with initials */
const Seal = ({ initials, size = 44 }) => (
  <div
    aria-hidden="true"
    className="flex items-center justify-center text-white font-semibold select-none"
    style={{
      width: size, height: size,
      background: VERMILION,
      borderRadius: 6,
      transform: 'rotate(-3deg)',
      boxShadow: '2px 2px 0 rgba(38,35,30,0.12)',
      fontSize: size * 0.32,
      letterSpacing: '0.05em',
    }}
  >
    {initials || '·'}
  </div>
);

const VerticalText = ({ children, className = '' }) => (
  <span
    aria-hidden="true"
    className={`hidden md:block text-[11px] uppercase font-light ${className}`}
    style={{ writingMode: 'vertical-rl', letterSpacing: '0.5em', color: INK_SOFT }}
  >
    {children}
  </span>
);

/* Section heading — tiny seal dot, label, wide-spaced title, ink stroke */
const SectionHead = ({ label, title, center = false }) => (
  <motion.div variants={fadeUp} className={`mb-14 ${center ? 'text-center' : ''}`}>
    <div className={`flex items-center gap-3 mb-5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: VERMILION }} />
      <span className="text-xs uppercase" style={{ letterSpacing: '0.4em', color: INK_SOFT }}>{label}</span>
    </div>
    <h2 className="text-3xl md:text-4xl font-light" style={{ color: INK, letterSpacing: '0.08em' }}>
      {title}
    </h2>
    <div className={center ? 'flex justify-center' : ''}>
      <InkStroke width={170} flip={center} />
    </div>
  </motion.div>
);

/* Monogram — replaces a missing avatar with a quiet ink circle */
const Monogram = ({ name, size = 180 }) => {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: size, height: size,
        border: `1.5px solid ${HAIRLINE}`,
        color: INK,
        fontSize: size * 0.26,
        fontWeight: 300,
        letterSpacing: '0.15em',
        background: `radial-gradient(circle at 38% 32%, #fffdf8 0%, ${PAPER_DEEP} 78%)`,
        boxShadow: '10px 10px 0 rgba(38,35,30,0.06)',
      }}
    >
      {initials || '?'}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: PAPER }}>
      <Enso className="absolute -top-6 right-2 md:right-10 opacity-80 pointer-events-none" size={340} />

      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-36 pb-28 md:pt-44 md:pb-36">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative">
          <motion.p variants={fadeUp} className="text-xs uppercase mb-10 font-light"
            style={{ letterSpacing: '0.5em', color: INK_SOFT }}>
            Portfolio — {new Date().getFullYear()}
          </motion.p>

          <motion.h1 variants={fadeUp}
            className="text-5xl md:text-7xl font-light leading-[1.1]"
            style={{ color: INK, letterSpacing: '0.02em' }}>
            {p.name || 'Unnamed'}
          </motion.h1>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <p className="text-lg md:text-xl font-light" style={{ color: VERMILION }}>
              {p.title || ''}
            </p>
            <InkStroke width={130} flip />
          </motion.div>

          {p.tagline ? (
            <motion.p variants={fadeUp} className="mt-8 max-w-xl text-base md:text-lg leading-relaxed font-light"
              style={{ color: INK_SOFT }}>
              {p.tagline}
            </motion.p>
          ) : null}

          {p.location ? (
            <motion.p variants={fadeUp} className="mt-6 flex items-center gap-2 text-sm font-light"
              style={{ color: INK_SOFT }}>
              <MapPin size={14} strokeWidth={1.5} /> {p.location}
            </motion.p>
          ) : null}

          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap items-center gap-8">
            <a href="#projects"
              className="group inline-flex items-center gap-3 text-sm uppercase transition-colors"
              style={{ letterSpacing: '0.3em', color: INK }}>
              <span className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors group-hover:bg-[#bc3a2b] group-hover:border-[#bc3a2b] group-hover:text-white"
                style={{ borderColor: HAIRLINE }}>
                <ArrowRight size={14} strokeWidth={1.5} />
              </span>
              View work
            </a>
            <a href="#contact" className="text-sm uppercase border-b pb-1 transition-opacity hover:opacity-70"
              style={{ letterSpacing: '0.3em', color: VERMILION, borderColor: VERMILION }}>
              Say hello
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute right-6 md:right-14 top-40 md:top-44">
        <VerticalText>{(p.name || 'studio').split(' ')[0]} — quiet work, done well</VerticalText>
      </div>

      {/* wabi-sabi: a single off-center garden stone */}
      <div aria-hidden="true" className="absolute bottom-16 left-6 md:left-16 opacity-70 pointer-events-none"
        style={{ transform: 'rotate(8deg)' }}>
        <svg width="72" height="46" viewBox="0 0 72 46" fill="none">
          <path d="M4,40 C10,20 30,10 44,14 C60,18 68,32 66,40 Z" fill="rgba(38,35,30,0.10)" />
          <path d="M8,38 C20,30 40,28 58,36" stroke="rgba(38,35,30,0.22)" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'Years of practice', value: stats.yearsExperience },
    { label: 'Works completed', value: stats.projectsCompleted },
    { label: 'Collaborations', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="relative overflow-hidden" style={{ background: PAPER_DEEP }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
          <motion.div variants={fadeUp} className="md:col-span-2 flex justify-center md:justify-start">
            <div style={{ transform: 'rotate(-1.5deg)' }}>
              {p.avatar ? (
                <div className="p-3 bg-white" style={{ boxShadow: '12px 12px 0 rgba(38,35,30,0.08)' }}>
                  <img src={p.avatar} alt={p.name || 'Portrait'}
                    className="w-48 h-48 md:w-56 md:h-56 object-cover"
                    style={{ filter: 'saturate(0.82)' }} />
                </div>
              ) : (
                <Monogram name={p.name} />
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-3">
            <SectionHead label="About" title="A quiet introduction" />
            <p className="text-base md:text-lg leading-loose font-light mb-10" style={{ color: INK }}>
              {p.bio || 'This space is intentionally left open — like the pause between brush strokes.'}
            </p>
            {statItems.length > 0 && (
              <div className="grid grid-cols-3 divide-x" style={{ borderColor: HAIRLINE }}>
                {statItems.map((s, i) => (
                  <div key={i} className="px-4 first:pl-0">
                    <div className="text-2xl md:text-3xl font-light" style={{ color: VERMILION }}>
                      {s.value}
                    </div>
                    <div className="text-[11px] uppercase mt-2 font-light" style={{ letterSpacing: '0.25em', color: INK_SOFT }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Skills — thin ink line per skill, vermillion dot marking the level */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Practice'))];
  return (
    <section id="skills" style={{ background: PAPER }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Skills" title="The tools at hand" />
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp} className="mb-12 last:mb-0">
              <h3 className="text-xs uppercase mb-6 font-light" style={{ letterSpacing: '0.4em', color: INK_SOFT }}>
                {cat}
              </h3>
              <div className="space-y-6">
                {skills.filter(s => (s.category || 'Practice') === cat).map((skill, i) => {
                  const level = Math.max(0, Math.min(100, Number(skill.level) || 80));
                  return (
                    <div key={i} className="relative pt-2">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-base md:text-lg font-light" style={{ color: INK }}>{skill.name}</span>
                        <span className="text-xs font-light" style={{ color: INK_SOFT, letterSpacing: '0.15em' }}>{level}</span>
                      </div>
                      <div className="relative h-px w-full" style={{ background: HAIRLINE }}>
                        <motion.span
                          className="absolute -top-[4px] w-2 h-2 rounded-full"
                          style={{ background: VERMILION }}
                          initial={{ left: '0%' }}
                          whileInView={{ left: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* Projects — sparse editorial index; every other entry sits slightly offset */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" style={{ background: PAPER_DEEP }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Selected works" title="Works, numbered" />
          <div className="space-y-20">
            {projects.map((project, i) => {
              const tech = project.techStack || [];
              return (
                <motion.article key={i} variants={fadeUp} className={`group ${i % 2 === 1 ? 'md:ml-16' : 'md:ml-0'}`}>
                  <div className="flex items-start gap-6 mb-4">
                    <span className="text-sm mt-2" style={{ color: VERMILION, letterSpacing: '0.2em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {project.image ? (
                      <div className="shrink-0" style={{ transform: `rotate(${i % 2 === 0 ? -1.4 : 1.6}deg)` }}>
                        <img src={project.image} alt={project.title}
                          className="w-24 h-16 object-cover"
                          style={{ boxShadow: '6px 6px 0 rgba(38,35,30,0.10)', filter: 'saturate(0.85)' }} />
                      </div>
                    ) : null}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light mb-4 transition-opacity group-hover:opacity-80"
                    style={{ color: INK }}>
                    {project.title}
                  </h3>
                  <p className="max-w-2xl text-sm md:text-base leading-relaxed font-light mb-5"
                    style={{ color: INK_SOFT }}>
                    {project.description}
                  </p>
                  {tech.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
                      {tech.map((t, j) => (
                        <span key={j} className="text-[11px] uppercase font-light" style={{ letterSpacing: '0.2em', color: INK_SOFT }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-6">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs uppercase border-b pb-0.5 transition-opacity hover:opacity-60"
                        style={{ letterSpacing: '0.25em', color: INK, borderColor: HAIRLINE }}>
                        View <ArrowUpRight size={12} strokeWidth={1.5} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs uppercase border-b pb-0.5 transition-opacity hover:opacity-60"
                        style={{ letterSpacing: '0.25em', color: VERMILION, borderColor: VERMILION }}>
                        Source <ArrowUpRight size={12} strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — a single vertical ink line, vermillion moment markers */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={{ background: PAPER }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Experience" title="The path so far" />
          <div className="relative pl-8 md:pl-12">
            <div className="absolute left-1 top-2 bottom-2 w-px" style={{ background: HAIRLINE }} />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pb-14 last:pb-0">
                <span className="absolute -left-8 md:-left-12 top-2 -translate-x-[5px] w-[10px] h-[10px] rounded-full"
                  style={{
                    background: i === 0 ? VERMILION : PAPER,
                    border: `1.5px solid ${i === 0 ? VERMILION : 'rgba(38,35,30,0.3)'}`,
                  }} />
                <span className="text-xs" style={{ letterSpacing: '0.25em', color: VERMILION }}>
                  {exp.period}
                </span>
                <h3 className="text-xl md:text-2xl font-light mt-2" style={{ color: INK }}>{exp.role}</h3>
                <p className="text-sm mt-1 mb-3 font-light" style={{ color: INK_SOFT }}>{exp.company}</p>
                <p className="text-sm leading-relaxed font-light" style={{ color: INK_SOFT }}>
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — words from others, held by a large vermillion quotation mark */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={{ background: PAPER_DEEP }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Testimonials" title="Words from others" />
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-14">
            {testimonials.map((t, i) => {
              const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.figure key={i} variants={fadeUp}
                  style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.5}deg)` }}>
                  <span className="block text-5xl leading-none mb-4 font-light" style={{ color: VERMILION }}>&ldquo;</span>
                  <blockquote className="text-base leading-loose font-light mb-6" style={{ color: INK }}>
                    {t.text}
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name}
                        className="w-10 h-10 rounded-full object-cover"
                        style={{ border: `1px solid ${HAIRLINE}`, filter: 'saturate(0.8)' }} />
                    ) : (
                      <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs"
                        style={{ border: `1px solid ${HAIRLINE}`, color: INK_SOFT }}>
                        {initials}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm" style={{ color: INK }}>{t.name}</span>
                      <span className="block text-xs font-light" style={{ color: INK_SOFT }}>{t.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = ({ data }) => {
  const socials = data.socials || {};
  const p = data.personal || {};
  const socialLinks = [
    { key: 'github', label: 'GitHub', href: socials.github, Icon: Github },
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: Linkedin },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: Twitter },
  ].filter(l => l.href);

  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: PAPER }}>
      <Enso className="absolute -bottom-24 -right-16 opacity-60 pointer-events-none" size={380} tone="rgba(188,58,43,0.10)" />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-28 md:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="mb-8">
            <Seal initials={(p.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-light mb-6"
            style={{ color: INK, letterSpacing: '0.04em' }}>
            Let us begin a quiet conversation.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base font-light mb-12 max-w-lg leading-relaxed"
            style={{ color: INK_SOFT }}>
            One line is enough. I read everything, and I reply with care.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-8 mb-14">
            {(socials.email || p.email) ? (
              <a href={`mailto:${socials.email || p.email}`}
                className="inline-flex items-center gap-3 text-sm uppercase px-7 py-4 transition-opacity hover:opacity-85"
                style={{ letterSpacing: '0.3em', color: '#ffffff', background: VERMILION }}>
                <Mail size={15} strokeWidth={1.5} /> Write a letter
              </a>
            ) : null}
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-light border-b pb-0.5 transition-opacity hover:opacity-60"
                style={{ color: INK, borderColor: HAIRLINE }}>
                <l.Icon size={14} strokeWidth={1.5} /> {l.label}
              </a>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="pt-10" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            <p className="text-xs font-light" style={{ color: INK_SOFT, letterSpacing: '0.2em' }}>
              &copy; {new Date().getFullYear()} {p.name || ''} — made slowly, by hand.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function JapaneseZen() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Works', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased" style={{ background: PAPER, color: INK, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* hairline top bar */}
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(246,241,231,0.82)', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: VERMILION }} />
            <span className="text-sm font-light" style={{ letterSpacing: '0.2em' }}>{p.name || 'Portfolio'}</span>
          </a>
          <div className="hidden sm:flex items-center gap-7">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-xs uppercase transition-opacity hover:opacity-60"
                style={{ letterSpacing: '0.25em', color: INK_SOFT }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero data={data} />
      {(p.bio || p.avatar) ? <About data={data} /> : null}
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
