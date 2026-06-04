import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { fadeUp, drawLine, SectionHeading } from './shared';

const Experience = ({ experience }) => (
  <section className="relative py-24">
    <SectionHeading title="Log" icon={Briefcase} />
    <div className="relative pl-8 md:pl-0">
      <motion.div
        variants={drawLine}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="absolute left-[15px] top-0 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-cyan-900 to-transparent md:left-1/2"
      />

      <div className="space-y-16">
        {experience.map((exp, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className={`relative flex w-full flex-col items-start md:flex-row md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <motion.div
              whileHover={{ scale: 1.5, backgroundColor: '#22d3ee', boxShadow: '0 0 15px #22d3ee' }}
              className="absolute left-[-29px] z-10 mt-1.5 h-4 w-4 cursor-pointer rounded-full border-2 border-cyan-400 bg-black transition-colors duration-300 md:left-1/2 md:-translate-x-1/2"
            />

            <div className={`md:w-[45%] ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
              <div className="group border border-gray-800 bg-black/50 p-6 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-950/10">
                <span className="mb-2 block font-mono text-sm tracking-widest text-cyan-400">{exp.period}</span>
                <h4 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-cyan-300">{exp.role}</h4>
                <h5 className="mb-4 text-md text-gray-500">{exp.company}</h5>
                <p className="text-sm leading-relaxed text-gray-400 font-light md:text-base">{exp.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;