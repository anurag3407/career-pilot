import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MapPin, Mail, Github, Linkedin, Twitter, ArrowRight,
  Users, Globe, HandHeart, Sprout, Quote, Target, CalendarDays, ExternalLink
} from 'lucide-react';

/**
 * NGO Nonprofit Portfolio Template
 * Category: Professional / Industry
 * Description: Nonprofit/charity style with impact stats with large counters, warm earth tones, donation CTA, volunteer stories, progress bars for goals.
 */

/* ------------------------------------------------------------------ */
/* Palette — warm earth: terracotta, olive, sun, cream                 */
/* ------------------------------------------------------------------ */
const CREAM = '#fbf6ec';
const CREAM_DEEP = '#f4ecdc';
const TERRA = '#c4552d';
const TERRA_DEEP = '#a54523';
const OLIVE = '#4a5a3c';
const OLIVE_DEEP = '#3c4a31';
const SUN = '#e9b44c';
const BROWN = '#35281b';
const MUTED = 'rgba(53,40,27,0.62)';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/* Animated counter — interval-driven, no rAF/IntersectionObserver      */
/* ------------------------------------------------------------------ */
const Counter = ({ value, duration = 1500, className = '', style = {} }) => {
  const target = Math.max(0, Number(value) || 0);
  const [n, setN] = useState(0);
  useEffect(() => {
    let timer;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) timer = setTimeout(tick, 28);
    };
    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, [target, duration]);
  return <span className={className} style={style}>{n.toLocaleString()}</span>;
};

/* Section header — hand-raised, mission-flavored */
const SectionHead = ({ icon: Icon, label, title, light = false }) => (
  <motion.div variants={fadeUp} className="text-center mb-12">
    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full"
      style={{
        background: light ? 'rgba(251,246,236,0.12)' : `${SUN}33`,
        color: light ? SUN : TERRA_DEEP,
      }}>
      {Icon ? <Icon size={14} strokeWidth={1.8} /> : null}
      <span className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.28em' }}>{label}</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight"
      style={{ color: light ? CREAM : BROWN }}>
      {title}
    </h2>
  </motion.div>
);

const Monogram = ({ name, size = 40, bg = SUN, fg = BROWN }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="shrink-0 inline-flex items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.34 }}>
      {initials || '?'}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, #fdf3d8 0%, ${CREAM} 70%)` }}>
      {/* rising sun */}
      <div aria-hidden="true" className="absolute -top-24 right-[8%] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle at 45% 45%, #f5c96a 0%, ${SUN} 55%, rgba(233,180,76,0) 72%)`, opacity: 0.75 }} />
      {/* rolling hills */}
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 pointer-events-none leading-none">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="w-full h-28 md:h-44">
          <path d="M0,120 C240,60 420,150 720,110 C980,76 1200,140 1440,96 L1440,180 L0,180 Z" fill="rgba(74,90,60,0.25)" />
          <path d="M0,150 C300,100 560,170 860,140 C1100,116 1300,160 1440,140 L1440,180 L0,180 Z" fill="rgba(74,90,60,0.45)" />
        </svg>
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger}
        className="relative z-10 max-w-3xl mx-auto px-6 pt-36 pb-40 text-center">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: '#ffffff', boxShadow: '0 2px 10px rgba(53,40,27,0.08)', border: `1px solid ${SUN}66` }}>
          <Sprout size={15} strokeWidth={1.8} style={{ color: OLIVE }} />
          <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.22em', color: OLIVE }}>
            Community powered · Non-profit
          </span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5" style={{ color: BROWN }}>
          {p.name || 'Our Mission'}
        </motion.h1>
        {p.title ? (
          <motion.p variants={fadeUp} className="text-lg md:text-xl font-semibold mb-4" style={{ color: TERRA }}>
            {p.title}
          </motion.p>
        ) : null}
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-xl mx-auto mb-4 leading-relaxed" style={{ color: MUTED }}>
            {p.tagline}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: MUTED }}>
            <MapPin size={14} strokeWidth={1.8} /> {p.location}
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: TERRA, color: '#ffffff', boxShadow: '0 8px 20px rgba(196,85,45,0.35)' }}>
            <HandHeart size={17} strokeWidth={1.8} /> Join the mission
          </a>
          <a href="#projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-colors hover:bg-[#4a5a3c] hover:text-white"
            style={{ border: `2px solid ${OLIVE}`, color: OLIVE }}>
            See our programs <ArrowRight size={16} strokeWidth={1.8} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Impact band — big animated counters */
const Impact = ({ data }) => {
  const stats = data.stats || {};
  const items = [
    { Icon: CalendarDays, label: 'Years of service', value: stats.yearsExperience, suffix: '+' },
    { Icon: Sprout, label: 'Programs delivered', value: stats.projectsCompleted, suffix: '+' },
    { Icon: Users, label: 'Lives touched', value: stats.happyClients, suffix: '+' },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  if (!items.length) return null;
  return (
    <section className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${OLIVE} 0%, ${OLIVE_DEEP} 100%)` }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 10%, rgba(233,180,76,0.18), transparent 70%)' }} />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
        className="relative max-w-4xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10 text-center">
        {items.map((s, i) => (
          <motion.div key={i} variants={fadeUp}>
            <s.Icon size={22} strokeWidth={1.6} className="mx-auto mb-3" style={{ color: SUN }} />
            <Counter value={s.value} className="text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: CREAM }} />
            <span className="text-3xl font-extrabold" style={{ color: SUN }}>{s.suffix}</span>
            <p className="text-xs font-semibold uppercase mt-2" style={{ letterSpacing: '0.25em', color: 'rgba(251,246,236,0.7)' }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="about" style={{ background: CREAM }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Globe} label="Our Story" title="Why we do this work" />
          <motion.div variants={fadeUp} className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="relative">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name || 'Portrait'}
                    className="w-52 h-52 md:w-60 md:h-60 rounded-full object-cover"
                    style={{ border: `6px solid ${SUN}`, boxShadow: '0 10px 30px rgba(53,40,27,0.15)' }} />
                ) : (
                  <div className="w-52 h-52 md:w-60 md:h-60 rounded-full flex items-center justify-center"
                    style={{ border: `6px solid ${SUN}`, background: CREAM_DEEP, boxShadow: '0 10px 30px rgba(53,40,27,0.15)' }}>
                    <Monogram name={p.name} size={90} bg={TERRA} fg="#ffffff" />
                  </div>
                )}
                <span className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center rotate-6"
                  style={{ background: OLIVE, boxShadow: '0 6px 16px rgba(53,40,27,0.2)' }}>
                  <Sprout size={26} strokeWidth={1.6} style={{ color: SUN }} />
                </span>
              </div>
            </div>
            <div className="md:col-span-3">
              <p className="text-base md:text-lg leading-loose mb-6" style={{ color: BROWN }}>
                {p.bio || 'This story is still being written — and there is a seat at the table with your name on it.'}
              </p>
              <div className="flex flex-wrap gap-3">
                {['Community first', 'Radical transparency', 'Hands-on help'].map((v, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: `${OLIVE}14`, color: OLIVE, border: `1px solid ${OLIVE}33` }}>
                    <Sprout size={12} strokeWidth={1.8} /> {v}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Goals — progress bars toward the next milestone */
const Goals = ({ data }) => {
  const stats = data.stats || {};
  const pc = Number(stats.projectsCompleted) || 0;
  const goals = [
    { label: 'Community programs funded', current: pc, target: Math.max(50, Math.ceil((pc + 1) / 25) * 25) },
    { label: 'Volunteer network growing', current: Math.max(0, pc * 2), target: Math.max(100, pc * 4) },
    { label: 'This year\u2019s outreach goal', current: Math.max(0, Math.round(pc * 1.5)), target: Math.max(75, Math.round(pc * 2.5)) },
  ];
  return (
    <section style={{ background: CREAM_DEEP }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Target} label="Where we're headed" title="Goals in progress" />
          <div className="space-y-8">
            {goals.map((g, i) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <motion.div key={i} variants={fadeUp}>
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="font-bold text-sm md:text-base" style={{ color: BROWN }}>{g.label}</span>
                    <span className="text-xs font-bold" style={{ color: TERRA }}>{pct}%</span>
                  </div>
                  <div className="h-3.5 rounded-full overflow-hidden" style={{ background: 'rgba(53,40,27,0.08)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${TERRA}, ${SUN})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }} />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: MUTED }}>
                    {g.current.toLocaleString()} of {g.target.toLocaleString()} — every bit of help moves the needle.
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Skills — what we bring to the table */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" style={{ background: CREAM }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={HandHeart} label="Our toolkit" title="What we bring" />
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp} className="mb-10 last:mb-0">
              <h3 className="inline-flex items-center gap-2 text-sm font-extrabold uppercase mb-5 px-4 py-1.5 rounded-full"
                style={{ letterSpacing: '0.2em', color: '#ffffff', background: OLIVE }}>
                <Sprout size={13} strokeWidth={1.8} /> {cat}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => {
                  const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                  return (
                    <div key={i} className="p-5 rounded-2xl transition-transform hover:-translate-y-1"
                      style={{ background: '#ffffff', border: `1px solid ${CREAM_DEEP}`, boxShadow: '0 4px 14px rgba(53,40,27,0.07)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm" style={{ color: BROWN }}>{skill.name}</span>
                        <span className="text-xs font-extrabold" style={{ color: TERRA }}>{level}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: CREAM_DEEP }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${OLIVE}, ${SUN})` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.06, ease: 'easeOut' }} />
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

/* Projects — programs & initiatives */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${CREAM_DEEP} 0%, ${CREAM} 100%)` }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionHead icon={Sprout} label="Our work" title="Programs & initiatives" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project, i) => {
              const pct = 55 + ((i * 17) % 45);
              const tech = project.techStack || [];
              return (
                <motion.div key={i} variants={fadeUp} className="rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1.5"
                  style={{ background: '#ffffff', boxShadow: '0 6px 20px rgba(53,40,27,0.09)', border: `1px solid ${CREAM_DEEP}` }}>
                  <div className="h-40 relative overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(140deg, ${OLIVE} 0%, ${OLIVE_DEEP} 100%)` }}>
                        <Sprout size={40} strokeWidth={1.2} style={{ color: SUN }} />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase"
                      style={{ letterSpacing: '0.15em', background: SUN, color: BROWN }}>
                      Initiative {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold mb-2" style={{ color: BROWN }}>{project.title}</h3>
                    {project.description ? (
                      <p className="text-[13px] leading-relaxed mb-4 flex-1" style={{ color: MUTED }}>
                        {project.description}
                      </p>
                    ) : null}
                    {tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tech.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: `${OLIVE}14`, color: OLIVE }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: CREAM_DEEP }}>
                      <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${TERRA}, ${SUN})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase mb-4" style={{ letterSpacing: '0.15em', color: MUTED }}>
                      {pct}% funded this quarter
                    </p>
                    <div className="flex gap-4">
                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                          style={{ color: TERRA }}>
                          <ExternalLink size={13} strokeWidth={1.8} /> Learn more
                        </a>
                      ) : null}
                      {project.githubUrl ? (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                          style={{ color: OLIVE }}>
                          <Github size={13} strokeWidth={1.8} /> Source
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — milestones along the way */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={{ background: CREAM }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={CalendarDays} label="The journey" title="Milestones" />
          <div className="relative pl-10 md:pl-14">
            <div className="absolute left-4 md:left-5 top-2 bottom-2 w-[3px] rounded-full" style={{ background: `${OLIVE}33` }} />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[30px] md:-left-[38px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: i === 0 ? TERRA : OLIVE, boxShadow: '0 0 0 5px rgba(74,90,60,0.15)' }}>
                  <Sprout size={14} strokeWidth={1.8} style={{ color: '#ffffff' }} />
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase mb-3"
                  style={{ letterSpacing: '0.15em', background: `${SUN}30`, color: TERRA_DEEP }}>
                  {exp.period}
                </span>
                <h3 className="text-xl font-extrabold" style={{ color: BROWN }}>{exp.role}</h3>
                <p className="text-sm font-bold mb-2" style={{ color: OLIVE }}>{exp.company}</p>
                {exp.description ? (
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{exp.description}</p>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — stories from the field */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={{ background: CREAM_DEEP }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Quote} label="Volunteer voices" title="Stories from the field" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl p-6 relative"
                style={{ background: '#ffffff', boxShadow: '0 6px 18px rgba(53,40,27,0.08)', border: `1px solid ${CREAM_DEEP}` }}>
                <span className="absolute -top-4 left-6 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: SUN, boxShadow: '0 4px 10px rgba(233,180,76,0.4)' }}>
                  <Quote size={16} strokeWidth={1.8} style={{ color: BROWN }} />
                </span>
                <blockquote className="text-sm leading-relaxed mt-3 mb-5" style={{ color: BROWN }}>
                  {t.text}
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4" style={{ borderTop: `1px dashed ${SUN}` }}>
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                      style={{ border: `2px solid ${SUN}` }} />
                  ) : (
                    <Monogram name={t.name} />
                  )}
                  <span>
                    <span className="block text-sm font-extrabold" style={{ color: BROWN }}>{t.name}</span>
                    <span className="block text-xs font-semibold" style={{ color: TERRA }}>{t.role}</span>
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
    <section id="contact" className="relative overflow-hidden" style={{ background: `linear-gradient(170deg, ${OLIVE_DEEP} 0%, #2e3a25 100%)` }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 45% 50% at 15% 20%, rgba(233,180,76,0.14), transparent 70%)' }} />
      <div className="relative max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: TERRA, boxShadow: '0 0 0 10px rgba(196,85,45,0.2)' }}>
              <Heart size={26} strokeWidth={1.8} style={{ color: '#ffffff' }} />
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: CREAM }}>
            Join the mission
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'rgba(251,246,236,0.7)' }}>
            Every message is a seed. Reach out to volunteer, partner, or simply say hello — we answer every single one.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            {email ? (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: TERRA, color: '#ffffff', boxShadow: '0 8px 20px rgba(196,85,45,0.4)' }}>
                <Mail size={17} strokeWidth={1.8} /> Email us
              </a>
            ) : null}
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm transition-colors hover:bg-[rgba(251,246,236,0.12)]"
                style={{ border: `1.5px solid rgba(251,246,236,0.35)`, color: CREAM }}>
                <l.Icon size={16} strokeWidth={1.8} /> {l.label}
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs" style={{ color: 'rgba(251,246,236,0.5)' }}>
            &copy; {new Date().getFullYear()} {p.name || ''} — made with heart, run on hope.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function NGONonprofit() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'Our Story', href: '#about' },
    { label: 'Goals', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Programs', href: '#projects' },
    { label: 'Stories', href: '#testimonials' },
    { label: 'Join', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: CREAM, color: BROWN, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(251,246,236,0.9)', boxShadow: '0 1px 0 rgba(53,40,27,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: TERRA }}>
              <Sprout size={17} strokeWidth={1.8} style={{ color: '#ffffff' }} />
            </span>
            <span className="font-extrabold text-sm tracking-tight" style={{ color: BROWN }}>{p.name || 'The Mission'}</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, i) => (
              <a key={i} href={item.href}
                className="text-xs font-bold uppercase transition-colors hover:text-[#c4552d]"
                style={{ letterSpacing: '0.16em', color: MUTED }}>
                {item.label}
              </a>
            ))}
            <a href="#contact"
              className="px-4 py-2 rounded-full text-xs font-extrabold uppercase transition-opacity hover:opacity-90"
              style={{ letterSpacing: '0.16em', background: TERRA, color: '#ffffff' }}>
              Join the mission
            </a>
          </div>
        </div>
      </nav>

      <Hero data={data} />
      <Impact data={data} />
      {(p.bio || p.avatar) ? <About data={data} /> : null}
      <Goals data={data} />
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
