import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Terminal, FileText, Cpu, Crosshair } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function ResumeCTA() {
  const [isHovered, setIsHovered] = useState(false);
  const stats = data?.stats || {};

  return (
    <section className="relative w-full py-12 px-4 md:py-20 md:px-12 bg-slate-950 font-mono text-cyan-400 overflow-hidden border-y border-cyan-900/50 select-none">
      
      {/* Background Grid Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Global Scanline Overlay */}
      <motion.div
        className="absolute inset-0 w-full h-[1px] bg-cyan-400/10 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm p-8 md:p-12 rounded shadow-[inset_0_0_30px_rgba(8,145,178,0.15)]">
        
        {/* HUD Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

        {/* Left Side: Terminal Output / Data Info */}
        <div className="flex-1 space-y-5 w-full">
          <div className="flex items-center gap-2 text-cyan-500 mb-2 border-b border-cyan-900/50 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-bold">Resume</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-100">
            View Resume
          </h2>
          
          <div className="text-cyan-300/70 text-sm md:text-base max-w-lg leading-relaxed border-l-2 border-cyan-800 pl-4 space-y-1">
            <p className="animate-pulse">{'>'} INITIATING SECURE TRANSFER...</p>
            <p>{'>'} COMPILING COMPREHENSIVE CAREER LOGS.</p>
            <p>{'>'} FULL SYSTEM OVERVIEW READY FOR EXTRACTION.</p>
          </div>
          
          {/* Faux System Stats */}
          <div className="flex flex-wrap items-center gap-4 pt-4 text-[11px] md:text-xs">
            <div className="flex flex-col bg-cyan-950/50 p-2 border border-cyan-900/50 rounded">
              <span className="text-cyan-600 mb-1">YEARS</span>
              <span className="text-cyan-300 font-bold">{stats?.yearsExperience || '—'}</span>
            </div>
            <div className="flex flex-col bg-cyan-950/50 p-2 border border-cyan-900/50 rounded">
              <span className="text-cyan-600 mb-1">PROJECTS</span>
              <span className="text-cyan-300 font-bold">{stats?.projectsCompleted || '—'}</span>
            </div>
            <div className="flex flex-col bg-cyan-950/50 p-2 border border-cyan-900/50 rounded">
              <span className="text-cyan-600 mb-1">HAPPY_CLIENTS</span>
              <span className="text-cyan-400 font-bold">{stats?.happyClients || '—'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive CTA Button */}
        <div className="relative group flex-shrink-0">
          
          {/* Animated Targeting Reticle */}
          <motion.div 
            className="absolute -inset-6 border border-dashed border-cyan-500/0 group-hover:border-cyan-500/40 rounded-full transition-colors duration-500 pointer-events-none"
            animate={isHovered ? { rotate: 90, scale: 1 } : { rotate: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <Crosshair className={`absolute -top-10 -right-10 w-6 h-6 text-cyan-500/50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          <motion.button
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-3 px-6 py-4 bg-cyan-950/80 border border-cyan-400 text-cyan-100 font-bold tracking-[0.15em] uppercase overflow-hidden group hover:text-white transition-colors duration-200 shadow-[0_0_12px_rgba(34,211,238,0.12)] hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]"
          >
            {/* Hover Scanner Beam */}
            <motion.div 
              className="absolute top-0 left-0 w-1.5 h-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]"
              animate={isHovered ? { x: ['-100%', '800%'] } : { x: '-100%' }}
              transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
            />
            
            <FileText className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Extract_Resume</span>
            <Download className="w-5 h-5 relative z-10" />
            
            {/* Background Hover Glow */}
            <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

        </div>
      </div>

      {/* Decorative Bottom System Bar */}
      <div className="max-w-5xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-cyan-600 tracking-widest border-t border-cyan-900/30 pt-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          <span>SYS.VER.4.0.9 // ONLINE</span>
        </div>
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-1 ${i > 3 ? 'bg-cyan-900/50' : 'bg-cyan-500/50'}`} 
            />
          ))}
        </div>
        <span>SEC_PRTCL: ACTIVE</span>
      </div>
      
    </section>
  );
}