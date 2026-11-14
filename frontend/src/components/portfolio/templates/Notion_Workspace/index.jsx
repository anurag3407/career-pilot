import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight, Search, Mail, Github, Linkedin, Twitter, MapPin, ExternalLink,
  User, Layers, KanbanSquare, Briefcase, MessageSquare, Phone, FileText, Sparkles
} from 'lucide-react';

/**
 * Notion Workspace Portfolio Template
 * Category: Famous UI Inspired
 * Description: Notion-style workspace with block-based content, toggle sections, callout boxes, and clean sans-serif typography. Light mode with subtle gray accents.
 */

/* ------------------------------------------------------------------ */
/* Notion palette — paper white, soft grays, muted select colors       */
/* ------------------------------------------------------------------ */
const PAGE = '#ffffff';
const SIDEBAR = '#fbfbfa';
const HOVER = '#f1f1ef';
const BORDER = '#e9e9e7';
const TEXT = '#37352f';
const SECOND = '#787774';
const ACCENT = '#2383e2';

const SELECT_COLORS = [
  { bg: '#e7f3f8', fg: '#2383e2' }, // blue
  { bg: '#edf3ec', fg: '#448361' }, // green
  { bg: '#fbf3db', fg: '#d9730d' }, // yellow
  { bg: '#f6f5ff', fg: '#9065b0' }, // purple
  { bg: '#fbe4e4', fg: '#e03e3e' }, // red
  { bg: '#f1f1ef', fg: '#787774' }, // gray
];

const SANS = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ------------------------------------------------------------------ */
/* Notion block primitives                                             */
/* ------------------------------------------------------------------ */
const SelectChip = ({ children, colorIdx = 0 }) => {
  const c = SELECT_COLORS[colorIdx % SELECT_COLORS.length];
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.fg }}>
      {children}
    </span>
  );
};

const H1 = ({ icon, children }) => (
  <motion.h1 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3" style={{ color: TEXT }}>
    <span aria-hidden="true">{icon}</span>
    {children}
  </motion.h1>
);

const H2 = ({ icon, children }) => (
  <motion.h2 variants={fadeUp} className="text-2xl font-bold mt-10 mb-3 flex items-center gap-2.5 scroll-mt-20" style={{ color: TEXT }}>
    <span aria-hidden="true">{icon}</span>
    {children}
  </motion.h2>
);

const Callout = ({ icon: Icon, children, tint = 'rgba(241,241,239,0.9)' }) => (
  <motion.div variants={fadeUp} className="flex gap-3 p-4 rounded-md my-3" style={{ background: tint }}>
    <span className="shrink-0 mt-0.5">{Icon ? <Icon size={16} strokeWidth={1.8} style={{ color: TEXT }} /> : '💡'}</span>
    <div className="text-sm leading-relaxed flex-1" style={{ color: TEXT }}>{children}</div>
  </motion.div>
);

/* Collapsible toggle block */
const Toggle = ({ title, emoji, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div variants={fadeUp} className="my-1">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-left px-1.5 py-1 rounded transition-colors hover:bg-[#f1f1ef]"
        style={{ color: TEXT }}>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }} className="shrink-0" style={{ color: SECOND }}>
          <ChevronRight size={15} strokeWidth={2} />
        </motion.span>
        <span aria-hidden="true" className="text-sm">{emoji}</span>
        <span className="font-semibold text-[15px]">{title}</span>
      </button>
      {open ? <div className="pl-5 pt-1">{children}</div> : null}
    </motion.div>
  );
};

const PageIcon = ({ data }) => {
  const p = data.personal || {};
  return p.avatar ? (
    <img src={p.avatar} alt={p.name || 'Page icon'} className="w-20 h-20 rounded object-cover"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
  ) : (
    <span className="w-20 h-20 rounded flex items-center justify-center text-4xl"
      style={{ background: HOVER, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      📂
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero">
      {/* cover */}
      <div aria-hidden="true" className="h-[120px] md:h-[160px] w-full"
        style={{ background: 'linear-gradient(120deg, #e8edf3 0%, #f3efe8 45%, #e7eee9 100%)' }} />
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative">
          <motion.div variants={fadeUp} className="-mt-10 mb-4">
            <PageIcon data={data} />
          </motion.div>
          <H1 icon="👋">{p.name || 'Untitled'}</H1>
          {p.title ? (
            <motion.p variants={fadeUp} className="text-lg mb-2" style={{ color: TEXT }}>{p.title}</motion.p>
          ) : null}
          {p.tagline ? (
            <motion.p variants={fadeUp} className="text-sm mb-4" style={{ color: SECOND }}>{p.tagline}</motion.p>
          ) : null}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm mb-6" style={{ color: SECOND }}>
            {p.location ? <span className="inline-flex items-center gap-1.5"><MapPin size={13} strokeWidth={1.8} /> {p.location}</span> : null}
            {(data.socials?.email || p.email) ? (
              <a href={`mailto:${data.socials?.email || p.email}`} className="inline-flex items-center gap-1.5 hover:underline">
                <Mail size={13} strokeWidth={1.8} /> {data.socials?.email || p.email}
              </a>
            ) : null}
          </motion.div>
          <motion.div variants={fadeUp} className="flex gap-2 pb-8">
            <a href="#contact"
              className="inline-flex items-center gap-2 px-3 h-8 rounded text-sm font-medium transition-colors hover:bg-[#f1f1ef]"
              style={{ background: ACCENT, color: '#ffffff' }}>
              <Mail size={14} strokeWidth={1.8} /> Get in touch
            </a>
            <a href="#projects"
              className="inline-flex items-center gap-2 px-3 h-8 rounded text-sm font-medium transition-colors hover:bg-[#f1f1ef]"
              style={{ border: `1px solid ${BORDER}`, color: TEXT }}>
              <KanbanSquare size={14} strokeWidth={1.8} /> View projects
            </a>
          </motion.div>
          <div className="h-px" style={{ background: BORDER }} />
        </motion.div>
      </div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const props = [
    { label: 'Years building', value: stats.yearsExperience, emoji: '📅' },
    { label: 'Projects shipped', value: stats.projectsCompleted, emoji: '🚀' },
    { label: 'Happy clients', value: stats.happyClients, emoji: '🤝' },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="max-w-3xl mx-auto px-6 md:px-10 py-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <H2 icon="ℹ️">About</H2>
        <Callout icon={Sparkles}>
          {p.bio || 'This page is a living document. Sections fill in as new work ships.'}
        </Callout>
        {props.length > 0 && (
          <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-2 my-3">
            {props.map((s, i) => (
              <div key={i} className="rounded-md p-3 transition-colors hover:bg-[#f1f1ef]" style={{ border: `1px solid ${BORDER}` }}>
                <div className="text-2xl font-bold" style={{ color: TEXT }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: SECOND }}>{s.emoji} {s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
        {p.phone ? (
          <Callout icon={Phone} tint="rgba(231,243,248,0.8)">
            Prefer to talk? Phone: <strong>{p.phone}</strong>
          </Callout>
        ) : null}
        <div className="h-px my-6" style={{ background: BORDER }} />
      </motion.div>
    </section>
  );
};

/* Skills — toggle groups with inline property tables */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="max-w-3xl mx-auto px-6 md:px-10 py-2">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <H2 icon="🧰">Skills</H2>
        <p className="text-sm mb-3" style={{ color: SECOND }}>Expand a group to inspect proficiency levels.</p>
        {categories.map((cat, ci) => (
          <Toggle key={ci} title={cat} emoji={['🧩', '⚙️', '🎨', '🌱'][ci % 4]}>
            <div className="rounded-md overflow-hidden mb-3" style={{ border: `1px solid ${BORDER}` }}>
              {skills.filter(s => (s.category || 'Core') === cat).map((skill, i, arr) => {
                const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                return (
                  <div key={i} className="flex items-center gap-3 px-3 h-10 transition-colors hover:bg-[#f1f1ef]"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <span className="text-sm font-medium flex-1" style={{ color: TEXT }}>{skill.name}</span>
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(55,53,47,0.09)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: ACCENT }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05 }} />
                    </div>
                    <SelectChip colorIdx={ci}>{level}</SelectChip>
                  </div>
                );
              })}
            </div>
          </Toggle>
        ))}
        <div className="h-px my-6" style={{ background: BORDER }} />
      </motion.div>
    </section>
  );
};

/* Projects — a Notion database table */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  const statuses = ['In progress', 'Shipped', 'Shipped', 'Ideating'];
  return (
    <section id="projects" className="max-w-3xl mx-auto px-6 md:px-10 py-2">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <H2 icon="🗂️">Projects</H2>
        <motion.div variants={fadeUp} className="rounded-md overflow-hidden mb-3" style={{ border: `1px solid ${BORDER}` }}>
          {/* table header */}
          <div className="grid grid-cols-[1fr_110px_150px_70px] items-center h-9 px-3 text-xs font-semibold"
            style={{ color: SECOND, borderBottom: `1px solid ${BORDER}`, background: 'rgba(247,247,245,0.6)' }}>
            <span>Name</span><span>Status</span><span className="hidden sm:block">Stack</span><span className="text-right">Link</span>
          </div>
          {projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp}
              className="grid grid-cols-[1fr_110px_150px_70px] items-center min-h-11 px-3 py-2 transition-colors hover:bg-[#f1f1ef]"
              style={{ borderBottom: i < projects.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span className="text-sm font-medium truncate pr-2" style={{ color: TEXT }}>{project.title}</span>
              <span><SelectChip colorIdx={i % 3}>{statuses[i % statuses.length]}</SelectChip></span>
              <span className="hidden sm:flex flex-wrap gap-1 overflow-hidden">
                {(project.techStack || []).slice(0, 2).map((t, j) => (
                  <SelectChip key={j} colorIdx={j + 2}>{t}</SelectChip>
                ))}
              </span>
              <span className="flex justify-end gap-2">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60" title="Live">
                    <ExternalLink size={15} strokeWidth={1.8} style={{ color: SECOND }} />
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60" title="Source">
                    <Github size={15} strokeWidth={1.8} style={{ color: SECOND }} />
                  </a>
                ) : null}
              </span>
            </motion.div>
          ))}
        </motion.div>
        {/* expandable notes per project */}
        {projects.map((project, i) => (
          <Toggle key={i} title={`${project.title} — notes`} emoji="📝" defaultOpen={i === 0}>
            <p className="text-sm leading-relaxed mb-2" style={{ color: TEXT }}>
              {project.description || 'No description yet.'}
            </p>
            {project.image ? (
              <div className="rounded-md overflow-hidden mb-2" style={{ border: `1px solid ${BORDER}` }}>
                <img src={project.image} alt={project.title} className="w-full max-h-56 object-cover" />
              </div>
            ) : null}
          </Toggle>
        ))}
        <div className="h-px my-6" style={{ background: BORDER }} />
      </motion.div>
    </section>
  );
};

/* Experience — toggle timeline */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="max-w-3xl mx-auto px-6 md:px-10 py-2">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <H2 icon="📈">Experience</H2>
        <div>
          {experience.map((exp, i) => (
            <Toggle key={i} title={`${exp.role} @ ${exp.company}`} emoji="🏢" defaultOpen={i === 0}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <SelectChip colorIdx={4}>{exp.period}</SelectChip>
                <span className="text-xs" style={{ color: SECOND }}>Chapter {i + 1}</span>
              </div>
              {exp.description ? (
                <p className="text-sm leading-relaxed" style={{ color: TEXT }}>{exp.description}</p>
              ) : null}
            </Toggle>
          ))}
        </div>
        <div className="h-px my-6" style={{ background: BORDER }} />
      </motion.div>
    </section>
  );
};

/* Testimonials — quote blocks */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" className="max-w-3xl mx-auto px-6 md:px-10 py-2">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <H2 icon="💬">Testimonials</H2>
        {testimonials.map((t, i) => (
          <motion.blockquote key={i} variants={fadeUp} className="my-3 pl-4 text-sm leading-relaxed"
            style={{ borderLeft: `3px solid ${TEXT}`, color: TEXT }}>
            {t.text}
            <footer className="mt-2 flex items-center gap-2">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: SELECT_COLORS[i % SELECT_COLORS.length].fg }}>
                  {(t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
              <span className="text-xs" style={{ color: SECOND }}>
                <strong style={{ color: TEXT }}>{t.name}</strong> — {t.role}
              </span>
            </footer>
          </motion.blockquote>
        ))}
        <div className="h-px my-6" style={{ background: BORDER }} />
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
    <section id="contact" className="max-w-3xl mx-auto px-6 md:px-10 py-2 pb-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <H2 icon="📮">Contact</H2>
        <Callout icon={Mail} tint="rgba(237,243,236,0.9)">
          The fastest way to reach me is email. Social inboxes are checked too — pick whatever suits you.
        </Callout>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 my-3">
          {email ? (
            <a href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-3 h-9 rounded text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: ACCENT, color: '#ffffff' }}>
              <Mail size={15} strokeWidth={1.8} /> Email me
            </a>
          ) : null}
          {socialLinks.map(l => (
            <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 h-9 rounded text-sm font-medium transition-colors hover:bg-[#f1f1ef]"
              style={{ border: `1px solid ${BORDER}`, color: TEXT }}>
              <l.Icon size={15} strokeWidth={1.8} /> {l.label}
            </a>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} className="pt-8 pb-2 flex items-center justify-between text-xs" style={{ color: SECOND }}>
          <span>Made with Notion-style blocks · © {new Date().getFullYear()} {p.name || ''}</span>
          <span className="inline-flex items-center gap-1"><FileText size={12} /> Last edited today</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
const SIDEBAR_TREE = [
  { label: '👋 Welcome', href: '#hero' },
  { label: 'ℹ️ About', href: '#about', Icon: User },
  { label: '🧰 Skills', href: '#skills', Icon: Layers },
  { label: '🗂️ Projects', href: '#projects', Icon: KanbanSquare },
  { label: '📈 Experience', href: '#experience', Icon: Briefcase },
  { label: '💬 Testimonials', href: '#testimonials', Icon: MessageSquare },
  { label: '📮 Contact', href: '#contact', Icon: Mail },
];

export default function NotionWorkspace() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  return (
    <div className="antialiased min-h-screen" style={{ background: PAGE, color: TEXT, fontFamily: SANS }}>
      <div className="flex">
        {/* sidebar */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[240px] flex-col" style={{ background: SIDEBAR, borderRight: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2.5 h-12 px-3 transition-colors hover:bg-[#f1f1ef] rounded-md mx-2 mt-2 cursor-pointer">
            <PageIconInline data={data} />
            <span className="text-sm font-semibold truncate" style={{ color: TEXT }}>{p.name || 'My workspace'}</span>
          </div>
          <div className="mx-3 mt-2 flex items-center gap-2 h-8 px-2.5 rounded-md transition-colors hover:bg-[#f1f1ef]"
            style={{ color: SECOND }}>
            <Search size={14} strokeWidth={1.8} />
            <span className="text-xs flex-1">Search</span>
            <span className="text-[10px] px-1 rounded" style={{ background: 'rgba(55,53,47,0.08)' }}>⌘K</span>
          </div>
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <p className="text-[11px] font-semibold uppercase px-2 mb-2" style={{ letterSpacing: '0.06em', color: SECOND }}>
              Portfolio
            </p>
            {SIDEBAR_TREE.map(item => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-2 h-8 px-2 rounded-md text-sm transition-colors hover:bg-[#f1f1ef]"
                style={{ color: TEXT }}>
                {item.Icon ? <item.Icon size={15} strokeWidth={1.8} style={{ color: SECOND }} /> : null}
                <span className="truncate">{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="px-4 py-3 text-[11px]" style={{ color: SECOND, borderTop: `1px solid ${BORDER}` }}>
            © {new Date().getFullYear()} {p.name || ''} · Notion Workspace Portfolio
          </div>
        </aside>

        {/* mobile top bar */}
        <div className="md:hidden sticky top-0 z-40 h-12 flex items-center gap-2 px-4 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.92)', borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold truncate flex-1" style={{ color: TEXT }}>{p.name || 'My workspace'}</span>
          <nav className="flex gap-3 overflow-x-auto">
            {SIDEBAR_TREE.map(item => (
              <a key={item.label} href={item.href} className="text-xs whitespace-nowrap" style={{ color: SECOND }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* page */}
        <main className="flex-1 md:ml-[240px] min-w-0">
          <Hero data={data} />
          {(p.bio || p.avatar) ? <About data={data} /> : null}
          {data.skills?.length > 0 ? <Skills data={data} /> : null}
          {data.projects?.length > 0 ? <Projects data={data} /> : null}
          {data.experience?.length > 0 ? <Experience data={data} /> : null}
          {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
          <Contact data={data} />
        </main>
      </div>
    </div>
  );
}

/* tiny inline avatar for the sidebar header */
function PageIconInline({ data }) {
  const p = data.personal || {};
  return p.avatar ? (
    <img src={p.avatar} alt="" className="w-6 h-6 rounded object-cover" />
  ) : (
    <span className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: HOVER }}>📂</span>
  );
}
