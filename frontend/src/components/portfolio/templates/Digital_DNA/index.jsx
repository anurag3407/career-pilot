import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Dna, Mail, Github, Linkedin, Twitter, MapPin, ExternalLink,
  FlaskConical, Microscope, Activity, Quote
} from 'lucide-react';

/**
 * Digital DNA Portfolio Template
 * Category: 3D / WebGL
 * Description: Rotating DNA double-helix hero section with biotech-inspired color palette (cyan, magenta, white). Animated helix using CSS transforms and keyframes.
 */

const NAVY = '#050d23';
const NAVY_2 = '#081535';
const TEAL = '#2ee6d6';
const MAGENTA = '#ff2ec4';
const INK = 'rgba(228,244,255,0.92)';
const INK_DIM = 'rgba(160,190,220,0.65)';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } }
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((w) => w[0].toUpperCase()).join('')) || 'A';
};

// Deterministic "gene code" label, e.g. GX-C7
const geneCode = (i) => `GX-${'ACGT'[i % 4]}${(i * 7 + 3) % 99 < 10 ? '0' : ''}${(i * 7 + 3) % 99}`;

const GENE_CSS = `
@keyframes dnaStrandA {
  0%   { transform: translateX(var(--amp)) scale(0.9); opacity: 0.75; }
  25%  { transform: translateX(0px) scale(1.18); opacity: 1; }
  50%  { transform: translateX(calc(var(--amp) * -1)) scale(0.9); opacity: 0.75; }
  75%  { transform: translateX(0px) scale(0.62); opacity: 0.4; }
  100% { transform: translateX(var(--amp)) scale(0.9); opacity: 0.75; }
}
@keyframes dnaStrandB {
  0%   { transform: translateX(calc(var(--amp) * -1)) scale(0.9); opacity: 0.75; }
  25%  { transform: translateX(0px) scale(0.62); opacity: 0.4; }
  50%  { transform: translateX(var(--amp)) scale(0.9); opacity: 0.75; }
  75%  { transform: translateX(0px) scale(1.18); opacity: 1; }
  100% { transform: translateX(calc(var(--amp) * -1)) scale(0.9); opacity: 0.75; }
}
@keyframes dnaRung {
  0%, 50%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.85; }
  25%, 75%      { transform: translateX(-50%) scaleX(0.05); opacity: 0.15; }
}
`;

// One base pair: teal node + magenta node joined by a glowing rung
const BasePair = ({ i, spacing, amp }) => {
  const delay = -(i * 0.36); // negative delay = helix fully wound on first paint
  return (
    <div className="absolute left-1/2" style={{ top: `${i * spacing}px` }}>
      <div aria-hidden
        className="absolute top-1/2 h-[3px] rounded-full"
        style={{
          '--amp': `${amp}px`,
          width: `${amp * 2}px`,
          left: 0,
          marginTop: '-1.5px',
          background: `linear-gradient(90deg, ${TEAL}, ${MAGENTA})`,
          boxShadow: '0 0 12px rgba(46,230,214,0.55), 0 0 12px rgba(255,46,196,0.4)',
          animation: 'dnaRung 4.8s linear infinite',
          animationDelay: `${delay}s`,
        }} />
      <div aria-hidden
        className="absolute w-3.5 h-3.5 rounded-full"
        style={{
          '--amp': `${amp}px`,
          top: '-7px',
          left: `${amp}px`,
          marginLeft: '-7px',
          background: TEAL,
          boxShadow: `0 0 14px ${TEAL}, 0 0 30px rgba(46,230,214,0.45)`,
          animation: 'dnaStrandA 4.8s linear infinite',
          animationDelay: `${delay}s`,
        }} />
      <div aria-hidden
        className="absolute w-3.5 h-3.5 rounded-full"
        style={{
          '--amp': `${amp}px`,
          top: '-7px',
          left: `${-amp}px`,
          marginLeft: '-7px',
          background: MAGENTA,
          boxShadow: `0 0 14px ${MAGENTA}, 0 0 30px rgba(255,46,196,0.45)`,
          animation: 'dnaStrandB 4.8s linear infinite',
          animationDelay: `${delay}s`,
        }} />
    </div>
  );
};

const DNAHelix = () => {
  const rungs = 16;
  const spacing = 26;
  const amp = 74;
  return (
    <div className="relative mx-auto overflow-hidden" style={{ height: rungs * spacing + 40, width: amp * 2 + 60 }}>
      {/* strand skeleton guides */}
      <div aria-hidden className="absolute top-0 bottom-0 border-l border-dashed" style={{ left: `${amp}px`, borderColor: 'rgba(46,230,214,0.18)' }} />
      <div aria-hidden className="absolute top-0 bottom-0 border-l border-dashed" style={{ left: `${-amp + (amp * 2 + 60) / 2 + amp}px`, borderColor: 'rgba(255,46,196,0.18)' }} />
      {Array.from({ length: rungs }).map((_, i) => (
        <BasePair key={i} i={i} spacing={spacing} amp={amp} />
      ))}
      {/* fade mask top/bottom so the helix dissolves like a sequencing read */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-10 pointer-events-none" style={{ background: `linear-gradient(180deg, ${NAVY} 0%, transparent 100%)` }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-10 pointer-events-none" style={{ background: `linear-gradient(0deg, ${NAVY} 0%, transparent 100%)` }} />
    </div>
  );
};

// Section header styled like a lab chromosome record
const SectionHead = ({ chrom, title, sub }) => (
  <motion.div variants={fadeUp} className="mb-12 text-center relative">
    <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: TEAL }}>
      // CHR-{chrom} &middot; {sub}
    </p>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: INK }}>
      {title}
    </h2>
    <div aria-hidden className="mx-auto mt-4 h-[2px] w-40 rounded-full"
      style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, ${MAGENTA}, transparent)`, boxShadow: '0 0 12px rgba(46,230,214,0.5)' }} />
  </motion.div>
);

const GlowAvatar = ({ src, alt, size = 'w-52 h-60' }) => {
  const name = alt || '';
  return src ? (
    <div className={`relative ${size} rounded-2xl overflow-hidden border-2`}
      style={{ borderColor: 'rgba(46,230,214,0.45)', boxShadow: '0 0 30px rgba(46,230,214,0.25), 0 0 60px rgba(255,46,196,0.12)' }}>
      <img src={src} alt={name} className="w-full h-full object-cover" />
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, rgba(46,230,214,0.12), transparent 45%, rgba(255,46,196,0.15))' }} />
    </div>
  ) : (
    <div className={`relative ${size} rounded-2xl border-2 flex flex-col items-center justify-center gap-3`}
      style={{
        borderColor: 'rgba(46,230,214,0.45)',
        background: 'radial-gradient(120px 120px at 30% 20%, rgba(46,230,214,0.12), transparent), radial-gradient(120px 120px at 75% 85%, rgba(255,46,196,0.12), transparent), rgba(8,21,53,0.8)',
        boxShadow: '0 0 30px rgba(46,230,214,0.2)',
      }}>
      <Dna size={26} style={{ color: TEAL }} />
      <span className="text-5xl font-bold tracking-widest" style={{ color: INK }}>{initialsOf(name)}</span>
      <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: INK_DIM }}>SAMPLE&nbsp;PENDING</span>
    </div>
  );
};

export default function DigitalDNA() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  const navItems = [
    { label: 'About', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Genome', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Projects', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Helix', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Signals', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Contact', href: '#contact', show: true },
  ].filter((item) => item.show);

  const scatter = Array.from({ length: 14 }).map((_, i) => ({
    left: (i * 37 + 8) % 96,
    top: (i * 53 + 12) % 92,
    ch: 'ACGT'[i % 4],
    size: 13 + (i * 17) % 22,
    delay: (i % 6) * 0.7,
  }));

  return (
    <div className="antialiased overflow-x-hidden font-sans" style={{ background: NAVY, color: INK }}>
      <style>{GENE_CSS}</style>

      {/* Nav */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-2 px-3 py-2 rounded-full border backdrop-blur-md max-w-[94vw] overflow-x-auto"
        style={{ background: 'rgba(5,13,35,0.8)', borderColor: 'rgba(46,230,214,0.3)', boxShadow: '0 0 24px rgba(46,230,214,0.12)' }}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-[11px] uppercase px-3 py-1 rounded-full font-mono tracking-widest transition-colors hover:text-[#050d23]"
            style={{ color: INK_DIM }}
            onMouseEnter={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#050d23'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = INK_DIM; }}>
            {item.label}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden px-6 py-28"
        style={{ background: `radial-gradient(900px 500px at 80% 15%, rgba(255,46,196,0.10), transparent 60%), radial-gradient(800px 500px at 12% 80%, rgba(46,230,214,0.12), transparent 60%), linear-gradient(180deg, ${NAVY} 0%, ${NAVY_2} 100%)` }}>
        {/* drifting base letters */}
        {scatter.map((s, i) => (
          <motion.span key={i} aria-hidden
            className="absolute font-mono font-bold pointer-events-none select-none"
            animate={{ y: [0, -26, 0], opacity: [0.05, 0.16, 0.05] }}
            transition={{ duration: 7 + (i % 4) * 2, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
            style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, color: i % 2 ? TEAL : MAGENTA }}>
            {s.ch}
          </motion.span>
        ))}
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.45em] uppercase mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
              style={{ color: TEAL, borderColor: 'rgba(46,230,214,0.4)' }}>
              <Dna size={14} /> Genome Sequenced
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] mb-5 break-words">
              <span style={{ color: INK }}>{name}</span>
            </motion.h1>
            {data.personal?.title && (
              <motion.p variants={fadeUp} className="text-xl md:text-2xl font-semibold mb-4 bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${TEAL}, ${MAGENTA})` }}>
                {data.personal.title}
              </motion.p>
            )}
            {data.personal?.tagline && (
              <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-lg mb-7" style={{ color: INK_DIM }}>
                {data.personal.tagline}
              </motion.p>
            )}
            {data.personal?.location && (
              <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] mb-8"
                style={{ color: INK_DIM }}>
                <MapPin size={13} style={{ color: TEAL }} /> {data.personal.location}
              </motion.p>
            )}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a href="#projects"
                className="px-7 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: `linear-gradient(90deg, ${TEAL}, #1cb5a3)`, color: '#04121f', boxShadow: '0 0 26px rgba(46,230,214,0.4)' }}>
                View Projects
              </a>
              <a href="#about"
                className="px-7 py-3 rounded-full font-semibold text-sm border transition-transform hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(255,46,196,0.55)', color: MAGENTA, boxShadow: '0 0 18px rgba(255,46,196,0.18)' }}>
                Read Bio
              </a>
              <a href="#contact"
                className="px-7 py-3 rounded-full font-semibold text-sm border transition-transform hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(160,190,220,0.35)', color: INK_DIM }}>
                Contact Lab
              </a>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }}
            className="hidden lg:flex justify-center relative">
            <DNAHelix />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      {(data.personal?.bio || data.personal?.avatar || data.stats?.yearsExperience) && (
        <section id="about" className="relative py-24 px-6 overflow-hidden" style={{ background: NAVY_2 }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <SectionHead chrom="01" title="The Specimen" sub="About" />
              <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
                <div className="mx-auto"><GlowAvatar src={data.personal?.avatar} alt={name} /></div>
                <motion.div variants={fadeUp}>
                  <FlaskConical size={20} className="mb-4" style={{ color: MAGENTA }} />
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: INK_DIM }}>
                    {data.personal?.bio || 'This genome is currently being sequenced. The full profile will be published shortly.'}
                  </p>
                  {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                    <div className="grid grid-cols-3 gap-4 mt-9">
                      {[
                        { label: 'Years Sequenced', value: data.stats.yearsExperience, c: TEAL },
                        { label: 'Projects Cloned', value: data.stats.projectsCompleted, c: MAGENTA },
                        { label: 'Happy Cells', value: data.stats.happyClients, c: TEAL },
                      ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                        <div key={i} className="rounded-xl border p-4 text-center"
                          style={{ borderColor: 'rgba(46,230,214,0.22)', background: 'rgba(5,13,35,0.6)' }}>
                          <div className="text-3xl font-bold" style={{ color: s.c }}>{s.value}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.2em] mt-1.5" style={{ color: INK_DIM }}>{s.label}</div>
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

      {/* SKILLS — gene markers */}
      {data.skills?.length > 0 && (
        <section id="skills" className="relative py-24 px-6 overflow-hidden" style={{ background: NAVY }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <SectionHead chrom="02" title="Gene Markers" sub="Skills" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.skills.map((skill, i) => {
                  const level = Number(skill.level) || 85;
                  const c = i % 2 ? MAGENTA : TEAL;
                  return (
                    <motion.div key={i} variants={fadeUp} whileHover={{ y: -5, scale: 1.03 }}
                      className="relative rounded-xl border p-4 font-mono overflow-hidden group"
                      style={{ borderColor: `${c}55`, background: 'rgba(8,21,53,0.75)', boxShadow: `0 0 ${8 + (i % 3) * 6}px ${c}22` }}>
                      <span aria-hidden className="absolute top-2 right-2.5 text-[9px] tracking-widest" style={{ color: `${c}99` }}>
                        {geneCode(i)}
                      </span>
                      <Microscope size={15} className="mb-2.5" style={{ color: c }} />
                      <div className="text-sm font-bold mb-2 break-words" style={{ color: INK }}>{skill.name || 'Marker'}</div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(160,190,220,0.14)' }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }} whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }} transition={{ duration: 1, delay: (i % 4) * 0.12 }}
                          style={{ background: `linear-gradient(90deg, ${c}66, ${c})`, boxShadow: `0 0 8px ${c}88` }} />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] tracking-widest" style={{ color: INK_DIM }}>
                        <span>{skill.category || 'CORE'}</span>
                        <span style={{ color: c }}>{level}%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects?.length > 0 && (
        <section id="projects" className="relative py-24 px-6 overflow-hidden" style={{ background: NAVY_2 }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
              <SectionHead chrom="03" title="Cultured Work" sub="Projects" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.projects.map((project, i) => {
                  const c = i % 2 ? MAGENTA : TEAL;
                  return (
                    <motion.article key={i} variants={fadeUp} whileHover={{ y: -8 }}
                      className="relative rounded-2xl border overflow-hidden transition-shadow"
                      style={{ borderColor: `${c}44`, background: 'rgba(5,13,35,0.85)', boxShadow: `0 14px 40px rgba(0,0,0,0.4), 0 0 0 1px ${c}22 inset` }}>
                      {/* corner brackets */}
                      <span aria-hidden className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl z-10" style={{ borderColor: c }} />
                      <span aria-hidden className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr z-10" style={{ borderColor: c }} />
                      {project.image && (
                        <div className="relative h-40 overflow-hidden">
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                          <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${NAVY} 100%)` }} />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Activity size={14} style={{ color: c }} />
                          <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: c }}>SPEC-{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: INK }}>{project.title}</h3>
                        {project.description && (
                          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: INK_DIM }}>{project.description}</p>
                        )}
                        {project.techStack?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.techStack.slice(0, 8).map((tech, j) => (
                              <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                                style={{ borderColor: `${j % 2 ? MAGENTA : TEAL}55`, color: j % 2 ? MAGENTA : TEAL }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4 text-xs font-semibold">
                          {project.liveUrl && project.liveUrl !== '#' && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-75" style={{ color: TEAL }}>
                              <ExternalLink size={13} /> Live Culture
                            </a>
                          )}
                          {project.githubUrl && project.githubUrl !== '#' && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-75" style={{ color: INK_DIM }}>
                              <Github size={13} /> Source
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* EXPERIENCE — helix ladder */}
      {data.experience?.length > 0 && (
        <section id="experience" className="relative py-24 px-6 overflow-hidden" style={{ background: NAVY }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <SectionHead chrom="04" title="The Helix Ladder" sub="Experience" />
              <div className="relative">
                {/* central strand */}
                <div aria-hidden className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full"
                  style={{ background: `linear-gradient(180deg, ${TEAL}, ${MAGENTA}, ${TEAL})`, boxShadow: '0 0 14px rgba(46,230,214,0.5)' }} />
                {data.experience.map((exp, i) => {
                  const left = i % 2 === 0;
                  const c = left ? TEAL : MAGENTA;
                  return (
                    <motion.div key={i} variants={fadeUp}
                      className={`relative flex ${left ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-10 last:mb-0`}>
                      {/* rung connector */}
                      <div aria-hidden className={`hidden md:block absolute top-1/2 h-[2px] w-[calc(50%-3.5rem)] ${left ? 'left-1/2 -translate-x-full' : 'right-1/2 translate-x-full'}`}
                        style={{ background: `linear-gradient(90deg, ${c}, transparent)`, boxShadow: `0 0 10px ${c}66` }} />
                      {/* node on the strand */}
                      <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-10"
                        style={{ background: c, boxShadow: `0 0 14px ${c}, 0 0 30px ${c}55` }} />
                      <div className={`md:w-1/2 ${left ? 'md:pr-16' : 'md:pl-16'} pl-10 md:pl-0 ${left ? '' : 'md:text-left'}`}>
                        <div className={`rounded-xl border p-5 transition-transform hover:-translate-y-1 ${left ? '' : ''}`}
                          style={{ borderColor: `${c}44`, background: 'rgba(8,21,53,0.8)', boxShadow: `0 8px 30px rgba(0,0,0,0.35), 0 0 16px ${c}18` }}>
                          {exp.period && (
                            <span className="inline-block font-mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full border mb-3"
                              style={{ borderColor: `${c}66`, color: c }}>
                              {exp.period}
                            </span>
                          )}
                          <h3 className="text-lg font-bold" style={{ color: INK }}>{exp.role || 'Role'}</h3>
                          {exp.company && <p className="text-sm font-semibold mt-0.5 mb-2" style={{ color: c }}>{exp.company}</p>}
                          {exp.description && <p className="text-sm leading-relaxed" style={{ color: INK_DIM }}>{exp.description}</p>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {data.testimonials?.length > 0 && (
        <section id="testimonials" className="relative py-24 px-6 overflow-hidden" style={{ background: NAVY_2 }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <SectionHead chrom="05" title="Signal Transduction" sub="Testimonials" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.testimonials.map((t, i) => {
                  const c = i % 2 ? TEAL : MAGENTA;
                  return (
                    <motion.figure key={i} variants={fadeUp} whileHover={{ y: -6 }}
                      className="rounded-2xl border p-6 relative overflow-hidden"
                      style={{ borderColor: `${c}3d`, background: 'rgba(5,13,35,0.85)', boxShadow: `0 10px 34px rgba(0,0,0,0.4), 0 0 20px ${c}14` }}>
                      <Quote size={20} style={{ color: c }} className="mb-3" />
                      <blockquote className="text-sm leading-relaxed mb-5" style={{ color: INK_DIM }}>&ldquo;{t.text}&rdquo;</blockquote>
                      <figcaption className="flex items-center gap-3">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: `${c}88` }} />
                        ) : (
                          <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2"
                            style={{ borderColor: `${c}88`, color: c, background: `${c}14` }}>
                            {initialsOf(t.name)}
                          </span>
                        )}
                        <span>
                          <span className="block text-sm font-bold" style={{ color: INK }}>{t.name || 'Anonymous'}</span>
                          {t.role && <span className="block text-xs" style={{ color: INK_DIM }}>{t.role}</span>}
                        </span>
                      </figcaption>
                      <span aria-hidden className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />
                    </motion.figure>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="relative py-24 px-6 overflow-hidden"
        style={{ background: `radial-gradient(700px 340px at 50% 115%, rgba(255,46,196,0.14), transparent 65%), radial-gradient(700px 340px at 50% 115%, rgba(46,230,214,0.14), transparent 65%), ${NAVY}` }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.p variants={fadeUp} className="font-mono text-[11px] tracking-[0.4em] uppercase mb-4" style={{ color: TEAL }}>
              // CHR-06 &middot; Contact
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-5" style={{ color: INK }}>
              Open a Channel
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm md:text-base mb-10" style={{ color: INK_DIM }}>
              The lab door is always open. Send a signal and it will be received.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-4 mb-8">
              {(data.personal?.email || data.socials?.email) && (
                <a href={`mailto:${data.personal?.email || data.socials?.email}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(90deg, ${TEAL}, ${MAGENTA})`, color: '#04121f', boxShadow: '0 0 30px rgba(46,230,214,0.35)' }}>
                  <Mail size={17} /> Send a Signal
                </a>
              )}
              {['github', 'linkedin', 'twitter'].map((key) => {
                const url = data.socials?.[key];
                if (!url) return null;
                const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-transform hover:-translate-y-1"
                    style={{ borderColor: 'rgba(160,190,220,0.35)', color: INK, background: 'rgba(8,21,53,0.7)' }}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>
            {(data.personal?.email || data.personal?.phone || data.personal?.location) && (
              <motion.p variants={fadeUp} className="font-mono text-xs tracking-widest" style={{ color: INK_DIM }}>
                {[data.personal?.email || data.socials?.email, data.personal?.phone, data.personal?.location].filter(Boolean).join('  //  ')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="border-t py-7 text-center" style={{ borderColor: 'rgba(46,230,214,0.15)', color: INK_DIM }}>
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-2">
          <Dna size={13} style={{ color: TEAL }} />
          &copy; {new Date().getFullYear()} {name} &middot; Digital DNA
        </p>
      </footer>
    </div>
  );
}
