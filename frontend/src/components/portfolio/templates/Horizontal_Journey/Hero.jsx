import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

export default function Hero() {
  return (
    <SectionWrapper title="Intro">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '100px' }}
        className="flex w-full flex-col gap-2 lg:gap-6"
      >
        <div className="overflow-hidden">
          <motion.h2 variants={textReveal} className="text-sm font-light text-zinc-400 md:text-3xl">
            Hello, I'm {data.personal.name}
          </motion.h2>
        </div>
        <div className="overflow-hidden py-1">
          <motion.h1
            variants={textReveal}
            className="text-4xl font-black leading-[0.9] tracking-tighter text-zinc-100 md:text-[6rem] lg:text-[9rem]"
          >
            {data.personal.title.split(' ')[0]} <br />
            <span className="text-zinc-600">{data.personal.title.split(' ').slice(1).join(' ')}</span>
          </motion.h1>
        </div>
        <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-3 lg:mt-8 md:flex-row lg:items-center">
          <div className="h-1 w-8 shrink-0 bg-zinc-100 lg:w-24" />
          <p className="max-w-md text-xs leading-snug text-zinc-400 lg:text-lg">
            Swipe down to move forward through my journey, projects, and experience.
          </p>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
