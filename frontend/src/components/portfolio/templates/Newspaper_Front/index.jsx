import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Sun, Cloud, CloudRain } from 'lucide-react';

/**
 * Newspaper Front Portfolio Template
 * Category: Unique / Creative
 * Description: Newspaper front page with multi-column layout, bold headlines, classified-ad-style skills section, weather widget with tech stack forecast.
 */

/* ------------------------------------------------------------------ */
/* Palette — newsprint, ink black, one press red                       */
/* ------------------------------------------------------------------ */
const PAPER = '#f7f3e8';
const INK = '#1c1a15';
const MUTED = 'rgba(28,26,21,0.62)';
const RULE = 'rgba(28,26,21,0.75)';
const RULE_SOFT = 'rgba(28,26,21,0.22)';
const PRESS = '#b3261e';
const SERIF = "Georgia, 'Times New Roman', serif";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const DATE_LINE = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

/* Section banner — a newspaper section header */
const SectionBanner = ({ kicker, title }) => (
  <motion.div variants={fadeUp} className="mb-8">
    <div className="flex items-baseline gap-3 mb-2">
      <span className="text-[10px] font-bold uppercase px-2 py-0.5" style={{ letterSpacing: '0.3em', color: '#ffffff', background: INK }}>
        {kicker}
      </span>
      <span className="text-[10px] uppercase" style={{ letterSpacing: '0.2em', color: MUTED }}>
        Section {kicker.slice(0, 1)} · Page 1
      </span>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: INK }}>{title}</h2>
    <div className="mt-3" style={{ borderTop: `2px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, height: 4 }} />
  </motion.div>
);

/* Weather forecast for the tech stack — deterministic from skills */
const TechForecast = ({ skills }) => {
  const top = skills.slice(0, 4);
  const Icons = [Sun, Sun, Cloud, CloudRain];
  const skies = ['Clear skies', 'Clear skies', 'Partly cloudy', 'Scattered showers'];
  if (!top.length) return null;
  return (
    <div style={{ border: `1px solid ${RULE_SOFT}` }}>
      <div className="px-3 py-2" style={{ borderBottom: `1px solid ${RULE_SOFT}`, background: 'rgba(28,26,21,0.04)' }}>
        <p className="text-[10px] font-bold uppercase" style={{ letterSpacing: '0.25em', color: INK }}>
          Tech Stack Forecast
        </p>
      </div>
      <div className="p-3 space-y-2.5">
        {top.map((s, i) => {
          const Icon = Icons[i % Icons.length];
          return (
            <div key={i} className="flex items-center gap-2.5">
              <Icon size={15} strokeWidth={1.6} style={{ color: i < 2 ? PRESS : MUTED }} />
              <span className="text-xs font-semibold flex-1 truncate" style={{ color: INK }}>{s.name}</span>
              <span className="text-[10px] hidden sm:inline" style={{ color: MUTED }}>{skies[i % skies.length]}</span>
              <span className="text-[10px] font-bold" style={{ color: PRESS }}>{Math.max(0, Math.min(100, Number(s.level) || 85))}%</span>
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2" style={{ borderTop: `1px solid ${RULE_SOFT}` }}>
        <p className="text-[9px] italic" style={{ fontFamily: SERIF, color: MUTED }}>
          Extended outlook: shipping with confidence through year-end.
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Masthead = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const vol = Number(stats.yearsExperience) || 1;
  const no = ((Number(stats.projectsCompleted) || 1) % 365) + 1;

  return (
    <section id="hero" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-6">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* folio line */}
          <motion.div variants={fadeUp} className="flex justify-between items-center text-[10px] uppercase py-1.5"
            style={{ letterSpacing: '0.18em', color: MUTED, borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
            <span>Vol. {vol} · No. {no}</span>
            <span className="hidden sm:inline">{DATE_LINE}</span>
            <span>Late Edition</span>
          </motion.div>

          {/* nameplate */}
          <motion.h1 variants={fadeUp} className="text-center text-5xl md:text-8xl font-bold uppercase my-6 leading-none"
            style={{ fontFamily: SERIF, color: INK, letterSpacing: '0.02em' }}>
            {p.name || 'The Daily Portfolio'}
          </motion.h1>
          {p.tagline ? (
            <motion.p variants={fadeUp} className="text-center italic text-sm md:text-base mb-5" style={{ fontFamily: SERIF, color: MUTED }}>
              &ldquo;{p.tagline}&rdquo;
            </motion.p>
          ) : null}

          {/* breaking ticker */}
          <motion.div variants={fadeUp} className="overflow-hidden" style={{ borderTop: `3px double ${RULE}`, borderBottom: `3px double ${RULE}` }}>
            <motion.div className="flex whitespace-nowrap py-2"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 26 }}>
              {[0, 1].map(rep => (
                <span key={rep} className="text-[11px] font-bold uppercase shrink-0 inline-flex items-center" style={{ letterSpacing: '0.2em', color: INK }}>
                  {['LATEST', 'DEVELOPING', 'EXCLUSIVE', 'FEATURE', 'OPINION'].map((w, i) => (
                    <span key={i} className="inline-flex items-center">
                      <span className="mx-4" style={{ color: i === 0 ? PRESS : INK }}>{w}</span>
                      <span className="mx-4" style={{ color: PRESS }}>•</span>
                    </span>
                  ))}
                  <span className="mx-4">{p.title || 'The news, in portfolio form'}</span>
                  <span className="mx-4" style={{ color: PRESS }}>•</span>
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Front-page lead story with right rail */
const LeadStory = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'Years in print', value: stats.yearsExperience },
    { label: 'Stories filed', value: stats.projectsCompleted },
    { label: 'Sources retained', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-8">
            {/* headline column */}
            <div className="md:col-span-2 md:border-r" style={{ borderColor: RULE_SOFT }}>
              {p.title ? (
                <p className="text-[11px] font-bold uppercase mb-3" style={{ letterSpacing: '0.25em', color: PRESS }}>
                  {p.title}
                </p>
              ) : null}
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ fontFamily: SERIF, color: INK }}>
                {p.name || 'A Quiet Story of Steady Work'}
              </h2>
              <p className="text-[11px] uppercase mb-4 pb-3" style={{ letterSpacing: '0.15em', color: MUTED, borderBottom: `1px solid ${RULE_SOFT}` }}>
                By the Editorial Desk {p.location ? `— filed from ${p.location}` : ''} · {DATE_LINE}
              </p>
              <div className="text-sm leading-relaxed text-justify" style={{ fontFamily: SERIF, color: INK }}>
                <p className="mb-3 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:leading-[0.9] first-letter:mr-2 first-letter:pr-1"
                  style={{ columnCount: 2, columnGap: 24 }}>
                  {p.bio || 'This page intentionally left mostly blank — the presses are warm and the next edition is nearly ready.'}
                </p>
                <p>
                  Sources close to the portfolio describe the work as consistent, well-crafted, and available for comment at the newsroom address below.
                </p>
              </div>
              <div className="flex gap-5 mt-5">
                <a href="#contact" className="text-xs font-bold uppercase border-b pb-0.5" style={{ letterSpacing: '0.2em', color: PRESS, borderColor: PRESS }}>
                  Contact the newsroom →
                </a>
                <a href="#projects" className="text-xs font-bold uppercase border-b pb-0.5" style={{ letterSpacing: '0.2em', color: INK, borderColor: INK }}>
                  Read all stories →
                </a>
              </div>
            </div>

            {/* right rail: photo + weather + numbers */}
            <div className="space-y-6">
              {p.avatar ? (
                <figure style={{ border: `1px solid ${RULE_SOFT}`, padding: 6 }}>
                  <img src={p.avatar} alt={p.name || 'Portrait'} className="w-full h-44 object-cover" style={{ filter: 'grayscale(0.85) contrast(1.05)' }} />
                  <figcaption className="text-[9px] italic pt-1.5" style={{ fontFamily: SERIF, color: MUTED }}>
                    Above: the subject, photographed earlier this year.
                  </figcaption>
                </figure>
              ) : null}
              <TechForecast skills={data.skills || []} />
              {statItems.length > 0 && (
                <div style={{ border: `1px solid ${RULE_SOFT}` }} className="p-3">
                  <p className="text-[10px] font-bold uppercase mb-2" style={{ letterSpacing: '0.25em', color: INK }}>
                    By the numbers
                  </p>
                  {statItems.map((s, i) => (
                    <div key={i} className="flex justify-between items-baseline py-1" style={{ borderBottom: i < statItems.length - 1 ? `1px solid ${RULE_SOFT}` : 'none' }}>
                      <span className="text-[11px]" style={{ color: MUTED }}>{s.label}</span>
                      <span className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Projects — the news columns */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionBanner kicker="Metro" title="Top Stories This Quarter" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {projects.map((project, i) => (
              <motion.article key={i} variants={fadeUp} className="group"
                style={{ borderTop: i >= 3 ? `1px solid ${RULE_SOFT}` : 'none', paddingTop: i >= 3 ? 16 : 0 }}>
                {i === 0 && project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-40 object-cover mb-3"
                    style={{ filter: 'grayscale(0.5) contrast(1.05)' }} />
                ) : null}
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-[10px] font-bold" style={{ color: PRESS }}>A{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase" style={{ letterSpacing: '0.2em', color: MUTED }}>
                    {(project.techStack || []).slice(0, 2).join(' / ') || 'General assignment'}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-snug mb-2 group-hover:underline" style={{ fontFamily: SERIF, color: INK }}>
                  {project.title}
                </h3>
                {project.description ? (
                  <p className="text-[13px] leading-relaxed text-justify mb-3" style={{ fontFamily: SERIF, color: 'rgba(28,26,21,0.8)' }}>
                    {project.description}
                  </p>
                ) : null}
                <p className="text-[9px] italic mb-2" style={{ fontFamily: SERIF, color: MUTED }}>
                  Continued on page A{((i % 5) + 2)} ›
                </p>
                <div className="flex gap-4">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase transition-opacity hover:opacity-60"
                      style={{ letterSpacing: '0.15em', color: INK }}>
                      <ExternalLink size={11} /> Full story
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase transition-opacity hover:opacity-60"
                      style={{ letterSpacing: '0.15em', color: PRESS }}>
                      <Github size={11} /> The archives
                    </a>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Skills — classified ads */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'General'))];
  return (
    <section id="skills" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionBanner kicker="Classified" title="Skill Advertisements" />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {categories.map((cat, ci) => (
              <motion.div key={ci} variants={fadeUp} className="mb-6 break-inside-avoid"
                style={{ border: `1px solid ${RULE_SOFT}`, padding: 14 }}>
                <p className="text-[10px] font-bold uppercase text-center pb-2 mb-3"
                  style={{ letterSpacing: '0.3em', color: PRESS, borderBottom: `1px solid ${RULE_SOFT}` }}>
                  {cat} — Help Wanted
                </p>
                <div className="space-y-2.5">
                  {skills.filter(s => (s.category || 'General') === cat).map((skill, i) => {
                    const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                    return (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="text-[13px] font-bold" style={{ fontFamily: SERIF, color: INK }}>{skill.name}</span>
                        <span className="flex-1" style={{ borderBottom: `1px dotted ${RULE_SOFT}` }} />
                        <span className="text-[10px] font-bold" style={{ color: PRESS }}>{level}% exp.</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] italic mt-3" style={{ fontFamily: SERIF, color: MUTED }}>
                  Inquire within · Equal opportunity workspace
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — past editions archive */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={{ background: PAPER }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionBanner kicker="Archive" title="Past Editions" />
          {experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="py-5 grid md:grid-cols-4 gap-2 md:gap-6"
              style={{ borderBottom: `1px solid ${RULE_SOFT}` }}>
              <div>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{ letterSpacing: '0.15em', color: '#ffffff', background: INK }}>
                  {exp.period}
                </span>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-xl font-bold" style={{ fontFamily: SERIF, color: INK }}>{exp.role}</h3>
                <p className="text-xs font-bold uppercase mb-1.5" style={{ letterSpacing: '0.18em', color: PRESS }}>
                  {exp.company}
                </p>
                {exp.description ? (
                  <p className="text-[13px] leading-relaxed text-justify" style={{ fontFamily: SERIF, color: 'rgba(28,26,21,0.8)' }}>
                    {exp.description}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — letters to the editor */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={{ background: PAPER }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionBanner kicker="Opinion" title="Letters to the Editor" />
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.figure key={i} variants={fadeUp} className="p-5"
                style={{ border: `1px solid ${RULE_SOFT}`, background: 'rgba(28,26,21,0.02)' }}>
                <blockquote className="text-[13px] leading-relaxed text-justify mb-4" style={{ fontFamily: SERIF, color: INK }}>
                  <span className="text-3xl font-bold leading-none mr-1" style={{ color: PRESS }}>&ldquo;</span>
                  {t.text}
                </blockquote>
                <figcaption className="text-right">
                  <span className="block text-sm font-bold italic" style={{ fontFamily: SERIF, color: INK }}>— {t.name}</span>
                  <span className="block text-[10px] uppercase" style={{ letterSpacing: '0.15em', color: MUTED }}>
                    {t.role || 'Reader'} · {['Monday', 'Tuesday', 'Wednesday'][i % 3]} edition
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = ({ data }) => {
  const socials = data.socials || {};
  const p = data.personal || {};
  const email = socials.email || p.email;
  const socialLinks = [
    { key: 'github', label: 'GitHub', href: socials.github, Icon: Github },
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: Linkedin },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: Twitter },
  ].filter(l => l.href);

  return (
    <section id="contact" style={{ background: PAPER }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionBanner kicker="Newsroom" title="Contact the Editors" />
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: SERIF, color: INK }}>
                Tips, corrections, and commissions are welcome at the newsroom. Letters may be edited for clarity and length.
              </p>
              {email ? (
                <a href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase transition-opacity hover:opacity-85"
                  style={{ letterSpacing: '0.2em', color: '#ffffff', background: INK }}>
                  <Mail size={14} /> {email}
                </a>
              ) : null}
              {p.location ? (
                <p className="mt-4 flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                  <MapPin size={12} /> {p.location}
                </p>
              ) : null}
            </div>
            <div className="p-4" style={{ border: `3px double ${RULE}` }}>
              <p className="text-[10px] font-bold uppercase mb-3" style={{ letterSpacing: '0.25em', color: INK }}>
                Follow the paper
              </p>
              <div className="space-y-2">
                {socialLinks.map(l => (
                  <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between py-1.5 transition-opacity hover:opacity-60"
                    style={{ borderBottom: `1px solid ${RULE_SOFT}`, color: INK }}>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase" style={{ letterSpacing: '0.15em' }}>
                      <l.Icon size={13} /> {l.label}
                    </span>
                    <span className="text-[10px]" style={{ color: PRESS }}>
                      @{String(p.name || 'editor').split(' ')[0].toLowerCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* colophon */}
      <footer className="pb-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-4" style={{ borderTop: `3px double ${RULE}` }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-4">
            <p className="text-[11px]" style={{ fontFamily: SERIF, color: MUTED }}>
              &copy; {new Date().getFullYear()} {p.name || 'The Daily Portfolio'} · All rights reserved.
            </p>
            <p className="text-[10px] uppercase" style={{ letterSpacing: '0.25em', color: MUTED }}>
              Printed on 100% recycled pixels
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function NewspaperFront() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'Front Page', href: '#hero' },
    { label: 'Stories', href: '#projects' },
    { label: 'Classifieds', href: '#skills' },
    { label: 'Archive', href: '#experience' },
    { label: 'Letters', href: '#testimonials' },
    { label: 'Newsroom', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: PAPER, color: INK, fontFamily: SERIF }}>
      {/* thin newsroom nav */}
      <nav className="fixed top-0 inset-x-0 z-40"
        style={{ background: 'rgba(28,26,21,0.96)', borderBottom: `2px solid ${PRESS}` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-11 flex items-center justify-between">
          <a href="#hero" className="text-xs font-bold uppercase" style={{ letterSpacing: '0.25em', color: PAPER }}>
            {p.name || 'The Daily Portfolio'} Times
          </a>
          <div className="hidden md:flex items-center gap-5">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-[10px] font-bold uppercase transition-colors hover:text-[#e8e3d5]"
                style={{ letterSpacing: '0.18em', color: 'rgba(247,243,232,0.7)' }}>
                {item.label}
              </a>
            ))}
          </div>
          <span className="text-[10px] md:hidden font-bold uppercase" style={{ letterSpacing: '0.2em', color: PAPER }}>
            {DATE_LINE.split(',')[0]}
          </span>
        </div>
      </nav>

      <Masthead data={data} />
      {(p.bio || p.avatar) ? <LeadStory data={data} /> : null}
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
