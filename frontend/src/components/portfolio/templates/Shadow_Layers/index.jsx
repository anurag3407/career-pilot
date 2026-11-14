import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink,
  ChevronDown, User, Briefcase, Quote, Star, MessageSquareText
} from 'lucide-react';

/**
 * Shadow Layers Portfolio Template
 * Category: Dark / Moody
 * Description: Heavy shadow play with multiple layered dark cards creating depth illusion. Shadows stack to create a 3D paper-cut effect in dark tones.
 */

const ACCENT = '#8b87f7'; // single dim violet accent

// Stacked "paper-cut" shadow stack — every plane sits on progressively darker sheets
const STACK = '0 2px 0 0 #232329, 0 11px 0 0 #17171c, 0 22px 0 0 #101013, 0 38px 60px rgba(0,0,0,0.85)';
const STACK_HOVER = '0 2px 0 0 #232329, 0 11px 0 0 #17171c, 0 22px 0 0 #101013, 0 46px 80px rgba(0,0,0,0.9)';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const risePlane = {
  hidden: { opacity: 0, y: 60, rotate: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

const initials = (name) =>
  (name || '').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Torn paper edge divider between stacked planes
const PaperEdge = ({ color = '#131316', flip = false }) => (
  <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
      <path
        d="M0,60 L0,32 L90,38 L190,20 L300,42 L410,16 L520,36 L640,14 L760,40 L880,18 L1000,38 L1120,15 L1240,34 L1340,20 L1440,30 L1440,60 Z"
        fill={color}
      />
    </svg>
  </div>
);

// Section label chip — a small raised plate
const PlateLabel = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-300 bg-[#1a1a1f]"
    style={{ boxShadow: '0 2px 0 0 #26262c, 0 9px 0 0 #16161a, 0 18px 30px rgba(0,0,0,0.7)' }}>
    {React.createElement(icon, { size: 13, color: ACCENT })} {text}
  </span>
);

const Plane = ({ children, className = '', tilt = 0 }) => (
  <div className={`rounded-xl border border-white/[0.06] bg-[#1b1b20] ${className}`}
    style={{ boxShadow: STACK, transform: tilt ? `rotate(${tilt}deg)` : undefined }}>
    {children}
  </div>
);

// ---------------- Hero ----------------
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
    {/* floating cut-paper shards, deterministic placement */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {[[8, 12, -8, 140], [80, 18, 6, 90], [15, 72, 10, 110], [70, 78, -12, 80], [45, 8, 4, 60], [88, 55, -5, 70]].map(([x, y, r, s], i) => (
        <div key={i} className="absolute rounded-lg bg-[#151519] border border-white/[0.04]"
          style={{
            left: `${x}%`, top: `${y}%`, width: s, height: s * 0.72,
            transform: `rotate(${r}deg)`,
            boxShadow: '0 3px 0 0 #101013, 0 14px 0 0 #0b0b0e, 0 30px 50px rgba(0,0,0,0.8)'
          }} />
      ))}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 42%, rgba(139,135,247,0.07), transparent 70%)' }} />
    </div>
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl">
      <motion.div variants={fadeUp}>
        <PlateLabel icon={Layers} text="Layer One — The Surface" />
      </motion.div>
      <motion.h1 variants={fadeUp}
        className="mt-8 text-5xl md:text-8xl font-black text-zinc-100 leading-[1.02] tracking-tight"
        style={{ textShadow: `1px 1px 0 #2b2b31, 2px 2px 0 #232329, 3px 3px 0 #1b1b20, 5px 5px 0 #131316, 7px 8px 0 #0b0b0d, 10px 14px 34px rgba(0,0,0,0.9)` }}>
        {data.personal.name || 'Shadow Layers'}
      </motion.h1>
      {data.personal.title && (
        <motion.p variants={fadeUp} className="mt-6 text-lg md:text-2xl font-semibold tracking-wide" style={{ color: ACCENT }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal.tagline && (
        <motion.p variants={fadeUp} className="mt-3 text-zinc-400 md:text-lg">{data.personal.tagline}</motion.p>
      )}
      {data.personal.location && (
        <motion.p variants={fadeUp} className="mt-2 text-zinc-500 text-sm flex items-center justify-center gap-1.5">
          <MapPin size={14} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="mt-10 flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-7 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase text-zinc-950 bg-[#1b1b20] border border-white/10 transition-all hover:-translate-y-1"
          style={{ boxShadow: STACK, color: ACCENT }}>
          Peel Back Layer 2
        </a>
        <a href="#contact" className="px-7 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase text-zinc-300 bg-[#151519] border border-white/[0.07] transition-all hover:-translate-y-1"
          style={{ boxShadow: STACK }}>
          Final Layer
        </a>
      </motion.div>
    </motion.div>
    <motion.a href="#about" aria-label="Scroll down" className="absolute bottom-10 z-10 text-zinc-600 hover:text-zinc-300"
      animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
      <ChevronDown size={26} />
    </motion.a>
  </section>
);

// ---------------- About ----------------
const About = ({ data }) => {
  const stats = [
    { label: 'Years Deep', value: statNumber(data.stats?.yearsExperience) },
    { label: 'Pieces Built', value: statNumber(data.stats?.projectsCompleted) },
    { label: 'Happy Clients', value: statNumber(data.stats?.happyClients) },
  ].filter(s => s.value !== null);

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#131316' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={risePlane} className="mb-10"><PlateLabel icon={User} text="Layer Two — Beneath the Surface" /></motion.div>
          <motion.div variants={stagger} className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
            {/* layered paper-cut portrait frame */}
            <motion.div variants={risePlane} className="relative mx-auto" aria-hidden="false">
              <div className="absolute -inset-3 rounded-xl bg-[#151519]" style={{ boxShadow: STACK, transform: 'rotate(-3deg)' }} />
              <div className="absolute -inset-1.5 rounded-lg bg-[#1b1b20]" style={{ boxShadow: STACK, transform: 'rotate(1.5deg)' }} />
              {data.personal.avatar
                ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'}
                    className="relative w-56 h-56 md:w-64 md:h-64 object-cover rounded-lg border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" />
                : <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-lg border border-white/10 bg-[#1b1b20] flex items-center justify-center text-6xl font-black text-zinc-600">
                    {initials(data.personal.name)}
                  </div>}
            </motion.div>
            <motion.div variants={risePlane}>
              <h2 className="text-3xl md:text-5xl font-black text-zinc-100 mb-5">The Layers Below</h2>
              {data.personal.bio && <p className="text-zinc-400 leading-relaxed md:text-lg mb-8 max-w-2xl">{data.personal.bio}</p>}
              {stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  {stats.map((s, i) => (
                    <div key={i} className="rounded-lg bg-[#1b1b20] border border-white/[0.06] p-4 text-center" style={{ boxShadow: STACK }}>
                      <div className="text-2xl md:text-3xl font-black" style={{ color: ACCENT }}>{s.value}</div>
                      <div className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">{s.label}</div>
                    </div>
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
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0d0d10' }}>
      <PaperEdge color="#131316" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={risePlane} className="mb-10"><PlateLabel icon={Layers} text="Layer Three — The Toolkit" /></motion.div>
          <motion.h2 variants={risePlane} className="text-3xl md:text-5xl font-black text-zinc-100 mb-12">Stacked Skills</motion.h2>
          {categories.map((cat, ci) => (
            <motion.div key={cat} variants={risePlane} className="mb-10 last:mb-0">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: ACCENT }}>{cat}</span>
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {data.skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                  <div key={i} className="rounded-lg bg-[#1b1b20] border border-white/[0.06] p-5 transition-transform hover:-translate-y-1"
                    style={{ boxShadow: STACK, transform: `rotate(${(((i * 37) % 3) - 1) * 0.5}deg)` }}>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-semibold text-zinc-200">{skill.name}</span>
                      <span className="text-xs font-black" style={{ color: ACCENT }}>{skill.level || 85}%</span>
                    </div>
                    <div className="relative h-2.5 rounded-full bg-[#0f0f12] overflow-hidden" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)' }}>
                      <motion.div className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: `linear-gradient(90deg, #4c48a8, ${ACCENT})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level || 85}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: ci * 0.08 + i * 0.06, ease: 'easeOut' }} />
                    </div>
                  </div>
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
  <section id="projects" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#131316' }}>
    <PaperEdge color="#0d0d10" flip />
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <motion.div variants={risePlane} className="mb-10"><PlateLabel icon={Briefcase} text="Layer Four — The Work" /></motion.div>
        <motion.h2 variants={risePlane} className="text-3xl md:text-5xl font-black text-zinc-100 mb-12">Cut-Outs & Builds</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={risePlane}
              className="group rounded-xl bg-[#1b1b20] border border-white/[0.06] overflow-hidden transition-all hover:-translate-y-2"
              style={{ boxShadow: STACK, transform: `rotate(${((i * 53) % 3) - 1}deg)` }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = STACK_HOVER; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = STACK; }}>
              <div className="relative h-44 overflow-hidden border-b border-white/[0.06]"
                style={{ background: 'linear-gradient(140deg, #232329, #101013)' }}>
                {project.image
                  ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  : <div className="w-full h-full flex items-center justify-center text-zinc-700 group-hover:text-zinc-500 transition-colors"><Layers size={44} /></div>}
                <div className="absolute inset-x-0 bottom-0 h-10" style={{ background: 'linear-gradient(180deg, transparent, rgba(27,27,32,0.9))' }} />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{project.title}</h3>
                {project.description && <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.techStack || []).slice(0, 5).map((tech, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#101013] text-zinc-400 border border-white/[0.06]"
                      style={{ boxShadow: '0 2px 0 0 #0a0a0c' }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase" style={{ color: ACCENT }}>
                      <ExternalLink size={13} /> View
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors">
                      <Github size={13} /> Code
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
);

// ---------------- Experience ----------------
const Experience = ({ data }) => (
  <section id="experience" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0d0d10' }}>
    <PaperEdge color="#131316" />
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={risePlane} className="mb-10"><PlateLabel icon={Briefcase} text="Layer Five — The Record" /></motion.div>
        <motion.h2 variants={risePlane} className="text-3xl md:text-5xl font-black text-zinc-100 mb-12">Sheets of History</motion.h2>
        <div className="space-y-10">
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={risePlane} className="relative">
              <div className={i % 2 === 0 ? '-rotate-[0.6deg]' : 'rotate-[0.6deg]'}>
                <div className="rounded-xl bg-[#1b1b20] border border-white/[0.06] p-6 md:p-7"
                  style={{ boxShadow: STACK }}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="px-3 py-1 rounded-md text-[10px] font-black tracking-[0.2em] uppercase bg-[#101013] text-zinc-400 border border-white/[0.06]">{exp.period || 'UNDATED'}</span>
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: ACCENT }}>{`0${i + 1}`.slice(-2)} / SHEET</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100">{exp.role}</h3>
                  {exp.company && <p className="text-sm font-semibold text-zinc-400 mt-0.5 mb-3">{exp.company}</p>}
                  {exp.description && <p className="text-zinc-400 text-sm leading-relaxed">{exp.description}</p>}
                </div>
              </div>
              {/* second sheet peeking underneath */}
              <div className="h-3 mx-4 rounded-b-xl bg-[#151519] border-x border-b border-white/[0.05]" style={{ boxShadow: '0 10px 0 0 #101013, 0 22px 34px rgba(0,0,0,0.7)' }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Testimonials ----------------
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#131316' }}>
    <PaperEdge color="#0d0d10" flip />
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={risePlane} className="mb-10"><PlateLabel icon={MessageSquareText} text="Layer Six — The Voices" /></motion.div>
        <motion.h2 variants={risePlane} className="text-3xl md:text-5xl font-black text-zinc-100 mb-12">Echoes From Above</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((t, i) => (
            <motion.blockquote key={i} variants={risePlane}
              className="rounded-xl bg-[#1b1b20] border border-white/[0.06] p-6 transition-transform hover:-translate-y-1.5"
              style={{ boxShadow: STACK, transform: `rotate(${((i * 41) % 3) - 1}deg)` }}>
              <Quote size={20} style={{ color: ACCENT }} className="mb-4" />
              <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">“{t.text}”</p>
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} style={{ color: ACCENT }} fill={ACCENT} />)}
              </div>
              <footer className="flex items-center gap-3 border-t border-white/[0.06] pt-4">
                {t.avatar
                  ? <img src={t.avatar} alt={t.name || 'Client'} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                  : <div className="w-10 h-10 rounded-lg bg-[#101013] border border-white/[0.08] flex items-center justify-center text-xs font-black text-zinc-500">{initials(t.name)}</div>}
                <div>
                  <div className="text-sm font-semibold text-zinc-200">{t.name}</div>
                  {t.role && <div className="text-[11px] text-zinc-500">{t.role}</div>}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Contact ----------------
const Contact = ({ data }) => (
  <section id="contact" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0d0d10' }}>
    <PaperEdge color="#131316" />
    <div className="max-w-2xl mx-auto px-6 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div variants={risePlane}><PlateLabel icon={Mail} text="Final Layer — Contact" /></motion.div>
        <motion.h2 variants={risePlane} className="mt-10 text-3xl md:text-5xl font-black text-zinc-100 mb-4"
          style={{ textShadow: '2px 2px 0 #1b1b20, 4px 4px 0 #131316, 6px 8px 20px rgba(0,0,0,0.8)' }}>
          Reach the Bottom Layer
        </motion.h2>
        <motion.p variants={risePlane} className="text-zinc-400 mb-10">Every stack has a foundation. This one is a conversation — start yours.</motion.p>
        <motion.div variants={risePlane} className="flex justify-center gap-4 flex-wrap mb-14">
          {data.socials.email && (
            <a href={`mailto:${data.socials.email}`} className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase bg-[#1b1b20] border border-white/10 transition-all hover:-translate-y-1"
              style={{ boxShadow: STACK, color: ACCENT }}>
              <Mail size={16} /> Email Me
            </a>
          )}
          {data.socials.github && (
            <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase text-zinc-300 bg-[#151519] border border-white/[0.07] transition-all hover:-translate-y-1" style={{ boxShadow: STACK }}>
              <Github size={16} /> GitHub
            </a>
          )}
          {data.socials.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase text-zinc-300 bg-[#151519] border border-white/[0.07] transition-all hover:-translate-y-1" style={{ boxShadow: STACK }}>
              <Linkedin size={16} /> LinkedIn
            </a>
          )}
          {data.socials.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase text-zinc-300 bg-[#151519] border border-white/[0.07] transition-all hover:-translate-y-1" style={{ boxShadow: STACK }}>
              <Twitter size={16} /> Twitter
            </a>
          )}
        </motion.div>
        <motion.p variants={risePlane} className="text-[11px] tracking-[0.3em] uppercase text-zinc-600">
          © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Shadow Layers · Deepest thanks for scrolling
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// ---------------- Main ----------------
export default function ShadowLayers() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="font-sans antialiased text-zinc-200 overflow-x-hidden" style={{ background: '#09090b' }}>
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
