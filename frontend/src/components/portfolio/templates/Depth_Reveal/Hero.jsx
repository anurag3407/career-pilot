import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const Hero = ({ data, socials }) => (
  <section className="relative min-h-[72svh] sm:min-h-[80svh] md:min-h-[100svh] flex flex-col items-center justify-center text-center px-5 py-6 md:p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden">
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, -22, 0], x: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[10%] top-[18%] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 26, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[12%] bottom-[18%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
      />
    </motion.div>

    <motion.img
      src={data.avatar}
      alt={data.name}
      initial={{ opacity: 0, y: 40, scale: 0.7, rotateX: 20, rotateZ: -6 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      className="relative z-10 w-24 h-24 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-[2rem] mb-5 md:mb-8 object-cover border border-cyan-400/40 shadow-[0_0_80px_rgba(34,211,238,0.15)]"
    />
    <motion.h1
      initial={{ opacity: 0, y: 28, rotateX: 24 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 text-4xl sm:text-6xl md:text-8xl font-black mb-2 md:mb-6 tracking-tight leading-tight px-2"
      style={{ transformPerspective: 1000 }}
    >
      {data.name}
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.22, ease: 'easeOut' }}
      className="relative z-10 text-sm sm:text-xl md:text-2xl text-cyan-300 mb-4 md:mb-8 font-light px-2"
    >
      {data.title}
    </motion.p>
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } }}
      className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
    >
      {socials.github && (
        <motion.a
          href={socials.github}
          aria-label="GitHub profile"
          variants={{ hidden: { opacity: 0, y: 16, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
          whileHover={{ y: -4, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="text-slate-400 hover:text-white transition"
        >
          <Github size={28} />
        </motion.a>
      )}
      {socials.linkedin && (
        <motion.a
          href={socials.linkedin}
          aria-label="LinkedIn profile"
          variants={{ hidden: { opacity: 0, y: 16, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
          whileHover={{ y: -4, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="text-slate-400 hover:text-white transition"
        >
          <Linkedin size={28} />
        </motion.a>
      )}
      {socials.email && (
        <motion.a
          href={`mailto:${socials.email}`}
          aria-label="Email"
          variants={{ hidden: { opacity: 0, y: 16, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
          whileHover={{ y: -4, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="text-slate-400 hover:text-white transition"
        >
          <Mail size={28} />
        </motion.a>
      )}
    </motion.div>
  </section>
);

export default Hero;
