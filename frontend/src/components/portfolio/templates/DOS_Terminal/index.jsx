import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, Phone } from 'lucide-react';

/**
 * DOS Terminal Portfolio Template
 * Category: Retro / Nostalgic
 * Description: MS-DOS terminal with green monospace text on pure black, command-line-style navigation. Type dir to list projects, cat about.txt to read bio.
 */

const GREEN = '#33ff33';
const GREEN_DIM = 'rgba(51,255,51,0.55)';
const GREEN_FAINT = 'rgba(51,255,51,0.28)';
const AMBER = '#ffb000';
const ERR = '#ff6b6b';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((w) => w[0].toUpperCase()).join('')) || 'A';
};

const bar10 = (lvl) => {
  const filled = Math.max(1, Math.min(10, Math.round((Number(lvl) || 80) / 10)));
  return '[' + '#'.repeat(filled) + '.'.repeat(10 - filled) + ']';
};

// Double-ruled DOS panel: header strip + inset content, like Norton Commander panes
const DosPanel = ({ id, title, children, className = '' }) => (
  <section id={id} className={`relative max-w-5xl mx-auto px-4 sm:px-6 py-10 ${className}`}>
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}
      className="relative border-2 shadow-[0_0_24px_rgba(51,255,51,0.12)]"
      style={{ borderColor: 'rgba(51,255,51,0.55)', background: 'rgba(0,20,0,0.55)' }}>
      <div className="flex items-center justify-between px-4 py-1.5 border-b-2"
        style={{ borderColor: 'rgba(51,255,51,0.55)', background: 'rgba(51,255,51,0.10)' }}>
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest" style={{ color: AMBER }}>
          {title}
        </span>
        <span className="font-mono text-[10px]" style={{ color: GREEN_DIM }}>&#9633;</span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </motion.div>
  </section>
);

const PanelTitle = ({ children }) => (
  <motion.h2 variants={fadeUp} className="font-mono text-xl sm:text-2xl font-bold tracking-widest mb-5"
    style={{ color: GREEN, textShadow: '0 0 10px rgba(51,255,51,0.5)' }}>
    {children}
  </motion.h2>
);

/* ---------- boot sequence ---------- */

const bootLines = (name) => ([
  { text: 'CareerPilot BIOS v2.6  ...  Memory Check: 640K OK', kind: 'sys' },
  { text: 'Loading PORTFOLIO.SYS ................ done', kind: 'sys' },
  { text: 'VGA phosphor display detected (green mode)', kind: 'sys' },
  { text: `Hello, world. This is ${name}.`, kind: 'ok' },
  { text: 'Type HELP and press ENTER for available commands.', kind: 'hi' },
]);

export default function DOSTerminal() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'PORTFOLIO';
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const outRef = useRef(null);

  // Boot sequence: progressive system messages on first mount
  useEffect(() => {
    let cancelled = false;
    const seq = bootLines(name);
    const timers = seq.map((line, i) => setTimeout(() => {
      if (cancelled) return;
      setLines((prev) => [...prev, line]);
    }, 260 * (i + 1)));
    return () => { cancelled = true; timers.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the console pinned to the latest output
  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const files = useMemo(() => {
    const list = [];
    if (data.personal?.bio || data.personal?.avatar) list.push({ name: 'ABOUT.TXT', kind: 'doc' });
    if (data.skills?.length > 0) list.push({ name: 'SKILLS.DAT', kind: 'doc' });
    data.projects?.slice(0, 12).forEach((p, i) => {
      const slug = (p.title || `PROJECT${i + 1}`).replace(/[^A-Za-z0-9]+/g, '_').toUpperCase().slice(0, 14);
      list.push({ name: `${slug}.EXE`, kind: 'exe', index: i });
    });
    if (data.experience?.length > 0) list.push({ name: 'WORK.HIST', kind: 'doc' });
    if (data.testimonials?.length > 0) list.push({ name: 'REFERENCES.TXT', kind: 'doc' });
    list.push({ name: 'CONTACT.TXT', kind: 'doc' });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.projects, data.skills, data.experience, data.testimonials, data.personal]);

  const contactRows = useMemo(() => {
    const rows = [];
    const email = data.personal?.email || data.socials?.email;
    if (email) rows.push({ label: 'E-MAIL', value: email, href: `mailto:${email}` });
    if (data.personal?.phone) rows.push({ label: 'PHONE ', value: data.personal.phone, href: `tel:${data.personal.phone}` });
    if (data.personal?.location) rows.push({ label: 'CITY  ', value: data.personal.location });
    if (data.socials?.github) rows.push({ label: 'GITHUB', value: data.socials.github, href: data.socials.github });
    if (data.socials?.linkedin) rows.push({ label: 'LINKED', value: data.socials.linkedin, href: data.socials.linkedin });
    if (data.socials?.twitter) rows.push({ label: 'TWEET ', value: data.socials.twitter, href: data.socials.twitter });
    return rows;
  }, [data.personal, data.socials]);

  const runCommand = (raw) => {
    const cmd = raw.trim();
    const lower = cmd.toLowerCase();
    const out = [{ text: `C:\\PORTFOLIO> ${cmd}`, kind: 'prompt' }];

    if (!cmd) {
      setLines((prev) => [...prev, ...out]);
      return;
    }
    if (lower === 'clear' || lower === 'cls') {
      setLines([]);
      return;
    }
    if (lower === 'help' || lower === '?') {
      out.push({ text: 'AVAILABLE COMMANDS:', kind: 'hi' });
      out.push({ text: '  HELP            Shows this command list', kind: 'ok' });
      out.push({ text: '  DIR             Lists files in the portfolio directory', kind: 'ok' });
      out.push({ text: '  CAT ABOUT.TXT   Displays the biography document', kind: 'ok' });
      out.push({ text: '  SKILLS          Lists installed skill modules', kind: 'ok' });
      out.push({ text: '  CONTACT         Displays contact information', kind: 'ok' });
      out.push({ text: '  VER             Shows the system version', kind: 'ok' });
      out.push({ text: '  CLEAR           Clears the screen', kind: 'ok' });
    } else if (lower === 'dir' || lower === 'ls') {
      out.push({ text: ' Volume in drive C is PORTFOLIO', kind: 'sys' });
      out.push({ text: ' Directory of C:\\PORTFOLIO', kind: 'sys' });
      out.push({ text: '', kind: 'sys' });
      if (files.length === 0) {
        out.push({ text: ' No files found. Directory is empty.', kind: 'err' });
      } else {
        files.forEach((f, i) => {
          const size = f.kind === 'exe' ? String(8192 + ((i * 4093) % 51200)) : String(1024 + ((i * 777) % 9999));
          out.push({ text: ` ${f.name.padEnd(20)} ${size.padStart(7)} bytes  05-01-2026  09:4${i % 10}`, kind: f.kind === 'exe' ? 'ok' : 'sys', file: f });
        });
      }
      out.push({ text: '', kind: 'sys' });
      out.push({ text: `        ${files.length} file(s)   640K free space`, kind: 'sys' });
    } else if (lower.startsWith('cat ') || lower.startsWith('type ') || lower.startsWith('open ')) {
      const target = lower.replace(/^(cat|type|open)\s+/, '').replace(/^\.\\/, '').trim();
      if (target === 'about.txt' || target === 'about') {
        out.push({ text: data.personal?.bio || 'This document is still being written. Check back soon.', kind: 'ok' });
      } else if (target === 'skills.dat' || target === 'skills') {
        if (data.skills?.length > 0) {
          data.skills.slice(0, 10).forEach((s) => {
            out.push({ text: ` ${bar10(s.level)} ${(s.name || '').slice(0, 24).padEnd(24)} ${Number(s.level) || 85}%`, kind: 'ok' });
          });
        } else {
          out.push({ text: 'SKILLS.DAT is empty.', kind: 'err' });
        }
      } else if (target === 'contact.txt' || target === 'contact') {
        if (contactRows.length === 0) {
          out.push({ text: 'CONTACT.TXT is empty.', kind: 'err' });
        } else {
          contactRows.forEach((r) => out.push({ text: ` ${r.label} : ${r.value}`, kind: 'ok', href: r.href }));
        }
      } else if (target === 'references.txt' || target === 'work.hist') {
        if (data.testimonials?.length > 0) {
          out.push({ text: ` "${data.testimonials[0].text || ''}"`, kind: 'ok' });
          out.push({ text: `   -- ${data.testimonials[0].name || 'Anonymous'}`, kind: 'hi' });
        } else if (data.experience?.length > 0) {
          data.experience.forEach((e) => out.push({ text: ` ${(e.period || '').padEnd(14)} ${e.role || ''} @ ${e.company || ''}`, kind: 'ok' }));
        } else {
          out.push({ text: 'File not found or empty.', kind: 'err' });
        }
      } else {
        out.push({ text: `File "${cmd.replace(/^\S+\s+/, '')}" not found. Try DIR to list files.`, kind: 'err' });
      }
    } else if (lower === 'skills') {
      if (data.skills?.length > 0) {
        out.push({ text: 'INSTALLED SKILL MODULES:', kind: 'hi' });
        data.skills.slice(0, 12).forEach((s) => {
          out.push({ text: ` ${bar10(s.level)} ${(s.name || '').slice(0, 24).padEnd(24)} ${Number(s.level) || 85}%`, kind: 'ok' });
        });
      } else {
        out.push({ text: 'No skill modules installed yet.', kind: 'err' });
      }
    } else if (lower === 'contact') {
      if (contactRows.length === 0) {
        out.push({ text: 'No contact records found.', kind: 'err' });
      } else {
        out.push({ text: 'CONTACT INFORMATION:', kind: 'hi' });
        contactRows.forEach((r) => out.push({ text: ` ${r.label} : ${r.value}`, kind: 'ok', href: r.href }));
      }
    } else if (lower === 'ver') {
      out.push({ text: 'CareerPilot DOS Version 2.6 (Green Phosphor Edition)', kind: 'ok' });
    } else {
      out.push({ text: 'Bad command or file name', kind: 'err' });
    }
    setLines((prev) => [...prev, ...out]);
  };

  const chips = [
    { label: 'help', cmd: 'help' },
    { label: 'dir', cmd: 'dir' },
    { label: 'cat about.txt', cmd: 'cat about.txt' },
    { label: 'skills', cmd: 'skills' },
    { label: 'contact', cmd: 'contact' },
    { label: 'clear', cmd: 'clear' },
  ];

  const navItems = [
    { label: 'ABOUT', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'SKILLS', href: '#skills', show: data.skills?.length > 0 },
    { label: 'PROJECTS', href: '#projects', show: data.projects?.length > 0 },
    { label: 'WORK', href: '#experience', show: data.experience?.length > 0 },
    { label: 'REFERENCES', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'CONTACT', href: '#contact', show: true },
  ].filter((item) => item.show);

  const lineColor = (kind) => {
    switch (kind) {
      case 'prompt': return '#e8ffe8';
      case 'hi': return AMBER;
      case 'err': return ERR;
      case 'sys': return GREEN_DIM;
      default: return GREEN;
    }
  };

  return (
    <div className="font-mono antialiased overflow-x-hidden text-base" style={{ background: '#000', color: GREEN }}>
      {/* CRT overlay: scanlines + travelling refresh band + vignette */}
      <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden
        style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px, transparent 1px, transparent 3px)' }} />
      <motion.div aria-hidden className="fixed inset-x-0 z-40 pointer-events-none h-24"
        animate={{ top: ['-10%', '110%'] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        style={{ background: 'linear-gradient(180deg, transparent, rgba(51,255,51,0.05), transparent)' }} />
      <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden
        style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.85), inset 0 0 60px rgba(51,255,51,0.05)' }} />

      {/* Sticky command bar */}
      <nav className="sticky top-0 z-30 border-b-2"
        style={{ borderColor: 'rgba(51,255,51,0.5)', background: 'rgba(0,0,0,0.94)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="font-bold text-xs sm:text-sm whitespace-nowrap" style={{ color: AMBER }}>C:\&gt;</span>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="whitespace-nowrap text-[11px] sm:text-xs px-2 py-1 border transition-colors hover:bg-[#33ff33] hover:text-black"
              style={{ borderColor: 'rgba(51,255,51,0.45)', color: GREEN }}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO — the terminal itself */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24"
        style={{ background: 'radial-gradient(700px 380px at 50% 30%, rgba(51,255,51,0.07), transparent 70%), #000' }}>
        <div className="w-full max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            {/* window title bar */}
            <div className="flex items-center justify-between border-2 border-b-0 px-4 py-2"
              style={{ borderColor: 'rgba(51,255,51,0.6)', background: 'rgba(51,255,51,0.10)' }}>
              <span className="text-xs sm:text-sm font-bold tracking-widest truncate" style={{ color: AMBER }}>
                C:\PORTFOLIO\{name.replace(/\s+/g, '_').toUpperCase().slice(0, 18)}.EXE
              </span>
              <span className="text-xs whitespace-nowrap" style={{ color: GREEN_DIM }}>&#95; &#9633; X</span>
            </div>

            {/* console */}
            <div className="border-2" style={{ borderColor: 'rgba(51,255,51,0.6)', background: 'rgba(0,6,0,0.9)', boxShadow: '0 0 40px rgba(51,255,51,0.15)' }}>
              <div ref={outRef} className="h-64 sm:h-72 overflow-y-auto px-4 pt-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                {lines.map((line, i) => (
                  line.href ? (
                    <a key={i} href={line.href} target="_blank" rel="noreferrer" className="block underline underline-offset-2 break-all"
                      style={{ color: GREEN }}>{line.text}</a>
                  ) : line.file && line.file.kind === 'exe' && data.projects?.[line.file.index] ? (
                    <a key={i} href="#projects" className="block break-words hover:bg-[#33ff33] hover:text-black transition-colors"
                      style={{ color: lineColor(line.kind) }}>{line.text}</a>
                  ) : (
                    <div key={i} className="break-words" style={{ color: lineColor(line.kind) }}>{line.text || '\u00A0'}</div>
                  )
                ))}
              </div>

              {/* prompt row with blinking cursor */}
              <div className="flex items-center gap-2 px-4 py-3 border-t text-xs sm:text-sm"
                style={{ borderColor: 'rgba(51,255,51,0.35)' }}>
                <span className="font-bold whitespace-nowrap" style={{ color: '#e8ffe8' }}>C:\PORTFOLIO&gt;</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { runCommand(input); setInput(''); }
                  }}
                  aria-label="Terminal command input"
                  className="flex-1 min-w-0 bg-transparent outline-none border-none"
                  style={{ color: GREEN, caretColor: GREEN }}
                  placeholder="type a command..."
                />
                <motion.span aria-hidden className="inline-block w-2.5 h-4 sm:h-5 shrink-0"
                  animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                  style={{ background: GREEN, boxShadow: '0 0 8px rgba(51,255,51,0.8)' }} />
              </div>
            </div>

            {/* clickable fallback command chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {chips.map((chip) => (
                <button key={chip.cmd} onClick={() => runCommand(chip.cmd)}
                  className="text-[11px] sm:text-xs px-3 py-1.5 border transition-colors hover:bg-[#33ff33] hover:text-black"
                  style={{ borderColor: 'rgba(51,255,51,0.45)', color: GREEN, background: 'rgba(0,20,0,0.5)' }}>
                  {chip.label}
                </button>
              ))}
            </div>

            {/* identity block */}
            <div className="mt-10 text-center">
              <motion.h1 initial="hidden" animate="visible" variants={fadeUp}
                className="text-4xl sm:text-6xl font-bold tracking-widest break-words"
                style={{ color: GREEN, textShadow: '0 0 18px rgba(51,255,51,0.65), 3px 3px 0 rgba(0,40,0,0.9)' }}>
                {name}
              </motion.h1>
              {data.personal?.title && (
                <motion.p initial="hidden" animate="visible" variants={fadeUp}
                  className="mt-3 text-sm sm:text-lg tracking-[0.3em] uppercase" style={{ color: AMBER }}>
                  {data.personal.title}
                </motion.p>
              )}
              {data.personal?.tagline && (
                <motion.p initial="hidden" animate="visible" variants={fadeUp}
                  className="mt-3 text-xs sm:text-sm max-w-xl mx-auto" style={{ color: GREEN_DIM }}>
                  {data.personal.tagline}
                </motion.p>
              )}
              {data.personal?.location && (
                <motion.p initial="hidden" animate="visible" variants={fadeUp}
                  className="mt-5 inline-flex items-center gap-2 text-xs px-3 py-1.5 border"
                  style={{ borderColor: 'rgba(51,255,51,0.45)', color: GREEN }}>
                  <MapPin size={13} /> {data.personal.location}
                </motion.p>
              )}
              <motion.div initial="hidden" animate="visible" variants={stagger}
                className="mt-8 flex flex-wrap justify-center gap-3">
                <motion.a variants={fadeUp} href="#about"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold border-2 transition-colors hover:bg-[#33ff33] hover:text-black"
                  style={{ borderColor: GREEN, color: GREEN }}>
                  TYPE ABOUT.TXT
                </motion.a>
                <motion.a variants={fadeUp} href="#projects"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold border-2 transition-colors hover:bg-[#ffb000] hover:text-black"
                  style={{ borderColor: AMBER, color: AMBER }}>
                  RUN PROJECTS
                </motion.a>
                <motion.a variants={fadeUp} href="#contact"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold border-2 transition-colors hover:bg-[#33ff33] hover:text-black"
                  style={{ borderColor: 'rgba(51,255,51,0.45)', color: GREEN_DIM }}>
                  CONTACT.TXT
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT.TXT */}
      {(data.personal?.bio || data.personal?.avatar) && (
        <DosPanel id="about" title="ABOUT.TXT">
          <PanelTitle>&#9654; About</PanelTitle>
          <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-start">
            {data.personal?.avatar ? (
              <div className="relative mx-auto border-2 p-1.5" style={{ borderColor: 'rgba(51,255,51,0.6)' }}>
                <img src={data.personal.avatar} alt={name}
                  className="w-40 h-44 object-cover"
                  style={{ filter: 'grayscale(1) brightness(1.1) sepia(1) hue-rotate(60deg) saturate(2.2)' }} />
                <div className="absolute inset-1.5 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 3px)' }} />
                <p className="text-center text-[10px] mt-1.5" style={{ color: GREEN_DIM }}>PHOTO.BMP</p>
              </div>
            ) : (
              <div className="mx-auto border-2 p-1.5" style={{ borderColor: 'rgba(51,255,51,0.6)' }}>
                <div className="w-40 h-44 flex flex-col items-center justify-center gap-2"
                  style={{ background: 'repeating-linear-gradient(45deg, rgba(51,255,51,0.08) 0 6px, rgba(0,20,0,0.4) 6px 12px)' }}>
                  <span className="text-4xl font-bold" style={{ color: GREEN, textShadow: '0 0 12px rgba(51,255,51,0.6)' }}>
                    {initialsOf(name)}
                  </span>
                  <span className="text-[10px]" style={{ color: GREEN_DIM }}>NO PHOTO.BMP</span>
                </div>
              </div>
            )}
            <motion.div variants={fadeUp}>
              {data.personal?.bio && (
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: GREEN }}>
                  {data.personal.bio}
                </p>
              )}
              {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                <div className={`grid grid-cols-3 gap-3 ${data.personal?.bio ? 'mt-6' : ''}`}>
                  {[
                    { label: 'YEARS', value: data.stats.yearsExperience },
                    { label: 'PROJECTS', value: data.stats.projectsCompleted },
                    { label: 'CLIENTS', value: data.stats.happyClients },
                  ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                    <div key={i} className="border p-3 text-center" style={{ borderColor: 'rgba(51,255,51,0.4)' }}>
                      <div className="text-2xl font-bold" style={{ color: AMBER }}>{s.value}</div>
                      <div className="text-[10px] tracking-widest" style={{ color: GREEN_DIM }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </DosPanel>
      )}

      {/* SKILLS.DAT */}
      {data.skills?.length > 0 && (
        <DosPanel id="skills" title="SKILLS.DAT">
          <PanelTitle>&#9654; Installed Modules</PanelTitle>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {data.skills.map((skill, i) => (
              <motion.div key={i} variants={fadeUp} className="text-xs sm:text-sm">
                <div className="flex justify-between mb-1.5">
                  <span style={{ color: GREEN }}>{skill.name || 'MODULE'}</span>
                  <span style={{ color: AMBER }}>{Number(skill.level) || 85}%</span>
                </div>
                <div className="h-3 border relative overflow-hidden" style={{ borderColor: 'rgba(51,255,51,0.5)' }}>
                  <motion.div className="h-full"
                    initial={{ width: 0 }} whileInView={{ width: `${Number(skill.level) || 85}%` }}
                    viewport={{ once: true }} transition={{ duration: 0.9, delay: (i % 4) * 0.1 }}
                    style={{ background: 'linear-gradient(90deg, rgba(51,255,51,0.35), #33ff33)', boxShadow: '0 0 10px rgba(51,255,51,0.5)' }} />
                </div>
                <div className="mt-1" style={{ color: GREEN_FAINT }}>{bar10(skill.level)} {skill.category ? `// ${skill.category}` : ''}</div>
              </motion.div>
            ))}
          </div>
        </DosPanel>
      )}

      {/* PROJECTS DIR */}
      {data.projects?.length > 0 && (
        <DosPanel id="projects" title="PROJECTS DIRECTORY">
          <PanelTitle>&#9654; Executables</PanelTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {data.projects.map((project, i) => (
              <motion.article key={i} variants={fadeUp}
                className="border-2 transition-transform hover:-translate-y-1"
                style={{ borderColor: 'rgba(51,255,51,0.5)', background: 'rgba(0,14,0,0.7)' }}>
                <div className="flex items-center gap-2 px-3 py-1.5 border-b-2"
                  style={{ borderColor: 'rgba(51,255,51,0.5)', background: 'rgba(51,255,51,0.10)' }}>
                  <span className="text-xs font-bold shrink-0" style={{ color: AMBER }}>.EXE</span>
                  <span className="text-xs truncate" style={{ color: GREEN }}>
                    {(project.title || `PROJECT${i + 1}`).toUpperCase().replace(/\s+/g, '_')}
                  </span>
                </div>
                {project.image && (
                  <div className="relative">
                    <img src={project.image} alt={project.title} className="w-full h-36 object-cover"
                      style={{ filter: 'grayscale(0.6) sepia(0.6) hue-rotate(60deg) saturate(1.6) brightness(0.95)' }} />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)' }} />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-base font-bold mb-2" style={{ color: '#e8ffe8' }}>{project.title}</h3>
                  {project.description && (
                    <p className="text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3" style={{ color: GREEN_DIM }}>
                      {project.description}
                    </p>
                  )}
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.techStack.slice(0, 8).map((tech, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 border" style={{ borderColor: 'rgba(51,255,51,0.4)', color: GREEN }}>
                          [{String(tech).toUpperCase()}]
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4 text-xs">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-black hover:bg-[#33ff33] transition-colors px-1"
                        style={{ color: GREEN }}>
                        <ExternalLink size={12} /> RUN
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-black hover:bg-[#33ff33] transition-colors px-1"
                        style={{ color: GREEN_DIM }}>
                        <Github size={12} /> SOURCE
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </DosPanel>
      )}

      {/* WORK.HIST */}
      {data.experience?.length > 0 && (
        <DosPanel id="experience" title="WORK.HIST">
          <PanelTitle>&#9654; Work History</PanelTitle>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="border-l-2 pl-4 sm:pl-5"
                style={{ borderColor: 'rgba(51,255,51,0.55)' }}>
                {exp.period && (
                  <span className="inline-block text-[10px] px-2 py-0.5 border mb-2 tracking-widest"
                    style={{ borderColor: 'rgba(255,176,0,0.5)', color: AMBER }}>
                    {exp.period}
                  </span>
                )}
                <h3 className="text-base sm:text-lg font-bold" style={{ color: GREEN }}>{exp.role || 'ROLE'}</h3>
                {exp.company && (
                  <p className="text-xs sm:text-sm mb-1.5" style={{ color: AMBER }}>@ {exp.company}</p>
                )}
                {exp.description && (
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: GREEN_DIM }}>
                    <span style={{ color: GREEN }}>&gt; </span>{exp.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </DosPanel>
      )}

      {/* REFERENCES.TXT */}
      {data.testimonials?.length > 0 && (
        <DosPanel id="testimonials" title="REFERENCES.TXT">
          <PanelTitle>&#9654; References</PanelTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {data.testimonials.map((t, i) => (
              <motion.figure key={i} variants={fadeUp} className="border-2 p-4"
                style={{ borderColor: 'rgba(51,255,51,0.5)', background: 'rgba(0,14,0,0.7)' }}>
                <blockquote className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: GREEN }}>
                  <span style={{ color: AMBER }}>&gt; </span>&ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-2.5">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-8 h-8 object-cover border"
                      style={{ borderColor: 'rgba(51,255,51,0.5)', filter: 'grayscale(1) sepia(1) hue-rotate(60deg) saturate(2)' }} />
                  ) : (
                    <span className="w-8 h-8 flex items-center justify-center text-xs font-bold border shrink-0"
                      style={{ borderColor: 'rgba(51,255,51,0.5)', color: AMBER }}>
                      {initialsOf(t.name)}
                    </span>
                  )}
                  <span>
                    <span className="block text-xs font-bold" style={{ color: '#e8ffe8' }}>{t.name || 'Anonymous'}</span>
                    {t.role && <span className="block text-[10px]" style={{ color: GREEN_DIM }}>{t.role}</span>}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </DosPanel>
      )}

      {/* CONTACT.TXT */}
      <DosPanel id="contact" title="CONTACT.TXT">
        <PanelTitle>&#9654; Contact</PanelTitle>
        <motion.div variants={fadeUp} className="space-y-3 text-xs sm:text-sm">
          {(data.personal?.email || data.socials?.email) && (
            <a href={`mailto:${data.personal?.email || data.socials?.email}`}
              className="flex items-center gap-2 underline underline-offset-2 hover:bg-[#33ff33] hover:text-black transition-colors w-fit px-1 break-all"
              style={{ color: GREEN }}>
              <Mail size={14} /> {(data.personal?.email || data.socials?.email)}
            </a>
          )}
          {data.personal?.phone && (
            <p className="flex items-center gap-2" style={{ color: GREEN }}>
              <Phone size={14} /> {data.personal.phone}
            </p>
          )}
          {data.personal?.location && (
            <p className="flex items-center gap-2" style={{ color: GREEN_DIM }}>
              <MapPin size={14} /> {data.personal.location}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {['github', 'linkedin', 'twitter'].map((key) => {
              const url = data.socials?.[key];
              if (!url) return null;
              const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors hover:bg-[#33ff33] hover:text-black"
                  style={{ borderColor: 'rgba(51,255,51,0.45)', color: GREEN }}>
                  <Icon size={14} /> {key.toUpperCase()}
                </a>
              );
            })}
          </div>
        </motion.div>
      </DosPanel>

      {/* footer status bar */}
      <footer className="border-t-2 py-4 text-center text-[11px]"
        style={{ borderColor: 'rgba(51,255,51,0.5)', color: GREEN_DIM, background: 'rgba(0,0,0,0.8)' }}>
        (C) {new Date().getFullYear()} {name} &middot; PORTFOLIO.EXE &mdash; 640K conventional memory free
      </footer>
    </div>
  );
}
