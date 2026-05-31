import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import LavaAnimate from '../LavaAnimate';
import SectionHeader from './SectionHeader';

export default function Experience({ experience }) {
  return (
    <section className="py-24 w-full relative z-10">
      <LavaAnimate className="flex! w-full flex-col" particleCount={70} formedDelay={1800} meltAmount={3}>
        <div className="w-full">
          <SectionHeader title="Experience" />
          
          {/* Added mt-12 to pull content down from the header */}
          <div className="relative border-l border-stone-800 ml-4 md:ml-6 space-y-12 w-full mt-12">
            {experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.6, ease: [0.075, 0.82, 0.165, 1], delay: idx * 0.15 }}
                className="relative pl-8 md:pl-12 group"
              >
                <div className="absolute w-4 h-4 bg-stone-950 border-2 border-orange-500 rounded-full -left-[9px] top-2 shadow-[0_0_10px_rgba(249,115,22,0.6)] group-hover:bg-orange-500 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(249,115,22,1)] transition-all duration-300" />

                <div className="bg-stone-900/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-stone-800 group-hover:border-orange-500/60 group-hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)] group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                      <div className="flex items-center gap-2 text-orange-500 font-medium mt-1">
                        <Briefcase size={16} /> {exp.company}
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-stone-950 text-stone-300 text-sm rounded-full border border-stone-800 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-stone-400 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </LavaAnimate>
    </section>
  );
}