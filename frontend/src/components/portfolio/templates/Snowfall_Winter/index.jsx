import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Snowflake, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink,
  ChevronDown, Flame, Home, Quote, Star, Mountain
} from 'lucide-react';

/**
 * Snowfall Winter Portfolio Template
 * Category: Nature / Organic
 * Description: Falling snowflakes CSS animation, frosted glass cards, winter blue and white palette. Cozy winter cabin vibes with warm light accents.
 */

const WARM = '#f59e0b';
const WARM_DEEP = '#d97706';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const driftIn = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
};
const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const initials = (name) =>
  (name || '').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Deterministic falling snow layer (CSS keyframes; positions from index math)
const SNOW_CSS = `
@keyframes snowfall-fall {
  0%   { transform: translate3d(0, -6vh, 0); opacity: 0; }
  8%   { opacity: var(--flake-opacity, 0.8); }
  100% { transform: translate3d(var(--flake-drift, 30px), 108vh, 0); opacity: var(--flake-opacity, 0.8); }
}
@keyframes snowfall-flicker {
  0%, 100% { opacity: 0.55; }
  42% { opacity: 0.85; }
  58% { opacity: 0.62; }
}
`;

const Snowfall = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[...Array(42)].map((_, i) => {
      const size = 3 + ((i * 17) % 7);            // 3-9 px
      const left = (i * 37) % 100;                 // spread across width
      const duration = 9 + ((i * 13) % 11);        // 9-19s
      const delay = -((i * 7) % 19);               // negative: mid-fall at load
      const drift = ((i * 53) % 90) - 45;          // -45px .. +45px sway
      const opacity = 0.35 + ((i * 29) % 50) / 100;
      const isFlake = i % 4 === 0;
      return (
        <div key={i}
          className={isFlake ? 'absolute text-sky-100 select-none' : 'absolute rounded-full bg-white'}
          style={isFlake ? {
            left: `${left}%`, top: '-6vh', fontSize: size + 8, lineHeight: 1,
            '--flake-drift': `${drift}px`, '--flake-opacity': opacity,
            animation: `snowfall-fall ${duration}s linear ${delay}s infinite`,
            textShadow: '0 0 6px rgba(255,255,255,0.6)'
          } : {
            left: `${left}%`, top: '-6vh', width: size, height: size,
            filter: 'blur(0.5px)',
            '--flake-drift': `${drift}px`, '--flake-opacity': opacity,
            animation: `snowfall-fall ${duration}s linear ${delay}s infinite`
          }}>
          {isFlake ? '❄' : ''}
        </div>
      );
    })}
  </div>
);

// Frosted glass card
const Frosted = ({ children, className = '', warm = false, style = {} }) => (
  <div className={`rounded-2xl border backdrop-blur-md ${className}`}
    style={{
      background: 'rgba(255,255,255,0.08)',
      borderColor: warm ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.18)',
      boxShadow: warm
        ? '0 12px 40px rgba(2,20,45,0.35), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 26px rgba(245,158,11,0.10)'
        : '0 12px 40px rgba(2,20,45,0.35), inset 0 1px 0 rgba(255,255,255,0.14)',
      ...style
    }}>
    {children}
  </div>
);

const Eyebrow = ({ icon, text, warm = false }) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase mb-4"
    style={{ color: warm ? WARM : '#a8cdf0' }}>
    {React.createElement(icon, { size: 14 })} {text}
  </span>
);

// ---------------- Hero: snowy cabin scene ----------------
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center"
    style={{ background: 'linear-gradient(180deg, #081d3a 0%, #0d2c56 55%, #143a6e 100%)' }}>
    <Snowfall />
    {/* moonlight */}
    <div className="absolute top-14 right-[12%] w-24 h-24 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(224,242,254,0.9), rgba(224,242,254,0.12) 55%, transparent 70%)', filter: 'blur(1px)' }} aria-hidden="true" />
    {/* cabin window glow — warm light spilling into the snow */}
    <div className="absolute bottom-24 right-[8%] md:right-[14%] pointer-events-none" aria-hidden="true">
      <div className="w-28 h-36 md:w-36 md:h-44 rounded-md border-4 p-1.5 relative"
        style={{
          borderColor: '#1a2a1f',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b 45%, #d97706)',
          boxShadow: '0 0 60px 22px rgba(245,158,11,0.35), 0 0 140px 60px rgba(245,158,11,0.12)',
          animation: 'snowfall-flicker 5s ease-in-out infinite'
        }}>
        <div className="absolute inset-x-1.5 top-1/2 h-1 bg-[#1a2a1f]/80" />
        <div className="absolute inset-y-1.5 left-1/2 w-1 bg-[#1a2a1f]/80" />
      </div>
    </div>
    {/* forest + cabin silhouettes */}
    <div className="absolute bottom-0 inset-x-0 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="w-full h-44 md:h-56 block">
        <g fill="#0a2136">
          <rect x="1040" y="120" width="230" height="100" />
          <polygon points="1030,120 1155,62 1280,120" />
          <rect x="1105" y="150" width="100" height="70" fill="#0c2a44" />
        </g>
        <g fill="#081a2e">
          {[40, 130, 215, 300, 395, 470, 560, 660, 760, 860, 940, 1330, 1400].map((x, i) => (
            <polygon key={i} points={`${x},${218} ${x + 26},${140 - (i % 3) * 18} ${x + 52},${218}`} />
          ))}
          <rect x="0" y="196" width="1440" height="24" />
        </g>
        {/* snow ground */}
        <path d="M0,204 C240,188 480,212 720,196 C960,182 1200,210 1440,192 L1440,220 L0,220 Z" fill="#e8f2fb" opacity="0.9" />
      </svg>
    </div>

    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl pb-16">
      <motion.div variants={fadeUp}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.25em] uppercase border"
          style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', color: '#cfe3f7', backdropFilter: 'blur(8px)' }}>
          <Snowflake size={13} className="animate-pulse" /> Warm Winters Inside
        </span>
      </motion.div>
      <motion.h1 variants={fadeUp} className="mt-7 text-5xl md:text-7xl font-black text-white leading-tight mb-4"
        style={{ textShadow: '0 6px 40px rgba(3,17,38,0.6)' }}>
        {data.personal.name || 'Snowfall Winter'}
      </motion.h1>
      {data.personal.title && (
        <motion.p variants={fadeUp} className="text-xl md:text-2xl font-medium text-sky-200 mb-3">{data.personal.title}</motion.p>
      )}
      {data.personal.tagline && (
        <motion.p variants={fadeUp} className="text-sky-100/70 italic md:text-lg mb-3">{data.personal.tagline}</motion.p>
      )}
      {data.personal.location && (
        <motion.p variants={fadeUp} className="text-sky-200/60 text-sm flex items-center justify-center gap-1.5 mb-10">
          <MapPin size={14} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-7 py-3.5 rounded-full font-bold text-sm text-[#081d3a] transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(120deg, #fbbf24, ${WARM})`, boxShadow: '0 10px 34px rgba(245,158,11,0.35)' }}>
          Come In From the Cold
        </a>
        <a href="#contact" className="px-7 py-3.5 rounded-full font-bold text-sm text-sky-100 border border-white/25 backdrop-blur-md transition-colors hover:border-white/60"
          style={{ background: 'rgba(255,255,255,0.07)' }}>
          Send a Letter
        </a>
      </motion.div>
    </motion.div>
    <motion.a href="#about" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50"
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
      <ChevronDown size={24} />
    </motion.a>
  </section>
);

// ---------------- About ----------------
const About = ({ data }) => {
  const stats = [
    { label: 'Winters of Craft', value: statNumber(data.stats?.yearsExperience) },
    { label: 'Snowfalls Shipped', value: statNumber(data.stats?.projectsCompleted) },
    { label: 'Warm Clients', value: statNumber(data.stats?.happyClients) },
  ].filter(s => s.value !== null);

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #143a6e, #0f2f5c)' }}>
      <Snowfall />
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={driftIn}><Eyebrow icon={Home} text="The Cabin" /></motion.div>
          <motion.h2 variants={driftIn} className="text-4xl md:text-5xl font-black text-white mb-10">About Me</motion.h2>
          <motion.div variants={stagger} className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
            <motion.div variants={driftIn} className="relative mx-auto">
              <div className="absolute -inset-5 rounded-[1.8rem] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)' }} aria-hidden="true" />
              {data.personal.avatar
                ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'}
                    className="relative w-60 h-60 md:w-72 md:h-72 object-cover rounded-[1.8rem] border-2 border-white/25"
                    style={{ boxShadow: '0 24px 70px rgba(2,20,45,0.5), 0 0 30px rgba(245,158,11,0.12)' }} />
                : <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-[1.8rem] border-2 border-white/25 flex flex-col items-center justify-center gap-3"
                    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                    <span className="text-6xl font-black text-white/80 tracking-widest">{initials(data.personal.name)}</span>
                    <Snowflake size={22} className="text-sky-200/70" />
                  </div>}
            </motion.div>
            <motion.div variants={driftIn}>
              {data.personal.bio && <p className="text-sky-50/85 leading-relaxed md:text-lg mb-8 max-w-2xl">{data.personal.bio}</p>}
              {stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  {stats.map((s, i) => (
                    <div key={i}><Frosted className="p-4 text-center">
                      <div className="text-2xl md:text-3xl font-black" style={{ color: WARM }}>{s.value}</div>
                      <div className="text-[10px] tracking-widest uppercase text-sky-100/60 mt-1">{s.label}</div>
                    </Frosted></div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------- Skills ----------------
const Skills = ({ data }) => {
  const categories = [...new Set(data.skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f2f5c, #0b2547)' }}>
      <Snowfall />
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={driftIn}><Eyebrow icon={Mountain} text="Powder Map" /></motion.div>
          <motion.h2 variants={driftIn} className="text-4xl md:text-5xl font-black text-white mb-12">Skills on the Slopes</motion.h2>
          {categories.map((cat, ci) => (
            <motion.div key={cat} variants={driftIn} className="mb-10 last:mb-0">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-sky-200/90">{cat}</span>
                <div className="h-px flex-1 bg-white/10" />
                <Snowflake size={13} className="text-white/30" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {data.skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                  <div key={i}><Frosted className="p-5">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-semibold text-white/90">{skill.name}</span>
                      <span className="text-xs font-bold" style={{ color: WARM }}>{skill.level || 85}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, #7dd3fc, #38bdf8)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level || 85}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: ci * 0.08 + i * 0.06, ease: 'easeOut' }} />
                    </div>
                  </Frosted></div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ---------------- Projects ----------------
const Projects = ({ data }) => (
  <section id="projects" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0b2547, #10315e)' }}>
    <Snowfall />
    <div className="relative max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <motion.div variants={driftIn}><Eyebrow icon={Snowflake} text="Frozen Treasures" /></motion.div>
        <motion.h2 variants={driftIn} className="text-4xl md:text-5xl font-black text-white mb-12">Projects Buried in Snow</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={driftIn} className="group">
              <Frosted className="overflow-hidden h-full transition-transform duration-300 group-hover:-translate-y-2">
                <div className="relative h-44 overflow-hidden border-b border-white/10"
                  style={{ background: 'linear-gradient(140deg, rgba(125,211,252,0.12), rgba(14,46,90,0.5))' }}>
                  {project.image
                    ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    : <div className="w-full h-full flex items-center justify-center"><Snowflake size={42} className="text-white/25 group-hover:rotate-45 transition-transform duration-700" /></div>}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  {project.description && <p className="text-sky-100/60 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.techStack || []).slice(0, 5).map((tech, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/10 text-sky-100/80 border border-white/15">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-sky-300 hover:text-sky-200 transition-colors">
                        <ExternalLink size={13} /> Live
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-sky-100/50 hover:text-white transition-colors">
                        <Github size={13} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </Frosted>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Experience: warm fireplace timeline ----------------
const Experience = ({ data }) => (
  <section id="experience" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #10315e, #0a2136)' }}>
    <Snowfall />
    {/* hearth glow behind the timeline */}
    <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent 65%)' }} aria-hidden="true" />
    <div className="relative max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={driftIn}><Eyebrow icon={Flame} text="Gather Round the Fire" warm /></motion.div>
        <motion.h2 variants={driftIn} className="text-4xl md:text-5xl font-black text-white mb-14">Stories by the Fireplace</motion.h2>
        <div className="relative">
          {/* the hearth line — glowing ember column */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-1 rounded-full"
            style={{ background: 'linear-gradient(180deg, #fbbf24, #f97316 35%, #dc2626 75%, #7f1d1d)', boxShadow: '0 0 18px rgba(249,115,22,0.55)' }} aria-hidden="true" />
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={driftIn}
              className={`relative flex flex-col md:flex-row gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-6 md:left-1/2 top-7 -translate-x-1/2 z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{ background: 'rgba(251,191,36,0.15)', borderColor: 'rgba(251,191,36,0.5)', boxShadow: '0 0 22px rgba(245,158,11,0.45)' }}>
                  <Flame size={18} style={{ color: WARM }} />
                </div>
              </div>
              <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-14' : 'md:pl-14'}`}>
                <Frosted warm className="p-6 transition-transform hover:-translate-y-1">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: WARM }}>{exp.period || 'UNDATED'}</span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{exp.role}</h3>
                  {exp.company && <p className="text-sm font-medium text-amber-200/80 mb-2">{exp.company}</p>}
                  {exp.description && <p className="text-sky-100/65 text-sm leading-relaxed">{exp.description}</p>}
                </Frosted>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Testimonials ----------------
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a2136, #0d2c56)' }}>
    <Snowfall />
    <div className="relative max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={driftIn}><Eyebrow icon={Quote} text="Voices Around the Hearth" /></motion.div>
        <motion.h2 variants={driftIn} className="text-4xl md:text-5xl font-black text-white mb-12">Testimonials</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.blockquote key={i} variants={driftIn}>
              <Frosted className="p-6 h-full transition-transform hover:-translate-y-1.5">
                <Quote size={20} className="mb-4" style={{ color: WARM }} />
                <p className="text-sky-50/80 text-sm leading-relaxed italic mb-6">“{t.text}”</p>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} style={{ color: WARM }} fill={WARM} />)}
                </div>
                <footer className="flex items-center gap-3 border-t border-white/10 pt-4">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name || 'Client'} className="w-10 h-10 rounded-full object-cover border-2 border-white/25" />
                    : <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-sky-100/80 border border-white/20"
                        style={{ background: 'rgba(255,255,255,0.1)' }}>{initials(t.name)}</div>}
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    {t.role && <div className="text-[11px] text-sky-200/60">{t.role}</div>}
                  </div>
                </footer>
              </Frosted>
            </motion.blockquote>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Contact ----------------
const Contact = ({ data }) => (
  <section id="contact" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0d2c56, #081d3a)' }}>
    <Snowfall />
    <div className="relative max-w-2xl mx-auto px-6 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div variants={driftIn}><Eyebrow icon={Home} text="The Door Is Open" warm /></motion.div>
        <motion.h2 variants={driftIn} className="text-4xl md:text-5xl font-black text-white mb-4">Warm Hello Inside</motion.h2>
        <motion.p variants={driftIn} className="text-sky-100/65 mb-10 max-w-md mx-auto">
          The kettle is on and the fire is lit — leave a message and warm up a while.
        </motion.p>
        <motion.div variants={driftIn} className="flex justify-center gap-4 flex-wrap mb-14">
          {data.socials.email && (
            <a href={`mailto:${data.socials.email}`} className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-[#081d3a] transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(120deg, #fbbf24, ${WARM})`, boxShadow: '0 10px 34px rgba(245,158,11,0.35)' }}>
              <Mail size={16} /> Write Me
            </a>
          )}
          {data.socials.github && (
            <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-sky-100 border border-white/25 backdrop-blur-md transition-colors hover:border-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <Github size={16} /> GitHub
            </a>
          )}
          {data.socials.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-sky-100 border border-white/25 backdrop-blur-md transition-colors hover:border-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <Linkedin size={16} /> LinkedIn
            </a>
          )}
          {data.socials.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-sky-100 border border-white/25 backdrop-blur-md transition-colors hover:border-white/60" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <Twitter size={16} /> Twitter
            </a>
          )}
        </motion.div>
        <motion.div variants={driftIn} className="flex items-center justify-center gap-3 mb-6 text-sky-200/40" aria-hidden="true">
          <div className="h-px w-16 bg-white/15" />
          <Snowflake size={14} />
          <div className="h-px w-16 bg-white/15" />
        </motion.div>
        <motion.p variants={driftIn} className="text-[11px] tracking-[0.25em] uppercase text-sky-200/40">
          © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Snowfall Winter · Stay Cozy
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// ---------------- Main ----------------
export default function SnowfallWinter() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="font-sans antialiased overflow-x-hidden text-sky-50" style={{ background: '#081d3a' }}>
      <style>{SNOW_CSS}</style>
      <Hero data={data} />
      {data.personal.bio && <About data={data} />}
      {data.skills?.length > 0 && <Skills data={data} />}
      {data.projects?.length > 0 && <Projects data={data} />}
      {data.experience?.length > 0 && <Experience data={data} />}
      {data.testimonials?.length > 0 && <Testimonials data={data} />}
      <Contact data={data} />
    </div>
  );
}
