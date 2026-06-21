import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { AnimatedHeading, GlassCard } from './Shared';
import data from '../../../../data/dummy_data.json';

const Experience = () => (
  <section className="py-24 relative z-10 px-6 max-w-4xl mx-auto">
    <AnimatedHeading>Experience</AnimatedHeading>
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
      {data.experience.map((exp, i) => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <motion.div 
            className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-cyan-400 text-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-20"
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase size={16} />
          </motion.div>
          <GlassCard className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] !p-6">
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">{exp.period}</span>
              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              <h4 className="text-lg text-purple-300">{exp.company}</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
          </GlassCard>
        </div>
      ))}
    </div>
  </section>
);

export default Experience;