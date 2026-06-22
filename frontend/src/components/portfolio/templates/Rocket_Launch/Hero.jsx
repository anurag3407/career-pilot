import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, ChevronDown } from 'lucide-react';
import { AshEmitter, FreeFadeIn } from './Shared';

const heroTextVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ personal, socials }) {
  return (
    <section className="min-h-screen flex flex-col justify-between pt-12 pb-24 relative">
      {/* The AshEmitter relies on this specific keyframe animation. 
        When you broke the file into components, the <style> block from the 
        original index.jsx was likely left behind or lost in the separation.
      */}
      <style>{`
        @keyframes ashRise {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translate(calc(var(--tx) * 0.2), -30px) scale(var(--s)); }
          100% { transform: translate(var(--tx), -200px) scale(0); opacity: 0; }
        }
      `}</style>

      <header className="w-full flex justify-between items-center z-50">
        <span className="font-mono text-xs tracking-widest text-orange-400">HELLO WORLD</span>
        <div className="flex gap-6">
          <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-orange-400 hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] transition-all"><Github size={18} /></a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-orange-400 hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] transition-all"><Linkedin size={18} /></a>
        </div>
      </header>

      <div className="w-full grid md:grid-cols-2 items-center mt-auto mb-auto gap-12 z-10">
        <div className="text-left select-none md:pr-12 relative inline-block">
          <motion.div
            initial="hidden"
            animate="show"
            variants={heroTextVariants}
            className="relative inline-block"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-t from-orange-600 via-amber-200 to-white relative z-10 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              {personal.name}
            </h1>
            <AshEmitter />
          </motion.div>
        </div>
        
        <div className="text-left md:text-right md:pl-12 flex flex-col md:items-end justify-center group">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 24, x: 24, filter: 'blur(6px)' },
              show: {
                opacity: 1,
                y: 0,
                x: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="w-full"
          >
            <div className="relative inline-block">
              <p className="text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 font-mono tracking-wide uppercase relative z-10">
                {personal.title}
              </p>
              <AshEmitter />
            </div>

            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-orange-500 to-yellow-500 my-4 md:ml-auto group-hover:w-full transition-all duration-700 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
            <p className="text-xs font-mono text-slate-400 max-w-sm tracking-widest leading-relaxed">
              SCROLL TO EXPLORE THE PORTFOLIO.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center text-orange-500/60 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}