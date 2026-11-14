import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, MapPin, ArrowRight, Pencil } from 'lucide-react';

/**
 * Paper Texture Portfolio Template
 * Category: Minimal / Clean
 * Description: Paper/parchment texture backgrounds with subtle grain. Handwritten font accents, sketch-style dividers, and a warm, analog feel.
 */

/* ------------------------------------------------------------------ */
/* Palette — warm parchment, sepia ink, one terracotta pencil          */
/* ------------------------------------------------------------------ */
const PAPER_TEX = {
  backgroundColor: '#f5edda',
  backgroundImage: [
    'repeating-linear-gradient(0deg, rgba(120,90,50,0.032) 0px, rgba(120,90,50,0.032) 1px, transparent 1px, transparent 3px)',
    'repeating-linear-gradient(90deg, rgba(120,90,50,0.032) 0px, rgba(120,90,50,0.032) 1px, transparent 1px, transparent 3px)',
    'radial-gradient(ellipse 50% 40% at 28% 18%, rgba(255,251,238,0.85), transparent 60%)',
    'radial-gradient(ellipse 45% 40% at 75% 80%, rgba(163,124,70,0.14), transparent 55%)',
    'linear-gradient(160deg, #f7efdc 0%, #efe3c7 100%)',
  ].join(', '),
};
const DEEP = '#ece1c6';
const INK = '#4a3b28';
const MUTED = 'rgba(74,59,40,0.62)';
const PENCIL = '#9c4a2f';
const TAPE = 'rgba(228,196,130,0.45)';
const SERIF = "Georgia, 'Iowan Old Style', serif";
const HAND = "'Segoe Script', 'Bradley Hand', 'Snell Roundhand', 'Comic Sans MS', cursive";
/* the classic wobbly, hand-drawn box */
const WOBBLE = { borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' };

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/* Sketch ornaments                                                    */
/* ------------------------------------------------------------------ */
const Squiggle = ({ width = 180, tone = PENCIL }) => (
  <svg viewBox="0 0 180 12" width={width} height="12" fill="none" aria-hidden="true">
    <motion.path
      d="M3,8 C20,3 38,10 58,7 C80,4 98,10 118,7 C138,4 156,9 177,6"
      stroke={tone} strokeWidth="2.2" strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  </svg>
);

/* a strip of washi tape, slightly rotated */
const Tape = ({ className = '', angle = -4, width = 84 }) => (
  <span aria-hidden="true" className={`absolute h-6 ${className}`}
    style={{
      width,
      background: `repeating-linear-gradient(45deg, ${TAPE} 0 6px, rgba(228,196,130,0.55) 6px 12px)`,
      transform: `rotate(${angle}deg)`,
      boxShadow: '0 1px 3px rgba(74,59,40,0.12)',
    }} />
);

const SectionHead = ({ label, title, note }) => (
  <motion.div variants={fadeUp} className="mb-12">
    <p className="text-xs uppercase mb-2" style={{ letterSpacing: '0.35em', color: MUTED }}>{label}</p>
    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: INK }}>{title}</h2>
    <Squiggle />
    {note ? (
      <p className="text-base mt-2" style={{ fontFamily: HAND, color: PENCIL }}>{note}</p>
    ) : null}
  </motion.div>
);

const Monogram = ({ name, size = 120 }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="flex items-center justify-center"
      style={{ ...WOBBLE, width: size, height: size, border: `2px solid ${INK}`, fontFamily: HAND, fontSize: size * 0.3, color: INK, background: 'rgba(255,251,238,0.7)' }}>
      {initials}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative overflow-hidden" style={PAPER_TEX}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={fadeUp} className="text-2xl mb-6" style={{ fontFamily: HAND, color: PENCIL }}>
            hello, friend —
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold leading-tight mb-4"
            style={{ fontFamily: SERIF, color: INK }}>
            {p.name || 'A journal of work'}
          </motion.h1>
          {p.title ? (
            <motion.p variants={fadeUp} className="text-lg md:text-xl italic mb-3" style={{ fontFamily: SERIF, color: MUTED }}>
              {p.title}
            </motion.p>
          ) : null}
          <motion.div variants={fadeUp}>
            <Squiggle width={220} />
          </motion.div>
          {p.tagline ? (
            <motion.p variants={fadeUp} className="text-lg mt-4 max-w-lg leading-relaxed" style={{ fontFamily: HAND, color: INK }}>
              {p.tagline}
            </motion.p>
          ) : null}
          {p.location ? (
            <motion.p variants={fadeUp} className="mt-4 inline-flex items-center gap-2 text-sm" style={{ color: MUTED }}>
              <MapPin size={14} strokeWidth={1.6} /> {p.location}
            </motion.p>
          ) : null}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-5">
            <a href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ ...WOBBLE, border: `2px solid ${INK}`, color: INK, background: 'rgba(255,251,238,0.8)' }}>
              See the pages <ArrowRight size={15} strokeWidth={1.8} />
            </a>
            <a href="#contact"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold border-b-2 transition-opacity hover:opacity-70"
              style={{ borderColor: PENCIL, color: PENCIL, fontFamily: HAND, fontSize: '1rem' }}>
              write me a letter
            </a>
          </motion.div>
        </motion.div>

        {/* taped polaroid */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="mt-16 relative inline-block md:ml-auto md:mr-8"
          style={{ transform: 'rotate(2.2deg)' }}>
          <Tape className="-top-3 left-8" angle={-5} />
          <Tape className="-top-2 right-6" angle={6} width={64} />
          <div className="p-3 pb-10 bg-[#fffaf0]" style={{ boxShadow: '0 8px 22px rgba(74,59,40,0.22)' }}>
            {p.avatar ? (
              <img src={p.avatar} alt={p.name || 'Portrait'} className="w-56 h-64 object-cover"
                style={{ filter: 'sepia(0.22) contrast(0.98)' }} />
            ) : (
              <div className="w-56 h-64 flex items-center justify-center" style={{ background: DEEP }}>
                <Monogram name={p.name} size={130} />
              </div>
            )}
            <p className="absolute bottom-2.5 left-0 right-0 text-center text-sm" style={{ fontFamily: HAND, color: MUTED }}>
              {p.name || 'me, probably'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'years of practice', value: stats.yearsExperience },
    { label: 'pages finished', value: stats.projectsCompleted },
    { label: 'pen pals', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" style={{ background: DEEP, ...PAPER_TEX }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead label="About" title="The story so far" note="(told on paper, like it should be)" />
          <motion.div variants={fadeUp} className="relative p-7 md:p-9 bg-[#fffaf0]"
            style={{ ...WOBBLE, boxShadow: '0 8px 22px rgba(74,59,40,0.14)' }}>
            <Tape className="-top-3 left-10" angle={-3} />
            <p className="text-base md:text-lg leading-loose" style={{ fontFamily: SERIF, color: INK }}>
              {p.bio || 'The margins are still wide and the best pages have not been written yet. Stay tuned.'}
            </p>
          </motion.div>
          {statItems.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              {statItems.map((s, i) => (
                <div key={i} className="px-5 py-3 text-center"
                  style={{ ...WOBBLE, border: `1.5px solid ${MUTED}`, background: 'rgba(255,251,238,0.55)', transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
                  <div className="text-2xl font-bold" style={{ fontFamily: SERIF, color: PENCIL }}>{s.value}</div>
                  <div className="text-[11px] mt-1" style={{ fontFamily: HAND, color: MUTED }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* Skills — notebook checklist with pencil-drawn levels */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Practice'))];
  return (
    <section id="skills" className="relative overflow-hidden" style={PAPER_TEX}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Skills" title="Tools I keep sharp" note="check, check, check…" />
          <div className="grid md:grid-cols-2 gap-x-12">
            {categories.map((cat, ci) => (
              <motion.div key={ci} variants={fadeUp} className="mb-8 break-inside-avoid">
                <h3 className="text-lg font-bold mb-4 inline-flex items-center gap-2" style={{ fontFamily: HAND, color: PENCIL }}>
                  <Pencil size={15} strokeWidth={1.8} /> {cat.toLowerCase()}
                </h3>
                <div className="space-y-5">
                  {skills.filter(s => (s.category || 'Practice') === cat).map((skill, i) => {
                    const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                    return (
                      <div key={i}>
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className="text-[13px]" style={{ fontFamily: HAND, color: PENCIL }}>✓</span>
                          <span className="text-[15px] font-semibold" style={{ fontFamily: SERIF, color: INK }}>{skill.name}</span>
                        </div>
                        <svg viewBox="0 0 100 8" className="w-full h-2" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M1,5 C18,3 34,7 50,5 C66,3 82,7 99,5" stroke="rgba(74,59,40,0.18)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                          <motion.path
                            d="M1,5 C18,3 34,7 50,5 C66,3 82,7 99,5"
                            stroke={PENCIL} strokeWidth="2.6" fill="none" strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: level / 100 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, delay: i * 0.08, ease: 'easeOut' }}
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Projects — field-note pages */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" style={{ background: DEEP, ...PAPER_TEX }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionHead label="Selected work" title="Field notes & exhibits" note="each page taped in by hand" />
          <div className="grid md:grid-cols-2 gap-9">
            {projects.map((project, i) => {
              const tech = project.techStack || [];
              return (
                <motion.article key={i} variants={fadeUp} className="relative p-6 bg-[#fffaf0]"
                  style={{
                    ...WOBBLE,
                    boxShadow: '0 8px 22px rgba(74,59,40,0.15)',
                    transform: `rotate(${i % 2 === 0 ? -0.7 : 0.8}deg)`,
                  }}>
                  <Tape className="-top-3 left-1/2" angle={i % 2 === 0 ? -4 : 3} />
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-36 object-cover mb-4"
                      style={{ filter: 'sepia(0.18)', borderRadius: '8px 3px 10px 3px' }} />
                  ) : null}
                  <p className="text-[11px] mb-1.5" style={{ fontFamily: HAND, color: PENCIL }}>
                    exhibit no. {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: SERIF, color: INK }}>{project.title}</h3>
                  {project.description ? (
                    <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: SERIF, color: 'rgba(74,59,40,0.85)' }}>
                      {project.description}
                    </p>
                  ) : null}
                  {tech.length > 0 && (
                    <p className="text-xs italic mb-4" style={{ fontFamily: HAND, color: MUTED }}>
                      made with: {tech.join(', ')}
                    </p>
                  )}
                  <div className="flex gap-5">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="text-sm font-semibold border-b-2 transition-opacity hover:opacity-70"
                        style={{ fontFamily: HAND, color: INK, borderColor: INK }}>
                        open it up →
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="text-sm font-semibold border-b-2 transition-opacity hover:opacity-70"
                        style={{ fontFamily: HAND, color: PENCIL, borderColor: PENCIL }}>
                        the messy draft
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — a journal timeline with date stamps */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="relative overflow-hidden" style={PAPER_TEX}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Experience" title="Journal entries" note="dated, signed, filed away" />
          <div className="relative pl-10 md:pl-14">
            <div className="absolute left-[9px] top-2 bottom-2 w-px" style={{ background: `repeating-linear-gradient(180deg, ${MUTED} 0 6px, transparent 6px 12px)` }} />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pb-12 last:pb-0">
                <span className="absolute -left-10 md:-left-[52px] top-1 px-2 py-1 text-[10px] font-bold uppercase"
                  style={{
                    letterSpacing: '0.12em',
                    color: PENCIL,
                    border: `2px solid ${PENCIL}`,
                    borderRadius: '8px 3px 9px 3px',
                    transform: `rotate(${i % 2 === 0 ? -4 : 3}deg)`,
                    background: 'rgba(255,251,238,0.6)',
                  }}>
                  {exp.period}
                </span>
                <h3 className="text-xl font-bold" style={{ fontFamily: SERIF, color: INK }}>{exp.role}</h3>
                <p className="text-sm italic mb-2" style={{ fontFamily: SERIF, color: PENCIL }}>{exp.company}</p>
                {exp.description ? (
                  <p className="text-sm leading-relaxed" style={{ fontFamily: SERIF, color: MUTED }}>
                    {exp.description}
                  </p>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — sticky notes on the wall */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  const noteColors = ['#fdf3c0', '#e9f0d8', '#fbe4d0', '#e4edf7'];
  return (
    <section id="testimonials" style={{ background: DEEP, ...PAPER_TEX }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead label="Kind words" title="Notes pinned to the wall" note="from people I've worked with" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => {
              const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.figure key={i} variants={fadeUp} className="relative p-5 pt-8"
                  style={{
                    background: noteColors[i % noteColors.length],
                    boxShadow: '0 6px 16px rgba(74,59,40,0.18)',
                    transform: `rotate(${i % 2 === 0 ? -1.6 : 1.4}deg)`,
                  }}>
                  <Tape className="-top-2.5 left-1/2 -translate-x-1/2" angle={i % 2 === 0 ? -6 : 5} width={60} />
                  <blockquote className="text-sm leading-relaxed mb-4" style={{ fontFamily: HAND, color: INK }}>
                    {t.text}
                  </blockquote>
                  <figcaption className="flex items-center gap-2.5">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover"
                        style={{ filter: 'sepia(0.2)', border: '2px solid rgba(255,255,255,0.8)' }} />
                    ) : (
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: 'rgba(255,255,255,0.75)', color: INK, fontFamily: SERIF }}>
                        {initials}
                      </span>
                    )}
                    <span>
                      <span className="block text-xs font-bold" style={{ fontFamily: SERIF, color: INK }}>{t.name}</span>
                      <span className="block text-[10px]" style={{ fontFamily: HAND, color: MUTED }}>{t.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
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
    <section id="contact" className="relative overflow-hidden" style={PAPER_TEX}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead label="Contact" title="Send a postcard" note="I answer every single one" />
          <motion.div variants={fadeUp} className="relative p-7 bg-[#fffaf0]"
            style={{ ...WOBBLE, boxShadow: '0 10px 26px rgba(74,59,40,0.16)' }}>
            <Tape className="-top-3 right-8" angle={5} />
            {/* stamp box */}
            <span className="absolute top-5 right-6 w-14 h-16 flex items-center justify-center text-2xl"
              style={{ border: `2px dashed ${MUTED}`, borderRadius: 4, transform: 'rotate(3deg)', background: DEEP }}>
              ✉
            </span>
            <p className="text-base leading-loose mb-6 max-w-[70%]" style={{ fontFamily: HAND, color: INK }}>
              dear visitor — my inbox is always open for ideas, questions, and good puns.
            </p>
            <div className="flex flex-wrap gap-5">
              {email ? (
                <a href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ ...WOBBLE, border: `2px solid ${PENCIL}`, background: PENCIL, color: '#fffaf0' }}>
                  <Mail size={15} strokeWidth={1.8} /> {email}
                </a>
              ) : null}
              {socialLinks.map(l => (
                <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm border-b-2 pb-0.5 transition-opacity hover:opacity-70"
                  style={{ fontFamily: HAND, color: INK, borderColor: INK }}>
                  <l.Icon size={14} strokeWidth={1.8} /> {l.label}
                </a>
              ))}
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-12 text-center text-xs" style={{ fontFamily: HAND, color: MUTED }}>
            © {new Date().getFullYear()} {p.name || ''} — written by hand, scanned with love.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function PaperTexture() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Work', href: '#projects' },
    { label: 'Journal', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: '#efe3c7', color: INK, fontFamily: SERIF }}>
      {/* paper tab nav */}
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(245,237,218,0.92)', borderBottom: '2px solid rgba(74,59,40,0.25)' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-10 h-12 flex items-center justify-between">
          <a href="#hero" className="text-lg font-bold" style={{ fontFamily: HAND, color: PENCIL }}>
            {p.name || 'my journal'}
          </a>
          <div className="hidden sm:flex items-center gap-5">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-xs uppercase transition-colors hover:text-[#9c4a2f]"
                style={{ letterSpacing: '0.18em', color: MUTED }}>
                {item.label}
              </a>
            ))}
          </div>
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
