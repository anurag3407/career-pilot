import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { fadeUp, staggerContainer, SocialLink } from './shared';

const Hero = ({ personal, stats, socials }) => (
  <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-12 pt-20">
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.15]">
      <motion.div
        animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
        }}
      />
    </div>

    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="pointer-events-none absolute left-1/4 top-1/4 z-0 h-[40vw] w-[40vw] rounded-full bg-cyan-500/10 blur-[120px]"
    />

    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="z-10 relative">
      <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
        <span className="h-px w-12 bg-cyan-400" />
        <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest">System Online // Welcome</span>
      </motion.div>

      <motion.h1 variants={fadeUp} className="mb-4 text-6xl font-black leading-tight tracking-tighter md:text-8xl">
        {personal.name.split(' ').map((word, index) => (
          <span key={index} className="block w-fit pb-2">
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', delay: index * 0.3 }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #ffffff 40%, #22d3ee 50%, #ffffff 60%, #ffffff 100%)',
                backgroundSize: '200% auto',
              }}
              className="block bg-clip-text text-transparent"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p variants={fadeUp} className="mb-12 max-w-2xl border-l-2 border-cyan-500/30 bg-gradient-to-r from-black via-black to-transparent pl-6 text-xl font-light text-gray-400 md:text-2xl">
        {personal.title} based in {personal.location}.
      </motion.p>

      <motion.div variants={fadeUp} className="mb-16 flex flex-wrap gap-8 md:gap-16">
        {[
          { label: 'Years Exp.', value: stats.yearsExperience },
          { label: 'Projects', value: stats.projectsCompleted },
          { label: 'Clients', value: stats.happyClients },
        ].map((stat, index) => (
          <div key={index} className="group relative flex flex-col">
            <span className="mb-1 text-4xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
              {stat.value}<span className="text-cyan-400 transition-colors duration-300 group-hover:text-white">+</span>
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-500">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="flex gap-6">
        {socials.github && <SocialLink href={socials.github} icon={<Github />} ariaLabel="GitHub" />}
        {socials.linkedin && <SocialLink href={socials.linkedin} icon={<Linkedin />} ariaLabel="LinkedIn" />}
        {socials.twitter && <SocialLink href={socials.twitter} icon={<Twitter />} ariaLabel="Twitter" />}
        {socials.email && <SocialLink href={`mailto:${socials.email}`} icon={<Mail />} ariaLabel="Email" />}
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;