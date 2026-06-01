import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import TileSnappingText from './TileSnappingText';

const Hero = ({ data = {}, socials = {} }) => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const socialLinks = [
    { key: 'github', href: socials.github, label: 'GitHub profile', icon: Github },
    { key: 'linkedin', href: socials.linkedin, label: 'LinkedIn profile', icon: Linkedin },
    { key: 'twitter', href: socials.twitter, label: 'Twitter profile', icon: Twitter },
    { key: 'email', href: socials.email ? `mailto:${socials.email}` : null, label: 'Email', icon: Mail },
  ].filter((s) => s.href);

  return (
    <header className="min-h-screen w-full flex items-center justify-center relative px-6 md:px-16 overflow-hidden z-10 bg-[#03050c]">
      {/* Premium ambient backdrop lighting beams */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      
      {/* Architectural line overlay matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="max-w-7xl w-full mx-auto relative z-20 pt-16">
        {/* Centered layout alignment matrix */}
        <div className="max-w-4xl flex flex-col items-center text-center mx-auto w-full overflow-visible">
          
          {/* Status bar node details */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">System Active // Fragmented Tile Assembly</span>
          </motion.div>

          {/* 1. Name Heading */}
          <div className="mb-6 w-full overflow-visible flex justify-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
              <TileSnappingText 
                text={data.name || "Shakti Shrey"} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
                baseDelay={0.1}
              />
            </h1>
          </div>

          {/* 2. Subtitle Description */}
          <div className="mb-12 w-full overflow-visible flex justify-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight">
              <TileSnappingText 
                text={data.title || "Full Stack Developer"} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400"
                baseDelay={0.4} 
              />
            </p>
          </div>

          {/* Call to Actions Interaction Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 items-center mb-12"
          >
            <a 
              href="#projects" 
              className="group relative flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-lg overflow-hidden transition-transform duration-300 active:scale-95"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
              Explore Creation Matrix
              <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-300" />
            </a>
          </motion.div>

          {/* Connectivity Social Matrix Panel */}
          <div className="flex items-center justify-center gap-3 border-t border-slate-900 pt-8 w-full max-w-md mx-auto">
            <span className="text-xs font-mono tracking-wider text-slate-500 uppercase mr-2">Index Connectors:</span>
            {socialLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.key}
                  href={link.href}
                  aria-label={link.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 1.0 + idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="p-3 bg-slate-950 text-slate-400 border border-slate-900 rounded-lg hover:bg-slate-900 hover:text-cyan-400 hover:border-slate-800 transition-all duration-300 shadow-inner"
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Hero;