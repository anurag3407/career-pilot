import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Layout } from 'lucide-react';

const Skills = ({ data }) => {
  const { skills } = data;

  const getIcon = (category) => {
    if (category?.toLowerCase().includes('front')) return <Layout className="w-5 h-5 text-purple-600" />;
    if (category?.toLowerCase().includes('back')) return <Database className="w-5 h-5 text-purple-600" />;
    return <Code className="w-5 h-5 text-purple-600" />;
  };

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full mb-4">
          <span className="text-purple-300 font-semibold">♣️ SKILLS DECK ♣️</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">My Card Suits</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">{getIcon(skill.category)}<h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3></div>
              <span className="text-sm font-medium text-purple-600">{skill.level}%</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1 }}
                className="absolute h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full" style={{ width: `${skill.level}%` }} />
            </div>
            {skill.category && <div className="mt-2 text-xs text-gray-500">{skill.category}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;