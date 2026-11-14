import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, User, Layers, KanbanSquare, History, MessageSquareQuote, Mail,
  Search, ChevronRight, Check, CircleDashed, CircleDot, ArrowUpRight,
  Github, ExternalLink, MapPin, Phone, Folder, Sparkles, Zap
} from 'lucide-react';

/**
 * Linear Dashboard Portfolio Template
 * Category: Famous UI Inspired
 * Description: Linear.app inspired dashboard with dark mode, clean sidebar navigation, issue-tracker-style project cards with status indicators and priority labels.
 */

/* ------------------------------------------------------------------ */
/* Linear-flavored palette                                             */
/* ------------------------------------------------------------------ */
const BG = '#0b0c0e';
const PANEL = '#101114';
const PANEL_HOVER = '#16171b';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER_STRONG = 'rgba(255,255,255,0.13)';
const TEXT = '#e7e9ee';
const SECOND = '#8a8f98';
const ACCENT = '#5e6ad2';

const STATUS = {
  'In Progress': { color: '#f2994a', Icon: CircleDot },
  'Done': { color: '#4cb782', Icon: Check },
  'Backlog': { color: '#8a8f98', Icon: CircleDashed },
  'In Review': { color: '#26b5ce', Icon: CircleDot },
};
const STATUS_ORDER = ['In Progress', 'Done', 'In Review', 'Backlog'];

const PRIORITY = {
  'Urgent': { color: '#eb5757' },
  'High': { color: '#f2994a' },
  'Medium': { color: '#5e6ad2' },
  'Low': { color: '#8a8f98' },
};
const PRIORITY_ORDER = ['Urgent', 'High', 'Medium', 'Low'];

const DOTS = ['#5e6ad2', '#4cb782', '#f2994a', '#eb5757', '#26b5ce', '#c46ad2'];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const SANS = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace";

/* Small UI atoms ---------------------------------------------------- */
const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center justify-center h-[20px] min-w-[20px] px-1.5 rounded-[4px] text-[10px] font-medium"
    style={{ background: '#1b1c20', border: `1px solid ${BORDER_STRONG}`, borderBottomWidth: '2px', color: SECOND, fontFamily: MONO }}>
    {children}
  </kbd>
);

const Chip = ({ children, color, subtle }) => (
  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
    style={{
      color: color,
      background: subtle ? `${color}1a` : 'transparent',
      border: subtle ? 'none' : `1px solid ${BORDER}`,
    }}>
    {children}
  </span>
);

const StatusIcon = ({ status }) => {
  const cfg = STATUS[status] || STATUS['Backlog'];
  const { Icon } = cfg;
  return (
    <span className="shrink-0 w-[16px] h-[16px] rounded-full flex items-center justify-center"
      style={{ border: `1.5px solid ${cfg.color}`, color: cfg.color }}>
      {Icon === Check
        ? <Check size={10} strokeWidth={3} />
        : <Icon size={8} strokeWidth={2} />}
    </span>
  );
};

const Monogram = ({ name, size = 26, rounded = 'rounded-md' }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className={`shrink-0 inline-flex items-center justify-center font-semibold ${rounded}`}
      style={{ width: size, height: size, fontSize: size * 0.4, background: `${ACCENT}2e`, color: '#b6bcf2', border: `1px solid ${ACCENT}55` }}>
      {initials || '?'}
    </span>
  );
};

/* Section shell — workspace-style page header */
const SectionHead = ({ icon: Icon, title, hint }) => (
  <motion.div variants={fadeUp} className="mb-8">
    <div className="flex items-center gap-2.5 mb-1.5">
      {Icon ? <Icon size={15} strokeWidth={1.8} style={{ color: ACCENT }} /> : null}
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: TEXT }}>{title}</h2>
    </div>
    {hint ? <p className="text-sm" style={{ color: SECOND }}>{hint}</p> : null}
  </motion.div>
);

const Panel = ({ children, className = '' }) => (
  <div className={`rounded-lg ${className}`}
    style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statTiles = [
    { label: 'Years building', value: stats.yearsExperience },
    { label: 'Projects shipped', value: stats.projectsCompleted },
    { label: 'Happy clients', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* signature Linear glow */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse 55% 60% at 50% -10%, ${ACCENT}30, transparent 70%)` }} />

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative px-6 md:px-10 pt-20 md:pt-28 pb-16 max-w-4xl">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-2.5 py-1 rounded-full"
          style={{ border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4cb782' }} />
          <span className="text-xs font-medium" style={{ color: SECOND }}>Available for new work</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ color: TEXT }}>
          {p.name || 'My Portfolio'}
        </motion.h1>
        {p.title ? (
          <motion.p variants={fadeUp} className="text-lg md:text-xl font-medium mb-3" style={{ color: '#b6bcf2' }}>
            {p.title}
          </motion.p>
        ) : null}
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-base leading-relaxed max-w-xl mb-3" style={{ color: SECOND }}>
            {p.tagline}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="flex items-center gap-1.5 text-sm mb-8" style={{ color: SECOND }}>
            <MapPin size={13} strokeWidth={1.8} /> {p.location}
          </motion.p>
        ) : null}

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
          <a href="#contact"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: ACCENT, color: '#ffffff' }}>
            <Mail size={15} strokeWidth={1.8} /> Get in touch
          </a>
          <a href="#projects"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors hover:bg-[#16171b]"
            style={{ border: `1px solid ${BORDER_STRONG}`, color: TEXT }}>
            <KanbanSquare size={15} strokeWidth={1.8} /> Browse projects
          </a>
        </motion.div>

        {statTiles.length > 0 && (
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 max-w-xl">
            {statTiles.map((s, i) => (
              <Panel key={i} className="px-4 py-3.5">
                <div className="text-xl md:text-2xl font-semibold tracking-tight" style={{ fontFamily: MONO, color: TEXT }}>
                  {s.value}
                </div>
                <div className="text-[11px] mt-1" style={{ color: SECOND }}>{s.label}</div>
              </Panel>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const rows = [
    { Icon: Mail, label: 'Email', value: p.email || data.socials?.email },
    { Icon: Phone, label: 'Phone', value: p.phone },
    { Icon: MapPin, label: 'Location', value: p.location },
  ].filter(r => r.value);

  return (
    <section id="about" className="px-6 md:px-10 py-14 max-w-4xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <SectionHead icon={User} title="About" hint="A short brief on who you're working with." />
        <motion.div variants={fadeUp}>
          <Panel className="p-6 flex flex-col md:flex-row gap-6">
            <div className="shrink-0">
              {p.avatar ? (
                <img src={p.avatar} alt={p.name || 'Portrait'} className="w-28 h-28 rounded-lg object-cover"
                  style={{ border: `1px solid ${BORDER_STRONG}` }} />
              ) : (
                <span className="flex items-center justify-center rounded-lg"
                  style={{ width: 112, height: 112, background: `${ACCENT}22`, border: `1px solid ${BORDER_STRONG}` }}>
                  <span className="text-2xl font-semibold" style={{ color: '#b6bcf2' }}>
                    {(p.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-[15px] leading-relaxed mb-5" style={{ color: TEXT }}>
                {p.bio || 'No bio filed yet — reach out directly and ask.'}
              </p>
              {rows.length > 0 && (
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {rows.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <r.Icon size={14} strokeWidth={1.8} style={{ color: SECOND }} />
                      <span className="text-xs w-20" style={{ color: SECOND }}>{r.label}</span>
                      <span className="text-sm truncate" style={{ color: TEXT }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Skills — grouped like Linear labels with slim progress meters */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="px-6 md:px-10 py-14 max-w-4xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Layers} title="Skills" hint="Grouped by discipline, tracked like labels." />
        <div className="space-y-6">
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-3">
                <Folder size={13} strokeWidth={1.8} style={{ color: SECOND }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: SECOND }}>{cat}</span>
                <span className="text-[11px] px-1.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: SECOND, fontFamily: MONO }}>
                  {skills.filter(s => (s.category || 'Core') === cat).length}
                </span>
              </div>
              <Panel>
                {skills.filter(s => (s.category || 'Core') === cat).map((skill, i, arr) => {
                  const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 h-11 transition-colors hover:bg-[#16171b] ${i < arr.length - 1 ? '' : ''}`}
                      style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: DOTS[(ci * 3 + i) % DOTS.length] }} />
                      <span className="text-sm font-medium flex-1 truncate" style={{ color: TEXT }}>{skill.name}</span>
                      <div className="hidden sm:block w-28 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: DOTS[(ci * 3 + i) % DOTS.length] }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: i * 0.06, ease: 'easeOut' }} />
                      </div>
                      <span className="text-xs w-8 text-right" style={{ fontFamily: MONO, color: SECOND }}>{level}</span>
                    </div>
                  );
                })}
              </Panel>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/* Projects — the issue tracker board */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" className="px-6 md:px-10 py-14 max-w-4xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={KanbanSquare} title="Projects" hint="Every project, tracked to done." />

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-medium px-2.5 h-7 inline-flex items-center rounded-md" style={{ background: 'rgba(255,255,255,0.07)', color: TEXT }}>
            All ({projects.length})
          </span>
          {['In Progress', 'Done', 'Backlog'].map(st => (
            <span key={st} className="text-xs font-medium px-2.5 h-7 inline-flex items-center gap-1.5 rounded-md transition-colors hover:bg-[#16171b]"
              style={{ border: `1px solid ${BORDER}`, color: SECOND }}>
              <StatusIcon status={st} /> {st}
            </span>
          ))}
        </motion.div>

        <Panel>
          {projects.map((project, i) => {
            const status = STATUS_ORDER[i % STATUS_ORDER.length];
            const priority = PRIORITY_ORDER[i % PRIORITY_ORDER.length];
            const pCfg = PRIORITY[priority];
            return (
              <motion.div key={i} variants={fadeUp} className="group px-4 py-3.5 transition-colors hover:bg-[#16171b]"
                style={{ borderBottom: i < projects.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <StatusIcon status={status} />
                  <span className="text-sm font-medium truncate flex-1 min-w-0" style={{ color: TEXT }}>
                    {project.title}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ color: pCfg.color, background: `${pCfg.color}1a` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: pCfg.color }} />
                    {priority}
                  </span>
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Live site"
                      className="opacity-60 hover:opacity-100 transition-opacity">
                      <ExternalLink size={15} strokeWidth={1.8} style={{ color: SECOND }} />
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="Source"
                      className="opacity-60 hover:opacity-100 transition-opacity">
                      <Github size={15} strokeWidth={1.8} style={{ color: SECOND }} />
                    </a>
                  ) : null}
                </div>
                {project.description ? (
                  <p className="text-[13px] mt-1.5 line-clamp-2" style={{ color: SECOND }}>{project.description}</p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] uppercase tracking-wider font-medium inline-flex items-center gap-1"
                    style={{ color: STATUS[status].color }}>
                    {status}
                  </span>
                  {(project.techStack || []).map((t, j) => (
                    <span key={j} className="text-[11px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.05)', color: SECOND }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </Panel>
      </motion.div>
    </section>
  );
};

/* Experience — a changelog of roles */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="px-6 md:px-10 py-14 max-w-4xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={History} title="Experience" hint="Shipped, in reverse chronological order." />
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: BORDER_STRONG }} />
          {experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative pb-8 last:pb-0">
              <span className="absolute -left-6 top-1.5 w-[15px] h-[15px] rounded-full flex items-center justify-center"
                style={{ background: BG, border: `1.5px solid ${i === 0 ? '#4cb782' : BORDER_STRONG}` }}>
                {i === 0
                  ? <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4cb782' }} />
                  : <span className="w-1 h-1 rounded-full" style={{ background: SECOND }} />}
              </span>
              <div className="rounded-lg px-4 py-3.5 transition-colors hover:bg-[#16171b]" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <span className="text-sm font-semibold" style={{ color: TEXT }}>{exp.role}</span>
                  <span className="text-sm" style={{ color: SECOND }}>· {exp.company}</span>
                  <span className="ml-auto text-[11px] px-2 py-0.5 rounded" style={{ fontFamily: MONO, color: SECOND, background: 'rgba(255,255,255,0.05)' }}>
                    {exp.period}
                  </span>
                </div>
                {exp.description ? (
                  <p className="text-[13px] leading-relaxed" style={{ color: SECOND }}>{exp.description}</p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/* Testimonials — customer quotes as support tickets, resolved */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" className="px-6 md:px-10 py-14 max-w-5xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={MessageSquareQuote} title="Testimonials" hint="Feedback from people I've shipped with." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="rounded-lg p-5 transition-colors hover:bg-[#16171b]"
              style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} strokeWidth={1.8} style={{ color: DOTS[i % DOTS.length] }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: SECOND }}>
                  Verified collaborator
                </span>
              </div>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: TEXT }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-full object-cover"
                    style={{ border: `1px solid ${BORDER_STRONG}` }} />
                ) : (
                  <Monogram name={t.name} size={26} rounded="rounded-full" />
                )}
                <span>
                  <span className="block text-xs font-medium" style={{ color: TEXT }}>{t.name}</span>
                  <span className="block text-[11px]" style={{ color: SECOND }}>{t.role}</span>
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
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: ExternalLink },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: ArrowUpRight },
  ].filter(l => l.href);

  return (
    <section id="contact" className="px-6 md:px-10 py-16 max-w-4xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <Panel className="relative overflow-hidden p-8 md:p-10 text-center">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 80% at 50% -20%, ${ACCENT}26, transparent 70%)` }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-4">
                <Zap size={15} strokeWidth={1.8} style={{ color: ACCENT }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: SECOND }}>Contact</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: TEXT }}>
                Let&rsquo;s build something great
              </h2>
              <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: SECOND }}>
                Have a project in mind? Open a conversation — typical response time is under 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {email ? (
                  <a href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ background: ACCENT, color: '#ffffff' }}>
                    <Mail size={15} strokeWidth={1.8} /> Email me
                  </a>
                ) : null}
                {socialLinks.map(l => (
                  <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors hover:bg-[#16171b]"
                    style={{ border: `1px solid ${BORDER_STRONG}`, color: TEXT }}>
                    <l.Icon size={15} strokeWidth={1.8} /> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </Panel>
        </motion.div>

        {/* keyboard-hint footer */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
          <p className="text-xs" style={{ color: SECOND }}>
            &copy; {new Date().getFullYear()} {p.name || ''} — built for speed.
          </p>
          <div className="flex items-center gap-4 text-[11px]" style={{ color: SECOND }}>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>⌘</Kbd><Kbd>K</Kbd> to navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>G</Kbd> then <Kbd>C</Kbd> to contact
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Sidebar + main shell                                                */
/* ------------------------------------------------------------------ */
const NAV = [
  { label: 'Overview', href: '#hero', Icon: Home, key: 'O' },
  { label: 'About', href: '#about', Icon: User, key: 'A' },
  { label: 'Skills', href: '#skills', Icon: Layers, key: 'S' },
  { label: 'Projects', href: '#projects', Icon: KanbanSquare, key: 'P' },
  { label: 'Experience', href: '#experience', Icon: History, key: 'E' },
  { label: 'Reviews', href: '#testimonials', Icon: MessageSquareQuote, key: 'R' },
  { label: 'Contact', href: '#contact', Icon: Mail, key: 'C' },
];

export default function LinearDashboard() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  return (
    <div className="antialiased min-h-screen" style={{ background: BG, color: TEXT, fontFamily: SANS }}>
      {/* mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(11,12,14,0.85)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 px-4 h-12">
          <Monogram name={p.name} size={22} />
          <span className="text-sm font-semibold truncate" style={{ color: TEXT }}>{p.name || 'Portfolio'}</span>
          <div className="ml-auto flex items-center gap-1 overflow-x-auto">
            {NAV.map(item => (
              <a key={item.label} href={item.href}
                className="px-2 h-8 inline-flex items-center rounded-md text-xs font-medium whitespace-nowrap"
                style={{ color: SECOND }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60 flex-col"
        style={{ background: '#0d0e11', borderRight: `1px solid ${BORDER}` }}>
        {/* workspace switcher */}
        <div className="flex items-center gap-2.5 h-14 px-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <Monogram name={p.name} />
          <span className="text-sm font-semibold truncate flex-1" style={{ color: TEXT }}>{p.name || 'Portfolio'}</span>
          <ChevronRight size={14} strokeWidth={1.8} style={{ color: SECOND }} />
        </div>
        {/* search hint */}
        <div className="mx-3 mt-3 flex items-center gap-2 h-8 px-2.5 rounded-md cursor-default"
          style={{ border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
          <Search size={13} strokeWidth={1.8} style={{ color: SECOND }} />
          <span className="text-xs flex-1" style={{ color: SECOND }}>Search…</span>
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
        </div>
        {/* nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: 'rgba(138,143,152,0.7)' }}>
            Portfolio
          </p>
          {NAV.map(item => (
            <a key={item.label} href={item.href}
              className="group flex items-center gap-2.5 h-8 px-2 rounded-md text-sm font-medium transition-colors hover:bg-[#16171b]"
              style={{ color: SECOND }}>
              <item.Icon size={15} strokeWidth={1.8} className="transition-colors group-hover:text-[#e7e9ee]" />
              <span className="flex-1 transition-colors group-hover:text-[#e7e9ee]">{item.label}</span>
              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: MONO }}>
                {item.key}
              </span>
            </a>
          ))}
        </nav>
        {/* sidebar footer */}
        <div className="px-3 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#4cb782' }} />
            <span className="text-xs" style={{ color: SECOND }}>All systems operational</span>
          </div>
        </div>
      </aside>

      {/* main column */}
      <main className="md:ml-60">
        {/* breadcrumb bar */}
        <div className="hidden md:flex items-center gap-2 h-12 px-8 sticky top-0 z-30 backdrop-blur-md"
          style={{ background: 'rgba(11,12,14,0.8)', borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-medium" style={{ color: TEXT }}>{p.name || 'Portfolio'}</span>
          <ChevronRight size={13} style={{ color: SECOND }} />
          <span className="text-sm" style={{ color: SECOND }}>workspace</span>
          <span className="ml-auto inline-flex items-center gap-2 text-[11px]" style={{ color: SECOND }}>
            <Kbd>⌘</Kbd><Kbd>K</Kbd> jump to…
          </span>
        </div>

        <Hero data={data} />
        {(p.bio || p.avatar) ? <About data={data} /> : null}
        {data.skills?.length > 0 ? <Skills data={data} /> : null}
        {data.projects?.length > 0 ? <Projects data={data} /> : null}
        {data.experience?.length > 0 ? <Experience data={data} /> : null}
        {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
        <Contact data={data} />
      </main>
    </div>
  );
}
