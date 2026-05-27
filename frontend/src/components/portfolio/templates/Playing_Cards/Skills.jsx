// Skills section component
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Layout } from 'lucide-react';

const Skills = ({ data }) => {
  const { skills } = data;

  const getIcon = (category) => {
    if (category?.toLowerCase().includes('front')) return <Layout className="w-5 h-5" />;
    if (category?.toLowerCase().includes('back')) return <Database className="w-5 h-5" />;
    return <Code className="w-5 h-5" />;
  };

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-amber-800/20 rounded-full mb-4">
          <span className="text-amber-900 font-semibold">♣️ SKILLS DECK ♣️</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4">My Card Suits</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/95 rounded-xl p-6 border border-amber-700/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">{getIcon(skill.category)}<h3 className="text-lg font-semibold text-amber-900">{skill.name}</h3></div>
              <span className="text-sm font-medium text-amber-700">{skill.level}%</span>
            </div>
            <div className="relative h-3 bg-amber-200 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1 }}
                className="absolute h-full bg-gradient-to-r from-amber-600 to-amber-800 rounded-full" style={{ width: `${skill.level}%` }} />
            </div>
            {skill.category && <div className="mt-2 text-xs text-amber-600">{skill.category}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;