import React, { useEffect, useRef, useState } from 'react';
import { Shield, Lock, Terminal, Code2, Github, Linkedin, Mail, Bug } from 'lucide-react';

function MatrixCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const chars = '01アイウエオカキクケコ∑∆√∫≠ABCDEF0123456789><//\\|{}'.split('');
    const fontSize = 14;
    let drops = [];
    const initDrops = () => { drops = Array(Math.floor(canvas.width / fontSize)).fill(0).map(() => Math.random() * -40); };
    initDrops();
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cols = Math.floor(canvas.width / fontSize);
      while (drops.length < cols) drops.push(0);
      for (let i = 0; i < Math.min(drops.length, cols); i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.92 ? 0.95 : Math.random() * 0.35 + 0.05;
        const isRed = Math.random() > 0.96;
        ctx.fillStyle = isRed ? `rgba(255,0,64,${alpha})` : `rgba(0,255,65,${alpha})`;
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 48);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function useTypewriter(texts, speed = 75, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[ti % texts.length];
    const timeout = setTimeout(() => {
      if (!del) {
        setDisplay(cur.slice(0, ci + 1));
        if (ci + 1 === cur.length) setTimeout(() => setDel(true), pause);
        else setCi(c => c + 1);
      } else {
        setDisplay(cur.slice(0, ci - 1));
        if (ci - 1 === 0) { setDel(false); setTi(t => t + 1); setCi(0); }
        else setCi(c => c - 1);
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [ci, del, ti, texts, speed, pause]);
  return display;
}

function WarningTape() {
  const segs = ['WARNING', '///', 'UNAUTHORIZED ACCESS DETECTED', '///', 'SYSTEM BREACH', '///', 'EXPLOIT IN PROGRESS', '///', 'FIREWALL COMPROMISED', '///'];
  const all = [...segs, ...segs, ...segs, ...segs];
  return (
    <div className="w-full overflow-hidden py-1.5" style={{ borderTop: '1px solid #ff0040', borderBottom: '1px solid #ff0040' }}>
      <style>{`@keyframes scrolltape { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'scrolltape 14s linear infinite', willChange: 'transform' }}
      >
        {all.map((s, i) => (
          <span
            key={i}
            className="px-4 text-[11px] font-bold tracking-widest flex-shrink-0"
            style={{ color: s === '///' ? 'rgba(255,0,64,0.4)' : '#ff0040' }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function GlitchName() {
  const [hover, setHover] = useState(false);
  return (
    <div className="text-center select-none cursor-default" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <p className="font-mono text-[10px] text-[#00ff41]/35 tracking-[0.35em] uppercase mb-2">▸ identity_leak.sh — executing</p>
      <div className="relative inline-block" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, lineHeight: 0.88 }}>
        <span className={`block text-white ${hover ? 'glitch-line1' : ''}`} style={{ fontSize: 'clamp(52px, 11vw, 88px)' }}>JOHN</span>
        <span className={`block text-[#00ff41] ${hover ? 'glitch-line2' : ''}`}
          style={{ fontSize: 'clamp(52px, 11vw, 88px)', textShadow: '0 0 20px rgba(0,255,65,0.6), 0 0 60px rgba(0,255,65,0.25)' }}>
          D03
        </span>
      </div>
      <p className="font-mono text-[10px] text-[#ff0040]/50 tracking-[0.2em] mt-2">[ HOVER TO DESTABILIZE ]</p>
    </div>
  );
}

function StatCard({ value, label, color = '#00ff41' }) {
  return (
    <div className="group relative border border-[#00ff41]/18 bg-black/50 p-3 text-center overflow-hidden cursor-default"
      style={{ transition: 'border-color 0.2s' }}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ff41] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      <div className="font-mono font-bold text-[17px] group-hover:text-white transition-colors" style={{ fontFamily: "'Orbitron', monospace", color, transition: 'all 0.2s' }}>{value}</div>
      <div className="text-[9px] tracking-[0.08em] uppercase mt-1 text-[#00ff41]/40">{label}</div>
    </div>
  );
}

export default function Hero() {
  const roles = ['Penetration Tester', 'Zero-Day Researcher', 'Malware Analyst', 'Red Team Operator', 'CTF Champion', 'Exploit Developer'];
  const currentRole = useTypewriter(roles);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
      <MatrixCanvas />

      {/* Hex grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{ backgroundImage: 'repeating-linear-gradient(60deg,rgba(0,255,65,0.03) 0,rgba(0,255,65,0.03) 1px,transparent 0,transparent 50%),repeating-linear-gradient(120deg,rgba(0,255,65,0.03) 0,rgba(0,255,65,0.03) 1px,transparent 0,transparent 50%)', backgroundSize: '40px 40px' }} />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,65,0.025) 3px,rgba(0,255,65,0.025) 4px)' }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[3]"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#00ff41]/60 z-10" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#00ff41]/60 z-10" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#00ff41]/60 z-10" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#00ff41]/60 z-10" />

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#00ff41]/25 bg-black/80 font-mono text-[11px] text-[#00ff41]/50">
        <div className="flex items-center gap-2">
          <div className="w-[9px] h-[9px] rounded-full bg-[#ff3b30]" style={{ boxShadow: '0 0 5px #ff3b30' }} />
          <div className="w-[9px] h-[9px] rounded-full bg-[#ffcc00]" style={{ boxShadow: '0 0 5px #ffcc00' }} />
          <div className="w-[9px] h-[9px] rounded-full bg-[#00ff41]" style={{ boxShadow: '0 0 5px #00ff41' }} />
          <span className="ml-2 hidden sm:inline">bash — root@0x1337:~</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff0040]" style={{ animation: 'rpulse 1s ease-in-out infinite' }} />
          <span>REC &nbsp;|&nbsp; BREACH ACTIVE</span>
        </div>
        <span className="hidden sm:inline">AES-256 &nbsp;|&nbsp; TOR:ON</span>
      </div>

      <WarningTape />

      {/* Main */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-4 sm:px-8 py-10">

        <GlitchName />

        {/* Slash divider */}
        <div className="flex items-center gap-3 text-[#00ff41]/25 text-lg w-full max-w-lg">
          <div className="flex-1 h-px bg-[#00ff41]/15" />
          <span className="font-mono">///</span>
          <div className="flex-1 h-px bg-[#00ff41]/15" />
        </div>

        {/* Role typewriter */}
        <div className="relative flex items-center gap-2.5 px-4 py-2 border border-[#00ff41]/30 bg-[#00ff41]/4 overflow-hidden"
          style={{ background: 'rgba(0,255,65,0.04)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(0,255,65,0.06),transparent)', animation: 'shimmer 2.5s ease-in-out infinite' }} />
          <span className="font-mono text-[#00ff41] text-sm">$&gt;</span>
          <span className="font-mono text-[#00ffff] text-sm min-w-[200px] sm:min-w-[260px]">{currentRole}</span>
          <span className="inline-block w-0.5 h-[15px] bg-[#00ffff]" style={{ animation: 'blink 0.8s step-end infinite' }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-lg">
          <StatCard value="150+" label="CVEs Filed" />
          <StatCard value="$80K" label="Bounties" color="#ff0040" />
          <StatCard value="Top 1%" label="HackTheBox" color="#00ffff" />
          <StatCard value="200+" label="CTF Flags" />
        </div>

        {/* Terminal desc */}
        <div className="w-full max-w-lg border border-[#00ff41]/20 bg-black/70">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#00ff41]/12 bg-[#00ff41]/4 font-mono text-[10px] text-[#00ff41]/40"
            style={{ background: 'rgba(0,255,65,0.04)' }}>
            <span>cat ~/profile.md</span>
            <span>{clock}</span>
          </div>
          <div className="p-4 font-mono text-[12px] leading-[1.9]">
            <span className="text-[#00ff41]/35"># whoami</span><br />
            <span className="text-gray-400">
              <span className="text-[#00ffff]">Offensive security researcher</span> specialised in{' '}
              <span className="text-[#ffcc00]">zero-day discovery</span>,{' '}
              <span className="text-[#ffcc00]">red-team ops</span> &amp;{' '}
              <span className="text-[#ffcc00]">malware reverse engineering</span>.
              5 years breaking production systems so defenders can sleep at night.
            </span><br /><br />
            <span className="text-[#00ff41]/30">{'/* currently: bug bounty grind + open-source exploit tooling */'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg justify-center">
          <button type="button"
            className="group relative px-7 py-3 font-mono font-bold text-[12px] tracking-[0.12em] uppercase overflow-hidden transition-all w-full sm:w-auto"
            style={{ background: '#00ff41', color: '#000', border: '2px solid #00ff41' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#00ff41'; e.currentTarget.style.borderColor = '#00ff41'; }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4" />
              ./view_projects.sh
            </span>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)', transform: 'skewX(-20deg)', animation: 'sweep 3s ease-in-out infinite 1s' }} />
          </button>
          <button type="button"
            className="px-7 py-3 font-mono text-[12px] tracking-[0.12em] uppercase transition-all w-full sm:w-auto"
            style={{ background: 'transparent', color: '#ff0040', border: '2px solid #ff0040' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,64,0.15)'; e.currentTarget.style.color = '#ff4d77'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff0040'; }}
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              $ sudo hire_me
            </span>
          </button>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          {[
            { icon: Github, label: 'github', href: '#', color: '#00ff41' },
            { icon: Linkedin, label: 'linkedin', href: '#', color: '#00ff41' },
            { icon: Mail, label: 'email', href: '#', color: '#00ff41' },
            { icon: Bug, label: 'bugcrowd', href: '#', color: '#ff0040' },
          ].map(({ icon: Icon, label, href, color }) => (
            <a key={label} href={href}
              className="group flex flex-col items-center gap-1 font-mono text-[9px] tracking-[0.1em] uppercase no-underline transition-all"
              style={{ color: `${color}55` }}>
              <div className="w-[34px] h-[34px] border flex items-center justify-center transition-all group-hover:bg-[rgba(0,255,65,0.08)]"
                style={{ borderColor: `${color}30` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottombar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-2 border-t border-[#00ff41]/20 bg-black/80 font-mono text-[10px] text-[#00ff41]/30">
        <span>SYS: ONLINE &nbsp;|&nbsp; FIREWALL: BYPASSED</span>
        <span className="text-[#ff0040]" style={{ animation: 'rpulse 2s ease-in-out infinite' }}>▲ THREAT LEVEL: CRITICAL</span>
        <span className="hidden sm:inline">{clock}</span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        @keyframes rpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        @keyframes blink { 50%{opacity:0} }
        @keyframes shimmer { 0%{transform:translateX(-100%) skewX(-20deg)} 100%{transform:translateX(300%) skewX(-20deg)} }
        @keyframes sweep { 0%{transform:translateX(-100%) skewX(-20deg)} 40%,100%{transform:translateX(300%) skewX(-20deg)} }
        @keyframes scrolltape { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
        @keyframes glitch1 {
          0%{clip-path:inset(0 0 85% 0);transform:translate(-3px,0);color:#ff0040}
          25%{clip-path:inset(30% 0 50% 0);transform:translate(3px,0);color:#00ffff}
          50%{clip-path:inset(60% 0 20% 0);transform:translate(-2px,0);color:#ff0040}
          75%{clip-path:inset(0 0 0 0);transform:translate(0,0);color:#fff}
          100%{clip-path:inset(10% 0 70% 0);transform:translate(2px,0);color:#00ffff}
        }
        @keyframes glitch2 {
          0%{transform:translate(4px,0) skew(2deg);color:#00ffff}
          33%{transform:translate(-4px,0) skew(-2deg);color:#ff0040}
          66%{transform:translate(2px,-1px);color:#00ff41}
          100%{transform:translate(0,0);color:#00ff41}
        }
        .glitch-line1 { animation: glitch1 0.3s steps(1) infinite; }
        .glitch-line2 { animation: glitch2 0.3s steps(1) infinite; }
      `}</style>
    </section>
  );
}