import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl w-full"
      >
        {/* Section title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Experience
            </span>
            <span className="text-gray-600 ml-4">/</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 transform md:-translate-x-1/2"></div>

          {/* Experience items */}
          <div className="space-y-12 relative">
            {data.experience.map((exp, index) => (
              <motion.div
                key={exp.company}
                variants={itemVariants}
                className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
              >
                {/* Timeline dot */}
                <motion.div
                  className="hidden md:flex w-1/2 justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="relative w-12 h-12 bg-gray-950 rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-400/50">
                    <Briefcase size={20} className="text-cyan-400" />
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                  whileHover={{ x: index % 2 === 0 ? -10 : 10 }}
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 rounded-xl p-6 transition-all">
                    {/* Period badge */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-block px-3 py-1 bg-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-full mb-3"
                    >
                      {exp.period}
                    </motion.div>

                    {/* Role and company */}
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">{exp.role}</h3>
                    <p className="text-lg text-purple-400 font-semibold mb-4">{exp.company}</p>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {exp.description}
                    </p>

                    {/* Animated accent */}
                    <motion.div
                      animate={{ scaleX: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mt-4 rounded-full origin-left"
                    ></motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience summary */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-12 border-t border-gray-700/30 text-center"
        >
          <p className="text-gray-400">
            <span className="text-purple-400 font-semibold text-xl">{data.experience.length}</span>{' '}
            <span>Years of Professional Growth</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
