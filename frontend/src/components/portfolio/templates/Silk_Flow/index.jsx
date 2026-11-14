import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Waves, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink,
  ChevronDown, Feather, Sparkles, Quote, Gem, Briefcase
} from 'lucide-react';

/**
 * Silk Flow Portfolio Template
 * Category: Glass / Modern UI
 * Description: Silk fabric flow animations with smooth, flowing gradient waves as section dividers. Luxurious, smooth transitions. Soft, premium feel with flowing curves.
 */

// Pearl / champagne / deep-purple palette
const PEARL = '#f4eee3';
const CHAMPAGNE = '#d9b98a';
const CHAMPAGNE_LIGHT = '#eed9b8';
const INK = '#2a1548';

// Section background tones, deep purple family
const BG = {
  hero: '#221040',
  about: '#2a1454',
  skills: '#1e0e3c',
  projects: '#261249',
  experience: '#1c0e38',
  testimonials: '#291452',
  contact: '#170a2e',
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };
const drapeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
};
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

const initials = (name) =>
  (name || '').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Animated silk wave divider: layered motion paths endlessly undulating.
// The divider band is painted with the PREVIOUS section's color; the wavy paths
// rising from the bottom are painted with the NEXT section's color, so the crest
// reads as silk flowing seamlessly into the section below (no hard seam).
const SILK_A = 'M0,64 C240,112 480,16 720,64 C960,112 1200,16 1440,64 L1440,122 L0,122 Z';
const SILK_B = 'M0,72 C240,24 480,108 720,60 C960,20 1200,102 1440,56 L1440,122 L0,122 Z';
const SILK_C = 'M0,58 C240,96 480,28 720,70 C960,104 1200,24 1440,66 L1440,122 L0,122 Z';

const SilkWave = ({ from, to }) => (
  <div className="relative h-20 md:h-28 overflow-hidden" style={{ background: from }} aria-hidden="true">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <motion.path
        fill={to}
        opacity="0.45"
        initial={{ d: SILK_C }}
        animate={{ d: [SILK_C, SILK_A, SILK_C] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        fill={to}
        opacity="0.7"
        initial={{ d: SILK_B }}
        animate={{ d: [SILK_B, SILK_A, SILK_B] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      <motion.path
        fill={to}
        initial={{ d: SILK_A }}
        animate={{ d: [SILK_A, SILK_B, SILK_A] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      />
    </svg>
  </div>
);

// Section shell: previous color drapes over this section's own bg
const Section = ({ id, from, bg, children, className = '' }) => (
  <section id={id} className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
    <SilkWave from={from} to={bg} />
    <div className="max-w-5xl mx-auto px-6 md:px-10 pt-4 md:pt-8 pb-24 md:pb-32">{children}</div>
  </section>
);

const Eyebrow = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.35em] uppercase mb-4"
    style={{ color: CHAMPAGNE }}>
    {React.createElement(icon, { size: 14 })} {text}
  </span>
);

const silkCard = {
  background: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(244,238,227,0.12)',
  boxShadow: '0 20px 60px rgba(10,4,25,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
};

// ---------------- Hero ----------------
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6" style={{ background: BG.hero }}>
    {/* drifting silk glows */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <motion.div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(217,185,138,0.20), transparent 65%)' }}
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-0 -right-28 w-[38rem] h-[38rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22), transparent 65%)' }}
        animate={{ x: [0, -50, 0], y: [0, -35, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 text-center max-w-3xl">
      <motion.div variants={fadeUp}>
        <Eyebrow icon={Feather} text="A Portfolio in Silk" />
      </motion.div>
      <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-8xl leading-tight mb-5"
        style={{ color: PEARL, textShadow: '0 10px 50px rgba(217,185,138,0.18)' }}>
        {data.personal.name || 'Silk Flow'}
      </motion.h1>
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(90deg, transparent, ${CHAMPAGNE})` }} />
        <Sparkles size={16} style={{ color: CHAMPAGNE }} />
        <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(90deg, ${CHAMPAGNE}, transparent)` }} />
      </motion.div>
      {data.personal.title && (
        <motion.p variants={fadeUp} className="font-serif italic text-xl md:text-3xl mb-4" style={{ color: CHAMPAGNE_LIGHT }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal.tagline && (
        <motion.p variants={fadeUp} className="text-base md:text-lg mb-3" style={{ color: 'rgba(244,238,227,0.65)' }}>
          {data.personal.tagline}
        </motion.p>
      )}
      {data.personal.location && (
        <motion.p variants={fadeUp} className="text-sm flex items-center justify-center gap-1.5 mb-10" style={{ color: 'rgba(244,238,227,0.5)' }}>
          <MapPin size={14} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide text-[#2a1548] transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(120deg, ${CHAMPAGNE_LIGHT}, ${CHAMPAGNE})`, boxShadow: '0 14px 40px rgba(217,185,138,0.3)' }}>
          Unfold the Story
        </a>
        <a href="#contact" className="px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide border transition-colors hover:border-[#eed9b8]"
          style={{ borderColor: 'rgba(244,238,227,0.3)', color: PEARL }}>
          Get in Touch
        </a>
      </motion.div>
    </motion.div>
    <motion.a href="#about" aria-label="Scroll down" className="absolute bottom-10 z-10"
      style={{ color: 'rgba(244,238,227,0.5)' }}
      animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}>
      <ChevronDown size={26} />
    </motion.a>
  </section>
);

// ---------------- About ----------------
const About = ({ data }) => {
  const stats = [
    { label: 'Years of Craft', value: statNumber(data.stats?.yearsExperience) },
    { label: 'Works Finished', value: statNumber(data.stats?.projectsCompleted) },
    { label: 'Delighted Clients', value: statNumber(data.stats?.happyClients) },
  ].filter(s => s.value !== null);

  return (
    <Section id="about" from={BG.hero} bg={BG.about}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.div variants={drapeUp}><Eyebrow icon={Gem} text="The Weave" /></motion.div>
        <motion.h2 variants={drapeUp} className="font-serif text-4xl md:text-5xl mb-10" style={{ color: PEARL }}>About Me</motion.h2>
        <motion.div variants={stagger} className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
          <motion.div variants={drapeUp} className="relative mx-auto">
            <div className="absolute -inset-4 rounded-[2rem] blur-xl" style={{ background: 'radial-gradient(circle, rgba(217,185,138,0.25), transparent 70%)' }} aria-hidden="true" />
            {data.personal.avatar
              ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'}
                  className="relative w-60 h-60 md:w-72 md:h-72 object-cover rounded-[2rem] border"
                  style={{ borderColor: 'rgba(238,217,184,0.4)', boxShadow: '0 30px 80px rgba(10,4,25,0.5)' }} />
              : <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-[2rem] border flex items-center justify-center font-serif text-7xl"
                  style={{ borderColor: 'rgba(238,217,184,0.4)', background: 'rgba(255,255,255,0.06)', color: CHAMPAGNE_LIGHT, ...silkCard }}>
                  {initials(data.personal.name)}
                </div>}
          </motion.div>
          <motion.div variants={drapeUp}>
            {data.personal.bio && (
              <p className="font-serif text-lg md:text-xl leading-relaxed mb-8" style={{ color: 'rgba(244,238,227,0.8)' }}>
                {data.personal.bio}
              </p>
            )}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 max-w-lg">
                {stats.map((s, i) => (
                  <div key={i} className="rounded-2xl p-4 text-center" style={silkCard}>
                    <div className="text-2xl md:text-3xl font-serif font-bold" style={{ color: CHAMPAGNE_LIGHT }}>{s.value}</div>
                    <div className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: 'rgba(244,238,227,0.5)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

// ---------------- Skills ----------------
const Skills = ({ data }) => {
  const categories = [...new Set(data.skills.map(s => s.category || 'Core'))];
  return (
    <Section id="skills" from={BG.about} bg={BG.skills}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={drapeUp}><Eyebrow icon={Waves} text="Threads of Expertise" /></motion.div>
        <motion.h2 variants={drapeUp} className="font-serif text-4xl md:text-5xl mb-12" style={{ color: PEARL }}>Skills & Expertise</motion.h2>
        {categories.map((cat, ci) => (
          <motion.div key={cat} variants={drapeUp} className="mb-10 last:mb-0">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: CHAMPAGNE }}>{cat}</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(238,217,184,0.35), transparent)' }} />
            </div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
              {data.skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="font-medium tracking-wide" style={{ color: 'rgba(244,238,227,0.9)' }}>{skill.name}</span>
                    <span className="text-xs font-bold" style={{ color: CHAMPAGNE_LIGHT }}>{skill.level || 85}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, rgba(217,185,138,0.5), ${CHAMPAGNE_LIGHT})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level || 85}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.3, delay: ci * 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

// ---------------- Projects ----------------
const Projects = ({ data }) => (
  <Section id="projects" from={BG.skills} bg={BG.projects}>
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
      <motion.div variants={drapeUp}><Eyebrow icon={Gem} text="The Collection" /></motion.div>
      <motion.h2 variants={drapeUp} className="font-serif text-4xl md:text-5xl mb-12" style={{ color: PEARL }}>Featured Work</motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.projects.map((project, i) => (
          <motion.article key={i} variants={drapeUp} whileHover={{ y: -8 }} transition={{ duration: 0.4, ease: 'easeOut' }}
            className="group rounded-[1.6rem] overflow-hidden" style={silkCard}>
            <div className="relative h-44 overflow-hidden">
              {project.image
                ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out" />
                : <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(217,185,138,0.15))' }}>
                    <Waves size={40} style={{ color: 'rgba(244,238,227,0.35)' }} />
                  </div>}
              <div className="absolute inset-x-0 bottom-0 h-14" style={{ background: 'linear-gradient(180deg, transparent, rgba(38,18,73,0.95))' }} />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: PEARL }}>{project.title}</h3>
              {project.description && <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(244,238,227,0.55)' }}>{project.description}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.techStack || []).slice(0, 5).map((tech, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide"
                    style={{ background: 'rgba(238,217,184,0.12)', color: CHAMPAGNE_LIGHT, border: '1px solid rgba(238,217,184,0.2)' }}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors hover:opacity-80" style={{ color: CHAMPAGNE_LIGHT }}>
                    <ExternalLink size={13} /> Live
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors hover:opacity-80" style={{ color: 'rgba(244,238,227,0.55)' }}>
                    <Github size={13} /> Code
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  </Section>
);

// ---------------- Experience ----------------
const Experience = ({ data }) => (
  <Section id="experience" from={BG.projects} bg={BG.experience}>
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
      <motion.div variants={drapeUp}><Eyebrow icon={Briefcase} text="The Thread Line" /></motion.div>
      <motion.h2 variants={drapeUp} className="font-serif text-4xl md:text-5xl mb-12" style={{ color: PEARL }}>Experience</motion.h2>
      <div className="relative max-w-3xl mx-auto">
        {/* flowing silk thread */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(238,217,184,0.5) 12%, rgba(238,217,184,0.5) 88%, transparent)' }} aria-hidden="true" />
        {data.experience.map((exp, i) => (
          <motion.div key={i} variants={drapeUp}
            className={`relative flex flex-col md:flex-row gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="absolute left-5 md:left-1/2 top-7 w-3.5 h-3.5 rounded-full md:-translate-x-1/2"
              style={{ background: CHAMPAGNE_LIGHT, boxShadow: '0 0 0 5px rgba(238,217,184,0.15), 0 0 20px rgba(238,217,184,0.5)' }} aria-hidden="true" />
            <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
              <div className="rounded-2xl p-6 transition-transform hover:-translate-y-1" style={{ ...silkCard, background: 'rgba(255,255,255,0.07)' }}>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: CHAMPAGNE }}>{exp.period || 'UNDATED'}</span>
                <h3 className="font-serif text-lg font-bold mt-1.5" style={{ color: PEARL }}>{exp.role}</h3>
                {exp.company && <p className="text-sm font-medium italic mb-2" style={{ color: CHAMPAGNE_LIGHT }}>{exp.company}</p>}
                {exp.description && <p className="text-sm leading-relaxed" style={{ color: 'rgba(244,238,227,0.55)' }}>{exp.description}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </Section>
);

// ---------------- Testimonials ----------------
const Testimonials = ({ data }) => (
  <Section id="testimonials" from={BG.experience} bg={BG.testimonials}>
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
      <motion.div variants={drapeUp}><Eyebrow icon={Quote} text="Whispers of Praise" /></motion.div>
      <motion.h2 variants={drapeUp} className="font-serif text-4xl md:text-5xl mb-12" style={{ color: PEARL }}>Testimonials</motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.testimonials.map((t, i) => (
          <motion.blockquote key={i} variants={drapeUp} className="rounded-[1.6rem] p-6 transition-transform hover:-translate-y-1.5" style={silkCard}>
            <Quote size={22} style={{ color: CHAMPAGNE, opacity: 0.7 }} className="mb-4" />
            <p className="font-serif italic text-sm md:text-base leading-relaxed mb-6" style={{ color: 'rgba(244,238,227,0.8)' }}>“{t.text}”</p>
            <footer className="flex items-center gap-3">
              {t.avatar
                ? <img src={t.avatar} alt={t.name || 'Client'} className="w-11 h-11 rounded-full object-cover border" style={{ borderColor: 'rgba(238,217,184,0.4)' }} />
                : <div className="w-11 h-11 rounded-full flex items-center justify-center font-serif font-bold text-sm"
                    style={{ background: 'rgba(238,217,184,0.15)', color: CHAMPAGNE_LIGHT, border: '1px solid rgba(238,217,184,0.3)' }}>
                    {initials(t.name)}
                  </div>}
              <div>
                <div className="text-sm font-semibold" style={{ color: PEARL }}>{t.name}</div>
                {t.role && <div className="text-[11px]" style={{ color: 'rgba(244,238,227,0.5)' }}>{t.role}</div>}
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </motion.div>
  </Section>
);

// ---------------- Contact ----------------
const Contact = ({ data }) => (
  <Section id="contact" from={BG.testimonials} bg={BG.contact}>
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger} className="text-center">
      <motion.div variants={drapeUp}><Eyebrow icon={Feather} text="The Final Fold" /></motion.div>
      <motion.h2 variants={drapeUp} className="font-serif text-4xl md:text-6xl mb-4" style={{ color: PEARL }}>Let's Create Together</motion.h2>
      <motion.p variants={drapeUp} className="mb-10 max-w-md mx-auto" style={{ color: 'rgba(244,238,227,0.55)' }}>
        Every great collaboration begins with a single, silky conversation.
      </motion.p>
      <motion.div variants={drapeUp} className="flex justify-center gap-4 flex-wrap mb-14">
        {data.socials.email && (
          <a href={`mailto:${data.socials.email}`} className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-[#2a1548] transition-transform hover:-translate-y-0.5"
            style={{ background: `linear-gradient(120deg, ${CHAMPAGNE_LIGHT}, ${CHAMPAGNE})`, boxShadow: '0 14px 40px rgba(217,185,138,0.3)' }}>
            <Mail size={16} /> Email Me
          </a>
        )}
        {[['github', 'GitHub', Github], ['linkedin', 'LinkedIn', Linkedin], ['twitter', 'Twitter', Twitter]].map(([key, label, Icon]) =>
          data.socials[key] ? (
            <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm border transition-colors"
              style={{ borderColor: 'rgba(244,238,227,0.25)', color: 'rgba(244,238,227,0.75)' }}>
              <Icon size={16} /> {label}
            </a>
          ) : null
        )}
      </motion.div>
      <motion.div variants={drapeUp} className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
        <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, transparent, rgba(238,217,184,0.4))' }} />
        <Waves size={14} style={{ color: CHAMPAGNE }} />
        <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, rgba(238,217,184,0.4), transparent)' }} />
      </motion.div>
      <motion.p variants={drapeUp} className="text-[11px] tracking-[0.25em] uppercase" style={{ color: 'rgba(244,238,227,0.35)' }}>
        © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Silk Flow
      </motion.p>
    </motion.div>
  </Section>
);

// ---------------- Main ----------------
export default function SilkFlow() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: BG.contact, color: PEARL }}>
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
