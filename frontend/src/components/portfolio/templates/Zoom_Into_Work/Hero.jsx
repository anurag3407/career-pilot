import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ChevronDown } from 'lucide-react';
import { AmbientBackground } from './Shared';
import data from '../../../../data/dummy_data.json';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 text-zinc-50">
      <AmbientBackground />
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="relative mb-10 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 rounded-full border border-zinc-800/80 border-t-cyan-500/80 border-b-indigo-500/80"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 rounded-full border border-zinc-800/80 border-r-rose-500/50 border-l-cyan-500/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative group z-10"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full blur-md opacity-40 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src={data.personal.avatar} 
              alt={data.personal.name || "Profile Avatar"}
              className="relative w-36 h-36 md:w-48 md:h-48 object-cover rounded-full border-2 border-zinc-900 bg-zinc-900"
            />
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4"
        >
          {data.personal.name}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500 font-light mb-8 max-w-2xl"
        >
          {data.personal.title}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-6 items-center"
        >
          {data.socials.github && (
            <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white hover:scale-110 transition-all">
              <Github size={28} />
            </a>
          )}
          {data.socials.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-blue-400 hover:scale-110 transition-all">
              <Linkedin size={28} />
            </a>
          )}
          {data.socials.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-cyan-400 hover:scale-110 transition-all">
              <Twitter size={28} />
            </a>
          )}
          {data.socials.email && (
            <a href={`mailto:${data.socials.email}`} className="text-zinc-500 hover:text-rose-400 hover:scale-110 transition-all">
              <Mail size={28} />
            </a>
          )}
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 flex flex-col items-center text-zinc-500"
        >
          <span className="text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Scroll to explore</span>
          <ChevronDown size={24} />
        </motion.div>
      </div>
    </section>
  );
}
