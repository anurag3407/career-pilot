import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

export default function About() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-4xl w-full"
      >
        {/* Section title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              About
            </span>
            <span className="text-gray-600 ml-4">/</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Avatar and stats */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-8">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-lg"
            >
              <img
                src={data.personal.avatar}
                alt={data.personal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20"></div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 w-full text-center">
              {[
                { value: data.stats.yearsExperience, label: 'Years' },
                { value: data.stats.projectsCompleted, label: 'Projects' },
                { value: data.stats.happyClients, label: 'Clients' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:border-cyan-400/50 transition-colors"
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}+
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Bio */}
          <motion.div variants={itemVariants} className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              {data.personal.bio}
            </p>

            {/* Location badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-full text-gray-300 hover:border-cyan-400/50 transition-colors"
            >
              📍 {data.personal.location}
            </motion.div>

            {/* Animated list of characteristics */}
            <div className="space-y-3 mt-8 pt-8 border-t border-gray-700/30">
              {[
                'Passionate about clean code & elegant solutions',
                'Obsessed with user experience & performance',
                'Open source contributor',
                'Always learning new technologies',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-gray-400"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="text-cyan-400 text-lg"
                  >
                    ✦
                  </motion.span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
