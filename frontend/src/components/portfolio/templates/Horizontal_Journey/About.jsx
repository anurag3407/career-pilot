import React, { useState } from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

export default function About({ isMobile = false }) {
  const [active, setActive] = useState(false);

  return (
    <SectionWrapper title="About" isMobile={isMobile}>
      <div className="flex w-full flex-col items-center gap-6 lg:grid lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onTouchStart={() => setActive(true)}
          onTouchEnd={() => setActive(false)}
          onTouchCancel={() => setActive(false)}
          className="relative mx-auto aspect-square w-1/2 overflow-hidden bg-zinc-900 lg:w-full lg:max-w-none"
        >
          <img
            src={data.personal.avatar}
            alt={data.personal.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-700 ${active ? 'grayscale-0 saturate-150 contrast-110' : 'grayscale'}`}
          />
          <div className="pointer-events-none absolute inset-0 border border-zinc-100/10" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-3 text-center lg:gap-8 lg:text-left"
        >
          <div className="overflow-hidden">
            <motion.h3 variants={textReveal} className="text-3xl font-black tracking-tight text-zinc-100 lg:text-6xl">
              The Story.
            </motion.h3>
          </div>
          <motion.p variants={fadeUp} className="text-xs leading-relaxed text-zinc-400 lg:text-xl">
            {data.personal.bio}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-2 flex justify-center gap-6 border-t border-zinc-800 pt-4 lg:justify-start lg:gap-12 lg:pt-6">
            <div>
              <div className="text-2xl font-black text-zinc-100 lg:text-5xl">{data.stats.yearsExperience}+</div>
              <div className="mt-1 font-mono text-[9px] uppercase text-zinc-500 lg:text-sm">Years Exp.</div>
            </div>
            <div>
              <div className="text-2xl font-black text-zinc-100 lg:text-5xl">{data.stats.projectsCompleted}+</div>
              <div className="mt-1 font-mono text-[9px] uppercase text-zinc-500 lg:text-sm">Projects</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
