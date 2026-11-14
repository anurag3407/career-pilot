import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame, FlameKindling, Mail, Github, Linkedin, Twitter, MapPin,
  ExternalLink, Thermometer, Quote
} from 'lucide-react';

/**
 * Ember Glow Portfolio Template
 * Category: Dark / Moody
 * Description: Dark mode with warm ember/fire glow accents. Subtle orange particle effects. Feels like sitting by a campfire at night. Warm and inviting dark theme.
 */

const NIGHT = '#0c0604';
const NIGHT_2 = '#150a06';
const EMBER = '#ff7a18';
const EMBER_DEEP = '#ff3d00';
const GOLD = '#ffb347';
const CREAM = '#f5e6d3';
const CREAM_DIM = 'rgba(245,230,211,0.62)';
const PANEL = 'rgba(28,15,9,0.85)';
const BORDER = 'rgba(255,122,24,0.24)';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } }
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((w) => w[0].toUpperCase()).join('')) || 'A';
};

// One ember particle drifting upward on a deterministic path
const Ember = ({ i, spread = 100 }) => {
  const left = (i * 37 + 3) % spread;
  const size = 2 + ((i * 13) % 4);
  const dur = 8 + ((i * 7) % 7);
  const delay = (i * 11) % 12;
  const drift = (i % 2 ? 1 : -1) * (18 + ((i * 29) % 36));
  const color = [GOLD, EMBER, EMBER_DEEP][i % 3];
  return (
    <motion.span aria-hidden
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${left}%`, bottom: '-14px',
        width: size, height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
      animate={{
        y: [0, -260, -500, -760, -1000],
        x: [0, drift * 0.5, -drift * 0.4, drift * 0.7, 0],
        opacity: [0, 1, 1, 0.85, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, delay, ease: 'linear' }} />
  );
};

// Little CSS/SVG campfire with flickering flame layers
const Campfire = () => (
  <div className="relative w-36 h-32 mx-auto">
    <motion.div aria-hidden
      className="absolute -inset-10 rounded-full"
      animate={{ opacity: [0.5, 0.85, 0.6, 0.9, 0.5], scale: [1, 1.08, 0.96, 1.06, 1] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ background: 'radial-gradient(closest-side, rgba(255,122,24,0.3), transparent 70%)' }} />
    <svg viewBox="0 0 120 120" className="relative w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="flameOuter" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={EMBER_DEEP} />
          <stop offset="100%" stopColor={EMBER} />
        </linearGradient>
        <linearGradient id="flameInner" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff9a3d" />
          <stop offset="100%" stopColor="#ffe9b3" />
        </linearGradient>
      </defs>
      <motion.g style={{ transformOrigin: '60px 108px' }}
        animate={{ scaleY: [1, 1.08, 0.96, 1.05, 1], scaleX: [1, 0.96, 1.05, 0.97, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M60 18 C 76 40, 90 52, 90 72 A 30 30 0 1 1 30 72 C 30 52 44 40 60 18 Z" fill="url(#flameOuter)" />
        <path d="M60 44 C 69 56, 76 62, 76 74 A 16 16 0 1 1 44 74 C 44 62 51 56 60 44 Z" fill="url(#flameInner)" />
        <circle cx="60" cy="80" r="6" fill="#fff6dd" />
      </motion.g>
      <rect x="22" y="104" width="76" height="9" rx="4.5" fill="#4a2c17" transform="rotate(-7 60 108)" />
      <rect x="22" y="104" width="76" height="9" rx="4.5" fill="#5d3a20" transform="rotate(7 60 108)" />
    </svg>
  </div>
);

// Section heading with ember divider
const EmberHead = ({ kicker, title }) => (
  <motion.div variants={fadeUp} className="mb-12 text-center">
    <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.4em] mb-3" style={{ color: GOLD }}>
      <Flame size={13} /> {kicker}
    </p>
    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: CREAM }}>{title}</h2>
    <div aria-hidden className="mx-auto mt-4 h-[3px] w-44 rounded-full"
      style={{ background: `linear-gradient(90deg, transparent, ${EMBER}, ${GOLD}, ${EMBER}, transparent)`, boxShadow: '0 0 16px rgba(255,122,24,0.5)' }} />
  </motion.div>
);

export default function EmberGlow() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  const navItems = [
    { label: 'By the fire', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Heat', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Sparks', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Logs', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Warmth', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Gather round', href: '#contact', show: true },
  ].filter((item) => item.show);

  return (
    <div className="antialiased overflow-x-hidden font-sans" style={{ background: NIGHT, color: CREAM }}>
      {/* global drifting embers + vignette */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => <Ember key={i} i={i + 40} />)}
        <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 220px rgba(0,0,0,0.9)' }} />
      </div>

      {/* nav */}
      <nav className="fixed top-0 inset-x-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: BORDER, background: 'rgba(12,6,4,0.82)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest whitespace-nowrap pr-3" style={{ color: EMBER }}>
            <FlameKindling size={15} /> EMBER&nbsp;GLOW
          </span>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="whitespace-nowrap text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors hover:bg-[#ff7a18] hover:text-[#1a0d05]"
              style={{ borderColor: 'transparent', color: CREAM_DIM }}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20 z-10"
        style={{ background: `radial-gradient(720px 460px at 50% 92%, rgba(255,122,24,0.16), transparent 65%), radial-gradient(500px 320px at 50% 100%, rgba(255,61,0,0.12), transparent 60%), linear-gradient(180deg, ${NIGHT} 0%, ${NIGHT_2} 100%)` }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => <Ember key={i} i={i} />)}
        </div>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative max-w-2xl text-center">
          <motion.div variants={fadeUp}><Campfire /></motion.div>
          <motion.p variants={fadeUp} className="mt-8 text-[11px] uppercase tracking-[0.45em]" style={{ color: GOLD }}>
            gathered around the fire
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mt-4 mb-5 break-words"
            style={{ color: CREAM, textShadow: '0 0 30px rgba(255,122,24,0.35)' }}>
            {name}
          </motion.h1>
          {data.personal?.title && (
            <motion.p variants={fadeUp} className="text-xl md:text-2xl font-semibold mb-4 bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${GOLD}, ${EMBER}, ${EMBER_DEEP})` }}>
              {data.personal.title}
            </motion.p>
          )}
          {data.personal?.tagline && (
            <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6" style={{ color: CREAM_DIM }}>
              {data.personal.tagline}
            </motion.p>
          )}
          {data.personal?.location && (
            <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-10"
              style={{ color: CREAM_DIM }}>
              <MapPin size={13} style={{ color: EMBER }} /> {data.personal.location}
            </motion.p>
          )}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a href="#projects"
              className="px-7 py-3 rounded-full text-sm font-bold transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${EMBER}, ${EMBER_DEEP})`, color: '#fff4e0', boxShadow: '0 0 28px rgba(255,122,24,0.45)' }}>
              Watch the sparks
            </a>
            <a href="#about"
              className="px-7 py-3 rounded-full text-sm font-bold border transition-transform hover:-translate-y-0.5"
              style={{ borderColor: BORDER, color: CREAM }}>
              Sit with me
            </a>
            <a href="#contact"
              className="px-7 py-3 rounded-full text-sm font-bold border transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(245,230,211,0.25)', color: CREAM_DIM }}>
              Gather round
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      {(data.personal?.bio || data.personal?.avatar) && (
        <section id="about" className="relative py-24 px-6 z-10" style={{ background: NIGHT_2 }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <EmberHead kicker="By the fire" title="A warm introduction" />
              <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
                <motion.div variants={fadeUp} className="mx-auto">
                  {data.personal?.avatar ? (
                    <div className="relative w-52 h-60 rounded-2xl overflow-hidden border-2"
                      style={{ borderColor: BORDER, boxShadow: '0 0 34px rgba(255,122,24,0.28)' }}>
                      <img src={data.personal.avatar} alt={name} className="w-full h-full object-cover" />
                      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(255,122,24,0.18))' }} />
                    </div>
                  ) : (
                    <div className="relative w-52 h-60 rounded-2xl flex flex-col items-center justify-center gap-3 border-2"
                      style={{ borderColor: BORDER, background: `radial-gradient(140px 140px at 50% 30%, rgba(255,122,24,0.14), transparent), ${PANEL}`, boxShadow: '0 0 30px rgba(255,122,24,0.2)' }}>
                      <Flame size={24} style={{ color: EMBER }} />
                      <span className="text-5xl font-bold tracking-widest" style={{ color: CREAM }}>{initialsOf(name)}</span>
                      <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: CREAM_DIM }}>warmed by firelight</span>
                    </div>
                  )}
                </motion.div>
                <motion.div variants={fadeUp}>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: CREAM_DIM }}>
                    {data.personal?.bio || 'The fire is lit and the story is still being told. This spot is reserved for the full biography.'}
                  </p>
                  {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                    <div className="grid grid-cols-3 gap-4 mt-9">
                      {[
                        { label: 'Years stoking', value: data.stats.yearsExperience },
                        { label: 'Sparks shipped', value: data.stats.projectsCompleted },
                        { label: 'Warm guests', value: data.stats.happyClients },
                      ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                        <div key={i} className="rounded-xl border p-4 text-center"
                          style={{ borderColor: BORDER, background: PANEL }}>
                          <Flame size={15} className="mx-auto mb-2" style={{ color: EMBER }} />
                          <div className="text-3xl font-bold" style={{ color: GOLD }}>{s.value}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] mt-1.5" style={{ color: CREAM_DIM }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS — heat bars */}
      {data.skills?.length > 0 && (
        <section id="skills" className="relative py-24 px-6 z-10" style={{ background: NIGHT }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <EmberHead kicker="Heat check" title="Skills at temperature" />
              <div className="space-y-6">
                {data.skills.map((skill, i) => {
                  const level = Number(skill.level) || 85;
                  return (
                    <motion.div key={i} variants={fadeUp}>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-semibold flex items-center gap-2" style={{ color: CREAM }}>
                          <Thermometer size={14} style={{ color: level > 90 ? EMBER_DEEP : EMBER }} />
                          {skill.name || 'Skill'}
                        </span>
                        <span className="text-xs font-bold" style={{ color: GOLD }}>{level}%</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden border"
                        style={{ borderColor: 'rgba(255,122,24,0.3)', background: 'rgba(42,24,16,0.9)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }} whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }} transition={{ duration: 1.1, delay: (i % 4) * 0.12 }}
                          style={{ background: `linear-gradient(90deg, ${GOLD}, ${EMBER} 55%, ${EMBER_DEEP})`, boxShadow: '0 0 14px rgba(255,122,24,0.7)' }} />
                      </div>
                      {skill.category && (
                        <span className="text-[10px] uppercase tracking-[0.2em] mt-1.5 inline-block" style={{ color: CREAM_DIM }}>
                          {skill.category}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROJECTS — sparks */}
      {data.projects?.length > 0 && (
        <section id="projects" className="relative py-24 px-6 z-10" style={{ background: NIGHT_2 }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
              <EmberHead kicker="Fresh sparks" title="Projects that caught fire" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.projects.map((project, i) => (
                  <motion.article key={i} variants={fadeUp}
                    className="rounded-2xl border overflow-hidden transition-all hover:-translate-y-1.5"
                    style={{ borderColor: BORDER, background: PANEL, boxShadow: '0 10px 34px rgba(0,0,0,0.5)' }}>
                    {project.image && (
                      <div className="relative h-40 overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" style={{ filter: 'brightness(0.9) saturate(1.05)' }} />
                        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(21,10,6,0.95))' }} />
                        <Flame size={16} className="absolute top-3 right-3" style={{ color: EMBER, filter: 'drop-shadow(0 0 6px rgba(255,122,24,0.8))' }} />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2" style={{ color: CREAM }}>{project.title}</h3>
                      {project.description && (
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: CREAM_DIM }}>{project.description}</p>
                      )}
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.techStack.slice(0, 8).map((tech, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full border"
                              style={{ borderColor: 'rgba(255,179,71,0.4)', color: GOLD }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 text-xs font-semibold">
                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-75" style={{ color: EMBER }}>
                            <ExternalLink size={13} /> See it burn
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-75" style={{ color: CREAM_DIM }}>
                            <Github size={13} /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* EXPERIENCE — logs on the fire */}
      {data.experience?.length > 0 && (
        <section id="experience" className="relative py-24 px-6 z-10" style={{ background: NIGHT }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <EmberHead kicker="The long burn" title="Logs on the fire" />
              <div className="relative pl-8">
                <div aria-hidden className="absolute left-[9px] top-1 bottom-1 w-[3px] rounded-full"
                  style={{ background: `linear-gradient(180deg, ${GOLD}, ${EMBER}, ${EMBER_DEEP})`, boxShadow: '0 0 12px rgba(255,122,24,0.5)' }} />
                <div className="space-y-10">
                  {data.experience.map((exp, i) => (
                    <motion.div key={i} variants={fadeUp} className="relative">
                      <span aria-hidden className="absolute -left-8 top-1.5 w-[19px] h-[19px] rounded-full flex items-center justify-center"
                        style={{ background: NIGHT, border: `2px solid ${EMBER}`, boxShadow: '0 0 14px rgba(255,122,24,0.6)' }}>
                        <Flame size={9} style={{ color: GOLD }} />
                      </span>
                      {exp.period && (
                        <span className="inline-block text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border mb-2.5"
                          style={{ borderColor: 'rgba(255,179,71,0.4)', color: GOLD }}>
                          {exp.period}
                        </span>
                      )}
                      <h3 className="text-xl font-bold" style={{ color: CREAM }}>{exp.role || 'Role'}</h3>
                      {exp.company && <p className="text-sm font-semibold mt-0.5 mb-2" style={{ color: EMBER }}>@ {exp.company}</p>}
                      {exp.description && <p className="text-sm leading-relaxed" style={{ color: CREAM_DIM }}>{exp.description}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {data.testimonials?.length > 0 && (
        <section id="testimonials" className="relative py-24 px-6 z-10" style={{ background: NIGHT_2 }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <EmberHead kicker="Warm words" title="Stories from the fireside" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.testimonials.map((t, i) => (
                  <motion.figure key={i} variants={fadeUp}
                    className="rounded-2xl border p-6 transition-transform hover:-translate-y-1"
                    style={{ borderColor: BORDER, background: PANEL, boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }}>
                    <Quote size={19} style={{ color: GOLD }} className="mb-3" />
                    <blockquote className="text-sm leading-relaxed mb-5" style={{ color: CREAM_DIM }}>&ldquo;{t.text}&rdquo;</blockquote>
                    <figcaption className="flex items-center gap-3">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: BORDER }} />
                      ) : (
                        <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2"
                          style={{ borderColor: BORDER, color: GOLD, background: 'rgba(255,122,24,0.1)' }}>
                          {initialsOf(t.name)}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-bold" style={{ color: CREAM }}>{t.name || 'Anonymous'}</span>
                        {t.role && <span className="block text-xs" style={{ color: CREAM_DIM }}>{t.role}</span>}
                      </span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="relative py-28 px-6 overflow-hidden z-10"
        style={{ background: `radial-gradient(640px 360px at 50% 105%, rgba(255,122,24,0.2), transparent 65%), ${NIGHT}` }}>
        <div className="max-w-2xl mx-auto text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <FlameKindling size={30} className="mx-auto mb-5" style={{ color: EMBER, filter: 'drop-shadow(0 0 10px rgba(255,122,24,0.7))' }} />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-5" style={{ color: CREAM }}>
              Pull up a log
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm md:text-base mb-10" style={{ color: CREAM_DIM }}>
              The fire is burning late tonight. Bring an idea, leave with a spark.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-4 mb-9">
              {(data.personal?.email || data.socials?.email) && (
                <a href={`mailto:${data.personal?.email || data.socials?.email}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(90deg, ${EMBER}, ${EMBER_DEEP})`, color: '#fff4e0', boxShadow: '0 0 34px rgba(255,122,24,0.5)' }}>
                  <Mail size={17} /> Light a signal
                </a>
              )}
              {['github', 'linkedin', 'twitter'].map((key) => {
                const url = data.socials?.[key];
                if (!url) return null;
                const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-transform hover:-translate-y-1"
                    style={{ borderColor: BORDER, color: CREAM, background: PANEL }}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>
            {(data.personal?.phone || data.personal?.location) && (
              <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase" style={{ color: CREAM_DIM }}>
                {[data.personal?.phone, data.personal?.location].filter(Boolean).join('  •  ')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t py-7 text-center" style={{ borderColor: BORDER, color: CREAM_DIM, background: NIGHT }}>
        <p className="text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-2">
          <Flame size={12} style={{ color: EMBER }} />
          &copy; {new Date().getFullYear()} {name} &middot; Ember Glow
        </p>
      </footer>
    </div>
  );
}
