import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

export default function Skills() {
  const categories = [...new Set(data.skills.map((s) => s.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredSkills = data.skills.filter((s) => s.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const skillVariants = {
    enter: { opacity: 0, x: -20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-900">
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
              Skills
            </span>
            <span className="text-gray-600 ml-4">/</span>
          </h2>
        </motion.div>

        {/* Category filter */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={skillVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="group"
              >
                {/* Skill name and level */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                    {skill.name}
                  </span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-sm font-mono text-cyan-400"
                  >
                    {skill.level}%
                  </motion.span>
                </div>

                {/* Skill bar with gradient */}
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50 group-hover:border-cyan-400/50 transition-colors">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-cyan-400/50"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Skill count */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-12 border-t border-gray-700/30"
        >
          <p className="text-gray-400 text-center">
            Expertise in <span className="text-cyan-400 font-semibold">{data.skills.length}</span> technologies
            across{' '}
            <span className="text-purple-400 font-semibold">{categories.length}</span> domains
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
