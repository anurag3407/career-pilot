import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  const { personal } = usePortfolio();

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden z-20 py-20"
    >
      {/* Monochromatic background glow effects (no blues) */}
      <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[130px] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <div 
        className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center select-none"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          <span>Canvas Portfolio</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black font-outfit tracking-tight leading-tight text-white mb-6"
        >
          {personal.name}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-3xl font-light text-slate-300 font-outfit max-w-3xl mb-4 leading-relaxed"
        >
          {personal.title}
        </motion.p>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm md:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed font-light"
        >
          {personal.tagline || 'A blank canvas waiting to be painted with ideas, code, and design.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Premium White/Black luxury button */}
          <button type="button" 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-200 text-black font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer group"
          >
            <span>Explore Portfolio</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
