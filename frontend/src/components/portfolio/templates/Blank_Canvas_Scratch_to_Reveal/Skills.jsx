import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { Cpu, Layout, Server, Pocket, Wrench } from 'lucide-react';

export default function Skills() {
  const { skills } = usePortfolio();

  // Extract categories dynamically
  const categories = [...new Set(skills.map((s) => s.category || 'Other'))];

  // Helper to assign icons based on category
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Layout className="w-5 h-5 text-slate-300" />;
      case 'backend':
        return <Server className="w-5 h-5 text-slate-300" />;
      case 'devops':
      case 'tools':
        return <Wrench className="w-5 h-5 text-slate-300" />;
      case 'design':
      case 'ui/ux':
        return <Pocket className="w-5 h-5 text-slate-300" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-300" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="skills"
      className="relative py-28 md:py-36 px-6 border-b border-slate-900/60 overflow-hidden"
    >
      {/* Background visual detail */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-white/[0.01] rounded-full blur-[90px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">[[ 02 // Capability ]]</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-outfit text-white mb-6"
          >
            Skills & Expertise
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto font-light"
          >
            The tools, technologies, and practices used to turn blank canvases into finished digital masterpieces.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-14"
        >
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            return (
              <motion.div
                key={category}
                variants={categoryVariants}
                className="space-y-6"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-slate-900/80 pb-3">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-semibold font-outfit tracking-wide text-white capitalize">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-slate-900/40 ml-4" />
                </div>

                {/* Category Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill.name}
                      variants={cardVariants}
                      whileHover={{
                        y: -8,
                        boxShadow: '0 12px 24px -10px rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.15)'
                      }}
                      className="relative p-5 bg-[#05050c]/80 border border-slate-900 rounded-xl transition-all duration-300 group overflow-hidden"
                    >
                      {/* Gradient border corner shine */}
                      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-xs font-mono text-slate-500 group-hover:text-white transition-colors">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Technical visualizer line */}
                      <div className="relative h-1 bg-slate-950 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-slate-700 to-white rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
