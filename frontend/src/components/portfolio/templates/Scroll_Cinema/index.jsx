import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Clapperboard, Film, MapPin, Mail, Github, Linkedin, Twitter,
  ExternalLink, ChevronDown, Star, Quote, User
} from 'lucide-react';

/**
 * Scroll Cinema Portfolio Template
 * Category: Scroll-Triggered
 * Description: Cinematic widescreen sections that slide in like movie scenes. Letterbox bars at top/bottom, dramatic fade transitions, film grain overlay.
 */

const GOLD = '#eab308';

const sceneStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const sceneFade = {
  hidden: { opacity: 0, y: 70, scale: 1.02 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const initials = (name) =>
  (name || '').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Clapperboard-style scene slate label
const Slate = ({ no, label }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="h-5 w-9 rounded-[3px] shrink-0"
      style={{ background: `repeating-linear-gradient(45deg, ${GOLD} 0 5px, #111 5px 10px)` }} />
    <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase" style={{ color: GOLD }}>
      SCENE {no}
    </span>
    <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">{label}</span>
  </div>
);

// Film strip perforated edge decoration
const FilmEdge = ({ side = 'left' }) => (
  <div
    className={`hidden lg:block absolute top-0 bottom-0 w-7 pointer-events-none ${side === 'left' ? 'left-0 border-r' : 'right-0 border-l'} border-white/10`}
    style={{
      backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.10) 0 9px, transparent 9px 22px)',
      backgroundSize: '3px 100%',
      backgroundPosition: side === 'left' ? '4px 0' : 'calc(100% - 7px) 0',
      backgroundRepeat: 'repeat-y'
    }}
  />
);

// Widescreen "shot" frame that scenes sit inside
const Shot = ({ children, className = '' }) => (
  <div className={`max-w-5xl mx-auto px-8 md:px-16 ${className}`}>{children}</div>
);

const Monogram = ({ name, size = 'w-64 h-64', text = 'text-6xl' }) => (
  <div className={`${size} rounded-lg mx-auto flex items-center justify-center border-2 border-white/20 bg-white/5 ${text} font-black tracking-widest text-white/70`}
    style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}>
    {initials(name)}
  </div>
);

// ---------------- Hero: Opening Titles ----------------
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6">
    <FilmEdge side="left" />
    <FilmEdge side="right" />
    {/* projector spotlight */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 30%, rgba(234,179,8,0.10), transparent 70%)' }} />
    <motion.div initial="hidden" animate="visible" variants={sceneStagger} className="relative z-10">
      <motion.p variants={fadeUp} className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/40 mb-6">
        A {data.personal.name ? `${data.personal.name}` : 'Portfolio'} Picture · Opening Titles
      </motion.p>
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px w-10 md:w-20" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
        <Clapperboard size={22} style={{ color: GOLD }} />
        <div className="h-px w-10 md:w-20" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
      </motion.div>
      <motion.h1 variants={fadeUp}
        className="text-5xl md:text-8xl font-black uppercase tracking-tight text-white leading-none mb-6"
        style={{ textShadow: '0 4px 40px rgba(234,179,8,0.15)' }}>
        {data.personal.name || 'Untitled Feature'}
      </motion.h1>
      {data.personal.title && (
        <motion.p variants={fadeUp} className="text-lg md:text-2xl font-medium tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal.tagline && (
        <motion.p variants={fadeUp} className="text-white/60 italic md:text-lg max-w-xl mx-auto mb-4">
          “{data.personal.tagline}”
        </motion.p>
      )}
      {data.personal.location && (
        <motion.p variants={fadeUp} className="text-white/40 text-sm flex items-center justify-center gap-1.5 mb-10">
          <MapPin size={14} /> Shot on location in {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-6 py-3 rounded-sm font-semibold text-sm tracking-widest uppercase text-black transition-transform hover:-translate-y-0.5"
          style={{ background: GOLD, boxShadow: '0 8px 30px rgba(234,179,8,0.25)' }}>
          Watch the Story
        </a>
        <a href="#contact" className="px-6 py-3 rounded-sm font-semibold text-sm tracking-widest uppercase border border-white/30 text-white/80 hover:border-white/70 hover:text-white transition-colors">
          Contact the Studio
        </a>
      </motion.div>
    </motion.div>
    <motion.a href="#about" aria-label="Scroll to about"
      className="absolute bottom-14 md:bottom-16 text-white/40 hover:text-white/80 z-10"
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <span className="text-[10px] tracking-[0.4em] uppercase flex flex-col items-center gap-1">Roll Film <ChevronDown size={18} /></span>
    </motion.a>
  </section>
);

// ---------------- About: The Story ----------------
const About = ({ data, no }) => {
  const stats = [
    { label: 'Years in the Craft', value: statNumber(data.stats?.yearsExperience) },
    { label: 'Features Shipped', value: statNumber(data.stats?.projectsCompleted) },
    { label: 'Happy Collaborators', value: statNumber(data.stats?.happyClients) },
  ].filter(s => s.value !== null);

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0a0a0b' }}>
      <FilmEdge side="left" />
      <Shot>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sceneStagger}>
          <motion.div variants={sceneFade}>
            <Slate no={no} label="INT. STUDIO — DAY" />
          </motion.div>
          <motion.div variants={sceneStagger} className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
            <motion.div variants={sceneFade}>
              <div className="p-3 border border-white/15 bg-black/60" style={{ boxShadow: `0 0 0 1px #000, 0 20px 60px rgba(0,0,0,0.7)` }}>
                {data.personal.avatar
                  ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'} className="w-56 h-56 md:w-64 md:h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  : <Monogram name={data.personal.name} />}
              </div>
            </motion.div>
            <motion.div variants={sceneFade}>
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/40 flex items-center gap-2 mb-3">
                <User size={13} /> The Story
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-6">About the Auteur</h2>
              {data.personal.bio && (
                <p className="text-white/70 leading-relaxed md:text-lg mb-8 max-w-2xl">{data.personal.bio}</p>
              )}
              {stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  {stats.map((s, i) => (
                    <div key={i} className="border border-white/10 bg-white/[0.03] p-4 text-center">
                      <div className="text-2xl md:text-3xl font-black" style={{ color: GOLD }}>{s.value}</div>
                      <div className="text-[10px] tracking-widest uppercase text-white/40 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </Shot>
    </section>
  );
};

// ---------------- Skills: The Craft ----------------
const Skills = ({ data, no }) => {
  const categories = [...new Set(data.skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#050505' }}>
      <FilmEdge side="left" />
      <Shot>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={sceneStagger}>
          <motion.div variants={sceneFade}>
            <Slate no={no} label="MONTAGE — THE CRAFT" />
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-12">Skills Reel</h2>
          </motion.div>
          {categories.map((cat, ci) => (
            <motion.div key={cat} variants={sceneFade} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>{cat}</span>
                <div className="h-px flex-1 bg-white/10" />
                <Film size={14} className="text-white/25" />
              </div>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                {data.skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-white/85 font-medium tracking-wide">{skill.name}</span>
                      <span className="text-xs font-bold" style={{ color: GOLD }}>{skill.level || 85}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 overflow-hidden">
                      <motion.div className="h-full"
                        style={{ background: `linear-gradient(90deg, #7c6400, ${GOLD})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level || 85}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.1 + ci * 0.1 + i * 0.06, ease: 'easeOut' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Shot>
    </section>
  );
};

// ---------------- Projects: Now Showing ----------------
const Projects = ({ data, no }) => (
  <section id="projects" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0a0a0b' }}>
    <FilmEdge side="left" />
    <Shot>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sceneStagger}>
        <motion.div variants={sceneFade}>
          <Slate no={no} label="FEATURE PRESENTATION" />
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-12">Now Showing</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={sceneFade}
              className="group border border-white/12 bg-black/70 hover:border-white/30 transition-colors overflow-hidden">
              <div className="relative aspect-video overflow-hidden border-b border-white/10"
                style={{ background: 'linear-gradient(135deg, #16161a, #0a0a0c)' }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={40} className="text-white/10 group-hover:text-white/20 transition-colors" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-[0.25em] bg-black/80 border border-white/20" style={{ color: GOLD }}>
                  EP. {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 tracking-wide">{project.title}</h3>
                {project.description && (
                  <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(project.techStack || []).slice(0, 5).map((tech, j) => (
                    <span key={j} className="px-2 py-0.5 text-[10px] tracking-wider uppercase border border-white/15 text-white/50">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-colors" style={{ color: GOLD }}>
                      <ExternalLink size={13} /> Screening
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-white/50 hover:text-white transition-colors">
                      <Github size={13} /> Behind the Scenes
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </Shot>
  </section>
);

// ---------------- Experience: The Story So Far ----------------
const Experience = ({ data, no }) => (
  <section id="experience" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#050505' }}>
    <FilmEdge side="left" />
    <Shot>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={sceneStagger}>
        <motion.div variants={sceneFade}>
          <Slate no={no} label="FLASHBACK SEQUENCE" />
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-12">The Story So Far</h2>
        </motion.div>
        <div className="relative border-l-2 border-white/10 ml-3 md:ml-6">
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={sceneFade} className="relative pl-8 md:pl-12 pb-12 last:pb-0">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rotate-45 border-2" style={{ borderColor: GOLD, background: '#050505' }} />
              <div className="border border-white/12 bg-black/60 hover:border-white/25 transition-colors p-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-[0.25em] uppercase border" style={{ borderColor: `${GOLD}55`, color: GOLD }}>
                    TAKE {String(i + 1).padStart(2, '0')} · {exp.period || 'UNDATED'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                {exp.company && <p className="text-sm font-medium tracking-widest uppercase text-white/45 mt-1 mb-3">{exp.company}</p>}
                {exp.description && <p className="text-white/60 text-sm leading-relaxed">{exp.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Shot>
  </section>
);

// ---------------- Testimonials: Critical Acclaim ----------------
const Testimonials = ({ data, no }) => (
  <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#0a0a0b' }}>
    <FilmEdge side="left" />
    <Shot>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={sceneStagger}>
        <motion.div variants={sceneFade}>
          <Slate no={no} label="THE REVIEWS ARE IN" />
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-12">Critical Acclaim</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((t, i) => (
            <motion.blockquote key={i} variants={sceneFade} className="border border-white/12 bg-black/60 p-6 hover:border-white/25 transition-colors">
              <Quote size={20} style={{ color: GOLD }} className="mb-4" />
              <p className="text-white/70 text-sm leading-relaxed italic mb-6">“{t.text}”</p>
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} style={{ color: GOLD }} fill={GOLD} />)}
              </div>
              <footer className="flex items-center gap-3 border-t border-white/10 pt-4">
                {t.avatar
                  ? <img src={t.avatar} alt={t.name || 'Reviewer'} className="w-10 h-10 rounded-full object-cover border border-white/20 grayscale" />
                  : <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-xs font-bold text-white/60">{initials(t.name)}</div>}
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  {t.role && <div className="text-[11px] tracking-widest uppercase text-white/40">{t.role}</div>}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </motion.div>
    </Shot>
  </section>
);

// ---------------- Contact + Credits ----------------
const Contact = ({ data, no }) => {
  const credits = [
    ['DIRECTED BY', data.personal.name],
    ['STARRING', data.personal.title],
    ['WRITTEN BY', data.personal.name],
    ['SHOT ON LOCATION', data.personal.location],
  ].filter(([, v]) => v);

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#050505' }}>
      <Shot>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sceneStagger} className="text-center">
          <motion.div variants={sceneFade}>
            <Slate no={no} label="FIN" />
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4">That's a Wrap</h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto">The credits are rolling — but the next project could star you. Get in touch.</p>
            <div className="flex justify-center gap-4 flex-wrap mb-16">
              {data.socials.email && (
                <a href={`mailto:${data.socials.email}`} className="flex items-center gap-2 px-6 py-3 font-semibold text-sm tracking-widest uppercase text-black transition-transform hover:-translate-y-0.5"
                  style={{ background: GOLD, boxShadow: '0 8px 30px rgba(234,179,8,0.25)' }}>
                  <Mail size={16} /> Email the Studio
                </a>
              )}
              {data.socials.github && (
                <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 border border-white/25 text-white/70 hover:border-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors">
                  <Github size={16} /> GitHub
                </a>
              )}
              {data.socials.linkedin && (
                <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 border border-white/25 text-white/70 hover:border-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors">
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
              {data.socials.twitter && (
                <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 border border-white/25 text-white/70 hover:border-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors">
                  <Twitter size={16} /> Twitter
                </a>
              )}
            </div>
          </motion.div>
          {credits.length > 0 && (
            <motion.div variants={sceneFade} className="max-w-md mx-auto space-y-3 mb-10">
              {credits.map(([role, name], i) => (
                <div key={i}>
                  <div className="text-[9px] tracking-[0.45em] uppercase text-white/30">{role}</div>
                  <div className="text-sm md:text-base text-white/80 tracking-wider uppercase">{name}</div>
                </div>
              ))}
            </motion.div>
          )}
          <motion.p variants={sceneFade} className="text-[10px] tracking-[0.35em] uppercase text-white/30">
            © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Scroll Cinema · All Rights Reserved
          </motion.p>
        </motion.div>
      </Shot>
    </section>
  );
};

// ---------------- Main ----------------
export default function ScrollCinema() {
  const { portfolioData: data } = usePortfolio();

  // Deterministic scene numbering based on which sections actually render
  let sceneCounter = 0;
  const nextScene = () => String(++sceneCounter).padStart(2, '0');

  const hasBio = Boolean(data.personal.bio);
  const navItems = [
    hasBio && ['About', '#about'],
    data.skills?.length > 0 && ['Craft', '#skills'],
    data.projects?.length > 0 && ['Films', '#projects'],
    data.experience?.length > 0 && ['Story', '#experience'],
    ['Contact', '#contact'],
  ].filter(Boolean);

  return (
    <div className="relative bg-black text-white font-sans overflow-x-hidden">
      {/* Film grain overlay (SVG feTurbulence noise, no external assets) */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-40" aria-hidden="true" style={{ opacity: 0.06 }}>
        <filter id="cinema-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinema-grain)" />
      </svg>
      {/* Cinematic vignette */}
      <div className="fixed inset-0 pointer-events-none z-30"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />

      {/* Letterbox bars (top doubles as the nav) */}
      <header className="fixed top-0 inset-x-0 z-50 h-9 md:h-11 bg-black border-b border-white/10 flex items-center px-4 md:px-6">
        <a href="#hero" className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>
          <Clapperboard size={14} /> <span className="hidden sm:inline">Cinema</span>
        </a>
        <nav className="flex-1 flex justify-center gap-3 md:gap-7 text-[9px] md:text-[11px] tracking-[0.25em] uppercase">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="text-white/45 hover:text-white transition-colors">{label}</a>
          ))}
        </nav>
        <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-white/25">4K · WIDESCREEN</span>
      </header>
      <div className="fixed bottom-0 inset-x-0 z-50 h-5 md:h-7 bg-black border-t border-white/10 flex items-center justify-center gap-6">
        {[0, 1, 2].map(i => <div key={i} className="w-16 h-px bg-white/10" />)}
        <Film size={11} className="text-white/25" />
        {[0, 1, 2].map(i => <div key={i} className="w-16 h-px bg-white/10" />)}
      </div>

      {/* Feature presentation */}
      <main className="pt-9 pb-5 md:pt-11 md:pb-7">
        <Hero data={data} />
        {hasBio && <About data={data} no={nextScene()} />}
        {data.skills?.length > 0 && <Skills data={data} no={nextScene()} />}
        {data.projects?.length > 0 && <Projects data={data} no={nextScene()} />}
        {data.experience?.length > 0 && <Experience data={data} no={nextScene()} />}
        {data.testimonials?.length > 0 && <Testimonials data={data} no={nextScene()} />}
        <Contact data={data} no={nextScene()} />
      </main>
    </div>
  );
}
