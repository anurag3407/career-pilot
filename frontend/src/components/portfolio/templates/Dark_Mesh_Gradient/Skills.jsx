import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, Cpu, Palette, Code2 } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Skills() {
  const { skills } = data;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return Layout;
      case 'backend':
        return Server;
      case 'devops':
        return Cpu;
      case 'design':
        return Palette;
      default:
        return Code2;
    }
  };

  const getCategoryGlow = (category) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return 'group-hover:border-purple-500/40 group-hover:shadow-purple-500/5';
      case 'backend':
        return 'group-hover:border-blue-500/40 group-hover:shadow-blue-500/5';
      case 'devops':
        return 'group-hover:border-pink-500/40 group-hover:shadow-pink-500/5';
      case 'design':
        return 'group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/5';
      default:
        return 'group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/5';
    }
  };

  const getProgressColor = (category) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      case 'backend':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'devops':
        return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case 'design':
        return 'bg-gradient-to-r from-cyan-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="skills" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          My{' '}
          <span className="bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
            Skills
          </span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {Object.entries(groupedSkills).map(([category, items], idx) => {
          const IconComponent = getCategoryIcon(category);
          const glowClass = getCategoryGlow(category);
          const progressColor = getProgressColor(category);

          return (
            <motion.div
              key={category}
              variants={cardVariants}
              className={`group p-8 rounded-3xl bg-gray-900/30 border border-white/5 backdrop-blur-md transition-all duration-500 hover:bg-gray-900/50 hover:shadow-2xl ${glowClass}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-purple-400 transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {category}
                </h3>
              </div>

              <div className="space-y-6">
                {items.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-gray-400">{skill.level}%</span>
                    </div>

                    <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.05 }}
                        className={`h-full rounded-full ${progressColor}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
