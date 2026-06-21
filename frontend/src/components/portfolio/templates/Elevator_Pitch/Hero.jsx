// frontend/src/components/portfolio/templates/Elevator_Pitch/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export const Hero = ({ personal, socials }) => {
  return (
    <motion.div 
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
      className="flex flex-col items-center text-center space-y-8 mt-16"
    >
      <div className="relative inline-block group">
        {/* Spinning Elevator Pulley Effect Behind Avatar */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-dashed border-zinc-700 rounded-full opacity-50 group-hover:border-emerald-500/50 transition-colors"
        />
        <img 
          src={personal.avatar} 
          alt={personal.name || "Profile Avatar"} 
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-800 object-cover shadow-2xl relative z-10 filter grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"
        />
      </div>
      
      <div className="space-y-4 px-4 relative">
        {/* LED Matrix Subtitle */}
        <div className="overflow-hidden h-6 w-full flex justify-center mb-2">
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-emerald-500 font-mono text-xs md:text-sm font-bold tracking-widest whitespace-nowrap"
          >
            SYS.ONLINE // ELEVATOR PITCH ACTIVATED // GOING DOWN //
          </motion.div>
        </div>

        {/* Flickering + Light Sweep Main Text */}
        <motion.h1 
          animate={{ 
            backgroundPosition: ["0% -150%", "0% 250%"],
            opacity: [1, 0.9, 1, 0.85, 1, 0.95, 1] // Fluorescent flicker
          }}
          transition={{ 
            backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3, repeat: Infinity, ease: "anticipate" }
          }}
          style={{ 
            backgroundSize: "100% 200%",
            willChange: "background-position, opacity" 
          }}
          className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 via-white to-zinc-700 tracking-tighter"
        >
          {personal.name}
        </motion.h1>
        
        <p className="text-lg md:text-2xl text-zinc-400 font-mono">
          {personal.title} <span className="text-emerald-500 animate-pulse font-bold">|</span> {personal.location}
        </p>
      </div>

      <div className="flex gap-4 md:gap-6 pt-4 md:pt-8">
        {socials.github && <MagneticButton href={socials.github}><Github size={20} /></MagneticButton>}
        {socials.linkedin && <MagneticButton href={socials.linkedin}><Linkedin size={20} /></MagneticButton>}
        {socials.twitter && <MagneticButton href={socials.twitter}><Twitter size={20} /></MagneticButton>}
      </div>
    </motion.div>
  );
};