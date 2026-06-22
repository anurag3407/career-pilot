import React, { useState, useEffect, useRef } from 'react';

/* ─── Typing hook ─────────────────────────────────────────────────────── */
function useTyping(lines, charDelay = 22, lineDelay = 260) {
  const [state, setState] = useState({ lineIdx: 0, charIdx: 0, done: false });
  useEffect(() => {
    if (state.done) return;
    const cur = lines[state.lineIdx];
    if (!cur && cur !== '') { setState(s => ({ ...s, done: true })); return; }
    if (state.charIdx < cur.length) {
      const t = setTimeout(() => setState(s => ({ ...s, charIdx: s.charIdx + 1 })), charDelay);
      return () => clearTimeout(t);
    }
    if (state.lineIdx < lines.length - 1) {
      const t = setTimeout(() =>
        setState(s => ({ lineIdx: s.lineIdx + 1, charIdx: 0, done: false })),
        cur.length === 0 ? 80 : lineDelay,
      );
      return () => clearTimeout(t);
    }
    setState(s => ({ ...s, done: true }));
  }, [state, lines, charDelay, lineDelay]);

  const rendered = lines.map((l, i) => {
    if (i < state.lineIdx) return l;
    if (i === state.lineIdx) return l.slice(0, state.charIdx);
    return null;
  });
  return { rendered, done: state.done };
}

/* ─── Blinking cursor ────────────────────────────────────────────────── */
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 520);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      style={{
        display: 'inline-block', width: 8, height: 13,
        background: on ? '#00ff41' : 'transparent',
        verticalAlign: 'middle', marginLeft: 1,
        transition: 'background 0.05s',
      }}
    />
  );
}

/* ─── Hex grid background ────────────────────────────────────────────── */
function HexGrid() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.06, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,4 52,16 52,32 28,44 4,32 4,16" fill="none" stroke="#00ff41" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

/* ─── Scan-line overlay ──────────────────────────────────────────────── */
function ScanLines() {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)',
      }}
    />
  );
}

/* ─── Glitch name ────────────────────────────────────────────────────── */
function GlitchName({ text }) {
  return (
    <>
      <style>{`
        .gh-glitch {
          font-family: 'Orbitron', 'Courier New', monospace;
          font-size: 36px; font-weight: 900;
          color: #00ff41;
          position: relative; display: inline-block;
          text-shadow: 0 0 18px rgba(0,255,65,0.7);
          letter-spacing: 2px;
        }
        .gh-glitch::before, .gh-glitch::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .gh-glitch::before {
          color: #00e5ff;
          clip-path: polygon(0 20%, 100% 20%, 100% 35%, 0 35%);
          animation: ghGlitch 3.5s infinite;
          transform: translateX(-3px);
        }
        .gh-glitch::after {
          color: #ff0055;
          clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
          animation: ghGlitch 3.5s infinite 0.08s;
          transform: translateX(3px);
        }
        @keyframes ghGlitch {
          0%,89%,91%,100% { opacity: 0; transform: translateX(0); }
          90% { opacity: 1; transform: translateX(-4px) skewX(-2deg); }
        }
        @keyframes ghPulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes ghAvatarScan {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
      <span className="gh-glitch" data-text={text}>{text}</span>
    </>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────── */
const STAT_COLORS = {
  amber: { border: '#4a3a0a', val: '#ffcc00', shadow: 'rgba(255,204,0,0.5)' },
  red:   { border: '#4a0a0a', val: '#ff4141', shadow: 'rgba(255,65,65,0.4)' },
  cyan:  { border: '#0a3a4a', val: '#00e5ff', shadow: 'rgba(0,229,255,0.5)' },
  green: { border: '#1a4a1a', val: '#00ff41', shadow: 'rgba(0,255,65,0.5)' },
};
function StatCard({ label, value, color = 'green', delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  const c = STAT_COLORS[color];
  return (
    <div style={{
      background: '#080f08', borderRadius: 6, padding: '10px 8px', textAlign: 'center',
      border: `1px solid ${c.border}`,
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.6s ease',
    }}>
      <div style={{
        fontFamily: '"Orbitron","Courier New",monospace', fontSize: 22, fontWeight: 700,
        color: c.val, textShadow: `0 0 10px ${c.shadow}`, lineHeight: 1, marginBottom: 2,
      }}>{value}</div>
      <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#4a6a4a' }}>{label}</div>
    </div>
  );
}

/* ─── Skill bar ──────────────────────────────────────────────────────── */
const SKILL_GRADIENTS = {
  green: 'linear-gradient(90deg, #003a10, #00ff41)',
  cyan:  'linear-gradient(90deg, #003a4a, #00e5ff)',
  amber: 'linear-gradient(90deg, #3a2a00, #ffcc00)',
};
function SkillBar({ name, level, color = 'green', delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(level), delay + 500); return () => clearTimeout(t); }, [level, delay]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: '#c8ffd4' }}>{name}</span>
        <span style={{ color: '#4a9a6a' }}>{level}%</span>
      </div>
      <div style={{ height: 4, background: '#0d1a0d', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${width}%`, background: SKILL_GRADIENTS[color],
          transition: 'width 1.2s ease-out',
          boxShadow: width > 0 ? `0 0 6px ${color === 'green' ? 'rgba(0,255,65,0.4)' : color === 'cyan' ? 'rgba(0,229,255,0.4)' : 'rgba(255,204,0,0.4)'}` : 'none',
        }} />
      </div>
    </div>
  );
}

/* ─── Log line ───────────────────────────────────────────────────────── */
const LOG_COLORS = { info: '#00ff41', warn: '#ffcc00', error: '#ff4141', dim: '#3a6a3a' };
function LogLine({ time, text, type = 'info', delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      fontFamily: '"Share Tech Mono","Courier New",monospace',
      fontSize: 11, lineHeight: 1.7,
      display: 'flex', gap: 6,
      opacity: show ? 1 : 0, transform: show ? 'none' : 'translateX(-8px)',
      transition: 'all 0.3s ease',
    }}>
      <span style={{ color: '#2a5a3a', flexShrink: 0 }}>[{time}]</span>
      <span style={{ color: LOG_COLORS[type] }}>{text}</span>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const BIO_LINES = [
  '> Initializing identity module...',
  '> Loading bio.enc ...',
  '> Decrypting with RSA-4096...',
  '> ACCESS GRANTED',
  '',
  '  Security researcher & full-stack dev',
  '  specializing in offensive security,',
  '  threat intelligence & hardened apps.',
  '',
  '  Turns coffee into exploit PoCs by night,',
  '  patches zero-days by morning.',
];

const STATS = [
  { label: 'CVEs Found',    value: '34',   color: 'amber', delay: 800  },
  { label: 'Systems Pwned', value: '200+', color: 'red',   delay: 1000 },
  { label: 'CTF Wins',      value: '47',   color: 'cyan',  delay: 1200 },
  { label: 'Yrs Active',    value: '6',    color: 'green', delay: 1400 },
];

const SKILLS = [
  { name: 'Penetration Testing', level: 92, color: 'green' },
  { name: 'Exploit Development', level: 85, color: 'cyan'  },
  { name: 'Reverse Engineering', level: 78, color: 'amber' },
  { name: 'Network Forensics',   level: 88, color: 'green' },
  { name: 'Secure Code Review',  level: 90, color: 'cyan'  },
  { name: 'Malware Analysis',    level: 74, color: 'amber' },
];

const LOGS = [
  { time: '09:14:03', text: 'CVE-2025-XXXX — patch submitted to NVD',        type: 'info',  delay: 600  },
  { time: '09:12:47', text: '⚠ WARN: unusual outbound on port 4444',          type: 'warn',  delay: 900  },
  { time: '09:11:22', text: 'CTF solved: heap overflow in libc-2.39',          type: 'info',  delay: 1100 },
  { time: '09:09:05', text: '✖ ERR: target firewall dropped SYN flood',        type: 'error', delay: 1300 },
  { time: '09:07:58', text: 'audit report pushed → encrypted channel',         type: 'dim',   delay: 1500 },
];

const CERTS = [
  { name: 'OSCP',  color: 'green' },
  { name: 'CEH',   color: 'cyan'  },
  { name: 'CISSP', color: 'amber' },
  { name: 'GREM',  color: 'green' },
  { name: 'eWPT',  color: 'cyan'  },
  { name: 'CRT',   color: 'amber' },
];
const CERT_STYLES = {
  green: { background: 'rgba(0,255,65,0.08)',  border: '1px solid rgba(0,255,65,0.3)',  color: '#00ff41' },
  cyan:  { background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)', color: '#00e5ff' },
  amber: { background: 'rgba(255,204,0,0.08)', border: '1px solid rgba(255,204,0,0.3)', color: '#ffcc00' },
};

const CONTACTS = [
  { icon: '◈', text: 'Undisclosed · VPN Active', color: '#00ff41' },
  { icon: '✉', text: 'gh0st@darknet.sec',        color: '#ffcc00' },
  { icon: '⌥', text: 'github.com/gh0st-sec',     color: '#00e5ff' },
  { icon: '⌘', text: 'in/ghost-security',        color: '#ff4141' },
];

/* ─── Panel wrapper ──────────────────────────────────────────────────── */
function Panel({ children, style = {} }) {
  return (
    <div style={{
      background: '#040c04', border: '1px solid #0d2a0d',
      borderRadius: 6, padding: 14,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export default function About() {
  const { rendered, done } = useTyping(BIO_LINES, 22, 260);
  const [liveDot, setLiveDot] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setLiveDot(v => !v), 750);
    return () => clearInterval(id);
  }, []);

  const activeLineIdx = rendered
    ? rendered.findIndex((r, i) => r !== null && r !== undefined && r.length < BIO_LINES[i].length)
    : -1;

  return (
    <section style={{
      position: 'relative', width: '100%', minHeight: '100vh',
      overflow: 'hidden', fontFamily: '"Share Tech Mono","Courier New",monospace',
      background: '#050d05', color: '#00ff41',
    }}>
      <HexGrid />
      <ScanLines />

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: -200, left: -200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, bottom: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #00ff41)' }} />
          <span style={{ fontSize: 10, letterSpacing: 4, border: '1px solid #00ff41', color: '#00ff41', padding: '3px 14px' }}>WHOAMI</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #00ff41, transparent)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <Panel style={{ background: '#0a140a', borderColor: '#1a3a1a' }}>
              <div style={{ fontSize: 10, color: '#00e5ff', letterSpacing: 3, marginBottom: 8, borderLeft: '2px solid #00e5ff', paddingLeft: 8 }}>IDENTITY_VERIFIED</div>
              <GlitchName text="0xGH0ST" />
              <div style={{ fontSize: 12, color: '#4a9a6a', margin: '4px 0 12px' }}>// Security Researcher &amp; Exploit Dev</div>
              {CONTACTS.map(c => (
                <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#5aaa6a', marginBottom: 6 }}>
                  <span style={{ color: c.color, flexShrink: 0 }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </Panel>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {STATS.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            <Panel>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#00e5ff', marginBottom: 10 }}>⛨ Certifications</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CERTS.map(c => (
                  <span key={c.name} style={{ fontSize: 11, fontWeight: 'bold', letterSpacing: 1, padding: '3px 9px', borderRadius: 3, ...CERT_STYLES[c.color] }}>
                    {c.name}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ background: '#040c04', border: '1px solid #0d2a0d', borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 30px rgba(0,255,65,0.06)' }}>
              <div style={{ background: '#081008', borderBottom: '1px solid #0d2a0d', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff4141','#ffcc00','#00ff41'].map(c => (
                    <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#2a5a2a', marginLeft: 4 }}>bash — about.sh</span>
              </div>
              <div style={{ padding: 14, minHeight: 180 }}>
                {BIO_LINES.map((line, i) => {
                  const r = rendered[i];
                  if (r === null || r === undefined) return null;
                  const isPrompt  = line.startsWith('>');
                  const isGranted = line.includes('ACCESS GRANTED');
                  const isDecrypt = line.includes('Decrypting');
                  const color = isGranted ? '#ffcc00' : isDecrypt ? '#00e5ff' : isPrompt ? '#00ff41' : '#4a9a5a';
                  return (
                    <div key={i} style={{ fontSize: 11, lineHeight: 1.6, minHeight: '1.4em', whiteSpace: 'pre', color, fontWeight: isGranted ? 'bold' : 'normal' }}>
                      {r}
                      {i === activeLineIdx && !done && <Cursor />}
                    </div>
                  );
                })}
                {done && <Cursor />}
              </div>
            </div>

            <Panel>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#00e5ff', marginBottom: 12, borderBottom: '1px solid #0d2a0d', paddingBottom: 8 }}>⬡ Skill Matrix</div>
              {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 120} />)}
            </Panel>
          </div>

          <Panel style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#00e5ff', marginBottom: 10 }}>
              ◉ Activity Log
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 6px #00ff41', marginLeft: 'auto', opacity: liveDot ? 1 : 0.2, transition: 'opacity 0.3s' }} />
              <span style={{ fontSize: 10, color: '#2a5a3a' }}>LIVE</span>
            </div>
            {LOGS.map(l => <LogLine key={l.time} {...l} />)}
          </Panel>
        </div>
      </div>
    </section>
  );
}