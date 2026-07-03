import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

export default function Skills({ isMobile = false }) {
  return (
    <SectionWrapper title="Skills" isMobile={isMobile}>
      <div className="flex w-full flex-col gap-6 lg:gap-16">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-black leading-none tracking-tighter text-zinc-100 md:text-7xl"
        >
          Core <br className="hidden md:block" /><span className="text-zinc-600">Competencies.</span>
        </motion.h3>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 lg:gap-4"
        >
          {data.skills.map((skill, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={isMobile ? {} : { y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="group cursor-default overflow-hidden border border-zinc-800 bg-zinc-950/80 px-2.5 py-1.5 font-mono text-[10px] text-zinc-300 transition-all duration-300 hover:border-zinc-100/30 hover:bg-zinc-900/90 hover:text-zinc-100 md:text-base lg:px-6 lg:py-4"
            >
              <span className="relative z-10">{skill.name} <span className="ml-1 opacity-40 transition-opacity duration-300 group-hover:opacity-80 lg:ml-2">/// {skill.level}</span></span>
              <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-zinc-100/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
