import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Info, ChevronLeft, ChevronRight, Star, Mail, Github, Linkedin,
  Twitter, MapPin, Plus, ThumbsUp, ExternalLink
} from 'lucide-react';

/**
 * Netflix Browse Portfolio Template
 * Category: Famous UI Inspired
 * Description: Netflix browse UI with horizontal carousels of project cards, hover expansion with preview details, featured hero banner at top, dark background.
 */

/* ------------------------------------------------------------------ */
/* Netflix palette                                                     */
/* ------------------------------------------------------------------ */
const BG = '#141414';
const CARD = '#181818';
const RED = '#e50914';
const RED_DEEP = '#b20710';
const WHITE = '#ffffff';
const GRAY = '#b3b3b3';
const HAIRLINE = 'rgba(255,255,255,0.12)';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const GENRE_GRADIENTS = [
  'linear-gradient(135deg, #6a2c8f 0%, #2b5aa6 100%)',
  'linear-gradient(135deg, #b20710 0%, #e50914 100%)',
  'linear-gradient(135deg, #1f7a4d 0%, #0e5a56 100%)',
  'linear-gradient(135deg, #b3701b 0%, #8a3a12 100%)',
  'linear-gradient(135deg, #4b2e83 0%, #93267c 100%)',
  'linear-gradient(135deg, #0f4c81 0%, #12766e 100%)',
];

/* Section title in Netflix row style */
const RowTitle = ({ children }) => (
  <motion.h2 variants={fadeUp}
    className="text-xl md:text-2xl font-bold tracking-tight mb-4 flex items-center gap-3"
    style={{ color: WHITE }}>
    {children}
    <span className="text-xs font-semibold text-[#54b9c5] opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:inline">
      Explore all &rsaquo;
    </span>
  </motion.h2>
);

const Monogram = ({ name, size = 32, bg = RED, fg = WHITE }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="shrink-0 inline-flex items-center justify-center rounded font-bold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}>
      {initials || '?'}
    </span>
  );
};

/* Horizontal scroller with hover-enabled arrow controls */
const Carousel = ({ children }) => {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (el && typeof el.scrollBy === 'function') {
      el.scrollBy({ left: dir * Math.max(320, (el.clientWidth || 640) * 0.8), behavior: 'smooth' });
    }
  };
  return (
    <div className="group/car relative">
      <button onClick={() => scroll(-1)} aria-label="Scroll left"
        className="hidden md:flex absolute left-0 top-0 bottom-0 z-30 w-10 items-center justify-center opacity-0 group-hover/car:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, rgba(20,20,20,0.85), transparent)' }}>
        <ChevronLeft size={30} style={{ color: WHITE }} />
      </button>
      <div ref={ref} className="flex gap-3 overflow-x-auto py-10 -my-10 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
      <button onClick={() => scroll(1)} aria-label="Scroll right"
        className="hidden md:flex absolute right-0 top-0 bottom-0 z-30 w-10 items-center justify-center opacity-0 group-hover/car:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(270deg, rgba(20,20,20,0.85), transparent)' }}>
        <ChevronRight size={30} style={{ color: WHITE }} />
      </button>
    </div>
  );
};

/* Project card with Netflix-style hover expansion */
const ProjectCard = ({ project, rank, featured = false }) => (
  <motion.div variants={fadeUp}
    className={`group relative shrink-0 ${featured ? 'w-[260px] md:w-[300px]' : 'w-[220px] md:w-[250px]'}`}
    style={{ transition: 'transform 0.25s ease, z-index 0s' }}>
    <div className="relative rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.06] group-hover:z-20"
      style={{ background: CARD, boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
      {rank ? (
        <span aria-hidden="true"
          className="absolute -left-1 bottom-1 z-10 text-[64px] leading-none font-black select-none pointer-events-none"
          style={{ color: BG, WebkitTextStroke: `2px ${GRAY}`, fontFamily: "'Arial Black', Arial, sans-serif" }}>
          {rank}
        </span>
      ) : null}
      <div className={featured ? 'h-40' : 'h-32'}>
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.92)' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(140deg, #232323 0%, #0d0d0d 100%)' }}>
            <span className="text-2xl font-black uppercase tracking-tight" style={{ color: RED }}>
              {String(project.title || 'P').slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      {/* hover details overlay */}
      <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.92) 88%)' }}>
        <div className="p-3 pointer-events-auto">
          <h4 className="text-sm font-bold mb-1 truncate" style={{ color: WHITE }}>{project.title}</h4>
          <p className="text-[11px] leading-snug mb-2 line-clamp-2" style={{ color: GRAY }}>
            {project.description}
          </p>
          <div className="flex items-center gap-2">
            {(project.liveUrl || project.githubUrl) ? (
              <>
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className="w-7 h-7 rounded-full border flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{ borderColor: HAIRLINE, color: WHITE }} title="Open live">
                    <Play size={11} className="ml-0.5" />
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className="w-7 h-7 rounded-full border flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{ borderColor: HAIRLINE, color: WHITE }} title="Source code">
                    <Github size={12} />
                  </a>
                ) : null}
              </>
            ) : null}
            <span className="ml-auto flex gap-1.5">
              <span className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: HAIRLINE, color: GRAY }}>
                <Plus size={12} />
              </span>
              <span className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: HAIRLINE, color: GRAY }}>
                <ThumbsUp size={12} />
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* below-card meta (always visible) */}
      <div className="px-2.5 py-2.5">
        <p className="text-[13px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {project.title}
        </p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#46d369' }}>
          {(88 + ((String(project.title || '').length * 7) % 12))}% Match
          <span className="ml-2 font-normal" style={{ color: GRAY }}>
            {(project.techStack || []).slice(0, 2).join(' · ') || 'Original Series'}
          </span>
        </p>
      </div>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  const projects = data.projects || [];
  const featured = projects[0];
  const backdrop = featured?.image || '';

  return (
    <section id="hero" className="relative overflow-hidden" style={{ minHeight: '86vh', background: BG }}>
      {/* backdrop art */}
      <div className="absolute inset-0">
        {backdrop ? (
          <img src={backdrop} alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ filter: 'brightness(0.5)' }} />
        ) : (
          <div className="w-full h-full" style={{ background: `radial-gradient(ellipse 70% 60% at 75% 30%, ${RED_DEEP}55, transparent 70%), linear-gradient(160deg, #1f1f1f 0%, #0a0a0a 100%)` }} />
        )}
        {/* cinematic gradients */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,20,20,0.96) 0%, rgba(20,20,20,0.55) 45%, transparent 75%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(180deg, transparent, #141414)' }} />
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger}
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-44 md:pt-56 pb-24 max-w-2xl">
        <motion.p variants={fadeUp} className="flex items-center gap-2 mb-4">
          <span className="px-1.5 py-0.5 text-[11px] font-black rounded-sm" style={{ background: RED, color: WHITE }}>PORTFOLIO</span>
          <span className="text-xs font-bold tracking-[0.3em]" style={{ color: GRAY }}>ORIGINAL</span>
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-2xl"
          style={{ color: WHITE }}>
          {featured?.title || p.name || 'Featured Work'}
        </motion.h1>
        {featured?.title ? (
          <motion.p variants={fadeUp} className="text-lg font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {p.name}
            {p.title ? <span style={{ color: GRAY }}> — {p.title}</span> : null}
          </motion.p>
        ) : (p.title ? (
          <motion.p variants={fadeUp} className="text-lg font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {p.title}
          </motion.p>
        ) : null)}
        <motion.p variants={fadeUp} className="flex items-center gap-3 text-sm font-semibold mb-4" style={{ color: GRAY }}>
          <span style={{ color: '#46d369' }}>98% Match</span>
          <span>{new Date().getFullYear()}</span>
          <span className="px-1.5 border" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.75)' }}>HD</span>
          {p.location ? <span className="inline-flex items-center gap-1"><MapPin size={12} /> {p.location}</span> : null}
        </motion.p>
        <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed mb-8 max-w-xl line-clamp-3"
          style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {featured?.description || p.tagline || p.bio || 'A collection of work, presented in glorious high definition.'}
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3 rounded font-bold text-sm md:text-base transition-colors hover:bg-white/80"
            style={{ background: WHITE, color: '#000000' }}>
            <Play size={20} className="fill-current" /> Play
          </a>
          <a href="#about"
            className="inline-flex items-center gap-2 px-7 py-3 rounded font-bold text-sm md:text-base transition-colors hover:bg-[rgba(109,109,110,0.5)]"
            style={{ background: 'rgba(109,109,110,0.7)', color: WHITE }}>
            <Info size={20} /> More Info
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Skills as a Netflix category browse row */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="px-6 md:px-10 py-14 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <RowTitle>Browse by Category</RowTitle>
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {categories.map((cat, i) => (
            <div key={i}
              className="relative h-24 rounded-md flex flex-col items-center justify-center px-3 text-center transition-transform hover:scale-105 cursor-default"
              style={{ background: GENRE_GRADIENTS[i % GENRE_GRADIENTS.length], boxShadow: '0 4px 14px rgba(0,0,0,0.45)' }}>
              <span className="text-sm md:text-base font-black uppercase tracking-wide" style={{ color: WHITE }}>
                {cat}
              </span>
              <span className="text-[10px] font-bold mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {skills.filter(s => (s.category || 'Core') === cat).length} titles
              </span>
            </div>
          ))}
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2.5">
          {skills.map((skill, i) => {
            const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
            return (
              <motion.div key={i} variants={fadeUp} className="flex items-center gap-3 py-1.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span className="text-[11px] w-6 text-right" style={{ fontFamily: 'ui-monospace, monospace', color: 'rgba(179,179,179,0.6)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium flex-1 truncate" style={{ color: WHITE }}>{skill.name}</span>
                <span className="text-[11px] font-semibold" style={{ color: RED }}>{level}%</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

/* Projects — ranked carousel + more-like-this row */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  const top = projects.slice(0, 6);
  const more = projects.slice(6);
  return (
    <section id="projects" className="py-14">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
        {top.length > 0 && (
          <div className="group/row px-6 md:px-10 max-w-7xl mx-auto mb-12">
            <RowTitle>Continue Exploring</RowTitle>
            <Carousel>
              {top.map((project, i) => (
                <ProjectCard key={i} project={project} rank={i + 1} featured />
              ))}
            </Carousel>
          </div>
        )}
        {more.length > 0 && (
          <div className="group/row px-6 md:px-10 max-w-7xl mx-auto">
            <RowTitle>More Like This</RowTitle>
            <Carousel>
              {more.map((project, i) => (
                <ProjectCard key={i} project={project} />
              ))}
            </Carousel>
          </div>
        )}
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'Years Active', value: stats.yearsExperience },
    { label: 'Titles Released', value: stats.projectsCompleted },
    { label: 'Collaborations', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="px-6 md:px-10 py-14 max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <RowTitle>About the Creator</RowTitle>
        <motion.div variants={fadeUp} className="rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8"
          style={{ background: 'linear-gradient(90deg, rgba(229,9,20,0.10), rgba(24,24,24,0.9) 55%)', border: `1px solid ${HAIRLINE}` }}>
          <div className="shrink-0 mx-auto md:mx-0">
            {p.avatar ? (
              <img src={p.avatar} alt={p.name || 'Portrait'}
                className="w-40 h-56 object-cover rounded-md"
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }} />
            ) : (
              <div className="w-40 h-56 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(160deg, #232323, #0d0d0d)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                <Monogram name={p.name} size={64} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black tracking-tight mb-1" style={{ color: WHITE }}>{p.name || 'Unknown Creator'}</h3>
            {p.title ? <p className="text-sm font-semibold mb-4" style={{ color: RED }}>{p.title}</p> : null}
            <p className="text-sm leading-relaxed mb-6" style={{ color: GRAY }}>
              {p.bio || 'Creator bio coming soon — for now, enjoy the features above.'}
            </p>
            {statItems.length > 0 && (
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {statItems.map((s, i) => (
                  <div key={i} className="rounded-md p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xl font-black" style={{ color: WHITE }}>{s.value}</div>
                    <div className="text-[10px] font-bold uppercase mt-1" style={{ letterSpacing: '0.12em', color: GRAY }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Experience — career timeline as "seasons" */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="px-6 md:px-10 py-14 max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <RowTitle>Career Timeline</RowTitle>
        <div>
          {experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="group flex gap-5 py-6 border-t last:border-b transition-colors hover:bg-[#181818] px-3 -mx-3 rounded"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <span className="text-lg md:text-xl font-black shrink-0 w-24 md:w-36 leading-snug"
                style={{ color: RED, fontFamily: "'Arial Black', Arial, sans-serif" }}>
                {exp.period}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold" style={{ color: WHITE }}>
                  {exp.role} <span className="font-medium" style={{ color: GRAY }}>· {exp.company}</span>
                </h3>
                {exp.description ? (
                  <p className="text-sm leading-relaxed mt-1.5" style={{ color: GRAY }}>{exp.description}</p>
                ) : null}
              </div>
              <span className="self-center text-xs font-bold uppercase tracking-wider shrink-0" style={{ color: 'rgba(179,179,179,0.5)' }}>
                S{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/* Testimonials — critics' reviews */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" className="px-6 md:px-10 py-14 max-w-7xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <RowTitle>Critics &amp; Collaborators</RowTitle>
        <motion.div variants={fadeUp} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="shrink-0 w-[300px] rounded-lg p-5"
              style={{ background: CARD, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={13} style={{ color: RED, fill: RED }} />
                ))}
              </div>
              <p className="text-[13px] leading-relaxed mb-4 line-clamp-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded object-cover" />
                ) : (
                  <Monogram name={t.name} size={32} bg="rgba(229,9,20,0.2)" fg="#ff6b70" />
                )}
                <span>
                  <span className="block text-sm font-bold" style={{ color: WHITE }}>{t.name}</span>
                  <span className="block text-[11px]" style={{ color: GRAY }}>{t.role}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
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
    <section id="contact" className="px-6 md:px-10 pt-16 pb-8 max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: WHITE }}>
          Questions? <span style={{ color: RED }}>Get in touch.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: GRAY }}>
          {p.tagline || 'Open to new productions, collaborations, and guest appearances.'}
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
          {email ? (
            <a href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-sm transition-colors hover:bg-[#f6121d]"
              style={{ background: RED, color: WHITE }}>
              <Mail size={16} /> Email me
            </a>
          ) : null}
          {socialLinks.map(l => (
            <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-sm border transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.35)', color: WHITE }}>
              <l.Icon size={16} /> {l.label}
            </a>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <p className="text-xs" style={{ color: 'rgba(179,179,179,0.7)' }}>
            &copy; {new Date().getFullYear()} {p.name || ''} — all rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'rgba(179,179,179,0.45)' }}>
            Original portfolio · Binge responsibly
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function NetflixBrowse() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Categories', href: '#skills' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: BG, color: WHITE, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* profile-style header */}
      <header className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
        style={{
          background: scrolled ? BG : 'linear-gradient(180deg, rgba(0,0,0,0.75), transparent)',
          borderBottom: scrolled ? `1px solid ${HAIRLINE}` : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center gap-8">
          <a href="#hero" className="font-black uppercase tracking-tighter text-xl md:text-2xl" style={{ color: RED }}>
            {p.name || 'Portfolio'}
          </a>
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.75)' }}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <a href="#contact" aria-label="Email"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-white"
              style={{ color: GRAY }}>
              <Mail size={15} /> Invite
            </a>
            <a href="#about" aria-label="About profile">
              {p.avatar ? (
                <img src={p.avatar} alt="" className="w-8 h-8 rounded object-cover" style={{ border: `1px solid ${HAIRLINE}` }} />
              ) : (
                <Monogram name={p.name} size={32} />
              )}
            </a>
          </div>
        </div>
      </header>

      <Hero data={data} />
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {(p.bio || p.avatar) ? <About data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
