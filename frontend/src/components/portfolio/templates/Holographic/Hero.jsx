import React from 'react';
import { Sparkles, ArrowRight, Mail, Cpu, Terminal } from 'lucide-react';

export default function Hero({
  name = "Alex Johnson",
  title = "Full Stack Developer",
  tagline = "Building the future, one line at a time.",
  avatarUrl = "",
  onViewWork = () => {},
  onContactMe = () => {},
  skills = ["React", "TailwindCSS", "Node.js", "TypeScript", "Next.js"],
}) {
  // Extract initials for fallback avatar
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AJ';

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#070913] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Inline styles for custom holographic and keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shifting-hue {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(0.97); }
        }
        @keyframes spin-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-shifting-hue {
          animation: shifting-hue 20s linear infinite;
        }
        .animate-scanline {
          animation: scanline 10s linear infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-spin-gradient {
          animation: spin-gradient 8s linear infinite;
        }
        .animate-sweep {
          animation: sweep 2s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 2.5s ease-in-out infinite;
        }
      `}} />

      {/* Iridescent Shifting Hue Background Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 animate-shifting-hue z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-indigo-500/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(217,70,239,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.15),transparent_60%)]" />
      </div>

      {/* Floating Blurred Orbs for Holographic Depth */}
      <div className="absolute top-1/4 left-1/12 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/12 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl animate-float-delayed pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl animate-float-slow pointer-events-none z-0" style={{ animationDelay: '-3s' }} />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-pink-500/5 blur-3xl animate-float-delayed pointer-events-none z-0" style={{ animationDelay: '-4s' }} />

      {/* SVG scanline overlay for hologram texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] z-10" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="holo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-cyan-400/25" />
              <circle cx="40" cy="0" r="1" className="fill-cyan-400/40" />
              <circle cx="0" cy="40" r="1" className="fill-cyan-400/40" />
            </pattern>
            <pattern id="holo-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="1" className="fill-cyan-300/30" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#holo-grid)" />
          <rect width="100%" height="100%" fill="url(#holo-scanlines)" />
        </svg>
      </div>

      {/* Traveling Laser Scan Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scanline" />
      </div>

      {/* Glassmorphism Hero Card Container */}
      <div className="relative z-20 w-full max-w-4xl backdrop-blur-xl bg-slate-950/40 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(6,182,212,0.1)] hover:shadow-[0_0_60px_rgba(139,92,246,0.2)] transition-all duration-500">
        
        {/* Hologram Corner Brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg pointer-events-none" />

        {/* HUD Top Bar */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono tracking-widest text-cyan-400/60 mb-8 border-b border-cyan-950/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-blink" />
            <span className="font-semibold">HOLO_INTERFACE: PROT_v4.1</span>
          </div>
          <div className="hidden sm:block">SYS_STATUS: ACTIVE</div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-12 w-full">
          
          {/* Avatar Area (First on mobile layout structure, but ordered on-screen via layout) */}
          <div className="flex-shrink-0 order-1 lg:order-2 relative">
            <div className="relative group">
              {/* Outer rotating conic-gradient glow */}
              <div className="absolute -inset-2 rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#818cf8,#ec4899,#3b82f6,#22d3ee)] opacity-60 blur-md animate-spin-gradient group-hover:opacity-90 group-hover:blur-lg transition-all duration-300" />
              
              {/* Sharp rotating conic-gradient border */}
              <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#818cf8,#ec4899,#3b82f6,#22d3ee)] animate-spin-gradient" />
              
              {/* Inner Circle Frame */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-[#0a0d1a] flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center font-mono select-none">
                    <span className="text-4xl md:text-5xl font-black bg-gradient-to-tr from-cyan-400 via-sky-300 to-violet-500 bg-clip-text text-transparent tracking-tighter">
                      {initials}
                    </span>
                  </div>
                )}
                {/* Holographic grid and glare filters on avatar */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute inset-2 rounded-full border border-cyan-500/10 pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-cyan-500/5 pointer-events-none" />
              </div>
            </div>
            
            {/* HUD Scan target marks */}
            <div className="absolute -top-2 -left-2 text-cyan-400/40 font-mono text-[9px]">◱</div>
            <div className="absolute -top-2 -right-2 text-cyan-400/40 font-mono text-[9px]">◲</div>
            <div className="absolute -bottom-2 -left-2 text-cyan-400/40 font-mono text-[9px]">◰</div>
            <div className="absolute -bottom-2 -right-2 text-cyan-400/40 font-mono text-[9px]">◳</div>
          </div>

          {/* Text Content Area */}
          <div className="flex-1 order-2 lg:order-1 text-center lg:text-left space-y-6 max-w-xl">
            
            {/* Futuristic Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/35 bg-cyan-950/30 text-cyan-300 font-mono text-xs tracking-wider uppercase shadow-[0_0_12px_rgba(6,182,212,0.1)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>TRANSMISSION ONLINE</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-500 bg-clip-text text-transparent">
                  {name}
                </span>
              </h1>
              <h2 className="text-md sm:text-lg md:text-xl font-mono tracking-wider text-cyan-400 font-medium uppercase">
                {title}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-light">
              {tagline}
            </p>

            {/* Holographic Skill Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400/70 justify-center lg:justify-start">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>SYS_SCHEMATICS</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-mono rounded border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.05)] hover:border-cyan-400/50 hover:bg-cyan-950/40 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onViewWork}
                className="relative group w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest text-cyan-200 overflow-hidden transition-all duration-300 hover:scale-105 border border-cyan-400/50 bg-cyan-950/40 hover:bg-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer"
              >
                {/* Sweep animation on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />
                <span className="relative flex items-center justify-center gap-2">
                  <span>View Work</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={onContactMe}
                className="relative group w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest text-violet-200 overflow-hidden transition-all duration-300 hover:scale-105 border border-violet-400/50 bg-violet-950/40 hover:bg-violet-400/20 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] cursor-pointer"
              >
                {/* Sweep animation on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-violet-400/20 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />
                <span className="relative flex items-center justify-center gap-2">
                  <span>Contact Me</span>
                  <Mail className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
                </span>
              </button>
            </div>

          </div>

        </div>

        {/* HUD Bottom Bar Details */}
        <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400/30 mt-8 pt-4 border-t border-cyan-950/60 justify-center sm:justify-start">
          <Terminal className="w-3 h-3 text-cyan-500/40" />
          <span>CONNECTED TO CENTRAL CORE DIRECTORY | ALL RIGHTS SCAN_SECURED</span>
        </div>

      </div>
    </section>
  );
}
