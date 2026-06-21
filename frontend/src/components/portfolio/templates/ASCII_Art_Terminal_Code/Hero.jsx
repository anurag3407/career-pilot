import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Terminal } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Matrix Rain Canvas ─────────────────────────────────────────── */
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const CHARS = '01アイウエオカキクケコサシスセソタチツテトABCDEF∑∆√∫≠><={}[]//\\|;:'.split('');
    const FS = 13;
    let drops = [];
    const initDrops = () => {
      drops = Array(Math.floor(canvas.width / FS)).fill(0).map(() => Math.random() * -60);
    };
    initDrops();
    window.addEventListener('resize', initDrops);
    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cols = Math.floor(canvas.width / FS);
      while (drops.length < cols) drops.push(0);
      for (let i = 0; i < Math.min(drops.length, cols); i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const bright = Math.random() > 0.93;
        ctx.fillStyle = bright ? 'rgba(180,255,180,0.95)' : `rgba(0,${Math.floor(180 + Math.random() * 75)},65,${Math.random() * 0.3 + 0.04})`;
        ctx.font = `${FS}px 'Courier New', monospace`;
        ctx.fillText(ch, i * FS, drops[i] * FS);
        if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 50);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', initDrops);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
      aria-hidden="true"
    />
  );
}

/* ─── Typing Hook ─────────────────────────────────────────────────── */
function useTyping(text, speed = 45, delay = 0) {
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

/* ─── ASCII Art name generator ────────────────────────────────────── */
const ASCII_CHARS = {
  A: ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██'],
  B: ['█████ ', '██  ██', '█████ ', '██  ██', '█████ '],
  C: [' █████', '██    ', '██    ', '██    ', ' █████'],
  D: ['█████ ', '██  ██', '██  ██', '██  ██', '█████ '],
  E: ['██████', '██    ', '████  ', '██    ', '██████'],
  F: ['██████', '██    ', '████  ', '██    ', '██    '],
  G: [' █████', '██    ', '██ ███', '██  ██', ' █████'],
  H: ['██  ██', '██  ██', '██████', '██  ██', '██  ██'],
  I: ['██████', '  ██  ', '  ██  ', '  ██  ', '██████'],
  J: ['██████', '   ██ ', '   ██ ', '██ ██ ', ' ███  '],
  K: ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██'],
  L: ['██    ', '██    ', '██    ', '██    ', '██████'],
  M: ['██   ██', '███ ███', '██ █ ██', '██   ██', '██   ██'],
  N: ['██   ██', '███  ██', '██ █ ██', '██  ███', '██   ██'],
  O: [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
  P: ['█████ ', '██  ██', '█████ ', '██    ', '██    '],
  Q: [' ████ ', '██  ██', '██  ██', '██ ███', ' ████ '],
  R: ['█████ ', '██  ██', '█████ ', '██ ██ ', '██  ██'],
  S: [' █████', '██    ', ' ████ ', '    ██', '█████ '],
  T: ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
  U: ['██  ██', '██  ██', '██  ██', '██  ██', ' ████ '],
  V: ['██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
  W: ['██   ██', '██   ██', '██ █ ██', '███ ███', '██   ██'],
  X: ['██  ██', ' ████ ', '  ██  ', ' ████ ', '██  ██'],
  Y: ['██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  '],
  Z: ['██████', '   ██ ', '  ██  ', ' ██   ', '██████'],
  ' ': ['    ', '    ', '    ', '    ', '    '],
};

function ASCIIName({ name }) {
  const upper = name.toUpperCase();
  const chars = upper.split('').map(c => ASCII_CHARS[c] || ASCII_CHARS[' ']);
  const rows = 5;
  return (
    <div className="font-mono leading-none overflow-x-auto" aria-label={name}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex flex-wrap justify-center gap-x-1 text-green-400 text-xs sm:text-sm md:text-base" style={{ lineHeight: '1.15' }}>
          {chars.map((ch, ci) => (
            <span key={ci} className="whitespace-pre">{ch[r]}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Blinking Cursor ─────────────────────────────────────────────── */
function Cursor({ color = 'text-green-400' }) {
  return (
    <span
      className={`inline-block w-2 h-4 ${color} align-middle ml-0.5`}
      style={{ animation: 'termBlink 1s step-end infinite' }}
      aria-hidden="true"
    >
      █
    </span>
  );
}

/* ─── Terminal Window Frame ───────────────────────────────────────── */
function TermWindow({ title = 'bash', children, className = '' }) {
  return (
    <div className={`border border-green-900/60 bg-black/90 rounded-sm overflow-hidden ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 border-b border-green-900/40">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-green-600/70 tracking-widest">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ─── Prompt line ─────────────────────────────────────────────────── */
function Prompt({ cmd, output, showOutput = true, className = '' }) {
  return (
    <div className={`font-mono text-sm ${className}`}>
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className="text-green-500 select-none">user@portfolio:~$</span>
        <span className="text-white"> {cmd}</span>
      </div>
      {showOutput && output && (
        <div className="mt-1 pl-0 text-green-300/80 whitespace-pre-wrap leading-relaxed">{output}</div>
      )}
    </div>
  );
}

/* ─── Boot Sequence ───────────────────────────────────────────────── */
const BOOT_LINES = [
  { text: 'BIOS v2.1.0 — POST OK', delay: 0, color: 'text-gray-500' },
  { text: 'Loading kernel modules... [OK]', delay: 300, color: 'text-green-600' },
  { text: 'Mounting filesystem... [OK]', delay: 550, color: 'text-green-600' },
  { text: 'Starting portfolio daemon... [OK]', delay: 800, color: 'text-green-500' },
  { text: 'Initialising ASCII renderer... [OK]', delay: 1050, color: 'text-cyan-500' },
  { text: 'Establishing connection... [OK]', delay: 1300, color: 'text-green-400' },
  { text: 'PORTFOLIO LOADED ✔', delay: 1600, color: 'text-green-400 font-bold' },
];

function BootSequence({ onDone }) {
  const [visible, setVisible] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setVisible(v => [...v, i]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => { setFinished(true); setTimeout(onDone, 500); }, 600);
        }
      }, line.delay + 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-sm max-w-lg w-full px-6 space-y-1">
            {BOOT_LINES.map((line, i) =>
              visible.includes(i) ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={line.color}
                >
                  {line.text}
                </motion.div>
              ) : null
            )}
            {visible.length < BOOT_LINES.length && <Cursor />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Hero Section ────────────────────────────────────────────────── */
export default function Hero() {
  const data = usePortfolio();
  const [booted, setBooted] = useState(false);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleBoot = useCallback(() => setBooted(true), []);

  const whoamiTyping = useTyping(`${data.personal.name}`, 60, booted ? 200 : 9999);
  const titleTyping = useTyping(`${data.personal.title}`, 40, booted ? 900 : 9999);
  const bioTyping = useTyping(`${data.personal.bio}`, 12, booted ? 1800 : 9999);

  const socials = [
    { icon: Github, label: 'github', href: data.socials.github, color: '#00ff41' },
    { icon: Linkedin, label: 'linkedin', href: data.socials.linkedin, color: '#00ffff' },
    { icon: Mail, label: 'email', href: `mailto:${data.socials.email}`, color: '#f59e0b' },
    { icon: Twitter, label: 'twitter', href: data.socials.twitter, color: '#00ff41' },
  ];

  return (
    <>
      {!booted && <BootSequence onDone={handleBoot} />}

      <section
        id="hero"
        className="relative min-h-screen bg-black overflow-hidden flex flex-col"
        role="banner"
      >
        <MatrixRain />

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)' }}
          aria-hidden="true"
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.9) 100%)' }}
          aria-hidden="true"
        />

        {/* Corner brackets */}
        {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((c, i) => (
          <div key={i} className={`absolute w-5 h-5 border-green-500/40 z-10 ${c}`} aria-hidden="true" />
        ))}

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-green-900/40 bg-black/80 font-mono text-xs text-green-700">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-green-500" />
            <span className="text-green-500">bash — user@portfolio:~</span>
          </div>
          <span className="text-green-800 hidden sm:inline">{clock}</span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              style={{ animation: 'termBlink 2s ease-in-out infinite' }}
            />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-4 py-12">

          {/* ASCII Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: booted ? 1 : 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="w-full max-w-4xl overflow-hidden"
          >
            <ASCIIName name={data.personal.name} />
          </motion.div>

          {/* Terminal box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <TermWindow title={`bash — user@portfolio:~`}>
              <div className="space-y-4">
                {/* whoami */}
                <div>
                  <Prompt cmd="whoami" showOutput={false} />
                  <div className="font-mono text-green-300 text-sm mt-1">
                    {whoamiTyping.displayed}
                    {!whoamiTyping.done && <Cursor />}
                  </div>
                </div>

                {/* cat title */}
                {whoamiTyping.done && (
                  <div>
                    <Prompt cmd="cat title.txt" showOutput={false} />
                    <div className="font-mono text-amber-400 text-sm mt-1">
                      {titleTyping.displayed}
                      {!titleTyping.done && <Cursor color="text-amber-400" />}
                    </div>
                  </div>
                )}

                {/* cat about */}
                {titleTyping.done && (
                  <div>
                    <Prompt cmd="cat about.txt" showOutput={false} />
                    <div className="font-mono text-green-300/70 text-xs leading-relaxed mt-1">
                      {bioTyping.displayed}
                      {!bioTyping.done && <Cursor />}
                    </div>
                  </div>
                )}

                {/* contact --status */}
                {bioTyping.done && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <Prompt cmd="contact --status" showOutput={false} />
                    <div className="font-mono text-xs mt-1 space-y-0.5">
                      <div className="text-green-400">status: <span className="text-white">OPEN TO OPPORTUNITIES</span></div>
                      <div className="text-green-400">email: <span className="text-cyan-400">{data.socials.email}</span></div>
                      <div className="text-green-400">location: <span className="text-white">{data.personal.location || 'Remote'}</span></div>
                    </div>
                  </motion.div>
                )}

                {/* Prompt ready */}
                {bioTyping.done && (
                  <div className="flex items-center gap-1 font-mono text-sm text-green-500">
                    <span>user@portfolio:~$</span>
                    <Cursor />
                  </div>
                )}
              </div>
            </TermWindow>
          </motion.div>

          {/* Social links */}
          {bioTyping.done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex gap-4 flex-wrap justify-center"
            >
              {socials.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group flex flex-col items-center gap-1 font-mono text-xs tracking-widest uppercase no-underline transition-all"
                  style={{ color: `${color}66` }}
                >
                  <div
                    className="w-9 h-9 border flex items-center justify-center transition-all group-hover:bg-green-900/20"
                    style={{ borderColor: `${color}33` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span style={{ color }}>./{label}</span>
                </a>
              ))}
            </motion.div>
          )}

          {/* Stats row */}
          {booted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center font-mono text-xs"
            >
              {[
                { label: 'YEARS_EXP', value: `${data.stats.yearsExperience}+`, color: 'text-green-400' },
                { label: 'PROJECTS', value: `${data.stats.projectsCompleted}`, color: 'text-cyan-400' },
                { label: 'CLIENTS', value: `${data.stats.happyClients}`, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="border border-green-900/50 bg-black/60 px-4 py-2 text-center">
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-green-800 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-1.5 border-t border-green-900/30 bg-black/80 font-mono text-xs text-green-900">
          <span>SYS:ONLINE | MEM:OK | CPU:OK</span>
          <span className="text-green-700 hidden sm:inline">ASCII ART TERMINAL PORTFOLIO</span>
          <span>{clock}</span>
        </div>

        <style>{`
          @keyframes termBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        `}</style>
      </section>
    </>
  );
}
