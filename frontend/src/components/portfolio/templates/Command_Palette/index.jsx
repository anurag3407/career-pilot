import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Home, User, Wrench, Layers, Clock, MessageSquare, Mail, Github,
  Linkedin, Twitter, ExternalLink, CornerDownLeft, FolderGit2, MapPin, Command
} from 'lucide-react';

/**
 * Command Palette Portfolio Template
 * Category: Interactive / Experimental
 * Description: Cmd+K command palette as primary navigation (Raycast/Spotlight-style). Type to search and navigate to any section instantly. Keyboard-first design.
 */

const BG = '#0f1114';
const PANEL = '#17191e';
const BORDER = '#2a2e35';
const ACCENT = '#8b8ff8';

const GRID_BG = {
  backgroundColor: BG,
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
    'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
  backgroundSize: '44px 44px'
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};
const stagger = { visible: { transition: { staggerChildren: 0.09 } } };

const initialsOf = (name) =>
  (name || '').trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center justify-center min-w-[1.45rem] h-6 px-1.5 rounded-md border bg-white/[0.05] text-[10px] font-mono"
    style={{ borderColor: BORDER, color: '#9aa1ab' }}>
    {children}
  </kbd>
);

/* ---------- fuzzy scoring ---------- */

function fuzzyScore(query, text) {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 1;
  let qi = 0, score = 0, streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      streak++;
      score += 2 + streak + (ti === 0 ? 3 : 0);
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score : 0;
}

/* ---------- shared section header ---------- */

const SectionHeader = ({ Icon, cmd, title }) => (
  <div className="mb-10">
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider mb-3" style={{ color: '#6f7680' }}>
      <Icon size={13} style={{ color: ACCENT }} />
      <span>~/{cmd}</span>
      <span className="ml-auto flex items-center gap-1.5">navigate: <Kbd>⌘</Kbd><Kbd>K</Kbd></span>
    </div>
    <h2 className="font-mono text-3xl md:text-4xl font-bold" style={{ color: '#e8eaee' }}>
      <span style={{ color: ACCENT }}>&gt;</span> {title}
    </h2>
  </div>
);

/* ---------- Command Palette overlay ---------- */

function PaletteOverlay({ open, onClose, items }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const scored = items
      .map((it) => ({ it, s: fuzzyScore(query, `${it.label} ${it.keywords || ''}`) }))
      .filter((x) => x.s > 0);
    scored.sort((a, b) => b.s - a.s);
    return scored.map((x) => x.it);
  }, [items, query]);

  useEffect(() => { setQuery(''); setIndex(0); }, [open]);

  useEffect(() => { setIndex(0); }, [query]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [index, filtered, open]);

  const runItem = (item) => {
    onClose();
    if (item.type === 'section') {
      setTimeout(() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    } else if (item.type === 'mail') {
      window.location.href = item.url;
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[index]) runItem(filtered[index]);
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          style={{ backgroundColor: 'rgba(5,6,8,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16 }}
            className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden"
            style={{ backgroundColor: PANEL, borderColor: BORDER, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-label="Command palette">
            <div className="flex items-center gap-3 px-4 border-b" style={{ borderColor: BORDER }}>
              <Search size={16} style={{ color: '#6f7680' }} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent outline-none py-4 text-sm font-mono"
                style={{ color: '#e8eaee' }} />
              <Kbd>esc</Kbd>
            </div>
            <div ref={listRef} className="max-h-[46vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-5 py-8 text-center font-mono text-xs" style={{ color: '#6f7680' }}>
                  No results for "{query}" — try "projects" or "contact"
                </div>
              )}
              {filtered.map((item, i) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                const selected = i === index;
                const Icon = item.Icon;
                return (
                  <React.Fragment key={`${item.group}-${item.label}-${i}`}>
                    {showGroup && (
                      <div className="px-5 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: '#565c66' }}>
                        {item.group}
                      </div>
                    )}
                    <button data-selected={selected} onMouseEnter={() => setIndex(i)} onClick={() => runItem(item)}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors"
                      style={{ backgroundColor: selected ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                      {selected && <span className="w-0.5 h-5 rounded-full -ml-2 mr-1" style={{ backgroundColor: ACCENT }} />}
                      {item.Icon && <Icon size={15} style={{ color: selected ? ACCENT : '#8b929c' }} />}
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-mono truncate" style={{ color: selected ? '#f2f3f5' : '#c6cace' }}>{item.label}</span>
                        {item.hint && <span className="block text-[11px] font-mono truncate" style={{ color: '#565c66' }}>{item.hint}</span>}
                      </span>
                      {selected && <CornerDownLeft size={14} style={{ color: '#6f7680' }} />}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="flex items-center gap-4 px-5 py-3 border-t font-mono text-[10px]" style={{ borderColor: BORDER, color: '#565c66' }}>
              <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
              <span className="flex items-center gap-1"><Kbd>↵</Kbd> select</span>
              <span className="ml-auto flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd> toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Hero ---------- */

const Hero = ({ p, onOpen, sectionItems }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden" style={GRID_BG}>
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139,143,248,0.08), transparent 55%)' }} />
    <motion.div className="relative z-10 text-center max-w-3xl" initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} className="font-mono text-xs mb-6 flex items-center justify-center gap-2" style={{ color: '#6f7680' }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5bd679' }} />
        {p.location || 'remote'} · available
      </motion.div>
      <motion.h1 variants={fadeUp} className="font-mono text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ color: '#f2f3f5' }}>
        {p.name}
      </motion.h1>
      <motion.p variants={fadeUp} className="font-mono text-base md:text-lg mb-10" style={{ color: '#8b929c' }}>
        {p.title || 'Builds things for the web'}
      </motion.p>

      <motion.button variants={fadeUp} onClick={onOpen}
        className="group mx-auto w-full max-w-md flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-colors hover:bg-white/[0.04]"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}>
        <Search size={16} style={{ color: '#6f7680' }} />
        <span className="flex-1 font-mono text-sm" style={{ color: '#565c66' }}>Type a command or search…</span>
        <span className="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </motion.button>

      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mt-8">
        {sectionItems.map((s) => (
          <a key={s.target} href={`#${s.target}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono text-xs transition-colors hover:bg-white/[0.05]"
            style={{ borderColor: BORDER, color: '#9aa1ab' }}>
            {s.Icon && <s.Icon size={12} style={{ color: ACCENT }} />} {s.label}
          </a>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

/* ---------- About ---------- */

const About = ({ p, stats }) => {
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  if (!p.bio && !p.avatar && !hasStats) return null;
  const monogram = initialsOf(p.name);
  const readouts = [
    { label: 'years_experience', value: stats?.yearsExperience },
    { label: 'projects_shipped', value: stats?.projectsCompleted },
    { label: 'happy_clients', value: stats?.happyClients },
  ].filter((s) => s.value);

  return (
    <section id="about" className="py-20 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionHeader Icon={User} cmd="about" title="whoami" />
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-2xl border p-7 grid md:grid-cols-[auto,1fr] gap-8 items-center"
            style={{ backgroundColor: PANEL, borderColor: BORDER }}>
            {p.avatar
              ? <img src={p.avatar} alt={p.name} className="w-40 h-40 rounded-xl object-cover border" style={{ borderColor: BORDER }} />
              : <div className="w-40 h-40 rounded-xl border flex items-center justify-center font-mono text-4xl font-bold"
                  style={{ borderColor: BORDER, backgroundColor: '#1d2026', color: ACCENT }}>
                  {monogram || <User size={44} style={{ color: '#565c66' }} />}
                </div>}
            <div>
              {p.bio && <p className="font-mono text-sm leading-relaxed mb-5" style={{ color: '#c6cace' }}>{p.bio}</p>}
              {readouts.length > 0 && (
                <div className="grid sm:grid-cols-3 gap-3">
                  {readouts.map((s, i) => (
                    <div key={i} className="rounded-lg border px-3 py-2.5" style={{ borderColor: BORDER, backgroundColor: '#1d2026' }}>
                      <div className="font-mono text-lg font-bold" style={{ color: ACCENT }}>{s.value}</div>
                      <div className="font-mono text-[9px] tracking-wider" style={{ color: '#565c66' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Skills ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  const segments = (level) => Math.round(((Number(level) || 85) / 100) * 10);
  return (
    <section id="skills" className="py-20 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionHeader Icon={Wrench} cmd="skills" title="installed_modules" />
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: PANEL, borderColor: BORDER }}>
            {skills.map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <span className="font-mono text-[10px] w-6" style={{ color: '#565c66' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-mono truncate" style={{ color: '#e8eaee' }}>{s.name}</span>
                  {s.category && <span className="block font-mono text-[10px]" style={{ color: '#565c66' }}>#{s.category.toLowerCase().replace(/\s+/g, '-')}</span>}
                </span>
                <span className="hidden sm:flex gap-[3px]">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <motion.span key={j} className="w-2.5 h-4 rounded-[2px]"
                      style={{ backgroundColor: j < segments(s.level) ? ACCENT : '#262a31' }}
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.04 + j * 0.03 }} />
                  ))}
                </span>
                <span className="font-mono text-xs w-9 text-right" style={{ color: '#8b929c' }}>{s.level || 85}%</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Projects ---------- */

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="py-20 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionHeader Icon={Layers} cmd="projects" title="recent_builds" />
          </motion.div>
          <div className="space-y-3">
            {projects.map((project, i) => {
              const tech = Array.isArray(project.techStack) ? project.techStack : [];
              const url = project.liveUrl && project.liveUrl !== '#' ? project.liveUrl : (project.githubUrl && project.githubUrl !== '#' ? project.githubUrl : null);
              const Row = (
                <motion.div variants={fadeUp} whileHover={{ x: 6 }}
                  className="rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors hover:bg-white/[0.03]"
                  style={{ backgroundColor: PANEL, borderColor: BORDER }}>
                  {project.image
                    ? <img src={project.image} alt={project.title} className="w-full sm:w-28 h-32 sm:h-20 rounded-lg object-cover border shrink-0" style={{ borderColor: BORDER }} />
                    : <div className="w-full sm:w-28 h-32 sm:h-20 rounded-lg border flex items-center justify-center shrink-0" style={{ borderColor: BORDER, backgroundColor: '#1d2026' }}>
                        <FolderGit2 size={22} style={{ color: '#565c66' }} />
                      </div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-base font-bold truncate" style={{ color: '#f2f3f5' }}>{project.title}</h3>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border shrink-0" style={{ borderColor: BORDER, color: '#565c66' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    {project.description && <p className="font-mono text-xs mt-1.5 line-clamp-2" style={{ color: '#8b929c' }}>{project.description}</p>}
                    {tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {tech.map((t, j) => (
                          <span key={j} className="font-mono text-[10px] px-2 py-0.5 rounded-md" style={{ backgroundColor: '#1d2026', color: '#9aa1ab' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:flex items-center gap-1 shrink-0">
                    {url && <ExternalLink size={13} style={{ color: '#565c66' }} />}
                    <CornerDownLeft size={13} style={{ color: '#565c66' }} />
                  </span>
                </motion.div>
              );
              return url
                ? <a key={i} href={url} target="_blank" rel="noreferrer" className="block">{Row}</a>
                : <div key={i}>{Row}</div>;
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Experience ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="py-20 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionHeader Icon={Clock} cmd="experience" title="run_history" />
          </motion.div>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ x: 6 }}
                className="rounded-xl border p-5 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-5"
                style={{ backgroundColor: PANEL, borderColor: BORDER }}>
                <span className="font-mono text-[11px] md:w-36 shrink-0" style={{ color: ACCENT }}>{exp.period || 'period'}</span>
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold" style={{ color: '#f2f3f5' }}>{exp.role}</h3>
                  <p className="font-mono text-xs mt-0.5" style={{ color: '#8b929c' }}>@ {exp.company}</p>
                  {exp.description && <p className="font-mono text-xs mt-2 leading-relaxed" style={{ color: '#6f7680' }}>{exp.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Testimonials ---------- */

const Testimonials = ({ testimonials }) => {
  if (!testimonials?.length) return null;
  return (
    <section id="testimonials" className="py-20 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionHeader Icon={MessageSquare} cmd="testimonials" title="user_feedback" />
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl border p-5" style={{ backgroundColor: PANEL, borderColor: BORDER }}>
                <p className="font-mono text-xs leading-relaxed mb-4" style={{ color: '#c6cace' }}>
                  <span style={{ color: ACCENT }}>"</span>{t.text}<span style={{ color: ACCENT }}>"</span>
                </p>
                <div className="flex items-center gap-3">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover border" style={{ borderColor: BORDER }} />
                    : <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold"
                        style={{ backgroundColor: '#1d2026', color: ACCENT }}>
                        {initialsOf(t.name) || '?'}
                      </div>}
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold truncate" style={{ color: '#e8eaee' }}>{t.name}</div>
                    <div className="font-mono text-[10px] truncate" style={{ color: '#565c66' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Contact ---------- */

const Contact = ({ p, socials }) => {
  const links = [
    { url: socials?.github, label: 'GitHub', Icon: Github },
    { url: socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: socials?.twitter, label: 'Twitter', Icon: Twitter },
  ].filter((l) => l.url);
  const email = p.email || socials?.email;

  return (
    <section id="contact" className="py-20 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionHeader Icon={Mail} cmd="contact" title="send_message" />
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-2xl border p-7" style={{ backgroundColor: PANEL, borderColor: BORDER }}>
            <p className="font-mono text-sm mb-6" style={{ color: '#8b929c' }}>
              Open a channel — every command below executes on <span style={{ color: ACCENT }}>Enter</span>.
            </p>
            <div className="space-y-2">
              {email && (
                <a href={`mailto:${email}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-sm transition-colors hover:bg-white/[0.04]"
                  style={{ borderColor: BORDER, color: '#e8eaee' }}>
                  <Mail size={15} style={{ color: ACCENT }} />
                  <span className="flex-1">email: {email}</span>
                  <CornerDownLeft size={13} style={{ color: '#565c66' }} />
                </a>
              )}
              {p.phone && (
                <a href={`tel:${p.phone}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-sm transition-colors hover:bg-white/[0.04]"
                  style={{ borderColor: BORDER, color: '#e8eaee' }}>
                  <span className="flex-1">tel: {p.phone}</span>
                  <CornerDownLeft size={13} style={{ color: '#565c66' }} />
                </a>
              )}
              {links.map(({ url, label, Icon }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-sm transition-colors hover:bg-white/[0.04]"
                  style={{ borderColor: BORDER, color: '#e8eaee' }}>
                  <Icon size={15} style={{ color: ACCENT }} />
                  <span className="flex-1">open: {label.toLowerCase()}</span>
                  <ExternalLink size={13} style={{ color: '#565c66' }} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Main ---------- */

export default function CommandPalette() {
  const { portfolioData } = usePortfolio();
  const d = portfolioData || {};
  const p = d.personal || {};
  const socials = d.socials || {};
  const skills = Array.isArray(d.skills) ? d.skills : [];
  const projects = Array.isArray(d.projects) ? d.projects : [];
  const experience = Array.isArray(d.experience) ? d.experience : [];
  const testimonials = Array.isArray(d.testimonials) ? d.testimonials : [];
  const stats = d.stats || {};
  const year = new Date().getFullYear();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const sectionItems = useMemo(() => {
    const items = [{ group: 'Sections', label: 'Home', hint: 'Go to top', target: 'hero', Icon: Home, type: 'section', keywords: 'top start home hero intro' }];
    if (p.bio || p.avatar) items.push({ group: 'Sections', label: 'About', hint: 'whoami', target: 'about', Icon: User, type: 'section', keywords: 'bio whoami profile about' });
    if (skills.length) items.push({ group: 'Sections', label: 'Skills', hint: 'installed_modules', target: 'skills', Icon: Wrench, type: 'section', keywords: 'stack tools tech modules skills' });
    if (projects.length) items.push({ group: 'Sections', label: 'Projects', hint: 'recent_builds', target: 'projects', Icon: Layers, type: 'section', keywords: 'work builds portfolio projects' });
    if (experience.length) items.push({ group: 'Sections', label: 'Experience', hint: 'run_history', target: 'experience', Icon: Clock, type: 'section', keywords: 'work history jobs career experience' });
    if (testimonials.length) items.push({ group: 'Sections', label: 'Testimonials', hint: 'user_feedback', target: 'testimonials', Icon: MessageSquare, type: 'section', keywords: 'reviews quotes feedback testimonials' });
    items.push({ group: 'Sections', label: 'Contact', hint: 'send_message', target: 'contact', Icon: Mail, type: 'section', keywords: 'email get in touch hello contact' });
    return items;
  }, [p.bio, p.avatar, skills.length, projects.length, experience.length, testimonials.length]);

  const paletteItems = useMemo(() => {
    const items = [...sectionItems];
    projects.forEach((project, i) => {
      const tech = Array.isArray(project.techStack) ? project.techStack : [];
      const url = project.liveUrl && project.liveUrl !== '#' ? project.liveUrl : (project.githubUrl && project.githubUrl !== '#' ? project.githubUrl : null);
      if (!url) return;
      items.push({
        group: 'Projects', type: 'link', url,
        label: `Open: ${project.title || `Project ${i + 1}`}`,
        hint: tech.slice(0, 3).join(' · '),
        Icon: FolderGit2,
        keywords: `${project.title || ''} ${tech.join(' ')} ${project.description || ''}`,
      });
    });
    const email = p.email || socials.email;
    if (email) items.push({ group: 'Links', type: 'mail', url: `mailto:${email}`, label: `Email: ${email}`, hint: 'opens mail client', Icon: Mail, keywords: 'mail write message contact' });
    if (socials.github) items.push({ group: 'Links', type: 'link', url: socials.github, label: 'Open: GitHub', hint: 'social profile', Icon: Github, keywords: 'code repos github social' });
    if (socials.linkedin) items.push({ group: 'Links', type: 'link', url: socials.linkedin, label: 'Open: LinkedIn', hint: 'social profile', Icon: Linkedin, keywords: 'career network linkedin social' });
    if (socials.twitter) items.push({ group: 'Links', type: 'link', url: socials.twitter, label: 'Open: Twitter', hint: 'social profile', Icon: Twitter, keywords: 'tweets twitter x social' });
    return items;
  }, [sectionItems, projects, p.email, socials]);

  const navSectionItems = sectionItems.slice(0, 6);

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: BG }}>
      <nav className="fixed top-0 inset-x-0 z-50 border-b" style={{ backgroundColor: 'rgba(15,17,20,0.9)', backdropFilter: 'blur(10px)', borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <a href="#hero" className="font-mono text-sm font-bold" style={{ color: '#f2f3f5' }}>
            <span style={{ color: ACCENT }}>~</span>/{(p.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}
          </a>
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors hover:bg-white/[0.05]"
            style={{ borderColor: BORDER, color: '#9aa1ab' }}>
            <Command size={12} /> menu <Kbd>⌘K</Kbd>
          </button>
        </div>
      </nav>

      <Hero p={p} onOpen={() => setOpen(true)} sectionItems={navSectionItems} />
      <About p={p} stats={stats} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Testimonials testimonials={testimonials} />
      <Contact p={p} socials={socials} />

      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: BORDER, backgroundColor: BG }}>
        <p className="font-mono text-[10px]" style={{ color: '#565c66' }}>
          © {year} {p.name} · press <Kbd>⌘</Kbd> <Kbd>K</Kbd> anywhere
        </p>
      </footer>

      <PaletteOverlay open={open} onClose={() => setOpen(false)} items={paletteItems} />
    </div>
  );
}
