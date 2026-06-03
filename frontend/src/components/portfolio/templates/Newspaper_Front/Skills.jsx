import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Skills({ data }) {
  const skillsByCategory = useMemo(() => {
    const categories = {};
    data.skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    return categories;
  }, [data.skills]);

  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      variants={fadeInUp} 
      className="bg-stone-800 border-2 border-yellow-600 p-4 md:p-6"
    >
      <h4 className="text-lg font-black text-yellow-600 mb-4 tracking-widest uppercase border-b-2 border-yellow-600 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
        CLASSIFIED: SKILLS
      </h4>
      <div className="space-y-4">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category}>
            <p className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, idx) => {
                const level = Math.max(0, Math.min(100, Number(skill.level) || 0));
                return (
                  <div key={idx} className="flex-1 min-w-[45%]">
                    <div className="bg-stone-900 p-2 border border-yellow-600/30">
                      <p className="text-xs font-bold text-gray-300 mb-1">{skill.name}</p>
                      <div 
                        className="w-full bg-stone-700 rounded h-1.5"
                        role="progressbar"
                        aria-label={`${skill.name} proficiency`}
                        aria-valuenow={level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div 
                          className="bg-yellow-600 h-1.5 rounded transition-all duration-500"
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
