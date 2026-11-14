import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, MousePointer2, Sparkles, Quote
} from 'lucide-react';

/**
 * Elastic Cards Portfolio Template
 * Category: Animated / Motion
 * Description: Project cards that stretch and snap like rubber bands on hover/drag. Elastic deformation effect using CSS transforms and spring transitions.
 */

const INK = '#3d405b';
const INK_SOFT = 'rgba(61,64,91,0.65)';
const BG = '#fdf6ee';

// Playful pastel set: [fill, deep accent]
const PASTELS = [
  { bg: '#ffd6c0', deep: '#e8794f' },
  { bg: '#c9f2e5', deep: '#2f9e77' },
  { bg: '#ddd6fa', deep: '#7c6bd6' },
  { bg: '#ffefb5', deep: '#c99a12' },
  { bg: '#cdeef5', deep: '#2f93ad' },
  { bg: '#ffc9dd', deep: '#d64f8a' },
];

const springSnap = { type: 'spring', stiffness: 320, damping: 12, bounce: 0.55 };
const rubberBand = { stiffness: 420, damping: 9, mass: 0.85 };

const popIn = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 15, bounce: 0.5 } }
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((w) => w[0].toUpperCase()).join('')) || 'A';
};

const Squishy = ({ children, className = '', as = 'a', ...rest }) => {
  const Tag = motion[as] || motion.a;
  return (
    <Tag
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={springSnap}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Squiggle divider
const Squiggle = ({ color = '#e8794f', className = '' }) => (
  <svg viewBox="0 0 160 14" className={className} fill="none" aria-hidden>
    <path d="M2 8 C 14 2, 26 12, 38 8 C 50 4, 62 12, 74 8 C 86 4, 98 12, 110 8 C 122 4, 134 12, 146 8 L 158 8"
      stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// A project card that stretches toward the cursor and snaps back like a rubber band
function ElasticCard({ project, tint }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, rubberBand);
  const sy = useSpring(y, rubberBand);

  const rotateY = useTransform(sx, [-1, 1], [17, -17]);
  const rotateX = useTransform(sy, [-1, 1], [-13, 13]);
  const skewX = useTransform(sx, [-1, 1], [-7, 7]);
  const skewY = useTransform(sy, [-1, 1], [5, -5]);
  const scale = useTransform([sx, sy], ([a, b]) =>
    1 + 0.07 * Math.min(1, (Math.abs(a) + Math.abs(b)) / 1.5)
  );
  const shadow = useTransform([sx, sy], ([a, b]) => {
    const k = Math.min(1, (Math.abs(a) + Math.abs(b)) / 1.5);
    return `0 ${16 + k * 22}px ${26 + k * 26}px rgba(61,64,91,${0.14 + k * 0.1})`;
  });

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 2 - 1);
    y.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.article
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        variants={popIn}
        style={{
          rotateY, rotateX, skewX, skewY, scale, boxShadow: shadow,
          background: tint.bg,
          transformStyle: 'preserve-3d',
        }}
        className="rounded-[1.75rem] p-6 border-2 cursor-pointer select-none"
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full text-white"
            style={{ background: tint.deep }}>
            rubber band
          </span>
          <MousePointer2 size={16} style={{ color: tint.deep }} />
        </div>
        {project.image && (
          <div className="rounded-2xl overflow-hidden mb-4 border-2 border-white/70">
            <img src={project.image} alt={project.title} className="w-full h-36 object-cover" />
          </div>
        )}
        <h3 className="text-xl font-black mb-2" style={{ color: INK }}>{project.title}</h3>
        {project.description && (
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: INK_SOFT }}>
            {project.description}
          </p>
        )}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 6).map((tech, j) => (
              <span key={j} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border-2 bg-white/60"
                style={{ borderColor: tint.deep, color: tint.deep }}>
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 text-xs font-black">
          {project.liveUrl && project.liveUrl !== '#' && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white transition-transform hover:scale-105"
              style={{ background: tint.deep }}>
              <ExternalLink size={13} /> Stretch it open
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/70 border-2 transition-transform hover:scale-105"
              style={{ borderColor: INK, color: INK }}>
              <Github size={13} /> Source
            </a>
          )}
        </div>
      </motion.article>
    </div>
  );
}

export default function ElasticCards() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  const navItems = [
    { label: 'About', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Skills', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Projects', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Journey', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Cheers', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Contact', href: '#contact', show: true },
  ].filter((item) => item.show);

  const floaters = Array.from({ length: 7 }).map((_, i) => ({
    left: (i * 41 + 6) % 92,
    top: (i * 29 + 10) % 84,
    size: 34 + ((i * 23) % 60),
    color: PASTELS[i % PASTELS.length].bg,
    round: i % 2 === 0 ? '50%' : '30%',
    dur: 6 + (i % 4) * 1.6,
  }));

  return (
    <div className="antialiased overflow-x-hidden font-sans" style={{ background: BG, color: INK }}>
      {/* pill nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex gap-1 px-2 py-2 rounded-full bg-white/85 backdrop-blur border-2 max-w-[94vw] overflow-x-auto"
        style={{ borderColor: 'rgba(61,64,91,0.12)', boxShadow: '0 8px 24px rgba(61,64,91,0.12)' }}>
        {navItems.map((item, i) => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-xs font-bold px-3.5 py-1.5 rounded-full transition-transform hover:scale-110 hover:-rotate-2"
            style={{ color: PASTELS[i % PASTELS.length].deep }}>
            {item.label}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-28"
        style={{ background: `radial-gradient(560px 420px at 85% 10%, #ffd6c066, transparent 65%), radial-gradient(560px 420px at 10% 90%, #ddd6fa66, transparent 65%), ${BG}` }}>
        {floaters.map((f, i) => (
          <motion.div key={i} aria-hidden
            className="absolute pointer-events-none opacity-70"
            animate={{ y: [0, -22, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
            transition={{ duration: f.dur, repeat: Infinity, ease: 'easeInOut', delay: (i % 5) * 0.6 }}
            style={{ left: `${f.left}%`, top: `${f.top}%`, width: f.size, height: f.size, background: f.color, borderRadius: f.round }} />
        ))}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl text-center">
          <motion.span variants={popIn}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border-2 mb-6 bg-white/70"
            style={{ borderColor: '#e8794f', color: '#e8794f' }}>
            <Sparkles size={14} /> Stretchy &amp; snappy portfolio
          </motion.span>
          <motion.h1 variants={popIn} className="text-5xl md:text-7xl font-black leading-[1.02] tracking-tight mb-5 break-words">
            Hi, I&apos;m {name}
          </motion.h1>
          <motion.div variants={popIn} className="mb-5">
            <Squiggle className="w-44 h-4 mx-auto" />
          </motion.div>
          {data.personal?.title && (
            <motion.p variants={popIn} className="text-xl md:text-2xl font-extrabold mb-3" style={{ color: '#7c6bd6' }}>
              {data.personal.title}
            </motion.p>
          )}
          {data.personal?.tagline && (
            <motion.p variants={popIn} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6" style={{ color: INK_SOFT }}>
              {data.personal.tagline}
            </motion.p>
          )}
          {data.personal?.location && (
            <motion.p variants={popIn} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-9"
              style={{ color: INK_SOFT }}>
              <MapPin size={13} style={{ color: '#2f9e77' }} /> {data.personal.location}
            </motion.p>
          )}
          <motion.div variants={popIn} className="flex flex-wrap justify-center gap-3">
            <Squishy href="#projects" className="px-7 py-3.5 rounded-full text-sm font-black text-white shadow-lg"
              style={{ background: '#3d405b' }}>
              Play with projects
            </Squishy>
            <Squishy href="#about" className="px-7 py-3.5 rounded-full text-sm font-black border-2"
              style={{ borderColor: '#3d405b', color: '#3d405b', background: 'rgba(255,255,255,0.6)' }}>
              About me
            </Squishy>
            <Squishy href="#contact" className="px-7 py-3.5 rounded-full text-sm font-black border-2"
              style={{ borderColor: '#d64f8a', color: '#d64f8a', background: 'rgba(255,255,255,0.6)' }}>
              Say hello
            </Squishy>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      {(data.personal?.bio || data.personal?.avatar || data.stats?.yearsExperience) && (
        <section id="about" className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <motion.div variants={popIn} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black">A bit about me</h2>
                <Squiggle className="w-36 h-3.5 mx-auto mt-3" color="#2f9e77" />
              </motion.div>
              <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
                <motion.div variants={popIn} className="mx-auto" style={{ rotate: -3 }}>
                  {data.personal?.avatar ? (
                    <div className="w-52 h-60 rounded-[2rem] border-4 bg-white p-2" style={{ borderColor: '#ffd6c0', boxShadow: '0 16px 36px rgba(61,64,91,0.15)' }}>
                      <img src={data.personal.avatar} alt={name} className="w-full h-full object-cover rounded-[1.5rem]" />
                    </div>
                  ) : (
                    <div className="w-52 h-60 rounded-[2rem] border-4 flex flex-col items-center justify-center gap-3"
                      style={{ borderColor: '#ffd6c0', background: '#ffece2', boxShadow: '0 16px 36px rgba(61,64,91,0.12)' }}>
                      <span className="text-6xl font-black" style={{ color: '#e8794f' }}>{initialsOf(name)}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: INK_SOFT }}>hello sticker</span>
                    </div>
                  )}
                </motion.div>
                <motion.div variants={popIn}>
                  <p className="text-base md:text-lg leading-relaxed font-medium" style={{ color: INK_SOFT }}>
                    {data.personal?.bio || 'This space is still inflating. Come back soon to read the full story.'}
                  </p>
                  {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      {[
                        { label: 'Years', value: data.stats.yearsExperience, p: PASTELS[0] },
                        { label: 'Projects', value: data.stats.projectsCompleted, p: PASTELS[1] },
                        { label: 'Happy clients', value: data.stats.happyClients, p: PASTELS[3] },
                      ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.08, rotate: i % 2 ? 2 : -2 }} transition={springSnap}
                          className="rounded-2xl border-2 p-4 text-center"
                          style={{ background: s.p.bg, borderColor: s.p.deep }}>
                          <div className="text-3xl font-black" style={{ color: INK }}>{s.value}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: s.p.deep }}>{s.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS — bouncy pills */}
      {data.skills?.length > 0 && (
        <section id="skills" className="relative py-24 px-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <motion.div variants={popIn} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black">Skills that stretch</h2>
                <Squiggle className="w-36 h-3.5 mx-auto mt-3" color="#7c6bd6" />
              </motion.div>
              <div className="flex flex-wrap justify-center gap-3">
                {data.skills.map((skill, i) => {
                  const p = PASTELS[i % PASTELS.length];
                  return (
                    <motion.div key={i} variants={popIn}
                      whileHover={{ scale: 1.14, rotate: (i % 2 ? 3 : -3) }}
                      whileTap={{ scale: 0.92 }}
                      transition={springSnap}
                      className="px-5 py-3 rounded-full border-2 cursor-default shadow-sm"
                      style={{ background: p.bg, borderColor: p.deep }}>
                      <span className="text-sm font-black" style={{ color: INK }}>{skill.name || 'Skill'}</span>
                      <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: p.deep }}>
                        {Number(skill.level) || 85}%
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROJECTS — the elastic wall */}
      {data.projects?.length > 0 && (
        <section id="projects" className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
              <motion.div variants={popIn} className="text-center mb-4">
                <h2 className="text-3xl md:text-4xl font-black">Pull on these</h2>
                <Squiggle className="w-40 h-3.5 mx-auto mt-3" color="#e8794f" />
                <p className="text-sm mt-4 inline-flex items-center gap-1.5 font-bold" style={{ color: INK_SOFT }}>
                  <MousePointer2 size={14} /> Move your cursor across a card — it stretches, then snaps back.
                </p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                {data.projects.map((project, i) => (
                  <ElasticCard key={i} project={project} tint={PASTELS[i % PASTELS.length]} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* EXPERIENCE — sticker timeline */}
      {data.experience?.length > 0 && (
        <section id="experience" className="relative py-24 px-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <motion.div variants={popIn} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black">The stretchy journey</h2>
                <Squiggle className="w-36 h-3.5 mx-auto mt-3" color="#c99a12" />
              </motion.div>
              <div className="relative border-l-4 pl-8 space-y-10" style={{ borderColor: '#ffd6c0' }}>
                {data.experience.map((exp, i) => {
                  const p = PASTELS[i % PASTELS.length];
                  return (
                    <motion.div key={i} variants={popIn} className="relative">
                      <motion.span whileHover={{ scale: 1.4 }} transition={springSnap}
                        className="absolute -left-[42px] top-1 w-5 h-5 rounded-full border-4 bg-white"
                        style={{ borderColor: p.deep }} />
                      <motion.div whileHover={{ scale: 1.02, rotate: i % 2 ? 0.8 : -0.8 }} transition={springSnap}
                        className="rounded-2xl border-2 p-5"
                        style={{ background: 'white', borderColor: p.deep, transform: `rotate(${(i % 2 ? 0.7 : -0.7)}deg)`, boxShadow: '0 10px 26px rgba(61,64,91,0.1)' }}>
                        {exp.period && (
                          <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2.5 text-white"
                            style={{ background: p.deep }}>
                            {exp.period}
                          </span>
                        )}
                        <h3 className="text-lg font-black" style={{ color: INK }}>{exp.role || 'Role'}</h3>
                        {exp.company && <p className="text-sm font-bold mt-0.5 mb-2" style={{ color: p.deep }}>@ {exp.company}</p>}
                        {exp.description && <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>{exp.description}</p>}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS — sticky notes */}
      {data.testimonials?.length > 0 && (
        <section id="testimonials" className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <motion.div variants={popIn} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black">Pinned kind words</h2>
                <Squiggle className="w-36 h-3.5 mx-auto mt-3" color="#d64f8a" />
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.testimonials.map((t, i) => {
                  const p = PASTELS[(i + 2) % PASTELS.length];
                  return (
                    <motion.figure key={i} variants={popIn}
                      whileHover={{ scale: 1.04, rotate: i % 2 ? -1.2 : 1.2, scaleZ: 1 }}
                      transition={springSnap}
                      className="relative rounded-2xl border-2 p-6 pt-8"
                      style={{ background: p.bg, borderColor: p.deep, transform: `rotate(${(i % 2 ? 1 : -1)}deg)`, boxShadow: '0 12px 28px rgba(61,64,91,0.12)' }}>
                      <span aria-hidden className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-sm bg-white/70 border"
                        style={{ borderColor: 'rgba(61,64,91,0.2)', transform: 'translateX(-50%) rotate(-2deg)' }} />
                      <Quote size={18} style={{ color: p.deep }} className="mb-3" />
                      <blockquote className="text-sm leading-relaxed mb-5 font-medium" style={{ color: INK }}>&ldquo;{t.text}&rdquo;</blockquote>
                      <figcaption className="flex items-center gap-3">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 bg-white" style={{ borderColor: p.deep }} />
                        ) : (
                          <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 bg-white"
                            style={{ borderColor: p.deep, color: p.deep }}>
                            {initialsOf(t.name)}
                          </span>
                        )}
                        <span>
                          <span className="block text-sm font-black" style={{ color: INK }}>{t.name || 'Anonymous'}</span>
                          {t.role && <span className="block text-xs font-bold" style={{ color: INK_SOFT }}>{t.role}</span>}
                        </span>
                      </figcaption>
                    </motion.figure>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="relative py-24 px-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
            className="rounded-[2.5rem] border-4 p-10 md:p-14 text-center"
            style={{ background: '#c9f2e5', borderColor: '#2f9e77', boxShadow: '0 20px 50px rgba(61,64,91,0.14)' }}>
            <motion.h2 variants={popIn} className="text-3xl md:text-5xl font-black mb-4" style={{ color: INK }}>
              Let&apos;s stretch something together
            </motion.h2>
            <motion.p variants={popIn} className="text-sm md:text-base font-medium mb-9" style={{ color: INK_SOFT }}>
              One email is all it takes to snap our timelines into the same rhythm.
            </motion.p>
            <motion.div variants={popIn} className="flex flex-wrap justify-center items-center gap-4">
              {(data.personal?.email || data.socials?.email) && (
                <Squishy href={`mailto:${data.personal?.email || data.socials?.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-black text-white shadow-lg"
                  style={{ background: '#3d405b' }}>
                  <Mail size={17} /> Email me
                </Squishy>
              )}
              {['github', 'linkedin', 'twitter'].map((key) => {
                const url = data.socials?.[key];
                if (!url) return null;
                const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
                return (
                  <Squishy key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                    className="inline-flex items-center justify-center w-13 h-13 p-3.5 rounded-full border-2 bg-white"
                    style={{ borderColor: '#3d405b', color: '#3d405b' }}>
                    <Icon size={18} />
                  </Squishy>
                );
              })}
            </motion.div>
            {(data.personal?.phone || data.personal?.location) && (
              <motion.p variants={popIn} className="text-xs font-bold mt-8 tracking-wide" style={{ color: INK_SOFT }}>
                {[data.personal?.phone, data.personal?.location].filter(Boolean).join('  •  ')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center" style={{ color: INK_SOFT }}>
        <p className="text-xs font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {name} &middot; Elastic Cards
        </p>
      </footer>
    </div>
  );
}
