import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Shield, Terminal, Lock, Cpu, Wifi, Eye, ChevronRight, Code2 } from 'lucide-react';

const PROJECTS = [
  {
    id: "0x01",
    title: "NeuralDash",
    description: "AI-powered analytics dashboard with real-time data visualization, predictive insights, and customizable widget layouts. Built for enterprise teams handling petabyte-scale datasets.",
    techStack: ["React", "Python", "TensorFlow", "WebSocket"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    threat: "CRITICAL",
    icon: Cpu,
    cve: "CVE-2024-0x01",
  },
  {
    id: "0x02",
    title: "PixelForge Studio",
    description: "Browser-based creative suite for digital artists — vector illustration, pixel art, and animation tools. 50K+ monthly active users and counting.",
    techStack: ["Canvas API", "WebGL", "Vue.js", "Rust/WASM"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    threat: "HIGH",
    icon: Eye,
    cve: "CVE-2024-0x02",
  },
  {
    id: "0x03",
    title: "EcoTrack",
    description: "Sustainability platform that helps businesses measure, reduce, and offset their carbon footprint. Features gamified goals and real-time carbon market integration.",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    threat: "MEDIUM",
    icon: Wifi,
    cve: "CVE-2024-0x03",
  },
  {
    id: "0x04",
    title: "Verse — Social Reading",
    description: "Next-generation social reading app where readers annotate, discuss, and discover books together. Built-in AI summarisation and personalised recommendations.",
    techStack: ["React Native", "GraphQL", "MongoDB", "OpenAI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    threat: "CRITICAL",
    icon: Lock,
    cve: "CVE-2024-0x04",
  },
  {
    id: "0x05",
    title: "Pulse CRM",
    description: "Lightweight CRM for indie businesses — contact management, deal pipelines, email sequences, and revenue analytics. Competes with Salesforce at 1% of the price.",
    techStack: ["React", "Express", "MySQL", "Redis"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    threat: "HIGH",
    icon: Shield,
    cve: "CVE-2024-0x05",
  },
  {
    id: "0x06",
    title: "Orbit — 3D Portfolio",
    description: "Interactive 3D portfolio builder powered by Three.js and AI content generation. Users describe their work and the system assembles a stunning 3D showcase in seconds.",
    techStack: ["Three.js", "React", "OpenAI GPT-4", "Vercel"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    threat: "CRITICAL",
    icon: Terminal,
    cve: "CVE-2024-0x06",
  },
];

const THREAT_COLORS = {
  CRITICAL: { bg: "rgba(255,0,64,0.12)", border: "#ff0040", text: "#ff0040", glow: "0 0 12px #ff004080" },
  HIGH:     { bg: "rgba(255,160,0,0.10)", border: "#ffa000", text: "#ffa000", glow: "0 0 12px #ffa00060" },
  MEDIUM:   { bg: "rgba(0,255,136,0.08)", border: "#00ff88", text: "#00ff88", glow: "0 0 12px #00ff8860" },
};

function GlitchText({ text, className = "" }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`relative inline-block ${className}`}>
      <style>{`
        @keyframes glitch-clip {
          0%   { clip-path: inset(0 0 95% 0); transform: translate(-3px,0); }
          20%  { clip-path: inset(40% 0 50% 0); transform: translate(3px,0); }
          40%  { clip-path: inset(70% 0 10% 0); transform: translate(-2px,0); }
          60%  { clip-path: inset(20% 0 70% 0); transform: translate(2px,0); }
          80%  { clip-path: inset(80% 0 5% 0); transform: translate(-1px,0); }
          100% { clip-path: inset(0 0 95% 0); transform: translate(0,0); }
        }
        .glitch-before::before, .glitch-before::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: #00ff88;
        }
        .glitch-before::before {
          color: #ff0040;
          animation: glitch-clip 0.15s linear infinite;
          left: 2px;
        }
        .glitch-before::after {
          color: #00cfff;
          animation: glitch-clip 0.15s linear infinite reverse;
          left: -2px;
        }
      `}</style>
      <span
        data-text={text}
        className={glitching ? "glitch-before" : ""}
      >{text}</span>
    </span>
  );
}

function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-20">
      <style>{`
        @keyframes scan {
          0% { top: -4px; }
          100% { top: 100%; }
        }
        .scan-line { animation: scan 3s linear infinite; }
      `}</style>
      <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />
    </div>
  );
}

function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t0 = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t0);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [started, text]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
}

function HexGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 54,16 54,32 28,46 2,32 2,16" fill="none" stroke="#00ff88" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

function CornerBrackets({ color = "#00ff88" }) {
  return (
    <>
      <span style={{ borderColor: color }} className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" />
      <span style={{ borderColor: color }} className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" />
      <span style={{ borderColor: color }} className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" />
      <span style={{ borderColor: color }} className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" />
    </>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [booting, setBooting] = useState(false);
  const threat = THREAT_COLORS[project.threat];
  const Icon = project.icon;

  const handleHover = (v) => {
    setHovered(v);
    if (v) { setBooting(true); setTimeout(() => setBooting(false), 500); }
  };

  return (
    <div
      className="relative group cursor-default transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card-entry { animation: fadeSlideIn 0.5s ease forwards; opacity:0; animation-delay: ${index * 80}ms; }
        @keyframes pulse-border {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
        .border-pulse { animation: pulse-border 2s ease-in-out infinite; }
        @keyframes data-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .data-scroll { animation: data-scroll 8s linear infinite; }
      `}</style>

      <div
        className="card-entry relative rounded-xl overflow-hidden border transition-all duration-300"
        style={{
          background: hovered ? threat.bg : "rgba(0,255,136,0.03)",
          borderColor: hovered ? threat.border : "rgba(0,255,136,0.2)",
          boxShadow: hovered ? `${threat.glow}, inset 0 0 40px rgba(0,0,0,0.5)` : "none",
        }}
      >
        {/* Scan line on hover */}
        {hovered && <ScanLine />}

        {/* Corner brackets */}
        <CornerBrackets color={hovered ? threat.border : "#00ff8840"} />

        {/* Header bar */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b font-mono text-xs"
          style={{ borderColor: "rgba(0,255,136,0.15)", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-green-500 opacity-60">&gt;&gt;</span>
            <span className="text-green-400 opacity-70">PROJECT_{project.id}</span>
            <span style={{ color: threat.text }} className="opacity-80">[{project.cve}]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold border-pulse"
              style={{
                background: threat.bg,
                color: threat.text,
                border: `1px solid ${threat.border}`,
                textShadow: `0 0 8px ${threat.text}`,
              }}
            >{project.threat}</span>
            <div className="flex gap-1">
              {["w-2 h-2 bg-red-500", "w-2 h-2 bg-yellow-500", "w-2 h-2 bg-green-500"].map((c, i) => (
                <div key={i} className={`${c} rounded-full opacity-70`} />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Title row */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center border transition-all duration-300"
              style={{
                borderColor: hovered ? threat.border : "rgba(0,255,136,0.3)",
                background: hovered ? threat.bg : "rgba(0,255,136,0.05)",
                boxShadow: hovered ? threat.glow : "none",
              }}
            >
              <Icon size={16} style={{ color: hovered ? threat.text : "#00ff88", opacity: 0.9 }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-mono font-bold text-base leading-tight mb-0.5 transition-colors duration-200"
                style={{
                  color: hovered ? threat.text : "#00ff88",
                  textShadow: hovered ? `0 0 10px ${threat.text}` : "0 0 10px #00ff8870",
                }}
              >
                {hovered ? <GlitchText text={project.title} /> : project.title}
              </h3>
              <p className="text-green-600 text-[10px] font-mono opacity-60">
                {booting ? <TypewriterText text="// INITIALIZING PAYLOAD..." delay={0} /> : `// ACCESS LEVEL: ${project.threat}`}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] font-mono leading-relaxed mb-4" style={{ color: "rgba(0,255,136,0.65)" }}>
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono border transition-all duration-200"
                style={{
                  color: hovered ? threat.text : "#00ff88",
                  borderColor: hovered ? `${threat.border}80` : "rgba(0,255,136,0.25)",
                  background: hovered ? threat.bg : "rgba(0,255,136,0.05)",
                  opacity: 0.85,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(0,255,136,0.1)" }}>
            <div className="flex gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all duration-200 hover:scale-105"
                style={{
                  color: "#00ff88",
                  borderColor: "rgba(0,255,136,0.3)",
                  background: "rgba(0,255,136,0.06)",
                }}
              >
                <Github size={12} />
                <span>SOURCE</span>
              </a>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all duration-200 hover:scale-105"
                style={{
                  color: threat.text,
                  borderColor: `${threat.border}60`,
                  background: threat.bg,
                  boxShadow: hovered ? `0 0 8px ${threat.border}40` : "none",
                }}
              >
                <ExternalLink size={12} />
                <span>DEPLOY</span>
              </a>
            </div>
            <div className="flex items-center gap-1 opacity-40">
              <Code2 size={10} style={{ color: "#00ff88" }} />
              <span className="text-[10px] font-mono text-green-500">v{Math.floor(Math.random() * 3 + 1)}.{Math.floor(Math.random() * 9)}.{Math.floor(Math.random() * 9)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { if (++i >= PROJECTS.length) clearInterval(t); setCount(i); }, 120);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <Terminal size={18} className="text-green-400" />
        <span className="font-mono text-green-500 text-sm opacity-60">root@portfolio:~$</span>
        <span className="font-mono text-green-300 text-sm">ls -la ./projects/</span>
      </div>
      <div className="font-mono text-[11px] text-green-700 mb-6 ml-1">
        <span>Found </span>
        <span className="text-green-400">{count}</span>
        <span>/{PROJECTS.length} project entries. Scanning for vulnerabilities...</span>
      </div>

      <div className="relative flex items-end gap-4">
        <div>
          <div className="text-[10px] font-mono text-green-700 mb-1 tracking-widest">// CLASSIFIED INTEL</div>
          <h2 className="font-mono font-black text-4xl sm:text-5xl leading-none" style={{ color: "#00ff88", textShadow: "0 0 30px #00ff8870, 0 0 60px #00ff8830" }}>
            <GlitchText text="PROJECTS" />
          </h2>
        </div>
        <div className="mb-1 hidden sm:block">
          <div className="w-px h-12 bg-green-800 mx-4" />
        </div>
        <div className="mb-1 hidden sm:flex flex-col justify-end gap-1">
          {[
            { label: "TOTAL", value: `${PROJECTS.length} MODULES` },
            { label: "STATUS", value: "OPERATIONAL" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-green-700 text-[10px] font-mono">{label}:</span>
              <span className="text-green-400 text-[10px] font-mono">{value}</span>
            </div>
          ))}
        </div>

        {/* Threat legend */}
        <div className="ml-auto mb-1 hidden md:flex items-center gap-3">
          {Object.entries(THREAT_COLORS).map(([level, colors]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: colors.border, boxShadow: colors.glow }} />
              <span className="font-mono text-[10px]" style={{ color: colors.text }}>{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #00ff88, transparent)" }} />
        <ChevronRight size={12} className="text-green-500" />
        <ChevronRight size={12} className="text-green-400" />
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      className="relative w-full min-h-screen py-16 px-4 sm:px-8 overflow-hidden"
      style={{ background: "#020c05", fontFamily: "'Courier New', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        #cyber-projects * { font-family: 'Share Tech Mono', 'Courier New', monospace; }
        @keyframes circuit-flow {
          0%   { stroke-dashoffset: 1000; opacity: 0.15; }
          50%  { opacity: 0.35; }
          100% { stroke-dashoffset: 0; opacity: 0.15; }
        }
        .circuit-path { animation: circuit-flow 6s linear infinite; stroke-dasharray: 1000; }
        @keyframes grid-pulse {
          0%,100% { opacity: 0.04; }
          50%      { opacity: 0.07; }
        }
        .grid-bg { animation: grid-pulse 4s ease-in-out infinite; }
        @keyframes float-dot {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50%      { transform: translateY(-8px) scale(1.4); opacity: 1; }
        }
      `}</style>

      <div id="cyber-projects" className="relative max-w-6xl mx-auto">

        {/* Background: dot grid */}
        <div className="grid-bg pointer-events-none absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.7" fill="#00ff88" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Circuit SVG decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="absolute top-0 right-0 w-72 h-72 opacity-10" viewBox="0 0 200 200">
            <polyline className="circuit-path" points="180,10 180,50 120,50 120,100 160,100 160,180" fill="none" stroke="#00ff88" strokeWidth="1.5"/>
            <polyline className="circuit-path" points="10,80 60,80 60,120 100,120 100,60 150,60" fill="none" stroke="#00ff88" strokeWidth="1"/>
            <circle cx="180" cy="10" r="3" fill="#00ff88" opacity="0.5"/>
            <circle cx="60" cy="120" r="2.5" fill="#00ff88" opacity="0.5"/>
            <circle cx="100" cy="60" r="2" fill="#00ff88" opacity="0.5"/>
          </svg>
          <svg className="absolute bottom-0 left-0 w-56 h-56 opacity-10" viewBox="0 0 160 160">
            <polyline className="circuit-path" points="10,150 10,100 50,100 50,60 100,60 100,20" fill="none" stroke="#00ff88" strokeWidth="1.5"/>
            <circle cx="10" cy="150" r="3" fill="#00ff88" opacity="0.5"/>
            <circle cx="100" cy="20" r="3" fill="#00ff88" opacity="0.5"/>
          </svg>
        </div>

        {/* Header */}
        <TerminalHeader />

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Footer terminal line */}
        <div className="mt-10 flex items-center gap-3">
          <div className="h-px flex-1 opacity-20" style={{ background: "linear-gradient(to right, transparent, #00ff88, transparent)" }} />
        </div>
        <div className="mt-3 font-mono text-[11px] text-green-800 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-green-600">root@portfolio:~$</span>
          <span>ALL SYSTEMS NOMINAL. {PROJECTS.length} PROJECTS LOADED. STANDING BY...</span>
          <span className="ml-auto opacity-50 animate-pulse">█</span>
        </div>
      </div>
    </section>
  );
}