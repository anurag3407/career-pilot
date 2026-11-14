import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, Sparkles, Gem, Zap, Layers, Wand2 } from 'lucide-react';

/**
 * Prismatic Light Portfolio Template
 * Category: Colorful / Vibrant
 * Description: Light passing through a prism with rainbow refractions, iridescent surfaces, holographic foil-like shimmers on cards. Light and airy with rainbow accents.
 */

/* ------------------------------------------------------------------ */
/* The spectrum — the one palette this template needs                  */
/* ------------------------------------------------------------------ */
const SPECTRUM = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#38bdf8', '#818cf8', '#c084fc'];
const SPECTRUM_CSS = SPECTRUM.join(', ');
const AIR = '#fdfcff';
const TEXT = '#2d2a3e';
const MUTED = 'rgba(45,42,62,0.58)';
const IRIS_BORDER = 'rgba(139,92,246,0.20)';
const SERIF = "Georgia, 'Times New Roman', serif";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* soft iridescent washes on an airy white page */
const AIRY = {
  backgroundColor: AIR,
  backgroundImage: [
    'radial-gradient(ellipse 40% 30% at 8% 6%, rgba(192,132,252,0.10), transparent 70%)',
    'radial-gradient(ellipse 35% 30% at 95% 12%, rgba(56,189,248,0.10), transparent 70%)',
    'radial-gradient(ellipse 40% 35% at 90% 85%, rgba(251,146,60,0.08), transparent 70%)',
    'radial-gradient(ellipse 45% 30% at 5% 90%, rgba(52,211,153,0.08), transparent 70%)',
  ].join(', '),
};

/* Section header with a spectrum underline */
const SectionHead = ({ icon: Icon, label, title }) => (
  <motion.div variants={fadeUp} className="mb-12">
    <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full"
      style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${IRIS_BORDER}` }}>
      {Icon ? <Icon size={14} strokeWidth={1.8} style={{ color: '#8b5cf6' }} /> : null}
      <span className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.3em', color: MUTED }}>{label}</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: SERIF, color: TEXT }}>
      {title}
    </h2>
    <motion.div className="mt-4 h-[3px] rounded-full"
      style={{ background: `linear-gradient(90deg, ${SPECTRUM_CSS})` }}
      initial={{ width: 0 }}
      whileInView={{ width: 200 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }} />
  </motion.div>
);

/* Holographic card — pastel foil surface with a sweeping sheen */
const HoloCard = ({ children, className = '', hue = 0 }) => (
  <div className={`relative overflow-hidden rounded-2xl group ${className}`}
    style={{
      background: `linear-gradient(135deg,
        hsla(${(hue + 265) % 360}, 90%, 96%, 0.9) 0%,
        hsla(${(hue + 200) % 360}, 90%, 96%, 0.9) 30%,
        hsla(${(hue + 330) % 360}, 95%, 96%, 0.9) 60%,
        hsla(${(hue + 150) % 360}, 85%, 96%, 0.9) 100%)`,
      border: `1px solid ${IRIS_BORDER}`,
      boxShadow: '0 12px 44px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
    {/* foil sheen sweep */}
    <span aria-hidden="true"
      className="absolute inset-y-0 w-1/2 -translate-x-[170%] group-hover:translate-x-[250%] transition-transform duration-700 ease-out pointer-events-none"
      style={{ background: 'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)' }} />
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Prism hero artwork — white beam in, spectrum out                    */
/* ------------------------------------------------------------------ */
const PrismArt = () => (
  <svg viewBox="0 0 460 240" className="w-full max-w-xl mx-auto" fill="none" aria-hidden="true">
    {/* incoming white beam */}
    <motion.rect x="10" y="112" height="7" rx="3.5" fill="#e6ebff"
      initial={{ width: 0 }} animate={{ width: 148 }}
      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      style={{ filter: 'drop-shadow(0 0 6px rgba(230,235,255,0.9))' }} />
    {/* the prism */}
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
      <polygon points="196,62 262,178 130,178"
        fill="rgba(238,242,255,0.32)" stroke="rgba(150,170,255,0.75)" strokeWidth="2" />
      <polygon points="196,80 246,168 146,168" fill="rgba(255,255,255,0.35)" />
    </motion.g>
    {/* refracted spectrum */}
    {SPECTRUM.map((c, i) => (
      <motion.rect key={i} x="256" y="108" height="5.5" rx="2.75" fill={c}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 195, opacity: 0.9 }}
        transition={{ duration: 0.9, delay: 0.8 + i * 0.09, ease: 'easeOut' }}
        transform={`rotate(${(i - 3) * 7} 256 111)`}
        style={{ filter: `drop-shadow(0 0 5px ${c}88)` }} />
    ))}
    {/* sparkle */}
    <motion.circle cx="196" cy="118" r="3" fill="#ffffff"
      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2.4 }} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative overflow-hidden" style={AIRY}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-28 pb-16 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="mt-4 mb-2">
            <PrismArt />
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight mt-6 mb-5 leading-tight"
            style={{
              fontFamily: SERIF,
              background: `linear-gradient(100deg, ${SPECTRUM_CSS}, #2d2a3e)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
            {p.name || 'Pure Light'}
          </motion.h1>
          {p.title ? (
            <motion.p variants={fadeUp} className="text-lg md:text-xl mb-3 font-medium" style={{ color: '#6d5bd0' }}>
              {p.title}
            </motion.p>
          ) : null}
          {p.tagline ? (
            <motion.p variants={fadeUp} className="text-base max-w-xl mx-auto mb-4 leading-relaxed" style={{ color: MUTED }}>
              {p.tagline}
            </motion.p>
          ) : null}
          {p.location ? (
            <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: MUTED }}>
              <MapPin size={14} strokeWidth={1.8} /> {p.location}
            </motion.p>
          ) : null}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a href="#projects"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-transform hover:scale-105"
              style={{ background: `linear-gradient(100deg, ${SPECTRUM_CSS})`, boxShadow: '0 10px 30px rgba(139,92,246,0.35)' }}>
              <Zap size={16} strokeWidth={1.8} /> See the spectrum
            </a>
            <a href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-colors hover:bg-white"
              style={{ border: `1.5px solid ${IRIS_BORDER}`, color: TEXT, background: 'rgba(255,255,255,0.5)' }}>
              <Sparkles size={16} strokeWidth={1.8} /> Bend light my way
            </a>
          </motion.div>
        </motion.div>
      </div>
      {/* faint floating spectrum dust */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span key={i} aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 4 + (i % 4), height: 4 + (i % 4),
            left: `${(i * 83) % 100}%`,
            top: `${12 + ((i * 37) % 70)}%`,
            background: SPECTRUM[i % SPECTRUM.length],
            opacity: 0.5,
            filter: 'blur(0.4px)',
          }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.75, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 + (i % 4), delay: i * 0.35 }} />
      ))}
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'Years refracting', value: stats.yearsExperience, hue: 265 },
    { label: 'Light shows', value: stats.projectsCompleted, hue: 200 },
    { label: 'Audiences lit', value: stats.happyClients, hue: 330 },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" style={AIRY}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Gem} label="About" title="Through the lens" />
          <motion.div variants={fadeUp} className="grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="p-1.5 rounded-full" style={{ background: `linear-gradient(135deg, ${SPECTRUM_CSS})` }}>
                <div className="p-1.5 rounded-full bg-white">
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name || 'Portrait'} className="w-44 h-44 rounded-full object-cover" />
                  ) : (
                    <span className="w-44 h-44 rounded-full flex items-center justify-center text-4xl font-bold"
                      style={{ fontFamily: SERIF, background: `linear-gradient(135deg, #f6f0ff, #eef7ff)`, color: TEXT }}>
                      {(p.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <p className="text-base md:text-lg leading-relaxed mb-7" style={{ color: TEXT }}>
                {p.bio || 'Every project is a beam of white light — and every role, a new surface to bend it through.'}
              </p>
              {statItems.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {statItems.map((s, i) => (
                    <div key={i} className="rounded-2xl py-4 text-center"
                      style={{ background: `hsla(${s.hue}, 85%, 96%, 0.85)`, border: `1px solid ${IRIS_BORDER}` }}>
                      <div className="text-2xl font-bold" style={{ color: `hsl(${s.hue}, 60%, 45%)` }}>{s.value}</div>
                      <div className="text-[10px] uppercase mt-1 font-semibold" style={{ letterSpacing: '0.12em', color: MUTED }}>
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

/* Skills — diffraction grating: each skill fills to its wavelength */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" style={{ background: 'linear-gradient(180deg, rgba(246,240,255,0.6), rgba(238,247,255,0.6))' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Layers} label="Grating" title="The diffraction of skills" />
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp} className="mb-9 last:mb-0">
              <h3 className="text-xs font-bold uppercase mb-5" style={{ letterSpacing: '0.3em', color: '#8b5cf6' }}>{cat}</h3>
              <div className="space-y-5">
                {skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => {
                  const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-semibold" style={{ color: TEXT }}>{skill.name}</span>
                        <span className="text-xs font-bold" style={{ color: '#6d5bd0' }}>{level}</span>
                      </div>
                      <div className="relative h-[7px] rounded-full overflow-hidden" style={{ background: 'rgba(45,42,62,0.07)' }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${SPECTRUM_CSS})`, boxShadow: '0 0 12px rgba(139,92,246,0.45)' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: i * 0.07, ease: 'easeOut' }} />
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

/* Projects — holographic foil cards */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" style={AIRY}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionHead icon={Wand2} label="Refractions" title="Light, split into work" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project, i) => (
              <motion.div key={i} variants={fadeUp} className="transition-transform hover:-translate-y-1.5">
                <HoloCard hue={i * 40} className="h-full">
                  {project.image ? (
                    <div className="m-3 mb-0 rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(139,92,246,0.15)' }}>
                      <img src={project.image} alt={project.title} className="w-full h-36 object-cover" />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <div className="flex gap-1.5 mb-3">
                      {SPECTRUM.map((c, j) => (
                        <span key={j} className="w-1.5 h-1.5 rounded-full"
                          style={{ background: c, opacity: j <= i % SPECTRUM.length ? 1 : 0.25 }} />
                      ))}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: SERIF, color: TEXT }}>{project.title}</h3>
                    {project.description ? (
                      <p className="text-[13px] leading-relaxed mb-4" style={{ color: MUTED }}>{project.description}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.techStack || []).map((t, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            background: `hsla(${(i * 40 + j * 30) % 360}, 85%, 92%, 0.9)`,
                            color: `hsl(${(i * 40 + j * 30) % 360}, 55%, 35%)`,
                          }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70" style={{ color: '#6d5bd0' }}>
                          <ExternalLink size={13} strokeWidth={1.8} /> See it shine
                        </a>
                      ) : null}
                      {project.githubUrl ? (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70" style={{ color: MUTED }}>
                          <Github size={13} strokeWidth={1.8} /> Source
                        </a>
                      ) : null}
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — one white beam splitting into chapters */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={{ background: 'linear-gradient(180deg, rgba(238,247,255,0.55), rgba(251,240,245,0.55))' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Zap} label="Spectrum" title="Career refractions" />
          <div className="relative pl-10 md:pl-14">
            <div className="absolute left-[10px] top-2 bottom-2 w-[3px] rounded-full"
              style={{ background: `linear-gradient(180deg, ${SPECTRUM_CSS})` }} />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pb-10 last:pb-0">
                <span className="absolute -left-10 md:-left-[46px] top-1 w-[23px] h-[23px] rounded-full"
                  style={{
                    background: SPECTRUM[i % SPECTRUM.length],
                    boxShadow: `0 0 14px ${SPECTRUM[i % SPECTRUM.length]}88`,
                  }} />
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-2"
                  style={{
                    color: `hsl(${(i * 45 + 260) % 360}, 50%, 38%)`,
                    background: `hsla(${(i * 45 + 260) % 360}, 85%, 93%, 0.9)`,
                  }}>
                  {exp.period}
                </span>
                <h3 className="text-xl font-bold" style={{ fontFamily: SERIF, color: TEXT }}>{exp.role}</h3>
                <p className="text-sm font-semibold mb-2 mt-0.5" style={{ color: '#6d5bd0' }}>{exp.company}</p>
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

/* Testimonials — light echoes */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={AIRY}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Sparkles} label="Echoes" title="Light that came back" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.div key={i} variants={fadeUp} className="transition-transform hover:-translate-y-1">
                  <HoloCard hue={i * 55} className="h-full p-6">
                    <span className="block text-3xl leading-none font-bold mb-3" style={{ color: SPECTRUM[i % SPECTRUM.length] }}>&ldquo;</span>
                    <p className="text-[13px] leading-relaxed mb-5" style={{ color: TEXT }}>{t.text}</p>
                    <div className="flex items-center gap-3">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover"
                          style={{ border: '2px solid rgba(255,255,255,0.9)', boxShadow: `0 0 10px ${SPECTRUM[i % SPECTRUM.length]}66` }} />
                      ) : (
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                          style={{ background: `hsl(${(i * 45 + 260) % 360}, 80%, 90%)`, color: TEXT, fontFamily: SERIF }}>
                          {initials}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-bold" style={{ color: TEXT }}>{t.name}</span>
                        <span className="block text-[11px]" style={{ color: MUTED }}>{t.role}</span>
                      </span>
                    </div>
                  </HoloCard>
                </motion.div>
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
    <section id="contact" style={AIRY}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="mx-auto mb-8 w-40">
            <PrismArt />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{
              fontFamily: SERIF,
              background: `linear-gradient(100deg, ${SPECTRUM_CSS})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
            Bend some light my way
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base mb-10 max-w-lg mx-auto" style={{ color: MUTED }}>
            Ideas enter white and leave in full color. Send yours — every wavelength is welcome.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            {email ? (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-transform hover:scale-105"
                style={{ background: `linear-gradient(100deg, ${SPECTRUM_CSS})`, boxShadow: '0 10px 30px rgba(139,92,246,0.35)' }}>
                <Mail size={16} strokeWidth={1.8} /> {email}
              </a>
            ) : null}
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-colors hover:bg-white"
                style={{ border: `1.5px solid ${IRIS_BORDER}`, color: TEXT, background: 'rgba(255,255,255,0.5)' }}>
                <l.Icon size={15} strokeWidth={1.8} /> {l.label}
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs" style={{ color: 'rgba(45,42,62,0.45)' }}>
            &copy; {new Date().getFullYear()} {p.name || ''} — Prismatic Light Portfolio
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function PrismaticLight() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'Lens', href: '#about' },
    { label: 'Grating', href: '#skills' },
    { label: 'Refractions', href: '#projects' },
    { label: 'Spectrum', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ ...AIRY, color: TEXT, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* floating glass pill nav */}
      <nav className="fixed top-4 inset-x-0 z-40 flex justify-center px-4">
        <div className="flex items-center gap-1 md:gap-2 px-3 py-2 rounded-full backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.72)', border: `1px solid ${IRIS_BORDER}`, boxShadow: '0 8px 32px rgba(139,92,246,0.16)' }}>
          <a href="#hero" className="inline-flex items-center gap-1.5 pl-1 pr-2 font-bold text-sm" style={{ color: TEXT }}>
            <Gem size={15} strokeWidth={1.8} style={{ color: '#8b5cf6' }} />
            {p.name || 'Prism'}
          </a>
          {navItems.map(item => (
            <a key={item.label} href={item.href}
              className="hidden sm:inline-flex px-3 h-8 items-center rounded-full text-xs font-semibold transition-colors hover:bg-white"
              style={{ color: MUTED }}>
              {item.label}
            </a>
          ))}
          <span className="w-1 h-6 mx-1 rounded-full hidden md:block" style={{ background: `linear-gradient(180deg, ${SPECTRUM_CSS})` }} />
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
