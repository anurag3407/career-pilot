import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Cpu, Activity, Compass, Zap, Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Hero({ data }) {
  const personal = data?.personal || {};
  const stats = data?.stats || {};
  const socials = data?.socials || {};

  const [fps, setFps] = useState(60);
  const [viscosityIndex, setViscosityIndex] = useState(4.2);
  const [turbulenceRate, setTurbulenceRate] = useState(0.8);

  // Simulate changing telemetry data for a premium laboratory look
  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(Math.random() * 4 + 58)); // 58-62 FPS
      setViscosityIndex(Number((3.8 + Math.random() * 0.8).toFixed(2)));
      setTurbulenceRate(Number((0.5 + Math.random() * 0.4).toFixed(2)));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleEnterFlow = () => {
    const target = document.getElementById('skills-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dispatch fluid burst on hovering elements
  const triggerHoverBurst = (e) => {
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: { x: e.clientX, y: e.clientY, count: 12 }
    }));
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-white px-6 md:px-12 py-20 overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column: Name, bio, socials */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Dynamic Simulation Active
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="block text-slate-100">Hello, I'm</span>
              <span 
                className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(6,182,212,0.15)]"
                onMouseEnter={triggerHoverBurst}
              >
                {personal.name || 'Creative Developer'}
              </span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-slate-300 max-w-xl">
              {personal.title || 'Full Stack Engineer & WebGL Enthusiast'}
            </p>

            <p className="text-slate-400 max-w-lg leading-relaxed text-sm md:text-base">
              {personal.bio || 'I construct responsive, high-performance web systems where layout structure merges seamlessly with fluid, physics-driven user interactions.'}
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-4"
          >
            {[
              { icon: Github, href: socials.github, label: 'GitHub' },
              { icon: Linkedin, href: socials.linkedin, label: 'LinkedIn' },
              { icon: Twitter, href: socials.twitter, label: 'Twitter' },
              { icon: Mail, href: socials.email ? `mailto:${socials.email}` : undefined, label: 'Email' }
            ].map((s, idx) => {
              if (!s.href) return null;
              const Icon = s.icon;
              return (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={triggerHoverBurst}
                  className="w-11 h-11 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all shadow-md cursor-pointer"
                  title={s.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button type="button"
              onClick={handleEnterFlow}
              onMouseEnter={triggerHoverBurst}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-2.5 transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 cursor-pointer text-sm tracking-wide"
            >
              <span>Explore My Flow</span>
              <Compass className="w-4 h-4 animate-spin-slow" />
            </button>
            
            <a
              href="#contact-section"
              onMouseEnter={triggerHoverBurst}
              className="px-8 py-3.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 backdrop-blur-md rounded-xl text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-all cursor-pointer text-sm"
            >
              <span>Initiate Contact</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right column: Telemetry Dashboard & Floating Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Telemetry Console Card */}
          <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Corner Decors */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                SYSTEM_TELEMETRY.sys
              </span>
              <span className="text-[10px] text-green-400 font-mono bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                GPU_ACCEL: ON
              </span>
            </div>

            {/* Simulated Live Vector Scope */}
            <div className="h-28 bg-slate-950/70 border border-slate-800/50 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <div className="absolute w-full h-[1px] bg-cyan-500/10" />
              <div className="absolute h-full w-[1px] bg-cyan-500/10" />
              
              {/* Dynamic waveform */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60">
                <path
                  d={`M 0 30 Q 30 ${30 + Math.sin(fps)*10} 60 30 T 120 30 T 180 30 T 200 30`}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.45)"
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
                <path
                  d={`M 0 30 Q 40 ${30 - Math.cos(fps)*12} 80 30 T 160 30 T 200 30`}
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.35)"
                  strokeWidth="1"
                  className="transition-all duration-300"
                />
                <circle cx="100" cy="30" r="2.5" fill="#22c55e" className="animate-ping" />
              </svg>
              <div className="absolute bottom-2 right-3 font-mono text-[9px] text-slate-500">
                SWEEP_RATE: {fps}Hz
              </div>
            </div>

            {/* Readout parameters */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
              <div className="bg-slate-950/40 border border-slate-800/30 rounded-lg p-2.5 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Fluid Viscosity</span>
                <span className="block font-mono text-cyan-400 font-bold text-sm">{viscosityIndex} cSt</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/30 rounded-lg p-2.5 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Turbulence Coefficient</span>
                <span className="block font-mono text-indigo-400 font-bold text-sm">{turbulenceRate} k</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/30 rounded-lg p-2.5 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Refresh Frame Rate</span>
                <span className="block font-mono text-green-400 font-bold text-sm">{fps} FPS</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/30 rounded-lg p-2.5 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Vector Loops</span>
                <span className="block font-mono text-amber-400 font-bold text-sm">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Stats widgets layout */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: stats.yearsExperience || '5+', label: 'Experience Years', icon: Cpu },
              { value: stats.projectsCompleted || '45+', label: 'Projects Shipped', icon: Zap },
              { value: stats.happyClients || '30+', label: 'Happy Clients', icon: Compass }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  onMouseEnter={triggerHoverBurst}
                  className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md rounded-xl p-3 text-center shadow-lg hover:border-cyan-500/30 hover:bg-slate-800/30 transition duration-300"
                >
                  <div className="flex justify-center mb-1">
                    <Icon className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <div className="font-mono text-base md:text-lg font-black text-slate-100">{stat.value}</div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Floating scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition cursor-pointer z-10" onClick={handleEnterFlow}>
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Scroll Flow</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </div>
    </section>
  );
}
