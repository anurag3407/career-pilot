import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto">
      <motion.h3 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-10 text-center text-orange-200"
      >
        Skills & Expertise
      </motion.h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-stone-800/60 border border-orange-900/40 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-orange-900/20 transition-colors group"
          >
            <span className="text-stone-200 font-medium group-hover:text-orange-300 transition-colors">
              {skill.name}
            </span>
            {skill.level && (
              <div className="w-full bg-stone-900 h-1.5 mt-3 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-600 h-full rounded-full" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
