import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Hero = ({ personal, socials }) => {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ 
          borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
          y: [0, -15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 h-48 w-48 overflow-hidden border-2 border-blue-500/30 bg-blue-500/10 p-2 backdrop-blur-md"
      >
        <img src={personal.avatar} alt={personal.name} className="h-full w-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-5xl font-extrabold tracking-tight text-white md:text-7xl"
      >
        {personal.name}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 max-w-2xl text-lg text-zinc-400"
      >
        {personal.title} <br/> {personal.bio}
      </motion.p>

      <div className="flex gap-4">
        {[
          { icon: Github, url: socials.github, label: "GitHub" },
          { icon: Linkedin, url: socials.linkedin, label: "LinkedIn" },
          { icon: Twitter, url: socials.twitter, label: "Twitter" },
          { icon: Mail, url: socials.email ? `mailto:${socials.email}` : '', label: "Email" }
        ]
        .filter(item => item.url)
        .map((item, i) => (
          <motion.a
            key={i}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            whileHover={{ scale: 1.2, rotate: 5, color: '#60a5fa' }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full bg-zinc-900/50 p-4 text-zinc-400 border border-zinc-800 backdrop-blur-sm transition-colors hover:border-blue-500/50 hover:bg-blue-500/10"
          >
            <item.icon size={20} />
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Hero;