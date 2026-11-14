import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, Asterisk } from 'lucide-react';

/**
 * Kinetic Type Portfolio Template
 * Category: Animated / Motion
 * Description: Typography-driven portfolio where text is the star. Words animate, scale, rotate, and transform. Minimal imagery, let animated typography tell the story.
 */

/* ------------------------------------------------------------------ */
/* Palette — paper white, hard black, one loud red-orange              */
/* ------------------------------------------------------------------ */
const PAPER = '#fafafa';
const BLACK = '#0e0e0e';
const LOUD = '#ff3600';
const MUTED = 'rgba(14,14,14,0.55)';
const HAIRLINE = 'rgba(14,14,14,0.16)';

const DISPLAY = { fontFamily: "'Helvetica Neue', 'Arial Black', Arial, sans-serif" };
const outline = { WebkitTextStroke: `1.5px ${BLACK}`, color: 'transparent' };
const outlineLoud = { WebkitTextStroke: `1.5px ${LOUD}`, color: 'transparent' };

/* ------------------------------------------------------------------ */
/* Motion primitives                                                   */
/* ------------------------------------------------------------------ */
const wordVariants = {
  hidden: { opacity: 0, y: 60, rotate: 8, scale: 0.85 },
  visible: (i) => ({
    opacity: 1, y: 0, rotate: 0, scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 18, delay: i * 0.06 },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* Splits a string into kinetic spring-loaded words */
const KineticWords = ({ text, className = '', style = {}, baseDelay = 0 }) => {
  const words = String(text || '').split(' ').filter(Boolean);
  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: baseDelay } } }}
    >
      {words.map((w, i) => (
        <motion.span key={i} custom={i} variants={wordVariants} className="inline-block will-change-transform">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
};

/* Giant scrolling marquee band — the signature move of this template */
const Marquee = ({ items, reverse = false, duration = 22, loud = false }) => {
  const content = items.filter(Boolean);
  if (!content.length) return null;
  const Row = () => (
    <span className="inline-flex items-center shrink-0">
      {content.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="mx-6 uppercase font-black whitespace-nowrap"
            style={{ color: i % 2 === 0 ? BLACK : 'transparent', WebkitTextStroke: i % 2 === 0 ? 'none' : `1px ${BLACK}` }}>
            {item}
          </span>
          <Asterisk size={26} strokeWidth={2.5} style={{ color: loud ? PAPER : LOUD }} />
        </span>
      ))}
    </span>
  );
  return (
    <div className="overflow-hidden py-5 select-none" aria-hidden="true"
      style={{ background: loud ? LOUD : 'transparent', borderTop: loud ? 'none' : `1px solid ${HAIRLINE}`, borderBottom: loud ? 'none' : `1px solid ${HAIRLINE}` }}>
      <motion.div
        className="flex w-max text-4xl md:text-6xl leading-none tracking-tight"
        style={{ transform: reverse ? 'translateX(-50%)' : 'none' }}
        animate={{ x: reverse ? ['0%', '50%'] : ['-50%', '0%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration }}
      >
        <Row /><Row />
      </motion.div>
    </div>
  );
};

/* Numbered section header — huge outlined index + kinetic title */
const SectionHead = ({ index, title }) => (
  <motion.div variants={fadeUp} className="mb-14">
    <div className="flex items-end gap-5 flex-wrap">
      <span className="text-6xl md:text-8xl font-black leading-none select-none" style={outline} aria-hidden="true">
        {index}
      </span>
      <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase">
        <KineticWords text={title} style={{ color: BLACK }} />
      </h2>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  const words = String(p.name || 'Your Name').split(' ');
  return (
    <section id="hero" className="relative overflow-hidden flex flex-col justify-center"
      style={{ background: PAPER, minHeight: '92vh' }}>
      <div className="max-w-6xl mx-auto w-full px-6 md:px-10 pt-32 pb-16">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xs font-bold uppercase mb-8 flex items-center gap-3"
          style={{ letterSpacing: '0.4em', color: LOUD }}>
          <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: LOUD }} />
          Open for work — {new Date().getFullYear()}
        </motion.p>

        {/* Name: each word slams in with rotation + scale keyframes */}
        <h1 className="font-black uppercase leading-[0.92] tracking-tighter text-[17vw] md:text-[9.5rem]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.18em]"
              initial={{ opacity: 0, y: 120, rotate: i % 2 === 0 ? -8 : 8, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.15 + i * 0.14 }}
              style={{ color: i % 2 === 1 ? LOUD : BLACK }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        {/* Title as an oscillating outlined strip */}
        {p.title ? (
          <motion.p
            className="mt-6 text-2xl md:text-4xl font-black uppercase tracking-tight"
            style={outline}
            animate={{ x: [0, 14, 0], skewX: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          >
            {p.title}
          </motion.p>
        ) : null}

        {p.tagline ? (
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.9 }}
            className="mt-8 max-w-xl text-lg font-medium" style={{ color: MUTED }}>
            {p.tagline}
          </motion.p>
        ) : null}

        {p.location ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
            className="mt-3 text-sm font-bold uppercase" style={{ letterSpacing: '0.3em', color: BLACK }}>
            {p.location}
          </motion.p>
        ) : null}

        <motion.div initial="hidden" animate="visible" variants={stagger}
          className="mt-12 flex flex-wrap gap-5">
          <motion.a variants={fadeUp} href="#projects"
            className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase text-lg tracking-tight transition-transform hover:-translate-y-1"
            style={{ background: BLACK, color: PAPER }}>
            See the work <ArrowUpRight size={20} style={{ color: LOUD }} />
          </motion.a>
          <motion.a variants={fadeUp} href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase text-lg tracking-tight border-2 transition-colors hover:text-white"
            style={{ borderColor: BLACK, color: BLACK }}
            whileHover={{ backgroundColor: LOUD, borderColor: LOUD }}>
            Say hi
          </motion.a>
        </motion.div>
      </div>

      {/* oversized ghost numeral, half off-canvas */}
      <span aria-hidden="true"
        className="absolute -right-8 bottom-0 text-[22rem] leading-none font-black select-none pointer-events-none hidden md:block"
        style={outline}>
        ★
      </span>
    </section>
  );
};

/* Skills — each skill is a giant word; hover makes it move */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead index="01" title="What I do" />
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp} className="mb-14 last:mb-0">
              <p className="text-xs font-black uppercase mb-6" style={{ letterSpacing: '0.4em', color: LOUD }}>
                {cat}
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                  <motion.span
                    key={i}
                    className="inline-block font-black uppercase leading-none tracking-tighter text-3xl md:text-5xl cursor-default"
                    style={{ color: BLACK }}
                    whileHover={{ x: 12, skewX: -8, color: LOUD }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {skill.name}
                    <sup className="text-xs font-bold ml-1 align-super" style={{ color: MUTED }}>
                      {Math.max(0, Math.min(99, Number(skill.level) || 85))}
                    </sup>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* Projects — a typographic index; hover kicks each row into motion */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" style={{ background: BLACK }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <div className="mb-14">
            <span className="text-6xl md:text-8xl font-black leading-none select-none block" style={outlineLoud} aria-hidden="true">
              02
            </span>
            <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase mt-3" style={{ color: PAPER }}>
              <KineticWords text="Selected work" style={{ color: PAPER }} />
            </h2>
          </div>

          <div>
            {projects.map((project, i) => (
              <motion.a
                key={i}
                href={project.liveUrl || project.githubUrl || '#'}
                target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
                rel="noreferrer"
                variants={fadeUp}
                className="group block border-t py-8 last:border-b"
                style={{ borderColor: 'rgba(250,250,250,0.18)' }}
              >
                <motion.div
                  className="flex items-baseline gap-4 md:gap-8 flex-wrap"
                  whileHover={{ x: 18 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <span className="font-black text-lg" style={{ color: LOUD }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-black uppercase tracking-tighter leading-none text-3xl md:text-5xl transition-colors group-hover:text-[#ff3600]"
                    style={{ color: PAPER }}>
                    {project.title}
                  </h3>
                  <ArrowUpRight size={26} className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: LOUD }} />
                </motion.div>
                <div className="mt-4 md:ml-12 max-w-2xl">
                  {project.description ? (
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(250,250,250,0.6)' }}>
                      {project.description}
                    </p>
                  ) : null}
                  {(project.techStack || []).length > 0 && (
                    <p className="mt-3 text-[11px] font-black uppercase" style={{ letterSpacing: '0.3em', color: LOUD }}>
                      {(project.techStack || []).join(' · ')}
                    </p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — giant outlined year ranges + role typography */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead index="03" title="The résumé" />
          <div>
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group border-t py-10 last:border-b grid md:grid-cols-5 gap-4 md:gap-8 items-baseline"
                style={{ borderColor: HAIRLINE }}>
                <motion.span
                  className="font-black leading-none tracking-tight text-4xl md:text-6xl md:col-span-2"
                  style={outline}
                  whileInView={{ rotate: [3, -1.5, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  {exp.period}
                </motion.span>
                <div className="md:col-span-3">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:italic" style={{ color: BLACK }}>
                    {exp.role} <span style={{ color: LOUD }}>@ {exp.company}</span>
                  </h3>
                  {exp.description ? (
                    <p className="mt-3 text-sm md:text-base leading-relaxed max-w-xl" style={{ color: MUTED }}>
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — oversized quotation marks as the only decoration */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead index="04" title="Word of mouth" />
          <div className="grid md:grid-cols-2 gap-10">
            {testimonials.map((t, i) => (
              <motion.blockquote key={i} variants={fadeUp}
                className="border-t-4 pt-6"
                style={{ borderColor: i % 2 === 0 ? BLACK : LOUD }}>
                <span className="block text-6xl leading-[0.5] font-black mb-6" style={{ color: LOUD }}>&ldquo;</span>
                <p className="text-xl md:text-2xl font-bold leading-snug tracking-tight" style={{ color: BLACK }}>
                  {t.text}
                </p>
                <footer className="mt-6 text-xs font-black uppercase" style={{ letterSpacing: '0.25em', color: MUTED }}>
                  {t.name} {t.role ? `— ${t.role}` : ''}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Contact — one enormous, kinetic call to action */
const Contact = ({ data }) => {
  const socials = data.socials || {};
  const p = data.personal || {};
  const socialLinks = [
    { key: 'github', label: 'GitHub', href: socials.github, Icon: Github },
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: Linkedin },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: Twitter },
  ].filter(l => l.href);
  const email = socials.email || p.email;

  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: LOUD }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-xs font-black uppercase mb-8" style={{ letterSpacing: '0.4em', color: PAPER }}>
            05 — Contact
          </motion.p>
          <motion.a
            variants={fadeUp}
            href={email ? `mailto:${email}` : '#contact'}
            className="block font-black uppercase tracking-tighter leading-[0.9] text-[16vw] md:text-[8.5rem] break-words"
            style={{ color: PAPER }}
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            Let&rsquo;s<br />talk <span className="inline-block" style={{ color: BLACK }}>↗</span>
          </motion.a>
          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap gap-4">
            {email ? (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-7 py-4 font-black uppercase border-2 transition-colors hover:bg-black hover:text-white"
                style={{ borderColor: PAPER, color: PAPER }}>
                <Mail size={18} /> Email me
              </a>
            ) : null}
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 font-black uppercase border-2 transition-colors hover:bg-black hover:text-white"
                style={{ borderColor: PAPER, color: PAPER }}>
                <l.Icon size={18} /> {l.label}
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="mt-16 text-xs font-black uppercase" style={{ letterSpacing: '0.3em', color: PAPER }}>
            &copy; {new Date().getFullYear()} {p.name || ''} — set in motion.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function KineticType() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};
  const stats = data.stats || {};

  const marqueeItems = [
    String(p.name || '').toUpperCase(),
    String(p.title || '').toUpperCase(),
    'PORTFOLIO',
    'TYPOGRAPHY IN MOTION',
  ];

  const navItems = [
    { label: 'Work', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Résumé', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: PAPER, color: BLACK, fontFamily: DISPLAY.fontFamily }}>
      {/* blend-mode nav: stays readable over both paper and black sections */}
      <nav className="fixed top-0 inset-x-0 z-40 mix-blend-difference">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <a href="#hero" className="font-black uppercase tracking-tighter text-lg text-white">
            {String(p.name || 'PORTFOLIO').split(' ')[0]}<span style={{ color: LOUD }}>*</span>
          </a>
          <div className="hidden md:flex gap-8">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-xs font-black uppercase text-white transition-opacity hover:opacity-60"
                style={{ letterSpacing: '0.3em' }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero data={data} />
      <Marquee items={marqueeItems} duration={24} />

      {data.skills?.length > 0 ? <Skills data={data} /> : null}

      {stats.projectsCompleted || stats.yearsExperience ? (
        <Marquee
          items={[
            stats.projectsCompleted ? `${stats.projectsCompleted} PROJECTS SHIPPED` : '',
            stats.yearsExperience ? `${stats.yearsExperience} YEARS DEEP` : '',
            'NO FINGER PRINTS LEFT BEHIND',
            'ALWAYS SHIPPING',
          ].filter(Boolean)}
          reverse
          loud
          duration={18}
        />
      ) : null}

      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
