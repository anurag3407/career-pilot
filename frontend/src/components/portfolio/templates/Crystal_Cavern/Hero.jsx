import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Crystal } from './Crystal';

export default function Hero({ personal, socials }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <Crystal className="top-1/4 left-1/4" size="w-48 h-48" duration={6} />
      <Crystal className="top-2/3 right-1/4" size="w-64 h-64" delay={1} duration={8} color="from-emerald-500/20 via-teal-500/10 to-indigo-500/20" />
      <Crystal className="top-1/3 right-1/3" size="w-24 h-24" delay={2} duration={5} color="from-purple-500/20 via-pink-500/10 to-rose-500/20" />
      <Crystal className="bottom-1/4 left-1/3" size="w-32 h-32" delay={0.5} duration={7} />

      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm text-purple-300 text-sm font-medium tracking-wider"
        >
          {personal?.location}
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-purple-500"
          style={{ backgroundSize: '200% auto' }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {personal?.name}
        </motion.h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light mb-10 max-w-2xl mx-auto">
          {personal?.title}
        </p>
        <div className="flex items-center justify-center gap-6">
          {socials?.github && <a href={socials.github} aria-label="GitHub profile" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors"><Github size={28} /></a>}
          {socials?.linkedin && <a href={socials.linkedin} aria-label="LinkedIn profile" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors"><Linkedin size={28} /></a>}
          {socials?.twitter && <a href={socials.twitter} aria-label="Twitter profile" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-purple-400 transition-colors"><Twitter size={28} /></a>}
          {socials?.email && <a href={`mailto:${socials.email}`} aria-label="Email contact" className="text-slate-400 hover:text-emerald-400 transition-colors"><Mail size={28} /></a>}
        </div>
      </motion.div>
    </section>
  );
}