import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

function ExperienceItem({ exp, isMobile }) {
  const Item = isMobile ? 'div' : motion.div;

  return (
    <Item {...(isMobile ? {} : { variants: fadeUp, whileHover: { x: 6 } })} className="group relative cursor-pointer pb-8 pl-8 transition-all duration-300 lg:pb-10 lg:pl-12">
      <div className="absolute left-[7px] top-2 h-3 w-3 rounded-full border-2 border-zinc-100 bg-zinc-950 transition-all duration-300 group-hover:scale-125 group-hover:bg-zinc-100 lg:left-[11px] lg:top-3 lg:h-4 lg:w-4" />
      <div className="absolute left-0 top-0 h-full w-px bg-zinc-800 transition-colors duration-300 group-hover:bg-zinc-500" />
      <div className="mb-2 font-mono text-[10px] text-zinc-500 lg:mb-3 lg:text-sm">{exp.period}</div>
      <h4 className="mb-1 text-2xl font-black leading-none tracking-tight text-zinc-100 lg:mb-2 lg:text-5xl">
        {exp.role}
      </h4>
      <h5 className="mb-3 text-sm font-light text-zinc-400 lg:mb-6 lg:text-3xl">
        {exp.company}
      </h5>
      <p className="max-w-3xl text-xs leading-relaxed text-zinc-500 lg:text-lg">
        {exp.description}
      </p>
    </Item>
  );
}

export default function ExperienceSection({ isMobile = false }) {
  const Container = isMobile ? 'div' : motion.div;
  const Heading = isMobile ? 'h3' : motion.h3;
  const Paragraph = isMobile ? 'p' : motion.p;

  return (
    <SectionWrapper title="Experience" scrollable>
      <Container {...(isMobile ? {} : { variants: staggerContainer, initial: 'hidden', whileInView: 'show', viewport: { once: true } })} className="mx-auto w-full max-w-5xl">
        <div className="mb-6 max-w-3xl lg:mb-10">
          <Heading {...(isMobile ? {} : { variants: textReveal })} className="text-3xl font-black leading-none tracking-tight text-zinc-100 md:text-6xl">
            Experience 
          </Heading>
          <Paragraph {...(isMobile ? {} : { variants: fadeUp })} className="mt-3 text-xs leading-relaxed text-zinc-400 lg:text-lg">
            Every role stays in a single joined track so the chronology reads continuously instead of splitting into separate pages.
          </Paragraph>
        </div>

        <div className="relative ml-3 border-l border-zinc-800 lg:ml-5">
          {data.experience.map((exp, index) => (
            <ExperienceItem key={`exp-${index}`} exp={exp} isMobile={isMobile} isLast={index === data.experience.length - 1} />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
