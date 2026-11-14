import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, Briefcase,
  Phone, User, Star, ArrowRight, MousePointerClick
} from 'lucide-react';

/**
 * Ripple Touch Portfolio Template
 * Category: Animated / Motion
 * Description: Material Design ripple effects on every interactive element. Expanding circles from click point. Clean, Google-inspired design language.
 */

/* ------------------------------------------------------------------ */
/* Material palette — Google blue on clean white surfaces              */
/* ------------------------------------------------------------------ */
const BLUE = '#1a73e8';
const BLUE_DARK = '#174ea6';
const INK = '#202124';
const GRAY = '#5f6368';
const LIGHT = '#f8f9fa';
const BORDER = '#dadce0';
const GOOGLE = ['#1a73e8', '#ea4335', '#34a853', '#f9ab00'];
const SANS = "Roboto, 'Product Sans', 'Google Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

const E1 = '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)';
const E2 = '0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ------------------------------------------------------------------ */
/* The ripple — Material's signature interaction                       */
/* ------------------------------------------------------------------ */
function useRipple(color = 'rgba(26,115,232,0.16)') {
  const counter = useRef(0);
  const alive = useRef(true);
  const [ripples, setRipples] = useState([]);
  useEffect(() => () => { alive.current = false; }, []);

  const spawn = (e) => {
    const el = e.currentTarget;
    if (!el || typeof el.getBoundingClientRect !== 'function') return;
    const rect = el.getBoundingClientRect();
    const hasPoint = typeof e.clientX === 'number' && e.clientX > 0;
    const x = hasPoint ? e.clientX - rect.left : rect.width / 2;
    const y = hasPoint ? e.clientY - rect.top : rect.height / 2;
    const size = Math.max(rect.width, rect.height) * 2.3;
    const id = counter.current++;
    if (alive.current) setRipples(rs => [...rs, { id, x, y, size }]);
    setTimeout(() => {
      if (alive.current) setRipples(rs => rs.filter(r => r.id !== id));
    }, 720);
  };

  const layer = (
    <span aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
      {ripples.map(r => (
        <motion.span
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            background: color,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </span>
  );
  return { spawn, layer };
}

/* Interactive elements with a Material ripple (filled / outlined / text) */
const Rippleable = ({ children, href, variant = 'text', className = '', style = {}, onClick, onPointerDown, title }) => {
  const color = variant === 'filled' ? 'rgba(255,255,255,0.45)' : 'rgba(26,115,232,0.16)';
  const { spawn, layer } = useRipple(color);
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      title={title}
      onPointerDown={(e) => { spawn(e); if (onPointerDown) onPointerDown(e); }}
      onClick={onClick}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium select-none transition-shadow ${className}`}
      style={style}
    >
      {layer}
      {children}
    </Tag>
  );
};

const FilledButton = ({ children, href }) => (
  <Rippleable href={href} variant="filled"
    className="rounded-full px-6 h-11 text-sm text-white"
    style={{ background: BLUE, boxShadow: E1 }}>
    {children}
  </Rippleable>
);

const OutlinedButton = ({ children, href }) => (
  <Rippleable href={href} variant="outlined"
    className="rounded-full px-6 h-11 text-sm"
    style={{ border: `1px solid ${BORDER}`, color: BLUE, background: '#ffffff' }}>
    {children}
  </Rippleable>
);

const TextButton = ({ children, href, color = BLUE }) => (
  <Rippleable href={href} variant="outlined"
    className="rounded-full px-4 h-10 text-sm font-semibold uppercase tracking-wide"
    style={{ color }}>
    {children}
  </Rippleable>
);

/* Section header in Google's expressive style */
const SectionHead = ({ icon: Icon, overline, title }) => (
  <motion.div variants={fadeUp} className="mb-10">
    <p className="text-xs font-semibold uppercase mb-2 flex items-center gap-2" style={{ letterSpacing: '0.2em', color: BLUE }}>
      {Icon ? <Icon size={15} strokeWidth={1.8} /> : null} {overline}
    </p>
    <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ color: INK }}>{title}</h2>
  </motion.div>
);

const GoogleAvatar = ({ name, size = 40 }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const c = GOOGLE[(name || '?').length % GOOGLE.length];
  return (
    <span className="inline-flex items-center justify-center rounded-full font-medium text-white shrink-0"
      style={{ width: size, height: size, background: c, fontSize: size * 0.4 }}>
      {initials || '?'}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  const chips = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <section id="hero" className="relative" style={{ background: `linear-gradient(180deg, ${LIGHT} 0%, #ffffff 100%)` }}>
      <motion.div initial="hidden" animate="visible" variants={stagger}
        className="max-w-4xl mx-auto px-6 pt-36 pb-16 text-center">
        <motion.span variants={fadeUp}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{ background: 'rgba(26,115,232,0.08)', color: BLUE }}>
          <MousePointerClick size={14} strokeWidth={1.8} /> Tap anything — everything ripples
        </motion.span>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-normal tracking-tight mb-5" style={{ color: INK }}>
          {p.name || 'Hello, world'}
        </motion.h1>
        {p.title ? (
          <motion.p variants={fadeUp} className="text-lg md:text-xl mb-3 font-normal" style={{ color: GRAY }}>
            {p.title}
          </motion.p>
        ) : null}
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-base max-w-xl mx-auto mb-4 leading-relaxed" style={{ color: GRAY }}>
            {p.tagline}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="text-sm mb-10 inline-flex items-center gap-1.5" style={{ color: GRAY }}>
            <MapPin size={14} strokeWidth={1.8} /> {p.location}
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-10">
          <FilledButton href="#contact">
            <Mail size={17} strokeWidth={1.8} /> Get in touch
          </FilledButton>
          <OutlinedButton href="#projects">
            Explore work <ArrowRight size={16} strokeWidth={1.8} />
          </OutlinedButton>
        </motion.div>
        {/* Material chips with ripple */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2.5">
          {chips.map(c => (
            <Rippleable key={c.label} href={c.href} variant="outlined"
              className="rounded-lg px-4 h-9 text-sm"
              style={{ background: '#ffffff', border: `1px solid ${BORDER}`, color: GRAY }}>
              {c.label}
            </Rippleable>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const rows = [
    { Icon: Mail, label: 'Email', value: p.email || data.socials?.email },
    { Icon: Phone, label: 'Phone', value: p.phone },
    { Icon: MapPin, label: 'Location', value: p.location },
  ].filter(r => r.value);
  const statItems = [
    { label: 'Years designing', value: stats.yearsExperience },
    { label: 'Things shipped', value: stats.projectsCompleted },
    { label: 'Happy users', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="px-6 md:px-10 py-14 max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <SectionHead icon={User} overline="Profile" title="About" />
        <motion.div variants={fadeUp} className="rounded-2xl p-6 md:p-8" style={{ background: '#ffffff', border: `1px solid ${BORDER}`, boxShadow: E1 }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {p.avatar ? (
              <img src={p.avatar} alt={p.name || 'Portrait'} className="w-24 h-24 rounded-full object-cover" style={{ boxShadow: E1 }} />
            ) : (
              <GoogleAvatar name={p.name} size={96} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] leading-relaxed mb-5" style={{ color: GRAY }}>
                {p.bio || 'This profile is intentionally minimal — the work below does the talking.'}
              </p>
              {rows.length > 0 && (
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {rows.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(26,115,232,0.08)', color: BLUE }}>
                        <r.Icon size={15} strokeWidth={1.8} />
                      </span>
                      <span className="text-xs w-16" style={{ color: GRAY }}>{r.label}</span>
                      <span className="text-sm truncate" style={{ color: INK }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {statItems.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
              {statItems.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-medium" style={{ color: GOOGLE[i % GOOGLE.length] }}>{s.value}</div>
                  <div className="text-[11px] mt-1" style={{ color: GRAY }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Skills — Material chips + linear progress */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="px-6 md:px-10 py-14 max-w-4xl mx-auto" style={{ background: LIGHT }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Star} overline="Capabilities" title="Skills" />
        {categories.map((cat, ci) => (
          <motion.div key={ci} variants={fadeUp} className="mb-8 last:mb-0">
            <h3 className="text-sm font-medium mb-4" style={{ color: INK }}>{cat}</h3>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                <Rippleable key={i} variant="outlined"
                  className="rounded-lg px-3.5 h-9 text-sm"
                  style={{ background: '#ffffff', border: `1px solid ${BORDER}`, color: INK }}>
                  <span className="w-2 h-2 rounded-full mr-0.5" style={{ background: GOOGLE[(ci + i) % GOOGLE.length] }} />
                  {skill.name}
                </Rippleable>
              ))}
            </div>
            {/* Material linear progress for the category's average level */}
            {(() => {
              const list = skills.filter(s => (s.category || 'Core') === cat);
              const avg = Math.round(list.reduce((a, s) => a + (Math.max(0, Math.min(100, Number(s.level) || 85))), 0) / (list.length || 1));
              return (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(26,115,232,0.15)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: BLUE }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${avg}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }} />
                  </div>
                  <span className="text-xs font-medium w-9 text-right" style={{ color: BLUE }}>{avg}%</span>
                </div>
              );
            })()}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

/* Projects — Material cards; the entire card ripples on press */
const ProjectCard = ({ project, i }) => {
  const { spawn, layer } = useRipple('rgba(26,115,232,0.10)');
  return (
    <motion.div variants={fadeUp} className="transition-shadow hover:shadow-xl">
      <div
        onPointerDown={spawn}
        className="relative rounded-2xl overflow-hidden cursor-pointer h-full"
        style={{ background: '#ffffff', border: `1px solid ${BORDER}`, boxShadow: E1 }}
      >
        {layer}
        <div className="h-40" style={{ background: 'rgba(26,115,232,0.04)' }}>
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(26,115,232,0.06)' }}>
              <span className="text-3xl font-medium" style={{ color: BLUE }}>
                {String(project.title || 'P').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-base font-medium mb-1" style={{ color: INK }}>{project.title}</h3>
          {project.description ? (
            <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: GRAY }}>{project.description}</p>
          ) : null}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(project.techStack || []).map((t, j) => (
              <span key={j} className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: `${GOOGLE[(i + j) % GOOGLE.length]}1A`, color: GOOGLE[(i + j) % GOOGLE.length] }}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            {project.liveUrl ? (
              <TextButton href={project.liveUrl}>Visit</TextButton>
            ) : null}
            {project.githubUrl ? (
              <TextButton href={project.githubUrl} color={GRAY}>Source</TextButton>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" className="px-6 md:px-10 py-14 max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <SectionHead icon={Briefcase} overline="Portfolio" title="Projects" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} i={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/* Experience — Material list with leading icons */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="px-6 md:px-10 py-14 max-w-4xl mx-auto" style={{ background: LIGHT }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Briefcase} overline="Career" title="Experience" />
        <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: `1px solid ${BORDER}`, boxShadow: E1 }}>
          {experience.map((exp, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-5"
              style={{ borderBottom: i < experience.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${GOOGLE[i % GOOGLE.length]}14`, color: GOOGLE[i % GOOGLE.length] }}>
                <Briefcase size={19} strokeWidth={1.8} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-base font-medium" style={{ color: INK }}>{exp.role}</h3>
                  <span className="text-sm" style={{ color: GRAY }}>· {exp.company}</span>
                </div>
                {exp.description ? (
                  <p className="text-sm leading-relaxed mt-1" style={{ color: GRAY }}>{exp.description}</p>
                ) : null}
              </div>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                style={{ background: 'rgba(26,115,232,0.08)', color: BLUE }}>
                {exp.period}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Testimonials — review cards with Google-style avatars */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" className="px-6 md:px-10 py-14 max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Star} overline="Reviews" title="What people say" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="rounded-2xl p-6"
              style={{ background: '#ffffff', border: `1px solid ${BORDER}`, boxShadow: E1 }}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} style={{ color: '#f9ab00', fill: '#f9ab00' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: INK }}>&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <GoogleAvatar name={t.name} />
                )}
                <span>
                  <span className="block text-sm font-medium" style={{ color: INK }}>{t.name}</span>
                  <span className="block text-xs" style={{ color: GRAY }}>{t.role}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
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
    <section id="contact" className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.div variants={fadeUp} className="rounded-2xl p-8 md:p-10 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(26,115,232,0.06), rgba(52,168,83,0.06))', border: `1px solid ${BORDER}`, boxShadow: E1 }}>
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
            style={{ background: BLUE, color: '#ffffff', boxShadow: E2 }}>
            <Mail size={24} strokeWidth={1.8} />
          </span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3" style={{ color: INK }}>
            Let&rsquo;s build something useful
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: GRAY }}>
            Clean interfaces, honest work, quick replies. The first message is the hardest — after that it&rsquo;s all momentum.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {email ? <FilledButton href={`mailto:${email}`}><Mail size={16} strokeWidth={1.8} /> Email me</FilledButton> : null}
            {socialLinks.map(l => (
              <OutlinedButton key={l.key} href={l.href}>
                <l.Icon size={16} strokeWidth={1.8} /> {l.label}
              </OutlinedButton>
            ))}
          </div>
        </motion.div>
        <motion.footer variants={fadeUp} className="mt-10 pt-6 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs" style={{ color: GRAY }}>
            &copy; {new Date().getFullYear()} {p.name || ''} · Ripple Touch Portfolio · <span style={{ color: BLUE }}>tap responsibly</span>
          </p>
        </motion.footer>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function RippleTouch() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: '#ffffff', color: INK, fontFamily: SANS }}>
      {/* app bar */}
      <header className="fixed top-0 inset-x-0 z-40 transition-shadow" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center gap-6">
          <a href="#hero" className="inline-flex items-center gap-2 font-medium text-base" style={{ color: INK }}>
            <span className="w-7 h-7 rounded-full inline-flex items-center justify-center" style={{ background: BLUE, color: '#ffffff' }}>
              <MousePointerClick size={15} strokeWidth={1.8} />
            </span>
            {p.name || 'Portfolio'}
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Rippleable key={item.label} href={item.href} variant="outlined"
                className="rounded-full px-4 h-9 text-sm"
                style={{ color: GRAY }}>
                {item.label}
              </Rippleable>
            ))}
          </nav>
          <div className="ml-auto">
            {data.socials?.email || p.email ? (
              <FilledButton href={`mailto:${data.socials?.email || p.email}`}>
                <Mail size={16} strokeWidth={1.8} /> Contact
              </FilledButton>
            ) : null}
          </div>
        </div>
      </header>

      <Hero data={data} />
      {(p.bio || p.avatar) ? <About data={data} /> : null}
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />

      {/* floating action button */}
      {(data.socials?.email || p.email) ? (
        <a href={`mailto:${data.socials?.email || p.email}`} aria-label="Email me"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-transform hover:scale-105"
          style={{ background: BLUE, boxShadow: E2 }}>
          <Mail size={22} strokeWidth={1.8} />
        </a>
      ) : null}
    </div>
  );
}
