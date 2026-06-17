import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Github, Linkedin, Twitter } from 'lucide-react';

export default function Hero({ data }) {
  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center px-6 md:px-12 max-w-6xl mx-auto overflow-hidden">
      
      {/* Front-layer decorative fluid shapes */}
      <div className="absolute right-10 top-1/4 w-72 h-72 md:w-[480px] md:h-[480px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 opacity-10 liquid-shape blur-xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="flex items-center gap-3 mb-6 font-mono text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 w-fit liquid-shape-fast">
          <Terminal className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Fluid.Engine.Active</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-4 relative z-10 mix-blend-plus-lighter">
          {data.personal.name}
        </h1>
        
        <h2 className="text-2xl md:text-4xl text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text font-bold mb-8">
          {data.personal.title}
        </h2>
        
        <div className="flex gap-4">
          {data.socials.github && (
            <a href={data.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-full hover:border-indigo-500 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/30 liquid-shape opacity-0 group-hover:opacity-100" />
              <Github className="w-5 h-5 relative z-10" />
            </a>
          )}
          {data.socials.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-full hover:border-cyan-500 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/30 liquid-shape-fast opacity-0 group-hover:opacity-100" />
              <Linkedin className="w-5 h-5 relative z-10" />
            </a>
          )}
          {data.socials.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-full hover:border-purple-500 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute inset-0 bg-purple-500/30 liquid-shape opacity-0 group-hover:opacity-100" />
              <Twitter className="w-5 h-5 relative z-10" />
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}