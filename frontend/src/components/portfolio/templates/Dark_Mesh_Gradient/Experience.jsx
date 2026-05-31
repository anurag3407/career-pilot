import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Experience() {
  const { experience } = data;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="experience" className="py-24 px-4 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          {experience.heading.split(' ')[0]}{' '}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {experience.heading.split(' ')[1]}
          </span>
        </h2>

        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full" />
      </div>

      <div className="relative border-l-2 border-dashed border-gray-800 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 transform -translate-x-[1px]" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          {experience.items.map((exp, index) => (
            <motion.div key={index} variants={itemVariants} className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-1.5 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-950 border-2 border-purple-500 text-purple-400 group-hover:text-white group-hover:bg-purple-600 group-hover:scale-110 shadow-lg shadow-purple-500/20 transition-all duration-300">
                <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-gray-900/30 border border-white/5 backdrop-blur-md hover:border-purple-500/30 hover:bg-gray-900/50 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-purple-300 font-semibold mt-1">
                      {exp.company}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm font-medium w-fit">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    {exp.period}
                  </div>
                </div>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
