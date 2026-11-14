import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Github, Linkedin, Twitter, Scale, Landmark, Gavel, ExternalLink, BookOpen } from 'lucide-react';

/**
 * Law Firm Classic Portfolio Template
 * Category: Professional / Industry
 * Description: Traditional law firm aesthetic with serif fonts (Playfair Display), navy and gold color scheme, marble texture accents. Authoritative and trustworthy.
 */

/* ------------------------------------------------------------------ */
/* Palette — navy, gold, parchment; marble via layered CSS gradients   */
/* ------------------------------------------------------------------ */
const NAVY = '#0e1b33';
const NAVY_DEEP = '#0a1426';
const GOLD = '#c9a45c';
const GOLD_SOFT = 'rgba(201,164,92,0.45)';
const PARCHMENT = '#f7f3ea';
const INK = '#1d2437';
const MUTED = 'rgba(29,36,55,0.65)';
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

const MARBLE = {
  backgroundColor: '#f3efe7',
  backgroundImage: [
    'radial-gradient(ellipse 90% 55% at 18% 28%, rgba(176,168,150,0.22), transparent 62%)',
    'radial-gradient(ellipse 60% 45% at 78% 18%, rgba(160,152,132,0.16), transparent 58%)',
    'radial-gradient(ellipse 55% 60% at 52% 82%, rgba(186,178,160,0.20), transparent 60%)',
    'repeating-linear-gradient(115deg, rgba(120,112,96,0.045) 0px, rgba(120,112,96,0.045) 1px, transparent 1px, transparent 26px)',
    'linear-gradient(135deg, #f7f4ee 0%, #ebe7dc 48%, #f3efe7 100%)',
  ].join(', '),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/* Motifs                                                              */
/* ------------------------------------------------------------------ */
/* Balanced scales of justice, drawn in gold hairlines */
const ScalesOfJustice = ({ size = 96, tone = GOLD }) => (
  <svg viewBox="0 0 120 100" width={size} height={size * 0.84} fill="none" aria-hidden="true">
    <circle cx="60" cy="7" r="3.5" stroke={tone} strokeWidth="1.6" />
    <line x1="60" y1="10.5" x2="60" y2="86" stroke={tone} strokeWidth="1.6" />
    <line x1="16" y1="20" x2="104" y2="20" stroke={tone} strokeWidth="1.6" />
    {/* left pan */}
    <line x1="16" y1="20" x2="6" y2="40" stroke={tone} strokeWidth="1.1" />
    <line x1="16" y1="20" x2="26" y2="40" stroke={tone} strokeWidth="1.1" />
    <path d="M2,42 Q16,54 30,42" stroke={tone} strokeWidth="1.6" fill="rgba(201,164,92,0.14)" />
    {/* right pan */}
    <line x1="104" y1="20" x2="94" y2="40" stroke={tone} strokeWidth="1.1" />
    <line x1="104" y1="20" x2="114" y2="40" stroke={tone} strokeWidth="1.1" />
    <path d="M90,42 Q104,54 118,42" stroke={tone} strokeWidth="1.6" fill="rgba(201,164,92,0.14)" />
    {/* plinth */}
    <path d="M46,86 L74,86 L80,92 L40,92 Z" stroke={tone} strokeWidth="1.6" fill="rgba(201,164,92,0.14)" />
    <line x1="34" y1="97" x2="86" y2="97" stroke={tone} strokeWidth="2" />
  </svg>
);

/* Double gold rule divider */
const GoldRule = ({ className = '' }) => (
  <div aria-hidden="true" className={`flex items-center gap-3 ${className}`}>
    <span className="flex-1" style={{ borderTop: `1px solid ${GOLD_SOFT}` }} />
    <span className="w-1.5 h-1.5 rotate-45" style={{ background: GOLD }} />
    <span className="flex-1" style={{ borderTop: `1px solid ${GOLD_SOFT}` }} />
  </div>
);

/* Section header with small-caps eyebrow + serif title */
const SectionHead = ({ icon: Icon, label, title, dark = false }) => (
  <motion.div variants={fadeUp} className="text-center mb-14">
    <div className="inline-flex items-center gap-2.5 mb-4" style={{ color: dark ? GOLD : '#8a6f3a' }}>
      {Icon ? <Icon size={15} strokeWidth={1.5} /> : null}
      <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: '0.35em' }}>
        {label}
      </span>
    </div>
    <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: SERIF, color: dark ? '#f3efe4' : NAVY }}>
      {title}
    </h2>
    <GoldRule className="max-w-[220px] mx-auto mt-6" />
  </motion.div>
);

/* Monogram plaque for a missing avatar */
const MonogramPlaque = ({ name, size = 150 }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="flex items-center justify-center"
      style={{
        width: size, height: size, fontFamily: SERIF,
        background: `linear-gradient(150deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
        color: GOLD, fontSize: size * 0.3, letterSpacing: '0.1em',
        border: `1px solid ${GOLD_SOFT}`,
        boxShadow: 'inset 0 0 0 5px rgba(201,164,92,0.14)',
      }}>
      {initials || '—'}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{
        minHeight: '92vh',
        background: `radial-gradient(ellipse 60% 45% at 50% 30%, rgba(201,164,92,0.14), transparent 70%), linear-gradient(175deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
      }}>
      {/* marble column shadows at the edges */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-16 md:w-28 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.35), transparent)' }} />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-16 md:w-28 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.35), transparent)' }} />

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 px-6 max-w-3xl">
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <ScalesOfJustice />
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] font-semibold uppercase mb-6"
          style={{ letterSpacing: '0.5em', color: GOLD }}>
          Attorney at Law
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: SERIF, color: '#f3efe4' }}>
          {p.name || 'The Firm'}
        </motion.h1>
        {p.title ? (
          <motion.p variants={fadeUp} className="text-lg md:text-xl italic mb-4"
            style={{ fontFamily: SERIF, color: GOLD }}>
            {p.title}
          </motion.p>
        ) : null}
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-sm md:text-base max-w-xl mx-auto mb-4 leading-relaxed"
            style={{ color: 'rgba(243,239,228,0.65)' }}>
            {p.tagline}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="text-xs uppercase mb-10 flex items-center justify-center gap-2"
            style={{ letterSpacing: '0.3em', color: 'rgba(243,239,228,0.5)' }}>
            <MapPin size={13} strokeWidth={1.5} /> {p.location}
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#contact"
            className="px-8 py-3.5 text-xs font-semibold uppercase border transition-colors hover:bg-[#c9a45c] hover:text-[#0e1b33]"
            style={{ letterSpacing: '0.3em', color: GOLD, borderColor: GOLD }}>
            Request Consultation
          </a>
          <a href="#projects"
            className="px-8 py-3.5 text-xs font-semibold uppercase border transition-colors hover:border-[#c9a45c] hover:text-[#c9a45c]"
            style={{ letterSpacing: '0.3em', color: 'rgba(243,239,228,0.75)', borderColor: 'rgba(243,239,228,0.25)' }}>
            View Matters
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'Years in Practice', value: stats.yearsExperience },
    { label: 'Matters Handled', value: stats.projectsCompleted },
    { label: 'Satisfied Clients', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" style={MARBLE}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Landmark} label="The Practice" title="Counsel & Character" />
          <motion.div variants={fadeUp} className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2 flex justify-center">
              {/* double gold frame on a marble mat */}
              <div className="p-[6px]" style={{ border: `1px solid ${GOLD}`, background: 'rgba(201,164,92,0.08)' }}>
                <div className="p-4" style={{ background: PARCHMENT, border: `1px solid ${GOLD_SOFT}` }}>
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name || 'Portrait'}
                      className="w-48 h-56 md:w-52 md:h-60 object-cover"
                      style={{ filter: 'sepia(0.22) saturate(0.92) contrast(1.02)' }} />
                  ) : (
                    <MonogramPlaque name={p.name} size={192} />
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <p className="text-base md:text-lg leading-relaxed mb-8 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85]"
                style={{ fontFamily: SERIF, color: INK }}>
                {p.bio || 'The record of this practice is intentionally brief — its work speaks in filings, not flourishes.'}
              </p>
              {statItems.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-8" style={{ borderTop: `1px solid ${GOLD_SOFT}` }}>
                  {statItems.map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: '#8a6f3a' }}>
                        {s.value}
                      </div>
                      <div className="text-[10px] uppercase mt-2" style={{ letterSpacing: '0.25em', color: MUTED }}>
                        {s.label}
                      </div>
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

/* Skills — practice areas on marble columns */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'General Practice'))];
  return (
    <section id="skills" style={{ background: PARCHMENT }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={BookOpen} label="Expertise" title="Practice Areas" />
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp} className="mb-12 last:mb-0">
              <h3 className="text-xs font-semibold uppercase mb-5 text-center" style={{ letterSpacing: '0.4em', color: '#8a6f3a' }}>
                {cat}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.filter(s => (s.category || 'General Practice') === cat).map((skill, i) => {
                  const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                  return (
                    <div key={i} className="p-5 transition-shadow hover:shadow-md"
                      style={{ background: '#fdfbf5', border: `1px solid ${GOLD_SOFT}`, boxShadow: '0 1px 0 rgba(201,164,92,0.25)' }}>
                      <div className="flex items-center gap-2.5 mb-4">
                        <Scale size={13} strokeWidth={1.5} style={{ color: '#8a6f3a' }} />
                        <span className="font-semibold text-sm" style={{ fontFamily: SERIF, color: NAVY }}>{skill.name}</span>
                      </div>
                      <div className="h-[3px] w-full" style={{ background: 'rgba(201,164,92,0.18)' }}>
                        <motion.div className="h-full" style={{ background: GOLD }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: i * 0.08, ease: 'easeOut' }} />
                      </div>
                      <div className="text-[10px] uppercase mt-2 text-right" style={{ letterSpacing: '0.2em', color: MUTED }}>
                        Standing {level}
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

/* Projects — selected matters filed as case dossiers */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" className="relative"
      style={{ background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, ${NAVY} 100%)` }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Gavel} label="Portfolio" title="Selected Matters" dark />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col p-6 transition-transform hover:-translate-y-1"
                style={{
                  background: PARCHMENT,
                  border: `1px solid ${GOLD_SOFT}`,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(201,164,92,0.12)',
                }}>
                <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${GOLD_SOFT}` }}>
                  <span className="text-[10px] font-semibold uppercase" style={{ letterSpacing: '0.25em', color: '#8a6f3a' }}>
                    Matter No. {String(i + 1).padStart(3, '0')}-CV
                  </span>
                  <span className="w-1.5 h-1.5 rotate-45" style={{ background: GOLD }} />
                </div>
                {project.image ? (
                  <div className="mb-4 overflow-hidden" style={{ border: `1px solid ${GOLD_SOFT}` }}>
                    <img src={project.image} alt={project.title} className="w-full h-36 object-cover"
                      style={{ filter: 'sepia(0.15) saturate(0.9)' }} />
                  </div>
                ) : null}
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: SERIF, color: NAVY }}>{project.title}</h3>
                {project.description ? (
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: MUTED }}>
                    {project.description}
                  </p>
                ) : null}
                {(project.techStack || []).length > 0 && (
                  <p className="text-[10px] uppercase mb-5" style={{ letterSpacing: '0.2em', color: '#8a6f3a' }}>
                    <span className="font-semibold">Areas:</span> {(project.techStack || []).join(', ')}
                  </p>
                )}
                <div className="flex gap-5 pt-3" style={{ borderTop: `1px solid ${GOLD_SOFT}` }}>
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase transition-colors hover:text-[#8a6f3a]"
                      style={{ letterSpacing: '0.18em', color: NAVY }}>
                      <ExternalLink size={13} strokeWidth={1.5} /> Exhibit A
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase transition-colors hover:text-[#8a6f3a]"
                      style={{ letterSpacing: '0.18em', color: NAVY }}>
                      <Github size={13} strokeWidth={1.5} /> Record
                    </a>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — the case history docket */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={MARBLE}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Gavel} label="Track Record" title="Case History" />
          <div>
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp}
                className="grid md:grid-cols-4 gap-2 md:gap-8 py-8"
                style={{ borderTop: i === 0 ? 'none' : `1px solid ${GOLD_SOFT}` }}>
                <div className="md:col-span-1">
                  <span className="text-xs font-semibold uppercase py-1 px-2 inline-block"
                    style={{ letterSpacing: '0.2em', color: NAVY, border: `1px solid ${GOLD_SOFT}`, background: PARCHMENT }}>
                    {exp.period}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl md:text-2xl font-bold" style={{ fontFamily: SERIF, color: NAVY }}>
                    {exp.role}
                  </h3>
                  <p className="text-sm font-semibold uppercase mb-3 mt-1" style={{ letterSpacing: '0.18em', color: '#8a6f3a' }}>
                    {exp.company}
                  </p>
                  {exp.description ? (
                    <p className="text-sm leading-relaxed" style={{ color: MUTED, fontFamily: SERIF }}>
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — counsel from former clients, in serif */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={{ background: PARCHMENT }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Scale} label="References" title="Client Counsel" />
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => {
              const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.figure key={i} variants={fadeUp} className="p-7 relative"
                  style={{ background: '#fdfbf5', border: `1px solid ${GOLD_SOFT}`, boxShadow: '0 2px 0 rgba(201,164,92,0.25)' }}>
                  <span aria-hidden="true" className="absolute top-4 right-6 text-7xl leading-none font-bold select-none"
                    style={{ fontFamily: SERIF, color: 'rgba(201,164,92,0.3)' }}>&rdquo;</span>
                  <blockquote className="text-sm md:text-base leading-relaxed italic mb-6 pr-8"
                    style={{ fontFamily: SERIF, color: INK }}>
                    {t.text}
                  </blockquote>
                  <figcaption className="flex items-center gap-4 pt-4" style={{ borderTop: `1px solid ${GOLD_SOFT}` }}>
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                        style={{ border: `1px solid ${GOLD_SOFT}`, filter: 'sepia(0.2)' }} />
                    ) : (
                      <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: NAVY, color: GOLD, fontFamily: SERIF }}>
                        {initials}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-bold" style={{ fontFamily: SERIF, color: NAVY }}>{t.name}</span>
                      <span className="block text-[11px] uppercase" style={{ letterSpacing: '0.18em', color: MUTED }}>{t.role}</span>
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
  const email = socials.email || p.email;
  const socialLinks = [
    { key: 'github', label: 'GitHub', href: socials.github, Icon: Github },
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: Linkedin },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: Twitter },
  ].filter(l => l.href);

  return (
    <section id="contact" className="relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse 55% 40% at 50% 25%, rgba(201,164,92,0.12), transparent 70%), linear-gradient(175deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <ScalesOfJustice size={72} />
          </motion.div>
          <SectionHead icon={Mail} label="Correspondence" title="Request a Consultation" dark />
          <motion.p variants={fadeUp} className="text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(243,239,228,0.65)', fontFamily: SERIF }}>
            Every matter begins with a conversation. All inquiries are reviewed personally and answered in strict confidence.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            {email ? (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs font-semibold uppercase transition-colors hover:bg-[#c9a45c] hover:text-[#0e1b33]"
                style={{ letterSpacing: '0.3em', color: GOLD, border: `1px solid ${GOLD}` }}>
                <Mail size={15} strokeWidth={1.5} /> {email}
              </a>
            ) : null}
          </motion.div>
          {p.phone ? (
            <motion.p variants={fadeUp} className="text-sm mb-8 flex items-center justify-center gap-2"
              style={{ color: 'rgba(243,239,228,0.7)' }}>
              <Phone size={14} strokeWidth={1.5} style={{ color: GOLD }} /> {p.phone}
            </motion.p>
          ) : null}
          <motion.div variants={fadeUp} className="flex justify-center gap-4">
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}
                className="w-11 h-11 flex items-center justify-center rounded-full transition-colors hover:bg-[#c9a45c] hover:text-[#0e1b33]"
                style={{ border: `1px solid ${GOLD_SOFT}`, color: GOLD }}>
                <l.Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
      {/* footer */}
      <footer style={{ borderTop: `4px double ${GOLD}` }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] uppercase" style={{ letterSpacing: '0.25em', color: 'rgba(243,239,228,0.5)' }}>
            &copy; {new Date().getFullYear()} {p.name || 'The Firm'}. All rights reserved.
          </p>
          <p className="text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: GOLD }}>
            Established — Integrity — Results
          </p>
        </div>
      </footer>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function LawFirmClassic() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'The Firm', href: '#about' },
    { label: 'Practice', href: '#skills' },
    { label: 'Matters', href: '#projects' },
    { label: 'History', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased" style={{ fontFamily: SERIF, color: INK, background: NAVY }}>
      {/* top bar */}
      <nav className="fixed top-0 inset-x-0 z-40"
        style={{ background: 'rgba(10,20,38,0.92)', borderBottom: `1px solid ${GOLD_SOFT}`, boxShadow: '0 1px 0 rgba(201,164,92,0.2)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3">
            <Scale size={18} strokeWidth={1.5} style={{ color: GOLD }} />
            <span className="text-sm font-bold uppercase" style={{ letterSpacing: '0.28em', color: '#f3efe4' }}>
              {p.name || 'The Firm'}
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-[11px] font-semibold uppercase transition-colors hover:text-[#c9a45c]"
                style={{ letterSpacing: '0.25em', color: 'rgba(243,239,228,0.75)' }}>
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
