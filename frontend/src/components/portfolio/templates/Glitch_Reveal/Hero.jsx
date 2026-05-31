import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Terminal } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, scanline } from './shared';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center px-6 md:px-12 max-w-6xl mx-auto overflow-hidden">
      {/* The scanline gives the hero a moving CRT-style signal sweep. */}
      <motion.div
        variants={scanline}
        initial="hidden"
        animate="visible"
        className="absolute left-0 right-0 h-[2px] bg-cyan-500/20 shadow-[0_0_10px_#00ffff] z-50 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full"
      >
        {/* Status label that establishes the terminal/cyberpunk tone. */}
        <div className="flex items-center gap-4 mb-8 vibrate-hover cursor-crosshair w-fit">
          <Terminal className="text-cyan-400 w-6 h-6 animate-pulse" />
          <span className="text-cyan-400 font-mono tracking-widest text-sm uppercase">System.Init()</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-tight break-words">
          <GlitchText text={data.personal.name} as="span" />
        </h1>

        <h2 className="text-2xl md:text-4xl text-zinc-400 mb-12 font-mono border-l-4 border-fuchsia-500 pl-4 vibrate-hover cursor-crosshair w-fit">
          {data.personal.title}
        </h2>

        {/* Social links are rendered conditionally so missing URLs stay hidden. */}
        <div className="flex flex-wrap gap-8">
          {data.socials.github && (
            <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:text-cyan-400 transition-colors group">
              <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm hidden sm:block">GitHub</span>
            </a>
          )}
          {data.socials.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-fuchsia-500 hover:text-fuchsia-500 transition-colors group">
              <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm hidden sm:block">LinkedIn</span>
            </a>
          )}
          {data.socials.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:text-cyan-400 transition-colors group">
              <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm hidden sm:block">Twitter</span>
            </a>
          )}
        </div>
      </motion.div>

      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
