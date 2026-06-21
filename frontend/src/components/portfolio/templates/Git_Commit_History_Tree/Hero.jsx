import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, GitCommit, Star, GitFork, Eye, Copy, Check, Github, Linkedin, Mail, Twitter, ExternalLink } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Contribution Graph ───────────────────────────────────────── */
function ContributionGraph() {
  const weeks = 26;
  const days  = 7;
  const LEVELS = ['bg-[#161B22]', 'bg-[#0E4429]', 'bg-[#006D32]', 'bg-[#26A641]', 'bg-[#3FB950]'];

  // Deterministic pseudo-random for SSR safety
  const seed = (w, d) => {
    const x = Math.sin(w * 7 + d) * 10000;
    return x - Math.floor(x);
  };

  return (
    <div className="flex gap-[3px]" aria-label="Contribution graph">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }).map((_, d) => {
            const r = seed(w, d);
            const level = r > 0.8 ? 4 : r > 0.6 ? 3 : r > 0.4 ? 2 : r > 0.2 ? 1 : 0;
            return (
              <motion.div
                key={d}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (w * 7 + d) * 0.002, duration: 0.3 }}
                className={`w-[10px] h-[10px] rounded-sm ${LEVELS[level]} hover:ring-1 hover:ring-white/30 transition-all cursor-default`}
                title={`${level * 3} contributions`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── Typing Hook ──────────────────────────────────────────────── */
function useTyping(text, speed = 50, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const t0 = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t0);
  }, [text, speed, delay]);
  return { displayed, done };
}

/* ─── Clone Command copy ───────────────────────────────────────── */
function CloneCommand({ username }) {
  const [copied, setCopied] = useState(false);
  const cmd = `git clone https://github.com/${username}/portfolio.git`;
  const copy = () => {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 bg-[#161B22] border border-[#30363D] rounded-md px-3 py-2 font-mono text-xs text-[#8B949E] group">
      <span className="text-[#3FB950]">$</span>
      <span className="flex-1 truncate text-white">{cmd}</span>
      <button
        onClick={copy}
        aria-label="Copy clone command"
        id="clone-copy-btn"
        className="text-[#8B949E] hover:text-white transition-colors"
      >
        {copied ? <Check size={14} className="text-[#3FB950]" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

/* ─── Branch tree lines ────────────────────────────────────────── */
const BRANCHES = [
  { label: 'Developer',            color: 'text-[#3FB950]', branch: 'main' },
  { label: 'Problem Solver',        color: 'text-[#58A6FF]', branch: 'feat/problem-solving' },
  { label: 'Open Source Contributor', color: 'text-[#BC8CFF]', branch: 'feat/open-source' },
  { label: 'Full Stack Engineer',   color: 'text-[#F0883E]', branch: 'feat/fullstack' },
];

/* ─── Hero Section ──────────────────────────────────────────────── */
export default function Hero() {
  const { portfolioData } = usePortfolio();
  const { personal, stats, socials } = portfolioData;

  const username = personal.name
    ?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'developer';

  const titleTyping = useTyping(personal.title || '', 40, 400);
  const bioTyping   = useTyping(personal.bio   || '', 14, 1200);

  const SOCIAL_LINKS = [
    { icon: Github,   href: socials.github,            label: 'github',   color: '#8B949E' },
    { icon: Linkedin, href: socials.linkedin,           label: 'linkedin', color: '#58A6FF' },
    { icon: Twitter,  href: socials.twitter,            label: 'twitter',  color: '#58A6FF' },
    { icon: Mail,     href: `mailto:${socials.email}`,  label: 'email',    color: '#3FB950' },
  ];

  const STAT_CARDS = [
    { label: 'Commits',       value: `${(stats?.yearsExperience || 5) * 30}+`,    icon: GitCommit, color: '#3FB950' },
    { label: 'Projects',      value: `${stats?.projectsCompleted || 48}+`,         icon: Star,      color: '#F0883E' },
    { label: 'Contributions', value: `${(stats?.happyClients || 32) * 15}+`,       icon: GitFork,   color: '#BC8CFF' },
    { label: 'Experience',    value: `${stats?.yearsExperience || 5}+ Yrs`,        icon: Eye,       color: '#58A6FF' },
  ];

  return (
    <section id="hero" className="relative min-h-screen bg-[#0D1117] overflow-hidden" role="banner">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#58A6FF 1px,transparent 1px),linear-gradient(90deg,#58A6FF 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#3FB950]/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-36 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Left Column ── */}
          <div className="space-y-6">
            {/* Repo path */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 font-mono text-sm text-[#8B949E]"
            >
              <GitBranch size={14} className="text-[#3FB950]" />
              <span className="text-[#58A6FF] hover:underline cursor-pointer">{username}</span>
              <span>/</span>
              <span className="text-white font-semibold">portfolio</span>
              <span className="ml-2 text-xs border border-[#3FB950]/40 text-[#3FB950] px-2 py-0.5 rounded-full">Public</span>
            </motion.div>

            {/* Avatar + Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              {personal.avatar && (
                <div className="relative">
                  <img
                    src={personal.avatar}
                    alt={personal.name || "Profile Avatar"}
                    className="w-16 h-16 rounded-full border-2 border-[#3FB950]/50 object-cover"
                    loading="eager"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3FB950] rounded-full border-2 border-[#0D1117]" title="Active" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{personal.name}</h1>
                <p className="text-[#8B949E] text-sm font-mono">{username}</p>
              </div>
            </motion.div>

            {/* Title typing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-mono text-lg text-[#3FB950] min-h-[1.5em]"
            >
              {titleTyping.displayed}
              {!titleTyping.done && (
                <span className="inline-block w-2 h-5 bg-[#3FB950] ml-0.5 align-middle animate-pulse" aria-hidden="true" />
              )}
            </motion.div>

            {/* Branch tree */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="font-mono text-sm space-y-1"
            >
              <div className="text-[#3FB950]">main</div>
              {BRANCHES.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`flex items-center gap-2 ${b.color}`}
                >
                  <span className="text-[#8B949E]">
                    {i === BRANCHES.length - 1 ? '└──' : '├──'}
                  </span>
                  {b.label}
                </motion.div>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-[#8B949E] text-sm leading-relaxed min-h-[3em] font-mono"
            >
              {bioTyping.displayed}
            </motion.p>

            {/* Location / email */}
            {personal.location && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap gap-4 text-[#8B949E] text-sm"
              >
                <span>📍 {personal.location}</span>
                {socials.email && (
                  <a href={`mailto:${socials.email}`} className="hover:text-[#58A6FF] transition-colors">
                    ✉️ {socials.email}
                  </a>
                )}
              </motion.div>
            )}

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex gap-3 flex-wrap"
            >
              {SOCIAL_LINKS.filter(s => s.href).map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  id={`hero-social-${label}`}
                  className="flex items-center gap-2 bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF]/50 rounded-md px-3 py-1.5 text-sm text-[#8B949E] hover:text-white transition-all"
                >
                  <Icon size={14} style={{ color }} />
                  <span className="hidden sm:inline capitalize">{label}</span>
                </a>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <button
                id="hero-clone-btn"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 bg-[#238636] hover:bg-[#2EA043] border border-[#3FB950]/50 text-white rounded-md px-4 py-2 text-sm font-medium transition-all"
              >
                <GitCommit size={14} />
                Clone Portfolio
              </button>
              <a
                id="hero-view-repo-btn"
                href={socials.github || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#8B949E] hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-all"
              >
                <ExternalLink size={14} />
                View Repository
              </a>
            </motion.div>

            {/* Clone command */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <CloneCommand username={username} />
            </motion.div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Stat Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              {STAT_CARDS.map(({ label, value, icon: Icon, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF]/40 rounded-lg p-4 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} style={{ color }} />
                    <span className="text-[#8B949E] text-xs font-mono">{label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono" style={{ color }}>{value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contribution Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="bg-[#161B22] border border-[#30363D] rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-sm font-medium">
                  {(stats?.yearsExperience || 5) * 200}+ contributions in the last year
                </span>
                <span className="text-[#3FB950] text-xs font-mono">2026</span>
              </div>
              <div className="overflow-x-auto pb-1">
                <ContributionGraph />
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 text-xs text-[#8B949E]">
                <span>Less</span>
                {['bg-[#161B22]', 'bg-[#0E4429]', 'bg-[#006D32]', 'bg-[#26A641]', 'bg-[#3FB950]'].map((c, i) => (
                  <div key={i} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
                ))}
                <span>More</span>
              </div>
            </motion.div>

            {/* README preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden"
            >
              {/* File header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#30363D] bg-[#0D1117]/60 text-xs text-[#8B949E] font-mono">
                <span>📄</span>
                <span className="text-white">README.md</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-2">
                <div className="text-[#F0883E] text-lg font-bold">## {personal.name}</div>
                <div className="text-[#8B949E] text-xs leading-relaxed line-clamp-3">
                  {personal.tagline || personal.bio?.slice(0, 120) + '...'}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['React', 'Node.js', 'TypeScript', 'Open Source'].map(tag => (
                    <span key={tag} className="text-[10px] bg-[#1F6FEB]/20 text-[#58A6FF] border border-[#1F6FEB]/30 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
