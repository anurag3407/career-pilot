import React from 'react';

import { motion } from 'framer-motion';
import { 
  Sparkles
} from 'lucide-react';

const Skills = ({data}) => {
  const { skills } = data;
  
  const categories = [...new Set(skills?.map(s => s.category) || [])];
  
  return (
    <section id="skills" className="py-20 md:py-28 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            <Sparkles className="w-5 h-5 text-amber-600" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-4 font-serif tracking-tight">
            Mastery & Techniques
          </h2>
          <p className="text-lg text-amber-700 font-serif italic">Professional Skills Gallery</p>
        </motion.div>
        
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.15 }}
            className="mb-16 last:mb-0"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent to-amber-400" />
              <h3 className="text-2xl md:text-3xl font-bold text-amber-800 font-serif">{category}</h3>
              <div className="flex-1 h-1 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {skills
                ?.filter(s => s.category === category)
                .map((skill, index) => {
                  const safeLevel = Math.max(0, Math.min(100, Number(skill.level) || 0));

                  return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIndex * 0.15 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-white border-2 border-amber-600 rounded-xl p-6 shadow-md hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-800 font-serif text-lg group-hover:text-amber-700 transition-colors">{skill.name}</span>
                      <motion.span 
                        className="text-amber-600 font-bold text-lg"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIndex * 0.15 + index * 0.05 + 0.3 }}
                      >
                        {safeLevel}%
                      </motion.span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-amber-100 to-amber-200 rounded-full h-4 shadow-inner overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${safeLevel}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: catIndex * 0.15 + index * 0.05 }}
                        className="bg-gradient-to-r from-amber-500 to-amber-700 h-4 rounded-full shadow-lg relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>
)})}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


export default Skills;