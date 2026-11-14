import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Asterisk, Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

/**
 * Whitespace Luxury Portfolio Template
 * Category: Minimal / Clean
 * Description: Ultra-premium whitespace-heavy layout with elegant serif fonts, thin hairline borders, and luxurious editorial spacing. Fashion/luxury brand aesthetic.
 */

/* ------------------------------------------------------------------ */
/* Palette — black / ivory with champagne-gold hairlines               */
/* ------------------------------------------------------------------ */
const IVORY = '#f8f5ef';
const IVORY_DEEP = '#f1ede4';
const INK = '#161410';
const SOFT_INK = 'rgba(22,20,16,0.66)';
const FAINT_INK = 'rgba(22,20,16,0.42)';
const GOLD = '#a6894f';
const GOLD_HAIR = 'rgba(166,137,79,0.55)';
const HAIR = 'rgba(22,20,16,0.13)';

const SERIF = `'Didot', 'Bodoni MT', 'Playfair Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif`;
const SANS = `'Futura', 'Century Gothic', 'Avenir Next', 'Helvetica Neue', Arial, sans-serif`;

const STYLE_CSS = `
.wl-link { position: relative; display: inline-flex; align-items: center; }
.wl-link::after { content: ''; position: absolute; left: 0; bottom: -4px; height: 1px; width: 0;
  background: ${GOLD}; transition: width .45s cubic-bezier(.22,1,.36,1); }
.wl-link:hover::after { width: 100%; }
.wl-img { transition: transform 1.1s cubic-bezier(.22,1,.36,1), opacity .8s ease; }
.wl-frame:hover .wl-img { transform: scale(1.035); }
.wl-nav a { transition: color .35s ease; }
.wl-nav a:hover { color: ${GOLD}; }
`;

/* ------------------------------------------------------------------ */
/* Motion — slow, deliberate, couture-pace reveals                     */
/* ------------------------------------------------------------------ */
const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};
const ruleGrow = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.3, ease: 'easeOut' } },
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'M';
};

/* 1px hairline that draws itself in from the left */
const Hairline = ({ color = HAIR, className = '' }) => (
  <motion.div aria-hidden variants={ruleGrow} className={`h-px w-full origin-left ${className}`}
    style={{ background: color }} />
);

/* Numbered editorial section header — watermark numeral + micro-label */
const SectionHeader = ({ numeral, label, title, intro }) => (
  <div className="relative mb-16 md:mb-24">
    <div aria-hidden className="pointer-events-none select-none absolute -top-10 right-0 leading-none font-serif"
      style={{ fontSize: 'clamp(6rem, 14vw, 11rem)', color: 'rgba(22,20,16,0.05)' }}>
      {numeral}
    </div>
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
      <motion.p variants={rise} className="text-[10px] uppercase mb-6 flex items-center gap-3"
        style={{ letterSpacing: '0.45em', color: GOLD, fontFamily: SANS }}>
        <Asterisk size={13} strokeWidth={1.5} />
        {numeral} &mdash; {label}
      </motion.p>
      <motion.h2 variants={rise} className="text-4xl md:text-6xl font-medium mb-6"
        style={{ fontFamily: SERIF, letterSpacing: '-0.01em', color: INK }}>
        {title}
      </motion.h2>
      {intro && (
        <motion.p variants={rise} className="max-w-lg text-base leading-relaxed" style={{ color: SOFT_INK }}>
          {intro}
        </motion.p>
      )}
    </motion.div>
    <Hairline className="mt-10" />
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero — a gallery foyer                                              */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const name = data.personal?.name || 'My Portfolio';
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      {/* faint atelier grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(22,20,16,0.045) 1px, transparent 1px)', backgroundSize: 'min(25vw, 300px) 100%' }} />
      <div className="relative max-w-5xl mx-auto px-6 md:px-10 w-full pt-28 pb-24">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={rise} className="text-[10px] uppercase mb-10 flex items-center gap-3"
            style={{ letterSpacing: '0.5em', color: GOLD, fontFamily: SANS }}>
            <Asterisk size={13} strokeWidth={1.5} /> A quiet study in craft
          </motion.p>
          <motion.h1 variants={rise} className="font-medium leading-[0.98] mb-12"
            style={{ fontFamily: SERIF, fontSize: 'clamp(3.4rem, 10vw, 7.5rem)', letterSpacing: '-0.02em', color: INK }}>
            {name}
          </motion.h1>
          <Hairline />
          <div className="grid md:grid-cols-2 gap-10 pt-10">
            <motion.div variants={rise}>
              {data.personal?.title && (
                <p className="text-2xl md:text-3xl italic mb-5" style={{ fontFamily: SERIF, color: INK }}>
                  {data.personal.title}
                </p>
              )}
              {data.personal?.tagline && (
                <p className="text-sm md:text-base leading-loose max-w-md" style={{ color: SOFT_INK }}>
                  {data.personal.tagline}
                </p>
              )}
              {data.personal?.location && (
                <p className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase"
                  style={{ letterSpacing: '0.3em', color: FAINT_INK, fontFamily: SANS }}>
                  <MapPin size={12} style={{ color: GOLD }} /> {data.personal.location}
                </p>
              )}
            </motion.div>
            <motion.div variants={rise} className="flex flex-col items-start md:items-end justify-center gap-6">
              {[
                { href: '#about', label: 'The House' },
                { href: '#projects', label: 'The Collections' },
                { href: '#contact', label: 'Correspondence' },
              ].map(item => (
                <a key={item.href} href={item.href}
                  className="wl-link text-xs uppercase group"
                  style={{ letterSpacing: '0.32em', color: INK, fontFamily: SANS }}>
                  {item.label}
                  <ArrowUpRight size={14} className="ml-2 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: GOLD }} />
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.p aria-hidden animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] uppercase"
        style={{ letterSpacing: '0.5em', color: FAINT_INK, fontFamily: SANS }}>
        Scroll
      </motion.p>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* About — the house                                                   */
/* ------------------------------------------------------------------ */
const About = ({ data }) => {
  const name = data.personal?.name || 'The Maison';
  return (
    <section id="about" className="relative overflow-hidden py-28 md:py-40" style={{ background: IVORY }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <SectionHeader numeral="01" label="La Maison" title="The House"
          intro="Every atelier begins with a story. This one is told in measured lines and generous silence." />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}
          className="grid md:grid-cols-[auto_1fr] gap-14 md:gap-20 items-center">
          {/* matted portrait, gallery-frame style */}
          <motion.div variants={rise} className="wl-frame mx-auto md:mx-0" style={{ transform: 'rotate(-0.4deg)' }}>
            <div className="p-4 border" style={{ borderColor: GOLD_HAIR, background: '#fffdf9' }}>
              <div className="p-3 border" style={{ borderColor: HAIR }}>
                {data.personal?.avatar ? (
                  <img src={data.personal.avatar} alt={name} className="wl-img w-56 h-72 md:w-64 md:h-80 object-cover"
                    style={{ filter: 'saturate(0.82) contrast(1.02)' }} />
                ) : (
                  <div className="w-56 h-72 md:w-64 md:h-80 flex flex-col items-center justify-center"
                    style={{ background: IVORY_DEEP }}>
                    <span className="text-7xl font-medium" style={{ fontFamily: SERIF, color: INK }}>
                      {initialsOf(name)}
                    </span>
                    <span className="mt-6 text-[9px] uppercase" style={{ letterSpacing: '0.45em', color: GOLD, fontFamily: SANS }}>
                      Monogram
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          <motion.div variants={rise}>
            <p className="text-lg md:text-xl leading-loose mb-8" style={{ fontFamily: SERIF, color: INK }}>
              {data.personal?.bio || `${name} has reserved this page for a biography — a portrait still being composed, line by line.`}
            </p>
            {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
              <div className="grid grid-cols-3 mt-4">
                {[
                  { label: 'Years of practice', value: data.stats.yearsExperience },
                  { label: 'Works delivered', value: data.stats.projectsCompleted },
                  { label: 'Trusted clients', value: data.stats.happyClients },
                ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                  <div key={i} className="text-center py-6 border-l first:border-l-0" style={{ borderColor: HAIR }}>
                    <div className="text-3xl md:text-4xl font-medium" style={{ fontFamily: SERIF, color: INK }}>{s.value}</div>
                    <div className="mt-2 text-[9px] uppercase" style={{ letterSpacing: '0.28em', color: FAINT_INK, fontFamily: SANS }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Skills — the savoir-faire                                           */
/* ------------------------------------------------------------------ */
const Skills = ({ data }) => (
  <section id="skills" className="relative overflow-hidden py-28 md:py-40" style={{ background: IVORY_DEEP }}>
    <div className="max-w-4xl mx-auto px-6 md:px-10">
      <SectionHeader numeral="02" label="Le Savoir-Faire" title="The Craft"
        intro="A repertoire refined over time — each discipline measured not in percentages, but in precision." />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        {data.skills.map((skill, i) => (
          <motion.div key={i} variants={rise} className="py-7" style={{ borderBottom: i < data.skills.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-xl md:text-2xl font-medium" style={{ fontFamily: SERIF, color: INK }}>{skill.name}</span>
              <span className="text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: GOLD, fontFamily: SANS }}>
                {skill.level || 85}
              </span>
            </div>
            <div className="h-px w-full" style={{ background: 'rgba(22,20,16,0.1)' }}>
              <motion.div className="h-px origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: (skill.level || 85) / 100 }}
                transition={{ duration: 1.4, delay: (i % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}
                style={{ background: GOLD }} />
            </div>
            {skill.category && (
              <span className="mt-3 inline-block text-[9px] uppercase" style={{ letterSpacing: '0.35em', color: FAINT_INK, fontFamily: SANS }}>
                {skill.category}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Projects — the collections                                          */
/* ------------------------------------------------------------------ */
const Projects = ({ data }) => (
  <section id="projects" className="relative overflow-hidden py-28 md:py-40" style={{ background: IVORY }}>
    <div className="max-w-5xl mx-auto px-6 md:px-10">
      <SectionHeader numeral="03" label="Les Collections" title="Selected Works"
        intro="Each piece is composed with intent — presented here as a curated exhibition of recent work." />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        {data.projects.map((project, i) => {
          const flip = i % 2 === 1;
          return (
            <motion.article key={i} variants={rise}
              className="grid md:grid-cols-2 gap-10 md:gap-16 items-center py-14 md:py-20"
              style={{ borderTop: `1px solid ${HAIR}`, borderBottom: i === data.projects.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
              <div className={flip ? 'md:order-2' : ''}>
                <p className="text-[9px] uppercase mb-5" style={{ letterSpacing: '0.4em', color: GOLD, fontFamily: SANS }}>
                  Piece No. {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-3xl md:text-4xl font-medium mb-5" style={{ fontFamily: SERIF, color: INK }}>
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm md:text-base leading-loose mb-6" style={{ color: SOFT_INK }}>
                    {project.description}
                  </p>
                )}
                {project.techStack?.length > 0 && (
                  <p className="text-[10px] uppercase mb-7 leading-relaxed" style={{ letterSpacing: '0.22em', color: FAINT_INK, fontFamily: SANS }}>
                    {project.techStack.join('  ·  ')}
                  </p>
                )}
                <div className="flex gap-8">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="wl-link text-xs uppercase" style={{ letterSpacing: '0.28em', color: INK, fontFamily: SANS }}>
                      View piece <ArrowUpRight size={13} className="ml-1.5" style={{ color: GOLD }} />
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="wl-link text-xs uppercase" style={{ letterSpacing: '0.28em', color: SOFT_INK, fontFamily: SANS }}>
                      Atelier notes
                    </a>
                  )}
                </div>
              </div>
              <motion.div className={`wl-frame border p-3 ${flip ? 'md:order-1' : ''}`}
                style={{ borderColor: GOLD_HAIR, background: '#fffdf9' }}
                whileHover={{ rotate: flip ? 0.5 : -0.5 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="wl-img w-full h-64 md:h-80 object-cover"
                    style={{ filter: 'saturate(0.85)' }} />
                ) : (
                  <div className="w-full h-64 md:h-80 flex items-center justify-center" style={{ background: IVORY_DEEP }}>
                    <span className="text-6xl font-medium" style={{ fontFamily: SERIF, color: 'rgba(22,20,16,0.14)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Experience — the career                                             */
/* ------------------------------------------------------------------ */
const Experience = ({ data }) => (
  <section id="experience" className="relative overflow-hidden py-28 md:py-40" style={{ background: IVORY_DEEP }}>
    <div className="max-w-4xl mx-auto px-6 md:px-10">
      <SectionHeader numeral="04" label="Le Parcours" title="The Career"
        intro="Positions held with the same care a tailor takes with a seam — precisely, and without hurry." />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        {data.experience.map((exp, i) => (
          <motion.div key={i} variants={rise} className="grid md:grid-cols-[170px_1fr] gap-4 md:gap-12 py-10"
            style={{ borderTop: `1px solid ${HAIR}`, borderBottom: i === data.experience.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
            <div>
              {exp.period && (
                <p className="text-[10px] uppercase leading-relaxed" style={{ letterSpacing: '0.28em', color: GOLD, fontFamily: SANS }}>
                  {exp.period}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-medium mb-1.5" style={{ fontFamily: SERIF, color: INK }}>{exp.role}</h3>
              {exp.company && (
                <p className="text-sm italic mb-4" style={{ fontFamily: SERIF, color: GOLD }}>{exp.company}</p>
              )}
              {exp.description && (
                <p className="text-sm md:text-base leading-loose" style={{ color: SOFT_INK }}>{exp.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Testimonials — the press                                            */
/* ------------------------------------------------------------------ */
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative overflow-hidden py-28 md:py-40" style={{ background: IVORY }}>
    <div className="max-w-3xl mx-auto px-6 md:px-10">
      <SectionHeader numeral="05" label="Les Témoignages" title="In Others' Words"
        intro="Kind observations from those who have seen the work up close." />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="space-y-16">
        {data.testimonials.map((t, i) => (
          <motion.figure key={i} variants={rise} className="text-center px-2 md:px-10">
            <div aria-hidden className="text-6xl leading-none mb-4 select-none" style={{ fontFamily: SERIF, color: GOLD }}>&ldquo;</div>
            <blockquote className="text-xl md:text-2xl italic leading-relaxed mb-8" style={{ fontFamily: SERIF, color: INK }}>
              {t.text}
            </blockquote>
            <figcaption className="flex items-center justify-center gap-4">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border" style={{ borderColor: GOLD_HAIR }} />
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium border"
                  style={{ fontFamily: SERIF, color: INK, borderColor: GOLD_HAIR, background: IVORY_DEEP }}>
                  {initialsOf(t.name)}
                </div>
              )}
              <span className="h-px w-8" style={{ background: GOLD_HAIR }} />
              <span className="text-left">
                <span className="block text-xs uppercase" style={{ letterSpacing: '0.24em', color: INK, fontFamily: SANS }}>{t.name}</span>
                {t.role && (
                  <span className="block text-[10px] uppercase mt-1" style={{ letterSpacing: '0.22em', color: FAINT_INK, fontFamily: SANS }}>
                    {t.role}
                  </span>
                )}
              </span>
            </figcaption>
            {i < data.testimonials.length - 1 && <Hairline className="mt-16 max-w-[120px] mx-auto" color={GOLD_HAIR} />}
          </motion.figure>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Contact — the correspondence                                        */
/* ------------------------------------------------------------------ */
const Contact = ({ data }) => {
  const email = data.personal?.email || data.socials?.email;
  const socials = [
    { key: 'github', url: data.socials?.github, Icon: Github },
    { key: 'linkedin', url: data.socials?.linkedin, Icon: Linkedin },
    { key: 'twitter', url: data.socials?.twitter, Icon: Twitter },
  ].filter(s => s.url);
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-44" style={{ background: IVORY_DEEP }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.p variants={rise} className="text-[10px] uppercase mb-8" style={{ letterSpacing: '0.5em', color: GOLD, fontFamily: SANS }}>
            06 &mdash; Correspondance
          </motion.p>
          <motion.h2 variants={rise} className="text-4xl md:text-6xl font-medium mb-8" style={{ fontFamily: SERIF, color: INK }}>
            Let us begin the conversation
          </motion.h2>
          <motion.p variants={rise} className="text-base leading-loose max-w-md mx-auto mb-14" style={{ color: SOFT_INK }}>
            Commissions, collaborations, and considered inquiries are welcomed with equal attention.
          </motion.p>
          <motion.div variants={rise} className="flex flex-wrap justify-center gap-6 mb-16">
            {email && (
              <a href={`mailto:${email}`}
                className="px-10 py-4 text-xs uppercase border transition-colors duration-500 hover:bg-white/60"
                style={{ letterSpacing: '0.32em', color: INK, borderColor: INK, fontFamily: SANS }}>
                <span className="wl-link" style={{ color: 'inherit' }}>
                  <Mail size={14} className="mr-3" style={{ color: GOLD }} /> Write a letter
                </span>
              </a>
            )}
            {data.personal?.phone && (
              <a href={`tel:${data.personal.phone.replace(/\s+/g, '')}`}
                className="px-10 py-4 text-xs uppercase border transition-colors duration-500 hover:bg-white/60"
                style={{ letterSpacing: '0.32em', color: INK, borderColor: HAIR, fontFamily: SANS }}>
                Telephone
              </a>
            )}
          </motion.div>
          {socials.length > 0 && (
            <motion.div variants={rise} className="flex justify-center gap-10">
              {socials.map(({ key, url, Icon }) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                  className="wl-link text-[10px] uppercase gap-2" style={{ letterSpacing: '0.3em', color: SOFT_INK, fontFamily: SANS }}>
                  <Icon size={15} style={{ color: GOLD }} /> {key}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
export default function WhitespaceLuxury() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  const navItems = [
    { label: 'House', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Craft', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Collections', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Career', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Press', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Contact', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: IVORY, color: INK }}>
      <style>{STYLE_CSS}</style>

      {/* minimal letterspaced nav */}
      <nav className="wl-nav fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: HAIR, background: 'rgba(248,245,239,0.88)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-6">
          <a href="#hero" className="text-[10px] uppercase font-medium whitespace-nowrap" style={{ letterSpacing: '0.4em', fontFamily: SANS }}>
            {name}
          </a>
          <div className="hidden md:flex gap-8">
            {navItems.map(item => (
              <a key={item.href} href={item.href} className="text-[9px] uppercase whitespace-nowrap"
                style={{ letterSpacing: '0.3em', color: SOFT_INK, fontFamily: SANS }}>
                {item.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="md:hidden text-[9px] uppercase" style={{ letterSpacing: '0.3em', color: SOFT_INK, fontFamily: SANS }}>
            Contact
          </a>
        </div>
      </nav>

      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <About data={data} />}
      {data.skills?.length > 0 && <Skills data={data} />}
      {data.projects?.length > 0 && <Projects data={data} />}
      {data.experience?.length > 0 && <Experience data={data} />}
      {data.testimonials?.length > 0 && <Testimonials data={data} />}
      <Contact data={data} />

      <footer className="border-t py-10" style={{ borderColor: HAIR, background: IVORY }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[9px] uppercase" style={{ letterSpacing: '0.35em', color: FAINT_INK, fontFamily: SANS }}>
            &copy; {new Date().getFullYear()} {name}
          </p>
          <p className="text-[9px] uppercase" style={{ letterSpacing: '0.35em', color: GOLD, fontFamily: SANS }}>
            Whitespace &middot; Luxury
          </p>
        </div>
      </footer>
    </div>
  );
}
