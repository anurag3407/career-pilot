import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, Sparkles, Quote
} from 'lucide-react';

/**
 * Gradient Glass Portfolio Template
 * Category: Glass / Modern UI
 * Description: Gradient colored shapes behind frosted glass cards. Colorful blurred circles/blobs visible through the glass. Premium, modern SaaS aesthetic.
 */

const INK = '#0f172a';
const INK_SOFT = 'rgba(15,23,42,0.62)';
const BG = '#f5f7fc';
const INDIGO = '#6366f1';
const FUCHSIA = '#d946ef';
const CYAN = '#22d3ee';
const AMBER = '#fbbf24';

// frosted glass surface
const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(22px) saturate(170%)',
  WebkitBackdropFilter: 'blur(22px) saturate(170%)',
  border: '1px solid rgba(255,255,255,0.8)',
  boxShadow: '0 8px 32px rgba(31,38,135,0.10), inset 0 1px 0 rgba(255,255,255,0.95)',
  borderRadius: '1.5rem',
};

const glassDark = {
  ...glass,
  background: 'rgba(255,255,255,0.4)',
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((w) => w[0].toUpperCase()).join('')) || 'A';
};

// A big soft gradient blob drifting slowly behind the glass
const Blob = ({ i, size, left, top, colors, duration = 20 }) => (
  <motion.div aria-hidden
    className="absolute rounded-full pointer-events-none"
    animate={{
      x: [0, 46, -34, 0],
      y: [0, -34, 26, 0],
      scale: [1, 1.1, 0.94, 1],
    }}
    transition={{ duration: duration + (i % 3) * 4, repeat: Infinity, ease: 'easeInOut', delay: (i % 4) * 1.2 }}
    style={{
      width: size, height: size, left, top,
      background: `radial-gradient(closest-side, ${colors}, transparent 72%)`,
      filter: 'blur(48px)',
    }} />
);

const SectionHead = ({ kicker, title }) => (
  <motion.div variants={fadeUp} className="mb-12 text-center relative z-10">
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border mb-4"
      style={{ borderColor: 'rgba(255,255,255,0.9)', color: INDIGO, background: 'rgba(255,255,255,0.5)', boxShadow: '0 2px 10px rgba(31,38,135,0.08)' }}>
      <Sparkles size={12} /> {kicker}
    </span>
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: INK }}>{title}</h2>
  </motion.div>
);

export default function GradientGlass() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  const navItems = [
    { label: 'About', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Skills', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Projects', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Experience', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Praise', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Contact', href: '#contact', show: true },
  ].filter((item) => item.show);

  return (
    <div className="antialiased overflow-x-hidden font-sans" style={{ background: BG, color: INK }}>
      {/* NAV — floating glass pill */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex gap-1 px-2 py-2 rounded-2xl border max-w-[94vw] overflow-x-auto"
        style={glass}>
        {navItems.map((item, i) => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors hover:text-white"
            style={{ color: INK_SOFT }}
            onMouseEnter={(e) => { e.currentTarget.style.background = i % 2 ? FUCHSIA : INDIGO; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = INK_SOFT; }}>
            {item.label}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-28">
        <Blob i={0} size={520} left="-8%" top="-6%" colors="rgba(99,102,241,0.34)" />
        <Blob i={1} size={460} left="62%" top="55%" colors="rgba(217,70,239,0.30)" duration={24} />
        <Blob i={2} size={380} left="70%" top="-10%" colors="rgba(34,211,238,0.32)" duration={18} />
        <Blob i={3} size={300} left="4%" top="70%" colors="rgba(251,191,36,0.26)" duration={22} />
        <motion.div initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 w-full max-w-3xl text-center p-10 md:p-14 border"
          style={glass}>
          <motion.span variants={fadeUp}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-7 text-white"
            style={{ background: `linear-gradient(90deg, ${INDIGO}, ${FUCHSIA})`, boxShadow: '0 6px 18px rgba(99,102,241,0.4)' }}>
            <Sparkles size={13} /> Available for work
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 break-words leading-[1.05]">
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(100deg, ${INDIGO} 10%, ${FUCHSIA} 50%, ${CYAN} 90%)` }}>
              {name}
            </span>
          </motion.h1>
          {data.personal?.title && (
            <motion.p variants={fadeUp} className="text-xl md:text-2xl font-bold mb-4" style={{ color: INK }}>
              {data.personal.title}
            </motion.p>
          )}
          {data.personal?.tagline && (
            <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6" style={{ color: INK_SOFT }}>
              {data.personal.tagline}
            </motion.p>
          )}
          {data.personal?.location && (
            <motion.p variants={fadeUp} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-9"
              style={{ color: INK_SOFT }}>
              <MapPin size={13} style={{ color: INDIGO }} /> {data.personal.location}
            </motion.p>
          )}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3.5">
            <a href="#projects"
              className="px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${INDIGO}, ${FUCHSIA})`, boxShadow: '0 10px 26px rgba(99,102,241,0.4)' }}>
              View projects
            </a>
            <a href="#about"
              className="px-7 py-3.5 rounded-2xl text-sm font-bold border transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(255,255,255,0.95)', color: INK, background: 'rgba(255,255,255,0.35)' }}>
              About me
            </a>
            <a href="#contact"
              className="px-7 py-3.5 rounded-2xl text-sm font-bold border transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(255,255,255,0.95)', color: INK_SOFT, background: 'rgba(255,255,255,0.35)' }}>
              Contact
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      {(data.personal?.bio || data.personal?.avatar) && (
        <section id="about" className="relative py-24 px-6 overflow-hidden">
          <Blob i={4} size={420} left="66%" top="10%" colors="rgba(34,211,238,0.28)" duration={21} />
          <Blob i={5} size={360} left="-6%" top="55%" colors="rgba(217,70,239,0.22)" duration={26} />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
              <SectionHead kicker="About" title="Behind the glass" />
              <motion.div variants={fadeUp} className="border p-7 md:p-9" style={glassDark}>
                <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-center">
                  {data.personal?.avatar ? (
                    <div className="mx-auto p-[3px] rounded-3xl"
                      style={{ background: `linear-gradient(135deg, ${INDIGO}, ${FUCHSIA}, ${CYAN})` }}>
                      <img src={data.personal.avatar} alt={name} className="w-44 h-52 object-cover rounded-[calc(1.5rem-3px)]" />
                    </div>
                  ) : (
                    <div className="mx-auto p-[3px] rounded-3xl" style={{ background: `linear-gradient(135deg, ${INDIGO}, ${FUCHSIA}, ${CYAN})` }}>
                      <div className="w-44 h-52 rounded-[calc(1.5rem-3px)] flex flex-col items-center justify-center gap-2.5"
                        style={{ background: 'rgba(255,255,255,0.75)' }}>
                        <span className="text-5xl font-extrabold bg-clip-text text-transparent"
                          style={{ backgroundImage: `linear-gradient(120deg, ${INDIGO}, ${FUCHSIA})` }}>
                          {initialsOf(name)}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: INK_SOFT }}>monogram</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: INK_SOFT }}>
                      {data.personal?.bio || 'This glass panel is waiting to be filled with a story. Check back soon.'}
                    </p>
                    {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                      <div className="grid grid-cols-3 gap-3.5 mt-8">
                        {[
                          { label: 'Years', value: data.stats.yearsExperience },
                          { label: 'Projects', value: data.stats.projectsCompleted },
                          { label: 'Clients', value: data.stats.happyClients },
                        ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                          <div key={i} className="rounded-2xl border p-4 text-center"
                            style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 14px rgba(31,38,135,0.08)' }}>
                            <div className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent"
                              style={{ backgroundImage: `linear-gradient(120deg, ${i % 2 ? FUCHSIA : INDIGO}, ${CYAN})` }}>
                              {s.value}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: INK_SOFT }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {data.skills?.length > 0 && (
        <section id="skills" className="relative py-24 px-6 overflow-hidden">
          <Blob i={6} size={440} left="8%" top="0%" colors="rgba(99,102,241,0.26)" duration={23} />
          <Blob i={7} size={400} left="70%" top="60%" colors="rgba(251,191,36,0.24)" duration={19} />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <SectionHead kicker="Skills" title="Polished to a shine" />
              <div className="grid sm:grid-cols-2 gap-5">
                {data.skills.map((skill, i) => {
                  const level = Number(skill.level) || 85;
                  const c1 = i % 3 === 0 ? INDIGO : i % 3 === 1 ? FUCHSIA : CYAN;
                  const c2 = i % 3 === 0 ? FUCHSIA : i % 3 === 1 ? CYAN : INDIGO;
                  return (
                    <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
                      className="rounded-2xl border p-5"
                      style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 6px 22px rgba(31,38,135,0.09)' }}>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="font-bold" style={{ color: INK }}>{skill.name || 'Skill'}</span>
                        <span className="text-xs font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${c1}, ${c2})` }}>
                          {level}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.08)' }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }} whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }} transition={{ duration: 1, delay: (i % 4) * 0.1 }}
                          style={{ background: `linear-gradient(90deg, ${c1}, ${c2})`, boxShadow: `0 2px 8px ${c1}66` }} />
                      </div>
                      {skill.category && (
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-2.5 inline-block" style={{ color: INK_SOFT }}>
                          {skill.category}
                        </span>
                      )}
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
        <section id="projects" className="relative py-24 px-6 overflow-hidden">
          <Blob i={8} size={480} left="-4%" top="24%" colors="rgba(217,70,239,0.26)" duration={24} />
          <Blob i={9} size={420} left="62%" top="-4%" colors="rgba(34,211,238,0.28)" duration={20} />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
              <SectionHead kicker="Projects" title="Work through frosted glass" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.projects.map((project, i) => (
                  <motion.article key={i} variants={fadeUp} whileHover={{ y: -8 }}
                    className="relative rounded-3xl border overflow-hidden transition-shadow"
                    style={{ ...glass, overflow: 'hidden' }}>
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]"
                      style={{ background: `linear-gradient(90deg, ${INDIGO}, ${FUCHSIA}, ${CYAN})` }} />
                    {project.image && (
                      <div className="p-3 pb-0">
                        <img src={project.image} alt={project.title} className="w-full h-40 object-cover rounded-2xl" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-extrabold mb-2" style={{ color: INK }}>{project.title}</h3>
                      {project.description && (
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: INK_SOFT }}>{project.description}</p>
                      )}
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.techStack.slice(0, 6).map((tech, j) => (
                            <span key={j} className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                              style={{
                                borderColor: 'rgba(255,255,255,0.9)',
                                color: j % 2 ? FUCHSIA : INDIGO,
                                background: j % 2 ? 'rgba(217,70,239,0.08)' : 'rgba(99,102,241,0.08)',
                              }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 text-xs font-bold">
                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                            style={{ color: INDIGO }}>
                            Live demo <ExternalLink size={12} />
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
                            style={{ color: INK_SOFT }}>
                            <Github size={13} /> Source
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
      )}

      {/* EXPERIENCE */}
      {data.experience?.length > 0 && (
        <section id="experience" className="relative py-24 px-6 overflow-hidden">
          <Blob i={10} size={400} left="72%" top="40%" colors="rgba(99,102,241,0.24)" duration={25} />
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <SectionHead kicker="Experience" title="The journey so far" />
              <div className="relative pl-8">
                <div aria-hidden className="absolute left-[11px] top-2 bottom-2 w-[3px] rounded-full"
                  style={{ background: `linear-gradient(180deg, ${INDIGO}, ${FUCHSIA}, ${CYAN})`, boxShadow: '0 0 12px rgba(99,102,241,0.4)' }} />
                <div className="space-y-7">
                  {data.experience.map((exp, i) => (
                    <motion.div key={i} variants={fadeUp} className="relative">
                      <span aria-hidden className="absolute -left-8 top-6 w-[23px] h-[23px] rounded-full border-2"
                        style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderColor: i % 2 ? FUCHSIA : INDIGO,
                          boxShadow: `0 0 14px ${i % 2 ? 'rgba(217,70,239,0.4)' : 'rgba(99,102,241,0.4)'}`,
                        }} />
                      <div className="rounded-3xl border p-6"
                        style={{ background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 6px 22px rgba(31,38,135,0.09)' }}>
                        {exp.period && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border mb-3"
                            style={{ borderColor: 'rgba(255,255,255,0.9)', color: i % 2 ? FUCHSIA : INDIGO, background: 'rgba(255,255,255,0.45)' }}>
                            {exp.period}
                          </span>
                        )}
                        <h3 className="text-lg font-extrabold" style={{ color: INK }}>{exp.role || 'Role'}</h3>
                        {exp.company && <p className="text-sm font-bold mt-0.5 mb-2" style={{ color: i % 2 ? FUCHSIA : INDIGO }}>{exp.company}</p>}
                        {exp.description && <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>{exp.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {data.testimonials?.length > 0 && (
        <section id="testimonials" className="relative py-24 px-6 overflow-hidden">
          <Blob i={11} size={420} left="-4%" top="20%" colors="rgba(251,191,36,0.22)" duration={22} />
          <Blob i={12} size={380} left="64%" top="64%" colors="rgba(251,113,133,0.22)" duration={26} />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <SectionHead kicker="Praise" title="Seen through the glass" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {data.testimonials.map((t, i) => (
                  <motion.figure key={i} variants={fadeUp} whileHover={{ y: -6 }}
                    className="relative rounded-3xl border p-7 transition-transform"
                    style={{ ...glass, transform: `rotate(${(i % 2 ? 0.6 : -0.6)}deg)` }}>
                    <Quote size={20} style={{ color: i % 2 ? FUCHSIA : INDIGO }} className="mb-4" />
                    <blockquote className="text-sm leading-relaxed mb-6" style={{ color: INK_SOFT }}>&ldquo;{t.text}&rdquo;</blockquote>
                    <figcaption className="flex items-center gap-3">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover p-[2px]"
                          style={{ background: `linear-gradient(135deg, ${INDIGO}, ${FUCHSIA}, ${CYAN})` }} />
                      ) : (
                        <span className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                          style={{ background: `linear-gradient(135deg, ${i % 2 ? FUCHSIA : INDIGO}, ${CYAN})` }}>
                          {initialsOf(t.name)}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-bold" style={{ color: INK }}>{t.name || 'Anonymous'}</span>
                        {t.role && <span className="block text-xs" style={{ color: INK_SOFT }}>{t.role}</span>}
                      </span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="relative py-28 px-6 overflow-hidden">
        <Blob i={13} size={520} left="30%" top="30%" colors="rgba(99,102,241,0.3)" duration={21} />
        <Blob i={14} size={420} left="60%" top="8%" colors="rgba(217,70,239,0.26)" duration={19} />
        <Blob i={15} size={360} left="2%" top="60%" colors="rgba(34,211,238,0.28)" duration={24} />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
            className="rounded-[2rem] border p-10 md:p-14 text-center" style={glass}>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(100deg, ${INDIGO}, ${FUCHSIA}, ${CYAN})` }}>
                Let&apos;s build together
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm md:text-base mb-10" style={{ color: INK_SOFT }}>
              Clear glass, clear communication. Send a message and I&apos;ll get back to you quickly.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-4 mb-9">
              {(data.personal?.email || data.socials?.email) && (
                <a href={`mailto:${data.personal?.email || data.socials?.email}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(90deg, ${INDIGO}, ${FUCHSIA})`, boxShadow: '0 10px 26px rgba(99,102,241,0.4)' }}>
                  <Mail size={17} /> Email me
                </a>
              )}
              {['github', 'linkedin', 'twitter'].map((key) => {
                const url = data.socials?.[key];
                if (!url) return null;
                const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border transition-transform hover:-translate-y-1"
                    style={{ borderColor: 'rgba(255,255,255,0.9)', color: INK, background: 'rgba(255,255,255,0.5)' }}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>
            {(data.personal?.phone || data.personal?.location) && (
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-wide" style={{ color: INK_SOFT }}>
                {[data.personal?.phone, data.personal?.location].filter(Boolean).join('  •  ')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center" style={{ color: INK_SOFT }}>
        <p className="text-xs font-semibold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {name} &middot; Gradient Glass
        </p>
      </footer>
    </div>
  );
}
