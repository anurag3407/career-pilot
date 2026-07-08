import React, { useState, useEffect, useRef } from 'react';
import './Projects.css';
import {
  Compass,
  Radio,
  Waves,
  Cpu,
  Layers,
  FolderGit2,
  Activity,
  Terminal,
  Anchor,
  GitPullRequest,
  ExternalLink,
  Github,
  Star,
  Volume2,
  VolumeX,
  Gauge,
  ShieldAlert,
  Info
} from 'lucide-react';

// Hydrographic projects data categorized by depth layers
const DEFAULT_PROJECTS = [
  {
    id: 'nautilus-ui',
    title: 'Nautilus Fluid UI',
    description: 'A fluid-dynamics inspired web design system with liquid animation curves, bioluminescent styling tokens, and hardware-accelerated layouts.',
    zone: 'epipelagic',
    depthRange: '0m - 200m',
    bearing: '045° NE',
    range: '120m',
    frequency: '48.2 kHz',
    integrity: '98%',
    pressure: '12 ATM',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Canvas'],
    targetType: 'CLIENT-HULL',
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: 'poseidon-routing',
    title: 'Poseidon Core Gateway',
    description: 'Ultra-low latency streaming edge gateway managing high-concurrency websocket channels and client socket connections during heavy routing traffic.',
    zone: 'epipelagic',
    depthRange: '0m - 200m',
    bearing: '135° SE',
    range: '240m',
    frequency: '45.0 kHz',
    integrity: '95%',
    pressure: '18 ATM',
    tech: ['Node.js', 'WebSockets', 'Redis', 'Docker'],
    targetType: 'SIGNAL-BUOY',
    liveUrl: '#',
    githubUrl: '#',
    featured: false
  },
  {
    id: 'biolume-search',
    title: 'Biolume Neural Search',
    description: 'Semantic data parsing model utilizing localized optical wave transmissions, modeled on biological deep-sea light communications.',
    zone: 'mesopelagic',
    depthRange: '200m - 1000m',
    bearing: '280° W',
    range: '380m',
    frequency: '41.5 kHz',
    integrity: '92%',
    pressure: '85 ATM',
    tech: ['Python', 'FastAPI', 'PyTorch', 'Qdrant'],
    targetType: 'GLOW-ARRAY',
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: 'abyssal-ledger',
    title: 'Abyssal Distributed Ledger',
    description: 'Pressure-tolerant secure data distribution engine designed to achieve complete data availability across highly fragmented deep trench nodes.',
    zone: 'bathypelagic',
    depthRange: '1000m - 4000m',
    bearing: '190° S',
    range: '510m',
    frequency: '35.8 kHz',
    integrity: '89%',
    pressure: '340 ATM',
    tech: ['Go', 'gRPC', 'PostgreSQL', 'IPFS'],
    targetType: 'TRENCH-NODE',
    liveUrl: '#',
    githubUrl: '#',
    featured: false
  },
  {
    id: 'kraken-engine',
    title: 'Kraken High-Pressure DB',
    description: 'Extreme database indexing middleware optimized to maintain perfect relational mapping under severe hydrostatic concurrent query load.',
    zone: 'abyssal',
    depthRange: '4000m+',
    bearing: '315° NW',
    range: '680m',
    frequency: '29.4 kHz',
    integrity: '97%',
    pressure: '820 ATM',
    tech: ['Rust', 'Tokio', 'Cassandra', 'GraphQL'],
    targetType: 'DEEP-VENT',
    liveUrl: '#',
    githubUrl: '#',
    featured: true
  }
];

export default function Projects({ projects = DEFAULT_PROJECTS }) {
  const [activeZone, setActiveZone] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transmitting, setTransmitting] = useState(false);
  const [transmitPercent, setTransmitPercent] = useState(0);
  const [sysTime, setSysTime] = useState('');
  
  // Audio state
  const audioCtxRef = useRef(null);

  // Update telemetry clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setSysTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API Synthesizer for high-fidelity submarine sonar "pings"
  const playSonarPing = (customFreq = 900, duration = 1.4) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      // Initialize Context lazily on user interaction due to browser policies
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      
      // Resume if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(customFreq, ctx.currentTime);
      // Sweep/decay frequency downwards (classic sonar echo)
      osc.frequency.exponentialRampToValueAtTime(customFreq / 2.2, ctx.currentTime + duration * 0.35);
      
      // Amplitude decay trail
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.1);
    } catch (e) {
      console.warn('Audio context blocked or unsupported by runtime environment:', e);
    }
  };

  // Play light cursor echo click
  const playSonarTick = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  // Cursor tracker spotlight logic
  const handlePointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
    card.style.setProperty('--glow-opacity', '1');
  };

  const handlePointerLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--glow-opacity', '0');
  };

  // Filter projects by subsea zone
  const filteredProjects = activeZone === 'all' 
    ? projects 
    : projects.filter(p => p.zone === activeZone);

  // Trigger telemetry link pull request transmission sequence
  const handlePRTransmission = () => {
    if (transmitting) return;
    setTransmitting(true);
    setTransmitPercent(0);
    playSonarPing(700, 2.5);

    const interval = setInterval(() => {
      setTransmitPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          playSonarPing(1100, 1.2);
          setTimeout(() => {
            setTransmitting(false);
            window.open('https://github.com/Yash191220/Yash-career-pilot/compare/main...feature/submarine-sonar-theme', '_blank');
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 90);
  };

  // Glow color scheme per depth zone
  const getZoneStyles = (zone) => {
    switch (zone) {
      case 'epipelagic':
        return {
          badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          hoverGlow: 'rgba(34, 211, 238, 0.14)',
          textAccent: 'text-cyan-400',
          borderAccent: 'border-cyan-500/20 group-hover:border-cyan-400/60',
          shadowAccent: 'group-hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]'
        };
      case 'mesopelagic':
        return {
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          hoverGlow: 'rgba(59, 130, 246, 0.14)',
          textAccent: 'text-blue-400',
          borderAccent: 'border-blue-500/20 group-hover:border-blue-400/60',
          shadowAccent: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.18)]'
        };
      case 'bathypelagic':
        return {
          badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          hoverGlow: 'rgba(99, 102, 241, 0.14)',
          textAccent: 'text-indigo-400',
          borderAccent: 'border-indigo-500/20 group-hover:border-indigo-400/60',
          shadowAccent: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.18)]'
        };
      case 'abyssal':
        return {
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          hoverGlow: 'rgba(16, 185, 129, 0.14)',
          textAccent: 'text-emerald-400',
          borderAccent: 'border-emerald-500/20 group-hover:border-emerald-400/60',
          shadowAccent: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]'
        };
      default:
        return {
          badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          hoverGlow: 'rgba(255, 255, 255, 0.08)',
          textAccent: 'text-white',
          borderAccent: 'border-slate-800 group-hover:border-slate-700',
          shadowAccent: ''
        };
    }
  };

  return (
    <section id="projects" className="w-full bg-[#020713] text-cyan-100 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-mono select-none border-t border-cyan-900/20">
      


      {/* Underwater Grid Backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #0891b2 1px, transparent 1px),
                            linear-gradient(to bottom, #0891b2 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Atmospheric marine floaters */}
      <div className="absolute bottom-0 top-0 left-0 right-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-0 w-3 h-3 bg-cyan-400 rounded-full blur-[1px] hydro-bubble-1" />
        <div className="absolute bottom-0 w-2.5 h-2.5 bg-blue-500 rounded-full blur-[1px] hydro-bubble-2" />
        <div className="absolute bottom-0 w-4 h-4 bg-emerald-400 rounded-full blur-[2px] hydro-bubble-3" />
      </div>

      {/* Ocean glow zones */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-950/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-950/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Cockpit telemetry header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-cyan-500/20 pb-8 mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold">SUBMERGED PROJECT DATABASE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-mono uppercase">
              HYDRO <span className="text-cyan-400 hydro-glow-text">ANOMALIES</span>
            </h2>
            <p className="text-xs text-cyan-300/50 mt-2 max-w-xl font-mono leading-relaxed">
              Active echo-location telemetry representing core systems and applications mapped by hydrographic density layers.
            </p>
          </div>

          {/* Sound & Telemetry display widgets */}
          <div className="flex items-center gap-4 bg-slate-900/60 border border-cyan-500/15 rounded-xl p-3.5 backdrop-blur-md self-stretch lg:self-auto justify-between">
            <div className="text-left font-mono">
              <div className="text-[9px] text-cyan-500/50 uppercase tracking-widest">CLOCK READOUT</div>
              <div className="text-base font-bold text-cyan-300 tracking-widest">{sysTime || '09:14:26'}</div>
            </div>
            <div className="h-8 w-px bg-cyan-500/20" />
            <button 
              onClick={() => { setSoundEnabled(!soundEnabled); playSonarPing(soundEnabled ? 440 : 880, 0.8); }}
              className={`p-2.5 rounded-lg transition-all border ${
                soundEnabled 
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
              title={soundEnabled ? "Mute Sonar Audio" : "Unmute Sonar Audio"}
            >
              {soundEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Depth Level Selection Deck */}
        <div className="flex flex-wrap gap-2 mb-12 bg-slate-950/50 border border-cyan-500/10 p-2 rounded-2xl backdrop-blur-lg">
          {[
            { id: 'all', name: 'ALL DEPTHS', zoneDesc: '0 - 10,000m', icon: Compass },
            { id: 'epipelagic', name: 'EPIPELAGIC', zoneDesc: '0 - 200m', icon: Waves },
            { id: 'mesopelagic', name: 'MESOPELAGIC', zoneDesc: '200 - 1000m', icon: Activity },
            { id: 'bathypelagic', name: 'BATHYPELAGIC', zoneDesc: '1000 - 4000m', icon: Layers },
            { id: 'abyssal', name: 'ABYSSAL ZONE', zoneDesc: '4000m+', icon: Cpu },
          ].map((zone) => {
            const Icon = zone.icon;
            const isSelected = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => { setActiveZone(zone.id); playSonarPing(isSelected ? 600 : 780, 1.0); }}
                className={`flex-1 min-w-[140px] flex items-center gap-3 px-4 py-3 rounded-xl transition-all border font-mono text-left cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400/80 text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'bg-slate-900/20 border-transparent text-cyan-300/40 hover:bg-cyan-950/20 hover:text-cyan-300'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-cyan-500/30'}`} />
                <div className="leading-tight">
                  <div className="text-[10px] font-bold tracking-wider">{zone.name}</div>
                  <div className="text-[8px] text-cyan-500/50 mt-0.5">{zone.zoneDesc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Project Acoustic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((p) => {
            const styles = getZoneStyles(p.zone);
            return (
              <div
                key={p.id}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onMouseEnter={playSonarTick}
                style={{
                  '--glow-color': styles.hoverGlow,
                }}
                className={`group relative overflow-hidden rounded-2xl bg-slate-950/70 border backdrop-blur-xl p-6 md:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 cursor-crosshair z-10 ${styles.borderAccent} ${styles.shadowAccent}`}
              >
                
                {/* Visual mouse tracker spotlight glow layer */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 reveal-layer"
                  style={{
                    background: `radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glow-color, rgba(34, 211, 238, 0.12)), transparent 80%)`
                  }}
                />

                {/* Technical Grid overlay inside card */}
                <div className="absolute inset-0 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity pointer-events-none z-0 bg-[linear-gradient(rgba(34,211,238,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.15)_1px,transparent_1px)] bg-[size:16px_16px]" />

                {/* Dynamic radar tracking reticle (bottom-right decor) */}
                <div className="absolute right-3 bottom-3 w-28 h-28 border border-cyan-500/5 rounded-full overflow-hidden pointer-events-none z-0 group-hover:border-cyan-500/15 transition-colors">
                  <div className="absolute inset-0 rounded-full border border-cyan-500/5 pointer-events-none" />
                  <div className="absolute inset-[25%] rounded-full border border-cyan-500/5 border-dashed pointer-events-none" />
                  <div className="absolute inset-[50%] rounded-full border border-cyan-500/10 pointer-events-none" />
                  {/* Sweep needle */}
                  <div className="absolute inset-0 rounded-full origin-center hydro-sonar-sweep">
                    <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-t from-cyan-400/50 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.3)]" />
                  </div>
                </div>

                <div className="relative z-10">
                  
                  {/* Target designator */}
                  <div className="flex justify-between items-start border-b border-cyan-500/10 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Anchor className={`h-4 w-4 ${styles.textAccent} animate-pulse`} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                        {p.targetType} // {p.zone.toUpperCase()}
                      </span>
                    </div>
                    {p.featured && (
                      <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[8px] font-bold px-2 py-0.5 rounded-full tracking-widest animate-pulse">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Project naming */}
                  <h3 className="text-xl font-bold tracking-wider text-white mb-2 group-hover:text-cyan-300 transition-colors uppercase leading-snug">
                    {p.title}
                  </h3>

                  {/* Scientific Description */}
                  <p className="text-[11px] text-cyan-300/60 leading-relaxed font-sans mb-5 max-w-[95%]">
                    {p.description}
                  </p>

                  {/* Local Sound Echo Bearing Metrics */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/40 border border-cyan-500/5 p-3 rounded-lg font-mono text-[9px] text-cyan-400/70 mb-5">
                    <div>
                      <span className="text-cyan-500/40 uppercase block">BEARING</span>
                      <span className="text-white font-bold">{p.bearing}</span>
                    </div>
                    <div>
                      <span className="text-cyan-500/40 uppercase block">RANGE</span>
                      <span className="text-white font-bold">{p.range}</span>
                    </div>
                    <div className="border-t border-cyan-500/5 pt-1.5 mt-0.5">
                      <span className="text-cyan-500/40 uppercase block">INTEGRITY</span>
                      <span className="text-cyan-300 font-bold">{p.integrity}</span>
                    </div>
                    <div className="border-t border-cyan-500/5 pt-1.5 mt-0.5">
                      <span className="text-cyan-500/40 uppercase block">PRESSURE</span>
                      <span className="text-cyan-300 font-bold">{p.pressure}</span>
                    </div>
                  </div>

                  {/* Applied Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-[8px] font-bold px-2 py-1 rounded border tracking-wider ${styles.badgeBg}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Subsea action triggers */}
                <div className="flex items-center gap-3 relative z-10 border-t border-cyan-500/10 pt-4 mt-2">
                  <a
                    href={p.liveUrl}
                    onClick={() => playSonarPing(1000, 0.8)}
                    className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/35 hover:to-blue-600/35 text-cyan-200 hover:text-white border border-cyan-500/35 py-2 px-3 rounded-xl font-bold text-[10px] tracking-widest flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>SONAR SEARCH</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={p.githubUrl}
                    onClick={() => playSonarPing(800, 0.7)}
                    className="bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-500/40 p-2 rounded-xl transition-all"
                    title="Inspect Source Code"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* PR-1351 TELEMETRY UPLINK CONTROLLER TERMINAL */}
        <div className="w-full bg-[#030d22]/90 border border-cyan-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
          
          {/* Dashboard borders */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400" />

          {/* Glowing scanner line when transmitting */}
          {transmitting && (
            <div 
              className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] pointer-events-none"
              style={{
                top: `${transmitPercent}%`,
                transition: 'top 90ms linear'
              }}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Telemetry metadata status display */}
            <div className="lg:col-span-7 font-mono">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">PR-1351 TELEMETRY LINK</span>
              </div>
              
              <h4 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-3 leading-snug">
                BROADCAST STAGE: PENDING MAIN UPLINK
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 border border-cyan-500/10 p-3 rounded-xl text-[9px] text-cyan-400/80 mb-2">
                <div>
                  <span className="text-cyan-500/40 uppercase block">NODE IDENTITY</span>
                  <span className="text-white font-bold">YASH-PILOT-PROBE</span>
                </div>
                <div>
                  <span className="text-cyan-500/40 uppercase block">ACTIVE BRANCH</span>
                  <span className="text-white font-bold">feature/submarine-sonar-theme</span>
                </div>
                <div>
                  <span className="text-cyan-500/40 uppercase block">SIGNAL QUALITY</span>
                  <span className="text-emerald-400 font-bold">100% EXCELLENT</span>
                </div>
              </div>

              <p className="text-[10px] text-cyan-300/40 leading-relaxed max-w-2xl mt-3 font-sans">
                Acoustic diagnostics are complete. Activating the link below launches safe hydrostatic channel transmission, delivering completed portfolio schematics for Merge Review #1351.
              </p>
            </div>

            {/* Transmission Action Area */}
            <div className="lg:col-span-5 flex flex-col justify-center items-stretch lg:pl-4">
              
              {transmitting ? (
                <div className="border border-cyan-500/25 bg-cyan-950/10 rounded-xl p-5 text-center font-mono relative">
                  <div className="text-cyan-400 font-bold text-sm tracking-widest animate-pulse mb-2 uppercase">
                    TRANSMITTING SECTOR DATA...
                  </div>
                  <div className="h-2 w-full bg-slate-900 border border-cyan-900 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100 ease-out" 
                      style={{ width: `${transmitPercent}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-cyan-400/60 uppercase tracking-widest">
                    Telemetry Packet: {transmitPercent}% complete
                  </div>
                </div>
              ) : (
                <button
                  onClick={handlePRTransmission}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:text-black py-4 px-6 rounded-xl font-mono font-bold text-xs tracking-[0.18em] flex items-center justify-center gap-3 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-[1.01] cursor-pointer uppercase"
                >
                  <GitPullRequest className="h-4.5 w-4.5 animate-bounce" />
                  INITIALIZE TELEMETRY TRANSMISSION // PR #1351
                </button>
              )}
              
              <div className="flex items-center gap-2 justify-center mt-3 text-[8px] text-cyan-500/40 uppercase tracking-wider">
                <Gauge className="h-3 w-3" />
                <span>Node encryption enabled // secure military channel active</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
